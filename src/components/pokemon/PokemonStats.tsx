import React, { useState, useEffect } from 'react';
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

// Function to calculate min and max of the pokemons stats
function calculateMinMaxStats(baseStats, level, ivs, evs, nature) {
    const maxStats = {};

    // Iterate over each stat
    Object.keys(baseStats).forEach((stat) => {
        // baseStat variable will be equal to the numerical value of the base_stat
        const baseStat = baseStats[stat].base_stat;
        // Effort values and individual values default to 0
        const iv = ivs || 0;
        const ev = evs || 0;

        let maxStat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;

        if (baseStats[stat].stat.name !== "hp") {
            if (nature === 'max') {
                maxStat = Math.floor(maxStat * 1.1)
            } else {
                maxStat = Math.floor(maxStat * 0.9)
            }
        } else {
            maxStat += level + 5
        }

        maxStats[stat] = maxStat;
    });

    return maxStats;
}

const PokemonStats = ({ pokemonColors, pokemon }) => {
    const [selectedTab, setSelectedTab] = useState('base');
    const [calculatedStats, setCalculatedStats] = useState({})
    const [highestStat, setHighestStat] = useState(0)


    useEffect(() => {
        if (selectedTab === 'base') {
            setCalculatedStats({});
        } else if (selectedTab === 'min') {
            setCalculatedStats(calculateMinMaxStats(pokemon.stats, 100, 0, 0, 'min'));
        } else if (selectedTab === 'max') {
            setCalculatedStats(calculateMinMaxStats(pokemon.stats, 100, 31, 252, 'max'));
        }
    }, [selectedTab, pokemon.stats]);


    const renderStatItem = ({ item }) => {
        let statValue = item.base_stat
        if (statValue > highestStat) {
            setHighestStat(statValue)
        }

        if (selectedTab === 'min' && calculatedStats[item.stat.name]) {
            statValue = calculatedStats[item.stat.name].min;
        } else if (selectedTab === 'max' && calculatedStats[item.stat.name]) {
            statValue = calculatedStats[item.stat.name].max;
        }

        return  (
            <View style={styles.statItem}>
                <Text style={styles.statName}>{shortenStatName(item.stat.name)}:</Text>
                <PillBar percentage={(statValue / highestStat) * 100} stat={statValue} statName={item.stat.name} />
            </View>
        );
    };


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