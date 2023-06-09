import { database } from '../utils/database';

// Function to retrieve the interaction matrix from Sqlite
const retrieveMatrixFromStorage = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT matrix FROM interaction_matrix LIMIT 1',
                [],
                (_, result) => {
                    if (result.rows.length > 0) {
                        const matrixJSON = result.rows.item(0).matrix;
                        const matrix = JSON.parse(matrixJSON);
                        resolve(matrix);
                    } else {
                        resolve(null);
                    }
                },
                (_, error) => {
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

        db.transaction((tx) => {
            // Execute the REPLACE query to insert or replace the matrix
            tx.executeSql(
                'REPLACE INTO interaction_matrix (id, matrix) VALUES (?, ?)',
                [1, matrixJSON],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
};