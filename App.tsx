// Reanimated Dependencies
import 'react-native-gesture-handler';
// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pokemon } from './types';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
// Components
import LoadingScreen from './src/components/LoadingScreen';
// Utils
import { getTypeStyle } from './src/utils/typeStyle';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const DrawerNavigator = () => {
    const { Navigator, Screen } = createDrawerNavigator();
    const navigation = useNavigation();

    const route = useRoute();

    const getHeaderTitle = (route: Route<string, object | undefined>) => {
        const routeName = route.name;
        switch (routeName) {
            case 'Pokemon':
                return 'Pokedex';
            case 'Profile':
                return 'Profile';
            case 'Settings':
                return 'Settings';
            default:
                return '';
        }
    };

    const handleNavigationStateChange = (route: Route<string, object | undefined>) => {
        const title = getHeaderTitle(route);
        navigation.setOptions({ headerTitle: title });
    };

    return (
        <Navigator
            screenOptions={{ headerShown: true }}
            drawerContent={(props) => <DrawerContent {...props} />}
            onNavigationStateChange={handleNavigationStateChange}
        >

            <Screen
                name="Pokemon"
                component={(props) => <PokemonTabNavigator {...props} pokemonList={pokemonList} typeData={typeData} />}
                options={({ route }) => ({
                    headerTitle: route.params.pokemon.name,
                })}
            />
            <Screen name="Profile" component={ProfileScreen} />
            <Screen name="Settings" component={SettingsScreen} />

        </Navigator>
    );
};


const PokemonTabNavigator = ({ pokemonList, typeData, route }) => {
    const { Navigator, Screen } = createBottomTabNavigator();

    return (
        <Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Details') {
                        iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                    } else if (route.name === 'Moves') {
                        iconName = focused ? 'ios-play-circle' : 'ios-play-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Screen name="PokemonScreen">
                {props => <PokemonScreen {...props} pokemonList={pokemonList} typeData={typeData} />}
            </Screen>

        </Navigator>
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
            <Stack.Screen name="Options" component={SettingsScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};



export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

    useEffect(() => {
        // Function to fetch base pokemon data from the api
        const fetchPokemonData = async (start, end) => {
            try {
                // Grab pokemon data using start and end variables to determine which ones are being fetched
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
                // parse the data
                const data = await response.json();

                const pokemonUrls = data.results.map((pokemon) => pokemon.url);
                const pokemonData = await Promise.all(pokemonUrls.map((url) => fetch(url).then((response) => response.json())));
                setPokemonList((prevList) => [...prevList, ...pokemonData]);
                setIsLoading(false);

                // Fetch the remaining pokemon in the background
                const remainingPokemons = 1010 - end; // Total number of pokemon - initial batch
                const batchSize = 30;

                // If there are still unfetched pokemon, keep going
                if (remainingPokemons > 0) {
                    // nextStart will be set to the current end so that we can start with the very next pokemon
                    const nextStart = end;
                    // nextEnd will be calculated based on current end and batchSize
                    const nextEnd = Math.min(end + batchSize, 1010);
                    // fetch the pokemon using the updated variables
                    fetchPokemonData(nextStart, nextEnd);
                }
            } catch (error) {
                console.error(`Error fetching pokemon data for range ${start} - ${end}:`, error)
            }
        };

        // Fetch the initial 100 pokemon on app start
        fetchPokemonData(0, 500);
    }, []);



    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>

            <Drawer.Navigator>
                <Drawer.Screen name="Pokemon">
                    {(props) => <PokemonTabNavigator {...props} pokemonList={pokemonList} typeData={typeData} />}
                </Drawer.Screen>
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
}



//     return (
//         <NavigationContainer>
//
//             <Drawer.Navigator>
//                 <Drawer.Screen name="Home">
//                     {() => (
//
//                         <Tab.Navigator
//                             screenOptions={({ route }) => ({
//                                 headerShown: false,
//                                 tabBarIcon: ({ focused, color, size }) => {
//                                     let iconName;
//
//                                     if (route.name === 'Pokemon') {
//                                         iconName = focused ? 'ios-paw' : 'ios-paw-outline';
//                                     } else if (route.name === 'Profile') {
//                                         iconName = focused ? 'person' : 'person-outline';
//                                     } else if (route.name === 'Settings') {
//                                         iconName = focused ? 'cog' : 'cog-outline';
//                                     }
//
//                                     return <Ionicons name={iconName} size={size} color={color} />;
//                                 },
//                                 'tabBarActiveTintColor': 'black',
//                                 'tabBarInactiveTintColor': 'gray',
//                             })}
//                         >
//                             <Tab.Screen name="Pokedex" options={{ tabBarBadge: 3 }}>
//                                 {(props) => <PokemonStack {...props} pokemonList={pokemonList} typeData={typeData} />}
//                             </Tab.Screen>
//                             <Tab.Screen name="Profile" component={ProfileStack} />
//                             <Tab.Screen name="Settings" component={SettingsStack} />
//                         </Tab.Navigator>
//
//                     )}
//                 </Drawer.Screen>
//             </Drawer.Navigator>
//
//         </NavigationContainer>
//     );
// }



// const PokemonStack = ({ pokemonList, typeData }) => {
//
//
//     return (
//         <Stack.Navigator
//             screenOptions={{ headerShown: false }}
//         >
//             <Stack.Screen name="Gotta Catch Them All">
//                 {props => <PokemonScreen {...props} pokemonList={pokemonList} typeData={typeData} />}
//             </Stack.Screen>
//
//             <Stack.Screen
//                 name="Details"
//                 component={DetailsScreen}
//                 options={({ route }) => {
//                     const pokemonType = route.params.pokemon.types[0].type.name;
//                     const backgroundColor = getTypeStyle(pokemonType);
//                     let pokemonName = route.params.pokemon.name;
//                     pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
//
//                     return {
//                         title: pokemonName,
//                     };
//                 }}
//             />
//         </Stack.Navigator>
//     );
// };