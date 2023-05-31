// Reanimated Dependencies
import 'react-native-gesture-handler';
// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute, useRoute, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pokemon } from './types';



// Redux
import { useSelector, useDispatch } from 'react-redux';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './src/reducers/rootReducer';
// import store from './src/reducers/store';



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
import { database, resetPokemonTable, resetAbilitiesTable } from './src/utils/database';
import { pokemonColors } from './src/utils/typeStyle';
// Database
import SQLite from 'react-native-sqlite-storage';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';



const store = createStore(rootReducer, applyMiddleware(thunk));



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
//     const navigation = useNavigation();
//     const route = useRoute();


    const handleNavigationStateChange = (route: Route<string, object | undefined>) => {
        const title = getHeaderTitle(route);
        navigation.setOptions({
            headerTitle: title,
        });
    };

    return (
        <Navigator
            initialRouteName="Pokemon"
            screenOptions={{
                headerShown: true
            }}
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


const PokemonStackNavigator = ({ setPokemonList, pokemonList, typeData, allPokemonAbilities }) => {

    return (
        <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen name="Main">
                {props => <PokemonScreen {...props} setPokemonList={setPokemonList} pokemonList={pokemonList} typeData={typeData} />}
            </Stack.Screen>

            <Stack.Screen
                name="Details"
                options={({ route }) => {
                    const selectedPokemon = route.params.pokemon;
                    const headerStyle = {
                        backgroundColor: 'transparent',
                    };
                    return {
                        headerShown: true,
                        headerStyle,
                        headerShadowVisible: false,
                    };
                }}
            >
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


const App = ({ typeData }) => {
    const dispatch = useDispatch();
    const isPokemonLoading = useSelector((state) => state.pokemon.loading);
    const isAbilitiesLoading = useSelector((state) => state.abilities.loading);
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);
    const allPokemonAbilities = useSelector((state) => state.abilities.abilitiesData);

    useEffect(() => {
//         resetAbilitiesTable();
//         resetPokemonTable(database);
        dispatch(fetchPokemonData())
            .then(() => dispatch(fetchAbilitiesData()))
            .catch((error) => console.error('Error in app.tsx useEffect fetching either pokemon or abilities:', error))
    }, [dispatch]);

    let loadingText = '';
    if (isPokemonLoading) {
        loadingText = 'Loading Pokemon...'
    } else if (isAbilitiesLoading) {
        loadingText = 'Loading Abilities...'
    }

    if (isPokemonLoading || isAbilitiesLoading) {
        return <LoadingScreen loadingText={loadingText} />;
    }

    return (
        <NavigationContainer>

            <Drawer.Navigator
                screenOptions={({ route }) => {
                    const headerTitle = getHeaderTitle(route);
                    return {
                        headerTitle: headerTitle,
                        headerShown: headerTitle !== 'Details',
                    }
                }}
            >
                <Drawer.Screen name="Pokemon">
                    {(props) => <PokemonStackNavigator {...props} pokemonList={pokemonList} typeData={typeData} allPokemonAbilities={allPokemonAbilities} database={database} />}
                </Drawer.Screen>
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
};

export default function AppWrapper() {
    return (
        <Provider store={store}>
            <App database={database} />
        </Provider>
    );
}

