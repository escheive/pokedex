import { database } from '../utils/database';


// Function to create the matrix table if it doesn't exist
const createMatrixTable = () => {
    console.log('createMatrixTable');
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='interaction_matrix';`,
                [],
                (tx, result) => {
                    if (result.rows.length === 0) {
                        // If table doesnt exist, execute the CREATE TABLE query to create the table
                        tx.executeSql(
                            'CREATE TABLE IF NOT EXISTS interaction_matrix (id INTEGER PRIMARY KEY, matrix TEXT)',
                            [],
                            () => {
                                resolve();
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                    } else {
                        resolve();
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// Function to retrieve the interaction matrix from Sqlite
const retrieveMatrixFromStorage = () => {
    console.log('retrieveMatrixFromStorage');
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT matrix FROM interaction_matrix LIMIT 1`,
                [],
                (tx, result) => {
                    if (result.rows.length > 0) {
                        console.log('success');
                        const matrixJSON = result.rows.item(0).matrix;
                        const matrix = JSON.parse(matrixJSON);
                        resolve(matrix);
                    } else {
                        resolve(null);
                    }
                },
                (tx, error) => {
                    console.error('Error executing sql query in retrieveMatrixFromStorage', error);
                    reject(error);
                }
            );
        });
    });
};

// Function to save the interaction matrix to Sqlite
const saveMatrixToStorage = (matrix) => {
    return new Promise((resolve, reject) => {
        const matrixJSON = JSON.stringify(matrix);

        database.transaction((tx) => {
            // Execute the REPLACE query to insert or replace the matrix
            tx.executeSql(
                'REPLACE INTO interaction_matrix (id, matrix) VALUES (?, ?)',
                [1, matrixJSON],
                (tx, result) => {
                    resolve(result);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

// Function to save the interaction matrix to Sqlite
const resetMatrix = () => {
    console.log('resetMatrix function hit');
    try {
        database.transaction((tx) => {
            tx.executeSql(
                'DROP TABLE IF EXISTS interaction_matrix',
                [],
                () => {
                    console.log('Interaction_matrix dropped successfully');
                },
                (error) => {
                    console.error('Error dropping interaction_matrix:', error);
                }
            );
        });
    } catch (error) {
        console.error('Error with the reset matrix function', error);
    }
};

export { createMatrixTable, retrieveMatrixFromStorage, saveMatrixToStorage, resetMatrix };