import React, { useState, useRef } from 'react';
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
  StyleSheet,
  Image,
} from 'react-native';

// Simple functional component for the back arrow icon
const BackArrowIcon = () => (
  <Image
    source={{
      uri: 'https://img.icons8.com/ios-glyphs/30/000000/long-arrow-left.png',
    }}
    style={{ width: 20, height: 20, marginRight: 8 }}
  />
);

const LoginScreen = ({ onLoginSuccess }) => {
  // State to manage which view to show: 'login' or 'otp'
  const [view, setView] = useState('login');

  // State for Login View
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for OTP View
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputs = useRef([]);

  // --- HANDLERS ---

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email === 'demo@bank.com' && password === 'password') {
        Alert.alert('Success', 'OTP sent successfully!');
        setView('otp');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    }, 1500);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (enteredOtp === '888888') {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => onLoginSuccess && onLoginSuccess() },
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleOtpChange = (text, index) => {
    if (!/^[0-9]$/.test(text) && text !== '') return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text !== '' && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    Alert.alert('OTP Resent', 'A new 6-digit code has been sent.');
    setOtp(new Array(6).fill(''));
    otpInputs.current[0].focus();
  };

  const handleChangeNumber = () => {
    setView('login');
    setPassword('');
  };

  // --- ADDED: Handlers from original code ---
  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset link will be sent to your email',
    );
  };

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Registration feature coming soon!');
  };

  // --- RENDER METHODS ---

  const renderLoginView = () => (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.loginScrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Bank Assist</Text>
            <Text style={styles.headerSubtitle}>Your Financial Companion</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                color="#000"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* ADDED: Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={{ alignSelf: 'flex-end', marginBottom: 24 }}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* ADDED: Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitleText}>Demo Credentials:</Text>
              <Text style={styles.demoInfoText}>
                Email: demo@bank.com{'\n'}
                Password: password
              </Text>
            </View>
          </View>

          {/* ADDED: Footer with Sign Up link */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.signUpText} onPress={handleSignUp}>
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const renderOtpView = () => (
    <SafeAreaView style={styles.otpSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fdf9" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.otpScrollView}>
          <View style={styles.otpOuterContainer}>
            <View style={styles.otpHeader}>
              <View style={styles.iconBackground}>
                <Text style={styles.iconText}>🔄</Text>
              </View>
              <Text style={styles.otpTitle}>Employee Access</Text>
              <Text style={styles.otpSubtitle}>Secure employee login</Text>
            </View>

            <View style={styles.otpEntrySection}>
              <View
                style={[styles.iconBackground, { backgroundColor: '#e0f2f1' }]}
              >
                <Text style={styles.iconText}>🔒</Text>
              </View>
              <Text style={styles.enterOtpText}>Enter OTP</Text>
              <Text style={styles.otpSentToText}>
                A 6-digit code was sent to{' '}
                <Text style={{ fontWeight: 'bold' }}>1234567891</Text>
              </Text>
              <Text style={styles.verificationCodeLabel}>
                Verification Code
              </Text>
              <View style={styles.otpInputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={el => (otpInputs.current[index] = el)}
                    style={styles.otpInputBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  { opacity: isVerifying ? 0.7 : 1 },
                ]}
                onPress={handleVerifyOtp}
                disabled={isVerifying}
              >
                <Text style={styles.verifyButtonText}>
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendOtpText}>Resend OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeNumberContainer}
                onPress={handleChangeNumber}
              >
                <BackArrowIcon />
                <Text style={styles.changeNumberText}>
                  Change Mobile Number
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return view === 'login' ? renderLoginView() : renderOtpView();
};

// --- STYLES ---
const styles = StyleSheet.create({
  // Login View Styles
  loginContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  loginScrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  headerSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  forgotPasswordText: { color: '#1e40af', fontSize: 14, fontWeight: '500' },
  loginButton: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  demoTitleText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  demoInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  footerContainer: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  signUpText: { color: '#1e40af', fontWeight: '600' },

  // OTP View Styles
  otpSafeArea: { flex: 1, backgroundColor: '#f7fdf9' },
  otpScrollView: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  otpOuterContainer: {
    borderWidth: 1,
    borderColor: '#a7d7c5',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  otpHeader: { alignItems: 'center', marginBottom: 30 },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f4f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconText: { fontSize: 24 },
  otpTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  otpSubtitle: { fontSize: 14, color: '#888' },
  otpEntrySection: { alignItems: 'center' },
  enterOtpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  otpSentToText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  verificationCodeLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  otpInputBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  verifyButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  resendOtpText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 25,
  },
  changeNumberContainer: { flexDirection: 'row', alignItems: 'center' },
  changeNumberText: { color: '#555', fontSize: 14 },
});

export default LoginScreen;
