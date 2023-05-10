import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
// Components
import PillBar from './PillBar';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 5,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  statName: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const shortenStatName = (name) => {
    switch (name) {
        case 'hp':
            return 'HP';
        case 'attack':
            return 'Atk';
        case 'defense':
            return 'Def';
        case 'special-attack':
            return 'SpAtk';
        case 'special-defense':
            return 'SpDef';
        case 'speed':
            return 'Spd';
        default:
            return name;
    }
};

const PokemonStats = ({ stats }) => {
    const renderStatItem = ({ item }) => (
        <View style={styles.statItem}>
            <Text style={styles.statName}>{shortenStatName(item.stat.name)}:</Text>
            <PillBar percentage={(item.base_stat / 300)} stat={item.base_stat} />
        </View>
    );

  return (
    <View style={styles.container}>
        <FlatList
          data={stats}
          renderItem={renderStatItem}
          keyExtractor={(item) => item.stat.name}
          contentContainerStyle={styles.container}
        />
    </View>
  );
};

export default PokemonStats;