import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useBottomSheet } from "contexts/BottomSheetContext";
import { capitalizeString } from "utils/helpers";


export const ItemBottomSheet = () => {
  const { item } = useBottomSheet();


  const capitalizedName = capitalizeString(item?.name);
  const cost = item?.cost || null;
  const fling_power = item?.fling_power || null;
  const flingEffect = item?.pokemon_v2_itemflingeffect?.pokemon_v2_itemflingeffecteffecttexts.effect || null;
  const itemCategory = capitalizeString(item?.pokemon_v2_itemcategory?.name) || null;
  const itemPocket = capitalizeString(item?.pokemon_v2_itemcategory?.pokemon_v2_itempocket?.name) || null;
  const itemEffect = item?.pokemon_v2_itemeffecttexts[0]?.effect || null;
  const itemShortEffect = item?.pokemon_v2_itemeffecttexts[0]?.short_effect || null
  const itemFlavorText = item?.pokemon_v2_itemflavortexts[0]?.flavor_text || null;



  return (
    <>
      <View style={styles.titleContainer}>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{capitalizedName}</Text>
            <Image 
              style={styles.image}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`
              }}
              placeholder=""
              contentFit="contain"
            />
          </View>

          <Text style={styles.itemType}>Item</Text>

          <View style={styles.borderHorizontal}></View>

          <View style={styles.categoryGroup}>

            <View style={[styles.itemValueTextContainer, { width: '50%' }]}>
            <Text style={styles.itemValue}>{itemPocket}</Text>
              <Text style={styles.itemText}>Bag Pocket</Text>
            </View>

            <View style={[styles.itemValueTextContainer, { width: '50%' }]}>
              <Text style={styles.itemValue}>{itemCategory}</Text>
              <Text style={styles.itemText}>Item Category</Text>
            </View>
          </View>

        </View>

        <View style={styles.detailsContainer}>

          <View style={styles.rowGroup}>

            <View style={styles.itemValueTextContainer}>
              <Text style={styles.itemValue}>{cost !== null ? cost : '-'}</Text>
              <Text style={styles.itemText}>Cost</Text>
            </View>

            <View style={styles.borderVertical}></View>

            <View style={styles.itemValueTextContainer}>
              <Text style={styles.itemValue}>{fling_power !== null ? fling_power : '-'}</Text>
              <Text style={styles.itemText}>Fling Power</Text>
            </View>

            <View style={styles.borderVertical}></View>

            <View style={styles.itemValueTextContainer}>
              <Text style={styles.itemValue}>{flingEffect !== null ? flingEffect : '-'}</Text>
              <Text style={styles.itemText}>Fling Effect</Text>
            </View>

          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>Effect</Text>
            <Text style={styles.itemText}>{itemShortEffect}</Text>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>In-Depth Effect</Text>
            <Text style={styles.itemText}>{itemEffect}</Text>
          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>Description</Text>
            <Text style={styles.itemText}>{itemFlavorText}</Text>
          </View>

      </View>
    </>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  categoryGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 30,
  },
  borderHorizontal: {
    borderTopWidth: 1,
    borderColor: '#eee',
    width: '80%',
    alignSelf: 'center'
  },
  borderVertical: {
    borderRightWidth: 1,
    borderColor: '#eee',
    height: '80%',
    alignSelf: 'center'
  },
  rowGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemValueTextContainer: {
    width: '33%',
    justifyContent: 'center',
  },
  group: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F2F7FB',
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 30,
    paddingBottom: 10,
    textAlign: 'center',
    width: '100%'
  },
  image: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '25%',
    height: '175%',
  },
  itemType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemValue: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center'
  },
  groupTitle: {
    color: '#acf',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});
