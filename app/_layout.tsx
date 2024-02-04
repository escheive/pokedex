// Dependencies
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, Text } from 'react-native';
// Components
import { BottomSheetComponent } from 'components/bottomSheet/BottomSheetComponent';
// Utils
import { ApolloCacheProvider } from '../utils/apolloConfig';
// Context
import { BottomSheetProvider } from '../contexts/BottomSheetContext';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {


  return (
    <ApolloCacheProvider>
      <BottomSheetProvider>
        <RootLayoutNav />
      </BottomSheetProvider>
    </ApolloCacheProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Slot />
          <BottomSheetComponent />
        </ThemeProvider>
    </GestureHandlerRootView>
  );
}