import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// Components
import PillBar from './PillBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 4,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: 300,
  },
  statName: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const PokemonStats = ({ stats }) => {
  const renderStatItem = ({ item }) => (
    <View style={styles.statItem}>
      <Text style={styles.statName}>{item.stat.name}:</Text>
      <Text style={styles.statValue}>{item.base_stat}</Text>
      <PillBar percentage={50} />
    </View>
  );

  return (
    <FlatList
      data={stats}
      renderItem={renderStatItem}
      keyExtractor={(item) => item.stat.name}
      contentContainerStyle={styles.container}
    />
  );
};

export default PokemonStats;