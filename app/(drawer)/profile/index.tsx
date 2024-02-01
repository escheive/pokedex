import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { FlashList } from '@shopify/flash-list';
import { GET_PROFILE_QUERY } from 'api/user/queries';
import { POKEMON_ISFAVORITE_OR_CAUGHT_QUERY } from 'api/queries';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import { groupedVersions } from 'constants/Pokemon';



export default function Profile() {
  const apolloClient = useApolloClient();

  const { data: userData } = useQuery(GET_PROFILE_QUERY);

  const { loading: pokemonLoading, data: pokemon } = useQuery(POKEMON_ISFAVORITE_OR_CAUGHT_QUERY);


  const { id, username, email, profileImage } = userData.profile;


  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newProfileImage, setNewProfileImage] = useState(profileImage);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [favoritedPokemon, setFavoritedPokemon] = useState(() => {
    if (pokemon) {
      return pokemon.pokemon_v2_pokemon.filter(pokemon => pokemon.isFavorited === true);
    }
    return [];
  });
  const [caughtPokemon, setCaughtPokemon] = useState({
    total: [],
    kanto: [],
    johto: [],
    hoenn: [],
    sinnoh: [],
    unova: [],
    kalos: [],
    alola: [],
    galar: [],
    paldea: []
  });

  useMemo(() => {

    if (pokemon) {
      const totalCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.isCaught ? count + 1 : count), 0);

      const kantoCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen1.start && pokemon.id <= groupedVersions.gen1.end && pokemon.isCaught ? count + 1 : count), 0);

      const johtoCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen2.start && pokemon.id <= groupedVersions.gen2.end && pokemon.isCaught ? count + 1 : count), 0);

      const hoennCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen3.start && pokemon.id <= groupedVersions.gen3.end && pokemon.isCaught ? count + 1 : count), 0);

      const sinnohCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen4.start && pokemon.id <= groupedVersions.gen4.end && pokemon.isCaught ? count + 1 : count), 0);

      const unovaCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen5.start && pokemon.id <= groupedVersions.gen5.end && pokemon.isCaught ? count + 1 : count), 0);

      const kalosCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen6.start && pokemon.id <= groupedVersions.gen6.end && pokemon.isCaught ? count + 1 : count), 0);

      const alolaCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen7.start && pokemon.id <= groupedVersions.gen7.end && pokemon.isCaught ? count + 1 : count), 0);

      const galarCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen8.start && pokemon.id <= groupedVersions.gen8.end && pokemon.isCaught ? count + 1 : count), 0);

      const paldeaCaught = pokemon.pokemon_v2_pokemon.reduce((count, pokemon) => (pokemon.id >= groupedVersions.gen9.start && pokemon.id <= groupedVersions.gen9.end && pokemon.isCaught ? count + 1 : count), 0);

      setCaughtPokemon({
        total: totalCaught,
        kanto: kantoCaught,
        johto: johtoCaught,
        hoenn: hoennCaught,
        sinnoh: sinnohCaught,
        unova: unovaCaught,
        kalos: kalosCaught,
        alola: alolaCaught,
        galar: galarCaught,
        paldea: paldeaCaught,
      });
    }

    if (pokemon) {
      setFavoritedPokemon(pokemon.pokemon_v2_pokemon.filter(p => p.isFavorited === true));
    }
  }, [pokemon]);


  const handleUpdateProfile = async (newUsername, newEmail, newProfileImage) => {
    try {
      console.log("trying to update profile...");
      console.log(newUsername, newEmail);

      const data = {
        profile: {
          __typename: 'Profile',
          id, // Ensure this id is the same as the one in the initial data
          username: newUsername,
          email: newEmail,
          profileImage: newProfileImage
        },
      };

      apolloClient.writeQuery({
        query: GET_PROFILE_QUERY,
        data: data,
      });

      setIsUpdatingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSelectNewProfileImage = (itemId) => {
    setNewProfileImage(itemId);
    setImageModalVisible(false);
  };

  const gap = 10;
  const numColumns = 6;
  const availableSpace = Dimensions.get('window').width - (numColumns - 1) * gap;
  const itemSize = availableSpace / numColumns - 10;


  const renderPokemonItem = ({ item }) => {

    return (
      <TouchableOpacity onPress={() => handleSelectNewProfileImage(item.id)}>
        <Image 
          style={[
            {
              margin: gap / 2,
              width: itemSize,
              height: itemSize,
            }
          ]}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png` }}
          contentFit="contain"
          transition={0}
          recyclingKey={item.id}
          pointerEvents='none'
        />
      </TouchableOpacity>
    )
  };

  const renderFavoritedPokemonItem = ({ item }) => {

    return (
      <Link 
        href={`/pokemon/${item.id}`}
      >
        <Image 
          style={[
            {
              margin: gap / 2,
              width: itemSize,
              height: itemSize,
            }
          ]}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png` }}
          contentFit="contain"
          transition={0}
          recyclingKey={item.id.toString()}
          pointerEvents='none'
        />
        <Text>{item.id}</Text>
      </Link>
    )
  };


  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Profile",
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <Image
        style={[ styles.avatar, { margin: gap / 2 } ]}
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${userData?.profile.profileImage ? newProfileImage : 1}.png` }}
        contentFit="contain"
        transition={0}
        recyclingKey={userData?.profile.profileImage}
      />
      {isUpdatingProfile ? (
        <Button 
          title="Change Profile Image" 
          onPress={() => setImageModalVisible(true)}
        />
      ) : null}
      <View style={styles.infoContainer}>
        {!isUpdatingProfile ? (
          <>
            <Text style={styles.username}>{userData?.profile.username || 'Trainer'}</Text>
            <Text style={styles.email}>{userData?.profile.email || 'trainer@example.com'}</Text>
            <Button 
              title="Update Profile" 
              onPress={() => setIsUpdatingProfile(true)} 
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              onChangeText={setNewUsername}
              value={newUsername}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              onChangeText={setNewEmail}
              value={newEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <Button 
              title="Update Profile"
              onPress={() => handleUpdateProfile(newUsername, newEmail, newProfileImage)} 
            />
          </>
        )}
      </View>

      <View style={styles.statisticsContainer}>
        <Text style={styles.pokedexTitle}>Statistics</Text>
        <View style={styles.pokedexContainer}>
          <Text>Pokedex Progress</Text>
          <View style={styles.caughtPokemonGroup}>
            <Text>Total:</Text>
            <Text>{caughtPokemon.total} / {groupedVersions.gen9.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Kanto:</Text>
            <Text>{caughtPokemon.kanto} / {groupedVersions.gen1.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Johto:</Text>
            <Text>{caughtPokemon.johto} / {groupedVersions.gen2.end - groupedVersions.gen1.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Hoenn:</Text>
            <Text>{caughtPokemon.hoenn} / {groupedVersions.gen3.end - groupedVersions.gen2.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Sinnoh:</Text>
            <Text>{caughtPokemon.sinnoh} / {groupedVersions.gen4.end - groupedVersions.gen3.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Unova:</Text>
            <Text>{caughtPokemon.unova} / {groupedVersions.gen5.end - groupedVersions.gen4.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Kalos:</Text>
            <Text>{caughtPokemon.kalos} / {groupedVersions.gen6.end - groupedVersions.gen5.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Alola:</Text>
            <Text>{caughtPokemon.alola} / {groupedVersions.gen7.end - groupedVersions.gen6.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Galar:</Text>
            <Text>{caughtPokemon.galar} / {groupedVersions.gen8.end - groupedVersions.gen7.end}</Text>
          </View>
          <View style={styles.caughtPokemonGroup}>
            <Text>Paldea:</Text>
            <Text>{caughtPokemon.paldea} / {groupedVersions.gen9.end - groupedVersions.gen8.end}</Text>
          </View>
          
        </View>
      </View>

      <View>
        <FlashList 
          data={favoritedPokemon}
          renderItem={renderFavoritedPokemonItem}
          numColumns={numColumns}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={100}
          estimatedListSize={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width * 0.90 }}
          contentContainerStyle={{  }}
        />
      </View>

      <Modal visible={imageModalVisible} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>Choose an image for your profile</Text>
            <FlashList 
              data={pokemon.pokemon_v2_pokemon}
              renderItem={renderPokemonItem}
              numColumns={numColumns}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={100}
              estimatedListSize={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width * 0.90 }}
              contentContainerStyle={{  }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f4f4f4',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 22,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f9f9f9'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
  },
  modalTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  modalPokemonContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    flex: 1,
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
  statisticsContainer: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center'
  },
  pokedexTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  pokedexContainer: {
    width: '100%',
    padding: 10,
    justifyContent: 'center'
  },
  caughtPokemonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
