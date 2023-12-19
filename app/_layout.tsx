import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, Platform, Text } from 'react-native';

import { InMemoryCache, NormalizedCacheObject } from "@apollo/client/core";
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { persistCache, AsyncStorageWrapper, LocalStorageWrapper, MMKVWrapper } from 'apollo3-cache-persist';
import mmkv from "../utils/mmkvConfig";
import { client } from "../utils/apolloConfig";

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

  return (
    <ApolloProvider client={client}>
      <RootLayoutNav />
    </ApolloProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <Provider store={store}> */}
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
          </ThemeProvider>
      {/* </Provider> */}
    </GestureHandlerRootView>
  );
}

// import React, { useEffect, useState } from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { SplashScreen, Slot } from 'expo-router';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { useColorScheme, Platform, Text } from 'react-native';

// import store from '../store';
// import { Provider } from 'react-redux';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { InMemoryCache, NormalizedCacheObject } from "@apollo/client/core";
// import { ApolloClient, ApolloProvider } from '@apollo/client';
// import { persistCache, AsyncStorageWrapper, LocalStorageWrapper, MMKVWrapper } from 'apollo3-cache-persist';
// import mmkv from "../utils/mmkvConfig";


// const ApolloCacheProvider = ({ children }) => {
//   const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>();

//   useEffect(() => {
//     async function init() {
//       const cache = new InMemoryCache({});

//       // Conditionally select the storage wrapper based on platform
//       const storageWrapper = Platform.OS === "web" ? new LocalStorageWrapper(window.localStorage) : new MMKVWrapper(mmkv);

//       // Await before instantiating ApolloClient, else queries might run bef cache is persisted
//       await persistCache({
//         cache,
//         storage: storageWrapper,
//         debug: true,
//         maxSize: false,
//       });

//       // Create an Apollo Client instance
//       setClient(
//         new ApolloClient({
//           uri: 'https://beta.pokeapi.co/graphql/v1beta', // PokeAPI Graphql endpoint
//           cache,
//           ssrMode: typeof window === "undefined",
//         })
//       );
//     }

//     init().catch(console.error);
//   }, []);

  

//   if (!client) {
//     return <Text>Initializing Client...</Text>
//   }

//   return <ApolloProvider client={client}>{children}</ApolloProvider>
// };

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'pokemon',
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     ...FontAwesome.font,
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ApolloCacheProvider>
//       <RootLayoutNav />
//     </ApolloCacheProvider>
//   )
// }

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       {/* <Provider store={store}> */}
//           <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//             <Slot />
//           </ThemeProvider>
//       {/* </Provider> */}
//     </GestureHandlerRootView>
//   );
// }