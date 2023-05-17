

import { View, FlatList, Text, StyleSheet } from 'react-native';


const TutorMovesScreen = ({pokemon}) => {

    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={pokemon.moves.filter(move => move.method === 'level-up')}
                keyExtractor={(move) => move.move.name}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                    <View style={styles.individualMoveContainer}>
                    <Text style={styles.moves}>{item.move.name.charAt(0).toUpperCase() + item.move.name.slice(1)}</Text>
                    </View>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    individualMoveContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    moves: {
        textAlign: 'center',
        fontSize: 20,
    },
});

export default TutorMovesScreen;