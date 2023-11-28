import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Animated, Easing, ScrollView, PanResponder } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppDispatch, useAppSelector } from '../hooks';

import { selectAbilities, setAbilities } from '../store/slices/abilitiesSlice';
import { selectPokemon } from '../store/slices/pokemonSlice';
import { fetchAbilitiesFromDatabase } from '../utils/database/abilitiesDatabase';
import FilterDropdownDrawer from '../components/FilterDropdownDrawer';
import { capitalizeString } from '../utils/helpers';
import SlidingModal from '../components/SlidingModal';
import { getTypeStyle, pokemonColors } from '../utils/typeStyle';

const AbilitiesScreen = ({route}) => {
  const dispatch = useAppDispatch();
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const { data: abilitiesList, loading, error } = useAppSelector(selectAbilities);
  const { data: pokemonList } = useAppSelector(selectPokemon);
  const [selectedAbility, setSelectedAbility] = useState(null);

  const pokemonWithAbilityDetails = selectedAbility !== null ? pokemonList.filter(pokemon => selectedAbility.pokemonWithAbility.includes(pokemon.name)) : null;
  if (selectedAbility) {
    console.log("Selected Ability:", selectedAbility);
    console.log("Filtered Pokemon Details:", pokemonWithAbilityDetails);
  }

  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    showCapturedPokemon: false,
    selectedVersions: [],
    selectedTypes: [],
    searchQuery: '',
    filterByDualTypes: false,
  });

  // function to handle search query changes
  const handleSearchQueryChange = (query) => {
    setFilterOptions((prevOptions) => ({
        ...prevOptions,
        searchQuery: query,
    }));
  };

  // function to handle the filtering of abilities
  const filterAbilities = () => {
    const {
      showFavorites,
      showCapturedPokemon,
      selectedVersions,
      selectedTypes,
      searchQuery,
      filterByDualTypes
    } = filterOptions;

    const filteredList = abilitiesList && abilitiesList.filter((ability) =>
      ability.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return filteredList;
  };

  const filteredAbilities = filterAbilities();

  const renderItem = ({ item: ability }: { item: Ability }) => {

    // Width for one column
    const itemWidth = screenWidth - 5;
    return (
      <View style={[styles.itemContainer, { width: itemWidth }]}>
        <TouchableOpacity style={styles.itemCard} onPress={() => setSelectedAbility(ability)}>
          <Text style={styles.abilityId}>{ability.id}</Text>
          <View style={styles.abilityNameEffectContainer}>
            <Text style={styles.abilityNameText}>{capitalizeString(ability.name)}</Text>
            <Text style={styles.abilityEffectText}>Effect</Text>
          </View>
          <Ionicons
            name="information-circle-outline"
            size={18} color="#aaa"
          />
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
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterDropdownDrawer filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
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
              placeholder="Search Abilities"
            />
          </View>
        </View>
      </View>
      <View>
          {renderAbilitiesList()}
      </View>
      <Modal visible={selectedAbility !== null} animationType='slide' transparent>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setSelectedAbility(null)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}
          >
            <ScrollView
              style={styles.modalDetailsScrollContainer}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <Text style={styles.modalTitle}>{selectedAbility?.name}</Text>
              <View style={styles.modalDetailContainer}>
                <Text style={styles.modalDetailTitleText}>Effect</Text>
                <Text style={styles.modalDetailText}>{selectedAbility?.effect}</Text>
              </View>
              <View style={styles.modalDetailContainer}>
                <Text style={styles.modalDetailTitleText}>Description</Text>
                <Text style={styles.modalDetailText}>{selectedAbility?.longAbilityDescription}</Text>
              </View>
              <View style={styles.modalPokemonContainer}>
                <Text style={styles.modalDetailTitleText}>Pokemon with this Ability</Text>
                {selectedAbility ? pokemonWithAbilityDetails.map((pokemon) => {
                  const backgroundColor = pokemon.type1 ? pokemonColors[pokemon.type1].backgroundColor : '';
                  return (
                    <View style={[styles.itemContainer, { width: '90%', backgroundColor }]}>
                      <TouchableOpacity style={styles.itemCard} onPress={() => handlePress(pokemon)}>
                        <View style={styles.itemDetailsContainer}>
                          <Text style={[styles.pokemonId, { color: pokemon.type1 ? pokemonColors[pokemon.type1].color : 'white' }]}>{pokemon.id}</Text>

                          <View style={styles.pokemonNameAndTypeContainer}>
                            <View style={styles.nameContainer}>
                              <Text style={[styles.pokemonName, { color: pokemonColors[pokemon.type1].color } ]}>{capitalizeString(pokemon.name)}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                  {pokemon.isFavorite ? (
                                    <Ionicons
                                      name="star"
                                      size={24} color="#555"
                                      onPress={() => handleFavoritePress(pokemon)}
                                    />
                                  ) : (
                                    <Ionicons
                                      name="star-outline"
                                      size={24} color="#555"
                                      onPress={() => handleFavoritePress(pokemon)}
                                    />
                                  )}
                                  {pokemon.isCaptured ? (
                                    <Ionicons
                                      name="checkmark-circle-outline"
                                      size={26} color="#555"
                                      onPress={() => handleCapturePress(pokemon)}
                                    />
                                  ) : (
                                    <Ionicons
                                      name="ellipse-outline"
                                      size={26} color="#555"
                                      onPress={() => handleCapturePress(pokemon)}
                                    />
                                  )}
                                </View>
                              </View>

                            <View style={styles.pokemonTypesContainer}>
                              <Text style={styles.pokemonType}>{capitalizeString(pokemon.type1)}</Text>
                              {pokemon.type2 && (
                                <Text style={styles.pokemonType}>{capitalizeString(pokemon.type2)}</Text>
                              )}
                            </View>
                          </View>
                        </View>
                        <Image
                          style={styles.image}
                          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                        />
                      </TouchableOpacity>
                    </View>
                  )
                }) : null}
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: '#F0F4F8',
  },
  abilityId: {
    fontSize: 16,
    color: '#aaa'
  },
  abilityNameText: {
    fontSize: 20,
    color: '#3498db',
    textAlign: 'center',
  },
  abilityEffectText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'fff',
    width: '100%',
    borderRadius: 16,
  },
  modalTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#ccc',
    color: 'white',
    paddingVertical: 16,
  },
  modalDetailsScrollContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalDetailContainer: {
    backgroundColor: '#eee',
    width: '90%',
    alignItems: 'center',
    margin: 10,
    padding: 8,
    borderRadius: 16,
  },
  modalDetailTitleText: {
    fontSize: 22,
    color: 'gray',
    width: '100%',
    borderRadius: 12,
    textAlign: 'center',
  },
  modalDetailText: {
    fontSize: 18,
    color: 'gray',
    width: '100%',
    borderRadius: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
  modalPokemonContainer: {
    backgroundColor: '#eee',
    width: '100%',
    alignItems: 'center',
    margin: 10,
    padding: 8,
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
    backgroundColor: '#fff',
},
  itemCard: {
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
  abilityNameEffectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AbilitiesScreen;

//      <Modal visible={selectedAbility !== null} animationType='slide' transparent>
//         <TouchableOpacity
//           style={styles.modalContainer}
//           activeOpacity={1}
//           onPress={() => setSelectedAbility(null)}
//         >
//           <TouchableOpacity
//             style={styles.modalContent}
//             activeOpacity={1}
//             onPress={closeModal}
//           >
//             <ScrollView>
//               <Text style={styles.modalTitle}>{selectedAbility?.name}</Text>
//               <View style={styles.modalDefinitionContainer}>
//                 <Text style={styles.modalDefinition}>{selectedAbility?.shortAbilityDescription}</Text>
//               </View>
//             </ScrollView>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>