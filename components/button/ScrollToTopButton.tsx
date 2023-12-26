import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ScrollToTopButton = ( flashListRef ) => {
  // Function to scroll to the top of the list
  const scrollToTop = () => {
    flashListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <TouchableOpacity onPress={scrollToTop} style={styles.scrollToTopButton}>
      <Ionicons
        name="arrow-up"
        size={36} color="#555"
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  scrollToTopButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 28,
    padding: 6,
  }
});