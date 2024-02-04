import { useEffect, useState } from 'react';
import { AppRegistry } from 'react-native';
import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloProvider, gql } from "@apollo/client";
import { persistCache, LocalStorageWrapper, MMKVWrapper } from 'apollo3-cache-persist';

import mmkv from "./mmkvConfig";
import { Platform } from 'react-native';

import { GET_PROFILE_QUERY } from 'api/user/queries';

import { LoadingScreen } from 'components/LoadingScreen';

export const ApolloCacheProvider = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | undefined>();


  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache({
        typePolicies: {
          // This defines client side variables for the pokemon data in the cache
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
          // This defines client side isFavorited for items in the cache
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
          },
          // This defines client side isFavorited for abilities in the cache
          pokemon_v2_ability: {
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

  

  if (!client || client === undefined) {
    return <LoadingScreen loadingText={'Initializing Client'} />
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>
};

AppRegistry.registerComponent()
