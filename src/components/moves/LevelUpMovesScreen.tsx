import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
// Utils
import { capitalizeString } from '../../utils/helpers';
import { getTypeStyle } from '../../utils/typeStyle';


const LevelUpMovesScreen = ({ pokemon, movesData, damageClasses }) => {

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
            <View style={styles.movesLegend}>
                <Text style={styles.moveLevel}>Level</Text>
                <Text style={styles.moveName}>Move</Text>
                <Text style={styles.movePP}>PP</Text>
                <Text style={styles.moveAccuracy}>Accuracy</Text>
                <Text style={styles.movePower}>Power</Text>
            </View>
            <FlatList
                data={sortedMovesData}
//                 data={pokemon.moves.filter(move => move.version_group_details[0].move_learn_method.name === 'level-up')}
                keyExtractor={(move) => move?.name}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => (
                    <View style={styles.individualMoveContainer}>
                        <View style={styles.moveInfoRow}>
                            <Text style={styles.moveLevel}>{item.level}</Text>
                            <Text style={styles.movesName}>{capitalizeString(item.name)}</Text>
                            <Text style={styles.movePP}>{item.pp}</Text>
                            <Text style={styles.moveAccuracy}>{item.accuracy}</Text>
                            <Text style={styles.movePower}>{(item.power ? item.power : '-' )}</Text>

                        </View>
                        <View style={styles.moveInfoRow}>
                            <Text style={[styles.movesType, { backgroundColor: getTypeStyle(item.type.name).backgroundColor }]}>{capitalizeString(item.type.name)}</Text>
                            <Text style={[styles.movesInfo, { backgroundColor: damageClasses[item.damage_class.name] }]}>{capitalizeString(item.damage_class.name)}</Text>
                            <Text style={styles.movesInfo}>{capitalizeString(item.contest_type.name)}</Text>
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
    movesLegend: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: '#ddd',
    },
    moveLevel: {
        width: '15%',
        textAlign: 'center',
    },
    moveName: {
        width: '40%',
        textAlign: 'center',
    },
    movePP: {
        width: '15%',
        textAlign: 'center',
    },
    moveAccuracy: {
        width: '15%',
        textAlign: 'center',
    },
    movePower: {
        width: '15%',
        textAlign: 'center',
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
        paddingVertical: 3,
        justifyContent: 'center',
    },
    movesInfo: {
        width: '20%',
        textAlign: 'center',
        borderRadius: 12,
        marginHorizontal: 2,
    },
    movesName: {
        fontSize: 16,
        textAlign: 'center',
        width: '40%',
    },
    movesType: {
        textAlign: 'center',
        width: '54%',
        borderRadius: 12,
        paddingHorizontal: 9,
        marginHorizontal: 4,
    }
});

export default LevelUpMovesScreen;