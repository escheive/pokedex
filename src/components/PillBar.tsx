import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Creating a component that when given a percentage will return a bar filled that much
const PillBar = ({ percentage, stat, statName }) => {

    const filledWidth = `${percentage}%`;

    const getFillColor = (statName) => {
        switch (statName) {
            case 'hp':
                return 'rgba(255, 0, 0, 0.5)'; // Red color for HP
            case 'attack':
                return 'rgba(255, 165, 0, 0.5)'; // Orange color for attack
            case 'defense':
                return 'rgba(70, 140, 255, 0.5)'; // Blue color for defense
            case 'special-attack':
                return 'rgba(128, 0, 128, 0.5)'; // Purple color for special attack
            case 'special-defense':
                return 'rgba(0, 128, 0, 0.5)'; // Green color for special defense
            case 'speed':
                return 'rgba(255, 105, 180, 0.5)'; // Pink color for speed
            default:
                return '#eee'; // Default color for unknown stats
        }
    };

    const fillColor = getFillColor(statName);

    return (
        <View style={styles.container}>
            <View style={styles.pillContainer}>
                <View style={[styles.pill, { width: filledWidth, backgroundColor: fillColor }]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{stat}</Text>
                    </View>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 1,
    },
    pillContainer: {
        height: 30,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        },
        pill: {
        height: '100%',
        borderRadius: 10,
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 10,
    },
    text: {
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        fontSize: 18,
    },
});

export default PillBar;
