import { DocumentNode } from "@apollo/client";


export type EntityType = 'pokemon_v2_pokemon' | 'pokemon_v2_item' | 'pokemon_v2_ability';

export interface ApolloClientMethods {
  writeFragment: (options: {
    id: string;
    fragment: DocumentNode;
    data: { __typename: string; isFavorited: boolean };
  }) => void;
}