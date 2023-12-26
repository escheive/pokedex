export const capitalizeString = (string: any) => {
  if (typeof string === 'string') {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else if (typeof string === 'object' && string !== null) {
    return string.name.charAt(0).toUpperCase() + string.name.slice(1);
  }
}

type PokemonColors = {
  [key: string]: {
    backgroundColor: string;
    alternateBackgroundColor: string;
    color: string;
  }
}

export const pokemonColors: PokemonColors = {
    "normal": {
        "backgroundColor": 'rgba(128, 128, 128, 0.5)',
        "alternateBackgroundColor": 'rgba(168, 168, 120, 1)',
        "color": "#F5F5F5",
    },
    "fire": {
        "backgroundColor": 'rgba(255, 165, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(240, 128, 48, 1)',
        "color": "#444"
    },
    "water": {
        "backgroundColor": 'rgba(30, 144, 255, 0.5)',
        "alternateBackgroundColor": 'rgba(104, 144, 240, 1)',
        "color": "#F5F5F5"
    },
    "grass": {
        "backgroundColor": 'rgba(0, 128, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(120, 200, 80, 1)',
        "color": "#F5F5F5"
    },
    "electric": {
        "backgroundColor": 'rgba(255, 255, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(228, 228, 38, 1)',
        "color": "#444"
    },
    "ice": {
        "backgroundColor": 'rgba(0, 255, 255, 0.5)',
        "alternateBackgroundColor": 'rgba(122, 216, 216, 1)',
        "color": "#444"
    },
    "fighting": {
        "backgroundColor": 'rgba(255, 0, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(192, 48, 40, 1)',
        "color": "#F5F5F5"
    },
    "poison": {
        "backgroundColor": 'rgba(128, 0, 128, 0.5)',
        "alternateBackgroundColor": 'rgba(160, 64, 160, 1)',
        "color": "#F5F5F5"
    },
    "ground": {
        "backgroundColor": 'rgba(165, 42, 42, 0.5)',
        "alternateBackgroundColor": 'rgba(224, 192, 104, 1)',
        "color": "#F5F5F5"
    },
    "flying": {
        "backgroundColor": 'rgba(135, 206, 235, 0.5)',
        "alternateBackgroundColor": 'rgba(108, 184, 240, 1)',
        "color": "#444"
    },
    "psychic": {
        "backgroundColor": 'rgba(245, 42, 183, 0.5)',
        "alternateBackgroundColor": 'rgba(248, 88, 136, 1)',
        "color": "#444"
    },
    "bug": {
        "backgroundColor": 'rgba(0, 255, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(178, 214, 32, 1)',
        "color": "#444"
    },
    "rock": {
        "backgroundColor": 'rgba(160, 82, 45, 0.5)',
        "alternateBackgroundColor": 'rgba(184, 160, 56, 1)',
        "color": "#F5F5F5"
    },
    "ghost": {
        "backgroundColor": 'rgba(238, 130, 238, 0.5)',
        "alternateBackgroundColor": 'rgba(112, 88, 152, 1)',
        "color": "#F5F5F5"
    },
    "dragon": {
        "backgroundColor": 'rgba(75, 0, 130, 0.5)',
        "alternateBackgroundColor": 'rgba(112, 56, 248, 1)',
        "color": "#F5F5F5"
    },
    "dark": {
        "backgroundColor": 'rgba(0, 0, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(102, 74, 66, 1)',
        "color": "#F5F5F5"
    },
    "steel": {
        "backgroundColor": 'rgba(192, 192, 192, 0.5)',
        "alternateBackgroundColor": 'rgba(184, 184, 208, 1)',
        "color": "#444"
    },
    "fairy": {
        "backgroundColor": 'rgba(255, 92, 255, 0.5)',
        "alternateBackgroundColor": 'rgba(238, 153, 172, 1)',
        "color": "#F5F5F5"
    },
}

interface TmTypeMapping {
    [key: string]: string;
  }
  
const tmTypeMapping: TmTypeMapping = {
    tm01: 'dark',
    tm02: 'dragon',
    tm03: 'psychic',
    tm04: 'psychic',
    tm05: 'normal',
    tm06: 'poison',
    tm07: 'ice',
    tm08: 'fighting',
    tm09: 'poison',
    tm10: 'normal',
    tm11: 'fire',
    tm12: 'dark',
    tm13: 'ice',
    tm14: 'ice',
    tm15: 'normal',
    tm16: 'psychic',
    tm17: 'normal',
    tm18: 'water',
    tm19: 'psychic',
    tm20: 'normal',
    tm21: 'normal',
    tm22: 'grass',
    tm23: 'rock',
    tm24: 'electric',
    tm25: 'electric',
    tm26: 'ground',
    tm27: 'normal',
    tm28: 'ground',
    tm29: 'psychic',
    tm30: 'ghost',
    tm31: 'fighting',
    tm32: 'normal',
    tm33: 'psychic',
    tm34: 'poison',
    tm35: 'fire',
    tm36: 'poison',
    tm37: 'rock',
    tm38: 'fire',
    tm39: 'rock',
    tm40: 'flying',
    tm41: 'dark',
    tm42: 'normal',
    tm43: 'electric',
    tm44: 'psychic',
    tm45: 'normal',
    tm46: 'dark',
    tm47: 'fighting',
    tm48: 'normal',
    tm49: 'normal',
    tm50: 'fire',
    tm51: 'psychic',
    tm52: 'fighting',
    tm53: 'grass',
    tm54: 'normal',
    tm55: 'water',
    tm56: 'dark',
    tm57: 'electric',
    tm58: 'flying',
    tm59: 'fire',
    tm60: 'dark',
    tm61: 'fire',
    tm62: 'flying',
    tm63: 'dark',
    tm64: 'normal',
    tm65: 'ghost',
    tm66: 'dark',
    tm67: 'normal',
    tm68: 'normal',
    tm69: 'rock',
    tm70: 'normal',
    tm71: 'rock',
    tm72: 'electric',
    tm73: 'electric',
    tm74: 'steel',
    tm75: 'normal',
    tm76: 'rock',
    tm77: 'normal',
    tm78: 'ground',
    tm79: 'ice',
    tm80: 'rock',
    tm81: 'bug',
    tm82: 'dragon',
    tm83: 'normal',
    tm84: 'poison',
    tm85: 'psychic',
    tm86: 'grass',
    tm87: 'normal',
    tm88: 'flying',
    tm89: 'bug',
    tm90: 'normal',
    tm91: 'steel',
    tm92: 'psychic',
    tm93: 'electric',
    tm94: 'fighting',
    tm95: 'dark',
    tm96: 'normal',
    tm97: 'dark',
    tm98: 'fighting',
    tm99: 'fairy',
    tm100: 'normal',
};
  
export const getTMImageUrl = (tmNumber: string) => {
  const type = tmTypeMapping[tmNumber.toLowerCase()];
  if (type) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-${type}.png`;
  } else {
    // Handle the case where the TM number is not in the mapping
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png`;
  }
};