import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { FlashList } from '@shopify/flash-list';
import { GET_PROFILE_QUERY } from 'api/user/queries';
import { POKEMON_ID_QUERY } from 'api/queries';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ScrollView } from 'react-native-gesture-handler';

export default function Profile() {
  const apolloClient = useApolloClient();
  const { data: userData } = useQuery(GET_PROFILE_QUERY);
  const { data: pokemonIds } = useQuery(POKEMON_ID_QUERY);
  const { id, username, email, profileImage } = userData.profile;

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newProfileImage, setNewProfileImage] = useState(profileImage);
  const [imageModalVisible, setImageModalVisible] = useState(false);

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

  const showProfileImageOptions = () => {

  }

  const gap = 10;
  const numColumns = 6;
  const availableSpace = Dimensions.get('window').width - (numColumns - 1) * gap;
  const itemSize = availableSpace / numColumns - 10;


  const renderPokemonItem = ({ item }) => (
    <TouchableOpacity onPress={() => setNewProfileImage(item.id)}>
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
  );

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
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${profileImage ? newProfileImage : 1}.png` }}
        contentFit="contain"
        transition={0}
        recyclingKey={profileImage}
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
            <Text style={styles.username}>{username || 'Trainer'}</Text>
            <Text style={styles.email}>{email || 'trainer@example.com'}</Text>
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
              data={pokemonIds.pokemon_v2_pokemon}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0', // You can adjust the background color to match your app's theme
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  infoContainer: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
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
    color: 'white',
    paddingVertical: 16,
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
});