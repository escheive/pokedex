// Dependencies
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
// Components
import { ItemBottomSheet } from "./ItemBottomSheet";
import { AbilityBottomSheet } from "./AbilityBottomSheet";
// Context
import { useBottomSheet } from "contexts/BottomSheetContext";


export const BottomSheetComponent = () => {
  // Context for bottom sheet
  const { bottomSheetRef, scrollViewRef, handleSheetChanges, item, itemType } = useBottomSheet();

  // Heights that the bottom sheet will snap to
  const snapPoints = useMemo(() => ['50%', '95%'], []);


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
      <BottomSheetScrollView 
        ref={scrollViewRef}
        style={styles.container}
      >
        {item ? (
          itemType === 'item' ? (

            <ItemBottomSheet />

          ) : itemType === 'ability' ? (

            <AbilityBottomSheet />

          ) : null
        ) : null}
      </BottomSheetScrollView>
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
});
