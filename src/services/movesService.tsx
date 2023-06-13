import { database } from '../utils/database/database';
import { createMovesTable, insertMoves } from '../utils/database/movesDatabase';
// Redux
import { useDispatch } from 'react-redux';
// Utils
import { grabIdFromPokeApiUrl } from '../utils/helpers';
import { fetchMovesRequest, fetchMovesSuccess, fetchMovesFailure } from '../actions/movesActions';

////////////////////////////////////////////////////////////////
//+++++++++++++++++++ Moves Data Functions +++++++++++++++++++//
////////////////////////////////////////////////////////////////

// Function to fetch base moves data from the api
const fetchMovesFromApi = async (resultsPerPage, page) => {
    console.log('fetchingMovesFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move?limit=${resultsPerPage}&offset=${(page - 1) * resultsPerPage}`);
        const data = await response.json();

        const movesData = data.results.map(async (move) => {
            const moveResponse = await fetch(move.url);
            const moveDetails = await moveResponse.json();

            const learnedBy = await moveDetails.learned_by_pokemon && Array.isArray(moveDetails.learned_by_pokemon) ?
                moveDetails.learned_by_pokemon.map((pokemon) => {
                    const id = grabIdFromPokeApiUrl(pokemon.url)
                    return {
                        name: pokemon.name,
                        id: id
                    };
                }) : [];

            let machine = {};

            if (moveDetails.machines.length > 0) {
                const machineResponse = await fetch(moveDetails.machines[moveDetails.machines.length -1].machine.url);
                const machineData = await machineResponse.json();

                machine = {
                    item: machineData.item,
                    move: machineData.move
                }
            }

            return {
                id: moveDetails.id,
                name: moveDetails.name,
                accuracy: moveDetails.accuracy,
                power: moveDetails.power,
                pp: moveDetails.pp,
                type: moveDetails.type,
                priority: moveDetails.priority,
                contest_type: moveDetails.contest_type,
                damage_class: moveDetails.damage_class,
                effect_entry: moveDetails.effect_entries[0] ? moveDetails.effect_entries[0].effect : null,
                effect_chance: moveDetails.effect_chance,
                generation: moveDetails.generation,
                target: moveDetails.target,
                meta: moveDetails.meta,
                machine: machine,
                learned_by_pokemon: learnedBy,
            }
        });

        const transformedMovesData = await Promise.all(movesData);

        // Release memory occupied by data.results and pokemonUrls
        data.results = null;
        return transformedMovesData;
    } catch (error) {
        console.error('Error in fetchMovesFromAPI function', error);
        throw error;
    }
};

const fetchMovesData = () => {
    console.log('fetchMovesData function hit');
    return async (dispatch) => {
        dispatch(fetchMovesRequest());
        try {
            // Wait for table creation process to complete if table not exist
            await createMovesTable();

            const totalCount = 826; // Total number of moves in PokeApi
            const batchSize = 20;
            const batches = Math.ceil(totalCount / batchSize);

            const fetchedMovesData = {};

            const hasData = await new Promise((resolve, reject) => {
                const start = 1; // Start from move ID 1
                const end = totalCount;
                database.transaction((tx) => {
                    tx.executeSql(
                        `SELECT * FROM Moves WHERE id BETWEEN ? AND ?;`,
                        [start, end],
                        (tx, result) => {
                            if (result.rows.length > 0) {
                                console.log('Moves table has data');
                                for (let i = 0; i < result.rows.length; i++) {
                                    const move = result.rows.item(i);
                                    fetchedMovesData[move.name] = move;
                                }
                            }
                            resolve(result.rows.length > 0);
                        },
                        (error) => {
                            console.error('Error checking Moves data in the fetchMovesData function, hasData subsection:', error);
                            reject(error);
                        }
                    );
                });
            });

            if (!hasData) {
                console.log('Moves !hasData');
                const batchInserts = [];
                let page = 1;
                let totalResults = 0;
                const resultsPerPage = 20;

                const fetchDataAndInsert = async () => {
                    try {
                        console.log('Batch:', page);
                        const fetchedData = await fetchMovesFromApi(resultsPerPage, page);
                        batchInserts.push(insertMoves(fetchedData));

                        totalResults = totalCount;
                        page++;
                        if ((page - 1) * resultsPerPage < totalResults) {
                            await fetchDataAndInsert();
                        } else {
                            // Wait for all the batch inserts to complete
                            await Promise.all(batchInserts);
                            // Rerun the fetchMovesData function to retrieve the data from the database
                            fetchMovesData()(dispatch);
                        }
                    } catch (error) {
                        console.error('Error in the !hasData section of fetchMovesData function:', error);
                        throw error;
                    }
                };

                await fetchDataAndInsert();
            } else {
                console.log('Data already exists in the database');
            }

            console.log('Successfully fetched data in the fetchMovesData function');
            dispatch(fetchMovesSuccess(fetchedMovesData));
        } catch (error) {
            console.error('Error fetching and inserting Moves data in the fetchMovesData function:', error);
            dispatch(fetchMovesFailure(error));
        }
    };
};

export { fetchMovesData, fetchMovesFromApi };