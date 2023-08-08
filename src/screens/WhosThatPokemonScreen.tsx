import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';


const PokeGrowerScreen = ({ navigation }) => {
    const [userAnswer, setUserAnswer] = useState('');

    const handleSubmit = () => {
        // TODO: handle user answer
        console.log('User submitted: ', userAnswer);
    }

    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    return (
        <View style={styles.container}>

            <View style={styles.scoresContainer}>
                <View styles={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Last Score: 16</Text>
                </View>

                <View styles={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Hi-Score: 54</Text>
                </View>

                <View styles={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Trophies: 10/26</Text>
                </View>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter answer here"
                onChangeText={setUserAnswer}
                value={userAnswer}
            />
            <TouchableOpacity

            >
                <Text>Start</Text>
            </TouchableOpacity>

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
    scoresContainer: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-between',
        marginVertical: 5,
        backgroundColor: 'yellow',
        borderRadius: 20,
        borderColor: 'blue',
        borderWidth: 3,

    },
    scoreContainer: {

    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 6,
        borderRadius: 16,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: 250,
        marginBottom: 10,
        textAlign: 'center',
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