// Reanimated Dependencies
import 'react-native-gesture-handler';
// Tensorflow
import * as tf from '@tensorflow/tfjs';
// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute, useRoute, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './src/reducers/rootReducer';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
// Components
import LoadingScreen from './src/components/LoadingScreen';
// Navigation
import PokemonStackNavigator from './src/navigation/PokemonStackNavigator';
import ProfileStack from './src/navigation/ProfileStack';
import SettingsStack from './src/navigation/SettingsStack';
// Utils
import { database, resetPokemonTable, resetAbilitiesTable } from './src/utils/database';
import { pokemonColors } from './src/utils/typeStyle';
// Services
import { fetchPokemonData } from './src/services/pokemonService';
import { fetchAbilitiesData } from './src/services/abilitiesService';
// Database
import SQLite from 'react-native-sqlite-storage';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';


const store = createStore(rootReducer, applyMiddleware(thunk));
const Drawer = createDrawerNavigator();


const App = () => {
    const dispatch = useDispatch();
    const isPokemonLoading = useSelector((state) => state.pokemon.loading);
    const isAbilitiesLoading = useSelector((state) => state.abilities.loading);

    useEffect(() => {
//         resetAbilitiesTable();
//         resetPokemonTable();
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
        <NavigationContainer style={styles.container}>

            <Drawer.Navigator
                screenOptions={({ route }) => ({
                    headerTitle: getFocusedRouteNameFromRoute(route),
                    headerShown: getFocusedRouteNameFromRoute(route) !== 'Details',
                })}
            >
                <Drawer.Screen name="Pokemon">
                    {(props) => <PokemonStackNavigator {...props} />}
                </Drawer.Screen>
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    }
});

export default function AppWrapper() {
    return (
        <Provider store={store}>
            <App database={database} />
        </Provider>
    );
}