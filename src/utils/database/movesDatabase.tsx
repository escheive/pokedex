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
                            accuracy INTEGER NOT NULL,
                            power INTEGER,
                            pp INTEGER,
                            priority INTEGER,
                            type TEXT
                            contest_type TEXT,
                            damage_class TEXT,
                            effect_entry TEXT,
                            effect_chance INTEGER,
                            generation TEXT,
                            target TEXT,
                            meta TEXT,
                            machine TEXT,
                            learned_by_pokemon TEXT
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
const insertMoves = async (movesData) => {
    console.log('insertMove function hit')
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                let successfulInsertions = 0;
                const totalInsertions = MovesData.length;
                movesData.forEach((move) => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO Moves (id, name, accuracy, power, pp, priority, type, contest_type, damage_class, effect_entry, effect_chance, generation, target, meta, machine, learned_by_pokemon)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        [
                            move.id,
                            move.name,
                            move.accuracy,
                            move.power,
                            move.pp,
                            move.priority,
                            JSON.stringify(move.type),
                            JSON.stringify(move.contest_type),
                            JSON.stringify(move.damage_class),
                            move.effect_entry,
                            move.effect_chance,
                            JSON.stringify(move.generation),
                            JSON.stringify(move.target),
                            JSON.stringify(move.meta),
                            JSON.stringify(move.machine),
                            JSON.stringify(move.learned_by_pokemon)
                        ],
                        () => {
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


export { createMovesTable, resetMovesTable, insertMoves };