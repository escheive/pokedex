import { createPokemonTable, insertPokemon, createAbilitiesTable, insertAbility } from './database';
// Database
import SQLite from 'react-native-sqlite-storage';
// Redux
import { useDispatch } from 'react-redux';
import { rootReducer } from '../reducers/rootReducer';
import { fetchPokemonRequest, fetchPokemonSuccess, fetchPokemonFailure } from '../actions/pokemonActions';

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
//         const pokemonData = [];
//
//         for (let i = 0; i < pokemonUrls.length; i += 5) {
//             const batchUrls = pokemonUrls.slice(i, i + 5);
//             const batchData = await Promise.all(batchUrls.map((url) =>fetch(url).then((response) => response.json())));
//             pokemonData.push(...batchData);
//         }

        console.log('finished fetchedPokemonFromApi function job :) ');
        return pokemonData;
    } catch (error) {
        console.error('Error in fetchPokemonFromAPI function', error);
        throw error;
    }
};


// // Function to fetch base pokemon data from database or api
// const fetchPokemonData = async ( database, setIsLoading, setPokemonList ) => {
//     console.log('fetchPokemonData function hit');
//     setIsLoading("Loading Pokemon...");
//     try {
//         // Wait for the table creation process to complete
//         await createPokemonTable(database);
//
//         const totalCount = 1010;
//         const batchSize = 20;
//         const batches = Math.ceil(totalCount / batchSize);
//
//         const fetchedPokemonData = [];
//
//
//         const hasData = await new Promise((resolve, reject) => {
//             const start = 0;
//             const end = 1010;
//             database.transaction((tx) => {
//                 tx.executeSql(
//                     `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
//                     [start, end],
//                     (tx, result) => {
//                         if (result.rows.length > 0) {
//                             for (let i=0; i<result.rows.length; i++) {
//                                 fetchedPokemonData.push(result.rows.item(i));
//                             }
//                         }
//                         resolve(result.rows.length > 0);
//                     },
//                     (error) => {
//                         console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
//                         reject(error);
//                     }
//                 );
//             });
//         });
//
//         if (!hasData) {
//
//             for (let batch=0; batch < batches; batch++) {
//                 const start = batch * batchSize;
//                 const end = start + batchSize
//
//                 // set loading phase so that loading screen updates
//                 setIsLoading("Fetching Pokemon data from the API...");
//                 try {
//                     const fetchedData = await fetchPokemonFromAPI(start, end);
// //                     fetchedPokemonData.push(...fetchedData);
//                     await insertPokemon(database, fetchedData);
//                 } catch (error) {
//                     console.error('Error in the !hasData section of fetchPokemonData function:', error);
//                     throw error;
//                 }
//             }
//         }
//
// //         for (let batch=0; batch < batches; batch++) {
// //             const start = batch * batchSize;
// //             const end = start + batchSize;
// //
// //             const hasData = await new Promise((resolve, reject) => {
// //                 database.transaction((tx) => {
// //                     tx.executeSql(
// //                         `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
// //                         [start, end],
// //                         (tx, result) => {
// //                             if (result.rows.length > 0) {
// //                                 for (let i=0; i<result.rows.length; i++) {
// //                                     fetchedPokemonData.push(result.rows.item(i));
// //                                 }
// //                             }
// //                             resolve(result.rows.length > 0);
// //                         },
// //                         (error) => {
// //                             console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
// //                             reject(error);
// //                         }
// //                     );
// //                 });
// //             });
// //
// //             if (!hasData) {
// //                 // set loading phase so that loading screen updates
// //                 setIsLoading("Fetching Pokemon data from the API...");
// //                 try {
// //                     const fetchedData = await fetchPokemonFromAPI(start, end);
// // //                     fetchedPokemonData.push(...fetchedData);
// //                     await insertPokemon(database, fetchedData);
// //                 } catch (error) {
// //                     console.error('Error in the !hasData section of fetchPokemonData function:', error);
// //                     throw error;
// //                 }
// //             }
// //         }
//
//         console.log('Successfully fetched data in the fetchPokemonData function');
//
//         setPokemonList(fetchedPokemonData);
// //         setPokemonList((prevList) => {
// //             const mergedList = [...prevList, ...fetchedPokemonData];
// //             const uniqueList = Array.from(
// //                 new Set(mergedList.map((pokemon) => pokemon.id))).map((id) =>
// //                     mergedList.find((pokemon) => pokemon.id === id)
// //             );
// //             return uniqueList
// //         });
//     } catch (error) {
//         console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
//     }
// };




// Function to fetch base pokemon data from database or api
const fetchPokemonData = (database) => {
    console.log('fetchPokemonData function hit');
    return async (dispatch) => {
        dispatch(fetchPokemonRequest());
        try {
            // Wait for the table creation process to complete
            createPokemonTable(database)
              .then(async () => {
                const totalCount = 1010;
                const batchSize = 20;
                const batches = Math.ceil(totalCount / batchSize);

                const fetchedPokemonData = [];


                const hasData = await new Promise((resolve, reject) => {
                    const start = 0;
                    const end = 1010;
                    database.transaction((tx) => {
                        tx.executeSql(
                            `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
                            [start, end],
                            (tx, result) => {
                                if (result.rows.length > 0) {
                                    for (let i=0; i<result.rows.length; i++) {
                                        fetchedPokemonData.push(result.rows.item(i));
                                    }
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

                    for (let batch=0; batch < batches; batch++) {
                        const start = batch * batchSize;
                        const end = start + batchSize

                        try {
                            const fetchedData = await fetchPokemonFromAPI(start, end);
        //                     fetchedPokemonData.push(...fetchedData);
                            await insertPokemon(database, fetchedData);
                        } catch (error) {
                            console.error('Error in the !hasData section of fetchPokemonData function:', error);
                            throw error;
                        }
                    }
                }

                console.log('Successfully fetched data in the fetchPokemonData function');
                dispatch(fetchPokemonSuccess(fetchedPokemonData));
            })
              .catch((error) => {
                console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
                dispatch(fetchPokemonFailure(error));
            });
        } catch (error) {
            console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
            dispatch(fetchPokemonFailure(error));
        }
    };
};




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



// Function to fetch ability data from database or api
const fetchAbilitiesData = async (database, setIsLoading, setAllPokemonAbilities) => {
    console.log('fetchAbilitiesData function hit');
    try {
        // Wait for the table creation process to complete
        await createAbilitiesTable(database);

        const totalCount = 298;
        const batchSize = 20;
        const batches = Math.ceil(totalCount / batchSize);
        const fetchedAbilitiesData = [];

        const start = 0;
        const end = 298;

        const hasData = await new Promise((resolve, reject) => {
            setIsLoading("Loading Abilities");
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
            setIsLoading("Fetching Abilities data from the API");
            const fetchedData = await fetchAbilitiesFromAPI(start, end);
            fetchedAbilitiesData.push(...fetchedData);
            await insertAbility(database, fetchedData);
        }

        setAllPokemonAbilities(fetchedAbilitiesData);

        console.log('Successfully fetched data in the fetchAbilitiesData function');
    } catch (error) {
        console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
    }
};

export { fetchAbilitiesData, fetchAbilitiesFromAPI };