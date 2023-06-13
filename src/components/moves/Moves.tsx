import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// Utils
import { capitalizeString } from '../../utils/helpers';
import { getTypeStyle } from '../../utils/typeStyle';


const Moves = ({ parsedMoves, movesData, damageClasses, typeOfMove, isLoading }) => {

    const typeOfMoves = parsedMoves.filter((move) => move.learnMethod === typeOfMove);

    const typeOfMovesData = typeOfMoves.map((move) => {
        const moveData = movesData.find((data) => data.name === move.name);
        const levelLearnedAt = move.levelLearnedAt;
        return moveData ? { ...moveData, level: levelLearnedAt } : null;
    });

    const sortedMovesData = typeOfMovesData.sort((a, b) => a.level - b.level);

    const styles = StyleSheet.create({
        screenContainer: {
            height: '100%',
        },
        contentContainer: {
            backgroundColor: 'white',
        },
        movesLegend: {
            paddingHorizontal: 3,
            backgroundColor: '#eee',
            paddingVertical: 8,
            flexDirection: 'row',
        },
        movesLegendTopRow: {
            paddingVertical: 8,
            flexDirection: 'row',
        },
        movesLegendBottomRow: {
            paddingVertical: 3,
            flexDirection: 'row',
        },
        moveLevel: {
            width: '10%',
            textAlign: 'center',
            fontWeight: 'bold',
        },
        moveName: {
            width: '45%',
            textAlign: 'center',
            paddingRight: 30,
            fontWeight: 'bold',
        },
        movePP: {
            width: '15%',
            textAlign: 'center',
            fontWeight: 'bold',
        },
        moveAccuracy: {
            width: '15%',
            textAlign: 'center',
            fontWeight: 'bold',
        },
        movePower: {
            width: '15%',
            textAlign: 'center',
            fontWeight: 'bold',
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
        movesClass: {
            width: '20%',
            textAlign: 'center',
            borderRadius: 12,
            marginHorizontal: 2,
            fontWeight: 'bold',
        },
        movesContest: {
            width: '20%',
            textAlign: 'center',
            borderRadius: 12,
            padding: 1,
            marginHorizontal: 2,
            fontWeight: 'bold',
        },
        movesName: {
            fontSize: 16,
            textAlign: 'center',
            paddingRight: 30,
            width: '45%',
            fontWeight: 'bold',
        },
        movesType: {
            textAlign: 'center',
            fontWeight: 'bold',
            width: '54%',
            borderRadius: 12,
            paddingHorizontal: 9,
            marginHorizontal: 4,
        }
    });

    return (
        <ScrollView style={styles.screenContainer}>
            <View style={styles.movesLegend}>
                <Text style={styles.moveLevel}>Level</Text>
                <Text style={styles.moveName}>Name</Text>
                <Text style={styles.movePP}>PP</Text>
                <Text style={styles.moveAccuracy}>Accuracy</Text>
                <Text style={styles.movePower}>Power</Text>
            </View>
            <View style={styles.contentContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    sortedMovesData.map((item) => (
                        <View key={item?.name} style={styles.individualMoveContainer}>
                            <View style={styles.moveInfoRow}>
                                <Text style={styles.moveLevel}>{item.level}</Text>
                                <Text style={styles.movesName}>{capitalizeString(item.name)}</Text>
                                <Text style={styles.movePP}>{item.pp}</Text>
                                <Text style={styles.moveAccuracy}>{item.accuracy}</Text>
                                <Text style={styles.movePower}>{(item.power ? item.power : '-' )}</Text>

                            </View>
                            <View style={styles.moveInfoRow}>
                                <Text style={[styles.movesType, { backgroundColor: getTypeStyle(item.type.name).backgroundColor }]}>{capitalizeString(item.type.name)}</Text>
                                <Text style={[styles.movesClass, { backgroundColor: damageClasses[item.damage_class.name].background, color: damageClasses[item.damage_class.name].font } ]}>{capitalizeString(item.damage_class.name)}</Text>
                                <Text style={styles.movesContest}>{(item.contest_type.name ? capitalizeString(item.contest_type.name) : '-')}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

export default Moves;