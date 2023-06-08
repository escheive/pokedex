import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { capitalizeString } from '../utils/helpers';
import { pokemonColors } from '../utils/typeStyle';

const ProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    useEffect(() => {
        getData();

    }, []);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('name');
            if (value !== null) {
                setName(value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleNameChange = async (value) => {
        try {
            await AsyncStorage.setItem('name', value);
            setName(value);
        } catch (error) {
        console.log(error);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState('');

    const handleEdit = () => {
        setTempName(name);
        setIsEditing(true);
    };

    const handleSave = () => {
        handleNameChange(tempName);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempName(name);
        setIsEditing(false);
    };

    const favoritePokemon = Object.values(pokemonList).filter((pokemon) => pokemon.isFavorite);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome to your profile!</Text>
        {isEditing ? (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setTempName(text)}
                    value={tempName}
                />
                <View style={styles.buttonsContainer}>
                    <Button title="Save" onPress={handleSave} />
                    <Button title="Cancel" onPress={handleCancel} />
                </View>
            </View>
        ) : (
            <>
                <Text style={styles.name}>{name}</Text>
                <Button title="Edit Name" onPress={handleEdit} />
            </>
        )}

            <Text style={styles.favoriteSectionTitle}>Favorite Pokemon</Text>
            <View style={styles.favoritePokemonContainer}>
                {favoritePokemon.map((pokemon) => (
                    <TouchableOpacity
                        key={pokemon.id}
                        style={styles.favoritePokemonItem}
                        onPress={() => navigation.navigate('Details', { pokemon: pokemon })}
                        activeOpacity={0.5}
                    >
                        <Image source={{ uri: `${pokemon.image_url}` }} style={styles.favoritePokemonImage} />
                        <Text
                            style={[
                                styles.favoritePokemonName,
                                { backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
                                color: pokemonColors[pokemon.type1].color }
                            ]}
                            adjustsFontSizeToFit minimumFontScale={0.5}
                        >
                            {capitalizeString(pokemon.name)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    name: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    inputContainer: {
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: '80%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '20%',
    },
    favoritePokemonContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#eee',
        padding: 8,
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    },
    favoriteSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 32,
        marginBottom: 0,
    },
    favoritePokemonItem: {
        width: '23%',
        height: 141,
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 16,
        marginHorizontal: '1%',
        paddingTop: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'gray',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 3,
    },
    favoritePokemonImage: {
        width: 85,
        height: 85,
    },
    favoritePokemonName: {
        flex: 1,
        marginTop: 8,
        paddingVertical: 1,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        width: '100%',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
});

export default ProfileScreen;
