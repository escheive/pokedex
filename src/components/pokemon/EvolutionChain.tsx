import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Components
import OctagonLayout from './OctagonLayout';
// Utils
import { capitalizeString } from '../../utils/helpers';

const EvolutionChain = ({ pokemon, pokemonColors }) => {
    const [evolutionChain, setEvolutionChain] = useState([]);

    useEffect(() => {
        const fetchEvolutionChain = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
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
            const evolutionDetails = currentPokemon.evolves_to.map((evolution) => {
                // Deconstruct the url to grab the id number from it
                const urlParts = evolution.species.url.split("/");
                // The url contains the pokemons id, so this will grab that id number
                const evolutionId = urlParts[urlParts.length-2];
                return {
                    name: evolution.species.name,
                    trigger: evolution.evolution_details[0].trigger.name,
                    id: evolutionId,
                };
            });

            evolutionChain.push({ name: speciesName, id: evolutionId, evolutionDetails });

            if (currentPokemon.evolves_to.length > 0) {
                currentPokemon = currentPokemon.evolves_to[0];
            } else {
                currentPokemon = null;
            }
        }

        return evolutionChain;
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            width: '100%',
            marginBottom: 30,
            padding: 10,
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
//             backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
        },
        arrowContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
                <View style={styles.evolutionItemContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutionChain[0].id}.png` }}
                    />
                    <Text key={pokemon.name}>{capitalizeString(evolutionChain[0].name)}</Text>
                </View>

            {evolutionChain.map((pokemon, index) => (
                <React.Fragment key={index}>

                    {pokemon.evolutionDetails.length > 0 && pokemon.evolutionDetails.map((evolution, index) => (
                        <React.Fragment key={evolution.name}>

                            {index < pokemon.evolutionDetails.length && (
                                <View style={styles.arrowContainer}>
                                    <Ionicons name='arrow-forward-sharp' size={32} color='gray' />
                                    <Text>{evolution.trigger}</Text>
                                </View>
                            )}

                            <View style={styles.evolutionItemContainer}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png` }}
                                />
                                <Text>{capitalizeString(evolution.name)}</Text>
                            </View>

                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}
            </View>
        )}
        </View>
    )
}

export default EvolutionChain;