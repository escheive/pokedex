import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ 
        headerShown: false,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        swipeEdgeWidth: 0,
      }}
    >
      <Drawer.Screen
        name="pokemon"
        options={{
          drawerLabel: "Pokemon",
          title: "Pokemon",
        }}
      />
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
    </Drawer>
  );
}