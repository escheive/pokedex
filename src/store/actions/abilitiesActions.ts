import { setAbilities } from '../slices/abilitiesSlice';
import { fetchDataFromDatabase } from '../utils/database/abilitiesDatabase';

export const setAbilitiesFromDatabase = () => {
  return async (dispatch) => {
    try {
      const abilitiesData = await fetchDataFromDatabase();
      dispatch(setAbilities(abilitiesData));
    } catch (error) {
      console.error('Error setting Abilities data from database:', error);
    }
  };
};
