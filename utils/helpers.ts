const capitalizeString = (string) => {
    if (typeof string === 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else if (typeof string === 'object' && string !== null) {
        return string.name.charAt(0).toUpperCase() + string.name.slice(1);
    }
}

export { capitalizeString };