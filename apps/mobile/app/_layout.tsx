// Import global CSS for NativeWind
import '../global.css';

// Import polyfills FIRST - before any Convex imports
import '../polyfills';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';
import { View, Text } from 'react-native';
import { useMemo } from 'react';

const convexUrl = Constants.expoConfig?.extra?.convexUrl;

function ConvexNotConfigured() {
  return (
    <View className="flex-1 bg-dark-bg items-center justify-center p-5">
      <Text className="text-5xl mb-4">⚠️</Text>
      <Text className="text-2xl text-primary font-semibold mb-2">Convex Not Configured</Text>
      <Text className="text-sm text-muted text-center mb-6">
        Update your convexUrl in app.json under expo.extra
      </Text>
      <View className="bg-dark-card p-4 rounded-lg">
        <Text className="text-success font-mono text-xs">"extra": {'{'}</Text>
        <Text className="text-success font-mono text-xs">  "convexUrl": "https://your-url.convex.cloud"</Text>
        <Text className="text-success font-mono text-xs">{'}'}</Text>
      </View>
    </View>
  );
}

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
