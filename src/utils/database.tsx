// Database
import SQLite from 'react-native-sqlite-storage';


// Open the database
export const database = SQLite.openDatabase({
    name: 'Pokemon.db',
    location: 'default',
});


////////////////////////////////////////////////////////////////
//++++++++++++++++ Pokemon Database Functions ++++++++++++++++//
////////////////////////////////////////////////////////////////




// Execute SQL statement to create a pokemon table
const createPokemonTable = () => {
    console.log('createPokemonTable function hit')
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='Pokemon';`,
                [],
                (tx, result) => {
                    if (result.rows.length === 0) {
                        console.log('Pokemon table doesnt exist, creating one');
                        // If table doesnt exist, create it
                        tx.executeSql(
                            `CREATE TABLE IF NOT EXISTS Pokemon (
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
                                console.log('Table "Pokemon" created successfully');
                                resolve();
                            },
                            (error) => {
                                console.error('Error creating table "Pokemon":', error);
                                reject(error);
                            }
                        );
                    } else {
                        console.log('Table does exist already')
                        resolve();
                    }
                },
                (error) => {
                    console.error('Error checking table "Pokemon":', error);
                    reject(error);
                }
            );
        });
    });
};


// Function to drop pokemon table
const resetPokemonTable = () => {
    console.log('resetPokemonTable function hit');
    try {
        database.transaction((tx) => {
            tx.executeSql(
                `DROP TABLE IF EXISTS pokemon;`,
                [],
                () => {
                    console.log('Table "pokemon" dropped successfully');
                },
                (error) => {
                    console.error('Error dropping table "pokemon":', error);
                }
            );
        });
    } catch (error) {
        console.error('Error with resetPokemonTable function', error);
    }
};


// Function to insert a Pokemon record into the pokemon table
const insertPokemon = async (pokemonData) => {
    console.log('insertPokemon function hit')
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                let successfulInsertions = 0;
                const totalInsertions = pokemonData.length;
                pokemonData.forEach((pokemon) => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO Pokemon (id, name, type1, type2, height, weight, base_experience, stats, abilities, moves, species_url, image_url, pixel_image_url, isCaptured, isFavorite)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        [
                            pokemon.id,
                            pokemon.name,
                            pokemon.type1,
                            pokemon.type2 ? pokemon.type2 : null,
                            pokemon.height,
                            pokemon.weight,
                            pokemon.base_experience,
                            JSON.stringify(pokemon.stats),
                            JSON.stringify(pokemon.abilities),
                            JSON.stringify(pokemon.moves),
                            pokemon.species_url,
                            pokemon.image_url,
                            pokemon.pixel_image_url,
                            false,
                            false
                        ],
                        () => {
//                             successfulInsertions++;
//                             console.log(successfulInsertions)
//                             if (successfulInsertions === totalInsertions) {
                                console.log('Pokemon records inserted successfully');
                                resolve();
                        },
                        (error) => {
                            console.error('Error inserting Pokemon record:', error)
                            reject(error);
                        }
                    );
                });
            });
        });
    } catch (error) {
        console.error('Error inserting Pokemon data:', error);
    }
};

const updatePokemonStatus = async (pokemonId, field, value) => {
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                let query = '';

                if (field === 'isFavorite') {
                    query = 'UPDATE Pokemon SET isFavorite = ? WHERE id = ?;';
                } else if (field === 'isCaptured') {
                    query = 'UPDATE Pokemon SET isCaptured = ? WHERE id = ?;';
                }

                tx.executeSql(
                    query,
                    [value, pokemonId],
                    () => {
                        console.log(`Pokemon with ID ${pokemonId} status updated`);
                        resolve();
                    },
                    (error) => {
                        console.error('Error updating Pokemon status:', error);
                        reject(error);
                    }
                );
            });
        });
    } catch (error) {
        console.error('Error updating status:', error);
    }
};


const updatePokemonFavoriteStatus = async (pokemonId, isFavorite) => {
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                tx.executeSql(
                    `UPDATE Pokemon SET isFavorite = ? WHERE id = ?;`,
                    [isFavorite, pokemonId],
                    () => {
                        console.log(`Pokemon with ID ${pokemonId} favorite status updated`);
                        resolve();
                    },
                    (error) => {
                        console.error('Error updating Pokemon favorite status:', error);
                        reject(error);
                    }
                );
            });
        });
    } catch (error) {
        console.error('Error updating favorite status:', error);
    }
};

const updatePokemonCaptureStatus = async (pokemonId, isCaptured) => {
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                tx.executeSql(
                    `UPDATE Pokemon SET isCaptured = ? WHERE id = ?;`,
                    [isCaptured ? 1 : 0, pokemonId],
                    () => {
                        console.log(`Pokemon with ID ${pokemonId} capture status updated`);
                        resolve();
                    },
                    (error) => {
                        console.error('Error updating Pokemon capture status:', error);
                        reject(error);
                    }
                );
            });
        });
    } catch (error) {
        console.error('Error updating capture status:', error);
    }
};


export { createPokemonTable, resetPokemonTable, insertPokemon, updatePokemonFavoriteStatus, updatePokemonCaptureStatus, updatePokemonStatus };



////////////////////////////////////////////////////////////////
//++++++++++++++++ Ability Database Functions ++++++++++++++++//
////////////////////////////////////////////////////////////////


// Function to check and create an Abilities table
const createAbilitiesTable = () => {
    console.log('createAbilitiesTable function hit')
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='Abilities';`,
                [],
                (tx, result) => {
                    if (result.rows.length === 0) {
                        console.log('Abilities table doesnt exist, creating one');
                        // If table doesnt exist, create it
                        tx.executeSql(
                            `CREATE TABLE IF NOT EXISTS Abilities (
                            id INTEGER PRIMARY KEY,
                            abilityName TEXT,
                            shortAbilityDescription TEXT,
                            longAbilityDescription TEXT,
                            pokemonWithAbility TEXT
                            );`,
                            [],
                            () => {
                                console.log('Table "Abilities" created successfully');
                                resolve();
                            },
                            (error) => {
                                console.error('Error creating table "Abilities":', error);
                                reject(error);
                            }
                        );
                    } else {
                        console.log('Abilities table already exists')
                        resolve();
                    }
                },
                (error) => {
                    console.error('Error checking table "Abilities":', error);
                    reject(error);
                }
            );
        });
    });
};



// Function to drop Abilities table
const resetAbilitiesTable = () => {
    console.log('resetAbilitiesTable function hit');
    database.transaction((tx) => {
        tx.executeSql(
            `DROP TABLE IF EXISTS Abilities;`,
            [],
            () => {
                console.log('Table "Abilities" dropped successfully');
                createPokemonTable();
            },
            (error) => {
                console.error('Error dropping table "Abilities":', error);
            }
        );
    });
};



// Function to insert ability data into the Abilities db table
const insertAbility = async (abilityData) => {
    console.log('insertAbility function hit');
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                abilityData.forEach((ability) => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO Abilities (id, abilityName, shortAbilityDescription, longAbilityDescription, pokemonWithAbility)
                        VALUES (?, ?, ?, ?, ?);`,
                        [
                            ability.id,
                            ability.name,
                            ability.shortDescription,
                            ability.longDescription,
                            ability.pokemonWithAbility
                        ],
                        () => {
                            console.log('Ability data inserted successfully');
                            resolve();
                        },
                        (error) => {
                            console.error('Error inserting Ability record', error);
                            reject(error);
                        }
                    );
                });
                console.log('Ability records inserted successfully');
                resolve();
            });
        });
    } catch (error) {
        console.error('Error inserting Ability data:', error);
    }
};


export { createAbilitiesTable, resetAbilitiesTable, insertAbility };

