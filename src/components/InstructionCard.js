import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

export default function InstructionCard({
  instruction,
  onPress,
  onDelete,
  image,
}) {
  const stepsCount = instruction.steps ? instruction.steps.length : 0;

  const handleDelete = () => {
    Alert.alert(
      'Usuń instrukcję',
      'Czy na pewno chcesz usunąć tę instrukcję?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => onDelete(instruction.id),
        },
      ]
    );
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {instruction.title}
          </Text>

          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.category}>{instruction.category}</Text>

        <View style={styles.footer}>
          <Text style={styles.steps}>
            {stepsCount}{' '}
            {stepsCount === 1 ? 'krok' : stepsCount < 5 ? 'kroki' : 'kroków'}
          </Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 170,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 22,
    lineHeight: 22,
    color: colors.error,
    marginTop: -2,
  },
  category: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  steps: {
    color: colors.primary,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 26,
    color: colors.textSecondary,
  },
});