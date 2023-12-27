import { gql } from "@apollo/client";

export const updatedEntityFavoriteFragment = gql`
  fragment UpdatedEntityFavoriteFragment on ${entityType} {
    isFavorited
  }
`;

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