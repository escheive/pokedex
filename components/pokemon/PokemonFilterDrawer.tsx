// Dependencies
import React, { useState, Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
// Components
import { FilterButton } from 'components/button/FilterButton';
// Utils
import { pokemonColors, capitalizeString, versionOptions } from 'utils/helpers';
import { FilterOptions } from 'types';


type FilterOptionKeys = 'selectedVersions' | 'selectedTypes' | 'searchQuery' | 'filterByDualTypes' | 'showFavorites' | 'showCaughtPokemon';

interface HandleFilterSelectProps {
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  key: FilterOptionKeys;
  value: any;
}


interface PokemonFilterDrawer {
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
}


// Helper function to handle version and type selection
const handleFilterSelect = ({ 
  filterOptions, setFilterOptions, key, value 
}: HandleFilterSelectProps) => {

  let updatedValues: any[] = [];

  if ((filterOptions[key] as any[]).includes(value)) {
    updatedValues = (filterOptions[key] as any[]).filter((item: any) => item !== value);
  } else {
    updatedValues = [...(filterOptions[key] as any[]), value];
  }

  setFilterOptions((prevOptions) => ({
    ...prevOptions, 
    [key]: updatedValues
  }));
};


export const PokemonFilterDrawer:React.FC<PokemonFilterDrawer> = ({ setFilterOptions, filterOptions }: any) => {

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
    <View>

      {/* Button to open the drawer of pokemon filters */}
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

      {/* Modal of all pokemon filters */}
      <Modal visible={dropdownVisible} animationType="slide" transparent>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* Pokemon filters main title */}
            <View style={styles.filterTitleContainer}>
              <Text style={styles.filterTitleText}>Filter Pokémon</Text>
            </View>

            {/* Checkbox to allow users to filter for dual type pokemon */}
            <View style={styles.dualTypeFilterContainer}>
              <Text>Filter By dual types</Text>
              <CheckBox
                color={filterOptions.filterByDualTypes ? '#FF5A5A' : 'black'}
                value={filterOptions.filterByDualTypes}
                onValueChange={() =>
                  setFilterOptions((prevOptions: FilterOptions) => ({
                    ...prevOptions,
                    filterByDualTypes: !prevOptions.filterByDualTypes,
                  }))
                }
              />
            </View>

            {/* Container of all pokemon filters in the modal */}
            <ScrollView>

              {/* Container that renders any active filters */}
              {(selectedVersions.length > 0 || selectedTypes.length > 0 || filterOptions.showFavorites || filterOptions.showCapturedPokemon) && (
                <View style={styles.filtersContainer}>
                  <Text style={styles.activeFiltersTitle}>Active Filters</Text>

                  {/* Render any selected game versions buttons */}
                  {selectedVersions.map((range) => (
                    <FilterButton
                      key={range.key}
                      label={range.name}
                      onPress={() => handleFilterSelect({
                        filterOptions, 
                        setFilterOptions, 
                        key: 'selectedVersions', 
                        value: range.key
                      })}
                      gradientColors={range.colors}
                    />
                  ))}

                  {/* Render any selected type buttons */}
                  {selectedTypes.map((type) => (
                    <FilterButton
                      key={type}
                      label={capitalizeString(type)}
                      onPress={() => handleFilterSelect({
                        filterOptions, 
                        setFilterOptions, 
                        key: 'selectedTypes', 
                        value: type
                      })}
                      gradientColors={[ pokemonColors[type].backgroundColor, pokemonColors[type].alternateBackgroundColor ]}
                    />
                  ))}

                  {/* Render favorites button */}
                  {filterOptions.showFavorites && (
                    <FilterButton
                      label="Favorites"
                      onPress={() =>
                        setFilterOptions((prevOptions: FilterOptions) => ({
                          ...prevOptions,
                          showFavorites: !filterOptions.showFavorites,
                        }))
                      }
                      gradientColors={[ '#FF6347', '#ccc' ]}
                    />
                  )}

                  {/* Render captured pokemon button */}
                  {filterOptions.showCapturedPokemon && (
                    <FilterButton
                      label="Caught"
                      onPress={() =>
                        setFilterOptions((prevOptions: FilterOptions) => ({
                          ...prevOptions,
                          showCapturedPokemon: !filterOptions.showCapturedPokemon,
                        }))
                      }
                      gradientColors={[ '#40E0D0', '#AAFAFA' ]}
                    />
                  )}
                  </View>
                )}

                {/* Container of all inactive filter buttons */}
                <View style={styles.filtersContainer}>

                  {/* Render unselected generations buttons and title */}
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
                        onPress={() => handleFilterSelect({
                          filterOptions, 
                          setFilterOptions, 
                          key: 'selectedVersions', 
                          value: range.key
                        })}
                        gradientColors={range.colors}
                      />
                    );
                  })}

                  {/* Render unselected types buttons and title */}
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
                        onPress={() => handleFilterSelect({
                          filterOptions, 
                          setFilterOptions, 
                          key: 'selectedTypes', 
                          value: type
                        })}
                        gradientColors={[ pokemonColors[type].backgroundColor, pokemonColors[type].alternateBackgroundColor ]}
                      />
                    );
                  })}
                </View>

              {/* Container of showFavorites and isCaught filter buttons */}
              <View style={styles.otherFiltersContainer}>
                {(!filterOptions.showFavorites) && (
                  <FilterButton
                    label="Favorites"
                    onPress={() =>
                      setFilterOptions((prevOptions: FilterOptions) => ({
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
                      setFilterOptions((prevOptions: FilterOptions) => ({
                        ...prevOptions,
                        showCapturedPokemon: !filterOptions.showCapturedPokemon,
                      }))
                    }
                    gradientColors={[ '#40E0D0', '#AAFAFA' ]}
                  />
                )}
              </View>
            </ScrollView>

            {/* Button to close the filter drawer */}
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
    marginBottom: 15,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#777',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 5,
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
  dualTypeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  otherFiltersContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    flex: 1,
  },
  filterTitleContainer: {
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTitleText: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeButton: {
    backgroundColor: '#f77',
    padding: 8,
    borderRadius: 10,
    marginVertical: 2,
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