import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { TouchableOpacity, ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Modal from 'react-native-modal';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useDerivedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
// Bottom Sheet
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "contexts/BottomSheetContext";
import { IconContainer } from "components/card/IconContainer";
import { capitalizeString } from "utils/helpers";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const BottomSheetComponent = () => {
  const { bottomSheetRef, handleSheetChanges, item } = useBottomSheet();

  const snapPoints = useMemo(() => ['50%', '95%'], []);


  const capitalizedName = capitalizeString(item?.name);
  const cost = item?.cost || null;
  const fling_power = item?.fling_power || null;
  const flingEffect = item?.pokemon_v2_itemflingeffect?.pokemon_v2_itemflingeffecteffecttexts.effect || null;
  const itemCategory = capitalizeString(item?.pokemon_v2_itemcategory?.name) || null;
  const itemPocket = capitalizeString(item?.pokemon_v2_itemcategory?.pokemon_v2_itempocket?.name) || null;
  const itemEffect = item?.pokemon_v2_itemeffecttexts[0]?.effect || null;
  const itemShortEffect = item?.pokemon_v2_itemeffecttexts[0]?.short_effect || null
  const itemFlavorText = item?.pokemon_v2_itemflavortexts[0]?.flavor_text || null;



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
        {item ? (
          <>
            <View style={styles.titleContainer}>

                <View style={styles.titleRow}>
                  <Text style={styles.title}>{capitalizedName}</Text>
                  <Image 
                    style={styles.image}
                    source={{
                      uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`
                    }}
                    placeholder=""
                    contentFit="contain"
                  />
                </View>

                <Text style={styles.itemType}>Item</Text>

                <View style={styles.borderHorizontal}></View>

                <View style={styles.categoryGroup}>

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

                <View style={styles.group}>
                  <Text style={styles.groupTitle}>Effect</Text>
                  <Text style={styles.itemText}>{itemShortEffect}</Text>
                </View>

                <View style={styles.group}>
                  <Text style={styles.groupTitle}>In-Depth Effect</Text>
                  <Text style={styles.itemText}>{itemEffect}</Text>
                </View>

                <View style={styles.group}>
                  <Text style={styles.groupTitle}>Description</Text>
                  <Text style={styles.itemText}>{itemFlavorText}</Text>
                </View>

            </View>
          </>
        ) : null}
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
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  categoryGroup: {
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
    backgroundColor: '#F2F7FB',
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingBottom: 10,
    textAlign: 'center',
    width: '100%'
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '25%',
    height: '175%',
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
  groupTitle: {
    color: '#acf',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});
