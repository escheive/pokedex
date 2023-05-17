
import { View, FlatList, Text, StyleSheet } from 'react-native';


const LevelUpMovesScreen = ({pokemon}) => {

    console.log(pokemon.moves[0].move.name)

    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={pokemon.moves.filter(move => move.version_group_details[0].move_learn_method.name === 'level-up')}
                keyExtractor={(move) => move.move.name}
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
    screenContainer: {
        height: '100%',
        marginTop: 20,
    },
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

export default LevelUpMovesScreen;