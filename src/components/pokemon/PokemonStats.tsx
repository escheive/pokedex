import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// Components
import PillBar from '../PillBar';


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
        const statName = baseStats[stat].stat.name;
        // Effort values and individual values default to 0
        const iv = ivs || 0;
        const ev = evs || 0;

        let maxStat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;

        if (statName !== "hp") {
            if (nature === 'max') {
                maxStat = Math.floor(maxStat * 1.1)
            } else {
                maxStat = Math.floor(maxStat * 0.9)
            }
        } else {
            maxStat += level + 5
        }

        maxStats[statName] = maxStat;
    });


    return maxStats;
}

const PokemonStats = ({ pokemonColors, pokemon }) => {
    // useState for selected stat value tab
    const [selectedTab, setSelectedTab] = useState('base');
    const [calculatedStats, setCalculatedStats] = useState({});
    const [highestStat, setHighestStat] = useState(0);
    const [statsTotal, setStatsTotal] = useState(0);

    let statsArray = [];

    useEffect(() => {
        // Based on your tab, calculate stats
        if (selectedTab === 'base') {
            setCalculatedStats({});
        } else if (selectedTab === 'min') {
            setCalculatedStats(calculateMinMaxStats(pokemon.stats, 100, 0, 0, 'min'));
        } else if (selectedTab === 'max') {
            setCalculatedStats(calculateMinMaxStats(pokemon.stats, 100, 31, 252, 'max'));
        }

        statsArray = [];
        // This resets highestStat on tab switch so when you go back to a lower level it doesnt keep that same high limit
        setHighestStat(0);
    }, [selectedTab, pokemon.stats]);


    const renderStatItem = ({ item }) => {
        let statValue = item.base_stat;

        if (selectedTab === 'min' && calculatedStats[item.stat.name]) {
            statValue = calculatedStats[item.stat.name];
        } else if (selectedTab === 'max' && calculatedStats[item.stat.name]) {
            statValue = calculatedStats[item.stat.name];
        }

        if (statValue > highestStat) {
            setHighestStat(statValue)
        }

        statsArray.push(statValue)

        if (statsArray.length === 6) {
            const total = statsArray.reduce((sum, stat) => sum + stat, 0);
            setStatsTotal(total)
        }

        return  (
            <View style={styles.statItem}>
                <Text style={styles.statName}>{shortenStatName(item.stat.name)}:</Text>
                <PillBar percentage={(statValue / highestStat) * 100} stat={statValue} statName={item.stat.name} />
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
        selectedNavItemText: {
            fontWeight: 'bold',
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
            color: pokemonColors[0].backgroundColor,
        },
    });


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