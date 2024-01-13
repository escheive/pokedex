// Dependencies
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


interface FilterButtonProps {
  label: any;
  onPress: any;
  gradientColors: any;
}


export const FilterButton: React.FC<FilterButtonProps> = ({ label, onPress, gradientColors }) => {

  return (
    <TouchableOpacity style={styles.filterButton} onPress={onPress}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradient}>
        <Text style={styles.filterButtonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
};


const styles = StyleSheet.create({
  filterButton: {
    justifyContent: 'center',
    borderRadius: 15,
    marginVertical: 3,
  },
  gradient: {
    borderRadius: 10,
    padding: 8,
    flex: 1,
  },
  filterButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 15
  },
});