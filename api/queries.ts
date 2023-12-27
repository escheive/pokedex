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