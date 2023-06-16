import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView } from 'react-native';
import { pokemonColors } from '../utils/typeStyle';
import LinearGradient from 'react-native-linear-gradient';
import { capitalizeString } from '../utils/helpers';

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

    const selectedVersions = versionOptions.filter((range) =>
        filterOptions.selectedVersions.includes(range.key)
    );

    const unselectedVersions = versionOptions.filter((range) =>
        !filterOptions.selectedVersions.includes(range.key)
    );

    const selectedTypes = Object.keys(pokemonColors).filter((type) =>
        filterOptions.selectedTypes.includes(type)
    );

    const unselectedTypes = Object.keys(pokemonColors).filter((type) =>
        !filterOptions.selectedTypes.includes(type)
    );

    return (
        <View style={styles.filterDropdownContainer}>
            <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={handleDropdownToggle}
            >
                <Text style={styles.dropdownTriggerText}>Select Generations</Text>
            </TouchableOpacity>

            <Modal visible={dropdownVisible} animationType="slide">
                <ScrollView style={styles.modalContent}>

                    {(selectedVersions.length > 0 || selectedTypes.length > 0 || filterOptions.showFavorites || filterOptions.showCapturedPokemon) && (
                        <View style={styles.activeFiltersContainer}>
                            <Text style={styles.activeFiltersTitle}>Active Filters</Text>

                            {selectedVersions.map((range) => (
                                <TouchableOpacity
                                    key={range.key}
                                    style={styles.filterButton}
                                    onPress={() => handleVersionSelect(range.key)}
                                >
                                    <LinearGradient
                                        colors={ range.colors }
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={styles.gradient}
                                    >
                                        <Text style={styles.filterButtonText}>{range.name}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}

                            {selectedTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={styles.filterButton}
                                    onPress={() => handleTypeSelect(type)}
                                >
                                    <LinearGradient
                                        colors={[ pokemonColors[type].backgroundColor, pokemonColors[type].alternateBackgroundColor ]}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={styles.gradient}
                                    >
                                        <Text style={styles.filterButtonText}>{capitalizeString(type)}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}

                            {filterOptions.showFavorites && (
                                <TouchableOpacity
                                    style={styles.filterButton}
                                    onPress={() =>
                                        setFilterOptions((prevOptions) => ({
                                            ...prevOptions,
                                            showFavorites: !filterOptions.showFavorites,
                                        }))
                                    }
                                >
                                    <View style={styles.favoritesFilterButton}>
                                        <Text style={styles.filterButtonText}>Favorites</Text>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {filterOptions.showCapturedPokemon && (
                                <TouchableOpacity
                                    style={styles.filterButton}
                                    onPress={() =>
                                        setFilterOptions((prevOptions) => ({
                                            ...prevOptions,
                                            showCapturedPokemon: !filterOptions.showCapturedPokemon,
                                        }))
                                    }
                                >
                                    <View style={styles.caughtFilterButton}>
                                        <Text style={styles.filterButtonText}>Caught</Text>
                                    </View>
                                </TouchableOpacity>
                            )}

                        </View>
                    )}

                    <View style={styles.filtersContainer}>
                        {unselectedVersions.length > 0 && (
                            <Text style={styles.activeFiltersTitle}>Gens</Text>
                        )}

                        {versionOptions.map((range) => {
                            if (filterOptions.selectedVersions.includes(range.key)) {
                                return null;
                            }

                            return (
                                <TouchableOpacity
                                    key={range.key}
                                    style={styles.filterButton}
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
                            );
                        })}

                        {unselectedTypes.length > 0 && (
                            <Text style={styles.activeFiltersTitle}>Types</Text>
                        )}

                        {Object.keys(pokemonColors).map((type) => {
                            if (filterOptions.selectedTypes.includes(type)) {
                                return null;
                            }

                            return (
                                <TouchableOpacity
                                    key={type}
                                    style={styles.filterButton}
                                    onPress={() => handleTypeSelect(type)}
                                >
                                    <LinearGradient
                                        colors={[ pokemonColors[type].backgroundColor, pokemonColors[type].alternateBackgroundColor ]}
                                        start={{ x: 0.5, y: 1 }}
                                        end={{ x: 0.5, y: 0 }}
                                        style={[
                                            styles.gradient
                                        ]}
                                    >
                                        <Text style={styles.filterButtonText}>{capitalizeString(type)}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.otherFiltersContainer}>
                        {(!filterOptions.showFavorites) && (
                            <TouchableOpacity
                                style={styles.filterButton}
                                onPress={() =>
                                    setFilterOptions((prevOptions) => ({
                                        ...prevOptions,
                                        showFavorites: !filterOptions.showFavorites,
                                    }))
                                }
                            >
                                <View style={styles.favoritesFilterButton}>
                                    <Text style={styles.filterButtonText}>Favorites</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {(!filterOptions.showCapturedPokemon) && (
                            <TouchableOpacity
                                style={styles.filterButton}
                                onPress={() =>
                                    setFilterOptions((prevOptions) => ({
                                        ...prevOptions,
                                        showCapturedPokemon: !filterOptions.showCapturedPokemon,
                                    }))
                                }
                            >
                                <View style={styles.caughtFilterButton}>
                                    <Text style={styles.filterButtonText}>Caught</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.closeButton} onPress={handleDropdownToggle}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    filterDropdownContainer: {
    },
    activeFiltersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#777',
    },
    activeFiltersContainer: {
        marginBottom: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        paddingTop: 10,
        marginHorizontal: 30,
    },
    filtersContainer: {
        flexDirection: 'column',
        marginBottom: 20,
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
        justifyContent: 'center',
        borderRadius: 15,
        marginVertical: 3,
    },
    gradient: {
        borderRadius: 10,
        padding: 8,
        flex: 1,
    },
    otherFiltersContainer: {
        flexDirection: 'column',
        marginBottom: 20,
        flex: 1,
    },
    favoritesFilterButton: {
        borderRadius: 10,
        padding: 8,
        flex: 1,
        backgroundColor: '#FF6347',
    },
    caughtFilterButton: {
        borderRadius: 10,
        padding: 8,
        flex: 1,
        backgroundColor: '#40E0D0',
    },
    filterButtonText: {
        fontSize: 18,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: 'white',
    },
})

export default FilterDropdownDrawer;