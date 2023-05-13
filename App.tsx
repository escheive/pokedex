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
            // Function to fetch base pokemon data from the api
            const fetchPokemonData = async (start, end) => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
                    const data = await response.json();
                    const pokemonUrls = data.results.map((pokemon) => pokemon.url);
                    const pokemonData = await Promise.all(pokemonUrls.map((url) => fetch(url).then((response) => response.json())));
                    setPokemonList((prevList) => [...prevList, ...pokemonData]);

                    // Fetch the remaining pokemon in the background
                    const remainingPokemons = 1010 - end; // Total number of pokemon - initial batch
                    const batchSize = 20;

                    if (remainingPokemons > 0) {
                        const nextStart = end;
                        const nextEnd = Math.min(end + batchSize, 1010);
                        fetchPokemonData(nextStart, nextEnd);
                    }
                } catch (error) {
                    console.error(`Error fetching pokemon data for range ${start} - ${end}:`, error)
                }
            };

            // Fetch the initial 60 pokemon
            fetchPokemonData(0, 60);

//             // Fetch the remaining pokemon in the background
//             const remainingPokemons = 1010 - end; // Total number of pokemon - initial batch
//             const batchSize = 20;
//
//             if (remainingPokemons > 0) {
//                 const nextStart = end;
//                 const nextEnd = Math.min(end + batchSize, 1010);
//                 fetchPokemonData(nextStart, nextEnd);
//             }

//             for (let i=0; i < totalBatches; i++) {
//                 const start = 60 + i * batchSize;
//                 const end = start + batchSize;
//                 fetchPokemonData(start, end);
//             }
        }, []);

//     useEffect(() => {
//         fetch('https://pokeapi.co/api/v2/pokemon?limit=60')
//             .then(response => response.json())
//             .then(data => {
//                 // Use `Promise.all()` to fetch data for each Pokemon in parallel
//                 const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
//                 return Promise.all(promises);
//             })
//             .then(data => setPokemonList(data))
//             .catch(error => console.error(error))
//
//     }, []);

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