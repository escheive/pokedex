import { gql } from "@apollo/client/core";


// graphQL query for fetching all pokemon
export const POKEMON_LIST_QUERY = gql`
  query pokemonListQuery {
    pokemon_v2_pokemon {
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
  }
`;

// graphQL query for fetching a pokemons details
export const GET_POKEMON_BY_ID = gql`
  query getPokemonById($id: ID!) {
    pokemon_v2_pokemon(id: $id) {
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
  }
`;