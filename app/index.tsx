import { Text } from "react-native";
import { ABILITIES_LIST_QUERY, ITEMS_LIST_QUERY, POKEMON_LIST_QUERY, POKEMON_DETAILS_LIST_QUERY } from "api/queries";
import { Redirect } from "expo-router"
import { useEffect, useState } from "react";
import { LoadingScreen } from "components/LoadingScreen";

import mmkv from 'utils/mmkvConfig';
import { useApolloClient, gql, useQuery } from "@apollo/client";

const INITIAL_SETUP_KEY = 'hasInitialSetup';

export default function Page() {
  const apolloClient = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState<string>("Loading...")

  const { loading: pokemonLoading, error: pokemonError, data: pokemonList } = useQuery(POKEMON_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const { loading: abilitiesLoading, error: abilitiesError, data: abilitiesList } = useQuery(ABILITIES_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const { loading: itemsLoading, error: itemsError, data: itemsList } = useQuery(ITEMS_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const { loading: pokemonDetailsLoading, error: pokemonDetailsError, data: pokemonDetailsList } = useQuery(POKEMON_DETAILS_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });


  async function checkAndPerformInitialSetup() {
    try {
      const hasSetup = mmkv.getString(INITIAL_SETUP_KEY);
  
      const initialData = {
        profile: {
          __typename: 'Profile',
          id: '1',
          username: 'Ash',
          email: 'ash@example.com',
          // Initialize other profile fields
        },
      };
  
      if (!hasSetup) {
        apolloClient.writeQuery({
          query: gql`
            query InitialProfile {
              profile @client {
                id
                username
                email
              }
            }
          `,
          data: initialData,
        })
        // Update the initial setup flag so future setups do not go through these steps
        mmkv.set(INITIAL_SETUP_KEY, 'true');
      }
    } catch (error) {
      console.error('Error during initial setup:', error);
    }
  }

  checkAndPerformInitialSetup();

  useEffect(() => {
    if (
      pokemonList !== null && 
      pokemonList !== undefined && 
      abilitiesList !== null && 
      abilitiesList !== undefined && 
      itemsList !== null && 
      itemsList !== undefined && 
      pokemonDetailsList !== null &&
      pokemonDetailsList !== undefined
    ) {
      setLoading(false);
    }

    if (pokemonList === undefined) {
      setLoadingText("Loading Pokemon...");
    } else if (abilitiesList === undefined) {
      setLoadingText("Loading Abilities...");
    } else if (itemsList === undefined) {
      setLoadingText("Loading Items");
    } else if (pokemonDetailsList === undefined) {
      setLoadingText("Loading Pokemon Details...");
    } else {
      setLoadingText("Loading...");
    }
  }, [pokemonList, abilitiesList, itemsList, pokemonDetailsList]);
  
  if (loading) {
    return <LoadingScreen loadingText={loadingText} />
  } else {
    return <Redirect href={"/(drawer)/pokemon"} />;
  }
}