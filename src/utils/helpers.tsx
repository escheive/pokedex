

const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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