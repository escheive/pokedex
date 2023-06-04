import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Image } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

        {favoritePokemon.map((pokemon) => (
            <View key={pokemon.id}>
                <Image source={{ uri: `${pokemon.image_url}` }} style={styles.favoritePokemonImage} />
                <Text>{pokemon.name}</Text>
            </View>
        ))}
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
    favoritePokemonImage: {
        width: 75,
        height: 75,
    },
});

export default ProfileScreen;
