import { Drawer } from "expo-router/drawer";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";


export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ 
        headerShown: false,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        swipeEdgeWidth: 0,
        drawerActiveBackgroundColor: '#fee',
        drawerActiveTintColor: '#FF7777', // Tomato red color for active item
        drawerInactiveTintColor: '#646464',
      }}
    >
      <Drawer.Screen 
        name="profile" 
        options={{
          drawerLabel: "Profile",
          title: "Profile",
          drawerLabelStyle: {
            fontSize: 18,
          },
          drawerIcon: ({ focused }) => (
            <Ionicons 
              name="person-outline"
              size={focused ? 36 : 32}
              color={focused ? '#FF7777' : '#646464'}
            />
          ),
        }} 
      />
      <Drawer.Screen
        name="pokemon"
        options={{
          drawerLabel: "Pokemon",
          title: "Pokemon",
          drawerLabelStyle: {
            fontSize: 18,
          },
          drawerIcon: ({ focused }) => (
            <Ionicons 
              name="paw-outline"
              size={focused ? 36 : 32}
              color={focused ? '#FF7777' : '#646464'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="items"
        options={{
          drawerLabel: "Items",
          title: "Items",
          drawerLabelStyle: {
            fontSize: 18,
          },
          drawerIcon: ({ focused }) => (
            <MaterialCommunityIcons 
              name="pokeball" 
              size={focused ? 36 : 32} 
              color={focused ? '#FF7777' : '#646464'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="abilities"
        options={{
          drawerLabel: "Abilities",
          title: "Abilities",
          drawerLabelStyle: {
            fontSize: 18,
          },
          drawerIcon: ({ focused }) => (
            <FontAwesome5 
              name="superpowers" 
              size={focused ? 36 : 32} 
              color={focused ? '#FF7777' : '#646464'}
            />
          ),
        }}
      />
    </Drawer>
  );
}