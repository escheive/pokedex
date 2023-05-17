import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// Components
import PillBar from '../PillBar';

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: '#eee',
    borderRadius: 15,
    padding: 10,
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
  navContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 25,
  },
  navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      borderRadius: 10,
      marginHorizontal: 5,
  },
  navItemText: {
      color: 'white',
      fontSize: 20,
  },
  selectedNavItemText: {
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

const PokemonStats = ({ pokemonColors, pokemon }) => {
    const [selectedTab, setSelectedTab] = useState('base');

    const renderStatItem = ({ item }) => (
        <View style={styles.statItem}>
            <Text style={styles.statName}>{shortenStatName(item.stat.name)}:</Text>
            <PillBar percentage={(item.base_stat / 155) * 100} stat={item.base_stat} statName={item.stat.name} />
        </View>
    );

  return (
    <View style={styles.container}>
        <View style={styles.navContainer}>
            <TouchableOpacity
                style={[
                    styles.navItem,
                    selectedTab === 'base' && [styles.selectedNavItemText, { backgroundColor: pokemonColors[0].backgroundColor }],
                    selectedTab !== 'base' && (pokemon.types.length === 2 ? { backgroundColor: pokemonColors[1].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                ]}
                onPress={() => setSelectedTab('base')}
            >
                <Text style={[styles.navItemText, selectedTab === 'base' && styles.selectedNavItemText]}>Base</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.navItem,
                    selectedTab === 'min' && [styles.selectedNavItemText, { backgroundColor: pokemonColors[0].backgroundColor }],
                    selectedTab !== 'min' && (pokemon.types.length === 2 ? { backgroundColor: pokemonColors[1].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                ]}
                onPress={() => setSelectedTab('min')}
            >
                <Text style={[styles.navItemText, selectedTab === 'min' && styles.selectedNavItemText]}>Min</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.navItem,
                    selectedTab === 'max' && [styles.selectedNavItemText, { backgroundColor: pokemonColors[0].backgroundColor }],
                    selectedTab !== 'max' && (pokemon.types.length === 2 ? { backgroundColor: pokemonColors[1].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                ]}
                onPress={() => setSelectedTab('max')}
            >
                <Text style={[styles.navItemText, selectedTab === 'max' && styles.selectedNavItemText]}>Max</Text>
            </TouchableOpacity>
        </View>
        <FlatList
          data={pokemon.stats}
          renderItem={renderStatItem}
          keyExtractor={(item) => item.stat.name}
          contentContainerStyle={styles.container}
        />
    </View>
  );
};

export default PokemonStats;