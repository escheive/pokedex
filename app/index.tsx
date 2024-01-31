import { Text } from "react-native";
import { ABILITIES_LIST_QUERY, ITEMS_LIST_QUERY, POKEMON_LIST_QUERY, POKEMON_DETAILS_LIST_QUERY, GET_POKEMON_BY_ID } from "api/queries";
import { Redirect } from "expo-router"
import { useEffect, useState } from "react";
import { LoadingScreen } from "components/LoadingScreen";

import { useApolloClient, gql, useQuery } from "@apollo/client";
import { checkAndPerformInitialSetup } from "utils/setupFunctions";
import { GET_PROFILE_QUERY } from "api/user/queries";



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

  const { data: userData } = useQuery(GET_PROFILE_QUERY);


  // Function to perform first login tasks, ie. create a default user profile, handle tutorials or guides
  checkAndPerformInitialSetup(apolloClient, userData);


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