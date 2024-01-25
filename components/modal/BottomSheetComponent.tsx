import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { TouchableOpacity, ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
import Modal from 'react-native-modal';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useDerivedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
// Bottom Sheet
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "contexts/BottomSheetContext";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const BottomSheetComponent = () => {
  const { bottomSheetRef, handleSheetChanges } = useBottomSheet();

  const snapPoints = useMemo(() => ['50%', '90%'], []);
  // console.log(item)
  // const itemName = selectedItem.name
  // const cost = selectedItem?.cost ? selectedItem.cost : null;
  // const fling_power = selectedItem?.fling_power ? selectedItem.fling_power : 0;
  // const isFavorited = selectedItem?.isFavorited ? 'Favorited!' : 'not favorited';
  // const flingEffect = selectedItem?.pokemon_v2_itemflingeffect?.pokemon_v2_itemflingeffecteffecttexts.effect ? selectedItem.pokemon_v2_itemflingeffect.pokemon_v2_itemflingeffecteffecttexts.effect : null;
  // const itemCategory = selectedItem?.pokemon_v2_itemcategory.name ? selectedItem.pokemon_v2_itemcategory?.name : null;
  // const itemPocket = selectedItem?.pokemon_v2_itemcategory.pokemon_v2_itempocket.name ? selectedItem.pokemon_v2_itemcategory.pokemon_v2_itempocket.name : null;
  // const itemEffect = selectedItem.pokemon_v2_itemeffecttexts[0]?.effect ? selectedItem.pokemon_v2_itemeffecttexts[0]?.effect : null;
  // const itemShortEffect = selectedItem.pokemon_v2_itemeffecttexts[0]?.short_effect ? selectedItem.pokemon_v2_itemeffecttexts[0]?.short_effect : null
  // const itemFlavorText = selectedItem.pokemon_v2_itemflavortexts[0]?.flavor_text ? selectedItem.pokemon_v2_itemflavortexts[0]?.flavor_text : null;


  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
    >
      <BottomSheetView>
        <Text>Hi</Text>
      </BottomSheetView>
    </BottomSheet>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
    pointerEvents: 'box-none',
  },
  modalContainer: {
    backgroundColor: 'gray',
    flex: 1,
    zIndex: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    pointerEvents: 'box-none',
  },
  modalContent: {
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#aaa',
    paddingVertical: 16,
  },
  modalDefinitionContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalDefinition: {
    fontSize: 18,
    color: 'gray',
    padding: 10,
    width: '100%',
    borderRadius: 12,
    textAlign: 'center',
    marginVertical: 30,
  },
});

// import { useRef, useState, useEffect, useMemo, useCallback } from "react";
// import { TouchableOpacity, ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
// import Modal from 'react-native-modal';
// import Animated, { Easing, withSpring, withTiming, useSharedValue, useDerivedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// // Bottom Sheet
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// const deviceWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;

// export const ItemModal = ({ sheetRef, handleSheetChange, modalOpen, setModalOpen, item } : { sheetRef: any, handleSheetChange: any, modalOpen: boolean, setModalOpen: any, item: any }) => {
//   // console.log(item)
//   const itemName = item.name
//   const cost = item.cost ? item.cost : null;
//   const fling_power = item.fling_power ? item.fling_power : 0;
//   const isFavorited = item.isFavorited ? 'Favorited!' : 'not favorited';
//   const flingEffect = item.pokemon_v2_itemflingeffect?.pokemon_v2_itemflingeffecteffecttexts.effect ? item.pokemon_v2_itemflingeffect.pokemon_v2_itemflingeffecteffecttexts.effect : null;
//   const itemCategory = item.pokemon_v2_itemcategory.name ? item.pokemon_v2_itemcategory?.name : null;
//   const itemPocket = item.pokemon_v2_itemcategory.pokemon_v2_itempocket.name ? item.pokemon_v2_itemcategory.pokemon_v2_itempocket.name : null;
//   const itemEffect = item.pokemon_v2_itemeffecttexts[0]?.effect ? item.pokemon_v2_itemeffecttexts[0]?.effect : null;
//   const itemShortEffect = item.pokemon_v2_itemeffecttexts[0]?.short_effect ? item.pokemon_v2_itemeffecttexts[0]?.short_effect : null
//   const itemFlavorText = item.pokemon_v2_itemflavortexts[0]?.flavor_text ? item.pokemon_v2_itemflavortexts[0]?.flavor_text : null;


//   const scrollViewRef = useRef(null);
//   const [scrollOffset, setScrollOffset] = useState<number>(0);
//   const [isScrollEnabled, setIsScrollEnabled] = useState(false);
//   const [modalHeight, setModalHeight] = useState(deviceHeight / 2);
//   // Bottom Sheet
//   const snapPoints = useMemo(() => ['50%', '100%'], [])



//   const handleOnScroll = (event) => {
//     setScrollOffset(event.nativeEvent.contentOffset.y)
//   };


//   const handleScrollTo = (p) => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo(p);
//     }
//   }


//   const handleSwipeMove = (gestureState) => {
//     const { moveY, vy} = gestureState;
//     setModalHeight(Math.max(deviceHeight / 2, deviceHeight - moveY));
//   };


//   const toggleModal = () => {
//     console.log(scrollOffset)
//     setIsScrollEnabled(false);
//     setModalOpen(!modalOpen)
//   }

//   const calculateModalHeight = () => {
//     if (scrollOffset > 50) {
//       return deviceHeight;
//     }
//     return deviceHeight / 2;
//   }

  
//   return (
//     <BottomSheet
//       ref={sheetRef}
//       index={-1}
//       snapPoints={snapPoints}
//       onChange={handleSheetChange}
//       containerStyle={styles.container}
//     >
//       <BottomSheetScrollView contentContainerStyle={styles.modalContainer}>
//         <Text>Bottom Sheet content</Text>
//       </BottomSheetScrollView>
//     </BottomSheet>
//   )
// }

// // Stylesheet for this screen
// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'flex-end',
//     margin: 0,
//     flex: 1,
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   modalContent: {
//     borderRadius: 16,
//     padding: 16,
//   },
//   modalTitle: {
//     textAlign: 'center',
//     width: '100%',
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#aaa',
//     paddingVertical: 16,
//   },
//   modalDefinitionContainer: {
//     backgroundColor: '#fff',
//     width: '100%',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   modalDefinition: {
//     fontSize: 18,
//     color: 'gray',
//     padding: 10,
//     width: '100%',
//     borderRadius: 12,
//     textAlign: 'center',
//     marginVertical: 30,
//   },
// });

    // <Modal 
    //   isVisible={modalOpen} 
    //   onSwipeComplete={toggleModal}
    //   onSwipeMove={handleSwipeMove}
    //   swipeDirection={['down', 'up']}
    //   propagateSwipe={true}
    //   onBackdropPress={() => setModalOpen(false)}
    //   deviceWidth={deviceWidth}
    //   deviceHeight={deviceHeight}
    //   style={styles.container}
    //   hasBackdrop={true}
    //   scrollTo={handleScrollTo}
    //   scrollOffset={scrollOffset}
    //   scrollOffsetMax={deviceHeight / 2}
    // >
      // <View style={styles.modalContainer}>
      //   <Text style={styles.modalTitle}>item name: {item.name}</Text>
      //   <ScrollView 
      //     style={styles.modalContent}
      //     ref={scrollViewRef}
      //     onScroll={handleOnScroll}
      //     scrollEnabled={isScrollEnabled ? true : false}
      //     scrollEventThrottle={16}
      //     contentContainerStyle={{ alignItems: 'center' }}
      //   >
      //     <View style={styles.modalDefinitionContainer}>
      //       <Text style={styles.modalDefinition}>Cost: {cost}</Text>
      //       <Text style={styles.modalDefinition}>{isFavorited ? 'favorited' : 'not favorited'}</Text>
      //       <Text style={styles.modalDefinition}>Fling effect: {flingEffect}</Text>
      //       <Text style={styles.modalDefinition}>Fling Power: {fling_power}</Text>
      //       <Text style={styles.modalDefinition}>Category: {itemCategory}</Text>
      //       <Text style={styles.modalDefinition}>Pocket: {itemPocket}</Text>
      //       <Text style={styles.modalDefinition}>Effect: {itemEffect}</Text>
      //       <Text style={styles.modalDefinition}>Short Effect: {itemShortEffect}</Text>
      //       <Text style={styles.modalDefinition}>Flavor Text: {itemFlavorText}</Text>
      //     </View>
      //   </ScrollView>
      // </View>
    {/* </Modal> */}