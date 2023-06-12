import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { useDispatch, useSelector } from 'react-redux';
import { createMatrixTable, retrieveMatrixFromStorage, saveMatrixToStorage, resetMatrix } from '../services/ml';

const RecommendationSystem = () => {
    const [recommendations, setRecommendations] = useState([]);
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

    useEffect(() => {
        loadDataAndGenerateRecommendations();
    }, []);

    // Function to create or retrieve the interaction matrix
    const getInteractionMatrix = async () => {
        console.log('getInteractionMatrix');

//         await resetMatrix();

        // Create matrix table in sqlite if it doesnt exist
        await createMatrixTable();

        // Check if the matrix exists in sqlite
        const storedMatrix = await retrieveMatrixFromStorage();

        if (storedMatrix) {
            // Matrix exists, return the stored matrix
            return storedMatrix;
        } else {
            // Matrix doesn't exist, create and initialize a new matrix
            const numPokemon = 40; // Number of pokemon in my matrix

            const newMatrix = await Array(1)
                .fill(0)
                .map(() => Array(numPokemon).fill(0));

            // Save the new matrix in sqlite for future use
            await saveMatrixToStorage(newMatrix);

            return newMatrix;
        }
    }


    const loadDataAndGenerateRecommendations = async () => {
        console.log('loadDataAndGenerateRecommendations');
        // Load or fetch preprocessed recommendation data
        const data = await loadRecommendationData();
        // Train recommendation model
        const model = await createAndTrainModel(data);
        // Generate recommendations for the user
        const userPreferences = await getUserPreferences();
        const recommendedPokemon = await generateRecommendations(model, userPreferences);

        // Set the recommendations useState
        setRecommendations(recommendedPokemon);
    };

    const loadRecommendationData = async () => {
        try {
            console.log('loadRecommendationData');
            // Load or fetch the data for training the recommendation model
            const interactionMatrix = await getInteractionMatrix();
            // Preprocess the interaction matrix
            const data = preprocessInteractionMatrix(interactionMatrix);

            return data;
        } catch (error) {
            throw new error('Error loading recommendation data in the loadRecommendationData function', error)
        }
    };

    const preprocessInteractionMatrix = (matrix) => {
        console.log('preprocessInteractionMatrix');
        const normalizedMatrix = matrix.map((row) => {
            const maxValue = Math.max(...row);
            const minValue = Math.min(...row);
            // Check if all values in the row are zero, if so, return the original row as is
            if (minValue === 0 && maxValue === 0) {
                return row;
            }
            return row.map((value) => (value - minValue) / (maxValue - minValue));
        });
        return normalizedMatrix;
    };

    // Define and train the recommendation model using TensorFlow.js
    const createAndTrainModel = async (data) => {
        console.log('createAndTrainModel');
        console.log(data)
        // Define the model architecture
        const model = tf.sequential();
        console.log(model)
        model.add(tf.layers.dense({ units: 128, inputShape: [data.shape[1]] }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: data.shape[1], activation: 'sigmoid' }));

        console.log('compile');
        // Compile the model with appropriate loss and optimizer
        model.compile({
            loss: 'meanSquaredError',
            optimizer: 'adam',
        });
        console.log('here')

        // Convert the input data to TensorFlow tensors
        const inputData = tf.tensor2d(data);

        // Split the data into training and validation sets
        const validationSplit = 0.2 // 20% for validation
        const validationSample = Math.round(data.shape[0] * validationSplit);
        const shuffledData = tf.data.array(inputData).shuffle(data.shape[0]);
        const trainingData = shuffledData.take(data.shape[0] - validationSample);
        const validationData = shuffledData.skip(data.shape[0] - validationSample);

        // Normalize the input data
        const { mean, variance } = tf.moments(trainingData, 0);
        const normalizedTrainingData = trainingData.sub(mean).div(tf.sqrt(variance));
        const normalizedValidationData = validationData.sub(mean).div(tf.sqrt(variance));

        // Train the model with the preprocessed data
        await model.fit(normalizedTrainingData, normalizedTrainingData, {
            epochs: 100,
            batchSize: 32,
            validationData: [normalizedValidationData, normalizedValidationData],
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(`Epoch ${epoch + 1}/${100}, Loss: ${logs.loss}`);
                },
            },
        });

        return model;
    };

    // Use the trained model to generate recommendations based on user preferences
    const generateRecommendations = async (model, userPreferences) => {
        console.log('generateRecommendations');
        // Convert user preferences to a TensorFlow tensor
        const inputPreferences = await tf.tensor2d(userPreferences, [1, userPreferences.length]);

        // Normalize the preferences
        const { mean, variance } = await tf.moments(inputPreferences, 0);
        const normalizedPreferences = await inputPreferences.sub(mean).div(tf.sqrt(variance));

        // Generate recommendations using the model
        const recommendations = await model.predict(normalizedPreferences);

        // Convert recommendations tensor to a JavaScript array
        const recommendationsArray = await Array.from(recommendations.dataSync());

        // Sort and select the top recommended indices
        const topIndices = await recommendationsArray
            .map((value, index) => ({ value, index }))
            .sort((a, b) => b.value - a.value)
            .map(item => item.index)
            .slice(0, 10); // 10 is number of recommendations

        // Map the top indices to actual Pokemon objects
        const recommendedPokemon = await topIndices.map(index => pokemonList[index]);

        return recommendedPokemon;
    };

    const getUserPreferences = async () => {
        console.log('getUserPreferences');
        // Get user preferences or input that will be used for generating recommendations
        const preferences = await Object.values(pokemonList).filter((pokemon) => pokemon.isFavorite);

        return preferences;
    };


    return (
        <View>
            <Text>Recommendations</Text>
            <View>
                {recommendations.map((pokemon) => (
                    <View>
                        <Image
                            src={{ uri: `${pokemon.image_url}` }}
                        />
                        <Text>{pokemon.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default RecommendationSystem;