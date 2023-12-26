import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { capitalizeString, pokemonColors } from 'utils/helpers';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Link } from 'expo-router';
import { Image } from "expo-image";
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { FlashList } from '@shopify/flash-list';

import { useQuery, gql, useApolloClient } from '@apollo/client';

// Define Graphql query
const POKEMON_LIST_QUERY = gql`
  query pokemonListQuery {
    pokemon_v2_pokemon {
      id
      name
      isFavorited @client
      isCaught @ client
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

interface Props {
  query: any; // GraphQL query
  title: string;
}

const versionOptions = [
    { key: 'gen1', label: 'Gen 1' },
    { key: 'gen2', label: 'Gen 2' },
    { key: 'gen3', label: 'Gen 3' },
    { key: 'gen4', label: 'Gen 4' },
    { key: 'gen5', label: 'Gen 5' },
    { key: 'gen6', label: 'Gen 6' },
    { key: 'gen7', label: 'Gen 7' },
    { key: 'gen8', label: 'Gen 8' },
    { key: 'gen9', label: 'Gen 9' },
];

export const ListViewScreen: React.FC<Props> = ({ query, title, filteredItems }) => {
  const { data, loading, error, networkStatus } = useQuery(query);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  console.log(loading, error, networkStatus);

  const apolloClient = useApolloClient();

  const handleClearApolloCache = () => {
    apolloClient.resetStore().catch((error) => {
      console.error("Error clearing cache", error);
    });
  };

  // Function that allows users to mark a pokemon as favorited/caught
  const handleToggleFavoriteAndCaught = (pokemon, statusToUpdate) => {
    console.log(pokemon.name, statusToUpdate)

    // Update the pokemon's status to opposite of what is was set to when clicked
    pokemon[statusToUpdate] = !pokemon[statusToUpdate];

    // Edit the pokemon list by accessing it in cache by id
    // Using fragment allows editing of a 'fragment' of the cache instead of the whole query list
    apolloClient.writeFragment({
      id: `pokemon_v2_pokemon:${pokemon.id}`,
      fragment: gql`
        fragment UpdatedPokemon on pokemon_v2_pokemon {
          ${statusToUpdate}
        }
      `,
      data: {
        __typename: 'pokemon_v2_pokemon',
        [statusToUpdate]: !pokemon[statusToUpdate]
      },
    })
  };

  const renderItem = ({ item: pokemon }: { item: any }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth - 5;
    const type1 = pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name;
    const type2 = pokemon.pokemon_v2_pokemontypes[1]?.pokemon_v2_type.name;

    const backgroundColor = pokemonColors[type1].backgroundColor;
    const textColor = pokemonColors[type1].color;

    const iconContainer = (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          name={pokemon.isFavorited ? "star" : "star-outline"}
          size={24} color="#555"
          onPress={() => handleToggleFavoriteAndCaught(pokemon, "isFavorited")}
        />
        <Ionicons
          name={pokemon.isCaught ? "checkmark-circle-outline" : "ellipse-outline"}
          size={26} color="#555"
          onPress={() => handleToggleFavoriteAndCaught(pokemon, "isCaught")}
        />
      </View>
    );

    const typesContainer = (
      <View style={styles.pokemonTypesContainer}>
        <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type1)}</Text>
        {type2 && <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type2)}</Text>}
      </View>
    );

    return (
      <View style={[styles.itemContainer, { width: itemWidth, backgroundColor }]}>
        <Link 
          style={styles.itemCard} 
          href={`/pokemon/${pokemon.id}`}
        >
          <View style={styles.itemDetailsContainer}>
            <Text style={[styles.pokemonId, { color: textColor }]}>{pokemon.id}</Text>
            <View style={styles.pokemonNameAndTypeContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.pokemonName, { color: textColor } ]}>{capitalizeString(pokemon.name)}</Text>
                {iconContainer}
              </View>
              {typesContainer}
            </View>
          </View>
          <Image
            style={styles.image}
            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
            contentFit="contain"
            transition={1000}
          />
        </Link>
      </View>
    );
  };

  const renderPokemonList = () => (
    <View style={styles.listContainer}>
      <FlashList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        estimatedItemSize={300}
        estimatedListSize={{ height: 120, width: Dimensions.get("screen").width }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Pokemon",
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={styles.filterContainer}>
        <View style={styles.filtersContainer}>
          {/* <FilterDropdownDrawer setSelectedVersions={setSelectedVersions} filterOptions={filterOptions} setFilterOptions={setFilterOptions} /> */}
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={18} color="black"
            />
            <TextInput
              style={styles.searchInput}
              value={filterOptions.searchQuery}
              onChangeText={handleSearchQueryChange}
              placeholder="Search Pokemon"
            />
          </View>
        </View>
        <TouchableOpacity onPress={handleClearApolloCache}>
          <Text>Clear Apollo Cache</Text>
        </TouchableOpacity>
      </View>
      {renderPokemonList()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    filterContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 10,
      zIndex: 2
    },
    filterTitleText: {
      fontSize: 18,
    },
    dropdownContainer: {
      position: 'relative',
    },
    dropdownTrigger: {
      padding: 10,
      backgroundColor: '#F5F5F5',
      borderColor: '#DDDDDD',
      borderWidth: 1,
      borderRadius: 5,
    },
    dropdownContent: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderColor: '#DDDDDD',
      borderWidth: 1,
      borderRadius: 5,
      marginTop: 5,
      padding: 10,
    },
    filtersContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    searchInputContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    searchInput: {
      fontSize: 16,
    },
    listContainer: {
      alignItems: 'center',
      zIndex: 1,
      width: Dimensions.get("screen").width,
      flex: 1,
    },
    itemContainer: {
      marginVertical: 10,
      aspectRatio: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    itemCard: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    itemDetailsContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1,
    },
    pokemonId: {
      fontSize: 16,
    },
    pokemonNameAndTypeContainer: {

    },
    nameContainer: {
      flexDirection: 'row',
    },
    pokemonName: {
      fontSize: 20,
      marginBottom: 10,
      paddingRight: 15,
    },
    pokemonTypesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    pokemonType: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingHorizontal: 20,
      marginRight: 15,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#555',
      textAlign: 'center',
    },
    image: {
      width: 75,
      height: 75,
    },
});

      // <FlatList
      //   data={filteredPokemon}
      //   renderItem={renderItem}
      //   keyExtractor={(item) => item.name}
      //   contentContainerStyle={styles.listContainer}
      //   windowSize={10}
      // />