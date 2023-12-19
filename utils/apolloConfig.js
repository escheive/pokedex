import { ApolloClient, InMemoryCache, persistCache, LocalStorageWrapper, MMKVWrapper, gql } from "@apollo/client";

import mmkv from "./mmkvConfig";

export const client = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
});

// Persist Cache
(async () => {
  const cache = client.cache;
  const storageWrapper = Platform.OS === "web" ? new LocalStorageWrapper(window.localStorage) : new MMKVWrapper(mmkv);
  
  await persistCache({
    cache,
    storage: storageWrapper,
    debug: true,
    maxSize: false,
  });
})();