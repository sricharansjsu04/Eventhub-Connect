import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import pandas as pd
import pymysql
from sqlalchemy import create_engine
import itertools
import boto3
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()


app = FastAPI()

origins = ["*"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def recommend(user_id: int):
    try:
        # TODO implement
        # Specify the endpoint name of your SageMaker deployment
        aws_access_key_id = os.getenv('ACCESSKEYID')
        aws_secret_access_key = os.getenv('SECRETACCESSKEY')
        endpoint_name = "model-endpoint35"
        aws_region = 'us-east-2'
        print(f"AWS Access Key ID: {aws_access_key_id}")
        print(f"AWS Secret Access Key: {aws_secret_access_key}")
        # Data prep
        sports_list = {
            'Cricket': 22,
            'Football': 22,
            'Basketball': 10,
            'Tennis': 2,
            'Badminton': 2,
            'Squash': 2,
            'Volleyball': 12,
            'Pickleball': 4,
            'Softball': 18,
            'Baseball': 18
        }

        db_config = {
            'user': 'root',
            'password': 'e=mc2trooper',
            'host': 'database-1.c6sa5zn0zko5.us-east-2.rds.amazonaws.com',
            'database': 'PlaypalDB',
            'port': 3306,
            'charset': 'utf8mb4',
            'cursorclass': pymysql.cursors.DictCursor
        }

        # Use PyMySQL as the MySQL DBAPI
        engine = create_engine(
            f"mysql+pymysql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}", echo=False)

        # Query to fetch data from a table (replace 'your_table' with the actual table name)
        query = "SELECT * FROM sports;"
        # print(pd.read_sql_query(query, con=engine).head())
        # "select * from user_sports;"
        # "select * from  events;"

        query = "SELECT * FROM users;"
        users = pd.read_sql_query(query, con=engine)
        # print(users.head())

        query = "SELECT * FROM user_sports;"
        user_sports = pd.read_sql_query(query, con=engine)
        # print(user_sports.head())

        # Modify the SQL query
        # Modify the SQL query with explicit casting
        today_date = datetime.now().date()

        # Modify the SQL query
        # Modify the SQL query with explicit casting
        query = f"SELECT e.* FROM events as e INNER JOIN event_slots as es ON CAST(e.id AS CHAR) = CAST(es.event_id AS CHAR) WHERE DATE(es.date) >= '{today_date}';"

        # query = "SELECT * FROM events;"
        events = pd.read_sql_query(query, con=engine)
        # print(events.head())

        query = "SELECT * FROM event_users;"
        event_users = pd.read_sql_query(query, con=engine)
        # print(event_users.head())

        users = users.rename(columns={'id': 'user_id'})
        events = events.rename(columns={'id': 'event_id'})

        all_user_event_combinations = pd.DataFrame(list(itertools.product(
            users['user_id'], events['event_id'])), columns=['user_id', 'event_id'])

        # Merge with the existing event_users to get the 'status'
        all_user_event_combinations = pd.merge(all_user_event_combinations, event_users[['user_id', 'event_id', 'status']],
                                               on=['user_id', 'event_id'], how='left')

        # Fill NaN values with 'Not Attending'
        all_user_event_combinations['status'].fillna(
            'Not Attending', inplace=True)

        # Merge with the 'events' dataframe to get sports information
        all_user_event_combinations = pd.merge(all_user_event_combinations, events[['event_id', 'sport_id']],
                                               on='event_id', how='left')

        # Fill NaN values in the 'sport_id' column with a default value or handle as needed
        all_user_event_combinations['sport_id'].fillna(-1, inplace=True)

        # Display the result
        # print(all_user_event_combinations)

        # Convert categorical features to numerical using one-hot encoding
        all_user_event_combinations['sport_id'] = all_user_event_combinations['sport_id'].astype(
            'str')

        # Specify all possible sports categories
        all_sports_categories = ['1', '2', '3',
                                 '4', '5', '6', '7', '8', '9', '10']

        # Generate dummy columns for all possible sports
        features = pd.get_dummies(all_user_event_combinations[['user_id', 'event_id', 'sport_id']], columns=[
                                  'sport_id'], prefix='sport_id', prefix_sep='_', dummy_na=False)

        # Add dummy columns for missing sports categories
        for sport_category in all_sports_categories:
            if f'sport_id_{sport_category}' not in features.columns:
                # print(sport_category)
                features[f'sport_id_{sport_category}'] = 0
        # features = pd.get_dummies(all_user_event_combinations[['user_id', 'event_id', 'sport_id']], columns=['sport_id'])
        # labels = all_user_event_combinations['status']

        # End Data prep

        # Prepare input data for prediction
        user_events_to_predict = pd.DataFrame(list(itertools.product(
            [user_id], events['event_id'])), columns=['user_id', 'event_id'])

        # Merge with existing data
        user_events_to_predict = pd.merge(user_events_to_predict, events[['event_id', 'sport_id']],
                                          on='event_id', how='left')

        # Fill NaN values in the 'sport_id' column with a default value or handle as needed
        user_events_to_predict['sport_id'].fillna(-1, inplace=True)

        # Convert categorical features to numerical using one-hot encoding
        # user_events_to_predict['sport_id'] = user_events_to_predict['sport_id'].astype('str')
        # features_to_predict = pd.get_dummies(user_events_to_predict[['user_id', 'event_id', 'sport_id']], columns=['sport_id'])

        user_events_to_predict['sport_id'] = user_events_to_predict['sport_id'].astype(
            'str')

        # Specify all possible sports categories
        all_sports_categories = ['1', '2', '3',
                                 '4', '5', '6', '7', '8', '9', '10']

        # Generate dummy columns for all possible sports
        features_to_predict = pd.get_dummies(user_events_to_predict[['user_id', 'event_id', 'sport_id']], columns=[
                                             'sport_id'], prefix='sport_id', prefix_sep='_', dummy_na=False)

        # Add dummy columns for missing sports categories
        for sport_category in all_sports_categories:
            if f'sport_id_{sport_category}' not in features_to_predict.columns:
                # print(sport_category)
                features_to_predict[f'sport_id_{sport_category}'] = 0
        # features = pd.get_dummies(all_user_event_combinations[['user_id', 'event_id', 'sport_id']], columns=['sport_id'])
        # labels = user_events_to_predict['status']

        test_data_json = features_to_predict.values.tolist()
        # print(test_data_json)
        test_data_json_str = json.dumps(test_data_json)

        # Make predictions
        # # predictions = clf.predict(features_to_predict)
        sagemaker_runtime = boto3.client('sagemaker-runtime', region_name=aws_region,
                                         aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

        response = sagemaker_runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            Body=test_data_json_str.encode('utf-8'),
            ContentType='application/json',
        )

        # # Parse the predictions
        response_body = response['Body'].read().decode('utf-8')

        # Parse the JSON-formatted string
        predictions = json.loads(response_body)

        print("ikkada")
        # Check if there are no recommendations
        if not all(prediction in ['Attending', 'Done'] for prediction in predictions):
            user_interests = user_sports[user_sports['user_id']
                                         == user_id]['sport_id'].tolist()

            # Get default recommendations based on user's sport interests from events
            default_recommendations = events[events['sport_id'].isin(
                user_interests)]

            # print(default_recommendations.empty)
            if default_recommendations.empty:
                # If user_sports is also empty, return rows with current_pool_size close to pool_size
                sorted_events = events.assign(
                    abs_diff=(events['current_pool_size'] -
                              events['pool_size']).abs()
                ).sort_values('abs_diff')
                default_recommendations = sorted_events.head(
                    3)  # Adjust the number of rows as needed
            # print("outside")
            default_recommendations['created_at'] = default_recommendations['created_at'].astype(
                str)
            print(default_recommendations.head(3).fillna(
                'null').to_dict(orient='records'))
            return {
                'body': default_recommendations.head(3).fillna('null').to_dict(orient='records')
            }
        # print("nene")
        # Return recommendations
        recommendations = pd.DataFrame(
            {'event_id': user_events_to_predict['event_id'], 'prediction': predictions})

        recommendations['created_at'] = recommendations['created_at'].astype(
            str)
        return {
            'body': recommendations.head(3).fillna('null').to_dict(orient='records')
        }
    except Exception as e:
        return {
            'body': json.dumps('Error: {}'.format(str(e)))
        }


@app.get("/predict/{user_id}")
async def predict_endpoint(user_id: int):
    # Run the predict function asynchronously
    prediction_result = await recommend(user_id)
    print(prediction_result)
    # Return the prediction result in the response
    return JSONResponse(content=prediction_result, status_code=200)


@app.get("/health")
def health():

    return JSONResponse(content={}, status_code=200)