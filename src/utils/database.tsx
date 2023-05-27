// Database
import SQLite from 'react-native-sqlite-storage';
////////////////////////////////////////////////////////////////
//++++++++++++++++ Pokemon Database Functions ++++++++++++++++//
////////////////////////////////////////////////////////////////


// Execute SQL statement to create a pokemon table
const createPokemonTable = (database) => {
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
                            hp INTEGER,
                            atk INTEGER,
                            def INTEGER,
                            sp_atk INTEGER,
                            sp_def INTEGER,
                            spd INTEGER,
                            ability1 TEXT,
                            ability2 TEXT,
                            ability3 TEXT,
                            capture_rate INTEGER,
                            species_url TEXT,
                            image_url TEXT
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
const resetPokemonTable = (database) => {
    console.log('resetPokemonTable function hit');
    try {
        database.transaction((tx) => {
            tx.executeSql(
                `DROP TABLE IF EXISTS pokemon;`,
                [],
                () => {
                    console.log('Table "pokemon" dropped successfully');
    //                 createPokemonTable(database);
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
const insertPokemon = async (database, pokemonData) => {
    console.log('insertPokemon function hit')
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                pokemonData.forEach((pokemon) => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO Pokemon (id, name, type1, type2, height, weight, base_experience, hp, atk, def, sp_atk, sp_def, spd, ability1, ability2, ability3, capture_rate, species_url, image_url)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        [
                            pokemon.id,
                            pokemon.name,
                            pokemon.types[0].type.name,
                            pokemon.types[1] ? pokemon.types[1].type.name : null,
                            pokemon.height,
                            pokemon.weight,
                            pokemon.base_experience,
                            pokemon.stats[0].base_stat,
                            pokemon.stats[1].base_stat,
                            pokemon.stats[2].base_stat,
                            pokemon.stats[3].base_stat,
                            pokemon.stats[4].base_stat,
                            pokemon.stats[5].base_stat,
                            pokemon.abilities[0] ? pokemon.abilities[0].ability.name : null,
                            pokemon.abilities[1] ? pokemon.abilities[1].ability.name : null,
                            pokemon.abilities[2] ? pokemon.abilities[2].ability.name : null,
                            pokemon.species.url,
                            pokemon.sprites.other['official-artwork'].front_default,
                        ],
                        () => {
                            resolve();
                        },
                        (error) => {
                            console.error('Error inserting Pokemon record:', error);
                            reject(error);
                        }
                    );
                });
                console.log('Pokemon records inserted successfully');
                resolve();
            });
        });
    } catch (error) {
        console.error('Error inserting Pokemon data:', error);
    }
};


export { createPokemonTable, resetPokemonTable, insertPokemon };



////////////////////////////////////////////////////////////////
//++++++++++++++++ Ability Database Functions ++++++++++++++++//
////////////////////////////////////////////////////////////////


// Function to check and create an Abilities table
const createAbilitiesTable = (database) => {
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
const resetAbilitiesTable = (database) => {
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
const insertAbility = async (database, abilityData) => {
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