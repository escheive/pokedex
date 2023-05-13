
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
const getPokedexEntry = async (setPokedexEntry, species) => {
    try {
        const pokedexSpeciesDataResponse = await fetch(species.url);
        const pokedexSpeciesData = await pokedexSpeciesDataResponse.json();

        const getEnglishPokedexEntry = (entryType) => {
            return new Promise((resolve, reject) => {
                let entries;
                if (entryType === "flavor_text") {
                    entries = pokedexSpeciesData.flavor_text_entries;
                } else if (entryType === "genus") {
                    entries = pokedexSpeciesData.genera;
                } else {
                    reject("Invalid entry type");
                }

                for (const entry of entries) {
                    if (entry.language.name === 'en') {
                        resolve(entry[entryType].replace(/[\n\f]/g, " "));
                    }
                }
                reject("No english pokedex entry found");
            });
        };

        const correctSpacing = (string) => {
            if (species.name === 'golduck') {
                string = string.replace(' m', 'm')
            }
            return string
        }

        const englishPokedexGenus = await getEnglishPokedexEntry("genus");

        let pokedexHabitat = "None";
        if (pokedexSpeciesData.habitat !== null) {
            let pokedexHabitat = pokedexSpeciesData.habitat.name;
            pokedexHabitat = pokedexHabitat.charAt(0).toUpperCase() + pokedexHabitat.slice(1);
        }

        let englishPokedexFlavorText = "There is no flavor text for this pokemon";
        if (pokedexSpeciesData.flavor_text_entries.length > 0) {
            englishPokedexFlavorText = await getEnglishPokedexEntry("flavor_text");
            englishPokedexFlavorText = await correctSpacing(englishPokedexFlavorText)
        }

        const evolvesFrom = pokedexSpeciesData.evolves_from_species;

        setPokedexEntry({ genus: englishPokedexGenus, flavorText: englishPokedexFlavorText, habitat: pokedexHabitat, evolvesFrom : evolvesFrom });
    } catch (error) {
        throw error;
    }
};

export { getPokedexEntry };