import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { GET_PROFILE_QUERY } from 'api/user/queries';
import { useQuery } from '@apollo/client';

export default function Profile() {
  const { data: userData } = useQuery(GET_PROFILE_QUERY);
  const { id, username, email } = userData.profile;

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
        <Text style={styles.username}>{username || 'Trainer'}</Text>
        <Text style={styles.email}>{email || 'trainer@example.com'}</Text>
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
});