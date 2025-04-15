import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Study } from '../interfaces/study';
import { Direction } from '../interfaces/direction';

export function useUsers() {
  const {
    createUser,
    loadUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    user,
    users,
    clearState,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const getAllUser = async () => {
    const res = await getUsers();

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const getUserById = async ({ id }: { id: string }) => {
    await getUser({ id });
  };

  const createNewUser = async ({
    email,
    password,
    role,
    studies,
    directions,
  }: {
    email: string;
    password?: string;
    role: string;
    studies: Study[];
    directions: Direction[];
  }) => {
    const res = await createUser({
      email,
      password,
      role,
      studies,
      directions,
    });

    if (!res.success) {
      alert(res.error.message);
      return;
    }

    navigate('/dashboard');
  };

  const updateUserById = async ({
    id,
    email,
    password,
    role,
    studies,
    directions,
  }: {
    id: string;
    email: string;
    password?: string;
    role: string;
    studies: Study[];
    directions: Direction[];
  }) => {
    const res = await updateUser({
      id,
      email,
      password,
      role,
      studies,
      directions,
    });

    if (!res.success) {
      alert(res.error.message);
      return;
    }

    navigate('/dashboard');
  };

  const deleteUserById = async ({ id }: { id: string }) => {
    const res = await deleteUser({
      id,
    });

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const clearStateUser = async () => {
    clearState();
  };

  return {
    createNewUser,
    updateUserById,
    deleteUserById,
    getAllUser,
    getUserById,
    user,
    users,
    loadUser,
    clearStateUser,
  };
}
