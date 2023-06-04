import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Image } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { capitalizeString } from '../utils/helpers';

const ProfileScreen = () => {
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

            <View style={styles.favoritePokemonContainer}>
            {favoritePokemon.map((pokemon) => (
                <View key={pokemon.id} style={styles.favoritePokemonItem}>
                    <Image source={{ uri: `${pokemon.image_url}` }} style={styles.favoritePokemonImage} />
                    <Text style={styles.favoritePokemonName}>{capitalizeString(pokemon.name)}</Text>
                </View>
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
        width: '98%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 16,
    },
    favoritePokemonItem: {
        width: '23%',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 16,
        marginHorizontal: '1%',
        padding: 8,
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
        marginTop: 8,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default ProfileScreen;
