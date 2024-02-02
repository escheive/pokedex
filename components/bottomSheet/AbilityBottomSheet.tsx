// Dependencies
import { Text, View, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
// Components
import { PokemonListItem } from "components/pokemon/PokemonListItem";
// Utils
import { capitalizeString } from "utils/helpers";
// Context
import { useBottomSheet } from "contexts/BottomSheetContext";
// Api
import { POKEMON_LIST_QUERY } from "api/queries";


export const AbilityBottomSheet = () => {
  // Grab the set item from the bottom sheet context
  const { item, itemType } = useBottomSheet();

  // Destructure the set item and its type
  const { 
    id, 
    name, 
    isFavorited, 
    pokemon_v2_abilityeffecttexts, 
    pokemon_v2_abilityflavortexts, 
    pokemon_v2_pokemonabilities 
  } = item;

  // Capitalize the items name
  const capitalizedName = capitalizeString(name);

  // Find grab all pokemon ids from the abilities pokemon list
  const pokemonWithAbilityIds = pokemon_v2_pokemonabilities.map((pokemon) => pokemon.pokemon_id)

  // Grab the list of pokemon from apollo cache
  const { loading, error, data: pokemonList, networkStatus } = useQuery(POKEMON_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  // Filter the pokemon list to grab details from only those that have the ability
  const allPokemonWithAbility = pokemonList?.pokemon_v2_pokemon.filter((pokemon) => pokemonWithAbilityIds.includes(pokemon.id));


  return (
    <>
      {/* Title Container with ability name and type */}
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{capitalizedName}</Text>
        </View>

        <Text style={styles.itemType}>{capitalizeString(itemType)}</Text>

        <View style={styles.borderHorizontal}></View>
      </View>

      {/* Detail container with all of the ability details */}
      <View style={styles.detailsContainer}>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Effect</Text>
          <Text style={styles.itemText}>{pokemon_v2_abilityeffecttexts[0]?.short_effect}</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>In-Depth Effect</Text>
          <Text style={styles.itemText}>{pokemon_v2_abilityeffecttexts[0]?.effect}</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Description</Text>
          <Text style={styles.itemText}>{pokemon_v2_abilityflavortexts[0]?.flavor_text}</Text>
        </View>


        {/* All of the pokemon with the ability */}
        <View style={styles.listContainer}>
          {allPokemonWithAbility.map((pokemon) => {

            return (
              <PokemonListItem pokemon={pokemon} key={pokemon.id} />
            )
          })}
        </View>

      </View>
    </>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  categoryGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 30,
  },
  borderHorizontal: {
    borderTopWidth: 1,
    borderColor: '#eee',
    width: '80%',
    alignSelf: 'center'
  },
  borderVertical: {
    borderRightWidth: 1,
    borderColor: '#eee',
    height: '80%',
    alignSelf: 'center'
  },
  rowGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemValueTextContainer: {
    width: '33%',
    justifyContent: 'center',
  },
  group: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F2F7FB',
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingBottom: 10,
    textAlign: 'center',
    width: '100%'
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '25%',
    height: '175%',
  },
  itemType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemValue: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center'
  },
  groupTitle: {
    color: '#acf',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1
  },
});
