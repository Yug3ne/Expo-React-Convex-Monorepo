import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: '#8888a0',
        tabBarStyle: {
          backgroundColor: '#12121a',
          borderTopColor: '#1e1e2e',
        },
        headerStyle: {
          backgroundColor: '#0a0a0f',
        },
        headerTintColor: '#e4e4ed',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
        }}
      />
    </Tabs>
  );
}
