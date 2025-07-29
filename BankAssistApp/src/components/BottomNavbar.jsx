import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Feather from 'react-native-vector-icons/Feather';

export default function BottomNavbar({ currentScreen, onNavigate }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home'
    },
    {
      id: 'tickets',
      label: 'My Tickets',
      icon: 'file-text'
    },
    {
      id: 'create',
      label: 'Create',
      icon: 'plus'
    }
  ];

  return (
    <View style={tw`bg-white border-t border-gray-200 flex-row`}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={tw`flex-1 py-3 px-2 items-center`}
          onPress={() => onNavigate(tab.id)}
        >
          <Feather 
            name={tab.icon}
            size={20} 
            color={currentScreen === tab.id ? '#2563eb' : '#6b7280'} 
          />
          <Text style={[
            tw`text-xs font-medium mt-1`,
            currentScreen === tab.id ? tw`text-blue-600` : tw`text-gray-500`
          ]}>
            {tab.label}
          </Text>
          {currentScreen === tab.id && (
            <View style={tw`w-1 h-1 bg-blue-600 rounded-full mt-1`} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
} 