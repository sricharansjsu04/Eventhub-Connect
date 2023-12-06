// EmailVerificationForm.js
import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';

function EmailVerificationForm({ username, userPool, onVerified }) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const userData = { Username: username, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);
    

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error(err);
        setErrorMessage('Incorrect verification code.'); // Set the error message
        return;
        return;
      }
      onVerified(); // Callback for post-verification process
    });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <img src="/playpal_logo.png" alt="Playpal Logo" className="logo" />
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification Code"
            className="input" // Use the same input class as in sign-in and sign-up
            required
          />
          <button type="submit" className="button">Verify</button>
        </form>
      </div>
    </div>
  );
}

export default EmailVerificationForm;
