import { create } from 'zustand';
import { UserModel } from '@/features/auth/types';

type User = UserModel

type UserStore = {
  user: User;
  isLoggedIn: boolean;
  token?: string;
  setUpUserData: (user: User) => void;
  removeUserData: () => void;
  setToken: (token: string) => void;
  removeToken: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: {} as User,
  isLoggedIn: false,
  token: undefined,
  clientId: undefined,
  setUpUserData: (user: User) => set((state) => ({ ...state, isLoggedIn: true, user })),
  removeUserData: () => set((state) => ({ ...state, isLoggedIn: false, user: {} as User })),
  setToken: (token: string) => set((state) => ({ ...state, token })),
  removeToken: () => set((state) => ({ ...state, token: undefined })),
  setIsLoggedIn: (loggedIn: boolean) => set((state) => ({ ...state, isLoggedIn: loggedIn })),
}));

export { useUserStore };
