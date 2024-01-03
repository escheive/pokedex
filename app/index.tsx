import { Text } from "react-native";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import { ABILITIES_LIST_QUERY, ITEMS_LIST_QUERY, POKEMON_LIST_QUERY, POKEMON_DETAILS_LIST_QUERY } from "api/queries";
import { Redirect } from "expo-router"
import { useEffect, useState } from "react";
import { LoadingScreen } from "components/LoadingScreen";

export default function Page() {
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