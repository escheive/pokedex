// Dependencies
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// Components
import PillBar from '../PillBar';
// Utils
import { capitalizeString } from '../../utils/helpers';

// All the possible stat names
const pokemonStatNames = ['hp', 'atk', 'def', 'sp_atk', 'sp_def', 'spd'];


const PokemonStats = ({ pokemonColors, pokemon }) => {
    // useState for selected stat value tab
    const [selectedTab, setSelectedTab] = useState('base');
    const [calculatedStats, setCalculatedStats] = useState({});
    const [highestStat, setHighestStat] = useState(0);
    const [statsTotal, setStatsTotal] = useState(0);

    const pokemonStats = [];
    for (let statName of pokemonStatNames) {
        pokemonStats.push({name: statName, value: pokemon[statName]})
    }

    useEffect(() => {
        // Based on your tab, calculate stats
        if (selectedTab === 'base') {
            setCalculatedStats(calculateMinMaxStats());
        } else if (selectedTab === 'min') {
            setCalculatedStats(calculateMinMaxStats(100, 0, 0, 'min'));
        } else if (selectedTab === 'max') {
            setCalculatedStats(calculateMinMaxStats(100, 31, 252, 'max'));
        }
    }, [selectedTab, pokemon]);



    // Function to calculate min and max of the pokemons stats
    function calculateMinMaxStats(level, ivs, evs, nature) {
        const maxStats = {};

        // Iterate over each stat
        for (let stat of pokemonStats) {
            // Effort values and individual values default to 0
            const iv = ivs || 0;
            const ev = evs || 0;
            let maxStat = stat.value;

            if (level === 100) {
                maxStat = Math.floor(((2 * stat.value + iv + Math.floor(ev / 4)) * level) / 100) + 5;

                if (stat.name !== "hp") {
                    if (nature === 'max') {
                        maxStat = Math.floor(maxStat * 1.1)
                    } else {
                        maxStat = Math.floor(maxStat * 0.9)
                    }
                } else {
                    maxStat += level + 5
                }
            }

            maxStats[stat.name] = maxStat;
        };

        const statsArray = Object.values(maxStats);
        const total = statsArray.reduce((sum, stat) => sum + stat, 0);
        setStatsTotal(total);
        const maxStat = Math.max(...statsArray);
        setHighestStat(maxStat);

        return maxStats;
    }

    const renderStatItem = ({ item }) => {
        let statValue = pokemon[item];

        if (selectedTab === 'min' && calculatedStats[item]) {
            statValue = calculatedStats[item];
        } else if (selectedTab === 'max' && calculatedStats[item]) {
            statValue = calculatedStats[item];
        }

        return  (
            <View style={styles.statItem}>
                <Text style={styles.statName}>{capitalizeString(item)}:</Text>
                <PillBar percentage={(statValue / highestStat) * 100} stat={statValue} statName={item} pokemon={pokemon} />
            </View>
        );
    };


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
        selectedNavItem: {
            backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
        },
        selectedNavItemText: {
            fontWeight: 'bold',
            color: pokemonColors[pokemon.type1].color,
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
            color: pokemonColors[pokemon.type1].backgroundColor,
        },
    });


    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'base' && styles.selectedNavItem,
                        selectedTab !== 'base' && (pokemon.type2 ? { backgroundColor: pokemonColors[pokemon.type2].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                    ]}
                    onPress={() => setSelectedTab('base')}
                >
                    <Text style={[styles.navItemText, selectedTab === 'base' && styles.selectedNavItemText]}>Base</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'min' && styles.selectedNavItem,
                        selectedTab !== 'min' && (pokemon.type2 ? { backgroundColor: pokemonColors[pokemon.type2].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                    ]}
                    onPress={() => setSelectedTab('min')}
                >
                    <Text style={[styles.navItemText, selectedTab === 'min' && styles.selectedNavItemText]}>Min</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'max' && styles.selectedNavItem,
                        selectedTab !== 'max' && (pokemon.type2 ? { backgroundColor: pokemonColors[pokemon.type2].backgroundColor } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                    ]}
                    onPress={() => setSelectedTab('max')}
                >
                    <Text style={[styles.navItemText, selectedTab === 'max' && styles.selectedNavItemText]}>Max</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={pokemonStatNames}
                renderItem={renderStatItem}
                keyExtractor={(pokemonStatName) => pokemonStatName}
                contentContainerStyle={styles.container}
            />

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

export default PokemonStats;