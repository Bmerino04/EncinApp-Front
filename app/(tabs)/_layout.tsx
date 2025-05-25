import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
