import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { pokemonColors } from '../utils/typeStyle';

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
        { key: 'gen1', label: 'Gen 1' },
        { key: 'gen2', label: 'Gen 2' },
        { key: 'gen3', label: 'Gen 3' },
        { key: 'gen4', label: 'Gen 4' },
        { key: 'gen5', label: 'Gen 5' },
        { key: 'gen6', label: 'Gen 6' },
        { key: 'gen7', label: 'Gen 7' },
        { key: 'gen8', label: 'Gen 8' },
        { key: 'gen9', label: 'Gen 9' },
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
                                    backgroundColor: filterOptions.selectedVersions.includes(range.key) ? 'blue' : '#E5E5E5',
                                },
                            ]}
                            onPress={() => handleVersionSelect(range.key)}
                        >
                            <Text style={styles.filterButtonText}>{range.label}</Text>
                        </TouchableOpacity>
                    ))}
                    {Object.keys(pokemonColors).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.filterButton,
                                {
                                    backgroundColor: filterOptions.selectedTypes.includes(type) ? pokemonColors[type].backgroundColor : '#E5E5E5',
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
        flex: 1,
    },
    filtersContainer: {
        backgroundColor: 'white',
        height: '100%',
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
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 3,
        minHeight: 30,
        flex: 3,
    },
    filterButtonText: {
        fontSize: 16,
        color: 'white',
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