import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { AuthError } from '@/src/services/authTypes';
import { theme } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { provider, signIn, signUp, resetPassword, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    setMessage('');

    try {
      if (mode === 'signup') {
        await signUp({ email: email.trim(), password });
      } else {
        await signIn({ email: email.trim(), password });
      }

      router.replace('/profile');
    } catch (error) {
      setMessage(
        error instanceof AuthError ? error.message : 'We could not complete sign-in right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword() {
    setMessage('');

    try {
      await resetPassword(email.trim());
      setMessage('Password reset instructions were sent to your email.');
    } catch (error) {
      setMessage(
        error instanceof AuthError ? error.message : 'We could not send the reset email right now.',
      );
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
            {isAuthenticated ? 'Signed In' : provider === 'firebase' ? 'Firebase Auth' : 'Demo Auth'}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 26, fontWeight: '800', marginTop: 6 }}>
            {isAuthenticated ? 'Your account is active' : 'Sign in to SportStream Africa'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.panel,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="close" size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 20,
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 20,
          gap: 16,
        }}
      >
        <View
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: theme.colors.panelSoft,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: '700' }}>
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: theme.colors.muted, fontSize: 13 }}>Email</Text>
          <TextInput
            placeholder="name@example.com"
            placeholderTextColor={theme.colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{
              height: 52,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.bg,
              color: theme.colors.text,
              paddingHorizontal: 14,
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: theme.colors.muted, fontSize: 13 }}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{
              height: 52,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.bg,
              color: theme.colors.text,
              paddingHorizontal: 14,
            }}
          />
        </View>

        {message ? (
          <View
            style={{
              backgroundColor: theme.colors.panelSoft,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 12,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 13, lineHeight: 18 }}>{message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: theme.colors.gold,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 4,
            opacity: isSubmitting ? 0.75 : 1,
          }}
        >
          <Text style={{ color: '#111111', fontSize: 15, fontWeight: '800' }}>
            {isSubmitting ? 'Working...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResetPassword} style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.colors.gold, fontSize: 13, fontWeight: '600' }}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.panelSoft,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 8,
        }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700' }}>No account yet?</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 14, lineHeight: 20 }}>
          Create an account to save your teams, notifications, and preferred leagues.
        </Text>
        <TouchableOpacity
          onPress={() => {
            setMode((currentMode) => (currentMode === 'signup' ? 'signin' : 'signup'));
            setMessage('');
          }}
          style={{ alignSelf: 'flex-start', marginTop: 6 }}
        >
          <Text style={{ color: theme.colors.gold, fontSize: 13, fontWeight: '700' }}>
            {mode === 'signup' ? 'Back to sign in' : 'Create account'}
          </Text>
        </TouchableOpacity>

        {provider === 'mock' ? (
          <Text style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>
            Demo mode: use demo@sportstream.africa with password123.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
