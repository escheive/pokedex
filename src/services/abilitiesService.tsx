import { database } from '../utils/database/database';
import { createAbilitiesTable, insertAbility } from '../utils/database/abilitiesDatabase';
// Redux
import { useDispatch } from 'react-redux';
import { fetchAbilitiesRequest, fetchAbilitiesSuccess, fetchAbilitiesFailure } from '../actions/abilitiesActions';

// Function to fetch base abilities data from the api
const fetchAbilitiesFromApi = async (start, end) => {
    console.log('fetchingAbilitiesFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/ability?limit=${end - start}&offset=${start}`);
        const data = await response.json();

        const abilityUrls = data.results.map((ability) => ability.url);
        const abilityData = await Promise.all(abilityUrls.map((url) => fetch(url).then((response) => response.json())));

        const modifiedAbilityData = await Promise.all(abilityData.map(async(ability) => {
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
        return modifiedAbilityData;

    } catch (error) {
        console.error('Error in fetchAbilitiesFromAPI function', error);
    }
};

// Function to fetch ability data from database or api
const fetchAbilitiesData = () => {
  console.log('fetchAbilitiesData function hit');
  return async (dispatch) => {
    dispatch(fetchAbilitiesRequest());

    try {
      // Wait for the table creation process to complete
      await createAbilitiesTable();

      const totalCount = 298;
      const start = 0;
      const end = 298;

      const fetchedAbilitiesData = await new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
            [start, end],
            (tx, result) => {
              const abilitiesData = [];
              if (result.rows.length > 0) {
                for (let i=0; i<result.rows.length; i++) {
                  fetchedAbilitiesData.push(result.rows.item(i));
                }
              }
              resolve(result.rows.length > 0);
            },
            (error) => {
              console.error('Error checking Ability data in the fetchAbilitiesData function, hasData subsection:', error);
              reject(error);
            }
          );
        });
      });

      if (!fetchedAbilitiesData.length) {
        // set loading phase so that loading screen updates
        const apiData = await fetchAbilitiesFromApi(start, end);
        // Insert fetched ability into database
        await insertAbility(apiData);
        // Push fetched abilities into our fetchedAbilitiesData array
        fetchedAbilitiesData.push(...apiData);
      }

      console.log('Successfully fetched data in the fetchAbilitiesData function');
      dispatch(fetchAbilitiesSuccess(fetchedAbilitiesData));
    } catch(error) {
      console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
      dispatch(fetchAbilitiesFailure(error));
    }
  };
};
// // Function to fetch ability data from database or api
// const fetchAbilitiesData = () => {
//     console.log('fetchAbilitiesData function hit');
//     return async (dispatch) => {
//         dispatch(fetchAbilitiesRequest());
//         try {
//             // Wait for the table creation process to complete
//             createAbilitiesTable()
//               .then(async () => {
//
//                 const totalCount = 298;
//                 const batchSize = 20;
//                 const batches = Math.ceil(totalCount / batchSize);
//                 const fetchedAbilitiesData = [];
//
//                 const start = 0;
//                 const end = 298;
//
//                 const hasData = await new Promise((resolve, reject) => {
//                     database.transaction((tx) => {
//                         tx.executeSql(
//                             `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
//                             [start, end],
//                             (tx, result) => {
//                                 if (result.rows.length > 0) {
//                                     for (let i=0; i<result.rows.length; i++) {
//                                         fetchedAbilitiesData.push(result.rows.item(i));
//                                     }
//                                 }
//                                 resolve(result.rows.length > 0);
//                             },
//                             (error) => {
//                                 console.error('Error checking Ability data in the fetchAbilitiesData function, hasData subsection:', error);
//                                 reject(error);
//                             }
//                         );
//                     });
//                 });
//
//                 if (!hasData) {
//                     // set loading phase so that loading screen updates
//                     const fetchedData = await fetchAbilitiesFromAPI(start, end);
//                     fetchedAbilitiesData.push(...fetchedData);
//                     await insertAbility(fetchedData);
//                 }
//
//                 console.log('Successfully fetched data in the fetchAbilitiesData function');
//                 dispatch(fetchAbilitiesSuccess(fetchedAbilitiesData));
//             })
//               .catch((error) => {
//                 console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
//                 dispatch(fetchAbilitiesFailure(error));
//             });
//         } catch (error) {
//             console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
//             dispatch(fetchAbilitiesFailure(error));
//         }
//     };
// };

export { fetchAbilitiesData, fetchAbilitiesFromApi };