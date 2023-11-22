import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AbilitiesScreen from '../screens/AbilitiesScreen';
import AbilityDetailsScreen from '../screens/AbilityDetailsScreen';
import { useAppDispatch } from '../hooks';
import { resetAbilities } from '../store/slices/abilitiesSlice';

const Stack = createNativeStackNavigator();

const AbilityStackNavigator = () => {
  const dispatch = useAppDispatch();

//   // function to handle when a user navigates away from the abilities stack, mostly for cleanup
//   const handleBlur = () => {
//     // dispatch action to clear redux abilities state and free up memory
//     dispatch(resetAbilities());
//   }

  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
      // onBlur handles when a navigator or screen is navigated away from
//       onBlur={handleBlur}
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