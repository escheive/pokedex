import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pokeGrowerIncrement } from '../actions/pokeGrowerActions';
import { View, Text, StyleSheet, Button } from 'react-native';


const PokeGrowerScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const money = useSelector((state) => state.pokeGrower.money);

    useEffect(() => {
        setInterval(() => {
            dispatch(pokeGrowerIncrement());
        }, 1000);
    }, [])

    return (
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome to PokeGrower!</Text>
          <Text style={styles.body}>This is the PokeGrower screen.</Text>
          <Text>{money}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PokeGrowerScreen;