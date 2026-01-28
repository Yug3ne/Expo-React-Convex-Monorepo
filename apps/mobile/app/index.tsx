import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View className="flex-1 bg-dark-bg p-5">
      <View className="items-center py-8 border-b border-dark-border mb-8">
        <Text className="text-4xl font-light italic text-primary mb-2">Monorepo Mobile</Text>
        <Text className="text-xs text-muted tracking-widest">EXPO + EXPO ROUTER + CONVEX</Text>
      </View>

      <View className="flex-1 gap-6">
        <View className="bg-dark-card border border-dark-border rounded-xl p-6 items-center">
          <Pressable 
            className="border-2 border-accent py-4 px-8 rounded-lg mb-4"
            onPress={() => setCount(c => c + 1)}
          >
            <Text className="text-accent text-base font-semibold">Count is {count}</Text>
          </Pressable>
          <Text className="text-muted text-sm">
            Edit <Text className="text-success bg-dark-bg">app/index.tsx</Text> to see changes
          </Text>
        </View>

        <View className="bg-dark-card border border-dark-border rounded-xl p-6">
          <Text className="text-xl font-light italic text-primary mb-4">Monorepo Structure</Text>
          
          <View className="flex-row mb-3">
            <Text className="text-accent mr-3">→</Text>
            <Text className="text-muted text-sm flex-1">
              <Text className="text-primary font-bold">apps/web</Text> - React + Vite app
            </Text>
          </View>
          
          <View className="flex-row mb-3">
            <Text className="text-accent mr-3">→</Text>
            <Text className="text-muted text-sm flex-1">
              <Text className="text-primary font-bold">apps/mobile</Text> - This Expo app
            </Text>
          </View>
          
          <View className="flex-row mb-3">
            <Text className="text-accent mr-3">→</Text>
            <Text className="text-muted text-sm flex-1">
              <Text className="text-primary font-bold">packages/backend</Text> - Convex backend
            </Text>
          </View>
          
          <View className="flex-row">
            <Text className="text-accent mr-3">→</Text>
            <Text className="text-muted text-sm flex-1">
              <Text className="text-primary font-bold">packages/shared</Text> - Shared utilities
            </Text>
          </View>
        </View>

        <Link href="/(tabs)" asChild>
          <Pressable className="bg-accent py-4 px-8 rounded-lg items-center">
            <Text className="text-dark-bg text-base font-bold">Go to Tabs →</Text>
          </Pressable>
        </Link>
      </View>

      <View className="items-center py-5 border-t border-dark-border mt-6">
        <Text className="text-muted text-[10px] tracking-widest">BUILT WITH BUN, TURBOREPO, AND ❤️</Text>
      </View>
    </View>
  );
}
