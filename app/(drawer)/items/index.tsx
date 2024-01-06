// Dependencies
// React
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Dimensions, Switch, TextInput } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
// Expo
import { Link } from 'expo-router';
import { Image } from "expo-image";
import Drawer from "expo-router/src/layouts/Drawer";
import Ionicons from '@expo/vector-icons/Ionicons';
// FlashList
import { FlashList } from "@shopify/flash-list";
// Apollo
import { useQuery, gql, useApolloClient, useLazyQuery } from '@apollo/client';
// Components
import { ScrollToTopButton } from 'components/button/ScrollToTopButton';
// Utils
import { capitalizeString, getTMImageUrl } from '../../../utils/helpers';

// Define Graphql query
const ITEMS_LIST_QUERY = gql`
  query getItemsListQuery {
    pokemon_v2_item {
      name
      id
      cost
      fling_power
      isFavorited @client
      pokemon_v2_itemflingeffect {
        pokemon_v2_itemflingeffecteffecttexts {
          effect
        }
      }
      pokemon_v2_itemcategory {
        name
        pokemon_v2_itempocket {
          name
        }
      }
      pokemon_v2_itemeffecttexts {
        effect
        short_effect
      }
      pokemon_v2_itemflavortexts(limit: 1, order_by: {version_group_id: desc}, where: {language_id: {_eq: 9}}) {
        flavor_text
        pokemon_v2_versiongroup {
          generation_id
        }
      }
    }
  }
`;

export default function Page() {
  // const dispatch = useAppDispatch();
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    selectedTypes: [],
    searchQuery: '',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { loading, error, data: itemsList, networkStatus } = useQuery(ITEMS_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });
  console.log(loading, error, networkStatus);

  // Ref used to track position in flashlist
  const flashListRef = useRef(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  // Function to scroll to the top of the list
  const scrollToTop = () => {
    flashListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  if (!itemsList) {
    return (
      <>
        {Platform.OS === "web" ? (
          <p>Loading....</p>
        ) : (
          <Text>Loading...</Text>
        )}
      </>
    )
  }

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
  const apolloClient = useApolloClient();

  // Function that allows users to mark a item as favorited/caught
  const handleToggleFavoriteAndCaught = (item, statusToUpdate) => {
    console.log(item.name, statusToUpdate)

    // Update the item's status to opposite of what is was set to when clicked
    item[statusToUpdate] = !item[statusToUpdate];

    // Edit the pokemon list by accessing it in cache by id
    // Using fragment allows editing of a 'fragment' of the cache instead of the whole query list
    apolloClient.writeFragment({
      id: `pokemon_v2_item:${item.id}`,
      fragment: gql`
        fragment UpdatedItem on pokemon_v2_item {
          ${statusToUpdate}
        }
      `,
      data: {
        __typename: 'pokemon_v2_item',
        [statusToUpdate]: !item[statusToUpdate]
      },
    })
  };

  const handleFavoritePress = (item: any) => {
    console.log('favorited')
  }

  const renderItem = ({ item: item }: { item: any }) => {
    // // Check if the item has a valid image URL before rendering the Image component
    // let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`;
    // if (item.name.startsWith("tm") && item.name !== "tmv-pass" && item.name !== "tm-case") {
    //   imageUrl = getTMImageUrl(item.name)
    // }
    // const hasValidImageUrl = imageUrl && imageUrl !== 'undefined';

    const iconContainer = (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          name={item.isFavorited ? "star" : "star-outline"}
          size={24} color="#555"
          onPress={() => handleToggleFavoriteAndCaught(item, "isFavorited")}
        />
      </View>
    );

    return (
      <View style={styles.itemContainer}>
        <Link
          style={styles.itemDetails} 
          href={`/items/${item.id}`}
        >
        {/* <Link
          style={styles.itemCard} 
          href={{
            pathname: '/items/[id]',
            params: { id: item.id }
          }}
        > */}
            <Text style={styles.itemId}>{item.id}</Text>
            <Text style={styles.itemName}>{capitalizeString(item.name)}</Text>
            {iconContainer}
            {item.pokemon_v2_itemeffecttexts[0] ? (
              <Text style={styles.shortEffect}>{item.pokemon_v2_itemeffecttexts[0]?.short_effect}</Text>
            ) : (
              <Text style={styles.shortEffect}>This item has no info on PokeAPI yet!</Text>
            )}
            <Image 
              style={styles.image}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`
              }}
              placeholder=""
              contentFit="contain"
            />
          {/* {hasValidImageUrl ? (
            <Image 
              style={styles.image}
              source={{
                uri: `${imageUrl}`
              }}
              placeholder=""
              contentFit="contain"
            />
          ) : null } */}
        </Link>
      </View>
    );
  };

  const renderItemsList = () => {
    const listContent = (filteredItems.length === 0) ? (
      <Text style={{ textAlign: 'center' }}>There are no results for {filterOptions.searchQuery}</Text>
    ) : (
      <View style={styles.flashListContainer}>
        <FlashList
          ref={flashListRef}
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item: any, i:number) => `${i}: ${item.name}`}
          estimatedItemSize={300}
          estimatedListSize={{ height: 120, width: Dimensions.get("screen").width }}
          onScroll={(event) => {
            // Calculate the scroll offset
            const offsetY = event.nativeEvent.contentOffset.y;
  
            // Update visibility state of scrollToTopBottom after a user scrolls a certain distance
            setShowScrollToTopButton(offsetY > 450);
          }}
        />
        {showScrollToTopButton && (
          <ScrollToTopButton flashListRef={flashListRef} />
        )}
      </View>
    );

    return listContent;
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
      {renderItemsList()}
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
    listContainer: {
      alignItems: 'center',
      zIndex: 1,
    },
    flashListContainer: {
      flex: 1,
      padding: "1.5%"
    },
    itemContainer: {
      width: "100%",
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      backgroundColor: '#fff',
    },
    itemCard: {

    },
    itemDetails: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemName: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    itemId: {
      fontSize: 14,
      color: '#777',
      marginRight: 10,
    },
    shortEffect: {
      fontSize: 16,
      fontStyle: 'italic',
      color: '#333',
      flexShrink: 1,
    },
    image: {
      width: 75,
      height: 75,
    },
    scrollToTopButton: {
      position: "absolute",
      bottom: 10,
      right: 10,
      borderWidth: 2,
      borderColor: "black",
      borderRadius: 28,
      padding: 6,
    }
});
