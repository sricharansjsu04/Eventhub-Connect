// playAreaModel.js
const db = require('../config/db-config');

exports.updatePlayAreaStatus = (id, status, comments) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE play_areas SET status = ?, comments = ? WHERE id = ?';
    db.query(sql, [status, comments, id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getPlayAreaOwnerEmail = (id) => {
  console.log('id is :', id);
  return new Promise((resolve, reject) => {
    const sql = 'SELECT owner FROM play_areas WHERE id = ?';
    
    db.query(sql, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const owner = results[0].owner;
        console.log('owner fetched: ', owner);
        const sql = 'SELECT email FROM users WHERE id = ?';
        db.query(sql, [owner], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].email);
          }
        });
      }
    });
  });
};
