import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-500 active:bg-gray-600';
      case 'success':
        return 'bg-green-500 active:bg-green-600';
      case 'danger':
        return 'bg-red-500 active:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 active:bg-yellow-600';
      default:
        return 'bg-blue-500 active:bg-blue-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2';
      case 'large':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  const baseClasses = 'rounded-lg items-center justify-center';
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const disabledClasses = disabled ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white font-semibold text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button; 