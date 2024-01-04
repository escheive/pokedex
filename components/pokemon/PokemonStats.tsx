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
  const [highestStat, setHighestStat] = useState(0);
  const [statsTotal, setStatsTotal] = useState(0);


    useEffect(() => {
      // Based on your tab, calculate stats
      if (selectedTab === 'min') {
        setCalculatedStats(calculateMinMaxStats(100, 0, 0, 'min'));
      } else if (selectedTab === 'max') {
        setCalculatedStats(calculateMinMaxStats(100, 31, 252, 'max'));
      }
    }, [selectedTab, pokemonStats]);



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

      const statsArray = Object.values(maxStats);
      const total = statsArray.reduce((sum, stat) => sum + stat, 0);
      setStatsTotal(total);
      const maxStat = Math.max(...statsArray);
      setHighestStat(maxStat);

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

      pokemonStats.forEach((stat) => {
        const shortenedStatName = statNameMappings[stat.pokemon_v2_stat.name] || stat.pokemon_v2_stat.name;
        let statValue = stat.base_stat

        if (selectedTab === 'min' && calculatedStats[stat.pokemon_v2_stat.name]) {
          statValue = calculatedStats[stat.pokemon_v2_stat.name];
        } else if (selectedTab === 'max' && calculatedStats[stat.pokemon_v2_stat.name]) {
          statValue = calculatedStats[stat.pokemon_v2_stat.name];
        }

        const statItem = (
          <View style={styles.statItem} key={shortenedStatName}>
            <Text style={styles.statName}>{shortenedStatName}:</Text>
            <PillBar percentage={(statValue / highestStat) * 100} stat={statValue} statName={shortenedStatName} />
          </View>
        );

        statItems.push(statItem);
      });

      return statItems;
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
        color: pokemonTypes[1] ? pokemonColors[pokemonTypes[1].pokemon_v2_type.name].color : '#F5F5F5'
      },
      selectedNavItem: {
        backgroundColor: pokemonColors[pokemonTypes[0].pokemon_v2_type.name].backgroundColor,
        color: pokemonColors[pokemonTypes[0].pokemon_v2_type.name].color,
        flex: 8,
        height: 40,
      },
      selectedNavItemText: {
        fontWeight: '900',
        color: pokemonColors[pokemonTypes[0].pokemon_v2_type.name].color,
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
        color: pokemonColors[pokemonTypes[0].pokemon_v2_type.name].backgroundColor,
      },
    });


    return (
        <View style={styles.container}>
            <Text style={styles.statsTitleText}>Stats</Text>
            <View style={styles.navContainer}>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'base' && styles.selectedNavItem,
                        selectedTab !== 'base' && (pokemonTypes[1] ? { backgroundColor: pokemonColors[pokemonTypes[1].pokemon_v2_type.name].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                    ]}
                    onPress={() => setSelectedTab('base')}
                >
                    <Text style={[styles.navItemText, selectedTab === 'base' && styles.selectedNavItemText]}>Base</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'min' && styles.selectedNavItem,
                        selectedTab !== 'min' && (pokemonTypes[1] ? { backgroundColor: pokemonColors[pokemonTypes[1].pokemon_v2_type.name].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                    ]}
                    onPress={() => setSelectedTab('min')}
                >
                    <Text style={[styles.navItemText, selectedTab === 'min' && styles.selectedNavItemText]}>Min</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'max' && styles.selectedNavItem,
                        selectedTab !== 'max' && (pokemonTypes[1] ? { backgroundColor: pokemonColors[pokemonTypes[1].pokemon_v2_type.name].backgroundColor, color: pokemonColors[pokemonTypes[0].pokemon_v2_type.name].color } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                    ]}
                    onPress={() => setSelectedTab('max')}
                >
                    <Text style={[styles.navItemText, selectedTab === 'max' && styles.selectedNavItemText]}>Max</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.pillBars}>
                {renderStats()}
            </View>

            <Text style={styles.statsTotalContainer}>
                <Text style={styles.statsTotalText}>TOTAL </Text>
                <Text style={styles.statsTotalValue}>{statsTotal}</Text>
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