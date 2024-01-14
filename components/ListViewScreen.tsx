// Dependencies
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
// Components
import { PokemonListItem } from './pokemon/PokemonListItem';
import { ListItem } from './lists/ListItem';


interface Props {
  query: string;
  title: string;
  filteredItems: [];
}


export const ListViewScreen:React.FC<Props> = ({ query, title, filteredItems }) => {
  const renderItem = ({ item: item }: { item: any }) => (
    title === 'pokemon' ? (

      <PokemonListItem
        pokemon={item}
      />

    ) : title === 'item' || title === 'ability' ? (

      <ListItem
        item={item}
      />

    ) : null
  )

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        estimatedItemSize={279}
        estimatedListSize={{ height: Dimensions.get("screen").height, width: Dimensions.get("screen").width }}
      />
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