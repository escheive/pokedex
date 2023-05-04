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
                backgroundColor: 'rgba(255, 192, 203, 0.5)',
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
                backgroundColor: 'rgba(255, 0, 255, 0.5)',
                color: 'white',
            };
        default:
            return {
                backgroundColor: 'grey',
                color: 'white',
            };
    }
};