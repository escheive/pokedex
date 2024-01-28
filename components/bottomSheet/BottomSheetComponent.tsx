import { useMemo } from "react";
import { StyleSheet } from "react-native";
// Bottom Sheet
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "contexts/BottomSheetContext";
import { ItemBottomSheet } from "./ItemBottomSheet";


export const BottomSheetComponent = () => {
  const { bottomSheetRef, handleSheetChanges, item } = useBottomSheet();

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
      <BottomSheetView style={styles.container}>

        {item ? (

          <ItemBottomSheet />
          
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
});
