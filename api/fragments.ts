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

export const pokemonDetailsFragment = gql`
  fragment PokemonDetailsFragment on pokemon_v2_pokemon {
    id
    weight
    height
    base_experience
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemonabilities {
      pokemon_v2_ability {
        id
        name
        pokemon_v2_abilityeffecttexts(limit: 1, order_by: {pokemon_v2_ability: {generation_id: desc}}, where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
          effect
          short_effect
        }
        pokemon_v2_abilityflavortexts(limit: 1, order_by: {version_group_id: desc}, where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
          flavor_text
        }
      }
    }
    pokemon_v2_pokemonspecy {
      base_happiness
      is_baby
      is_legendary
      is_mythical
      pokemon_v2_evolutionchain {
        pokemon_v2_pokemonspecies {
          name
          id
          evolves_from_species_id
          pokemon_v2_pokemonevolutions {
            pokemon_v2_evolutiontrigger {
              name
            }
            evolution_item_id
            min_level
            time_of_day
            needs_overworld_rain
          }
        }
      }
      pokemon_v2_pokemonhabitat {
        name
      }
    }
  }
`;