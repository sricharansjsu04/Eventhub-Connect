import React, { useState } from 'react';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_cPUiK1Y6C',
  ClientId: '2gfac6rthhbsj9gf791rt85l7o'
};

const userPool = new CognitoUserPool(poolData);

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


// import React, { useState } from 'react';

// function RegistrationForm({ onRegistrationComplete }) {
//   const [formState, setFormState] = useState({
//     username: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     role: ''
//   });

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormState({ ...formState, [name]: value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const { username, email, password, firstName, lastName, role } = formState;

//     // Sending data to the backend
//     fetch('http://localhost:3001/users/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username,
//         family_name: lastName,
//         given_name: firstName,
//         email,
//         password,
//         role
//       }),
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Success:', data);
//       onRegistrationComplete(username);
//       // You can redirect the user or show a success messagappe
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       // Handle error - show error message to user
//     });
//   };

//   return (
//     <div className="registration-form">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Role selection */}
//         <select name="role" defaultValue="" onChange={handleInputChange} required>
//           <option value="" disabled hidden>You are a...</option>
//           <option value="player">Player</option>
//           <option value="owner">Playarea Owner</option>
//         </select>
//         {/* Other form fields */}
//         <input type="text" name="username" placeholder="Username" onChange={handleInputChange} required />
//         <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} required />
//         <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} required />
//         <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
//         <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// }

// export default RegistrationForm;

