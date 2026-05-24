import { create } from 'zustand';
import { subscribeToAuthChanges, logoutUser } from '../firebase/auth';

const useAgroStore = create((set) => ({
  user: null,
  isAuthLoading: true,
  selectedCropId: 'tomate',
  
  // Auth Actions
  initAuth: () => {
    subscribeToAuthChanges((firebaseUser) => {
      set({ user: firebaseUser, isAuthLoading: false });
    });
  },
  
  logout: async () => {
    await logoutUser();
    set({ user: null });
  },

  // Crop Actions
  setSelectedCropId: (cropId) => set({ selectedCropId: cropId }),
}));

export default useAgroStore;
