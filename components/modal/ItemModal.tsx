import { useRef, useState } from "react";
import { TouchableOpacity, ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
import Modal from 'react-native-modal';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const ItemModal = ({ modalOpen, setModalOpen, item } : { modalOpen: boolean, setModalOpen: any, item: any }) => {
  console.log(item)
  const itemName = item.name
  const cost = item.cost ? item.cost : null;
  const fling_power = item.fling_power ? item.fling_power : 0;
  const isFavorited = item.isFavorited ? 'Favorited!' : 'not favorited';
  const flingEffect = item.pokemon_v2_itemflingeffect?.pokemon_v2_itemflingeffecteffecttexts.effect ? item.pokemon_v2_itemflingeffect.pokemon_v2_itemflingeffecteffecttexts.effect : null;
  const itemCategory = item.pokemon_v2_itemcategory.name ? item.pokemon_v2_itemcategory?.name : null;
  const itemPocket = item.pokemon_v2_itemcategory.pokemon_v2_itempocket.name ? item.pokemon_v2_itemcategory.pokemon_v2_itempocket.name : null;
  const itemEffect = item.pokemon_v2_itemeffecttexts[0]?.effect ? item.pokemon_v2_itemeffecttexts[0]?.effect : null;
  const itemShortEffect = item.pokemon_v2_itemeffecttexts[0]?.short_effect ? item.pokemon_v2_itemeffecttexts[0]?.short_effect : null
  const itemFlavorText = item.pokemon_v2_itemflavortexts[0]?.flavor_text ? item.pokemon_v2_itemflavortexts[0]?.flavor_text : null;


  const scrollViewRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y)
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  }


  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const calculateModalHeight = () => {
    // Calculate the dynamic height based on scroll offset
    const maxModalHeight = deviceHeight - 100;
    const expandedHeight = maxModalHeight - scrollOffset;
    return Math.min(maxModalHeight, Math.max(deviceHeight / 2, expandedHeight))
  };
  
  return (
    <Modal 
      isVisible={modalOpen === true} 
      onSwipeComplete={toggleModal}
      swipeDirection='down'
      propagateSwipe={true}
      onBackdropPress={() => setModalOpen(false)}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      style={[styles.container, { height: calculateModalHeight() }]}
      hasBackdrop={true}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={deviceHeight / 2}
    >
        <View style={styles.modalContainer}>
          <ScrollView 
            style={styles.modalContent}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <Text style={styles.modalTitle}>item name: {item.name}</Text>
            <View style={styles.modalDefinitionContainer}>
              <Text style={styles.modalDefinition}>Cost: {cost}</Text>
              <Text style={styles.modalDefinition}>{isFavorited ? 'favorited' : 'not favorited'}</Text>
              <Text style={styles.modalDefinition}>Fling effect: {flingEffect}</Text>
              <Text style={styles.modalDefinition}>Fling Power: {fling_power}</Text>
              <Text style={styles.modalDefinition}>Category: {itemCategory}</Text>
              <Text style={styles.modalDefinition}>Pocket: {itemPocket}</Text>
              <Text style={styles.modalDefinition}>Effect: {itemEffect}</Text>
              <Text style={styles.modalDefinition}>Short Effect: {itemShortEffect}</Text>
              <Text style={styles.modalDefinition}>Flavor Text: {itemFlavorText}</Text>
            </View>
          </ScrollView>
        </View>
    </Modal>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
    
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#aaa',
    paddingVertical: 16,
  },
  modalDefinitionContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalDefinition: {
    fontSize: 18,
    color: 'gray',
    padding: 10,
    width: '100%',
    borderRadius: 12,
    textAlign: 'center',
    marginVertical: 30,
  },
});