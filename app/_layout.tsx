import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';

import store from '../store';
import { Provider } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { InMemoryCache } from "@apollo/client/core";
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { persistCache, AsyncStorageWrapper, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache({}); // Allows data to be stored in local cache, and subsequent fetches of the same data to not use the network

// Conditionally select the storage wrapper based on platform
const storageWrapper = Platform.OS === "web" ? new LocalStorageWrapper(window.localStorage) : new AsyncStorageWrapper(AsyncStorage);

// Await before instantiating ApolloClient, else queries might run before cache is persisted
persistCache({
  cache,
  storage: storageWrapper,
});

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta', // PokeAPI Graphql endpoint
  cache, 
})

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'pokemon',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// // Create an Apollo Client instance
// const client = new ApolloClient({
//   uri: 'https://beta.pokeapi.co/graphql/v1beta', // PokeAPI Graphql endpoint
//   cache: new InMemoryCache(), // Allows data to be stored in local cache, and subsequent fetches of the same data to not use the network
// })