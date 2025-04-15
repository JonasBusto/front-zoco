import axios from 'axios';
import { createContext, useState } from 'react';
import { Direction } from '../interfaces/direction';
import { API_URL } from '../helpers/constants';

export const DirectionContext = createContext<any>({});

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [directions, setDirections] = useState<null | Direction[]>(null);
  const [direction, setDirection] = useState(null);
  const [loadDirection, setLoadDirection] = useState(true);

  const getDirections = async () => {
    try {
      const res = await axios.get(`${API_URL}/directions`);

      setDirections(res.data);
      setLoadDirection(false);

      return {
        success: true,
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  const getDirection = async ({ id }: { id: string }) => {
    try {
      const res = await axios.get(`${API_URL}/directions/${id}`);

      const direction = res.data;

      if (!direction) {
        return {
          success: false,
          data: null,
          error: {
            message: 'Dirección no encontrada',
          },
        };
      }

      setDirection(direction);
      setLoadDirection(false);

      return {
        success: true,
        data: direction,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  const clearState = () => {
    setDirection(null);
    setLoadDirection(false);
  };

  const createDirection = async ({ name }: { name: string }) => {
    try {
      const res = await axios.post(`${API_URL}/directions/`, {
        name,
      });

      setLoadDirection(false);

      return {
        success: true,
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  const updateDirection = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    try {
      const res = await axios.put(`${API_URL}/directions/${id}`, {
        name,
      });

      setLoadDirection(false);

      return {
        success: true,
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  const deleteDirection = async ({ id }: { id: string }) => {
    try {
      const res = await axios.delete(`${API_URL}/directions/${id}`);

      const newArray = directions
        ? directions?.filter(
            (direction: Direction) =>
              (direction.id || '').toString() !== id.toString()
          )
        : [];

      setLoadDirection(false);
      setDirections(newArray);

      return {
        success: true,
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  const checkUse = async ({ id }: { id: string }) => {
    try {
      const res = await axios.get(`${API_URL}/user_directions`, {
        params: {
          direction_id: id,
        },
      });

      const studiesUse = res.data;

      let usersInvolved = [];

      for (let i = 0; i < studiesUse.length; i++) {
        const resUser = await axios.get(
          `${API_URL}/users/${studiesUse[i].user_id}`
        );

        if (resUser.data) {
          usersInvolved.push(resUser.data);
        }
      }

      return {
        success: true,
        data: usersInvolved,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  return (
    <DirectionContext.Provider
      value={{
        createDirection,
        updateDirection,
        deleteDirection,
        clearState,
        getDirections,
        getDirection,
        directions,
        direction,
        loadDirection,
        checkUse,
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
}
