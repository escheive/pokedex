import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const FilterDropdownDrawer = ({selectedVersions}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [drawerWidth] = useState(new Animated.Value(0));

    const handleDropdownToggle = () => {
        if (dropdownVisible) {
            closeDrawer();
        } else {
            openDrawer();
        }
        setDropdownVisible(!dropdownVisible);
    };

    const openDrawer = () => {
        Animated.timing(drawerWidth, {
            toValue: 200,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerWidth, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const drawerWidthInterpolation = drawerWidth.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 200],
    });

    const handleOptionSelect = (option) => {
        // Handle the selected option here
        console.log('Selected option:', option);
        handleDropdownToggle(); // Close the drawer after selecting an option
    };

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
        <View>
            {/* Your other content */}
            <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={handleDropdownToggle}
            >
                <Text style={styles.dropdownTriggerText}>Select Generations</Text>
            </TouchableOpacity>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: drawerWidthInterpolation,
                        backgroundColor: 'white',
                        // Add any desired styling for the drawer
                    },
                    dropdownVisible ? { left: 0 } : { left: -200 },
                ]}
            >
                {/* Add your options/buttons here */}
                <TouchableOpacity onPress={() => handleOptionSelect('Option 1')}>
                    <Text>Option 1</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOptionSelect('Option 2')}>
                    <Text>Option 2</Text>
                </TouchableOpacity>
                {versionOptions.map((range) => (
                    <TouchableOpacity
                        key={range.key}
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: selectedVersions.includes(range.key) ? 'blue' : 'gray',
                            },
                        ]}
                        onPress={() => handleVersionSelect(range.key)}
                    >
                        <Text style={styles.filterButtonText}>{range.label}</Text>
                    </TouchableOpacity>
                ))}
                {/* ... */}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownTrigger: {
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 5,
    },
    filterButton: {
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 3,
    }
})

export default FilterDropdownDrawer;