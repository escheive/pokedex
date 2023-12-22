import { favoritedPokemonVar } from "./apolloConfig";
import mmkv from "./mmkvConfig";

export const toggleFavorite = (pokemonId: any) => {
  console.log("favorited: ", pokemonId)
  const currentFavorites = favoritedPokemonVar();

  const isCurrentlyFavorited = currentFavorites[pokemonId]?.isFavorited || false;
  
  const newFavorites = {
    ...currentFavorites,
    [pokemonId]: {
      isFavorited: !isCurrentlyFavorited,
    },
  };
    favoritedPokemonVar(newFavorites);
};

// export const toggleFavorite = (pokemonId: any) => {
//   console.log("favorited: ", pokemonId)
//   const currentFavorites: number[] = favoritedPokemonVar();

//   const newFavorites: any[] = currentFavorites.includes(pokemonId)
//     ? currentFavorites.filter(id => id !== pokemonId)
//     : [...currentFavorites, pokemonId];

//     favoritedPokemonVar(newFavorites);
// };

export const isFavorite = (pokemonId: number) => {
  const favorites = mmkv.getString("favorites");
  const favoriteIds = favorites ? JSON.parse(favorites): [];
  return favoriteIds.includes(pokemonId);
};