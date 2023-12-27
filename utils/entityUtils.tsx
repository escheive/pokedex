import { gql } from "@apollo/client";
import { EntityType, ApolloClientMethods } from "types";

// toggleFavorite type definitions
interface ToggleFavorite {
  entityType: EntityType,
  entity: any,
  apolloClient: ApolloClientMethods
};

// Function that takes a type of entity, the entity, and apolloClient, and updates its favorite status
export const toggleFavorite = ({ entityType, entity, apolloClient }: ToggleFavorite ) => {
  console.log(entity)

  // Edit the entity list by accessing it in cache by id and edit only what we need to with fragment
  apolloClient.writeFragment({
    id: `${entityType}:${entity.id}`,
    fragment: gql`
      fragment UpdatedEntityFavoriteFragment on ${entityType} {
        isFavorited
      }
    `,
    data: {
      __typename: `${entityType}`,
      isFavorited: !entity.isFavorited
    },
  })
};