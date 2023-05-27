import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Components
import OctagonLayout from './OctagonLayout';

const EvolutionChain = ({ pokemon }) => {
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
            flexDirection: 'row',
            marginVertical: 10,
        }
    })

    if (evolutionChain.length === 0) {
        return <Text>Loading...</Text>
    }


    return (
        <View style={styles.container}>
            <Text>Evolution Chain</Text>
        {pokemon.name === "eevee" ? (
            <OctagonLayout evolutionChain={evolutionChain} />
        ) : (
            <View style={styles.evolutionsContainer}>
                <Text key={pokemon.name}>{evolutionChain[0].name}</Text>
            {evolutionChain.map((pokemon, index) => (
                <View key={index}>
                     {pokemon.evolutionDetails.length > 0 && (
                        <View>
                            {pokemon.evolutionDetails.map((evolution, index) => (
                                <Text key={evolution.name}>{evolution.trigger} -&gt; {evolution.name}</Text>
                            ))}
                        </View>
                     )}
                </View>
            ))}
            </View>
        )}
        </View>
    )
}

export default EvolutionChain;