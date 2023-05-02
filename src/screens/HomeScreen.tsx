import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={{ padding: 10 }}>
                <Text>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

  return (
    <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={item => item.name}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});

export default HomeScreen;