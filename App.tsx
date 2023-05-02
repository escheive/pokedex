import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pokemon } from './types';
// Screens
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'black',
    },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = ({ pokemonList }) => {
  return (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: 'gray',
            }
        }}
    >
        <Stack.Screen name="Gotta Catch Them All">
            {props => <HomeScreen {...props} pokemonList={pokemonList} />}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

function ProfileStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};


export default function App() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
            .then(response => response.json())
            .then(data => setPokemonList(data.results));
    }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" options={{ tabBarBadge: 3 }}>
            {(props) => <HomeStack {...props} pokemonList={pokemonList} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}