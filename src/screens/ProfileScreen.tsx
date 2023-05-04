import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [favorites, setFavorites] = useState([]);

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

  console.log(favorites)

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

      {favorites.map((pokemon) => (
        <View key={pokemon.id}>
          <Text>{pokemon.name}</Text>
          <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }} />
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
});

export default ProfileScreen;
