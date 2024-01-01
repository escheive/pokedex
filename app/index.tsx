import { Text } from "react-native";
import { useQuery } from "@apollo/client/react/hooks/useQuery";
import { ABILITIES_LIST_QUERY, ITEMS_LIST_QUERY, POKEMON_LIST_QUERY } from "api/queries";
import { Redirect } from "expo-router"
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(true);

  const { loading: pokemonLoading, error: pokemonError, data: pokemonList } = useQuery(POKEMON_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const { loading: abilitiesLoading, error: abilitiesError, data: abilitiesList } = useQuery(ABILITIES_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const { loading: itemsLoading, error: itemsError, data: itemsList } = useQuery(ITEMS_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (pokemonList !== null && abilitiesList !== null && itemsList !== null) {
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return <Text>Loading...</Text>
  }

  return <Redirect href={"/(drawer)/pokemon"} />;
}