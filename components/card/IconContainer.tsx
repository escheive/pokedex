import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { toggleFavorite, toggleCaught } from 'utils/entityUtils';
import { useApolloClient } from '@apollo/client';

export const IconContainer = ({ item, title }: any) => {
  const apolloClient = useApolloClient();

  const entityType = (
    title === 'pokemon' ? 'pokemon_v2_pokemon' :
    title === 'item' ? 'pokemon_v2_item' :
    title === 'ability' ? 'pokemon_v2_ability' :
    null
  );

  const handlePress = () => {
    toggleFavorite({ entityType: entityType, entity: item, apolloClient })
  }

  return (
    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
      <Ionicons
        name={item.isFavorited ? "star" : "star-outline"}
        size={26} color="#555"
        onPress={() => handlePress()}
        style={styles.icon}
      />
      {title === 'pokemon' ? (
        <Ionicons
          name={item.isCaught ? "checkmark-circle-outline" : "ellipse-outline"}
          size={28} color="#555"
          onPress={() => toggleCaught({ pokemon: item, apolloClient })}
          style={styles.icon}
        />
      ) : null}
    </View>
  );
};

// Stylesheet for this screen
const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 3,
  },
});