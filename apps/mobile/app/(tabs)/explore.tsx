import { View, Text, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🔍</Text>
        <Text style={styles.heroTitle}>Explore</Text>
        <Text style={styles.heroSubtitle}>
          Resources to help you learn more about the stack
        </Text>
      </View>

      {resources.map((resource, index) => (
        <Pressable
          key={index}
          style={styles.card}
          onPress={() => openLink(resource.url)}
        >
          <Text style={styles.cardTitle}>{resource.title}</Text>
          <Text style={styles.cardDescription}>{resource.description}</Text>
          <Text style={styles.cardLink}>Open →</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    padding: 20,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#e4e4ed',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#8888a0',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#12121a',
    borderWidth: 1,
    borderColor: '#1e1e2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e4e4ed',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#8888a0',
    marginBottom: 12,
  },
  cardLink: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
});
