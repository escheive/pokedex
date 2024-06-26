import { gql, DocumentNode } from "@apollo/client";

export type EntityType = 'pokemon_v2_pokemon' | 'pokemon_v2_item' | 'pokemon_v2_ability' | null;

// toggleFavorite type definitions
interface ToggleFavorite {
  entityType: EntityType,
  entity: any,
  apolloClient: {
    writeFragment: (options: {
      id: string;
      fragment: DocumentNode;
      data: { __typename: string; isFavorited: boolean; };
    }) => void;
  }
};

// toggleCaught type definitions
interface ToggleCaught {
  pokemon: any,
  apolloClient: {
    writeFragment: (options: {
      id: string;
      fragment: DocumentNode;
      data: { __typename: string; isCaught: boolean; };
    }) => void;
  }
};

// Function that takes a type of entity, the entity, and apolloClient, and updates its favorite status
export const toggleFavorite = ({ entityType, entity, apolloClient }: ToggleFavorite ) => {

  // Edit the entity list by accessing it in cache by id and edit only what we need to with fragment
  apolloClient.writeFragment({
    id: `${entityType}:${entity.id}`,
    fragment: gql`
      fragment Updated${entityType}FavoriteFragment on ${entityType} {
        isFavorited
      }
    `,
    data: {
      __typename: `${entityType}`,
      isFavorited: !entity.isFavorited
    },
  })
};

// Function that takes a pokemon and apolloClient, and updates its caught status
export const toggleCaught = ({ pokemon, apolloClient }: ToggleCaught ) => {

  // Edit the pokemon list by accessing it in cache by id and edit only what we need to with fragment
  apolloClient.writeFragment({
    id: `pokemon_v2_pokemon:${pokemon.id}`,
    fragment: gql`
      fragment UpdatedEntityCaughtFragment on pokemon_v2_pokemon {
        isCaught
      }
    `,
    data: {
      __typename: `pokemon_v2_pokemon`,
      isCaught: !pokemon.isCaught
    },
  })
};