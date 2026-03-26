import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export default function SplashScreen({ navigation, currentUser }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, currentUser]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logo}>📋</Text>
      </View>

      <Text style={styles.title}>EasyManual</Text>
      <Text style={styles.subtitle}>Twój asystent instrukcji</Text>

      <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 24 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 42,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.textSecondary,
  },
});