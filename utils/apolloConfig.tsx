import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, makeVar, NormalizedCacheObject, ApolloProvider, ReactiveVar, gql } from "@apollo/client";
import { persistCache, LocalStorageWrapper, MMKVWrapper } from 'apollo3-cache-persist';

import mmkv from "./mmkvConfig";
import { Platform, Text } from 'react-native';

// // Reactive variable to store favorite pokemon ids
// export const favoritedPokemonVar = makeVar([]);

// Reactive variable to store favorite pokemon ids
// export const favoritedPokemonVar = makeVar(false);

// const typePolicies = {
//   Pokemon: {
//     fields: {
//       isFavorited: {
//         read(_, { readField }) {
//           const pokemonId = readField('id');
//           return favoritedPokemonVar().includes(pokemonId);
//         }
//       }
//     }
//   }
// }

export const ApolloCacheProvider = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache({
        typePolicies: {
          pokemon_v2_pokemon: {
            fields: {
              isFavorited: {
                read(isFavorited = false) {
                  // Read the current value of isFavorited from the cache
                  // If it doesn't exist, default to false
                  return isFavorited;
                },
                merge: true,
              },
            },
          },
        },
      });

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
          typeDefs: gql`
            extend type Pokemon {
              isFavorited: Boolean!
            }
          `,
          resolvers: {
            Pokemon: {
              isFavorited: () => false,
            },
          },
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
