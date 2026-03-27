import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  deleteInstruction,
  getAllInstructions,
} from '../services/StorageService';
import SearchBar from '../components/SearchBar';
import InstructionCard from '../components/InstructionCard';
import Button from '../components/Button';
import { colors, spacing } from '../styles/theme';
import { AuthService } from '../services/AuthService';
import { loadDemoData } from '../utils/demoData';

export default function HomeScreen({
  navigation,
  user,
  onLogout,
  onUserUpdate,
}) {
  const [instructions, setInstructions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(user);

const loadInstructions = useCallback(async () => {
  if (!user?.id) return;
  const data = await getAllInstructions(user.id);
  setInstructions(data);
}, [user?.id]);

  const handleLoadDemoData = async () => {
  if (!user?.id) return;
  const success = await loadDemoData(user.id);
  if (success) {
    await loadInstructions();
  }
};

const loadCurrentUser = useCallback(async () => {
  const current = await AuthService.getCurrentUser();
  if (current) {
    setUserData(current);
    if (onUserUpdate) {
      onUserUpdate(current);
    }
  }
}, [onUserUpdate]);

useFocusEffect(
  useCallback(() => {
    loadInstructions();
    loadCurrentUser();
  }, [loadInstructions, loadCurrentUser])
);

  const filteredInstructions = instructions.filter((instruction) => {
    const query = searchQuery.toLowerCase();
    return (
      instruction.title.toLowerCase().includes(query) ||
      instruction.category.toLowerCase().includes(query)
    );
  });

  const handleDeleteInstruction = async (id) => {
    if (!user?.id) return;
    await deleteInstruction(user.id, id);
    await loadInstructions();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Moje instrukcje</Text>
            <Text style={styles.subtitle}>
              {userData?.fullName || 'Użytkownik'} • {instructions.length}{' '}
              instrukcj{instructions.length === 1 ? 'a' : 'i'}
            </Text>
          </View>

          <Pressable
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            {userData?.avatar ? (
              <Image
                source={{ uri: userData.avatar }}
                style={styles.profileAvatarImg}
              />
            ) : (
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {userData?.fullName
                    ? userData.fullName.charAt(0).toUpperCase()
                    : 'U'}
                </Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {userData?.fullName || 'Użytkownik'}
              </Text>
            </View>
          </Pressable>
        </View>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Szukaj..."
        />

        <View style={styles.topActions}>
  <Button
    variant="secondary"
    onPress={() => navigation.navigate('Library')}
    fullWidth
  >
    Otwórz bibliotekę
  </Button>
</View>

        <View style={styles.listContainer}>
          {filteredInstructions.length > 0 ? (
            filteredInstructions.map((instruction) => (
              <InstructionCard
                key={instruction.id}
                instruction={instruction}
                image={instruction.image}
                onPress={() =>
                  navigation.navigate('InstructionDetails', {
                    instruction,
                  })
                }
                onDelete={handleDeleteInstruction}
              />
            ))
          ) : (
<View style={styles.emptyBox}>
  <Text style={styles.emptyIcon}>📭</Text>
  <Text style={styles.emptyTitle}>
    {searchQuery ? 'Instrukcje nie znalezione' : 'Brak instrukcji'}
  </Text>
  <Text style={styles.emptyText}>
    {searchQuery
      ? 'Spróbuj zmienić zapytanie wyszukiwania'
      : 'Zacznij od dodania pierwszej instrukcji'}
  </Text>

  {!searchQuery ? (
    <View style={{ marginTop: 16, width: '100%' }}>
      <Button
        variant="secondary"
        onPress={handleLoadDemoData}
        fullWidth
      >
        Załaduj dane demo
      </Button>
    </View>
  ) : null}
</View>
          )}
        </View>

        <View style={styles.fab}>
          <Button
            onPress={() => navigation.navigate('AddInstruction')}
            fullWidth
          >
            Dodaj instrukcję
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  topActions: {
  marginBottom: spacing.md,
},
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 14,
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxWidth: 160,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  profileAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    marginTop: 4,
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
  fab: {
    paddingTop: 10,
  },
});