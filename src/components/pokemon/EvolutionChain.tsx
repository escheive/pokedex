import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Components
import OctagonLayout from './OctagonLayout';
// Utils
import { capitalizeString } from '../../utils/helpers';

const EvolutionChain = ({ pokemon, pokemonColors, navigation, scrollToTop }) => {
    const [evolutionChain, setEvolutionChain] = useState([]);
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    console.log(Object.keys(pokemon))

    useEffect(() => {
        const fetchEvolutionChain = async () => {
            try {
                const response = await fetch(`${pokemon.species_url}`);
                const data = await response.json();

                const evolutionChainUrl = data.evolution_chain.url;
                const evolutionChainResponse = await fetch(evolutionChainUrl);
                const evolutionChainData = await evolutionChainResponse.json();
                const chain = evolutionChainData.chain;

                const parsedEvolutionChain = parseEvolutionChain(chain);

                setEvolutionChain(parsedEvolutionChain);
            } catch (error) {
                console.error('Error fetching evolution chain:', error);
            }
        };

        fetchEvolutionChain();
    }, [pokemon]);

    // Parse the evolution chain data to extract the relevant info
    const parseEvolutionChain = (chain) => {
        const evolutionChain = [];
        let currentPokemon = chain;

        while (currentPokemon) {
            const speciesName = currentPokemon.species.name;

            // Deconstruct the url to grab the id number from it
            const urlParts = currentPokemon.species.url.split("/");
            // The url contains the pokemons id, so this will grab that id number
            const evolutionId = urlParts[urlParts.length-2];
//             const evolutionDetails = currentPokemon.evolves_to.map((evolution) => {
//                 // Deconstruct the url to grab the id number from it
//                 const urlParts = evolution.species.url.split("/");
//                 // The url contains the pokemons id, so this will grab that id number
//                 const evolutionId = urlParts[urlParts.length-2];
//                 return pokemonList[evolutionId];
//             });
            const pokemon = pokemonList[evolutionId]
            let evolutionTrigger = null;
            if (currentPokemon.evolves_to.length > 0) {
                evolutionTrigger = capitalizeString(currentPokemon.evolves_to[0].evolution_details[0].trigger.name);
                if (evolutionTrigger === 'Level-up') {
                    evolutionTrigger = evolutionTrigger.split("-")[0]
                    const evolutionLevel = currentPokemon.evolves_to[0].evolution_details[0].min_level;
                    evolutionTrigger = `${evolutionTrigger} ${evolutionLevel}`;
                } else if (evolutionTrigger === 'Use-item') {
                    const item = capitalizeString(currentPokemon.evolves_to[0].evolution_details[0].item.name);
                    evolutionTrigger = `${item}`;
                }
            }
            evolutionChain.push({ pokemon: pokemon, trigger: evolutionTrigger });
//                 return {
//                     name: evolution.species.name,
//                     trigger: evolution.evolution_details[0].trigger.name,
//                     id: evolutionId,
//                 };
//             });
//
//             evolutionChain.push({ name: speciesName, id: evolutionId, evolutionDetails });

            if (currentPokemon.evolves_to.length > 0) {
                currentPokemon = currentPokemon.evolves_to[0];
            } else {
                currentPokemon = null;
            }
        }

        return evolutionChain;
    };

    const handleEvolutionPress = (pokemon) => {
        scrollToTop();
        navigation.navigate('Info', { pokemon: pokemon })
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            width: '96%',
            marginHorizontal: '2%',
            borderRadius: 15,
            marginBottom: 30,
            padding: 10,
            backgroundColor: 'rgba(170, 170, 170, 0.2)',
        },
        evolutionsContainer: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 20,
        },
        evolutionItemContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            width: '20%',
//             backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
        },
        arrowContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20%',
        },
        evolutionTrigger: {
            flexWrap: 'wrap',
            maxWidth: 100,
        },
        image: {
            width: 85,
            height: 85,
        }
    })

    if (evolutionChain.length === 0) {
        return <Text>Loading...</Text>
    }

    return (
        <View style={styles.container}>
            <Text style= {{ fontSize: 24 }}>Evolution Chain</Text>
        {pokemon.name === "eevee" ? (
            <OctagonLayout evolutionChain={evolutionChain} />
        ) : (
            <View style={styles.evolutionsContainer}>
            {evolutionChain.map((evolution, index) => (
                <React.Fragment key={index}>
                    <TouchableOpacity
                        style={styles.evolutionItemContainer}
                        onPress={() => handleEvolutionPress(evolution.pokemon)}
//                         onPress={() => navigation.navigate('Info', {pokemon: evolution.pokemon})}
                        activeOpacity={0.5}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: `${evolution.pokemon.image_url}` }}
                        />
                        <Text>{capitalizeString(evolution.pokemon.name)}</Text>
                    </TouchableOpacity>
                    {index + 1 < evolutionChain.length && (
                        <View style={styles.arrowContainer}>
                            <Ionicons name='arrow-forward-sharp' size={32} color='gray' />
                            <Text style={styles.evolutionTrigger}>{evolution.trigger}</Text>
                        </View>
                    )}
                </React.Fragment>
            ))}
            </View>
        )}
        </View>
    )
}


export default EvolutionChain;