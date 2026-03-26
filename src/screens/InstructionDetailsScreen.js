import React, { useCallback, useEffect, useState } from 'react';
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

import Button from '../components/Button';
import {
  addStepToInstruction,
  deleteInstruction,
  deleteStepFromInstruction,
  getInstructionById,
} from '../services/StorageService';
import { colors, radius, spacing } from '../styles/theme';

export default function InstructionDetailsScreen({
  navigation,
  route,
  user,
}) {
  const { instruction } = route.params;

  const [currentInstruction, setCurrentInstruction] = useState(instruction);
  const [newStepText, setNewStepText] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);

const loadInstruction = useCallback(async () => {
  const updated = await getInstructionById(user?.id, instruction.id);
  if (updated) {
    setCurrentInstruction(updated);
  }
}, [user?.id, instruction.id]);

useEffect(() => {
  loadInstruction();
}, [loadInstruction]);

  const steps = currentInstruction?.steps || [];

  const handleAddStep = async () => {
    if (!newStepText.trim()) {
      Alert.alert('Błąd', 'Opis kroku nie może być pusty');
      return;
    }

    if (newStepText.length > 500) {
      Alert.alert('Błąd', 'Opis nie może przekraczać 500 znaków');
      return;
    }

    const newStep = await addStepToInstruction(user?.id, currentInstruction.id, {
      description: newStepText.trim(),
    });

    if (newStep) {
      await loadInstruction();
      setNewStepText('');
      setShowAddStep(false);
    }
  };

  const handleDeleteStep = (stepId) => {
    Alert.alert('Usuń krok', 'Czy na pewno chcesz usunąć ten krok?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await deleteStepFromInstruction(user?.id, currentInstruction.id, stepId);
          await loadInstruction();
        },
      },
    ]);
  };

  const handleDeleteInstruction = () => {
    Alert.alert(
      'Usuń instrukcję',
      'Czy na pewno chcesz usunąć tę instrukcję? Tej operacji nie można cofnąć.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            await deleteInstruction(user?.id, currentInstruction.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Instrukcja</Text>

        <Pressable style={styles.deleteBtn} onPress={handleDeleteInstruction}>
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {currentInstruction?.image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentInstruction.image }}
              style={styles.image}
            />
          </View>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.title}>{currentInstruction?.title}</Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{currentInstruction?.category}</Text>
          </View>
        </View>

        <View style={styles.stepsSection}>
          <View style={styles.stepsHeader}>
            <Text style={styles.stepsTitle}>Kroki instrukcji</Text>
            <Text style={styles.stepCount}>
              {steps.length}{' '}
              {steps.length === 1 ? 'krok' : steps.length < 5 ? 'kroki' : 'kroków'}
            </Text>
          </View>

          {steps.length > 0 ? (
            <View style={styles.stepsList}>
              {steps.map((step, index) => (
                <View key={step.id} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>

                  <View style={styles.stepContent}>
                    <Text style={styles.stepText}>{step.description}</Text>
                  </View>

                  <Pressable
                    style={styles.stepDeleteBtn}
                    onPress={() => handleDeleteStep(step.id)}
                  >
                    <Text style={styles.stepDeleteText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySteps}>
              <Text style={styles.emptyStepsText}>Brak kroków w tej instrukcji</Text>
            </View>
          )}

          {!showAddStep ? (
            <Pressable
              style={styles.addStepBtn}
              onPress={() => setShowAddStep(true)}
            >
              <Text style={styles.addStepBtnText}>+ Dodaj krok</Text>
            </Pressable>
          ) : (
            <View style={styles.addStepForm}>
              <TextInput
                value={newStepText}
                onChangeText={setNewStepText}
                placeholder="Opis kroku..."
                placeholderTextColor={colors.textSecondary}
                style={styles.stepInput}
                multiline
                maxLength={500}
              />

              <Text style={styles.hint}>{newStepText.length}/500 znaków</Text>

              <View style={styles.formActions}>
                <Button
                  variant="secondary"
                  onPress={() => {
                    setShowAddStep(false);
                    setNewStepText('');
                  }}
                  fullWidth
                >
                  Anuluj
                </Button>

                <Button onPress={handleAddStep} fullWidth>
                  Dodaj
                </Button>
              </View>
            </View>
          )}
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
  deleteBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 18,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  imageContainer: {
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  infoBox: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  categoryChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryText: {
    color: colors.primary,
    fontWeight: '700',
  },
  stepsSection: {
    marginTop: 4,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  stepCount: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  stepDeleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDeleteText: {
    color: colors.error,
    fontSize: 22,
    lineHeight: 22,
    marginTop: -2,
  },
  emptySteps: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyStepsText: {
    color: colors.textSecondary,
  },
  addStepBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  addStepBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  addStepForm: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  stepInput: {
    minHeight: 110,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    textAlignVertical: 'top',
  },
  hint: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
  },
  formActions: {
    marginTop: spacing.md,
    gap: 10,
  },
});