import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pokeGrowerIncrement } from '../actions/pokeGrowerActions';
import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity } from 'react-native';


const PokeGrowerScreen = ({ navigation }) => {

    const [shopOpen, setShopOpen] = useState(false);
    const dispatch = useDispatch();
    const pokeGrowerData = useSelector((state) => state.pokeGrower);
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    useEffect(() => {
        setInterval(() => {
            dispatch(pokeGrowerIncrement());
        }, 1000);
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.currenciesContainer}>
                <Text style={styles.currency}>{pokeGrowerData.money}</Text>
                <Text style={styles.currency}>{pokeGrowerData.income}</Text>
                <Text style={styles.currency}>{pokeGrowerData.income}</Text>
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
                        <View style={styles.shopItems}>
                            <Text style={styles.shopItem}>Shop Item 1</Text>
                        </View>
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
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      },
      shopItem: {
        fontSize: 18,
        color: 'gray',
        padding: 10,
        width: '100%',
        borderRadius: 12,
        textAlign: 'center',
        marginVertical: 30,
      },
});

export default PokeGrowerScreen;