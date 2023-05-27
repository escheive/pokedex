import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { capitalizeString } from '../../utils/helpers';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OctagonLayout = ({ evolutionChain }) => {
    const centerPokemon = evolutionChain.find(pokemon => pokemon.name === 'eevee');
    const evolutions = centerPokemon.evolutionDetails.filter(pokemon => pokemon.name !== 'eevee');
//     console.log(centerPokemon)
//     console.log(evolutions)

    const topEvolutions = evolutions.slice(0,3)
    const bottomEvolutions = evolutions.slice(3,5).concat(evolutions.slice(7,8))

//     console.log(evolutionChain)

// return (
//     <View style={styles.container}>
//       <View style={styles.evolutionsContainer}>
//         <View style={styles.centerPokemon}>
//             <Image
//                 style={styles.image}
//                 source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${centerPokemon.id}.png` }}
//             />
//           <Text>{capitalizeString(centerPokemon.name)}</Text>
//         </View>
//         {evolutions.map((pokemon, index) => (
//           <View key={index} style={styles.evolutionContainer}>
//             <Image
//                 style={styles.image}
//                 source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
//             />
//             <Text>{capitalizeString(pokemon.name)}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//   },
//   evolutionsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 20,
//   },
//   centerPokemon: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 1,
//     borderColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   evolutionContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: 10,
//   },
//   image: {
//     width: 50,
//     height: 50,
//   }
// });


    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
            {topEvolutions.map((pokemon, index) => (
                <View key={index} style={styles.evolutionContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                    />
                    <Text>{capitalizeString(pokemon.name)}</Text>
                </View>
            ))}
            </View>

            <View style={styles.middleRow}>
                <View style={styles.evolutionContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutions[5].id}.png` }}
                    />
                    <Text>{capitalizeString(evolutions[5].name)}</Text>
                </View>

                <Ionicons name='arrow-back-sharp' size={32} color='black' style={{ marginRight: -40 }} />

                <View style={styles.centerPokemon}>
                    <View style={styles.arrowsContainer}>
                        <Ionicons name='arrow-back-sharp' size={32} color='black' style={{ transform: [{ rotate: '45deg' }] }} />
                        <Ionicons name='arrow-up-sharp' size={32} color='black' />
                        <Ionicons name='arrow-forward-sharp' size={32} color='black' style={{ transform: [{ rotate: '-45deg' }] }} />
                    </View>

                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${centerPokemon.id}.png` }}
                    />
                    <Text>{capitalizeString(centerPokemon.name)}</Text>

                    <View style={styles.arrowsContainer}>
                        <Ionicons name='arrow-back-sharp' size={32} color='black' style={{ transform: [{ rotate: '-45deg' }] }} />
                        <Ionicons name='arrow-down-sharp' size={32} color='black' />
                        <Ionicons name='arrow-forward-sharp' size={32} color='black' style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                </View>

                <Ionicons name='arrow-forward-sharp' size={32} color='black' style={{ marginLeft: -40 }} />

                <View style={styles.evolutionContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutions[6].id}.png` }}
                    />
                    <Text>{capitalizeString(evolutions[6].name)}</Text>
                </View>
            </View>

            <View style={styles.bottomRow}>
            {bottomEvolutions.map((pokemon, index) => (
                <View key={index} style={styles.evolutionContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                    />
                    <Text>{capitalizeString(pokemon.name)}</Text>
                </View>
            ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  centerPokemon: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evolutionContainer: {
    position: 'relative',
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
    image: {
        width: 75,
        height: 75,
    },
    leftArrowContainer: {
        flexDirection: 'column',
        marginRight: -60,
        height: '100%',
    },
    rightArrowContainer: {
        flexDirection: 'column',
        marginLeft: -60,
        height: '100%',
    },
    arrowsContainer: {
        flexDirection: 'row',
        width: '140%',
        justifyContent: 'space-between',
    },
});

export default OctagonLayout;
