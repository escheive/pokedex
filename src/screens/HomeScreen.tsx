import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types';

type Props = {
    navigation: StackNavigationProp<any>;
    pokemonList: Pokemon[];
};

const HomeScreen = ({ navigation, pokemonList }: Props) => {
    const handlePress = (pokemon: Pokemon) => {
        navigation.navigate('Details', { pokemon });
    };

    const renderItem = ({ item }: { item: Pokemon }) => {
        const screenWidth = Dimensions.get('window').width;
        const itemWidth = screenWidth / 2 - 15;
        return (
            <View style={[styles.itemContainer, { width: itemWidth}]}>
                <TouchableOpacity style={styles.itemCard} onPress={() => handlePress(item)}>
                    <Text>{item.id}</Text>
                    <Text style={styles.itemName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 5,
  },
  itemContainer: {
    marginVertical: 10,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 5,
    backgroundColor: 'red',
  },
  itemCard: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    marginVertical: 5,
    color: 'white',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;