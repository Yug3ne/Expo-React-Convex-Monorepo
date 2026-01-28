import { View, Text, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 bg-dark-bg items-center justify-center p-5">
        <Text className="text-6xl mb-6">🤔</Text>
        <Text className="text-3xl font-light italic text-primary mb-2">Page Not Found</Text>
        <Text className="text-base text-muted mb-8">This screen doesn't exist.</Text>
        
        <Link href="/" asChild>
          <Pressable className="border-2 border-accent py-4 px-8 rounded-lg">
            <Text className="text-accent text-base font-semibold">Go to Home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
