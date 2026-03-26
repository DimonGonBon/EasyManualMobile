import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/Button';
import { AuthService } from '../services/AuthService';
import { colors, radius, spacing } from '../styles/theme';

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Błąd', 'Wpisz adres email');
      return;
    }

    if (!password) {
      Alert.alert('Błąd', 'Wpisz hasło');
      return;
    }

    setIsLoading(true);
    const result = await AuthService.login(email, password);
    setIsLoading(false);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      Alert.alert('Błąd logowania', result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await AuthService.loginWithGoogle();
    setIsLoading(false);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      Alert.alert('Google', result.error);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);

    const demoEmail = 'demo@example.com';
    const demoPassword = 'demo123456';
    const demoName = 'Demo Użytkownik';

    let result = await AuthService.login(demoEmail, demoPassword);

    if (!result.success) {
      const registerResult = await AuthService.register(
        demoEmail,
        demoPassword,
        demoName
      );

      setIsLoading(false);

      if (registerResult.success) {
        onLoginSuccess(registerResult.user);
      } else {
        Alert.alert('Błąd', registerResult.error);
      }
    } else {
      setIsLoading(false);
      onLoginSuccess(result.user);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.logo}>📋</Text>
          <Text style={styles.title}>EasyManual</Text>
          <Text style={styles.subtitle}>Twój asystent instrukcji</Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Hasło"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
            />

            <Button onPress={handleLogin} loading={isLoading} fullWidth>
              Zaloguj się
            </Button>

            <Button
              onPress={handleDemoLogin}
              variant="secondary"
              fullWidth
            >
              Zaloguj się jako demo
            </Button>

            <Button
              onPress={handleGoogleLogin}
              variant="secondary"
              fullWidth
            >
              Kontynuuj z Google
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Nie masz konta?</Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              {' '}Zarejestruj się
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  logo: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginTop: 24,
    gap: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    color: colors.textSecondary,
  },
  link: {
    color: colors.accent,
    fontWeight: '700',
  },
});