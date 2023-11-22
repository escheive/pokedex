import axios from 'axios';
import pokeApi from '../axiosConfig';
import { database } from '../utils/database/database';
import { createAbilitiesTable, insertAbility, checkAbilitiesTableExists } from '../utils/database/abilitiesDatabase';
// Redux
import { useDispatch } from 'react-redux';
import { fetchAbilitiesRequest, fetchAbilitiesSuccess, fetchAbilitiesFailure } from '../actions/abilitiesActions';

// Function to fetch base abilities data from the api
const fetchAbilitiesFromApi = async () => {
  console.log('fetchAbilitiesFromApi function hit')

  try {
    const tableExists = await checkAbilitiesTableExists();
    if (!tableExists) {
      await createAbilitiesTable(); // Wait for the table creation process to complete

      const response = await pokeApi.get(`ability?limit=100000&offset=0`);
      const data = await response.data;
      const abilitiesCount = data.count;

      // Batch fetching in parallel
      const abilityData = await Promise.all(data.results.map(async (ability) => {
        const abilitiesDetailsResponse = await axios.get(ability.url);
        return abilitiesDetailsResponse.data;
      }));

      const modifiedAbilityData = await Promise.all(abilityData.map(async (ability) => {
        let modifiedAbility = ability;

        if (ability.effect_entries.length > 0) {
          const englishEffectEntries = ability.effect_entries.find((description) => description.language.name === "en");

          modifiedAbility.shortDescription = englishEffectEntries.short_effect;
          modifiedAbility.longDescription = englishEffectEntries.effect;

        };

        if (ability.pokemon.length > 0) {
          const pokemonWithAbility = await ability.pokemon.map((pokemon) => pokemon.pokemon.name)
          modifiedAbility.pokemonWithAbility = JSON.stringify(pokemonWithAbility);
        }

        return modifiedAbility;
      }));
      // Insert fetched and modified abilities from api into database
      await insertAbility(modifiedAbilityData);
      console.log('Done inserting abilities')
    }

  } catch (error) {
    console.error('Error in fetchAbilitiesFromAPI function', error);
  }
};

// // Function to fetch base abilities data from the api
// const fetchAbilitiesFromApi = async (start, end) => {
//     console.log('fetchAbilitiesFromApi function hit')
//     try {
//         const response = await pokeApi.get(`ability?limit=${end - start}&offset=${start}`);
//         const data = await response.data;
//
//         // Batch fetching in parallel
//         const abilityData = await Promise.all(data.results.map(async (ability) => {
//           const abilitiesDetailsResponse = await axios.get(ability.url);
//           return abilitiesDetailsResponse.data;
//         }));
//
//         const modifiedAbilityData = await Promise.all(abilityData.map(async (ability) => {
//             let modifiedAbility = ability;
//
//             if (ability.effect_entries.length > 0) {
//                 const englishEffectEntries = ability.effect_entries.find((description) => description.language.name === "en");
//
//                 modifiedAbility.shortDescription = englishEffectEntries.short_effect;
//                 modifiedAbility.longDescription = englishEffectEntries.effect;
//
//             };
//
//             if (ability.pokemon.length > 0) {
//                 const pokemonWithAbility = await ability.pokemon.map((pokemon) => pokemon.pokemon.name)
//                 modifiedAbility.pokemonWithAbility = JSON.stringify(pokemonWithAbility);
//             }
//
//             return modifiedAbility;
//         }));
//         return modifiedAbilityData;
//
//     } catch (error) {
//         console.error('Error in fetchAbilitiesFromAPI function', error);
//     }
// };

// Function to fetch ability data from database or api
const fetchAbilitiesDataFromApiOrDatabase = async () => {
  console.log('fetchAbilitiesData function hit');

  try {
    await createAbilitiesTable(); // Wait for the table creation process to complete

    const totalCount = 363; // total of all abilities on pokeapi
    const batchSize = 20;  // Adjust the batch size based on your needs
    const batches = Math.ceil(totalCount / batchSize);

    let fetchedAbilitiesData = [];

    // Batch fetching in series
    for (let i=0; i<batches; i++) {
      const start = i * batchSize; // Starting point for fetching abilities
      const end = Math.min((i + 1) * batchSize, totalCount); // End point for fetching abilities

      // Attempt to fetch abilities from database
      const databaseData = await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
            [start, end],
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

      // If no abilities were fetched from database
      if (!databaseData) {
        // fetch abilities from api
        const apiData = await fetchAbilitiesFromApi();
        // Insert fetched abilities from api into database
        await insertAbility(apiData);
        // Push fetched abilities into our fetchedAbilitiesData array
        fetchedAbilitiesData = fetchedAbilitiesData.concat(apiData);
      } else {
        // If abilities were fetched from database, push those into our fetchedAbilitiesData array
        fetchedAbilitiesData = fetchedAbilitiesData.concat(databaseData);
      }
    }

    console.log('Successfully fetched data in the fetchAbilitiesData function');
    return fetchedAbilitiesData;
  } catch(error) {
    console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
  }
};

export { fetchAbilitiesDataFromApiOrDatabase, fetchAbilitiesFromApi };