import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

const FilterDropdownDrawer = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [drawerWidth] = useState(new Animated.Value(0));

  const handleDropdownToggle = () => {
    if (dropdownVisible) {
      closeDrawer();
    } else {
      openDrawer();
    }
    setDropdownVisible(!dropdownVisible);
  };

  const openDrawer = () => {
    Animated.timing(drawerWidth, {
      toValue: 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerWidth, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const drawerWidthInterpolation = drawerWidth.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 200],
  });

  const handleOptionSelect = (option) => {
    // Handle the selected option here
    console.log('Selected option:', option);
    handleDropdownToggle(); // Close the drawer after selecting an option
  };

  return (
    <View>
      {/* Your other content */}
      <TouchableOpacity onPress={handleDropdownToggle}>
        <Text>Toggle Dropdown</Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: drawerWidthInterpolation,
            backgroundColor: 'white',
            // Add any desired styling for the drawer
          },
          dropdownVisible ? { left: 0 } : { left: -200 },
        ]}
      >
        {/* Add your options/buttons here */}
        <TouchableOpacity onPress={() => handleOptionSelect('Option 1')}>
          <Text>Option 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOptionSelect('Option 2')}>
          <Text>Option 2</Text>
        </TouchableOpacity>
        {/* ... */}
      </Animated.View>
    </View>
  );
};

export default FilterDropdownDrawer;