import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pokemon } from './types';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
// Utils
import { getTypeStyle } from './src/utils/typeStyle';
// Assets
import typeData from './src/assets/typeData';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const PokemonStack = ({ pokemonList, typeData }) => {
//  // TODO
//     const [selectedPokemonTypeData, setSelectedPokemonTypeData] = useState(null);


    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent',
                },
                headerTitleAlign: 'center',
            }}
        >
        <Stack.Screen name="Gotta Catch Them All">
            {props => <PokemonScreen {...props} pokemonList={pokemonList} typeData={typeData} />}
        </Stack.Screen>
        <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={({ route }) => {
                const pokemonType = route.params.pokemon.types[0].type.name;
                const backgroundColor = getTypeStyle(pokemonType);

                return {
                    title: route.params.pokemon.name,
                    headerStyle: {
                        backgroundColor: `rgba(${backgroundColor.backgroundColor}, 0.5)`,
                    },
                    headerTintColor: 'white',
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                };
            }}
        />
        </Stack.Navigator>
    );
};

function ProfileStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="User" component={ProfileScreen} />
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
        fetch('https://pokeapi.co/api/v2/pokemon?limit=60')
            .then(response => response.json())
            .then(data => {
                // Use `Promise.all()` to fetch data for each Pokemon in parallel
                const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
                return Promise.all(promises);
            })
            .then(data => setPokemonList(data))
            .catch(error => console.error(error))

//         grabTypesData();
    }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Pokemon" options={{ tabBarBadge: 3 }}>
            {(props) => <PokemonStack {...props} pokemonList={pokemonList} typeData={typeData} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}