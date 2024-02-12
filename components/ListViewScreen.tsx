// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
// Components
import { PokemonListItem } from './pokemon/PokemonListItem';
import { ListItem } from './lists/ListItem';
import { ScrollToTopButton } from 'components/button/ScrollToTopButton';
import { SkeletonListItem } from './lists/SkeletonItem';


interface Props {
  title: string;
  filteredItems: [];
  loading: boolean;
}


export const ListViewScreen:React.FC<Props> = ({ title, filteredItems, loading }) => {
  // Ref used to track position in flashlist
  const flashListRef = useRef(null);
  // useState to handle visibility of scroll back to top button
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {

  }, [windowWidth])


  // Function to handle rendering of list items
  const renderItem = ({ item: item }: { item: any }) => (
    // If loading, return skeleton items, otherwise return appropriate list items
    loading === true ? (
      <SkeletonListItem 
        title={title}
      />

    ) : title === 'pokemon' ? (
      <PokemonListItem
        pokemon={item}
      />

    ) : title === 'item' || title === 'ability' ? (
      <ListItem
        item={item}
        title={title}
      />
    ) : null
  )


  return (
    <View style={styles.container}>
      <FlashList
        data={filteredItems}
        ref={flashListRef}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        estimatedItemSize={250}
        estimatedListSize={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width }}
        numColumns={Platform.OS === 'web' ? 2 : 1}
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
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 1,
    width: Dimensions.get("window").width,
    flex: 1,
  },
});