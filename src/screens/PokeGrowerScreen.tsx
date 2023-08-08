import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pokeGrowerIncrementCurrency } from '../actions/pokeGrowerActions/pokeGrowerActions';
import { purchaseUpgrade } from '../actions/pokeGrowerActions/purchaseUpgradesActions';
import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';


const PokeGrowerScreen = ({ navigation }) => {

    const [shopOpen, setShopOpen] = useState(false);
    const dispatch = useDispatch();
    const pokeGrowerData = useSelector((state) => state.pokeGrower);
    const purchasedUpgradeData = useSelector((state) => state.purchasedUpgrades);
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    const buyMoneyUpgrade = (upgrade, amount, price) => {
        const cost = price * amount;
        dispatch(pokeGrowerIncrementCurrency('money', cost))
        dispatch(purchaseUpgrade(upgrade, amount))
    }

    useEffect(() => {
        setInterval(() => {
            dispatch(pokeGrowerIncrementCurrency('money', pokeGrowerData.income));
        }, 1000);

    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.currenciesContainer}>
                <Text style={styles.currency}>{pokeGrowerData.money}</Text>
                <Text style={styles.currency}>{pokeGrowerData.income}</Text>
                <Text style={styles.currency}>{purchasedUpgradeData.pokeballs}</Text>
            </View>
            <View>
                <Text>{pokemonList[1].name}</Text>
                <Image
                    style={styles.image}
                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonList[1].id}.png` }}
                />
            </View>

            <View style={styles.openShopButton}>
                <Text
                    onPress={() => setShopOpen(true)}
                >
                    Shop
                </Text>
            </View>

            <Modal visible={shopOpen !== false} animationType="slide" transparent>
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setShopOpen(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={() => {}}
                    >
                        <Text style={styles.shopTitle}>Shop</Text>
                        <ScrollView style={styles.shopItems}>
                            <View style={styles.shopItem}>
                                <Text style={styles.shopItemName}>Pokéball</Text>
                                <View style={styles.buyButtons}>
                                    <TouchableOpacity style={styles.buyButton} onPress={() => buyMoneyUpgrade('pokeballs', 1, -5)}>
                                        <Text>X1</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buyButton}>
                                        <Text>X10</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buyButton}>
                                        <Text>X100</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buyButton}>
                                        <Text>X1000</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.shopItem}>
                                <Text style={styles.shopItemName}></Text>
                            </View>
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    currenciesContainer: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-between',
        backgroundColor: 'gray',
        marginBottom: 16,
        marginTop: 8,
        padding: 5,
        borderRadius: 16,
    },
    currency: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingHorizontal: 6,
        width: '30%',
        backgroundColor: 'black',
        borderRadius: 8,
    },
    image: {
        width: 75,
        height: 75,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    modalContent: {
        alignItems: 'center',
        backgroundColor: '#ccc',
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
      shopTitle: {
        textAlign: 'center',
        width: '100%',
        fontSize: 24,
        fontWeight: 'bold',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: 'grey',
        color: 'white',
        paddingVertical: 16,
      },
      shopItems: {
        backgroundColor: '#fff',
        width: '100%',
        paddingHorizontal: 10,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      },
      shopItem: {
        padding: 5,
        width: '100%',
        borderRadius: 12,
        textAlign: 'left',
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      shopItemName: {
        fontSize: 18,
        color: 'gray',
      },
      buyButtons: {
        flexDirection: 'row',
      },
      buyButton: {
        borderColor: 'black',
        borderWidth: 1,
      },
});

export default PokeGrowerScreen;