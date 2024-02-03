// Dependencies
import { useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { TouchableOpacity } from 'react-native-gesture-handler';
// Components
import { TermsOfService } from 'components/settings/TermsOfService';
import { PrivacyPolicy } from 'components/settings/PrivacyPolicy';



export default function Settings() {
  const [shownInfo, setShownInfo] = useState<string | null>(null);

  return (
    <ScrollView
    contentContainerStyle={{ alignItems: 'center' }}
      style={styles.container}
    >
      <Drawer.Screen
        options={{
          title: "Profile",
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <TouchableOpacity
        onPress={() => setShownInfo('terms')}
        style={styles.button}
      >
        <Text>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShownInfo('privacy')}
        style={styles.button}
      >
        <Text>Privacy Policy</Text>
      </TouchableOpacity>

      {shownInfo === 'terms' ? (
        <TermsOfService />
      ) : shownInfo === 'privacy' ? (
        <PrivacyPolicy />
      ) : null}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f4f4f4',
  },
  button: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
  },
});
