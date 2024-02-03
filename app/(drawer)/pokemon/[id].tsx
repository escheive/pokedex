// Dependencies
import { ScrollView, Text, StyleSheet } from 'react-native';
// Components
import { PokemonStats } from 'components/pokemon/PokemonStats';
// Utils
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_POKEMON_BY_ID } from 'api/queries';
import { PokemonCard } from 'components/pokemon/PokemonCard';
import { EvolutionChain } from 'components/pokemon/EvolutionChain';
import { capitalizeString } from 'utils/helpers';


export default function Page() {
  const params = useLocalSearchParams();
  const pokemonId = params.id;

  const { loading, error, data: pokemon } = useQuery(GET_POKEMON_BY_ID, {
    variables: { id: pokemonId },
  });

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    console.log('Error', error)
  }

  if (!pokemon) {
    return <Text>Loading...</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: capitalizeString(pokemon?.pokemon_v2_pokemon_by_pk.name),
          headerShown: true,
        }}
      />

      <PokemonCard pokemon={pokemon.pokemon_v2_pokemon_by_pk} />

      <PokemonStats pokemonTypes={pokemon.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemontypes} pokemonStats={pokemon.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemonstats} />

      <EvolutionChain pokemonId={pokemon.pokemon_v2_pokemon_by_pk.id} evolutionChain={pokemon.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies} />

    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
});