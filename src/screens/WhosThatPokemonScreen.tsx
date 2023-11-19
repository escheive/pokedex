import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions, View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CorrectBanner from '../components/WhosThatPokemon/CorrectBanner';
import { capitalizeString } from '../utils/helpers';


const PokeGrowerScreen = ({ navigation }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [rulesOpen, setRulesOpen] = useState(false);
    const [randomPokemon, setRandomPokemon] = useState(1);
    const [isCorrect, setIsCorrect] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [liveScore, setLiveScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [lastScore, setLastScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const grabRandomPokemon = () => {
        const randomPokemonId = Math.floor(Math.random() * 39 + 1)
        setRandomPokemon(randomPokemonId)
    }

    const startGame = () => {
        setLiveScore(0)
        setLives(3)
        setGameStarted(true)
        grabRandomPokemon();
        console.log('Game has been started');
    }

    const handleSubmit = () => {
        if (userAnswer.toLowerCase() === pokemonList[randomPokemon].name) {
            setIsCorrect('Correct')
            setLiveScore(liveScore + 1)
        } else {
            if (lives > 1) {
                setIsCorrect('Incorrect')
                setLives(lives - 1)
            } else {
                setIsCorrect('Game Over')
                setLastScore(liveScore);
                if (liveScore > highScore) {
                    setHighScore(liveScore)
                }
            }
        }
        setTimeout(() => {
            if (lives == 1) {
                setGameStarted(false)
            }
            setUserAnswer('')
            setIsCorrect(null)
            grabRandomPokemon();
        }, 1500);

        console.log('User submitted: ', userAnswer);
    }

    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexGrow: 1,
        },
        scoresContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            backgroundColor: '#ddd',
        },
        scoreContainer: {
            flexDirection: 'row',
            width: '33%',
            padding: 12,
            justifyContent: 'center',
        },
        scoreText: {
            fontSize: 16,
            fontWeight: 'bold',
            borderRadius: 16,
        },
        howToPlayButton: {
            flexDirection: 'row',
            marginVertical: 15,
        },
        startButtonText: {
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            marginHorizontal: 10,
        },
        gameContainer: {
        },
        gameplayContainer: {
            alignItems: 'center',
        },
        liveScoreContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            borderWidth: 4,
            marginBottom: 10,
        },
        liveScore: {
            fontSize: 24,
            padding: 6,
            borderRadius: 20,
        },
        image: {
            width: 300,
            height: 300,
            tintColor: isCorrect !== null ? null : 'black',
        },
        pokemonName: {
            fontSize: 34,
            fontWeight: 'bold',
        },
        input: {
            padding: 10,
            borderWidth: 1,
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
            width: '95%',
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
        modalRule: {
            fontSize: 20,
            color: 'gray',
            padding: 5,
            width: '100%',
            borderRadius: 12,
            textAlign: 'center',
            marginVertical: 10,
        },
    });

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" keyboardVerticalOffset={-100}>
            <View style={styles.container}>

                <View style={styles.scoresContainer}>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Last Score: {lastScore}</Text>
                    </View>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>Hi-Score: {highScore}</Text>
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

                <CorrectBanner isCorrect={isCorrect} />

                <TouchableOpacity
                    style={styles.howToPlayButton}
                    onPress={() => setRulesOpen(true)}
                >
                    <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color="black"
                    />
                    <Text style={{ fontSize: 18, fontWeight: 'bold'}}>How to play</Text>
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
                                <Text style={styles.modalRule}>This is a guessing game, where you can put your pokémon knowledge to the test!</Text>
                                <Text style={styles.modalRule}>Press the "Catch" button to submit your answer</Text>
                                <Text style={styles.modalRule}>Gender specific pokemon require a -m or -f after the name ex. nidoran-m</Text>
                                <Text style={styles.modalRule}>Tap on the trophies symbol to reveal challenges for you to complete</Text>
                                <Text style={styles.modalRule}>Can you Guess Them All?</Text>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                <View style={styles.gameContainer}>
                    { gameStarted !== true ? (
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={startGame}
                            >
                                <Text style={styles.startButtonText}>Start</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.gameplayContainer}>
                                <View style={styles.liveScoreContainer}>
                                    <Text style={styles.liveScore}>Score: {liveScore}</Text>
                                    <Text style={styles.liveScore}>Lives Left: {lives}</Text>
                                </View>
                                <Image
                                    alt="Pokemon Image"
                                    style={styles.image}
                                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonList[randomPokemon].id}.png` }}
                                />
                                <Text style={styles.pokemonName}>
                                    {isCorrect !== null ? capitalizeString(pokemonList[randomPokemon].name) : null}
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter answer here"
                                    onChangeText={setUserAnswer}
                                    value={userAnswer}

                                    onSubmitEditing={() => handleSubmit()}
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
                        )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default PokeGrowerScreen;