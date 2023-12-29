import { gql } from "@apollo/client";

export const updatedPokemonFavoriteFragment = gql`
  fragment UpdatedPokemonFavorite on pokemon_v2_pokemon {
    isFavorited
  }
`;

export const updatedPokemonCaughtFragment = gql`
  fragment UpdatedPokemonCaught on pokemon_v2_pokemon {
    isCaught
  }
`;

export const updatedAbilityFavoriteFragment = gql`
  fragment UpdatedAbilityFavorite on pokemon_v2_ability {
    isFavorited
  }
`;

export const updatedItemFavoriteFragment = gql`
  fragment UpdatedItemFavorite on pokemon_v2_item {
    isFavorited
  }
`;

export const pokemonFragment = gql`
  fragment PokemonFragment on pokemon_v2_pokemon {
    id
    name
    isFavorited @client
    isCaught @ client
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
        id
      }
    }
  }
`;