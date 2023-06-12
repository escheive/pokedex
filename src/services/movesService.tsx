import { database, createPokemonTable, insertPokemon } from '../utils/database';
// Redux
import { useDispatch } from 'react-redux';
import { fetchPokemonRequest, fetchPokemonSuccess, fetchPokemonFailure } from '../actions/pokemonActions';

////////////////////////////////////////////////////////////////
//+++++++++++++++++++ Moves Data Functions +++++++++++++++++++//
////////////////////////////////////////////////////////////////


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

export { fetchMovesData };