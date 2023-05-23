// Reanimated Dependencies
import 'react-native-gesture-handler';
// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pokemon } from './types';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MovesScreen from './src/screens/MovesScreen';
// Components
import LoadingScreen from './src/components/LoadingScreen';
// Utils
import { getTypeStyle } from './src/utils/typeStyle';
import { capitalizeString } from './src/utils/helpers';
import { fetchPokemonData, fetchPokemonFromAPI, fetchAbilitiesData, fetchAbilitiesFromAPI } from './src/utils/api';
// Database
import SQLite from 'react-native-sqlite-storage';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const BackButton = ({ navigation }) => {
    const handleGoToMainPokemonScreen = () => {
        navigation.goBack();
    };

    return (
        <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleGoToMainPokemonScreen}
        />
    );
};


const DrawerNavigator = () => {
    const { Navigator, Screen } = createDrawerNavigator();
    const navigation = useNavigation();

    const route = useRoute();

    const getHeaderTitle = (route: Route<string, object | undefined>) => {
        const routeName = route.name;
        switch (routeName) {
            case 'Pokemon':
                return 'Pokedex';
            case 'Profile':
                return 'Profile';
            case 'Settings':
                return 'Settings';
            default:
                return '';
        }
    };

    const handleNavigationStateChange = (route: Route<string, object | undefined>) => {
        const title = getHeaderTitle(route);
        navigation.setOptions({ headerTitle: title });
    };


    return (
        <Navigator
            screenOptions={{ headerShown: true }}
            drawerContent={(props) => <DrawerContent {...props} />}
            onNavigationStateChange={handleNavigationStateChange}
        >

            <Screen
                name="Pokemon"
                component={PokemonStackNavigator}
            />
            <Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Screen
                name="Settings"
                component={SettingsScreen}
            />

        </Navigator>
    );
};


const DetailsTabNavigator = ({ pokemonList, typeData, route, navigation, allPokemonAbilities }) => {
    const { Navigator, Screen } = createBottomTabNavigator();


    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                headerTitle: '',
//                 headerLeft: () => (
//                   <Ionicons
//                     name="arrow-back"
//                     size={24}
//                     color="black"
//                     onPress={() => navigation.goBack()}
//                     style={{ marginLeft: 10 }}
//                   />
//                 ),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Info') {
                        iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                    } else if (route.name === 'Moves') {
                        iconName = focused ? 'shield' : 'shield-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Screen
                name='Info'
//                 component={DetailsScreen}
                initialParams={{
                    pokemon: route.params.pokemon,
                }}
                options={{
                    title: 'Details',
                }}
            >
                {props => <DetailsScreen {...props} allPokemonAbilities={allPokemonAbilities} />}
            </Screen>
            <Screen
                name="Moves"
                component={MovesScreen}
                initialParams={{
                    pokemon: route.params.pokemon,
                }}
                options={{
                    title: 'Moves',
                }}
            />

        </Navigator>
    );
};


const PokemonStackNavigator = ({ pokemonList, typeData, allPokemonAbilities }) => {

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Main">
                {props => <PokemonScreen {...props} pokemonList={pokemonList} typeData={typeData} />}
            </Stack.Screen>

            <Stack.Screen
                name="Details"
                options={({ route }) => {
                    const pokemonType = route.params.pokemon.type1;
                    const backgroundColor = getTypeStyle(pokemonType);
                    let pokemonName = route.params.pokemon.name;
                    pokemonName = capitalizeString(pokemonName);

                    return {
                        title: pokemonName,
                    };
                }}
            >
                {props => <DetailsTabNavigator {...props} allPokemonAbilities={allPokemonAbilities} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};


function ProfileStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="User" component={ProfileScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};



function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Options" component={SettingsScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};




// Open the database
const database = SQLite.openDatabase({
    name: 'Pokemon.db',
    location: 'default',
});




export default function App() {
    const [isLoading, setIsLoading] = useState("Loading...");
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [allPokemonAbilities, setAllPokemonAbilities] = useState([]);


//     // Function to check and create an Abilities table
//     const createAbilitiesTable = () => {
//         console.log('createAbilitiesTable function hit')
//         return new Promise((resolve, reject) => {
//             database.transaction((tx) => {
//                 tx.executeSql(
//                     `SELECT name FROM sqlite_master WHERE type='table' AND name='Abilities';`,
//                     [],
//                     (tx, result) => {
//                         if (result.rows.length === 0) {
//                             console.log('Abilities table doesnt exist, creating one');
//                             // If table doesnt exist, create it
//                             tx.executeSql(
//                                 `CREATE TABLE IF NOT EXISTS Abilities (
//                                 id INTEGER PRIMARY KEY,
//                                 abilityName TEXT,
//                                 shortAbilityDescription TEXT,
//                                 longAbilityDescription TEXT,
//                                 pokemonWithAbility TEXT
//                                 );`,
//                                 [],
//                                 () => {
//                                     console.log('Table "Abilities" created successfully');
//                                     resolve();
//                                 },
//                                 (error) => {
//                                     console.error('Error creating table "Abilities":', error);
//                                     reject(error);
//                                 }
//                             );
//                         } else {
//                             console.log('Abilities table already exists')
//                             resolve();
//                         }
//                     },
//                     (error) => {
//                         console.error('Error checking table "Abilities":', error);
//                         reject(error);
//                     }
//                 );
//             });
//         });
//     };
//
//
//
//     // Function to drop Abilities table
//     const resetAbilitiesTable = () => {
//         console.log('resetAbilitiesTable function hit');
//         database.transaction((tx) => {
//             tx.executeSql(
//                 `DROP TABLE IF EXISTS Abilities;`,
//                 [],
//                 () => {
//                     console.log('Table "Abilities" dropped successfully');
//                     createPokemonTable();
//                 },
//                 (error) => {
//                     console.error('Error dropping table "Abilities":', error);
//                 }
//             );
//         });
//     };
//
//
//
//     // Function to insert ability data into the Abilities db table
//     const insertAbility = async (abilityData) => {
//         console.log('insertAbility function hit');
//         try {
//             await new Promise((resolve, reject) => {
//                 database.transaction((tx) => {
//                     abilityData.forEach((ability) => {
//                         tx.executeSql(
//                             `INSERT OR IGNORE INTO Abilities (id, abilityName, shortAbilityDescription, longAbilityDescription, pokemonWithAbility)
//                             VALUES (?, ?, ?, ?, ?);`,
//                             [
//                                 ability.id,
//                                 ability.name,
//                                 ability.shortDescription,
//                                 ability.longDescription,
//                                 ability.pokemonWithAbility
//                             ],
//                             () => {
//                                 console.log('Ability data inserted successfully');
//                                 resolve();
//                             },
//                             (error) => {
//                                 console.error('Error inserting Ability record', error);
//                                 reject(error);
//                             }
//                         );
//                     });
//                     console.log('Ability records inserted successfully');
//                     resolve();
//                 });
//             });
//         } catch (error) {
//             console.error('Error inserting Ability data:', error);
//         }
//     };
//
//
//
//     // Function to fetch base abilities data from the api
//     const fetchAbilitiesFromAPI = async (start, end) => {
//         console.log('fetchingAbilitiesFromAPI function hit')
//         try {
//             const response = await fetch(`https://pokeapi.co/api/v2/ability?limit=${end - start}&offset=${start}`);
//             const data = await response.json();
//
//             const abilityUrls = data.results.map((ability) => ability.url);
//             const abilityData = await Promise.all(abilityUrls.map((url) => fetch(url).then((response) => response.json())));
//
//             const modifiedAbilityData = await Promise.all(abilityData.map(async(ability) => {
//                 let modifiedAbility = ability;
//
//                 if (ability.effect_entries.length > 0) {
//                     const englishEffectEntries = ability.effect_entries.find((description) => description.language.name === "en");
//
//                     modifiedAbility.shortDescription = englishEffectEntries.short_effect;
//                     modifiedAbility.longDescription = englishEffectEntries.effect;
//
//                 };
//
//                 if (ability.pokemon.length > 0) {
//                     const pokemonWithAbility = await ability.pokemon.map((pokemon) => pokemon.pokemon.name)
//                     modifiedAbility.pokemonWithAbility = JSON.stringify(pokemonWithAbility);
//                 }
//
//                 return modifiedAbility;
//             }));
//             return modifiedAbilityData;
//
//         } catch (error) {
//             console.error('Error in fetchAbilitiesFromAPI function', error);
//         }
//     };
//
//
//
//     // Function to fetch ability data from database or api
//     const fetchAbilitiesData = async () => {
//         console.log('fetchAbilitiesData function hit');
//         try {
//             // Wait for the table creation process to complete
//             await createAbilitiesTable();
//
//             const totalCount = 298;
//             const batchSize = 20;
//             const batches = Math.ceil(totalCount / batchSize);
//             const fetchedAbilitiesData = [];
//
//             const start = 0;
//             const end = 298;
//
//             const hasData = await new Promise((resolve, reject) => {
//                 setIsLoading("Loading Abilities");
//                 database.transaction((tx) => {
//                     tx.executeSql(
//                         `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
//                         [start, end],
//                         (tx, result) => {
//                             if (result.rows.length > 0) {
//                                 for (let i=0; i<result.rows.length; i++) {
//                                     fetchedAbilitiesData.push(result.rows.item(i));
//                                 }
//                             }
//                             resolve(result.rows.length > 0);
//                         },
//                         (error) => {
//                             console.error('Error checking Ability data in the fetchAbilitiesData function, hasData subsection:', error);
//                             reject(error);
//                         }
//                     );
//                 });
//             });
//
//             if (!hasData) {
//                 // set loading phase so that loading screen updates
//                 setIsLoading("Fetching Abilities data from the API");
//                 const fetchedData = await fetchAbilitiesFromAPI(start, end);
//                 fetchedAbilitiesData.push(...fetchedData);
//                 await insertAbility(fetchedData);
//             }
//
//             setAllPokemonAbilities(fetchedAbilitiesData);
//
//             console.log('Successfully fetched data in the fetchAbilitiesData function');
//
// //             setIsLoading(false);
//         } catch (error) {
//             console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
//         }
//     };



    useEffect(() => {

//         resetAbilitiesTable();
//         resetPokemonTable(database);
        fetchPokemonData(database, setIsLoading, setPokemonList)
            .then(() => fetchAbilitiesData(database, setIsLoading, setAllPokemonAbilities))
            .catch((error) => console.error('Error in app.tsx useEffect fetching either pokemon or abilities:', error))
            .finally(() => setIsLoading(false));
    }, []);


    if (isLoading) {
        return <LoadingScreen isLoading={isLoading} />;
    }

    return (
        <NavigationContainer>

            <Drawer.Navigator>
                <Drawer.Screen name="Pokemon">
                    {(props) => <PokemonStackNavigator {...props} pokemonList={pokemonList} typeData={typeData} allPokemonAbilities={allPokemonAbilities} />}
                </Drawer.Screen>
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
}


