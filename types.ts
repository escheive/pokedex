import { DocumentNode } from "@apollo/client";

// Type definitions for Pokemon object
export interface Pokemon {
  id: number;
  name: string;
  isFavorited: boolean;
  isCaught: boolean;
  weight: number;
  height: number;
  base_experience: number;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
      id: number;
    };
  }[];
  pokemon_v2_pokemonstats: {
    base_stat:  number;
    pokemon_v2_stat: {
      name: string;
    }
  }[];
  pokemon_v2_pokemonabilities: {
    pokemon_v2_ability: {
      id: number;
      name: string;
      pokemon_v2_abilityeffecttexts: {
        effect: string;
        short_effect: string;
      }[];
      pokemon_v2_abilityflavortexts: {
        flavor_text: string;
      }[];
    }
  }[];
  pokemon_v2_pokemonspecy: {
    base_happiness: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    pokemon_v2_evolutionchain: {
      pokemon_v2_pokemonspecies: {
        name: string;
        id: number;
        evolves_from_species_id: string;
        pokemon_v2_pokemonevolutions: {
          pokemon_v2_evolutiontrigger: {
            name: string;
          }
          evolution_item_id: string;
          min_level: number;
          time_of_day: string;
          needs_overworld_rain: boolean;
        }
      }
    }
    pokemon_v2_pokemonhabitat: {
      name: string;
    }
  }
};

// Type definitions for filterOptions useState in pokemon page and filter drawer component
export interface FilterOptions {
  showFavorites: boolean;
  showCaughtPokemon: boolean;
  selectedVersions: {
   [key: string]: any;
  }[];
  selectedTypes: {
    [key: string]: any;
  }[];
  searchQuery: string;
  filterByDualTypes: boolean;
}