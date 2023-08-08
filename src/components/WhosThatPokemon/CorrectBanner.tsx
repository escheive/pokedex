import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const CorrectBanner = ({ isCorrect }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isCorrect !== null) {
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false)
            }, 1000);
        }
    }, [isCorrect]);

    return (
        <Modal
            visible={isVisible === true}
            animationType="fade"
            transparent
        >
            <View style={styles.bannerContainer}>
                { isCorrect === true ? (
                    <Text style={styles.bannerText}>Correct!</Text>
                ) : (
                    <Text style={styles.bannerText}>Incorrect!</Text>
                )}

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    bannerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CorrectBanner;