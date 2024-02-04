import { useState } from 'react';
import { Platform, View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from 'expo-router/drawer';
import { ListViewScreen } from 'components/ListViewScreen';
import { ABILITIES_LIST_QUERY } from 'api/queries';

import { useQuery, gql } from '@apollo/client';


export default function Page() {
  // const dispatch = useAppDispatch();
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    selectedTypes: [],
    searchQuery: '',
  });

  const { loading, error, data: abilitiesList, networkStatus } = useQuery(ABILITIES_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });


  // function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      searchQuery: query,
    }));
  };

  // function to handle the filtering of abilities
  const filterAbilities = () => {
    const {
      showFavorites,
      searchQuery,
    } = filterOptions;

    // Turn abilitiesList to an object
    const filteredList = abilitiesList?.pokemon_v2_ability && abilitiesList.pokemon_v2_ability.filter((ability: any) =>
      (showFavorites ? ability.isFavorite : true) &&
        ability.name.toLowerCase().startsWith(searchQuery.toLowerCase()
      )
    );

    return filteredList;
  };

  const filteredAbilities = filterAbilities();


  const renderItemsList = () => {
    return <ListViewScreen title='ability' filteredItems={filteredAbilities} loading={loading} />
  };


  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Abilities",
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
              placeholder="Search Items"
            />
          </View>
        </View>
      </View>
      {abilitiesList ? renderItemsList() : (
        Platform.OS === "web" ? (
          <p>Loading....</p>
        ) : (
          <Text>Loading...</Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
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
});