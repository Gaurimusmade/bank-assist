/**
 * Bank Assist App
 * React Native App with Tailwind CSS
 *
 * @format
 */

import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import Ticket from './src/components/Ticket';
import CreateTicketScreen from './src/screens/CreateTicketScreen';
import BottomNavbar from './src/components/BottomNavbar';
import TopNavbar from './src/components/TopNavbar';
import { View } from 'react-native';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'tickets', or 'create'

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app with top and bottom navigation
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'tickets':
        return <Ticket />;
      case 'create':
        return <CreateTicketScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      <BottomNavbar currentScreen={currentScreen} onNavigate={handleNavigate} />
    </View>
  );
}

export default App; 