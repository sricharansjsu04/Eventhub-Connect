# PlayPal


## Prerequisites:

Before you begin, ensure you have the following prerequisites installed on your system:

1. **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

2. **Java Development Kit (JDK)**: You need to have JDK installed to run the Spring Boot backend. You can download it from [OpenJDK](https://openjdk.java.net/).

3. **Git**: Ensure you have Git installed on your machine to clone the repository. You can download it from [git-scm.com](https://git-scm.com/).

## Steps to Run the Project:

Follow these steps to run the project locally:

### 1. Clone the Repository:

```bash
git clone https://github.com/AshishVeda/PlayPal.git



###2. Backend (Spring Boot) Setup:

a. Open Terminal in the slotService directory:

cd PlayPal/slotService

b. Build and Run the Spring Boot Application:

./mvnw spring-boot:run


The backend server will start running on http://localhost:8080.


###3. Frontend (React + Node.js) Setup:

cd PlayPal/frontend

b. Install Frontend Dependencies:
npm install

c. Start the React Development Server:
npm start


The React frontend will start running on http://localhost:3000.


###4. User Creation (Node.js) Setup:

a. Open Terminal in the usercreation directory within the backend folder:
cd PlayPal/backend/usercreation

b. Install User Creation Dependencies:
npm install

c. Start the User Creation Server:
node server.js


###5. Event Creation (Node.js) Setup:
a. Open Terminal in the eventcreation directory within the backend folder:


cd PlayPal/backend/eventcreation
b. Install Event Creation Dependencies:

npm install
c. Start the Event Creation Server:

node app.js

Now, you should have the entire project up and running locally. You can access the frontend at http://localhost:3000 and make API requests to the backend at http://localhost:8080.

Make sure to update any configuration files or environment variables as needed for your specific project setup.










