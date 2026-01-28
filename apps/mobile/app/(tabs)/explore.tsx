import { View, Text, ScrollView, Linking, Pressable } from 'react-native';

const resources = [
  {
    title: 'Expo Router Docs',
    description: 'Learn about file-based routing with Expo Router',
    url: 'https://docs.expo.dev/router/introduction/',
  },
  {
    title: 'Convex Docs',
    description: 'Real-time backend with TypeScript',
    url: 'https://docs.convex.dev/',
  },
  {
    title: 'Turborepo Docs',
    description: 'High-performance build system for monorepos',
    url: 'https://turbo.build/repo/docs',
  },
  {
    title: 'Bun Docs',
    description: 'Fast JavaScript runtime and package manager',
    url: 'https://bun.sh/docs',
  },
];

export default function ExploreScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="flex-1 bg-dark-bg" contentContainerClassName="p-5">
      <View className="items-center py-8 mb-6">
        <Text className="text-6xl mb-4">🔍</Text>
        <Text className="text-3xl font-light italic text-primary mb-2">Explore</Text>
        <Text className="text-sm text-muted text-center">
          Resources to help you learn more about the stack
        </Text>
      </View>

      {resources.map((resource, index) => (
        <Pressable
          key={index}
          className="bg-dark-card border border-dark-border rounded-xl p-5 mb-3"
          onPress={() => openLink(resource.url)}
        >
          <Text className="text-lg font-semibold text-primary mb-1">{resource.title}</Text>
          <Text className="text-sm text-muted mb-3">{resource.description}</Text>
          <Text className="text-sm text-accent font-semibold">Open →</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
