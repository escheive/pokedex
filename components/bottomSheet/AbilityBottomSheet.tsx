import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useBottomSheet } from "contexts/BottomSheetContext";
import { capitalizeString } from "utils/helpers";
import { POKEMON_LIST_QUERY } from "api/queries";
import { useQuery } from "@apollo/client";
import { ListViewScreen } from "components/ListViewScreen";
import { BottomSheetVirtualizedList, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { PokemonListItem } from "components/pokemon/PokemonListItem";
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { FlatList } from "react-native-gesture-handler";

export const AbilityBottomSheet = () => {
  const { item, itemType } = useBottomSheet();


  const { 
    id, 
    name, 
    isFavorited, 
    pokemon_v2_abilityeffecttexts, 
    pokemon_v2_abilityflavortexts, 
    pokemon_v2_pokemonabilities 
  } = item;

  const capitalizedName = capitalizeString(name);
  const pokemonWithAbilityIds = pokemon_v2_pokemonabilities.map((pokemon) => pokemon.pokemon_id)

  const { loading, error, data: pokemonList, networkStatus } = useQuery(POKEMON_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const allPokemonWithAbility = pokemonList?.pokemon_v2_pokemon.filter((pokemon) => pokemonWithAbilityIds.includes(pokemon.id));


  return (
    <>
      <View style={styles.titleContainer}>

        <View style={styles.titleRow}>
          <Text style={styles.title}>{capitalizedName}</Text>
        </View>

        <Text style={styles.itemType}>{capitalizeString(itemType)}</Text>

        <View style={styles.borderHorizontal}></View>

        <View style={styles.categoryGroup}>

          <View style={[styles.itemValueTextContainer, { width: '50%' }]}>
            <Text style={styles.itemValue}>{isFavorited}</Text>
            <Text style={styles.itemText}>Bag Pocket</Text>
          </View>

          <View style={[styles.itemValueTextContainer, { width: '50%' }]}>
            <Text style={styles.itemValue}>hi</Text>
            <Text style={styles.itemText}>Item Category</Text>
          </View>
        </View>

      </View>

      <View style={styles.detailsContainer}>

        <View style={styles.rowGroup}>

          <View style={styles.itemValueTextContainer}>
            <Text style={styles.itemValue}>hi</Text>
            <Text style={styles.itemText}>Cost</Text>
          </View>

          <View style={styles.borderVertical}></View>

          <View style={styles.itemValueTextContainer}>
            <Text style={styles.itemValue}>hi</Text>
            <Text style={styles.itemText}>Fling Power</Text>
          </View>

          <View style={styles.borderVertical}></View>

          <View style={styles.itemValueTextContainer}>
            <Text style={styles.itemValue}>hi</Text>
            <Text style={styles.itemText}>Fling Effect</Text>
          </View>

        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Effect</Text>
          <Text style={styles.itemText}>hi</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>In-Depth Effect</Text>
          <Text style={styles.itemText}>hi</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Description</Text>
          <Text style={styles.itemText}>hi</Text>
        </View>

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
    paddingBottom: 30,
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
