import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'demo@bank.com' && password === 'password') {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => onLoginSuccess && onLoginSuccess()
          }
        ]);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset link will be sent to your email');
  };

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Registration feature coming soon!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 40
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: '#1e40af',
              marginBottom: 8
            }}>
              Bank Assist
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Your Financial Companion
            </Text>
          </View>

          {/* Login Form */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3
          }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: 24,
              textAlign: 'center'
            }}>
              Welcome Back
            </Text>

            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: 8
              }}>
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  backgroundColor: '#f9fafb'
                }}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: 8
              }}>
                Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: '#374151',
                  backgroundColor: '#f9fafb'
                }}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={{ alignSelf: 'flex-end', marginBottom: 24 }}
            >
              <Text style={{ 
                color: '#1e40af', 
                fontSize: 14,
                fontWeight: '500'
              }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#1e40af',
                borderRadius: 8,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1
              }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                fontWeight: 'bold'
              }}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={{ 
              marginTop: 24, 
              padding: 16, 
              backgroundColor: '#f3f4f6', 
              borderRadius: 8 
            }}>
              <Text style={{ 
                fontSize: 14, 
                color: '#6b7280', 
                textAlign: 'center',
                fontWeight: '500'
              }}>
                Demo Credentials:
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: '#9ca3af', 
                textAlign: 'center',
                marginTop: 4
              }}>
                Email: demo@bank.com{'\n'}
                Password: password
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={{ 
            marginTop: 32, 
            alignItems: 'center' 
          }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Don't have an account?{' '}
              <Text 
                style={{ 
                  color: '#1e40af', 
                  fontWeight: '600' 
                }}
                onPress={handleSignUp}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 