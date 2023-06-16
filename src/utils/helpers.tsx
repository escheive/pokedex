

const capitalizeString = (string) => {
    if (typeof string === 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else if (typeof string === 'object' && string !== null) {
        return string.name.charAt(0).toUpperCase() + string.name.slice(1);
    }
}

export { capitalizeString };

// Grab id from PokeApi url
const grabIdFromPokeApiUrl = (string) => {
    // Deconstruct the url by splitting it at each /
    const urlParts = string.split('/');
    // Now we just grab the id number which will be the located at this index in urlParts
    const id = urlParts[urlParts.length-2];

    return id;
}

export { grabIdFromPokeApiUrl };

// Function to darken a pokemon color
const darkenColor = (color) => {
    // Parse the RGBA values
    const [r, g, b, a] = color.match(/\d+/g).map(Number);

    // Darken the colors by reducing its brightness
    const darkenedColor = `rgba(
        ${Math.floor(r * 0.8)},
        ${Math.floor(g * 0.8)},
        ${Math.floor(b * 0.8)},
        ${a},
    )`;

    return darkenedColor;
}

export { darkenColor };