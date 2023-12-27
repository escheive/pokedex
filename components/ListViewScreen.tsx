// Dependencies
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
// Components
import { PokemonListItem } from './pokemon/PokemonListItem';


export const ListViewScreen: React.FC<Props> = ({ query, title, filteredItems }) => {
  const renderItem = ({ item: pokemon }: { item: any }) => (
    <PokemonListItem
      pokemon={pokemon}
    />
  )

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        estimatedItemSize={300}
        estimatedListSize={{ height: 120, width: Dimensions.get("screen").width }}
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