import React, { useState } from 'react';
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
import { addInstruction } from '../services/StorageService';
import { colors, radius, spacing } from '../styles/theme';

const CATEGORIES = [
  'Meble',
  'Elektronika',
  'Kuchnia',
  'Łazienka',
  'Narzędzia',
  'Inne',
];

export default function AddInstructionScreen({ navigation, user }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meble');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const savePickedAsset = (asset) => {
    const mime = asset.mimeType || 'image/jpeg';
    const base64Image = `data:${mime};base64,${asset.base64}`;
    setImage(base64Image);
  };

  const handlePickImageFromLibrary = async () => {
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
      savePickedAsset(result.assets[0]);
    }
  };

  const handleTakePhoto = async () => {
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
      savePickedAsset(result.assets[0]);
    }
  };

  const handleChooseImage = () => {
    Alert.alert('Dodaj obraz', 'Wybierz źródło obrazu', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Aparat', onPress: handleTakePhoto },
      { text: 'Galeria', onPress: handlePickImageFromLibrary },
    ]);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Wpisz nazwę instrukcji');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Błąd', 'Wybierz kategorię');
      return;
    }

    setIsLoading(true);

    const newInstruction = await addInstruction(user.id, {
      title: title.trim(),
      category,
      image,
      steps: [],
    });

    setIsLoading(false);

    if (newInstruction) {
      navigation.replace('InstructionDetails', {
        instruction: newInstruction,
      });
    } else {
      Alert.alert('Błąd', 'Nie udało się utworzyć instrukcji');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Nowa instrukcja</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Obraz instrukcji</Text>

          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <Button variant="secondary" onPress={handleRemoveImage} fullWidth>
                Usuń obraz
              </Button>
            </View>
          ) : (
            <Pressable style={styles.uploadBox} onPress={handleChooseImage}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Dodaj obraz</Text>
              <Text style={styles.uploadHint}>Aparat lub galeria</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nazwa instrukcji *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Np. Montaż łóżka Dream Sleep"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            maxLength={100}
          />
          <Text style={styles.hint}>{title.length}/100 znaków</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Kategoria *</Text>
          <View style={styles.categoriesWrap}>
            {CATEGORIES.map((item) => {
              const active = item === category;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          variant="secondary"
          onPress={() => navigation.goBack()}
          fullWidth
        >
          Anuluj
        </Button>
        <Button onPress={handleSubmit} loading={isLoading} fullWidth>
          Utwórz instrukcję
        </Button>
      </View>
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
  title: {
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
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  uploadBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  uploadIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  uploadHint: {
    marginTop: 6,
    color: colors.textSecondary,
  },
  imagePreviewContainer: {
    gap: 12,
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.text,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  actions: {
    padding: spacing.lg,
    gap: 10,
  },
});