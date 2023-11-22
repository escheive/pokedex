import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppDispatch, useAppSelector } from '../hooks';

import { selectAbilities, setAbilities } from '../store/slices/abilitiesSlice';
import { fetchAbilitiesFromDatabase } from '../utils/database/abilitiesDatabase';

import { capitalizeString } from '../utils/helpers';

const AbilitiesScreen = () => {
  const dispatch = useAppDispatch();
  const screenWidth = Dimensions.get('window').width;
  const allAbilities = useAppSelector(selectAbilities).data;

  useEffect(() => {
    const fetchAndSetAbilities = async () => {
      const fetchedAbilities = await fetchAbilitiesFromDatabase();
      dispatch(setAbilities(fetchedAbilities))
    }

    fetchAndSetAbilities()
  }, []);

  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    selectedVersions: [],
    searchQuery: '',
  });

  // function to handle search query changes
  const handleSearchQueryChange = (query) => {
    setFilterOptions((prevOptions) => ({
        ...prevOptions,
        searchQuery: query,
    }));
  };

  const groupedVersions = {
    gen1: { start: 1, end: 151 },
    gen2: { start: 152, end: 251 },
    gen3: { start: 252, end: 386 },
    gen4: { start: 387, end: 493 },
    gen5: { start: 494, end: 649 },
    gen6: { start: 650, end: 721 },
    gen7: { start: 722, end: 809 },
    gen8: { start: 810, end: 905 },
    gen9: { start: 906, end: 1010 },
  };

  // function to handle the filtering of abilities
  const filterAbilities = () => {
    const {
      showFavorites,
      selectedVersions,
      searchQuery,
    } = filterOptions;

    const filteredAbilitiesList = allAbilities && allAbilities.filter((ability) =>
//       (showFavorites ? pokemon.isFavorite : true) &&
      (selectedVersions.length > 0 ?
        selectedVersions.some((version) => {
          const range = groupedVersions[version];
          return ability.id >= range.start && ability.id <= range.end;
      }) : true
    ) &&
      ability.abilityName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return filteredAbilitiesList;
  };

  const filteredAbilities = filterAbilities();

  const renderItem = ({ item: ability }: { item: Ability }) => {

    // Width for one column
    const itemWidth = screenWidth - 5;
    return (
      <View style={[styles.itemContainer, { width: itemWidth }]}>
        <TouchableOpacity style={styles.itemCard} onPress={() => console.log('pressed')}>
          <View style={styles.itemDetailsContainer}>
            <Text style={styles.abilityId}>{ability.id}</Text>

            <View style={styles.abilityNameContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.abilityName}>{capitalizeString(ability.abilityName)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAbilitiesList = () => {
    if (filteredAbilities.length === 0) {
      return <Text style={{ textAlign: 'center' }}>There are no results for {filterOptions.searchQuery}</Text>
  }

    return (
      <FlatList
        data={filteredAbilities}
        renderItem={renderItem}
        keyExtractor={(item) => item.abilityName}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
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
              placeholder="Search Pokemon"
            />
          </View>
        </View>

      </View>
      <View>
          {renderAbilitiesList()}
      </View>
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
  },
  itemContainer: {
    marginVertical: 10,
    // aspectRatio for two columns
//         aspectRatio: 1,
    aspectRatio: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemCard: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  itemDetailsContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  abilityId: {
    fontSize: 16,
    paddingRight: 40,
  },
  nameContainer: {
    flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginRight: 15,
  },
  abilityName: {
    fontSize: 20,
    marginBottom: 10,
    paddingRight: 15,
  },
});

export default AbilitiesScreen;