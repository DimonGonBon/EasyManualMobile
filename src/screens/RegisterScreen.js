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

export default function RegisterScreen({ navigation, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert('Błąd', 'Wpisz imię i nazwisko');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Błąd', 'Wpisz adres email');
      return;
    }

    if (!password) {
      Alert.alert('Błąd', 'Wpisz hasło');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Błąd', 'Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła nie są takie same');
      return;
    }

    setIsLoading(true);
    const result = await AuthService.register(email, password, fullName);
    setIsLoading(false);

    if (result.success) {
      onRegisterSuccess(result.user);
    } else {
      Alert.alert('Błąd rejestracji', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Zarejestruj się</Text>
          <Text style={styles.subtitle}>Utwórz nowe konto</Text>

          <View style={styles.form}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Imię i nazwisko"
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
            />

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

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Potwierdź hasło"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
            />

            <Button onPress={handleRegister} loading={isLoading} fullWidth>
              Zarejestruj się
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Masz już konto?</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              {' '}Zaloguj się
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