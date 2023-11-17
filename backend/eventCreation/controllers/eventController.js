const db = require("./dbConnect")




function getPlayAreaDocs(playAreaId, isS3Url) {
  return new Promise((resolve, reject) => {
    const query = isS3Url
      ? "SELECT pad.s3url FROM play_area_docs AS pad INNER JOIN play_areas AS pa ON pad.play_area_id=pa.id WHERE pad.play_area_id = ?;"
      : "SELECT u.username FROM users AS u INNER JOIN event_users AS ev ON u.id = ev.user_id WHERE ev.event_id = ? and ev.status='Done';";

    db.query(query, [playAreaId], function (err, result1) {
      if (err) {
        reject(err);
      } else {
        // console.log(playAreaId,result1);
        const arr = result1.map(item => (isS3Url ? item.s3url : item.username));
        resolve(arr);
      }
    });
  });
}

// Refactored getAllNotes function
const getAllNotes = async (req, res) => {
  try {
    const result = await queryAsync("SELECT e.id, e.event_name, e.current_pool_size, e.pool_size, e.sport_id, e.created_by, u.username as created_user, e.court_id, p.name, p.address1, p.state, p.country, p.zipcode, p.id as play_area_id, s.name as sportType FROM events as e INNER JOIN play_areas as p ON e.play_area_id=p.id INNER JOIN users as u ON e.created_by=u.id INNER JOIN sports AS s ON e.sport_id=s.id WHERE e.event_status='Confirmed';");
    
    const promises = result.map(event => getPlayAreaDocs(event.play_area_id, true));
    const promises1 = result.map(event => getPlayAreaDocs(event.id, false));
   
    const [s3UrlArrays, playersArrays] = await Promise.all([Promise.all(promises), Promise.all(promises1)]);
   
    result.forEach((event, index) => {
      event.photoUrl = s3UrlArrays[index];
      event.players = playersArrays[index];
    });

    // console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

const getCreatedEvents = async (req,res) => {
  const query = `
  SELECT 
    e.id, 
    e.event_name, 
    e.current_pool_size, 
    e.pool_size, 
    e.sport_id, 
    e.created_by, 
    u.username as created_user, 
    e.court_id, 
    p.name, 
    p.address1, 
    p.state, 
    p.country, 
    p.zipcode, 
    p.id as play_area_id, 
    s.name as sportType 
  FROM 
    events as e 
    INNER JOIN play_areas as p ON e.play_area_id = p.id 
    INNER JOIN users as u ON e.created_by = u.id 
    INNER JOIN sports AS s ON e.sport_id = s.id 
  WHERE 
    
    e.created_by = ?;
`;
  try {
 
    const userId = await queryAsync("select id from users where username=?",[req.body.user]);

    const result = await queryAsync(query,userId[0].id);

    const promises = result.map(event => getPlayAreaDocs(event.play_area_id, true));
    const promises1 = result.map(event => getPlayAreaDocs(event.id, false));

    const [s3UrlArrays, playersArrays] = await Promise.all([Promise.all(promises), Promise.all(promises1)]);

    result.forEach((event, index) => {
      event.photoUrl = s3UrlArrays[index];
      event.players = playersArrays[index];
    });
    // console.log(result);
    res.json(result);
  }
  catch(err){
    console.log(err);
  }
}


const getMyEvents = async(req,res)=> {
  
  const query = `
    SELECT 
      e.id, 
      e.event_name, 
      e.current_pool_size, 
      e.pool_size, 
      e.sport_id, 
      e.created_by, 
      u.username as created_user, 
      e.court_id, 
      p.name, 
      p.address1, 
      p.state, 
      p.country, 
      p.zipcode, 
      p.id as play_area_id, 
      s.name as sportType 
    FROM 
      events as e 
      INNER JOIN play_areas as p ON e.play_area_id = p.id 
      INNER JOIN users as u ON e.created_by = u.id 
      INNER JOIN sports AS s ON e.sport_id = s.id 
      INNER JOIN event_users AS eu ON e.id = eu.event_id 
    WHERE 
      e.event_status = 'Confirmed' 
      AND eu.status='Done'
      AND eu.user_id = ?;
  `;

  try {

    const userId = await queryAsync("select id from users where username=?",[req.body.user]);

    const result = await queryAsync(query,userId[0].id);

    const promises = result.map(event => getPlayAreaDocs(event.play_area_id, true));
    const promises1 = result.map(event => getPlayAreaDocs(event.id, false));

    const [s3UrlArrays, playersArrays] = await Promise.all([Promise.all(promises), Promise.all(promises1)]);

    result.forEach((event, index) => {
      event.photoUrl = s3UrlArrays[index];
      event.players = playersArrays[index];
    });
    // console.log(result);
    res.json(result);
  }
  catch(err){
    console.log(err);
  }
}


const joinEvent = async (req,res) =>{
  try{
    const { event_id, username, status } = req.body;

    const userId = await queryAsync("select id from users where username=?",[req.body.username]);
    const checkQuery = 'SELECT * FROM event_users WHERE event_id = ? AND user_id = ?';
    const checkResult = await queryAsync(checkQuery, [event_id, userId[0].id]);
    
    if (checkResult.length > 0) {
      
      if(checkResult[0].status=="Done")
        return res.status(400).json({ error: 'User has already joined in this event' });
      else if(checkResult[0].status=="Waitlist"){
       
        return res.status(400).json({ error: 'User already requested to join in this event, waiting for the host to accept the request' });
      }
    }
    const insertQuery = 'INSERT INTO event_users (event_id, user_id, status) VALUES (?, ?, ?)';
    const result = await queryAsync(insertQuery, [event_id, userId[0].id, status]);
    res.status(200).json({ message: 'Successfully requested to join the event, will join the event once the host accepts the request' });
  }catch(err){
    console.log(err);
  }

}


const getWaitList = async (req,res) =>{
  const event_id = req.params.id;

  // Step 1: Get user IDs from the event_users table
  const checkQuery = 'SELECT user_id FROM event_users WHERE event_id = ? AND status="Waitlist"';
  const userIDs = await queryAsync(checkQuery, [event_id]);
  
  // Check if there are user IDs before proceeding
  if (userIDs.length > 0) {
    // Step 2: Get user details based on the obtained user IDs
    const userDetailsQuery = 'SELECT username, id FROM users WHERE id IN (?)';
    const userDetails = await queryAsync(userDetailsQuery, [userIDs.map(user => user.user_id)]);
  
    // userDetails now contains an array of user details for users in the Waitlist
    // console.log(userDetails);
    res.json(userDetails); // You can send this data as a response or process it further
  } else {
    // Handle the case where there are no user IDs
    console.log('No user IDs found');
    res.json([]); // You can send an empty array or handle it as needed
  }

}

const acceptReq = async (req,res) =>{
  const status = 'Done';

  try {
    const eventId = req.body.event_id; 
    const userId = req.body.user_id;

    const updateQuery = 'UPDATE event_users SET status = ? WHERE event_id = ? AND user_id = ?';
    const updateResult = await queryAsync(updateQuery, [status, eventId, userId]);

    // Check if the update was successful
    if (updateResult.affectedRows > 0) {
      res.status(200).json({message:"Updated"});
    }else{
      res.status(400).json({message:"No Records Updated"});
    }
  }catch(err){
    console.log(err);
    res.status(400).json({message:err})
  }
}

const rejectReq = async (req,res) =>{

  try {
    const eventId = req.body.event_id; 
    const userId = req.body.user_id;

    const deleteQuery = 'DELETE FROM event_users WHERE event_id = ? AND user_id = ?';
    const deleteResult = await queryAsync(deleteQuery, [eventId, userId]);

    // Check if the update was successful
    if (deleteResult.affectedRows > 0) {
      res.status(200).json({message:"Removed from Waitlist"});
    }else{
      res.status(400).json({message:"No Records Updated"});
    }
  }catch(err){
    console.log(err);
    res.status(400).json({message:err})
  }
}


module.exports = {
    getAllNotes,
    getCreatedEvents,
    getMyEvents,
    joinEvent,
    getWaitList,
    acceptReq,
    rejectReq
}