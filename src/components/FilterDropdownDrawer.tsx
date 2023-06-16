import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { pokemonColors } from '../utils/typeStyle';
import LinearGradient from 'react-native-linear-gradient';

const FilterDropdownDrawer = ({ setSelectedVersions, setFilterOptions, filterOptions }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [drawerWidth] = useState(new Animated.Value(0));

    const handleVersionSelect = (version: string) => {
        let updatedVersions: string[] = [];

        if (filterOptions.selectedVersions.includes(version)) {
          updatedVersions = filterOptions.selectedVersions.filter((v) => v !== version);
        } else {
          updatedVersions = [...filterOptions.selectedVersions, version];
        }

        setFilterOptions((prevOptions) => ({
            ...prevOptions,
            selectedVersions: updatedVersions,
        }))
    };

    const handleTypeSelect = (type: string) => {
        let updatedTypes: string[] = [];

        if (filterOptions.selectedTypes.includes(type)) {
          updatedTypes = filterOptions.selectedTypes.filter((t) => t !== type);
        } else {
          updatedTypes = [...filterOptions.selectedTypes, type];
        }

        setFilterOptions((prevOptions) => ({
            ...prevOptions,
            selectedTypes: updatedTypes,
        }))
    };

    const handleDropdownToggle = () => {
        if (dropdownVisible) {
            closeDrawer();
        } else {
            openDrawer();
        }
    };

    const openDrawer = () => {
        setDropdownVisible(!dropdownVisible);
        Animated.timing(drawerWidth, {
            toValue: 200,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerWidth, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
        }).start(() => {
            setDropdownVisible(!dropdownVisible);
        });
    };

    const drawerWidthInterpolation = drawerWidth.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 200],
    });

    const versionOptions = [
        { key: 'gen1', label: 'Gen 1', name: `Red/Blue`, colors: ['#FF4444', '#6666FF'] },
        { key: 'gen2', label: 'Gen 2', name: `Gold/Silver`, colors: ['#EAA520', '#B0B0B0'] },
        { key: 'gen3', label: 'Gen 3', name: `Ruby/Sapphire`, colors: ['#DD0000', '#0000BB'] },
        { key: 'gen4', label: 'Gen 4', name: `Diamond/Pearl`, colors: ['#AAAAFF', '#FFAAAA'] },
        { key: 'gen5', label: 'Gen 5', name: `Black/White`, colors: ['#000000', '#FFFFFF'] },
        { key: 'gen6', label: 'Gen 6', name: `X/Y`, colors: ['#FF4500', '#2E8B57'] },
        { key: 'gen7', label: 'Gen 7', name: `Sun/Moon`, colors: ['#FFA200', '#4684B4'] },
        { key: 'gen8', label: 'Gen 8', name: `Sword/Shield`, colors: ['#6BB6FE', '#C41E3A'] },
        { key: 'gen9', label: 'Gen 9', name: `Scarlet/Violet`, colors: ['#992400', '#6A0DAD'] },
    ];

    return (
        <View style={styles.filterDropdownContainer}>
            {/* Your other content */}
            <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={handleDropdownToggle}
            >
                <Text style={styles.dropdownTriggerText}>Select Generations</Text>
            </TouchableOpacity>
            <Animated.View
                style={[
                    styles.animatedViewContainer,
                    { width: drawerWidthInterpolation },
                    dropdownVisible ? { left: 0 } : { left: -200 },
                ]}
            >
                <View style={styles.filtersContainer}>
                    {versionOptions.map((range) => (
                        <TouchableOpacity
                            key={range.key}
                            style={[
                                styles.filterButton,
                                {
                                    borderColor: filterOptions.selectedVersions.includes(range.key) ? 'black' : null,
                                    borderWidth: filterOptions.selectedVersions.includes(range.key) ? 3 : null,
                                }
                            ]}
                            onPress={() => handleVersionSelect(range.key)}
                        >
                            <LinearGradient
                                colors={ range.colors }
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={[
                                    styles.gradient,

                                ]}
                            >
                                <Text style={styles.filterButtonText}>{range.name}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                    {Object.keys(pokemonColors).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.filterButton,
                                {
                                    backgroundColor: filterOptions.selectedTypes.includes(type) ? pokemonColors[type].backgroundColor : pokemonColors[type].backgroundColor,
                                    color: pokemonColors[type].color,
                                },
                            ]}
                            onPress={() => handleTypeSelect(type)}
                        >
                            <Text style={styles.filterButtonText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: filterOptions.showFavorites ? 'blue' : '#E5E5E5',
                            },
                        ]}
                        onPress={() =>
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                showFavorites: !filterOptions.showFavorites,
                            }))
                        }
                    >
                        <Text style={styles.filterButtonText}>Favorites</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: filterOptions.showCapturedPokemon ? 'blue' : '#E5E5E5',
                            },
                        ]}
                        onPress={() =>
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                showCapturedPokemon: !filterOptions.showCapturedPokemon,
                            }))
                        }
                    >
                            <Text style={styles.filterButtonText}>Caught</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={handleDropdownToggle}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterDropdownContainer: {
        flex: 1,
        position: 'relative',
    },
    animatedViewContainer: {
    },
    filtersContainer: {
        backgroundColor: 'white',
        flexDirection: 'column',
        flex: 1,
    },
    dropdownTrigger: {
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    filterButton: {
        borderRadius: 10,
        marginHorizontal: 5,
        marginVertical: 3,
        height: 35,
    },
    gradient: {
        padding: 5,
        borderRadius: 5,
        flex: 1,
    },
    filterButtonText: {
        fontSize: 16,
        fontWeight: 800,
        color: 'white',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#E5E5E5',
        padding: 6,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 10,
        minHeight: 40,
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: 'white',
    },
})

export default FilterDropdownDrawer;