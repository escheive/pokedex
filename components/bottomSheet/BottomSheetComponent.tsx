// Dependencies
import { useCallback, useMemo } from "react";
import { View, Platform, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
// Components
import { ItemBottomSheet } from "./ItemBottomSheet";
import { AbilityBottomSheet } from "./AbilityBottomSheet";
// Context
import { useBottomSheet } from "contexts/BottomSheetContext";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";


export const BottomSheetComponent = () => {
  // Context for bottom sheet
  const { bottomSheetRef, scrollViewRef, handleSheetChanges, item, itemType, closeBottomSheet, isScrollable } = useBottomSheet();



  // Heights that the bottom sheet will snap to
  const snapPoints = Platform.OS !== 'web' ? 
    useMemo(() => ['50%', '95%'], []) :
    useMemo(() => ['75%'], []);

  
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );


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
      // style for the background of the bottom sheet, without this there was white behind the border radius
      backgroundStyle={styles.backgroundContainer}
      // Component for the backdrop ie dark background of the bottom sheet
      backdropComponent={renderBackdrop}
    >
      <ScrollView 
        ref={scrollViewRef}
        scrollEnabled={isScrollable}
        style={styles.container}
      >
        <TouchableOpacity
        style={styles.closeButton}
        onPress={closeBottomSheet}
      >
        <MaterialCommunityIcons 
          name="close-circle-outline" 
          size={40} 
          color="gray" 
        />
      </TouchableOpacity>
        {item ? (
          itemType === 'item' ? (

            <ItemBottomSheet />

          ) : itemType === 'ability' ? (

            <AbilityBottomSheet />

          ) : null
        ) : null}
      </ScrollView>
    </BottomSheet>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: 10,
  }
});
