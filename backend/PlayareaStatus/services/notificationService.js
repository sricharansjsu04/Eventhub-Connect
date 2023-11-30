const AWS = require('aws-sdk');

// Configure AWS with your region
AWS.config.update({region: 'us-east-2'});

// Create an SES service object
const ses = new AWS.SES({apiVersion: '2010-12-01'});

const sendEmail = (recipientEmail, status, comments) => {
  console.log('inside send email');
  console.log('recepient email', recipientEmail);
  console.log('recepient status', status);
  console.log('recepient comment', comments);
  const params = {
    Destination: { 
      ToAddresses: [recipientEmail]
    },
    Message: { 
      Body: { 
        Text: { Data: `The status of your play area has been updated to: ${status}. Comments: ${comments}` }
      },
      Subject: { Data: "Play Area Status Update" }
    },
    Source: "shireesh.vennamaneni@sjsu.edu", // Replace with your verified SES email
  };

  return new Promise((resolve, reject) => {
    ses.sendEmail(params, function(err, data) {
      if (err) reject(err); // an error occurred
      else {
        console.log('email sent');
        resolve(data);}   // successful response
    });
  });
};

module.exports = { sendEmail };
