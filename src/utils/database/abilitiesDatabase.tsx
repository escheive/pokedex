import { database } from './database';

////////////////////////////////////////////////////////////////
//++++++++++++++++ Ability Database Functions ++++++++++++++++//
////////////////////////////////////////////////////////////////


// Function to check and create an Abilities table
export const createAbilitiesTable = () => {
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

// Function to check if the Abilities table exists before performing any operations
export const checkAbilitiesTableExists = () => {
  console.log('Checking if Abilities table exists in sqlite database');

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='Abilities';`,
        [],
        (tx, result) => {
          if (result.rows.length === 0) {
            console.log("Abilities table doesn't exist");
            resolve(false);
          } else {
            console.log('Table does exist')
            resolve(true);
          }
        }
      )
    })
  })
}

// Function to drop Abilities table
export const resetAbilitiesTable = () => {
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
export const insertAbility = async (abilityData) => {
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

export const fetchAbilitiesFromDatabase = async (dispatch) => {
  console.log('fetchAbilitiesFromDatabase hit');

  try {
    // Check for table in sqlite db
    const tableExists = await checkAbilitiesTableExists();
    // If the table doesn't exist, create it
    if (!tableExists) {
      console.log("table doesn't exist");
      return null;
    } else {
      // Attempt to fetch abilities from database
      const databaseAbilitiesData = await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM Abilities;`,
            [],
            (tx, result) => {
              const abilitiesData = [];
              if (result.rows.length > 0) {
                for (let i=0; i<result.rows.length; i++) {
                  abilitiesData.push(result.rows.item(i));
                }
              }
              resolve(abilitiesData);
            },
            (error) => {
              console.error('Error fetching abilities from database:', error);
              reject(error);
            }
          );
        });
      });
      return databaseAbilitiesData;
    }
  } catch (error) {
    console.error('Error fetching abilities from database', error);
    throw error;
  }
}