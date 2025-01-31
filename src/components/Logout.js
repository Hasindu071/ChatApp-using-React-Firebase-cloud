import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// If you use React Router

const LogoutButton = () => {
  const auth = getAuth();
  const navigate = useNavigate();
// React Router for redirection after logout

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Successfully signed out
        console.log('User signed out');
        // Redirect to login or home page after logout
        navigate('/signin'); // Change this to wherever you want to redirect
      })
      .catch((error) => {
        // Handle error
        console.error('Error signing out: ', error);
      });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '10px 20px',
        fontSize: '14px',
        borderRadius: '5px',
        backgroundColor: '#FF5733', // Example color
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
