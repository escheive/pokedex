import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image } from 'react-native';
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

    const renderItem = ({ item }: { item: Pokemon }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
            <Image
                style={styles.image}
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
            />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemName}>{item.id}</Text>
        </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    marginLeft: 10,
    color: 'white',
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default HomeScreen;