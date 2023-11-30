// statusController.js
const { StaticTokenProvider } = require('aws-sdk');
const playAreaModel = require('../models/playAreaModel');
const notificationService = require('../services/notificationService');

exports.changePlayAreaStatus = async (req, res) => {
  try {
    const { id, status, comments } = req.body;
    console.log('id ', id);
    console.log('status ', status);
    console.log('comments ', comments);

    // Update the status and comments of the play area in the database
    await playAreaModel.updatePlayAreaStatus(id, status, comments);

    // Retrieve the email address of the play area's owner
    const ownerEmail = await playAreaModel.getPlayAreaOwnerEmail(id);

    // Send an email notification to the play area's owner
    await notificationService.sendEmail(ownerEmail, status, comments);

    // Return a success response
    res.json({ message: `Status updated to ${status}`, id });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error updating play area status", error });
  }
};
