import mmkv from "./mmkvConfig";

export const toggleFavorite = (pokemonId: number) => {
  console.log("favorited: ", pokemonId)
  const favorites = mmkv.getString("favorites");
  let favoriteIds = favorites ? JSON.parse(favorites) : [];

  if (favoriteIds.includes(pokemonId)) {
    favoriteIds = favoriteIds.filter((id: any) => id !== pokemonId);
  } else {
    favoriteIds.push(pokemonId);
  }

  mmkv.set("favorites", JSON.stringify(favoriteIds));
};

export const isFavorite = (pokemonId: number) => {
  const favorites = mmkv.getString("favorites");
  const favoriteIds = favorites ? JSON.parse(favorites): [];
  return favoriteIds.includes(pokemonId);
};