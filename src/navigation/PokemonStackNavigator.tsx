import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PokemonScreen from '../screens/PokemonScreen';
import DetailsTabNavigator from './DetailsTabNavigator';

const Stack = createNativeStackNavigator();

const PokemonStackNavigator = () => {

    return (
        <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen name="Main">
                {props => <PokemonScreen {...props} />}
            </Stack.Screen>

            <Stack.Screen
                name="Details"
                options={({ route }) => {
                    const selectedPokemon = route.params.pokemon;
                    const headerStyle = {
                        backgroundColor: 'white',
                    };
                    return {
                        headerShown: true,
                        headerStyle,
                        headerShadowVisible: false,
                    };
                }}
            >
                {props => <DetailsTabNavigator {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default PokemonStackNavigator;