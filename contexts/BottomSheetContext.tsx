// BottomSheetContext.js
import React, { createContext, useContext, useRef, useMemo, useCallback } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';



type BottomSheetContextType = {
  handleSheetChanges: (index: number) => void;
  snapToIndex: (index: number) => void;
  closeBottomSheet: () => void;
  bottomSheetRef: React.RefObject<BottomSheet> | null;
};


const BottomSheetContext = createContext<BottomSheetContextType>({
  handleSheetChanges: (index: number) => {},
  snapToIndex: (index: number) => {},
  closeBottomSheet: () => {},
  bottomSheetRef: null,
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


  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index); // or use the appropriate method to open the bottom sheet
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const contextValue = {
    snapToIndex: handleSnapPress,
    handleSheetChanges,
    closeBottomSheet,
    bottomSheetRef,
  };

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
    </BottomSheetContext.Provider>
  );
};
