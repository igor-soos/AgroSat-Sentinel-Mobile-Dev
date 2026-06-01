import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors } from '@/utils/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`textVariant_${variant}`],
            styles[`textSize_${size}`],
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  // Variants
  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  variant_danger: {
    backgroundColor: '#dc3545',
  },
  // Sizes
  size_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  size_medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  size_large: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 52,
  },
  // Text variants
  text: {
    fontWeight: '600',
  },
  textVariant_primary: {
    color: colors.white,
  },
  textVariant_outline: {
    color: colors.primary,
  },
  textVariant_danger: {
    color: colors.white,
  },
  // Text sizes
  textSize_small: {
    fontSize: 12,
  },
  textSize_medium: {
    fontSize: 14,
  },
  textSize_large: {
    fontSize: 16,
  },
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
});

export default Button;