import { database, createPokemonTable, insertPokemon } from '../utils/database';
// Redux
import { useDispatch } from 'react-redux';
// Utils
import grabIdFromPokeApiUrl from '../utils/helpers';
import { fetchPokemonRequest, fetchPokemonSuccess, fetchPokemonFailure } from '../actions/pokemonActions';

////////////////////////////////////////////////////////////////
//+++++++++++++++++++ Moves Data Functions +++++++++++++++++++//
////////////////////////////////////////////////////////////////

// Function to fetch base pokemon data from the api
const fetchSpeciesDataFromApi = async (resultsPerPage, page) => {
    console.log('fetchingPokemonFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move?limit=${resultsPerPage}&offset=${(page - 1) * resultsPerPage}`);
        const data = await response.json();

        const movesData = data.results.map(async (move) => {
            const response = await fetch(move.url);
            const moveDetails = await response.json();

            const learnedBy = moveDetails.learned_by_pokemon.map((pokemon) => {
                const id = grabIdFromPokeApiUrl(pokemon.url)
                return {
                    name: pokemon.name,
                    id: id
                }
            }

            const machine = {};
            if (move.machines.length > 0) {
                const machineResponse = await fetch(move.machines[-1].machine.url);
                const machineData = await machineResponse.json();

                const machine = {
                    item: machineData.item,
                    move: machineData.move
                }
            }

            return {
                id: move.id,
                name: move.name,
                accuracy: move.accuracy,
                power: move.power,
                pp: move.pp,
                type: move.type,
                priority: move.priority,
                contest_type: move.contest_type,
                damage_class: move.damage_class,
                effect_entry: move.effect_entries[0].effect,
                effect_chance: move.effect_chance,
                generation: move.generation,
                target: move.target,
                meta: move.meta,
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
                console.log('hasData');
                const start = 1; // Start from move ID 1
                const end = totalCount;
                database.transaction((tx) => {
                    tx.executeSql(
                        `SELECT * FROM Moves WHERE id BETWEEN ? AND ?;`,
                        [start, end],
                        (tx, result) => {
                            if (result.rows.length > 0) {
                                for (let i = 0; i < result.rows.length; i++) {
                                    const move = result.rows.item(i);
                                    fetchedMovesData[move.id] = move;
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
                console.log('!hasData');
                const batchInserts = [];
                let page = 1;
                let totalResults = 0;
                const resultsPerPage = 20;

                const fetchDataAndInsert = async () => {
                    try {
                        console.log('Batch:', page);
                        const fetchedData = await fetchMovesFromAPI(resultsPerPage, page);
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