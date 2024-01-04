// Dependencies
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PillBarProps = {
  percentage: number | string;
  stat: number;
  statName: string;
}


// Creating a component that when given a percentage will return a bar filled that much
export const PillBar: React.FC<PillBarProps> = ({ percentage, stat, statName }) => {

  // variable to track how big the pillBar for this stat will be
  const filledWidth = `${percentage}%`;

  // Function to grab the colors for each stat
  const getFillColor = (statName) => {
    switch (statName) {
      case 'Hp':
        return 'rgba(255, 0, 0, 0.5)'; // Red color for HP
      case 'Atk':
        return 'rgba(255, 165, 0, 0.5)'; // Orange color for attack
      case 'Def':
        return 'rgba(70, 140, 255, 0.5)'; // Blue color for defense
      case 'SpAtk':
        return 'rgba(128, 0, 128, 0.5)'; // Purple color for special attack
      case 'SpDef':
        return 'rgba(0, 128, 0, 0.5)'; // Green color for special defense
      case 'Spd':
        return 'rgba(255, 105, 180, 0.5)'; // Pink color for speed
      default:
        return '#eee'; // Default color for unknown stats
    }
  };

  // Variable that will determine color for each pillBar
  const fillColor = getFillColor(statName);


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


  return (

    <View style={styles.container}>
      <View style={styles.pillContainer}>
        <View style={[ 
          styles.pill, 
          {
            backgroundColor: fillColor,
            width: filledWidth
          }
        ]}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{stat}</Text>
          </View>
        </View>
      </View>
    </View>

  );
};