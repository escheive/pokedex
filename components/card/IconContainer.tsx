import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { toggleFavorite, toggleCaught } from 'utils/entityUtils';
import { useApolloClient } from '@apollo/client';

export const IconContainer = ({ pokemon }: any) => {
  const apolloClient = useApolloClient();

  return (
    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
      <Ionicons
        name={pokemon.isFavorited ? "star" : "star-outline"}
        size={24} color="#555"
        onPress={() => toggleFavorite({ entityType: 'pokemon_v2_pokemon', entity: pokemon, apolloClient })}
      />
      <Ionicons
        name={pokemon.isCaught ? "checkmark-circle-outline" : "ellipse-outline"}
        size={26} color="#555"
        onPress={() => toggleCaught({ pokemon, apolloClient })}
      />
    </View>
  );
};