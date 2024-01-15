import { Modal, TouchableOpacity, Text, View, StyleSheet } from "react-native"

export const ItemModal = ({ modalOpen, setModalOpen, item } : { modalOpen: boolean, setModalOpen: any, item: any }) => {
  console.log(item)
  const itemName = item.name

  // pokemon_v2_item {
  //   name
  //   id
  //   cost
  //   fling_power
  //   isFavorited @client
  //   pokemon_v2_itemflingeffect {
  //     pokemon_v2_itemflingeffecteffecttexts {
  //       effect
  //     }
  //   }
  //   pokemon_v2_itemcategory {
  //     name
  //     pokemon_v2_itempocket {
  //       name
  //     }
  //   }
  //   pokemon_v2_itemeffecttexts {
  //     effect
  //     short_effect
  //   }
  //   pokemon_v2_itemflavortexts(limit: 1, order_by: {version_group_id: desc}, where: {language_id: {_eq: 9}}) {
  //     flavor_text
  //     pokemon_v2_versiongroup {
  //       generation_id
  //     }
  //   }
  
  return (
    <Modal visible={modalOpen === true} animationType="fade" transparent>
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={() => setModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={() => {}}
        >
          <Text style={styles.modalTitle}>item name: {item.name}</Text>
          <View style={styles.modalDefinitionContainer}>
            <Text style={styles.modalDefinition}>item text</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: '#ccc',
    width: '90%',
    borderRadius: 16,
  },
  modalTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    color: 'white',
    paddingVertical: 16,
  },
  modalDefinitionContainer: {
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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