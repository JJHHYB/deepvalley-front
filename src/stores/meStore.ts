import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const initialMe = {
  created_date: '1970-01-01T00:00:00',
  description: 'Hello Valley!',
  login_email: 'user@unknown.com',
  name: 'user',
  profile_image_url: '',
  oauth: null,
};

interface MeState {
  me: {
    created_date: string;
    description: string;
    login_email: string;
    name: string;
    profile_image_url: string;
    oauth: string | null;
  };
  updateMe: (data: Partial<MeState['me']>) => void;
  reset: () => void;
}

export const useMe = create<MeState>()(
  persist(
    (set) => ({
      me: initialMe,
      updateMe: (data) => {
        const newMe = { ...initialMe, ...data };
        set({ me: newMe });
      },
      reset: () => set({ me: initialMe }),
    }),
    {
      name: 'RememberMe',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
