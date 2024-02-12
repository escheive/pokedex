// Dependencies
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Components
import { IconContainer } from 'components/card/IconContainer';
import { WebBottomSheet } from 'components/bottomSheet/WebBottomSheet';
// Utils
import { capitalizeString, pokemonColors } from 'utils/helpers';
import { useBottomSheet } from 'contexts/BottomSheetContext';


export const ListItem = React.memo(({ item, title }: any) => {
  const { snapToIndex, setItem, setItemType } = useBottomSheet();
  const [modalVisible, setModalVisible] = useState(false);

  const openBottomSheet = () => {
    setItemType(title)
    setItem(item);
    snapToIndex(0);

    // if (Platform.OS === 'web') {
    //   setModalVisible(!modalVisible);
    // } else {
    //   snapToIndex(0);
    // }
  };


  return (
    <TouchableOpacity 
      onPress={openBottomSheet} 
      // onPress={() => router.push(`/items/${item.id}`)} 
      style={styles.itemContainer}
      activeOpacity={0.7}
    >
      <View style={styles.itemDetailsContainer}>
        <View style={styles.nameAndIconContainer}>
          <Text style={styles.itemName}>{capitalizeString(item.name)}</Text>
          <IconContainer item={item} title={title} />
        </View>

        {title === 'item' ? (

          item.pokemon_v2_itemeffecttexts[0] ? (
            <Text style={styles.shortEffect}>{item.pokemon_v2_itemeffecttexts[0]?.short_effect}</Text>
          ) : (
            <Text style={styles.shortEffect}>This item has no info on PokeAPI yet!</Text>
          )

        ) : title === 'ability' ? (

          item.pokemon_v2_abilityeffecttexts[0] ? (
            <Text style={styles.shortEffect}>SHORT EFFECT: {item.pokemon_v2_abilityeffecttexts[0]?.short_effect}</Text>
          ) : (
            <Text style={styles.shortEffect}>This item has no info on PokeAPI yet!</Text>
          )

        ) : null}

      </View>

      {title === 'item' ? (
        <Image 
          style={styles.image}
          source={{
            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`
          }}
          placeholder=""
          contentFit="contain"
          pointerEvents='none'
          
        />
      ) : title === 'ability' ? (
        <Ionicons 
          name="information-circle-outline" 
          size={24} 
          color="black" 
        />
      ) : null}

      <WebBottomSheet  modalVisible={modalVisible} setModalVisible={setModalVisible} />

    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  itemDetailsContainer: {
    width: '80%'
  },
  nameAndIconContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 20,
    paddingRight: 15,
  },
  shortEffect: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    flexShrink: 1,
  },
  image: {
    width: 80,
    height: 80,
    pointerEvents: 'none'
  },
});
