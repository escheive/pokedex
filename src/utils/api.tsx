
// Function to fetch base pokemon data from the api
const fetchPokemonFromAPI = async (start, end) => {
    console.log('fetchingPokemonFromAPI function hit')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
        const data = await response.json();

        const pokemonUrls = data.results.map((pokemon) => pokemon.url);
        const pokemonData = await Promise.all(pokemonUrls.map((url) =>fetch(url).then((response) => response.json())));
//         const pokemonData = await Promise.all(
//             pokemonUrls.map((url) =>
//                 fetch(url)
//                     .then((response) => response.json())
//                     .then((pokemon) => {
//                         pokemon.stats = JSON.stringify(pokemon.stats);
//                         return pokemon;
//                     })
//             )
//         );

        return pokemonData;

//         await insertPokemon(pokemonData);

        // Call the callback function with the fetched data
//         callback(pokemonData);
    } catch (error) {
        console.error('Error in fetchPokemonFromAPI function', error);
    }
};

export { fetchPokemonFromAPI };



// Function to fetch base pokemon data from database or api
const fetchPokemonData = async ( database, createPokemonTable, insertPokemon, setIsLoading, setPokemonList ) => {
    console.log('fetchPokemonData function hit');
    try {
        // Wait for the table creation process to complete
        await createPokemonTable(database);

        const totalCount = 1010;
        const batchSize = 20;
        const batches = Math.ceil(totalCount / batchSize);
        const fetchedPokemonData = [];

        for (let batch=0; batch < batches; batch++) {
            const start = batch * batchSize;
            const end = start + batchSize;

            const hasData = await new Promise((resolve, reject) => {
                setIsLoading("Loading Pokemon");
                database.transaction((tx) => {
                    tx.executeSql(
                        `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
                        [start, end],
                        (tx, result) => {
                            if (result.rows.length > 0) {
                                for (let i=0; i<result.rows.length; i++) {
                                    fetchedPokemonData.push(result.rows.item(i));
                                }
                            }
                            resolve(result.rows.length > 0);
                        },
                        (error) => {
                            console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
                            reject(error);
                        }
                    );
                });
            });

            if (!hasData) {
                // set loading phase so that loading screen updates
                setIsLoading("Fetching Pokemon data from the API");
                const fetchedData = await fetchPokemonFromAPI(start, end);
                fetchedPokemonData.push(...fetchedData);
                await insertPokemon(database, fetchedData);
            }
        }

        console.log('Successfully fetched data in the fetchPokemonData function');

        setPokemonList((prevList) => {
            const mergedList = [...prevList, ...fetchedPokemonData];
            const uniqueList = Array.from(
                new Set(mergedList.map((pokemon) => pokemon.id))).map((id) =>
                    mergedList.find((pokemon) => pokemon.id === id)
            );
            return uniqueList
        });

//         setIsLoading(false);
    } catch (error) {
        console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
    }
};

export { fetchPokemonData };