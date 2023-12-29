import { DocumentNode } from "@apollo/client";

export interface Pokemon {
  id: string;
  name: string;
  isFavorited: boolean;
  isCaught: boolean;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
      id: string;
    };
  }[]; 
}