import { database } from '../utils/database/database';
import { createPokemonTable, insertPokemon } from '../utils/database/pokemonDatabase';
// Redux
import { useDispatch } from 'react-redux';
import { fetchPokemonRequest, fetchPokemonSuccess, fetchPokemonFailure } from '../actions/pokemonActions';

////////////////////////////////////////////////////////////////
//++++++++++++++++++ Pokemon Data Functions ++++++++++++++++++//
////////////////////////////////////////////////////////////////


// // Function to fetch base pokemon data from the api
// const fetchPokemonFromAPI = async (start, end) => {
//     console.log('fetchingPokemonFromAPI function hit')
//     try {
//         const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
//         const data = await response.json();
//
//         const pokemonData = data.results.map(async (pokemon) => {
//             const response = await fetch(pokemon.url);
//             const pokemonDetails = await response.json();
//             const moves = await pokemonDetails.moves.map((move) => {
//                 return {
//                     name: move.move.name,
//                     learnMethod: move.version_group_details[0].move_learn_method.name,
//                     levelLearnedAt: move.version_group_details[0].level_learned_at
//                 };
//             });
//             const modifiedStats = await pokemonDetails.stats.map((stat) => {
//                 return {
//                     name: stat.stat.name,
//                     value: stat.base_stat
//                 };
//             });
//             const modifiedAbilities = await pokemonDetails.abilities.map((ability) => {
//                 return {
//                     name: ability.ability.name,
//                     isHidden: ability.is_hidden
//                 };
//             });
//
//             return {
//                 id: pokemonDetails.id,
//                 name: pokemonDetails.name,
//                 type1: pokemonDetails.types[0].type.name,
//                 type2: pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : null,
//                 height: pokemonDetails.height,
//                 weight: pokemonDetails.weight,
//                 base_experience: pokemonDetails.base_experience,
//                 stats: modifiedStats,
//                 abilities: modifiedAbilities,
//                 moves: moves,
//                 species_url: pokemonDetails.species.url,
//                 image_url: pokemonDetails.sprites.other['official-artwork'].front_default,
//                 pixel_image_url: pokemonDetails.sprites.front_default,
//             }
//         });
//
//         const transformedPokemonData = await Promise.all(pokemonData);
//
//         // Release memory occupied by data.results and pokemonUrls
//         data.results = null;
//         return transformedPokemonData;
//     } catch (error) {
//         console.error('Error in fetchPokemonFromAPI function', error);
//         throw error;
//     }
// };


// Function to fetch base pokemon data from the api
const fetchPokemonFromAPI = async (resultsPerPage, page) => {
    console.log('fetchingPokemonFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${resultsPerPage}&offset=${(page - 1) * resultsPerPage}`);
        const data = await response.json();

        const pokemonData = data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const pokemonDetails = await response.json();
            const moves = await pokemonDetails.moves.map((move) => {
                return {
                    name: move.move.name,
                    learnMethod: move.version_group_details[0].move_learn_method.name,
                    levelLearnedAt: move.version_group_details[0].level_learned_at
                };
            });
            const modifiedStats = await pokemonDetails.stats.map((stat) => {
                return {
                    name: stat.stat.name,
                    value: stat.base_stat
                };
            });
            const modifiedAbilities = await pokemonDetails.abilities.map((ability) => {
                return {
                    name: ability.ability.name,
                    isHidden: ability.is_hidden
                };
            });

            return {
                id: pokemonDetails.id,
                name: pokemonDetails.name,
                type1: pokemonDetails.types[0].type.name,
                type2: pokemonDetails.types[1] ? pokemonDetails.types[1].type.name : null,
                height: pokemonDetails.height,
                weight: pokemonDetails.weight,
                base_experience: pokemonDetails.base_experience,
                stats: modifiedStats,
                abilities: modifiedAbilities,
                moves: moves,
                species_url: pokemonDetails.species.url,
                image_url: pokemonDetails.sprites.other['official-artwork'].front_default,
                pixel_image_url: pokemonDetails.sprites.front_default,
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
                let page = 1;
                let totalResults = 0;
                const resultsPerPage = 20;

                const fetchDataAndInsert = async () => {
                    try {
                        console.log('Batch:', page);
                        const fetchedData = await fetchPokemonFromAPI(resultsPerPage, page);
                        batchInserts.push(insertPokemon(fetchedData));

                        totalResults = 40;
//                         totalResults = data.count;
                        page++;
                        if ((page - 1) * resultsPerPage < totalResults) {
                            await fetchDataAndInsert();
                        } else {
                            await Promise.all(batchInserts);
                            fetchPokemonData()(dispatch);
                        }
                    } catch (error) {
                        console.error('Error in the !hasData section of fetchPokemonData function:', error);
                        throw error;
                    }
                }

                await fetchDataAndInsert();
            }
            console.log('Successfully fetched data in the fetchPokemonData function');
            dispatch(fetchPokemonSuccess(fetchedPokemonData));
        } catch (error) {
            console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
            dispatch(fetchPokemonFailure(error));
        }
    };
};


// // Function to fetch base pokemon data from database or api
// const fetchPokemonData = () => {
//     console.log('fetchPokemonData function hit');
//     return async (dispatch) => {
//         dispatch(fetchPokemonRequest());
//         try {
//             // Wait for the table creation process to complete
//             await createPokemonTable();
//
//             const totalCount = 40;
//             const batchSize = 20;
//             const batches = Math.ceil(totalCount / batchSize);
//
//             const fetchedPokemonData = {};
//
//             const hasData = await new Promise((resolve, reject) => {
//                 console.log('hasData')
//                 const start = 0;
//                 const end = totalCount;
//                 database.transaction((tx) => {
//                     tx.executeSql(
//                         `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
//                         [start, end],
//                         (tx, result) => {
//                             if (result.rows.length > 0) {
//                                 for (let i=0; i<result.rows.length; i++) {
//                                     const pokemon = result.rows.item(i);
//                                     fetchedPokemonData[pokemon.id] = pokemon;
//                                 };
//                             }
//                             resolve(result.rows.length > 0);
//                         },
//                         (error) => {
//                             console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
//                             reject(error);
//                         }
//                     );
//                 });
//             });
//
//             if (!hasData) {
//                 console.log('!hasData')
//                 const batchInserts = [];
//                 for (let batch=0; batch < batches; batch++) {
//                     const start = batch * batchSize;
//                     const end = start + batchSize
//
//                     try {
//                         console.log('Batch:', batch);
//                         const fetchedData = await fetchPokemonFromAPI(start, end);
//                         batchInserts.push(insertPokemon(fetchedData));
// //                         await insertPokemon(fetchedData);
//                     } catch (error) {
//                         console.error('Error in the !hasData section of fetchPokemonData function:', error);
//                         throw error;
//                     }
//                 }
//
//                 await Promise.all(batchInserts);
//             }
//
//             console.log('Successfully fetched data in the fetchPokemonData function');
//             dispatch(fetchPokemonSuccess(fetchedPokemonData));
//         } catch (error) {
//             console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
//             dispatch(fetchPokemonFailure(error));
//         }
//     };
// };

export { fetchPokemonData, fetchPokemonFromAPI };