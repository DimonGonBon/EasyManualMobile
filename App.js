import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthService } from './src/services/AuthService';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const restoredUser = await AuthService.restoreSession();
      if (restoredUser) {
        setCurrentUser(restoredUser);
      }
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <AppNavigator
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
    />
  );
}