import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Button from '../components/Button';
import { AuthService } from '../services/AuthService';
import { getAllInstructions } from '../services/StorageService';
import { colors, radius, spacing } from '../styles/theme';

export default function ProfileScreen({
  navigation,
  user,
  onUserUpdate,
  onLogout,
}) {
  const [stats, setStats] = useState({
    instructions: 0,
    steps: 0,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      const data = await getAllInstructions(user.id);
      const totalSteps = data.reduce(
        (sum, inst) => sum + (inst.steps?.length || 0),
        0
      );

      setStats({
        instructions: data.length,
        steps: totalSteps,
      });
    };

    loadStats();
  }, [user]);

  useEffect(() => {
    setAvatarPreview(user?.avatar || null);
  }, [user]);

  const handleChangePassword = async () => {
    setMessage('');
    setError('');

    const result = await AuthService.changePassword(currentPassword, newPassword);

    if (result.success) {
      setMessage('Hasło zostało zmienione');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setError(result.error);
    }
  };

  const saveAvatar = async (asset) => {
    const mime = asset.mimeType || 'image/jpeg';
    const base64Image = `data:${mime};base64,${asset.base64}`;

    const result = await AuthService.updateAvatar(base64Image);

    if (result.success) {
      setAvatarPreview(base64Image);
      setMessage('Avatar został zaktualizowany');
      setError('');

      if (onUserUpdate) {
        onUserUpdate(result.user);
      }
    } else {
      setError(result.error);
    }
  };

  const handlePickAvatarFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Brak dostępu', 'Zezwól aplikacji na dostęp do zdjęć.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      await saveAvatar(result.assets[0]);
    }
  };

  const handleTakeAvatarPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Brak dostępu', 'Zezwól aplikacji na dostęp do aparatu.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      await saveAvatar(result.assets[0]);
    }
  };

  const handleAvatarChange = () => {
    Alert.alert('Zmień avatar', 'Wybierz źródło obrazu', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Aparat', onPress: handleTakeAvatarPhoto },
      { text: 'Galeria', onPress: handlePickAvatarFromLibrary },
    ]);
  };

  const handleLogoutPress = async () => {
    await AuthService.logout();
    onLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Profil użytkownika</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            {avatarPreview ? (
              <Image source={{ uri: avatarPreview }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
          </View>

          <Pressable style={styles.avatarBtn} onPress={handleAvatarChange}>
            <Text style={styles.avatarBtnText}>Zmień avatar</Text>
          </Pressable>

          <Text style={styles.name}>{user?.fullName || 'Użytkownik'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statystyki</Text>
          <Text style={styles.statText}>Liczba instrukcji: {stats.instructions}</Text>
          <Text style={styles.statText}>Liczba kroków: {stats.steps}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zmień hasło</Text>

          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Obecne hasło"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nowe hasło"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={styles.input}
          />

          {message ? <Text style={styles.success}>{message}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button onPress={handleChangePassword} fullWidth>
            Zmień hasło
          </Button>
        </View>

        <View style={styles.actions}>
          <Button variant="secondary" onPress={handleLogoutPress} fullWidth>
            Wyloguj się
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 22,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  spacer: {
    width: 42,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarFallback: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },
  avatarBtn: {
    alignSelf: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginBottom: 16,
  },
  avatarBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  email: {
    marginTop: 6,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },
  statText: {
    color: colors.text,
    marginBottom: 8,
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
    marginBottom: 12,
  },
  success: {
    color: colors.success,
    marginBottom: 12,
    fontWeight: '600',
  },
  error: {
    color: colors.error,
    marginBottom: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: 4,
  },
});