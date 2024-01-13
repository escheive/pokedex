// Dependencies
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
// Components
import { FilterButton } from 'components/button/FilterButton';
// Utils
import { pokemonColors, capitalizeString, versionOptions } from 'utils/helpers';


// Helper function to handle version and type selection
const handleFilterSelect = (filterOptions: any, setFilterOptions: any, key: any, value: any) => {
  let updatedValues = {};
  if (filterOptions[key].includes(value)) {
    updatedValues = filterOptions[key].filter((item) => item !== value);
  } else {
    updatedValues = [...filterOptions[key], value];
  }
  setFilterOptions((prevOptions: any) => ({ ...prevOptions, [key]: updatedValues }));
};


export const PokemonFilterDrawer = ({ setFilterOptions, filterOptions }: any) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerWidth] = useState(new Animated.Value(0));


  const handleDropdownToggle = () => {
    if (dropdownVisible) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };


  const openDrawer = () => {
    setDropdownVisible(!dropdownVisible);
    Animated.timing(drawerWidth, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };


  const closeDrawer = () => {
    Animated.timing(drawerWidth, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setDropdownVisible(!dropdownVisible);
    });
  };


  const selectedVersions = versionOptions.filter((range) =>
    filterOptions.selectedVersions.includes(range.key)
  );

  const unselectedVersions = versionOptions.filter((range) =>
    !filterOptions.selectedVersions.includes(range.key)
  );

  const selectedTypes = Object.keys(pokemonColors).filter((type) =>
    filterOptions.selectedTypes.includes(type)
  );

  const unselectedTypes = Object.keys(pokemonColors).filter((type) =>
    !filterOptions.selectedTypes.includes(type)
  );


  return (
    <View style={styles.filterDropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={handleDropdownToggle}
      >
        <Ionicons
          name="funnel-outline"
          size={18} color="black"
        />
        <Text style={styles.dropdownTriggerText}>Filter Pokémon</Text>
      </TouchableOpacity>

      <Modal visible={dropdownVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.filterTitleContainer}>
              <Text style={styles.filterTitleText}>Filter Pokémon</Text>
            </View>
            <ScrollView>

              {(selectedVersions.length > 0 || selectedTypes.length > 0 || filterOptions.showFavorites || filterOptions.showCapturedPokemon) && (
                <View style={styles.activeFiltersContainer}>
                  <Text style={styles.activeFiltersTitle}>Active Filters</Text>

                  {selectedVersions.map((range) => (
                    <FilterButton
                      key={range.key}
                      label={range.name}
                      onPress={() => handleFilterSelect(filterOptions, setFilterOptions, 'selectedVersions', range.key)}
                      gradientColors={range.colors}
                    />
                  ))}

                  {selectedTypes.map((type) => (
                    <FilterButton
                      key={type}
                      label={capitalizeString(type)}
                      onPress={() => handleFilterSelect(filterOptions, setFilterOptions, 'selectedTypes', type)}
                      gradientColors={[ pokemonColors[type].backgroundColor, pokemonColors[type].alternateBackgroundColor ]}
                    />
                  ))}

                  {filterOptions.showFavorites && (
                    <FilterButton
                      label="Favorites"
                      onPress={() =>
                        setFilterOptions((prevOptions) => ({
                          ...prevOptions,
                          showFavorites: !filterOptions.showFavorites,
                        }))
                      }
                      gradientColors={[ '#FF6347', '#ccc' ]}
                    />
                  )}

                  {filterOptions.showCapturedPokemon && (
                    <FilterButton
                      label="Caught"
                      onPress={() =>
                        setFilterOptions((prevOptions) => ({
                          ...prevOptions,
                          showCapturedPokemon: !filterOptions.showCapturedPokemon,
                        }))
                      }
                      gradientColors={[ '#40E0D0', '#AAFAFA' ]}
                    />
                  )}

                  </View>
                )}

                <View style={styles.filtersContainer}>

                  <View style={styles.dualTypeFilterContainer}>
                    <Text>Filter By dual types</Text>
                    <CheckBox
                      color={filterOptions.filterByDualTypes ? '#FF5A5A' : 'black'}
                      value={filterOptions.filterByDualTypes}
                      onValueChange={() =>
                        setFilterOptions((prevOptions) => ({
                          ...prevOptions,
                          filterByDualTypes: !prevOptions.filterByDualTypes,
                        }))
                      }
                    />
                  </View>

                  {unselectedVersions.length > 0 && (
                    <Text style={styles.activeFiltersTitle}>Gens</Text>
                  )}

                  {versionOptions.map((range) => {
                    if (filterOptions.selectedVersions.includes(range.key)) {
                      return null;
                    }

                    return (
                      <FilterButton
                        key={range.key}
                        label={range.name}
                        onPress={() => handleFilterSelect(filterOptions, setFilterOptions, 'selectedVersions', range.key)}
                        gradientColors={range.colors}
                      />
                    );
                  })}

                  {unselectedTypes.length > 0 && (
                    <Text style={styles.activeFiltersTitle}>Types</Text>
                  )}

                  {Object.keys(pokemonColors).map((type) => {
                    if (filterOptions.selectedTypes.includes(type)) {
                      return null;
                    }

                    return (
                      <FilterButton
                        key={type}
                        label={capitalizeString(type)}
                        onPress={() => handleFilterSelect(filterOptions, setFilterOptions, 'selectedTypes', type)}
                        gradientColors={[ pokemonColors[type].backgroundColor, pokemonColors[type].alternateBackgroundColor ]}
                      />
                    );
                  })}
                </View>

              <View style={styles.otherFiltersContainer}>
                {(!filterOptions.showFavorites) && (
                  <FilterButton
                    label="Favorites"
                    onPress={() =>
                      setFilterOptions((prevOptions) => ({
                        ...prevOptions,
                        showFavorites: !filterOptions.showFavorites,
                      }))
                    }
                    gradientColors={[ '#FF6347', '#FFAAAA' ]}
                  />
                )}

                {(!filterOptions.showCapturedPokemon) && (
                  <FilterButton
                    label="Caught"
                    onPress={() =>
                      setFilterOptions((prevOptions) => ({
                        ...prevOptions,
                        showCapturedPokemon: !filterOptions.showCapturedPokemon,
                      }))
                    }
                    gradientColors={[ '#40E0D0', '#AAFAFA' ]}
                  />
                )}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleDropdownToggle}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  activeFiltersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#777',
  },
  activeFiltersContainer: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  filtersContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    flex: 1,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownTriggerText: {
    paddingHorizontal: 5,
    color: 'black',
    fontSize: 16,
  },
  otherFiltersContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    flex: 1,
  },
  filterTitleContainer: {
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTitleText: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeButton: {
    backgroundColor: '#BBBBBB',
    padding: 6,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: 'white',
  },
});