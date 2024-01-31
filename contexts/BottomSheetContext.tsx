// BottomSheetContext.js
import React, { createContext, useContext, useRef, useMemo, useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';



type BottomSheetContextType = {
  handleSheetChanges: (index: number) => void;
  snapToIndex: (index: number) => void;
  closeBottomSheet: () => void;
  bottomSheetRef: React.RefObject<BottomSheet> | null;
  scrollViewRef: React.RefObject<ScrollView> | null;
  item: any;
  setItem: (item: any) => void;
  itemType: any;
  setItemType: (itemType: any) => void;
};


const BottomSheetContext = createContext<BottomSheetContextType>({
  handleSheetChanges: (index: number) => {},
  snapToIndex: (index: number) => {},
  closeBottomSheet: () => {},
  bottomSheetRef: null,
  scrollViewRef: null,
  item: null,
  setItem: (item: any) => {},
  itemType: null,
  setItemType: (itemType: any) => {},
});


export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};


export const BottomSheetProvider = ({ children }: any) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [item, setItem] = useState(null);
  const [itemType, setItemType] = useState(null);


  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    if (index === -1 || index === 0) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false })
    };
    bottomSheetRef.current?.snapToIndex(index);
    console.log('handleSnapPress', index)
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const contextValue = {
    snapToIndex: handleSnapPress,
    handleSheetChanges,
    closeBottomSheet,
    bottomSheetRef,
    scrollViewRef,
    item,
    setItem,
    itemType,
    setItemType,
  };

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
    </BottomSheetContext.Provider>
  );
};
