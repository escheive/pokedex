import { gql } from "@apollo/client/core";


// graphQL query for fetching all pokemons basic details
export const POKEMON_LIST_QUERY = gql`
  query pokemonListQuery {
    pokemon_v2_pokemon {
      id
      name
      isFavorited @client
      isCaught @client
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

export const POKEMON_ISFAVORITE_OR_CAUGHT_QUERY = gql`
  query pokemonIdQuery {
    pokemon_v2_pokemon {
      id
      isFavorited @client
      isCaught @client
    }
  }
`;

// graphQL query for fetching all abilities basic details
export const ABILITIES_LIST_QUERY = gql`
  query fetchAllPokemonAbilities {
    pokemon_v2_ability {
      id
      name
      pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}) {
        effect
        short_effect
      }
      pokemon_v2_abilityflavortexts(order_by: {id: desc}, limit: 1, where: {language_id: {_eq: 9}}) {
        flavor_text
      }
      pokemon_v2_pokemonabilities {
        pokemon_id
      }
    }
  }
`;

// graphQL query for fetching all items basic info
export const ITEMS_LIST_QUERY = gql`
  query getItemsListQuery {
    pokemon_v2_item {
      name
      id
      cost
      fling_power
      isFavorited @client
      pokemon_v2_itemflingeffect {
        pokemon_v2_itemflingeffecteffecttexts {
          effect
        }
      }
      pokemon_v2_itemcategory {
        name
        pokemon_v2_itempocket {
          name
        }
      }
      pokemon_v2_itemeffecttexts {
        effect
        short_effect
      }
      pokemon_v2_itemflavortexts(limit: 1, order_by: {version_group_id: desc}, where: {language_id: {_eq: 9}}) {
        flavor_text
        pokemon_v2_versiongroup {
          generation_id
        }
      }
    }
  }
`;

// graphQL query for fetching a pokemon from the pokemon list
export const GET_POKEMON_BY_ID = gql`
  query getPokemonById($id: Int!) {
    pokemon_v2_pokemon_by_pk(id: $id) {
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
  }
`;

// graphQL query for fetching all pokemons details from the api
export const POKEMON_DETAILS_LIST_QUERY = gql`
  query pokemonDetailsQuery {
    pokemon_v2_pokemon {
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
  }
`;

// graphQL query for fetching all pokemons moves from the api
export const POKEMON_MOVES_LIST_QUERY = gql`
  query pokemonMovesQuery {
    pokemon_v2_pokemon {
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
            id
          }
        }
        pokemon_v2_pokemonhabitat {
          name
        }
      }
    }
  }
`;