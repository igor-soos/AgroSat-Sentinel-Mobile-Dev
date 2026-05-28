import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/utils/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'alert' | 'highlight';
}

const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  default: {
    backgroundColor: colors.darkGray,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  alert: {
    backgroundColor: `${colors.alertRed}20`,
    borderLeftWidth: 4,
    borderLeftColor: colors.alertRed,
  },
  highlight: {
    backgroundColor: colors.orangeTransparent,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
} as any);

export default Card;