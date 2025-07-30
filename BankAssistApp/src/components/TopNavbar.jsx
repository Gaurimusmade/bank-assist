import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { BriefcaseIcon, UserIcon, MailIcon, PhoneIcon } from './SvgIcons';

export default function TopNavbar() {
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Mock user data - in a real app, this would come from authentication context or API
  const userData = {
    name: 'John Doe',
    accountType: 'Customer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  };

  const handleUserIconPress = () => {
    setShowUserProfile(!showUserProfile);
  };

  return (
    <View style={tw`bg-black`}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      <SafeAreaView style={tw`bg-[#1e40af]`}>
        <View style={tw`flex-row items-center px-4 py-2 mt-2`}>
          {/* App Icon */}
          <View style={tw`w-10 h-10 bg-blue-700 rounded-xl items-center justify-center mr-3`}>
            <BriefcaseIcon size={20} color="white" />
          </View>
          
          {/* App Info */}
          <View style={tw`flex-1`}>
            <Text style={tw`text-white text-lg font-semibold`}>Bank Assist</Text>
            <Text style={tw`text-white text-xs opacity-70`}>Your Financial Companion</Text>
          </View>

          {/* User Icon with Dropdown */}
          <View style={tw`relative`}>
            <TouchableOpacity
              style={tw`w-10 h-10 bg-blue-600 rounded-full items-center justify-center`}
              onPress={handleUserIconPress}
            >
              <UserIcon size={20} color="white" />
            </TouchableOpacity>

            {/* User Profile Dropdown */}
            {showUserProfile && (
              <View style={tw`absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-50`}>
                {/* Header */}
                <View style={tw`p-4 border-b border-gray-100`}>
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3`}>
                      <UserIcon size={24} color="white" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-gray-800 font-semibold text-base`}>{userData.name}</Text>
                      <View style={tw`bg-blue-100 px-2 py-1 rounded-full mt-1 self-start`}>
                        <Text style={tw`text-blue-800 font-medium text-xs`}>{userData.accountType}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* User Details */}
                <View style={tw`p-4 space-y-3`}>
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3`}>
                      <MailIcon size={16} color="#6b7280" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-gray-500 text-xs`}>Email</Text>
                      <Text style={tw`text-gray-800 font-medium text-sm`}>{userData.email}</Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-center`}>
                    <View style={tw`w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3`}>
                      <PhoneIcon size={16} color="#6b7280" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-gray-500 text-xs`}>Phone</Text>
                      <Text style={tw`text-gray-800 font-medium text-sm`}>{userData.phone}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
