import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites !== null) {
      return JSON.parse(favorites);
    } else {
      await AsyncStorage.setItem('favorites', JSON.stringify([]));
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addFavoritePokemon = async (pokemon) => {
  try {
    const favorites = await getFavorites();
    if (!favorites.some(pokemonObject => pokemonObject.id === pokemon.id)) {
      const updatedFavorites = [
        ...favorites,
        {
          id: pokemon.id,
          name: pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
        },
      ];
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const removeFavoritePokemon = async (pokemon) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((pokemonObject) => pokemonObject.id !== pokemon.id);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
