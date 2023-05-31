import { createNativeStackNavigator } from '@react-navigation/native-stack';

const PokemonStackNavigator = ({ typeData, PokemonScreen={PokemonScreen} }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
            }}
        >

            <Stack.Screen name="Main">
                {props => <PokemonScreen {...props} typeData={typeData} />}
            </Stack.Screen>

            <Stack.Screen
                name="Details"
                options={({ route }) => {
                    const selectedPokemon = route.params.pokemon;
                    const headerStyle = {
                        backgroundColor: 'transparent',
                    };
                    return {
                        headerShown: true,
                        headerStyle,
                        headerShadowVisible: false,
                    };
                }}
            >
                {props => <DetailsTabNavigator {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default PokemonStackNavigator;