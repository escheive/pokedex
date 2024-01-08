import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, makeVar, NormalizedCacheObject, ApolloProvider, ReactiveVar, gql } from "@apollo/client";
import { persistCache, LocalStorageWrapper, MMKVWrapper } from 'apollo3-cache-persist';

import mmkv from "./mmkvConfig";
import { Platform, Text } from 'react-native';

import { GET_PROFILE_QUERY } from 'api/user/queries';

import { LoadingScreen } from 'components/LoadingScreen';

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
              isCaught: {
                read(isCaught = false) {
                  // Read the current value of isCaught from the cache
                  // If it doesn't exist, default to false
                  return isCaught
                },
                merge: true,
              }
            },
          },
          pokemon_v2_item: {
            fields: {
              isFavorited: {
                read(isFavorited = false) {
                  // Read the current value of isFavorited from the cache
                  // If it doesn't exist, default to false
                  return isFavorited;
                },
                merge: true,
              }
            }
          }
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
            Query: {
              getProfile: (_, __, { cache }) => {
                try {
                  // Retrieve profile data from the cache
                  return cache.readQuery({ query: GET_PROFILE_QUERY });
                } catch (error) {
                  console.error('Error reading profile from cache:', error);
                  return null;
                }
              },
            },
          },
        })
      );
    }

    init().catch(console.error);
  }, []);

  

  if (!client) {
    return <LoadingScreen loadingText={'Initializing Client'} />
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
