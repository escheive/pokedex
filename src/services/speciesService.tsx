import { database, createPokemonTable, insertPokemon } from '../utils/database';
// Redux
import { useDispatch } from 'react-redux';
import { fetchPokemonRequest, fetchPokemonSuccess, fetchPokemonFailure } from '../actions/pokemonActions';

////////////////////////////////////////////////////////////////
//++++++++++++++++++ Pokemon Data Functions ++++++++++++++++++//
////////////////////////////////////////////////////////////////


// Function to fetch base pokemon data from the api
const fetchSpeciesDataFromApi = async (start, end) => {
    console.log('fetchingPokemonFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${end - start}&offset=${start}`);
        const data = await response.json();

        const speciesData = data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const pokemonDetails = await response.json();

            const flavorTextEntries = await pokemonDetails.flavor_text_entries
                .filter((entry) => entry.language.name === 'en')
                .map((entry) => {
                    return {
                        flavor_text: entry.flavor_text,
                        version: entry.version.name,
                    }
                });

            const genera = await pokemonDetails.genera.filter(
                (genus) => genus.language.name === 'en');

            const varieties = await pokemonDetails.varieties
                .filter((variety) => variety.is_default === false)
                .map((variety) => {
                    // Deconstruct the url to grab the id number from it
                    const urlParts = variety.pokemon.url.split('/');
                    // The url contains the pokemons id, so this will grab that id number
                    const varietyId = urlParts[urlParts.length-2];
                    return {
                        name: variety.pokemon.name,
                        id: varietyId,
                    }
                });

            return {
                id: pokemonDetails.id,
                name: pokemonDetails.name,
                base_happiness: pokemonDetails.base_happiness,
                capture_rate: pokemonDetails.capture_rate,
                egg_groups: pokemonDetails.egg_groups,
                flavor_text_entries: flavorTextEntries,
                genus: genera.genus,
                generation: pokemonDetails.generation.name,
                growth_rate: pokemonDetails.growth_rate.name,
                habitat: pokemonDetails.habitat.name,
                hatch_counter: pokemonDetails.hatch_counter,
                is_baby: pokemonDetails.is_baby,
                is_legendary: pokemonDetails.is_legendary,
                is_mythical: pokemonDetails.is_mythical,
                shape: pokemonDetails.shape.name,
                varieties: pokemonDetails.varieties
            }
        });

        const transformedPokemonData = await Promise.all(pokemonData);

        // Release memory occupied by data.results and pokemonUrls
        data.results = null;
        return transformedPokemonData;
    } catch (error) {
        console.error('Error in fetchPokemonFromAPI function', error);
        throw error;
    }
};

// Function to fetch base pokemon data from database or api
const fetchPokemonData = () => {
    console.log('fetchPokemonData function hit');
    return async (dispatch) => {
        dispatch(fetchPokemonRequest());
        try {
            // Wait for the table creation process to complete
            await createPokemonTable();

            const totalCount = 40;
            const batchSize = 20;
            const batches = Math.ceil(totalCount / batchSize);

            const fetchedPokemonData = {};

            const hasData = await new Promise((resolve, reject) => {
                console.log('hasData')
                const start = 0;
                const end = totalCount;
                database.transaction((tx) => {
                    tx.executeSql(
                        `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
                        [start, end],
                        (tx, result) => {
                            if (result.rows.length > 0) {
                                for (let i=0; i<result.rows.length; i++) {
                                    const pokemon = result.rows.item(i);
                                    fetchedPokemonData[pokemon.id] = pokemon;
                                };
                            }
                            resolve(result.rows.length > 0);
                        },
                        (error) => {
                            console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
                            reject(error);
                        }
                    );
                });
            });

            if (!hasData) {
                console.log('!hasData')
                const batchInserts = [];
                for (let batch=0; batch < batches; batch++) {
                    const start = batch * batchSize;
                    const end = start + batchSize

                    try {
                        console.log('Batch:', batch);
                        const fetchedData = await fetchPokemonFromAPI(start, end);
                        batchInserts.push(insertPokemon(fetchedData));
//                         await insertPokemon(fetchedData);
                    } catch (error) {
                        console.error('Error in the !hasData section of fetchPokemonData function:', error);
                        throw error;
                    }
                }

                await Promise.all(batchInserts);
            }

            console.log('Successfully fetched data in the fetchPokemonData function');
            dispatch(fetchPokemonSuccess(fetchedPokemonData));
        } catch (error) {
            console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
            dispatch(fetchPokemonFailure(error));
        }
    };
};

export { fetchPokemonData, fetchPokemonFromAPI };