import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LandingScreen } from '../screens/LandingScreen';
import { HeliosScreen } from '../screens/HeliosScreen';
import { AerionScreen } from '../screens/AerionScreen';
import { AstrovirScreen } from '../screens/AstrovirScreen';
import { ChronosScreen } from '../screens/ChronosScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors, Spacing, Typography } from '../theme';
import { useSolarData } from '../hooks/useSolarData';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Tab icon component ──────────────────────────────────────────────────────
function TabIcon({ icon, label, focused, color }: {
  icon: string; label: string; focused: boolean; color: string;
}) {
  return (
    <View style={[tabStyles.iconContainer, focused && { borderTopWidth: 2, borderTopColor: color }]}>
      <Text style={[tabStyles.iconText, focused && { opacity: 1 }]}>{icon}</Text>
      <Text style={[tabStyles.iconLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Main Tab Navigator ──────────────────────────────────────────────────────
function MainTabs() {
  const solar = useSolarData();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.bg1, borderBottomColor: 'rgba(255,215,0,0.1)', borderBottomWidth: 1 },
        headerTintColor: Colors.solar,
        headerTitleStyle: { fontFamily: 'Courier', fontSize: 12, letterSpacing: 3 },
        tabBarStyle: {
          backgroundColor: Colors.bg1,
          borderTopColor: 'rgba(255,215,0,0.08)',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.solar,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Helios"
        component={HeliosScreen}
        options={{
          title: '☀ HELIOS — Inteligencia Solar',
          headerRight: () => (
            <View style={headerStyles.badge}>
              <View style={[headerStyles.dot, { backgroundColor: solar.kp > 5 ? Colors.danger : Colors.success }]} />
              <Text style={headerStyles.kpText}>Kp {solar.kp.toFixed(1)}</Text>
            </View>
          ),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="☀" label="HELIOS" focused={focused} color={Colors.helios} />
          ),
        }}
      />
      <Tab.Screen
        name="Aerion"
        component={AerionScreen}
        options={{
          title: '⚡ AERION — Ionización',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="⚡" label="AERION" focused={focused} color={Colors.aerion} />
          ),
        }}
      />
      <Tab.Screen
        name="Astrovir"
        component={AstrovirScreen}
        options={{
          title: '🦠 ASTROVIR — Vigilancia',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🦠" label="ASTROVIR" focused={focused} color={Colors.astrovir} />
          ),
        }}
      />
      <Tab.Screen
        name="Chronos"
        component={ChronosScreen}
        options={{
          title: '⏱ CHRONOS — Sincronización',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="⏱" label="CHRONOS" focused={focused} color={Colors.chronos} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '◉ PERFIL',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="◉" label="PERFIL" focused={focused} color={Colors.solar} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Stack Navigator ────────────────────────────────────────────────────
export function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: Colors.solar,
          background: Colors.bg0,
          card: Colors.bg1,
          text: Colors.textPrimary,
          border: 'rgba(255,215,0,0.1)',
          notification: Colors.danger,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center', paddingTop: 6, paddingHorizontal: 4,
    borderTopWidth: 2, borderTopColor: 'transparent',
  },
  iconText: { fontSize: 18, opacity: 0.5 },
  iconLabel: { fontSize: 7, fontFamily: 'Courier', letterSpacing: 1, marginTop: 2 },
});

const headerStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginRight: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,215,0,0.15)',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  kpText: { color: Colors.textSecondary, fontSize: 11, fontFamily: 'Courier' },
});
