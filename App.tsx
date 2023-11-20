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
import store from './src/store';
import { useAppDispatch, useAppSelector } from './src/hooks';
import { Provider } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
// import { Provider, connect } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import rootReducer from './src/reducers/rootReducer';
// import { persistor, store } from './src/reducers/configureStore';
// // Redux-Persist
// import { PersistGate } from 'redux-persist/integration/react';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WhosThatPokemonScreen from './src/screens/WhosThatPokemonScreen';
// Components
import LoadingScreen from './src/components/LoadingScreen';
// Navigation
import PokemonStackNavigator from './src/navigation/PokemonStackNavigator';
import ProfileStack from './src/navigation/ProfileStack';
import SettingsStack from './src/navigation/SettingsStack';
// Utils
import { database } from './src/utils/database/database';
import { resetPokemonTable } from './src/utils/database/pokemonDatabase';
import { resetAbilitiesTable } from './src/utils/database/abilitiesDatabase';
import { resetMovesTable } from './src/utils/database/movesDatabase';
import { pokemonColors } from './src/utils/typeStyle';
// Services
// import { fetchPokemonData } from './src/services/pokemonService';
import { fetchPokemonData } from './src/store/reducers/pokemonSlice';
import { fetchAbilitiesData } from './src/services/abilitiesService';
import { fetchMovesData } from './src/services/movesService';
// Database
import SQLite from 'react-native-sqlite-storage';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';

// const store = createStore(rootReducer, applyMiddleware(thunk));
const Drawer = createDrawerNavigator();


const App = () => {
//     const dispatch = useDispatch();
  const dispatch = useAppDispatch();
    const isAbilitiesLoading = false;
    const isPokemonLoading = false;
//     const isPokemonLoading = useSelector((state) => state.pokemon.loading);
//     const isAbilitiesLoading = useSelector((state) => state.abilities.loading);

    useEffect(() => {
//         resetAbilitiesTable();
//         resetPokemonTable();
//         resetMovesTable();
          dispatch(fetchPokemonData());
//             .then(() => dispatch(fetchAbilitiesData()))
//             .then(() => dispatch(fetchMovesData()))
//             .catch((error) => console.error('Error in app.tsx useEffect fetching either pokemon or abilities:', error))
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
                <Drawer.Screen name="Who's That Pokémon!" component={WhosThatPokemonScreen} />
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