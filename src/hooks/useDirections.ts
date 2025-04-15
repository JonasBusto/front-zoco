import { useContext } from 'react';
import { DirectionContext } from '../context/DirectionContext';
import { useNavigate } from 'react-router-dom';

export function useDirections() {
  const {
    createDirection,
    updateDirection,
    deleteDirection,
    getDirections,
    getDirection,
    direction,
    directions,
    clearState,
    loadDirection,
    checkUse,
  } = useContext(DirectionContext);
  const navigate = useNavigate();

  const getAllDirections = async () => {
    const res = await getDirections();

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const getDirectionById = async ({ id }: { id: string }) => {
    const res = await getDirection({ id });

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const createNewDirection = async ({ name }: { name: string }) => {
    const res = await createDirection({
      name,
    });

    if (!res.success) {
      alert(res.error.message);
    }

    navigate('/directions');
  };

  const updateDirectionById = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    const res = await updateDirection({
      id,
      name,
    });

    if (!res.success) {
      alert(res.error.message);
    }

    navigate('/directions');
  };

  const deleteDirectionById = async ({ id }: { id: string }) => {
    const res = await deleteDirection({
      id,
    });

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const clearStateDirection = async () => {
    clearState();
  };

  const checkUseDirections = async (id: string) => {
    const res = await checkUse({ id });

    if (!res.success) {
      return [];
    }

    return res.data;
  };

  return {
    createNewDirection,
    updateDirectionById,
    deleteDirectionById,
    getAllDirections,
    getDirectionById,
    direction,
    directions,
    clearStateDirection,
    loadDirection,
    checkUseDirections,
  };
}
