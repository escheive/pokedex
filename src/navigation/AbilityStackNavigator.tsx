import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AbilitiesScreen from '../screens/AbilitiesScreen';
import AbilityDetailsScreen from '../screens/AbilityDetailsScreen';

const Stack = createNativeStackNavigator();

const AbilityStackNavigator = () => {

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="Main">
        {props => <AbilitiesScreen {...props} />}
      </Stack.Screen>

      <Stack.Screen
        name="Details"
      >
        {props => <AbilityDetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AbilityStackNavigator;