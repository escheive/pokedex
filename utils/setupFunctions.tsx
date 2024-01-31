import { GET_PROFILE_QUERY } from "api/user/queries";
import mmkv from "./mmkvConfig";

const INITIAL_SETUP_KEY = 'hasInitialSetup';



export async function checkAndPerformInitialSetup(apolloClient, userData) {
  try {
    const hasSetup = mmkv.getString(INITIAL_SETUP_KEY);

    const initialData = {
      profile: {
        __typename: 'Profile',
        id: '1',
        username: 'Ash',
        email: 'ash@example.com',
        profileImage: '1'
        // Initialize other profile fields
      },
    };

    if (hasSetup != 'true' || !userData) {
      console.log('setting up new user')

      apolloClient.writeQuery({
        query: GET_PROFILE_QUERY,
        data: initialData,
      })
      // Update the initial setup flag so future setups do not go through these steps
      mmkv.set(INITIAL_SETUP_KEY, 'true');
    }

  } catch (error) {
    console.error('Error during initial setup:', error);
  }
}