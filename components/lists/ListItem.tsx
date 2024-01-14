// Dependencies
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useApolloClient } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
// Components
import { IconContainer } from 'components/card/IconContainer';
// Utils
import { capitalizeString, pokemonColors } from 'utils/helpers';


export const ListItem = React.memo(({ item }: any) => {

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
    <TouchableOpacity 
        onPress={() => router.push(`/items/${item.id}`)} 
        style={styles.itemContainer}
        activeOpacity={0.7}
      >
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
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  itemCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemDetailsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  itemId: {
    fontSize: 16,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  itemName: {
    fontSize: 20,
    marginBottom: 10,
    paddingRight: 15,
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
});

function handleToggleFavoriteAndCaught(item: any, arg1: string): void {
  throw new Error('Function not implemented.');
}
