// Dependencies
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useApolloClient } from '@apollo/client';
// Components
import { IconContainer } from 'components/card/IconContainer';
// Utils
import { capitalizeString, pokemonColors } from 'utils/helpers';
import { Ionicons } from '@expo/vector-icons';


export const SkeletonListItem = (title: any) => {

  return (
    <TouchableOpacity 
      style={styles.itemContainer}
      activeOpacity={0.7}
    >
      <Text style={styles.pokemonId}></Text>
      <View style={styles.itemDetailsContainer}>
        <View style={styles.nameAndIconContainer}>
          <Text style={styles.pokemonName}></Text>
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <Ionicons
              name="star-outline"
              size={24} color="#555"
            />
            {title === 'pokemon' ? (
              <Ionicons
                name="ellipse-outline"
                size={26} color="#555"
              />
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.imageContainer}></View>
    </TouchableOpacity>
  );
};

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
  itemDetailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  pokemonId: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  nameAndIconContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 20,
    marginRight: 15,
  },
  pokemonTypesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pokemonType: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#555',
    textAlign: 'center',
  },
  imageContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
});