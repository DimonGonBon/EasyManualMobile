import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const CURRENT_USER_KEY = 'current_user';
const USER_PROFILE_PREFIX = 'user_profile_';

const getProfileKey = (userId) => `${USER_PROFILE_PREFIX}${userId}`;

export const AuthService = {
  async getLocalProfile(userId) {
    try {
      const data = await AsyncStorage.getItem(getProfileKey(userId));
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting local profile:', error);
      return {};
    }
  },

  async saveLocalProfile(userId, profileData) {
    try {
      await AsyncStorage.setItem(
        getProfileKey(userId),
        JSON.stringify(profileData)
      );
      return true;
    } catch (error) {
      console.error('Error saving local profile:', error);
      return false;
    }
  },

  async getCurrentUser() {
    try {
      const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!data) return null;

      const user = JSON.parse(data);
      const localProfile = await this.getLocalProfile(user.id);

      return {
        ...user,
        ...localProfile,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async register(email, password, fullName) {
    try {
      if (!email || !password || !fullName) {
        return { success: false, error: 'Wszystkie pola są wymagane' };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Hasło musi mieć co najmniej 6 znaków',
        };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Niepoprawny adres email' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const userToSave = {
        id: data.user?.id,
        email: data.user?.email,
        fullName,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave));
      await this.saveLocalProfile(userToSave.id, { avatar: null });

      return {
        success: true,
        user: {
          ...userToSave,
          avatar: null,
        },
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: 'Błąd rejestracji' };
    }
  },

  async login(email, password) {
    try {
      if (!email || !password) {
        return { success: false, error: 'Wpisz email i hasło' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const baseUser = {
        id: data.user?.id,
        email: data.user?.email,
        fullName: data.user?.user_metadata?.fullName || '',
      };

      const localProfile = await this.getLocalProfile(baseUser.id);

      const userToSave = {
        ...baseUser,
        ...localProfile,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave));

      return { success: true, user: userToSave };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: 'Błąd logowania' };
    }
  },

  async loginWithGoogle() {
    try {
const redirectTo = AuthSession.makeRedirectUri({
  scheme: 'easymanualmobile',
  path: 'auth',
});

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data?.url) {
        return {
          success: false,
          error: 'Nie udało się uruchomić logowania Google',
        };
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type !== 'success' || !result.url) {
        return {
          success: false,
          error: 'Logowanie przez Google zostało anulowane',
        };
      }

      const url = result.url;

      const accessTokenMatch = url.match(/access_token=([^&]+)/);
      const refreshTokenMatch = url.match(/refresh_token=([^&]+)/);

      const access_token = accessTokenMatch
        ? decodeURIComponent(accessTokenMatch[1])
        : null;
      const refresh_token = refreshTokenMatch
        ? decodeURIComponent(refreshTokenMatch[1])
        : null;

      if (!access_token || !refresh_token) {
        const restoredUser = await this.restoreSession();
        if (restoredUser) {
          return { success: true, user: restoredUser };
        }

        return {
          success: false,
          error: 'Nie udało się pobrać sesji Google',
        };
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

      if (sessionError) {
        return { success: false, error: sessionError.message };
      }

      const baseUser = {
        id: sessionData.user?.id,
        email: sessionData.user?.email,
        fullName:
          sessionData.user?.user_metadata?.fullName ||
          sessionData.user?.user_metadata?.full_name ||
          sessionData.user?.user_metadata?.name ||
          '',
      };

      const localProfile = await this.getLocalProfile(baseUser.id);

      const userToSave = {
        ...baseUser,
        ...localProfile,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave));

      return { success: true, user: userToSave };
    } catch (error) {
      console.error('Error logging in with Google:', error);
      return { success: false, error: 'Błąd logowania przez Google' };
    }
  },

  async logout() {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: 'Błąd wylogowania' };
    }
  },

  async isLoggedIn() {
    const user = await this.getCurrentUser();
    return user !== null;
  },

  async restoreSession() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      const baseUser = {
        id: data.user.id,
        email: data.user.email,
        fullName:
          data.user.user_metadata?.fullName ||
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          '',
      };

      const localProfile = await this.getLocalProfile(baseUser.id);

      const userToSave = {
        ...baseUser,
        ...localProfile,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave));
      return userToSave;
    } catch (error) {
      console.error('Error restoring session:', error);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const user = await this.getCurrentUser();

      if (!user) {
        return { success: false, error: 'Użytkownik nie jest zalogowany' };
      }

      if (!currentPassword) {
        return { success: false, error: 'Wpisz obecne hasło' };
      }

      if (!newPassword || newPassword.length < 6) {
        return {
          success: false,
          error: 'Nowe hasło musi mieć co najmniej 6 znaków',
        };
      }

      if (currentPassword === newPassword) {
        return {
          success: false,
          error: 'Nowe hasło musi być inne niż obecne',
        };
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (loginError) {
        return { success: false, error: 'Obecne hasło jest niepoprawne' };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, error: 'Błąd zmiany hasła' };
    }
  },

  async updateAvatar(avatar) {
    try {
      const currentUser = await this.getCurrentUser();

      if (!currentUser) {
        return { success: false, error: 'Użytkownik nie jest zalogowany' };
      }

      const updatedProfile = {
        ...(await this.getLocalProfile(currentUser.id)),
        avatar,
      };

      await this.saveLocalProfile(currentUser.id, updatedProfile);

      const updatedUser = {
        ...currentUser,
        avatar,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating avatar:', error);
      return { success: false, error: 'Błąd aktualizacji avatara' };
    }
  },
};

export default AuthService;