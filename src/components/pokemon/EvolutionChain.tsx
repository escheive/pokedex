import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

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
            const evolutionDetails = currentPokemon.evolves_to.map((evolution) => {
                return {
                    name: evolution.species.name,
                    trigger: evolution.evolution_details[0].trigger.name,
                };
            });

            evolutionChain.push({ name: speciesName, evolutionDetails });

            if (currentPokemon.evolves_to.length > 0) {
                currentPokemon = currentPokemon.evolves_to[0];
            } else {
                currentPokemon = null;
            }
        }

        return evolutionChain;
    };

    return (
        <View>
            <Text>Evolution Chain</Text>
            <View>
                {evolutionChain.map((pokemon, index) => (
                    <View key={index}>
                        <Text>{pokemon.name}</Text>
                        {pokemon.evolutionDetails.length > 0 && (
                            <View>
                                {pokemon.evolutionDetails.map((evolution, index) => (
                                    <Text>{evolution.trigger} -&gt; {evolution.name}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    )
}

export default EvolutionChain;