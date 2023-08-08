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

    const styles = StyleSheet.create({
        bannerContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '25%',
        },
        bannerText: {
            width: '100%',
            color: 'white',
            backgroundColor: isCorrect === 'Correct' ? 'green' : 'red',
            padding: 8,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });

    return (
        <Modal
            visible={isVisible === true}
            animationType="fade"
            transparent
            style={styles.modal}
        >
            <View style={styles.bannerContainer}>
                <Text style={styles.bannerText}>{isCorrect}</Text>
            </View>
        </Modal>
    )
}

export default CorrectBanner;