import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monorepo Mobile</Text>
        <Text style={styles.subtitle}>EXPO + EXPO ROUTER + CONVEX</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.card}>
          <Pressable 
            style={styles.button}
            onPress={() => setCount(c => c + 1)}
          >
            <Text style={styles.buttonText}>Count is {count}</Text>
          </Pressable>
          <Text style={styles.hint}>
            Edit <Text style={styles.code}>app/index.tsx</Text> to see changes
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Monorepo Structure</Text>
          
          <View style={styles.listItem}>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>apps/web</Text> - React + Vite app
            </Text>
          </View>
          
          <View style={styles.listItem}>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>apps/mobile</Text> - This Expo app
            </Text>
          </View>
          
          <View style={styles.listItem}>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>packages/backend</Text> - Convex backend
            </Text>
          </View>
          
          <View style={styles.listItem}>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.listText}>
              <Text style={styles.bold}>packages/shared</Text> - Shared utilities
            </Text>
          </View>
        </View>

        <Link href="/(tabs)" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonText}>Go to Tabs →</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>BUILT WITH BUN, TURBOREPO, AND ❤️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e2e',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#e4e4ed',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#8888a0',
    letterSpacing: 3,
  },
  main: {
    flex: 1,
    gap: 24,
  },
  card: {
    backgroundColor: '#12121a',
    borderWidth: 1,
    borderColor: '#1e1e2e',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  button: {
    borderWidth: 2,
    borderColor: '#ff6b35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ff6b35',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    color: '#8888a0',
    fontSize: 14,
  },
  code: {
    color: '#10b981',
    backgroundColor: '#0a0a0f',
  },
  info: {
    backgroundColor: '#12121a',
    borderWidth: 1,
    borderColor: '#1e1e2e',
    borderRadius: 12,
    padding: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#e4e4ed',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  arrow: {
    color: '#ff6b35',
    marginRight: 12,
  },
  listText: {
    color: '#8888a0',
    fontSize: 14,
    flex: 1,
  },
  bold: {
    color: '#e4e4ed',
    fontWeight: '700',
  },
  navButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#0a0a0f',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e1e2e',
    marginTop: 24,
  },
  footerText: {
    color: '#8888a0',
    fontSize: 10,
    letterSpacing: 2,
  },
});
