import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';



const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Pokemon</Text>
            <ActivityIndicator size="large" color="black" />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default LoadingScreen;
