// Dependencies
import { useMemo, useState } from "react";
import { TouchableOpacity, View, Modal, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// Components
import { ItemBottomSheet } from "./ItemBottomSheet";
import { AbilityBottomSheet } from "./AbilityBottomSheet";
// Context
import { useBottomSheet } from "contexts/BottomSheetContext";


export const WebBottomSheet = ({ modalVisible, setModalVisible }) => {
  // Context for bottom sheet
  const { scrollViewRef, item, itemType, } = useBottomSheet();


  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.modalContent}
            contentContainerStyle={{ justifyContent: 'flex-end' }}
          >
            {item ? (
              itemType === 'item' ? (

                <ItemBottomSheet />

              ) : itemType === 'ability' ? (

                <AbilityBottomSheet />

              ) : null
            ) : null}
          </ScrollView>
        </TouchableOpacity>
      </Modal>        
    </>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    top: '20%',
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
