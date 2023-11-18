export interface InitialPokemon {
  id: number;
  name: string;
};

interface Ability {
  name: string;
  url: string;
};

interface AbilitySlot {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
};

interface Forms {
  name: string;
  url: string;
};

interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
};

interface HeldItem {
  item: {
    name: string;
    url: string;
  };
  version_details: {
    rarity: number;
    version: {
      name: string;
      url: string;
    };
  }[];
};

interface MoveDetail {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }[];
};

interface PastAbility {
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  generation: {
    name: string;
    url: string;
  };
}

interface PastType {
  generation: {
    name: string;
    url: string;
  };
  types: Type[];
}

interface Species {
  name: string;
  url: string;
};

interface SpriteVersion {
  back_default?: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
  front_default?: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
};

interface SpriteOther {
  dream_world: {
    front_default?: string | null;
    front_female?: string | null;
  };
  home: {
    front_default?: string | null;
    front_female?: string | null;
    front_shiny?: string | null;
    front_shiny_female?: string | null;
  };
  official_artwork: {
    front_default?: string | null;
    front_shiny?: string | null;
  };
};

interface SpriteGeneration {
  [generation: string]: {
    [version: string]: {
      back_default?: string | null;
      back_gray?: string | null;
      back_transparent?: string | null;
      front_default?: string | null;
      front_gray?: string | null;
      front_transparent?: string | null;
    };
  };
};

interface Sprite {
  back_default?: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
  front_default?: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
  other: SpriteOther;
  versions: SpriteGeneration;
};

interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export interface Pokemon {
  abilities: AbilitySlot[];
  base_experience?: number | null;
  forms: Forms[];
  game_indices: GameIndex[];
  height: number;
  held_items: HeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: MoveDetail[];
  name: string;
  order: number;
  past_abilities: PastAbility[];
  past_types: PastType[];
  species: any;
  sprites: Sprite;
  stats: Stat[];
  types: Type[];
  weight: number;
};