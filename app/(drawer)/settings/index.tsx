// Dependencies
import { View, StyleSheet } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";



export default function Settings() {

  return (
    <View
      style={styles.container}
    >
      <Drawer.Screen
        options={{
          title: "Profile",
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center'
  },
});
