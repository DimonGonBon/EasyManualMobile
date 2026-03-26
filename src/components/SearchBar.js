import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Szukaj...',
}) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />
      <Text style={styles.icon}>🔍</Text>

      {value ? (
        <Pressable onPress={() => onChange('')} style={styles.clearBtn}>
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingLeft: 16,
    paddingRight: 44,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    position: 'absolute',
    right: 14,
    top: 13,
    fontSize: 18,
    color: colors.textSecondary,
  },
  clearBtn: {
    position: 'absolute',
    right: 14,
    top: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  clearText: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: -1,
  },
});