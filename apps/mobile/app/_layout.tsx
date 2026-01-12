// Import polyfills FIRST - before any Convex imports
import '../polyfills';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';

const convexUrl = Constants.expoConfig?.extra?.convexUrl;

function ConvexNotConfigured() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>Convex Not Configured</Text>
      <Text style={styles.subtitle}>
        Update your convexUrl in app.json under expo.extra
      </Text>
      <View style={styles.codeBlock}>
        <Text style={styles.code}>"extra": {'{'}</Text>
        <Text style={styles.code}>  "convexUrl": "https://your-url.convex.cloud"</Text>
        <Text style={styles.code}>{'}'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, color: '#e4e4ed', fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8888a0', textAlign: 'center', marginBottom: 24 },
  codeBlock: { backgroundColor: '#12121a', padding: 16, borderRadius: 8 },
  code: { color: '#10b981', fontFamily: 'monospace', fontSize: 12 },
});

export default function RootLayout() {
  // Create the Convex client inside the component to avoid module-level initialization issues
  const convex = useMemo(() => {
    if (!convexUrl || convexUrl === 'YOUR_CONVEX_URL_HERE') {
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, []);

  if (!convex) {
    return (
      <>
        <ConvexNotConfigured />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0f',
          },
          headerTintColor: '#e4e4ed',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#0a0a0f',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Home',
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: false,
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </ConvexProvider>
  );
}
