import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddInstructionScreen from '../screens/AddInstructionScreen';
import InstructionDetailsScreen from '../screens/InstructionDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LibraryScreen from '../screens/LibraryScreen';
import PublicInstructionDetailsScreen from '../screens/PublicInstructionDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ currentUser, setCurrentUser }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <>
            <Stack.Screen name="Splash">
              {(props) => <SplashScreen {...props} currentUser={currentUser} />}
            </Stack.Screen>

            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={(user) => setCurrentUser(user)}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Register">
              {(props) => (
                <RegisterScreen
                  {...props}
                  onRegisterSuccess={(user) => setCurrentUser(user)}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          
            <>
  <Stack.Screen name="Home">
    {(props) => (
      <HomeScreen
        {...props}
        user={currentUser}
        onLogout={() => {
          setCurrentUser(null);
        }}
        onUserUpdate={setCurrentUser}
      />
    )}
  </Stack.Screen>

  <Stack.Screen name="Library">
    {(props) => <LibraryScreen {...props} />}
  </Stack.Screen>
  

  <Stack.Screen name="AddInstruction">
    {(props) => (
      <AddInstructionScreen {...props} user={currentUser} />
    )}
  </Stack.Screen>

  <Stack.Screen name="InstructionDetails">
    {(props) => (
      <InstructionDetailsScreen {...props} user={currentUser} />
    )}
  </Stack.Screen>

<Stack.Screen name="PublicInstructionDetails">
  {(props) => (
    <PublicInstructionDetailsScreen
      {...props}
      user={currentUser}
    />
  )}
</Stack.Screen>

  <Stack.Screen name="Profile">
    {(props) => (
      <ProfileScreen
        {...props}
        user={currentUser}
        onUserUpdate={setCurrentUser}
        onLogout={() => {
          setCurrentUser(null);
        }}
      />
    )}
  </Stack.Screen>
</>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}