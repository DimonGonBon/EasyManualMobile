import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import SearchBar from '../components/SearchBar';
import InstructionCard from '../components/InstructionCard';
import Button from '../components/Button';
import { LibraryService } from '../services/LibraryService';
import { colors, radius, spacing } from '../styles/theme';

const CATEGORIES = [
  'Wszystkie',
  'Meble',
  'Elektronika',
  'Kuchnia',
  'Łazienka',
  'Narzędzia',
  'Inne',
];

export default function LibraryScreen({ navigation }) {
  const [instructions, setInstructions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [loading, setLoading] = useState(true);

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    const result = await LibraryService.getPublicInstructions();

    if (result.success) {
      setInstructions(result.data);
    } else {
      setInstructions([]);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLibrary();
    }, [loadLibrary])
  );

  const filteredInstructions = instructions.filter((instruction) => {
    const matchesSearch = instruction.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Wszystkie' ||
      instruction.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Text style={styles.title}>Biblioteka</Text>

        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Szukaj instrukcji..."
        />

        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.categoriesScroll}
  contentContainerStyle={styles.categoriesRow}
>
  {CATEGORIES.map((category) => {
    const active = category === selectedCategory;

    return (
      <Pressable
        key={category}
        onPress={() => setSelectedCategory(category)}
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
          {category}
        </Text>
      </Pressable>
    );
  })}
</ScrollView>


        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filteredInstructions.length > 0 ? (
            filteredInstructions.map((instruction) => (
              <InstructionCard
                key={instruction.id}
                instruction={{
                  ...instruction,
                  steps: instruction.steps || [],
                }}
                image={instruction.image}
                onPress={() =>
                  navigation.navigate('PublicInstructionDetails', {
                    instructionId: instruction.id,
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery || selectedCategory !== 'Wszystkie'
                  ? 'Nie znaleziono instrukcji'
                  : 'Biblioteka jest pusta'}
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery || selectedCategory !== 'Wszystkie'
                  ? 'Spróbuj zmienić wyszukiwanie lub kategorię'
                  : 'Użytkownicy mogą udostępniać tu swoje instrukcje'}
              </Text>

              <View style={{ marginTop: 16, width: '100%' }}>
                <Button
                  variant="secondary"
                  onPress={loadLibrary}
                  fullWidth
                >
                  Odśwież bibliotekę
                </Button>
              </View>
            </View>
          )}
        </View>
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
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
categoriesRow: {
  gap: 10,
  alignItems: 'center',
  paddingRight: 8,
},

  categoriesScroll: {
  maxHeight: 54,
  marginBottom: spacing.md,
},

categoryChip: {
  height: 42,
  paddingHorizontal: 16,
  borderRadius: 999,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
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


  listContainer: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  
});