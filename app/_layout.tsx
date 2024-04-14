// Dependencies
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, useColorScheme, View, Text } from 'react-native';
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
SplashScreen.hideAsync();


export default function RootLayout() {


  return (
    <ApolloCacheProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetProvider>
          <RootLayoutNav />
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </ApolloCacheProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  if (Platform.OS !== 'web') {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
        <BottomSheetComponent />
      </ThemeProvider>
    )
  } else {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
        <BottomSheetComponent />
      </ThemeProvider>
    )
  }
}