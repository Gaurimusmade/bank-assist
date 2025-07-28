/**
 * Bank Assist App
 * React Native App with Tailwind CSS
 *
 * @format
 */

import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
    );
  }

  // Show dashboard if logged in
  return (
      <DashboardScreen />
  );
}

export default App; 