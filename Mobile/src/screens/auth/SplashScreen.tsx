import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import { colors } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';

const SplashScreen: React.FC = () => {
  const fadeAnim = new Animated.Value(0);
  const { isLoading } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.logo}>AgroSat</Text>
        <Text style={styles.subtitle}>Sentinel</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SplashScreen;