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
        "alternateBackgroundColor": 'rgba(64, 64, 64, 0.9)',
        "color": "#F5F5F5",
    },
    "fire": {
        "backgroundColor": 'rgba(255, 165, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(255, 0, 0, 1)',
        "color": "#444"
    },
    "water": {
        "backgroundColor": 'rgba(30, 144, 255, 0.5)',
        "alternateBackgroundColor": 'rgba(0, 0, 255, 1)',
        "color": "#F5F5F5"
    },
    "grass": {
        "backgroundColor": 'rgba(0, 128, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(10, 90, 60, 1)',
        "color": "#F5F5F5"
    },
    "electric": {
        "backgroundColor": 'rgba(255, 255, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(180, 130, 0, 1)',
        "color": "#444"
    },
    "ice": {
        "backgroundColor": 'rgba(0, 255, 255, 0.5)',
        "alternateBackgroundColor": 'rgba(0, 150, 130, 1)',
        "color": "#444"
    },
    "fighting": {
        "backgroundColor": 'rgba(255, 0, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(125, 0, 0, 1)',
        "color": "#F5F5F5"
    },
    "poison": {
        "backgroundColor": 'rgba(128, 0, 128, 0.5)',
        "alternateBackgroundColor": 'rgba(80, 0, 110, 1)',
        "color": "#F5F5F5"
    },
    "ground": {
        "backgroundColor": 'rgba(165, 42, 42, 0.5)',
        "alternateBackgroundColor": 'rgba(90, 20, 0, 1)',
        "color": "#F5F5F5"
    },
    "flying": {
        "backgroundColor": 'rgba(135, 206, 235, 0.5)',
        "alternateBackgroundColor": 'rgba(50, 110, 180, 1)',
        "color": "#444"
    },
    "psychic": {
        "backgroundColor": 'rgba(245, 42, 183, 0.5)',
        "alternateBackgroundColor": 'rgba(100, 0, 130, 1)',
        "color": "#444"
    },
    "bug": {
        "backgroundColor": 'rgba(0, 255, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(34, 130, 34, 1)',
        "color": "#444"
    },
    "rock": {
        "backgroundColor": 'rgba(160, 82, 45, 0.5)',
        "alternateBackgroundColor": 'rgba(99, 49, 15, 1)',
        "color": "#F5F5F5"
    },
    "ghost": {
        "backgroundColor": 'rgba(238, 130, 238, 0.5)',
        "alternateBackgroundColor": 'rgba(135, 100, 200, 1)',
        "color": "#F5F5F5"
    },
    "dragon": {
        "backgroundColor": 'rgba(75, 0, 130, 0.5)',
        "alternateBackgroundColor": 'rgba(60, 0, 80, 1)',
        "color": "#F5F5F5"
    },
    "dark": {
        "backgroundColor": 'rgba(0, 0, 0, 0.5)',
        "alternateBackgroundColor": 'rgba(25, 25, 112, 0.8)',
        "color": "#F5F5F5"
    },
    "steel": {
        "backgroundColor": 'rgba(192, 192, 192, 0.5)',
        "alternateBackgroundColor": 'rgba(139, 139, 139, 1)',
        "color": "#444"
    },
    "fairy": {
        "backgroundColor": 'rgba(255, 92, 255, 0.5)',
        "alternateBackgroundColor": 'rgba(255, 230, 255, 0.9)',
        "color": "#F5F5F5"
    },
}

export { pokemonColors }