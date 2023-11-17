const db = require("./dbConnect")



function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
      db.query(sql, values, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }


  function getPlayAreaCourts(venueId) {
    return new Promise((resolve, reject) => {
    const query = "SELECT pac.name FROM play_area_courts AS pac INNER JOIN play_areas AS pa ON pac.play_area_id=pa.id WHERE pac.play_area_id = ?;"
  
        db.query(query, [venueId], function (err, result1) {
            if (err) {
              reject(err);
            } else {
                
              
              const arr = result1.map(item => (item.name));
              
              resolve(arr);
            }
          });
    });
  }


  function getPlayAreaDocs(venueId,isS3Url) {
    return new Promise((resolve, reject) => {
    const query = isS3Url
        ? "SELECT pad.s3url FROM play_area_docs AS pad INNER JOIN play_areas AS pa ON pad.play_area_id=pa.id WHERE pad.play_area_id = ?;"
        : "SELECT s.name from sports as s inner join play_area_sports as ps on s.id=ps.sport_id inner join play_areas as p on ps.play_area_id=p.id where p.id=?;";
  
        db.query(query, [venueId], function (err, result1) {
            if (err) {
              reject(err);
            } else {
                
              
              const arr = result1.map(item => (isS3Url ? item.s3url : item.name));
              
              resolve(arr);
            }
          });
    });
  }

const getAllVenues = async (req, res) => {
    try {
        var result = '';
        if(req.body.location!='' && req.body.sportType!=''){
            result = await queryAsync("SELECT DISTINCT pa.* FROM play_areas as pa INNER JOIN play_area_sports as pas ON pa.id=pas.play_area_id INNER JOIN sports as s ON s.id=pas.sport_id WHERE city=? and s.name=?;",[req.body.location,req.body.sportType]);
        }else if(req.body.location!=''){
            result = await queryAsync("SELECT DISTINCT pa.* FROM play_areas as pa INNER JOIN play_area_sports as pas ON pa.id=pas.play_area_id INNER JOIN sports as s ON s.id=pas.sport_id WHERE city=?;",[req.body.location]);
        }else{
            result = await queryAsync("SELECT DISTINCT pa.* FROM play_areas as pa INNER JOIN play_area_sports as pas ON pa.id=pas.play_area_id INNER JOIN sports as s ON s.id=pas.sport_id WHERE s.name=?;",[req.body.sportType]);
        }
      
        console.log(result)
      const promises = result.map(venue => getPlayAreaDocs(venue.id,false));
      const promises1 = result.map(event => getPlayAreaDocs(event.id, true));
      const promises2 = result.map(event => getPlayAreaCourts(event.id));

      const [sportArrays, s3UrlArrays, courtsArray] = await Promise.all([Promise.all(promises), Promise.all(promises1), Promise.all(promises2)]);
      result.forEach((event, index) => {
        // console.log(sportArrays[index]);
        event.sports = sportArrays[index];
        event.photoUrl = s3UrlArrays[index];
        event.courts = courtsArray[index];
      });
      console.log(result);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const getSports = async (req,res) => {
    
   

    const sports = await queryAsync("select distinct(name) from sports;");
    const city = await queryAsync(" select distinct(city) from play_areas;");

    const responseObj = {
        sports: sports,
        cities: city,
      };
  
      // Send the combined object as the response
      res.json(responseObj);

  }

  module.exports = {
    getAllVenues,
    getSports
}
  