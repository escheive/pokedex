// Dependencies
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { FaHeart } from 'react-icons/fa';
// Components
import PokemonStats from '../components/PokemonStats';
import PillBar from '../components/PillBar';
// Utils
import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { getTypeStyle } from '../utils/typeStyle';
import { fetchAbility, fetchAbilityData } from '../utils/pokemonDetails';

type TypeProps = {
    type: {
        name: string;
    };
};

type PokemonProps = {
    name: string;
    id: number;
    types: TypeProps[];
}

type DetailsScreenProps = {
    route: {
        params: {
            pokemon: PokemonProps;
        };
    };
    navigation: any;
}

const DetailsScreen = ({ route, navigation }: DetailsScreenProps) => {
    // Grab our pokemon data that was pulled in our app.tsx from params
    const { pokemon } = route.params;
    // Grab the dimensions of the device for sizing of components
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    // useState to update if a pokemon was favorited or unfavorited without refreshing
    const [isFavorite, setIsFavorite] = useState(false);
    // useState to track pokemonAbilities for each individual pokemon when their page is pulled up
    const [pokemonAbilities, setPokemonAbilities] = useState([]);
    // Declare an array so that we can assign colors for this pokemon based on its type
    let pokemonColors = [];
    // Variable to store pokedex entry after fetching
    const [pokedexEntry, setPokedexEntry] = useState({ "genus": "", "flavorText": ""});
    // useState for the nav below the pokemon card
    const [selectedTab, setSelectedTab] = React.useState('stats');


    // Function to grab pokedex entry
    const getPokedexEntry = async () => {
        try {
            const pokedexSpeciesDataResponse = await fetch(pokemon.species.url);
            const pokedexSpeciesData = await pokedexSpeciesDataResponse.json();

            const getEnglishPokedexEntry = (entryType) => {
                return new Promise((resolve, reject) => {
                    let entries;

                    if (entryType === "flavor_text") {
                        entries = pokedexSpeciesData.flavor_text_entries;
                    } else if (entryType === "genus") {
                        entries = pokedexSpeciesData.genera;
                    } else {
                        reject("Invalid entry type");
                    }

                    for (const entry of entries) {
                        if (entry.language.name === 'en') {
                            resolve(entry[entryType].replace(/[\n\f]/g, " "));
                        }
                    }
                    reject("No english pokedex entry found");
                });
            };

            const englishPokedexFlavorText = await getEnglishPokedexEntry("flavor_text");
            const englishPokedexGenus = await getEnglishPokedexEntry("genus");
            setPokedexEntry({ genus: englishPokedexGenus, flavorText: englishPokedexFlavorText });
        } catch (error) {
            throw error;
        }
    };

    // Function to map through the pokemon abilities and then run fetchAbility function to grab the definitions for each
//     const fetchAbilityData = async () => {
//         if (pokemonAbilities.length < pokemon.abilities.length) {
//             const promises = pokemon.abilities.map((ability) => fetchAbility(ability, setPokemonAbilities));
//             const result = await Promise.all(promises);
//         }
//     };


    // useEffect to check if a pokemon is favorited and fetch ability info on component mount
    useEffect(() => {
        checkIfFavorite();

        fetchAbilityData(pokemonAbilities, pokemon.abilities, setPokemonAbilities);

        getPokedexEntry()

    }, []);

    // Function to check if a pokemon is favorited and update the page accordingly
    const checkIfFavorite = async () => {
        // Run imported function from favorites file in utils folder to grab all favorited pokemon for a user and store them in a variable
        const favorites = await getFavorites();
        // If this pokemon is one of the favorites, set as true
        if (favorites.some(pokemonObject => pokemonObject.id === pokemon.id)) {
            setIsFavorite(true);
        }
    };

    // Handle someone pressing the favorite pokemon button
    const handleFavoritePress = async () => {
        // If pokemon is already favorited, run imported function from favorites util to remove it from storage, then update page without needing refresh
        if (isFavorite) {
            await removeFavoritePokemon(pokemon);
            setIsFavorite(false);
        // If pokemon is not favorited, run imported function from utils folder to save it as a favorite, then update state to reflect immediately
        } else {
            const added = await addFavoritePokemon(pokemon);
            setIsFavorite(added);
        }
    };


    // Function to take the pokemons types, run function to get the corresponding color and then create an array of colors based on types
    const getTypeBackgroundStyle = (types: TypeProps[]) => {
        const stylesArray = types.map((type) => getTypeStyle(type.type.name));
        pokemonColors.push(stylesArray[0].backgroundColor)
        return stylesArray.filter(style => Object.keys(style).length > 0);
    };

    // Function to take the pokemons types, and grab the info for that type
    const getTypeInfo = async (typesArr: TypeProps[]) => {
        const typePromises = typesArr.map(async (type) => {
            const response = await fetch(type.type.url);
            let typeInfo = await response.json();
            typeInfo = typeInfo.damage_relations;
            const strengthsAndWeaknesses = {
                strengths: typeInfo.double_damage_to,
                weaknesses: typeInfo.double_damage_from,
                noDamageFrom: typeInfo.no_damage_from,
                noDamageTo: typeInfo.no_damage_to
            }
            return strengthsAndWeaknesses;
        });
        const damageRelations = await Promise.all(typePromises);
        return damageRelations;
    };

    const getTypeInfoAndCalculateDamage = async (typesArr: TypeProps[]) => {
        const damageRelations = await getTypeInfo(typesArr);
        let strengths = [];
        let weaknesses = [];
        let noDamageTo = [];
        let noDamageFrom = [];

        for (const type of damageRelations) {
//             console.log(type.strengths.map((strength) => strength.name))
            typeStrengths = type.strengths ? await type.strengths.map((strength) => strengths.push(strength.name)) : [];
//             strengths.push(typeStrengths)
//             console.log(strengths)
            weaknesses = type.weaknesses ? await type.weaknesses.map((weakness) => weakness.name) : [];
            noDamageFrom = type.no_damage_from ? await type.no_damage_from.map((noDamageFrom) => noDamageFrom.name) : [];
            noDamageTo = type.no_damage_to ? await type.no_damage_to.map((noDamageTo) => noDamageTo.name) : [];
        }

        return {
            strengths,
            weaknesses,
            noDamageFrom,
            noDamageTo
        };
    };

    async function getPokemonTypeInfo(pokemon) {
        try {
            const typeInfo = await getTypeInfoAndCalculateDamage(pokemon.types);
            return typeInfo;
        } catch (error) {
            console.log(error);
        }
    }

    getPokemonTypeInfo(pokemon).then((typeInfo) => {
//         console.log(typeInfo)
    });

    // Variables to track the pokemons colors
    const stylesArray = getTypeBackgroundStyle(pokemon.types);
    pokemonColors = stylesArray.map((style) => style.backgroundColor);
    const gradientColors = pokemonColors.length < 2 ? [pokemonColors[0], '#FFFFFF'] : pokemonColors;

    // Stylesheet for this screen
    const styles = StyleSheet.create({
        container: {
            height: '100%',
        },
        card: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: windowHeight * 0.75,
            borderWidth: 10,
            borderColor: '#5C6B7C',
            overflow: 'hidden',
            marginBottom: 20,
            fontFamily: 'Arial, sans-serif',
        },
        imageContainer: {
            backgroundColor: 'white',
            height: '50%',
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        image: {
            width: '110%',
            height: '110%',
            resizeMode: 'contain',
        },
        idContainer: {
            position: 'absolute',
            top: 10,
            right: 10,
            borderRadius: 50,
            backgroundColor: '#5C6B7C',
            padding: 1,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
        },
        idText: {
            color: 'white',
            fontSize: 22,
            fontWeight: 'bold',
        },
        bottomOfCard: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: '#E0E0E0',
            padding: 20,
            paddingTop: 30,
            height: '50%',
            width: '100%',
        },
        heading: {
            fontSize: 32,
            fontWeight: 'bold',
            alignSelf: 'flex-start'
        },
        nameContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        pokedexEntry: {
            fontSize: 16,
            marginBottom: 12,
        },
        typesContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 16,
        },
        type: {
            paddingVertical: 9,
            paddingHorizontal: 16,
            borderRadius: 32,
            marginRight: 8,
        },
        strengthWeaknessColumnContainer: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 2,
        },
        strengthWeaknessColumn: {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
        },
        strengthWeaknessColumnHeading: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        navContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 30,
        },
        navItem: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 5,
        },
        navItemText: {
            color: 'white',
            fontSize: 16,
        },
        selectedNavItemText: {
            fontWeight: 'bold',
        },
        favButton: {
            backgroundColor: pokemonColors[0],
            padding: 10,
            alignItems: 'center',
            marginBottom: 20,
        },
        favButtonText: {
            fontSize: 20,
        },
        abilityContainer: {
            marginTop: 20,
        },
        abilitiesTitle: {
            fontSize: 25,
            fontWeight: 'bold',
            color: pokemonColors[0],
            marginBottom: 15,
            textAlign: 'center',
        },
        ability: {
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
        },
        abilityName: {
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 5,
        },
        abilityDefinition: {
            fontSize: 14,
            lineHeight: 20,
        },
    });

    return (

        <FlatList style={styles.container}
            data={[pokemon]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <>
                    <View style={styles.card}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
                            />
                            <View style={styles.idContainer}>
                                <Text style={styles.idText}>{pokemon.id > 100 ? pokemon.id : pokemon.id > 10 ? "0" + pokemon.id : "00" + pokemon.id }</Text>
                            </View>
                        </View>

                        <View style={styles.bottomOfCard}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.heading}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                                <View style={styles.typesContainer}>
                                    {pokemon.types.map((type) => (
                                        <View key={type.type.name} style={[styles.type, ...getTypeBackgroundStyle([type])]}>
                                            <Text style={{ color: getTypeStyle(type.type.name).color, fontSize: 18, fontWeight: '600' }}>
                                                {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View>
                                <Text style={styles.pokedexEntry}>{pokedexEntry.genus}</Text>
                                <Text style={styles.pokedexEntry}>{pokedexEntry.flavorText}</Text>
                            </View>
                            <View style={styles.strengthWeaknessColumnContainer}>
                                <View style={styles.strengthWeaknessColumn}>
                                    <Text style={styles.strengthWeaknessColumnHeading}>Strong Against</Text>
                                    <View>
                                    </View>
                                </View>
                                <View style={styles.strengthWeaknessColumn}>
                                    <Text style={styles.strengthWeaknessColumnHeading}>Weak Against</Text>
                                    <View>
                                    </View>
                                </View>
                                <View style={styles.strengthWeaknessColumn}>
                                    <Text style={styles.strengthWeaknessColumnHeading}>No Damage From</Text>
                                    <View>
                                    </View>
                                </View>
                                <View style={styles.strengthWeaknessColumn}>
                                    <Text style={styles.strengthWeaknessColumnHeading}>No Damage To</Text>
                                    <View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.navContainer}>
                        <TouchableOpacity
                            style={[
                                styles.navItem,
                                selectedTab === 'stats' && [styles.selectedNavItemText, { backgroundColor: pokemonColors[0] }],
                                selectedTab !== 'stats' && (pokemon.types.length === 2 ? { backgroundColor: pokemonColors[1] } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                            ]}
                            onPress={() => setSelectedTab('stats')}
                        >
                            <Text style={[styles.navItemText, selectedTab === 'stats' && styles.selectedNavItemText]}>Stats</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.navItem,
                                selectedTab === 'about' && [styles.selectedNavItemText, { backgroundColor: pokemonColors[0] }],
                                selectedTab !== 'about' && (pokemon.types.length === 2 ? { backgroundColor: pokemonColors[1] } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                            ]}
                            onPress={() => setSelectedTab('about')}
                        >
                            <Text style={[styles.navItemText, selectedTab === 'about' && styles.selectedNavItemText]}>About</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.navItem,
                                selectedTab === 'moves' && [styles.selectedNavItemText, { backgroundColor: pokemonColors[0] }],
                                selectedTab !== 'moves' && (pokemon.types.length === 2 ? { backgroundColor: pokemonColors[1] } : { backgroundColor: 'rgba(128, 128, 128, 0.5)' })
                            ]}
                            onPress={() => setSelectedTab('moves')}
                        >
                            <Text style={[styles.navItemText, selectedTab === 'moves' && styles.selectedNavItemText]}>Moves</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tabContent}>
                        {selectedTab === 'stats' && <PokemonStats stats={pokemon.stats} />}
                        {selectedTab === 'about' && (
                        <View>
                            <Text style={styles.pokedexEntry}>{pokedexEntry.genus}</Text>
                            <Text style={styles.pokedexEntry}>{pokedexEntry.flavorText}</Text>
                        </View>
                        )}
                        {selectedTab === 'moves' && (
                        <View>
                            <Text>Move 1</Text>
                            <Text>Move 2</Text>
                            <Text>Move 3</Text>
                            <Text>Move 4</Text>
                        </View>
                        )}
                    </View>

                    <View style={{ marginTop: 20 }}>

                            <TouchableOpacity
                                style={styles.favButton}
                                onPress={handleFavoritePress}
                            >
                                <Text style={styles.favButtonText}>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
                            </TouchableOpacity>
                    </View>

                    <View style={styles.abilityContainer}>
                        <Text style={styles.abilitiesTitle}>Abilities</Text>
                        {pokemonAbilities !== null && (
                            pokemonAbilities.map((ability) => (
                                <View key={ability.name} style={styles.ability}>
                                    <Text style={styles.abilityName}>{ability.name}</Text>
                                    <Text style={styles.abilityDefinition}>{ability.definition}</Text>
                                </View>
                            ))
                        )}
                    </View>

                </>
            )}
        />
    );
};

export default DetailsScreen;