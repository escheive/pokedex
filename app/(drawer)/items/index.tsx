// Dependencies
// React
import { useState } from 'react';
import { Platform, View, Text, StyleSheet, TextInput } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
// Expo
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
// Apollo
import { useQuery } from '@apollo/client';
// Utils
import { ListViewScreen } from 'components/ListViewScreen';
import { ITEMS_LIST_QUERY } from 'api/queries';



export default function Page() {
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    selectedTypes: [],
    searchQuery: '',
  });

  const { loading, error, data: itemsList, networkStatus } = useQuery(ITEMS_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });


  // function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      searchQuery: query,
    }));
  };

  // function to handle the filtering of items
  const filterItems = () => {
    const {
      showFavorites,
      searchQuery,
    } = filterOptions;

    // Turn itemsList to an object
    const filteredList = itemsList.pokemon_v2_item && itemsList.pokemon_v2_item.filter((item: any) =>
      (showFavorites ? item.isFavorite : true) &&
        item.name.toLowerCase().startsWith(searchQuery.toLowerCase()
      )
    );

    return filteredList;
  };

  const filteredItems = filterItems();


  const renderItemsList = () => {
    return <ListViewScreen title='item' filteredItems={filteredItems} loading={loading} />
  };


  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Items",
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={styles.filterContainer}>
        <View style={styles.filtersContainer}>
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

      {itemsList ? renderItemsList() : (
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
