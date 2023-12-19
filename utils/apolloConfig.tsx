import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, makeVar, NormalizedCacheObject, ApolloProvider } from "@apollo/client";
import { persistCache, LocalStorageWrapper, MMKVWrapper } from 'apollo3-cache-persist';

import mmkv from "./mmkvConfig";
import { Platform, Text } from 'react-native';

export const favoritedPokemonVar = makeVar([]);

// export let client;

// // Persist Cache
// (async () => {
//   try {
//     const cache = new InMemoryCache();
//     const storageWrapper = Platform.OS === "web" ? new LocalStorageWrapper(window.localStorage) : new MMKVWrapper(mmkv);
    
//     await persistCache({
//       cache,
//       storage: storageWrapper,
//       debug: true,
//       maxSize: false,
//     });

//     client = new ApolloClient({
//       uri: 'https://beta.pokeapi.co/graphql/v1beta',
//       cache,
//       ssrMode: typeof window === "undefined",
//     });
//   } catch (error) {
//     console.error("Error persisting cache: ", error);
//   }
// })();

export const ApolloCacheProvider = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache({});

      // Conditionally select the storage wrapper based on platform
      const storageWrapper = Platform.OS === "web" ? new LocalStorageWrapper(window.localStorage) : new MMKVWrapper(mmkv);

      // Await before instantiating ApolloClient, else queries might run bef cache is persisted
      await persistCache({
        cache,
        storage: storageWrapper,
        debug: true,
        maxSize: false,
      });

      // Create an Apollo Client instance
      setClient(
        new ApolloClient({
          uri: 'https://beta.pokeapi.co/graphql/v1beta', // PokeAPI Graphql endpoint
          cache,
          ssrMode: typeof window === "undefined",
        })
      );
    }

    init().catch(console.error);
  }, []);

  

  if (!client) {
    return <Text>Initializing Client...</Text>
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>
};

// export const client = new ApolloClient({
//   uri: 'https://beta.pokeapi.co/graphql/v1beta',
//   cache: new InMemoryCache(),
// });

// // Persist Cache
// (async () => {
//   try {
//     const cache = client.cache;
//     const storageWrapper = Platform.OS === "web" ? new LocalStorageWrapper(window.localStorage) : new MMKVWrapper(mmkv);
    
//     await persistCache({
//       cache,
//       storage: storageWrapper,
//       debug: true,
//       maxSize: false,
//     });
//   } catch (error) {
//     console.error("Error persisting cache: ", error);
//   }
// })();
