// RegistrationForm component code
import React, { useState } from 'react';

function RegistrationForm() {
  const [role, setRole] = useState('player');

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div className="registration-form">
      <h2>Sign Up</h2>
      {/* Role selection */}
      <div className="role-selection">
        <select defaultValue="" onChange={handleRoleChange} required>
          <option value="" disabled hidden>You are a...</option>
          <option value="player">Player</option>
          <option value="coach">Playarea Owner</option>
          {/* other options */}
        </select>
      </div>
      {/* Add your registration form fields here */}
      <form>
        {/* Username field */}
        <input type="text" placeholder="Username" />
        {/* Username field */}
        <input type="text" placeholder="First Name" />
        {/* Username field */}
        <input type="text" placeholder="Last Name" />
        {/* Email field */}
        <input type="email" placeholder="Email" />
        {/* Password field */}
        <input type="password" placeholder="Password" />
        {/* Submit button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
