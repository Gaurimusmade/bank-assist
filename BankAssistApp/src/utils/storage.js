import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  CUSTOMER_PHONE_NUMBER: 'customerPhoneNumber',
  PROFILE_COMPLETE: 'profile_complete',
  USER_DATA: 'userData',
};

// Get item from storage
export const getStorageItem = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item ${key} from storage:`, error);
    return null;
  }
};

// Set item in storage
export const setStorageItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in storage:`, error);
    return false;
  }
};

// Remove item from storage
export const removeStorageItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from storage:`, error);
    return false;
  }
};

// Clear all storage
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Get access token
export const getAccessToken = async () => {
  return await getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Set access token
export const setAccessToken = async (token) => {
  return await setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

// Get customer phone number
export const getCustomerPhoneNumber = async () => {
  return await getStorageItem(STORAGE_KEYS.CUSTOMER_PHONE_NUMBER);
};

// Set customer phone number
export const setCustomerPhoneNumber = async (phoneNumber) => {
  return await setStorageItem(STORAGE_KEYS.CUSTOMER_PHONE_NUMBER, phoneNumber);
};

// Check if profile is complete
export const isProfileComplete = async () => {
  const profileComplete = await getStorageItem(STORAGE_KEYS.PROFILE_COMPLETE);
  return profileComplete === 'true';
};

// Set profile completion status
export const setProfileComplete = async (isComplete) => {
  return await setStorageItem(STORAGE_KEYS.PROFILE_COMPLETE, isComplete.toString());
}; 