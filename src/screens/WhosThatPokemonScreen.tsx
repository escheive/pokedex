import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const PokeGrowerScreen = ({ navigation }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [rulesOpen, setRulesOpen] = useState(false);
    const [randomPokemon, setRandomPokemon] = useState(1);

    const grabRandomPokemon = () => {
        const randomPokemonId = Math.floor(Math.random() * 30)
        setRandomPokemon(randomPokemonId)
    }

    const startGame = () => {
        // TODO: initiate the guessing game
        grabRandomPokemon();
        console.log('Game has been started');
    }

    const handleSubmit = () => {
        // TODO: handle user answer
        if (userAnswer.toLowerCase() === pokemonList[randomPokemon].name) {

        }
        console.log('User submitted: ', userAnswer);
    }

    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    return (
        <View style={styles.container}>

            <View style={styles.scoresContainer}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Last Score: 16</Text>
                </View>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Hi-Score: 54</Text>
                </View>

                <View style={styles.scoreContainer}>
                    <Ionicons
                        name="trophy-sharp"
                        size={20}
                        color="black"
                    />
                    <Text style={styles.scoreText}>10/26</Text>
                </View>

            </View>

            <TouchableOpacity
                style={styles.scoreContainer}
                onPress={() => setRulesOpen(true)}
            >
                <Ionicons
                    name="information-circle-outline"
                    size={24}
                    color="black"
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Rules</Text>
            </TouchableOpacity>

            <Modal visible={rulesOpen === true} animationType="fade" transparent>
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setRulesOpen(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={() => {}}
                    >
                        <Text style={styles.modalTitle}>Rules</Text>
                        <View style={styles.modalDefinitionContainer}>
                            <Text style={styles.modalDefinition}>Game rules</Text>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={startGame}
            >
                <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>

            <View>
                <Image
                    alt="Pokemon Image"
                    style={styles.image}
                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonList[randomPokemon].id}.png` }}
                />
                <View style={styles.pokemonImageOverlay}></View>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Enter answer here"
                onChangeText={setUserAnswer}
                value={userAnswer}
            />

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Image
                    source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                    style={styles.pokeballImage}
                />
                <Text style={styles.submitButtonText}>Catch This Pokémon</Text>
            </TouchableOpacity>

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
        flexDirection: 'row',
        padding: 6,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 16,
    },
    startButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginHorizontal: 10,
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
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: 250,
        marginVertical: 10,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#ff3838',
        padding: 6,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pokeballImage: {
        width: 36,
        height: 36,
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginHorizontal: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        alignItems: 'center',
        backgroundColor: '#ccc',
        width: '90%',
        borderRadius: 16,
    },
    modalTitle: {
        textAlign: 'center',
        width: '100%',
        fontSize: 24,
        fontWeight: 'bold',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#ff3838',
        color: 'white',
        paddingVertical: 16,
    },
    modalDefinitionContainer: {
        backgroundColor: '#fff',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    modalDefinition: {
        fontSize: 18,
        color: 'gray',
        padding: 10,
        width: '100%',
        borderRadius: 12,
        textAlign: 'center',
        marginVertical: 30,
    },
});

export default PokeGrowerScreen;