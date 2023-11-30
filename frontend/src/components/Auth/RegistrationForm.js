import React, { useState } from 'react';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userPool from '../../config/cognitoConfig';

function RegistrationForm({ onRegistrationComplete, setUserData }) {
  const [formState, setFormState] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { username, email, password, firstName, lastName, role } = formState;

    setUserData({
      username,
      email,
      password,
      firstName,
      lastName,
      role
    });

    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
      new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      new CognitoUserAttribute({ Name: 'custom:user_type', Value: role }),
    ];

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      onRegistrationComplete(username);
    });
  };

  return (
    <div className="registration-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Role selection */}
        <select name="role" defaultValue="" onChange={handleInputChange} required>
          <option value="" disabled hidden>You are a...</option>
          <option value="player">Player</option>
          <option value="owner">Playarea Owner</option>
        </select>
        {/* Other form fields */}
        <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
        <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default RegistrationForm;