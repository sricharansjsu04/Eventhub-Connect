import React, { useState, useContext } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import userPool from '../../config/cognitoConfig';
import { AuthContext } from '../../contexts/AuthContext';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        // Extract role type from the token
        const roleType = session.getIdToken().payload['custom:user_type']; // Adjust the key based on your token structure
        const idToken = session.getIdToken().getJwtToken();
        onLogin(username, roleType);
        console.log(idToken);
      },
      onFailure: (err) => {
        console.error('Authentication failed:', err);
        setError(err.message || 'Login failed. Please try again.');
      }
    });
  };

  return (
    <div className="login-form">
      <h2>Sign In</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginForm;


