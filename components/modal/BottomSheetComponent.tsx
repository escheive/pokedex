import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { TouchableOpacity, ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useDerivedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
// Bottom Sheet
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "contexts/BottomSheetContext";
import { capitalizeString } from "utils/helpers";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const BottomSheetComponent = () => {
  const { bottomSheetRef, handleSheetChanges, item } = useBottomSheet();
    // console.log(item)

  const snapPoints = useMemo(() => ['50%', '95%'], []);

  if (!item) {
    return null;
  }

  const { 
    name, 
    cost, 
    fling_power, 
    isFavorited,
    pokemon_v2_itemflingeffect,
    pokemon_v2_itemcategory,
    pokemon_v2_itemeffecttexts,
    pokemon_v2_itemflavortexts,
  } = item;

  const capitalizedName = capitalizeString(name);
  const flingEffect = pokemon_v2_itemflingeffect?.pokemon_v2_itemflingeffecteffecttexts.effect || null;
  const itemCategory = pokemon_v2_itemcategory?.name || null;
  const itemPocket = pokemon_v2_itemcategory?.pokemon_v2_itempocket?.name || null;
  const itemEffect = pokemon_v2_itemeffecttexts[0]?.effect || null;
  const itemShortEffect = pokemon_v2_itemeffecttexts[0]?.short_effect || null
  const itemFlavorText = pokemon_v2_itemflavortexts[0]?.flavor_text || null;



  return (
    <BottomSheet
      ref={bottomSheetRef}
      // Bottom sheet defaults as closed
      index={-1}
      // Heights that the bottom sheet will snap to
      snapPoints={snapPoints}
      // On change of bottom sheet call this function
      onChange={handleSheetChanges}
      // Allow users to swipe down to close bottom sheet
      enablePanDownToClose={true}
      // Remove the handle from the top of the bottom sheet
      handleComponent={null}
      // style for the background of the bottom sheet, without this there was white behind the border radius
      backgroundStyle={styles.backgroundContainer}
      // Component for the backdrop ie dark background of the bottom sheet
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.7}
          enableTouchThrough={true}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      <BottomSheetView style={styles.container}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{capitalizedName}</Text>
          <Text style={styles.itemType}>Item</Text>

          <View style={styles.borderHorizontal}></View>

          <View style={styles.titleRowGroup}>

            <View style={[styles.itemValueTextContainer, { width: '50%' }]}>
            <Text style={styles.itemValue}>{itemPocket}</Text>
              <Text style={styles.itemText}>Bag Pocket</Text>
            </View>

            <View style={[styles.itemValueTextContainer, { width: '50%' }]}>
              <Text style={styles.itemValue}>{itemCategory}</Text>
              <Text style={styles.itemText}>Item Category</Text>
            </View>
          </View>

        </View>

        <View style={styles.detailsContainer}>

        <View style={styles.rowGroup}>

          <View style={styles.itemValueTextContainer}>
            <Text style={styles.itemValue}>{cost !== null ? cost : '-'}</Text>
            <Text style={styles.itemText}>Cost</Text>
          </View>

          <View style={styles.borderVertical}></View>

          <View style={styles.itemValueTextContainer}>
            <Text style={styles.itemValue}>{fling_power !== null ? fling_power : '-'}</Text>
            <Text style={styles.itemText}>Fling Power</Text>
          </View>

          <View style={styles.borderVertical}></View>

          <View style={styles.itemValueTextContainer}>
            <Text style={styles.itemValue}>{flingEffect !== null ? flingEffect : '-'}</Text>
            <Text style={styles.itemText}>Fling Effect</Text>
          </View>

        </View>
          
          <Text style={styles.itemText}>{isFavorited ? 'Is Favorited!' : 'Not Favorited'}</Text>

            
          <View style={styles.group}>
            <Text style={styles.itemText}>Item Effect: {itemEffect}</Text>
            <Text style={styles.itemText}>Item Short Effect: {itemShortEffect}</Text>
            <Text style={styles.itemText}>Item Flavor Text: {itemFlavorText}</Text>
          </View>
          
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  backgroundContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  titleRowGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 30,
  },
  borderHorizontal: {
    borderTopWidth: 1,
    borderColor: '#eee',
    width: '80%',
    alignSelf: 'center'
  },
  borderVertical: {
    borderRightWidth: 1,
    borderColor: '#eee',
    height: '80%',
    alignSelf: 'center'
  },
  rowGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemValueTextContainer: {
    width: '33%',
    justifyContent: 'center',
  },
  group: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
  },
  itemType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemValue: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center'
  },
  itemText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center'
  },
});
