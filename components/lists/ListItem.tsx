// Dependencies
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Components
import { IconContainer } from 'components/card/IconContainer';
import { ItemModal } from 'components/modal/ItemModal';
// Utils
import { capitalizeString, pokemonColors } from 'utils/helpers';


export const ListItem = React.memo(({ item, title }: any) => {
  const [modalOpen, setModalOpen] = useState(false);


  return (
    <TouchableOpacity 
      onPress={() => setModalOpen(true)} 
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
        />
      ) : title === 'ability' ? (
        <Ionicons 
          name="information-circle-outline" 
          size={24} 
          color="black" 
        />
      ) : null}

      <ItemModal modalOpen={modalOpen} setModalOpen={setModalOpen} item={item} />

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
  },
});
