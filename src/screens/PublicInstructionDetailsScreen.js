import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LibraryService } from '../services/LibraryService';
import { colors, radius, spacing } from '../styles/theme';
import Button from '../components/Button';

export default function PublicInstructionDetailsScreen({
  navigation,
  route,
  user
}) {
  const { instructionId } = route.params;
  const [instruction, setInstruction] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwner = instruction?.author_user_id === user?.id;



  const handleDeletePublicInstruction = () => {
  Alert.alert(
    'Usuń instrukcję',
    'Czy na pewno chcesz usunąć tę publiczną instrukcję?',
    [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          const result = await LibraryService.deletePublicInstruction(instruction.id);

          if (result.success) {
            Alert.alert('Sukces', 'Instrukcja została usunięta');
            navigation.goBack();
          } else {
            Alert.alert('Błąd', result.error);
          }
        },
      },
    ]
  );
};

  const loadInstruction = useCallback(async () => {
    setLoading(true);
    const result = await LibraryService.getPublicInstructionWithSteps(
      instructionId
    );

    if (result.success) {
      setInstruction(result.data);
    } else {
      setInstruction(null);
    }

    setLoading(false);
  }, [instructionId]);

  

  useEffect(() => {
    loadInstruction();
  }, [loadInstruction]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!instruction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Instrukcja</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.centerBox}>
          <Text style={styles.emptyTitle}>Nie znaleziono instrukcji</Text>
        </View>
      </SafeAreaView>
    );
  }

  const steps = instruction.steps || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Instrukcja publiczna</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {instruction.image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: instruction.image }} style={styles.image} />
          </View>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.title}>{instruction.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{instruction.category}</Text>
            </View>

            {instruction.is_official ? (
              <View style={styles.officialChip}>
                <Text style={styles.officialText}>Oficjalna</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.authorText}>
            Autor: {instruction.author_name || 'Nieznany'}
          </Text>

          {isOwner ? (
  <View style={{ marginTop: 16 }}>
    <Button
      variant="secondary"
      onPress={handleDeletePublicInstruction}
      fullWidth
    >
      Usuń z biblioteki
    </Button>
  </View>
) : null}
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
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySteps}>
              <Text style={styles.emptyStepsText}>Brak kroków w tej instrukcji</Text>
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
  spacer: {
    width: 42,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  categoryChip: {
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
  officialChip: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  officialText: {
    color: '#fff',
    fontWeight: '700',
  },
  authorText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
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
});