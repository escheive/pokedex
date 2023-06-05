import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DetailsScreen from '../screens/DetailsScreen';
import MovesScreen from '../screens/MovesScreen';

const Tab = createBottomTabNavigator();

const DetailsTabNavigator = ({ route, navigation }) => {
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
                {props => <DetailsScreen {...props} navigation={navigation} />}
            </Screen>
            <Screen
                name="Moves"
                initialParams={{ pokemon: selectedPokemon }}
            >
                {props => <MovesScreen {...props} />}
            </Screen>

        </Navigator>
    );
};

export default DetailsTabNavigator;