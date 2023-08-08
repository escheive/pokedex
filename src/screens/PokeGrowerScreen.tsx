import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';


const PokeGrowerScreen = ({ navigation }) => {

    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    return (
        <View style={styles.container}>
            <View>
                <Image
                    alt="Pokemon Image"
                    style={styles.image}
                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonList[2].id}.png` }}
                />
                <View style={styles.pokemonImageOverlay}></View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        width: 75,
        height: 75,
        tintColor: 'black',
    },
    pokemonImageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
});

export default PokeGrowerScreen;