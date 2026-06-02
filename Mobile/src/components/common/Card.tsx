import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/utils/colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'alert';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'alert' && styles.cardAlert,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  cardAlert: {
    borderColor: colors.alertRed + '30',
    backgroundColor: colors.alertRed + '10',
  },
});

export default Card;