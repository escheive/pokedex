// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, TextInput, Dimensions } from 'react-native';
import { CellContainer, FlashList } from '@shopify/flash-list';
// Components
import { PokemonListItem } from './pokemon/PokemonListItem';
import { ListItem } from './lists/ListItem';
import { ScrollToTopButton } from 'components/button/ScrollToTopButton';
import { SkeletonListItem } from './lists/SkeletonItem';
import Animated from 'react-native-reanimated';


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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [windowSize, setWindowSize] = useState(Dimensions.get('window'));

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', handleResize);

  }, []);


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
        estimatedItemSize={Platform.OS === 'web' ? windowWidth / 2 : windowWidth}
        estimatedListSize={{ height: windowSize.height, width: windowSize.width }}
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
    flex: 1,
  },
});