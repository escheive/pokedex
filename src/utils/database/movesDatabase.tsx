import { database } from './database';



////////////////////////////////////////////////////////////////
//+++++++++++++++++ Moves Database Functions +++++++++++++++++//
////////////////////////////////////////////////////////////////



// Execute SQL statement to create a pokemon moves table
const createMovesTable = () => {
    console.log('createMovesTable function hit')
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='Moves';`,
                [],
                (tx, result) => {
                    if (result.rows.length === 0) {
                        console.log('Moves table doesnt exist, creating one');
                        // If table doesnt exist, create it
                        tx.executeSql(
                            `CREATE TABLE IF NOT EXISTS Moves (
                            id INTEGER PRIMARY KEY,
                            name TEXT NOT NULL,
                            type1 TEXT NOT NULL,
                            type2 TEXT,
                            height REAL,
                            weight REAL,
                            base_experience INTEGER,
                            stats TEXT,
                            abilities TEXT,
                            moves TEXT,
                            species_url TEXT,
                            image_url TEXT,
                            pixel_image_url TEXT,
                            isCaptured BOOLEAN DEFAULT false,
                            isFavorite BOOLEAN DEFAULT false
                            );`,
                            [],
                            () => {
                                console.log('Table "Moves" created successfully');
                                resolve();
                            },
                            (error) => {
                                console.error('Error creating table "Moves":', error);
                                reject(error);
                            }
                        );
                    } else {
                        console.log('Table does exist already')
                        resolve();
                    }
                },
                (error) => {
                    console.error('Error checking table "Moves":', error);
                    reject(error);
                }
            );
        });
    });
};


// Function to drop moves table
const resetMovesTable = () => {
    console.log('resetMovesTable function hit');
    try {
        database.transaction((tx) => {
            tx.executeSql(
                `DROP TABLE IF EXISTS 'Moves';`,
                [],
                () => {
                    console.log('Table "Moves" dropped successfully');
                },
                (error) => {
                    console.error('Error dropping table "Moves":', error);
                }
            );
        });
    } catch (error) {
        console.error('Error with resetMovesTable function', error);
    }
};


// Function to insert a Moves record into the Moves table
const insertMove = async (movesData) => {
    console.log('insertMove function hit')
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                let successfulInsertions = 0;
                const totalInsertions = MovesData.length;
                movesData.forEach((move) => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO Moves (id, name, type1, type2, height, weight, base_experience, stats, abilities, moves, species_url, image_url, pixel_image_url, isCaptured, isFavorite)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        [
                            move.id,
                            move.name,
                            move.accuracy,
                            move.power,
                            move.pp,
                            move.priority,
                            move.type,
                            move.contest_type,
                            move.damage_class,
                            move.effect_entries,
                            move.generation.name,
                            pokemon.type2 ? pokemon.type2 : null,
                            pokemon.height,
                            pokemon.weight,
                            pokemon.base_experience,
                            JSON.stringify(pokemon.stats),
                            JSON.stringify(pokemon.abilities),
                            JSON.stringify(pokemon.moves),
                        ],
                        () => {
//                             successfulInsertions++;
//                             console.log(successfulInsertions)
//                             if (successfulInsertions === totalInsertions) {
                                console.log('Moves records inserted successfully');
                                resolve();
                        },
                        (error) => {
                            console.error('Error inserting Move record:', error)
                            reject(error);
                        }
                    );
                });
            });
        });
    } catch (error) {
        console.error('Error inserting Move data:', error);
    }
};


export { createMovesTable, resetMovesTable ,insertMove };