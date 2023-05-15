
// Function to fetch additional data about a pokemon
const fetchAdditionalData = async (pokemonId, pokemonAbilities) => {

    try {
        // Declare an empty object to store all returned data
        const pokedexObject = {};
        // Fetch pokedex information for the pokemon
        const pokedexInfoResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        // Parse the fetched data
        const pokedexInfoData = await pokedexInfoResponse.json();

        // Using the parsed data, find the english genus/pokemon species
        const species = (pokedexInfoData.genera.find((genus) => genus.language.name === "en")).genus; // Find the english version of the pokemon genus
        // Initializing a variable that is defaulting to no description available for this pokemon
        let englishFlavorTexts = "There is no description for this pokemon :("
        // If there is information available, lets get it
        if (pokedexInfoData.flavor_text_entries.length != null) {
            // redefine our variable as an array of all available english flavor texts
            englishFlavorTexts = pokedexInfoData.flavor_text_entries.filter((flavor) => flavor.language.name === "en"); // Grab all the english flavor_text entries
        }

        // Declare the key 'flavorText' in our pokemonObject, equal to our englishFlavorTexts variable
        pokedexObject.flavorText = englishFlavorTexts;
        // Assign the key 'genus' in our pokedexObject equal to our species variable
        pokedexObject.genus = species;


        // TODO: process pokedexInfoData
        // Grab all the urls from our pokemons ability data to fetch descriptions
        const abilityUrls = pokemonAbilities.map((ability) => ability.ability.url)

        // Function that fetches descriptions about the pokemons abilities
        async function fetchAbilityData() {
            // Initialize an empty array to store our abilities
            const abilitiesInformation = [];
            // Loop through the pokemons urls
            for (const url of abilityUrls) {
                // Fetch the corresponding information for the url
                const response = await fetch(url);
                // Parse that fetched information
                const data = await response.json();
                // Grab an english description for the ability. Here we just take the first one found
                const abilityDescription = await data.flavor_text_entries.find((description) => description.language.name === "en")
                // The description is paired with the name in an object
                const abilityData = { "name": data.name, "description": abilityDescription.flavor_text };
                // The ability object is now pushed to our abilitiesInformation array
                abilitiesInformation.push(abilityData)
            }
            // Define the key 'abilities' in our pokedexObject equal to abilitiesInformation array
            pokedexObject.abilities = abilitiesInformation;
        }
        // Call our fetchAbilityData function above
        await fetchAbilityData();

        // TODO: process abilitiesData
        console.log(pokedexObject)
        // TODO: Swap the return for a set function so that we may update a useState
        // return the fetched data
        return {
            pokedexInfo: pokedexObject,
        };
    } catch (error) {
        console.error('Error fetching additional data for Pokemon', error);
        return null;
    }
};

export { fetchAdditionalData };




// Function to fetch the ability information as abilities are stored in a separate part of the PokeApi
const fetchAbility = async (ability, setPokemonAbilities) => {
    // Fetch the url provided for the pokemons ability in the pokemon info
    const abilityDefinitionResponse = await fetch(ability.ability.url);
    // assign the returned json to a variable so that it can be handled
    const abilityDefinition = await abilityDefinitionResponse.json();

    // Because not all abilities are formatted the same, this function will only return the english definition.
    const getEnglishAbilityDescription = () => {
        // Loop through all of the keys in effect_entries
        for (const entry of abilityDefinition.effect_entries) {
            // If the entry language is english, return data
            if (entry.language.name == "en") {
                return entry.short_effect;
            }
        };
        // If not english definition exists, return undefined
        return undefined;
    };

    // Assign the return of the above function as a variable
    const effect_entries = getEnglishAbilityDescription();
    // Capitalize the ability name
    const abilityName = ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1);
    // assign the ability's name which is part of our original pokemon info, and the newly returned description as an object
    const abilityData = { name: abilityName, definition: effect_entries }
    // Updated our abilities state by combining any previous info stored with our new info
    setPokemonAbilities((prevAbilities) => [...prevAbilities, abilityData]);
};

export { fetchAbility };


// Function to map through the pokemon abilities and then run fetchAbility function to grab the definitions for each
const fetchAbilityData = async (pokemonAbilities, abilities, setPokemonAbilities) => {
    if (pokemonAbilities.length < abilities.length) {
        const promises = abilities.map((ability) => fetchAbility(ability, setPokemonAbilities));
        const result = await Promise.all(promises);
    }
};

export { fetchAbilityData };


// Function to grab pokedex entry
// const getPokedexEntry = async (setPokedexEntry, species) => {
//     try {
//         const pokedexSpeciesDataResponse = await fetch(species.url);
//         const pokedexSpeciesData = await pokedexSpeciesDataResponse.json();
//
//         const getEnglishPokedexEntry = (entryType) => {
//             return new Promise((resolve, reject) => {
//                 let entries;
//                 if (entryType === "flavor_text") {
//                     entries = pokedexSpeciesData.flavor_text_entries;
//                 } else if (entryType === "genus") {
//                     entries = pokedexSpeciesData.genera;
//                 } else {
//                     reject("Invalid entry type");
//                 }
//
//                 for (const entry of entries) {
//                     if (entry.language.name === 'en') {
//                         resolve(entry[entryType].replace(/[\n\f]/g, " "));
//                     }
//                 }
//                 reject("No english pokedex entry found");
//             });
//         };
//
//         const correctSpacing = (string) => {
//             if (species.name === 'golduck') {
//                 string = string.replace(' m', 'm')
//             }
//             return string
//         }
//
//         const englishPokedexGenus = await getEnglishPokedexEntry("genus");
//
//         let pokedexHabitat = "None";
//         if (pokedexSpeciesData.habitat !== null) {
//             let pokedexHabitat = pokedexSpeciesData.habitat.name;
//             pokedexHabitat = pokedexHabitat.charAt(0).toUpperCase() + pokedexHabitat.slice(1);
//         }
//
//         let englishPokedexFlavorText = "There is no flavor text for this pokemon";
//         if (pokedexSpeciesData.flavor_text_entries.length > 0) {
//             englishPokedexFlavorText = await getEnglishPokedexEntry("flavor_text");
//             englishPokedexFlavorText = await correctSpacing(englishPokedexFlavorText)
//         }
//
//         const evolvesFrom = pokedexSpeciesData.evolves_from_species;
//
//         setPokedexEntry({ genus: englishPokedexGenus, flavorText: englishPokedexFlavorText, habitat: pokedexHabitat, evolvesFrom : evolvesFrom });
//     } catch (error) {
//         throw error;
//     }
// };

const getPokedexEntry = async (setPokedexEntry, species) => {
    try {
        const pokedexSpeciesDataResponse = await fetch(species.url);
        const pokedexSpeciesData = await pokedexSpeciesDataResponse.json();

        const getEnglishPokedexEntry = (entryType) => {

            const entries = pokedexSpeciesData[entryType];
            let englishEntry;

            if (entryType === "flavor_text_entries") {
                englishEntry = entries.find((entry) => entry.language.name === 'en' && entry.version.name === 'emerald');
                englishEntry = englishEntry.flavor_text.replace(/[\n\f]/g, ' ');
            } else if (entryType === "genera") {
                englishEntry = entries.find((entry) => entry.language.name === 'en');
                englishEntry = englishEntry.genus
            }

            if (englishEntry) {
                return englishEntry
            } else {
                throw new Error('No English pokedex entry found');
            }
        };

        const correctSpacing = (string) => {
            if (species.name === 'golduck') {
                return string.replace(' m', 'm');
            }
            return string;
        };


        const englishPokedexGenus = await getEnglishPokedexEntry('genera');

        let pokedexHabitat = 'None';
        if (pokedexSpeciesData.habitat !== null) {
            pokedexHabitat = pokedexSpeciesData.habitat.name;
            pokedexHabitat = pokedexHabitat.charAt(0).toUpperCase() + pokedexHabitat.slice(1);
        }

        let englishPokedexFlavorText = 'There is no flavor text for this pokemon';
        if (pokedexSpeciesData.flavor_text_entries.length > 0) {
            englishPokedexFlavorText = await getEnglishPokedexEntry('flavor_text_entries');
            englishPokedexFlavorText = correctSpacing(englishPokedexFlavorText);
        }

        const evolvesFrom = pokedexSpeciesData.evolves_from_species;

        setPokedexEntry({ genus: englishPokedexGenus, flavorText: englishPokedexFlavorText, habitat: pokedexHabitat, evolvesFrom });
    } catch (error) {
        throw error;
    }
};


export { getPokedexEntry };