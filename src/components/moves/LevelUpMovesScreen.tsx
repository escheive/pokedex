import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
// Utils
import { capitalizeString } from '../../utils/helpers';


const LevelUpMovesScreen = ({ pokemon, movesData }) => {

    const levelUpMoves = pokemon.moves.filter((move) => {
        return move.version_group_details.some(
            (detail) => detail.move_learn_method.name === 'level-up'
        );
    });

    const levelUpMovesData = levelUpMoves.map((move) => {
        const moveData = movesData.find((data) => data.name === move.move.name);
        let levelLearnedAt = move.version_group_details.find((move) => move.level_learned_at > 0)
        levelLearnedAt = levelLearnedAt.level_learned_at;
        return moveData ? { ...moveData, level: levelLearnedAt } : null;
    });

    const sortedMovesData = levelUpMovesData.sort((a, b) => a.level - b.level);

    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={sortedMovesData}
//                 data={pokemon.moves.filter(move => move.version_group_details[0].move_learn_method.name === 'level-up')}
                keyExtractor={(move) => move?.name}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => (
                    <View style={styles.individualMoveContainer}>
                        <View style={styles.moveInfoRow}>
                            <Text style={styles.moves}>{item.level}</Text>
                            <Text style={styles.moves}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                            <Text style={styles.moves}>{capitalizeString(item.type.name)}</Text>
                        </View>
                        <View style={styles.moveInfoRow}>
                            <Text style={styles.moves}>{capitalizeString(item.damage_class.name)}</Text>
                            <Text style={styles.moves}>{item.accuracy}</Text>
                            <Text style={styles.moves}>{item.pp}</Text>
                            <Text style={styles.moves}>{capitalizeString(item.contest_type.name)}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    screenContainer: {
        height: '100%',
        marginHorizontal: 10,
    },
    contentContainer: {
        backgroundColor: 'white',
    },
    individualMoveContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 10,
        borderColor: '#ccc',
        borderBottomWidth: 1,
    },
    moveInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    moves: {
        textAlign: 'center',
        fontSize: 20,
    },
});

export default LevelUpMovesScreen;