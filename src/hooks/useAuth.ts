import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User } from '../interfaces/user';

export function useAuth() {
  const {
    user,
    isLoadAuth,
    token,
    role,
    updateProfile,
    isAuthenticated,
    login,
    logout,
    errorAuth,
  } = useContext(AuthContext);

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await login({ email, password });

    return res;
  };

  const logoutUser = async () => {
    logout();
  };

  const updateProfileUser = async (user: User) => {
    const res = await updateProfile(user);

    return res;
  };

  return {
    loginUser,
    isLoadAuth,
    logoutUser,
    role,
    user,
    token,
    isAuthenticated,
    updateProfileUser,
    errorAuth,
  };
}
