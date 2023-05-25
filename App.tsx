// Reanimated Dependencies
import 'react-native-gesture-handler';
// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pokemon } from './types';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MovesScreen from './src/screens/MovesScreen';
// Components
import LoadingScreen from './src/components/LoadingScreen';
// Utils
import { getTypeStyle } from './src/utils/typeStyle';
import { capitalizeString } from './src/utils/helpers';
import { fetchPokemonData, fetchPokemonFromAPI, fetchAbilitiesData, fetchAbilitiesFromAPI } from './src/utils/api';
// Database
import SQLite from 'react-native-sqlite-storage';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const BackButton = ({ navigation }) => {
    const handleGoToMainPokemonScreen = () => {
        navigation.goBack();
    };

    return (
        <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleGoToMainPokemonScreen}
        />
    );
};


const getHeaderTitle = (route: Route<string, object | undefined>) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        switch (routeName) {
            case 'Main':
                return 'Pokedex';
            case 'Details':
                return 'Details';
            case 'Info':
                return 'Info';
            case 'Profile':
                return 'Profile';
            case 'Settings':
                return 'Settings';
            default:
                return 'Pokedex';
        }
    };


const DrawerNavigator = () => {
    const { Navigator, Screen } = createDrawerNavigator();
    const navigation = useNavigation();
    const route = useRoute();


    const handleNavigationStateChange = (route: Route<string, object | undefined>) => {
        const title = getHeaderTitle(route);
        if (title === 'Details') {
            navigation.setOptions({
                headerShown: false,
            })
        } else
        navigation.setOptions({
            headerTitle: title,
        });
    };

    return (
        <Navigator
            initialRouteName="Pokemon"
            drawerContent={(props) => <DrawerContent {...props} />}
            onNavigationStateChange={handleNavigationStateChange}
        >
            <Screen
                name="Pokemon"
                component={PokemonStackNavigator}
            />
            <Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Screen
                name="Settings"
                component={SettingsScreen}
            />

        </Navigator>
    );
};


const DetailsTabNavigator = ({ pokemonList, typeData, route, allPokemonAbilities, navigation }) => {
    const { Navigator, Screen } = createBottomTabNavigator();

    const selectedPokemon = route.params.pokemon;

    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Info') {
                        iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                    } else if (route.name === 'Moves') {
                        iconName = focused ? 'shield' : 'shield-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Screen
                name='Info'
                initialParams={{ pokemon: selectedPokemon }}
            >
                {props => <DetailsScreen {...props} allPokemonAbilities={allPokemonAbilities} />}
            </Screen>
            <Screen
                name="Moves"
                component={MovesScreen}
                initialParams={{ pokemon: selectedPokemon }}
            />

        </Navigator>
    );
};


const PokemonStackNavigator = ({ pokemonList, typeData, allPokemonAbilities, navigation, route }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen name="Main">
                {props => <PokemonScreen {...props} pokemonList={pokemonList} typeData={typeData} />}
            </Stack.Screen>

            <Stack.Screen name="Details">
                {props => <DetailsTabNavigator {...props} allPokemonAbilities={allPokemonAbilities} />}
            </Stack.Screen>
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
            <Stack.Screen name="Options" component={SettingsScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};




// Open the database
const database = SQLite.openDatabase({
    name: 'Pokemon.db',
    location: 'default',
});




export default function App() {
    const [isLoading, setIsLoading] = useState("Loading...");
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [allPokemonAbilities, setAllPokemonAbilities] = useState([]);

    useEffect(() => {

//         resetAbilitiesTable();
//         resetPokemonTable(database);
        fetchPokemonData(database, setIsLoading, setPokemonList)
            .then(() => fetchAbilitiesData(database, setIsLoading, setAllPokemonAbilities))
            .catch((error) => console.error('Error in app.tsx useEffect fetching either pokemon or abilities:', error))
            .finally(() => setIsLoading(false));
    }, []);


    if (isLoading) {
        return <LoadingScreen isLoading={isLoading} />;
    }

    return (
        <NavigationContainer>

            <Drawer.Navigator>
                <Drawer.Screen
                    name="Pokemon"
                    options={({ route }) => ({
                        headerTitle: getHeaderTitle(route)
                    })}
                >
                    {(props) => <PokemonStackNavigator {...props} pokemonList={pokemonList} typeData={typeData} allPokemonAbilities={allPokemonAbilities} />}
                </Drawer.Screen>
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
}


