import React from 'react';
import { View, Text } from 'react-native';

const Card = ({ 
  title, 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white dark:bg-gray-800 shadow-lg';
      case 'outlined':
        return 'bg-transparent border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 shadow-sm';
    }
  };

  const baseClasses = 'rounded-lg p-4';
  const variantClasses = getVariantClasses();

  return (
    <View className={`${baseClasses} ${variantClasses} ${className}`}>
      {title && (
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

export default Card; 