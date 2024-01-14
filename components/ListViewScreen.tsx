// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
// Components
import { PokemonListItem } from './pokemon/PokemonListItem';
import { ListItem } from './lists/ListItem';
import { ScrollToTopButton } from 'components/button/ScrollToTopButton';


interface Props {
  query: string;
  title: string;
  filteredItems: [];
}


export const ListViewScreen:React.FC<Props> = ({ query, title, filteredItems }) => {
  // Ref used to track position in flashlist
  const flashListRef = useRef(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  // Function to scroll to the top of the list
  const scrollToTop = () => {
    flashListRef.current.scrollToOffset({ offset: 0, animated: true });
  };


  const renderItem = ({ item: item }: { item: any }) => (
    title === 'pokemon' ? (

      <PokemonListItem
        pokemon={item}
      />

    ) : title === 'items' || title === 'ability' ? (

      <ListItem
        item={item}
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
        estimatedItemSize={279}
        estimatedListSize={{ height: Dimensions.get("screen").height, width: Dimensions.get("screen").width }}
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
    width: Dimensions.get("screen").width,
    flex: 1,
  },
});