// Dependencies
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// Components
import { PillBar } from '../PillBar';
// Utils
import { capitalizeString } from '../../utils/helpers';
import { pokemonColors } from '../../utils/helpers';

interface PokemonStat {
  __typename: string;
  base_stat: number;
  pokemon_v2_stat: {
    __typename: string;
    name: string;
  };
}

interface PokemonType {
  __typename: string;
  pokemon_v2_type: {
    id: number;
    name: string;
    __typename: string;
  };
}

interface PokemonStatsProps {
  pokemonTypes: PokemonType[];
  pokemonStats: PokemonStat[];
}


export const PokemonStats: React.FC<PokemonStatsProps> = ({ 
  pokemonTypes, pokemonStats 
}) => {

  // useState for selected stat value tab
  const [selectedTab, setSelectedTab] = useState('base');
  const [calculatedStats, setCalculatedStats] = useState({});
  const [highestStat, setHighestStat] = useState({});
  const [statsTotal, setStatsTotal] = useState({});
  

  const textColor = pokemonColors[pokemonTypes[0].pokemon_v2_type.name].color;
  const alternateTextColor = pokemonTypes[1] ? pokemonColors[pokemonTypes[1].pokemon_v2_type.name].color : '#F5F5F5';
  const backgroundColor = pokemonColors[pokemonTypes[0].pokemon_v2_type.name].backgroundColor;
  const alternateBackgroundColor = pokemonTypes[1] ? pokemonColors[pokemonTypes[1].pokemon_v2_type.name].backgroundColor : 'rgba(128, 128, 128, 0.5)';


  useEffect(() => {
    const baseStats = {};
    pokemonStats.forEach(stat => {
      baseStats[stat.pokemon_v2_stat.name] = stat.base_stat;
    });

    const minStats = calculateMinMaxStats(100, 0, 0, 'min');
    const maxStats = calculateMinMaxStats(100, 31, 252, 'max');

    const calculateTotal = (stats) => Object.values(stats).reduce((sum, value) => sum + value, 0);

    const baseTotal = calculateTotal(baseStats);
    const minTotal = calculateTotal(minStats);
    const maxTotal = calculateTotal(maxStats);

    setCalculatedStats({
      base: baseStats,
      min: minStats,
      max: maxStats,
    });

    setHighestStat({
      base: Math.max(...Object.values(baseStats)),
      min: Math.max(...Object.values(minStats)),
      max: Math.max(...Object.values(maxStats))
    })

    setStatsTotal({
      base: baseTotal,
      min: minTotal,
      max: maxTotal
    })
  }, [pokemonStats]);



  // Function to calculate min and max of the pokemons stats
  function calculateMinMaxStats(level: number, ivs: number, evs: number, nature: string) {
    const maxStats: { [key: string]: number } = {};

    // Iterate over each stat
    for (let stat of pokemonStats) {
      // Effort values and individual values default to 0
      const iv = ivs || 0;
      const ev = evs || 0;
      let maxStat = stat.base_stat;

      if (level === 100) {
        maxStat = Math.floor(((2 * stat.base_stat + iv + Math.floor(ev / 4)) * level) / 100) + 5;

        if (stat.pokemon_v2_stat.name !== "hp") {
          if (nature === 'max') {
            maxStat = Math.floor(maxStat * 1.1)
          } else {
          maxStat = Math.floor(maxStat * 0.9)
          }
        } else {
          maxStat += level + 5
        }
      }

      maxStats[stat.pokemon_v2_stat.name] = maxStat;
    };

    return maxStats;
  }

  const statNameMappings = {
    hp: 'Hp',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'SpAtk',
    'special-defense': 'SpDef',
    speed: 'Spd',
  };


  const renderStats = () => {
    const statItems = [];
    const selectedStats = calculatedStats[selectedTab];

    if (!selectedStats) {
      return null;
    }

    pokemonStats.forEach((stat) => {
      const shortenedStatName = statNameMappings[stat.pokemon_v2_stat.name] || stat.pokemon_v2_stat.name;
      const statValue = selectedStats[stat.pokemon_v2_stat.name];

      const statItem = (
        <View style={styles.statItem} key={shortenedStatName}>
          <Text style={styles.statName}>{shortenedStatName}:</Text>
          <PillBar percentage={(statValue / highestStat[selectedTab]) * 100} stat={statValue} statName={shortenedStatName} />
        </View>
      );

      statItems.push(statItem);
    });

    return statItems;
  };


  return (
    <View style={styles.container}>
      <Text style={styles.statsTitleText}>Stats</Text>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === 'base' && (styles.selectedNavItem, { backgroundColor, color: textColor}),
            selectedTab !== 'base' && { backgroundColor: alternateBackgroundColor }
          ]}
          onPress={() => setSelectedTab('base')}
        >
          <Text 
            style={[
              styles.navItemText, 
              { color: alternateTextColor }, 
              selectedTab === 'base' && (styles.selectedNavItemText, 
              { color: textColor })
            ]}
          >
            Base
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === 'min' && (styles.selectedNavItem, { backgroundColor, color: textColor}),
            selectedTab !== 'min' && { backgroundColor: alternateBackgroundColor }
          ]}
          onPress={() => setSelectedTab('min')}
        >
          <Text 
            style={[
              styles.navItemText, 
              { color: alternateTextColor }, 
              selectedTab === 'min' && (styles.selectedNavItemText, 
              { color: textColor })
            ]}
          >
            Min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            selectedTab === 'max' && (styles.selectedNavItem, { backgroundColor, color: textColor}),
            selectedTab !== 'max' && { backgroundColor: alternateBackgroundColor }
          ]}
          onPress={() => setSelectedTab('max')}
        >
          <Text 
            style={[
              styles.navItemText,
              { color: alternateTextColor },
              selectedTab === 'max' && (styles.selectedNavItemText, 
              { color: textColor })
            ]}
          >
            Max
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pillBars}>
        {renderStats()}
      </View>

      <Text style={styles.statsTotalContainer}>
        <Text style={styles.statsTotalText}>TOTAL </Text>
        <Text style={[styles.statsTotalValue, { color: backgroundColor }]}>{statsTotal[selectedTab]}</Text>
      </Text>

      {selectedTab === "max" ? (
        <>
          <Text style={styles.statDisclaimerText}>*Stats at lvl 100, 31 IVs, 252 Evs, and beneficial nature</Text>
          <Text style={styles.statDisclaimerText}>**Please note that a pokemon can only have 510 EVs total</Text>
        </>
      ) : null}
      {selectedTab === "min" ? (
        <Text style={styles.statDisclaimerText}>*Stats at lvl 100, 0 IVs, 0 Evs, and hindering nature</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginBottom: 25,
    backgroundColor: 'rgba(170, 170, 170, 0.2)',
    borderRadius: 15,
    padding: 10,
    textAlign: 'center',
  },
  statsTitleText: {
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 18,
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
    alignItems: 'center',
    marginBottom: 25,
  },
  navItem: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderRadius: 10,
    marginHorizontal: 8,
    height: 35,
  },
  navItemText: {
    fontSize: 20,
    fontWeight: '500',
  },
  selectedNavItem: {
    flex: 8,
    height: 40,
  },
  selectedNavItemText: {
    fontWeight: '900',
  },
  pillBars: {
    paddingHorizontal: 5,
  },
  statDisclaimerText: {
    textAlign: 'center',
  },
  statsTotalContainer: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 18,
  },
  statsTotalValue: {
    fontWeight: 'bold',
  },
});