import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Creating a component that when given a percentage will return a bar filled that much
const PillBar = ({ percentage }) => {
    const filledWidth = `${percentage}%`;
    const emptyWidth = `${100 - percentage}%`;

    return (
        <View style={styles.container}>
            <View style={[styles.pill, { width: filledWidth }]} />
            <View style={[styles.pill, styles.emptyPill, { width: emptyWidth }]} />
            <View style={[styles.textContainer, { left: filledWidth }]}>
                <Text style={styles.text}>{percentage}%</Text>
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
  },
  pill: {
    height: 16,
    borderRadius: 8,
  },
  emptyPill: {
    backgroundColor: '#ECECEC',
  },
  textContainer: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
  },
  text: {
      color: 'white',
      fontWeight: 'bold',
  },
});

export default PillBar;
