// Define a function to return styles for each type
    export const getTypeStyle = (typeName: string) => {
      switch (typeName) {
        case 'normal':
            return {
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                color: 'white',
            };
        case 'fire':
            return {
                backgroundColor: 'rgba(255, 165, 0, 0.5)',
                color: 'black',
            };
        case 'water':
            return {
                backgroundColor: 'rgba(30, 144, 255, 0.5)',
                color: 'white',
            };
        case 'grass':
            return {
                backgroundColor: 'rgba(0, 128, 0, 0.5)',
                color: 'white',
            };
        case 'electric':
            return {
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                color: 'black',
            };
        case 'ice':
            return {
                backgroundColor: 'rgba(0, 255, 255, 0.5)',
                color: 'black',
            };
        case 'fighting':
            return {
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                color: 'white',
            };
        case 'poison':
            return {
                backgroundColor: 'rgba(128, 0, 128, 0.5)',
                color: 'white',
            };
        case 'ground':
            return {
                backgroundColor: 'rgba(165, 42, 42, 0.5)',
                color: 'white',
            };
        case 'flying':
            return {
                backgroundColor: 'rgba(135, 206, 235, 0.5)',
                color: 'black',
            };
        case 'psychic':
            return {
                backgroundColor: 'rgba(245, 42, 183, 0.5)',
                color: 'black',
            };
        case 'bug':
            return {
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                color: 'black',
            };
        case 'rock':
            return {
                backgroundColor: 'rgba(160, 82, 45, 0.5)',
                color: 'white',
            };
        case 'ghost':
            return {
                backgroundColor: 'rgba(238, 130, 238, 0.5)',
                color: 'white',
            };
        case 'dragon':
            return {
                backgroundColor: 'rgba(75, 0, 130, 0.5)',
                color: 'white',
            };
        case 'dark':
            return {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
            };
        case 'steel':
            return {
                backgroundColor: 'rgba(192, 192, 192, 0.5)',
                color: 'black',
            };
        case 'fairy':
            return {
                backgroundColor: 'rgba(255, 92, 255, 0.5)',
                color: 'white',
            };
        default:
            return {
                backgroundColor: 'grey',
                color: 'white',
            };
    }
};

const pokemonColors = {
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

export { pokemonColors }