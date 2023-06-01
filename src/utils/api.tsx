import { database, createPokemonTable, insertPokemon, createAbilitiesTable, insertAbility } from './database';
// Database
import SQLite from 'react-native-sqlite-storage';
// Redux
import { useDispatch } from 'react-redux';
import { fetchPokemonRequest, fetchPokemonSuccess, fetchPokemonFailure } from '../actions/pokemonActions';
import { fetchAbilitiesRequest, fetchAbilitiesSuccess, fetchAbilitiesFailure } from '../actions/abilitiesActions';

////////////////////////////////////////////////////////////////
//++++++++++++++++++ Pokemon Data Functions ++++++++++++++++++//
////////////////////////////////////////////////////////////////


// Function to fetch base pokemon data from the api
const fetchPokemonFromAPI = async (start, end) => {
    console.log('fetchingPokemonFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
        const data = await response.json();

        const pokemonUrls = data.results.map((pokemon) => pokemon.url);
        const pokemonData = await Promise.all(pokemonUrls.map((url) =>fetch(url).then((response) => response.json())));

        // Release memory occupied by data.results and pokemonUrls
        data.results = null;
        pokemonUrls.length = 0;

        return pokemonData;
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

            const totalCount = 1010;
            const batchSize = 20;
            const batches = Math.ceil(totalCount / batchSize);

            const fetchedPokemonData = {};


            const hasData = await new Promise((resolve, reject) => {
                const start = 0;
                const end = totalCount;
                database.transaction((tx) => {
                    tx.executeSql(
                        `SELECT id, name, type1, type2, image_url FROM Pokemon WHERE id BETWEEN ? AND ?;`,
                        [start, end],
                        (tx, result) => {
                            if (result.rows.length > 0) {
                                for (let i=0; i<result.rows.length; i++) {
                                    const pokemon = result.rows.item(i);
                                    fetchedPokemonData[pokemon.id] = {
                                        id: pokemon.id,
                                        name: pokemon.name,
                                        type1: pokemon.type1,
                                        type2: pokemon.type2,
                                        image_url: pokemon.image_url,
                                    };
                                };
                            }
                            resolve(result.rows.length > 0);
//                             resolve(Object.keys(fetchedPokemonData).length > 0);
                        },
                        (error) => {
                            console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
                            reject(error);
                        }
                    );
                });
            });

//             const hasData = await new Promise((resolve, reject) => {
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
//                                     if (pokemon.id % 10 === 0) {
//                                         console.log(pokemon.id)
//                                     }
//                                 };
//                             }
//                             resolve(result.rows.length > 0);
// //                             resolve(Object.keys(fetchedPokemonData).length > 0);
//                         },
//                         (error) => {
//                             console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
//                             reject(error);
//                         }
//                     );
//                 });
//             });


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
                        fetchedData.length = 0;

                        await new Promise((resolve) => setTimeout(resolve, 3000));
//                         await insertPokemon(fetchedData);
                    } catch (error) {
                        console.error('Error in the !hasData section of fetchPokemonData function:', error);
                        throw error;
                    }
                }

                await Promise.all(batchInserts);
            }

            console.log('Successfully fetched data in the fetchPokemonData function');
            console.log(fetchedPokemonData)
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
//             createPokemonTable().then(async () => {
//                 const totalCount = 1010;
//                 const batchSize = 20;
//                 const batches = Math.ceil(totalCount / batchSize);
//
//                 const fetchedPokemonData = [];
//
//                 const hasData = await new Promise((resolve, reject) => {
//                     const start = 0;
//                     const end = 1010;
//                     database.transaction((tx) => {
//                         tx.executeSql(
//                             `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
//                             [start, end],
//                             (tx, result) => {
//                                 if (result.rows.length > 0) {
//                                     for (let i=0; i<result.rows.length; i++) {
//                                         fetchedPokemonData.push(result.rows.item(i));
//                                     }
//                                 }
//                                 resolve(result.rows.length > 0);
//                             },
//                             (error) => {
//                                 console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
//                                 reject(error);
//                             }
//                         );
//                     });
//                 });
//
//                 if (!hasData) {
//
//                     for (let batch=0; batch < batches; batch++) {
//                         const start = batch * batchSize;
//                         const end = start + batchSize
//
//                         try {
//                             const fetchedData = await fetchPokemonFromAPI(start, end);
//         //                     fetchedPokemonData.push(...fetchedData);
//                             await insertPokemon(fetchedData);
//                         } catch (error) {
//                             console.error('Error in the !hasData section of fetchPokemonData function:', error);
//                             throw error;
//                         }
//                     }
//                 }
//
//                 console.log('Successfully fetched data in the fetchPokemonData function');
//                 dispatch(fetchPokemonSuccess(fetchedPokemonData));
//             })
//               .catch((error) => {
//                 console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
//                 dispatch(fetchPokemonFailure(error));
//             });
//         } catch (error) {
//             console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
//             dispatch(fetchPokemonFailure(error));
//         }
//     };
// };

export { fetchPokemonData, fetchPokemonFromAPI };


////////////////////////////////////////////////////////////////
//++++++++++++++++++ Ability Data Functions ++++++++++++++++++//
////////////////////////////////////////////////////////////////


// Function to fetch base abilities data from the api
const fetchAbilitiesFromAPI = async (start, end) => {
    console.log('fetchingAbilitiesFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/ability?limit=${end - start}&offset=${start}`);
        const data = await response.json();

        const abilityUrls = data.results.map((ability) => ability.url);
        const abilityData = await Promise.all(abilityUrls.map((url) => fetch(url).then((response) => response.json())));

        const modifiedAbilityData = await Promise.all(abilityData.map(async(ability) => {
            let modifiedAbility = ability;

            if (ability.effect_entries.length > 0) {
                const englishEffectEntries = ability.effect_entries.find((description) => description.language.name === "en");

                modifiedAbility.shortDescription = englishEffectEntries.short_effect;
                modifiedAbility.longDescription = englishEffectEntries.effect;

            };

            if (ability.pokemon.length > 0) {
                const pokemonWithAbility = await ability.pokemon.map((pokemon) => pokemon.pokemon.name)
                modifiedAbility.pokemonWithAbility = JSON.stringify(pokemonWithAbility);
            }

            return modifiedAbility;
        }));
        return modifiedAbilityData;

    } catch (error) {
        console.error('Error in fetchAbilitiesFromAPI function', error);
    }
};



// // Function to fetch ability data from database or api
// const fetchAbilitiesData = async (database, setIsLoading, setAllPokemonAbilities) => {
//     console.log('fetchAbilitiesData function hit');
//     try {
//         // Wait for the table creation process to complete
//         await createAbilitiesTable(database);
//
//         const totalCount = 298;
//         const batchSize = 20;
//         const batches = Math.ceil(totalCount / batchSize);
//         const fetchedAbilitiesData = [];
//
//         const start = 0;
//         const end = 298;
//
//         const hasData = await new Promise((resolve, reject) => {
//             setIsLoading("Loading Abilities");
//             database.transaction((tx) => {
//                 tx.executeSql(
//                     `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
//                     [start, end],
//                     (tx, result) => {
//                         if (result.rows.length > 0) {
//                             for (let i=0; i<result.rows.length; i++) {
//                                 fetchedAbilitiesData.push(result.rows.item(i));
//                             }
//                         }
//                         resolve(result.rows.length > 0);
//                     },
//                     (error) => {
//                         console.error('Error checking Ability data in the fetchAbilitiesData function, hasData subsection:', error);
//                         reject(error);
//                     }
//                 );
//             });
//         });
//
//         if (!hasData) {
//             // set loading phase so that loading screen updates
//             setIsLoading("Fetching Abilities data from the API");
//             const fetchedData = await fetchAbilitiesFromAPI(start, end);
//             fetchedAbilitiesData.push(...fetchedData);
//             await insertAbility(database, fetchedData);
//         }
//
//         setAllPokemonAbilities(fetchedAbilitiesData);
//
//         console.log('Successfully fetched data in the fetchAbilitiesData function');
//     } catch (error) {
//         console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
//     }
// };




// Function to fetch ability data from database or api
const fetchAbilitiesData = () => {
    console.log('fetchAbilitiesData function hit');
    return async (dispatch) => {
        dispatch(fetchAbilitiesRequest());
        try {
            // Wait for the table creation process to complete
            createAbilitiesTable()
              .then(async () => {

                const totalCount = 298;
                const batchSize = 20;
                const batches = Math.ceil(totalCount / batchSize);
                const fetchedAbilitiesData = [];

                const start = 0;
                const end = 298;

                const hasData = await new Promise((resolve, reject) => {
                    database.transaction((tx) => {
                        tx.executeSql(
                            `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
                            [start, end],
                            (tx, result) => {
                                if (result.rows.length > 0) {
                                    for (let i=0; i<result.rows.length; i++) {
                                        fetchedAbilitiesData.push(result.rows.item(i));
                                    }
                                }
                                resolve(result.rows.length > 0);
                            },
                            (error) => {
                                console.error('Error checking Ability data in the fetchAbilitiesData function, hasData subsection:', error);
                                reject(error);
                            }
                        );
                    });
                });

                if (!hasData) {
                    // set loading phase so that loading screen updates
                    const fetchedData = await fetchAbilitiesFromAPI(start, end);
                    fetchedAbilitiesData.push(...fetchedData);
                    await insertAbility(fetchedData);
                }

                console.log('Successfully fetched data in the fetchAbilitiesData function');
                dispatch(fetchAbilitiesSuccess(fetchedAbilitiesData));
            })
              .catch((error) => {
                console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
                dispatch(fetchAbilitiesFailure(error));
            });
        } catch (error) {
            console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
            dispatch(fetchAbilitiesFailure(error));
        }
    };
};




export { fetchAbilitiesData, fetchAbilitiesFromAPI };