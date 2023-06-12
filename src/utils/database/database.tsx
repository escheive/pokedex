// Database
import SQLite from 'react-native-sqlite-storage';


// Open the database
export const database = SQLite.openDatabase({
    name: 'Pokemon.db',
    location: 'default',
});