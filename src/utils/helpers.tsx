

const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export { capitalizeString };


//                 // Grab pokemon data using start and end variables to determine which ones are being fetched
//                 const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
//                 // parse the data
//                 const data = await response.json();
//
//                 const pokemonUrls = data.results.map((pokemon) => pokemon.url);
//                 const pokemonData = await Promise.all(pokemonUrls.map((url) => fetch(url).then((response) => response.json())));
//
//                 // Store the data in the db
//                 pokemonData.forEach((pokemon) => insertPokemon(pokemon));
//
//                 setPokemonList((prevList) => [...prevList, ...pokemonData]);
//                 setIsLoading(false);
//
//                 // Fetch the remaining pokemon in the background
//                 const remainingPokemons = 100 - end; // Total number of pokemon - initial batch
//                 const batchSize = 30;
//
//                 // If there are still unfetched pokemon, keep going
//                 if (remainingPokemons > 0) {
//                     // nextStart will be set to the current end so that we can start with the very next pokemon
//                     const nextStart = end;
//                     // nextEnd will be calculated based on current end and batchSize
//                     const nextEnd = Math.min(end + batchSize, 100);
//                     // fetch the pokemon using the updated variables
//                     fetchPokemonData(nextStart, nextEnd);
//                 }
//             } catch (error) {
//                 console.error(`Error fetching pokemon data for range ${start} - ${end}:`, error)
//             }
//         };