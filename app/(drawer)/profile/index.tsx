import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { GET_PROFILE_QUERY } from 'api/user/queries';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';

export default function Profile() {
  const apolloClient = useApolloClient();
  const { data: userData } = useQuery(GET_PROFILE_QUERY);
  const { id, username, email } = userData.profile;

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);

  const handleUpdateProfile = async (newUsername, newEmail) => {
    try {
      console.log("trying to update profile...");
      console.log(newUsername, newEmail);

      const data = {
        profile: {
          __typename: 'Profile',
          id, // Ensure this id is the same as the one in the initial data
          username: newUsername,
          email: newEmail,
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
        style={styles.avatar}
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image, replace with a default Pokémon-themed icon if avatarUrl is not provided
      />
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
              onPress={() => handleUpdateProfile(newUsername, newEmail)} 
            />
          </>
        )}
      </View>
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
});