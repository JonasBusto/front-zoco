import axios from 'axios';
import { createContext, useState } from 'react';
import { Study, UserStudies } from '../interfaces/study';
import { Direction, UserDirections } from '../interfaces/direction';
import { API_URL } from '../helpers/constants';

export const UserContext = createContext<any>({});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const [loadUser, setLoadUser] = useState(true);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);

      setUsers(res.data);
      setLoadUser(false);

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

  const getUser = async ({ id }: { id: string }) => {
    try {
      setLoadUser(true);
      const res = await axios.get(`${API_URL}/users/${id}`);
      const userStudies = await axios.get(`${API_URL}/user_studies`, {
        params: {
          user_id: id,
        },
      });
      const userDirections = await axios.get(`${API_URL}/user_directions`, {
        params: {
          user_id: id,
        },
      });

      const user = res.data;

      const resStudies = await Promise.all(
        userStudies.data.map((study: UserStudies) =>
          axios.get(`${API_URL}/studies/${study.study_id}`)
        )
      );
      const studies = resStudies.map((study) => study.data);

      const resDirections = await Promise.all(
        userDirections.data.map((direction: UserDirections) =>
          axios.get(`${API_URL}/directions/${direction.direction_id}`)
        )
      );
      const directions = resDirections.map((direction) => direction.data);

      setUser({ ...user, studies, directions });
      setLoadUser(false);

      if (!user) {
        return {
          success: false,
          data: null,
          error: {
            message: 'Usuario no encontrado',
          },
        };
      }

      return {
        success: true,
        data: user,
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
    setUser(null);
    setLoadUser(false);
  };

  const createUser = async ({
    email,
    password,
    role,
    studies,
    directions,
  }: {
    email: string;
    password: string;
    role: string;
    studies: Study[];
    directions: Direction[];
  }) => {
    try {
      const checkUser = await axios.get(`${API_URL}/users`, {
        params: { email },
      });

      if (checkUser.data.length > 0) {
        setLoadUser(false);

        return {
          success: false,
          data: null,
          error: {
            message: 'Usuario con email ya existente',
          },
        };
      }

      const res = await axios.post(`${API_URL}/users`, {
        email,
        password,
        role,
      });

      const studyPromises = studies.map((study) =>
        axios.post(`${API_URL}/user_studies`, {
          user_id: res.data.id,
          study_id: study.id,
        })
      );

      const directionPromises = directions.map((dir) =>
        axios.post(`${API_URL}/user_directions`, {
          user_id: res.data.id,
          direction_id: dir.id,
        })
      );

      await Promise.all([...studyPromises, ...directionPromises]);

      setLoadUser(false);

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

  const updateUser = async ({
    id,
    email,
    password,
    role,
    studies,
    directions,
  }: {
    id: string;
    email: string;
    password: string;
    role: string;
    studies: Study[];
    directions: Direction[];
  }) => {
    try {
      const res = await axios.put(`${API_URL}/users/${id}`, {
        email,
        password,
        role,
      });

      const resCheckStudies = await axios.get(`${API_URL}/user_studies`, {
        params: {
          user_id: id,
        },
      });

      const checkUserStudiesId = resCheckStudies.data.map(
        (study: UserStudies) => study.study_id
      );
      const checkStudiesId = studies.map((study: Study) => study.id);

      const studiesAdded = studies.filter(
        (study) => !checkUserStudiesId.includes(study.id)
      );
      const studiesDeleted = resCheckStudies.data.filter(
        (study: UserStudies) => !checkStudiesId.includes(study.study_id)
      );

      for (let i = 0; i < studiesAdded.length; i++) {
        await axios.post(`${API_URL}/user_studies`, {
          user_id: id,
          study_id: studiesAdded[i].id,
        });
      }

      for (let i = 0; i < studiesDeleted.length; i++) {
        await axios.delete(`${API_URL}/user_studies/${studiesDeleted[i].id}`);
      }

      const resCheckDirections = await axios.get(`${API_URL}/user_directions`, {
        params: {
          user_id: id,
        },
      });

      const checkUserDirectionsid = resCheckDirections.data.map(
        (direction: UserDirections) => direction.direction_id
      );
      const checkDirectionsId = directions.map(
        (direction: Direction) => direction.id
      );

      const directionsAdded = directions.filter(
        (direction) => !checkUserDirectionsid.includes(direction.id)
      );
      const directionsDeleted = resCheckDirections.data.filter(
        (direction: UserDirections) =>
          !checkDirectionsId.includes(direction.direction_id)
      );

      for (let i = 0; i < directionsAdded.length; i++) {
        await axios.post(`${API_URL}/user_directions`, {
          user_id: id,
          direction_id: directionsAdded[i].id,
        });
      }

      for (let i = 0; i < directionsDeleted.length; i++) {
        await axios.delete(
          `${API_URL}/user_directions/${directionsDeleted[i].id}`
        );
      }

      setLoadUser(false);

      return {
        success: true,
        data: { ...res.data, studies, directions },
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

  const deleteUser = async ({ id }: { id: string }) => {
    try {
      const res = await axios.delete(`${API_URL}/users/${id}`);

      const userStudiesDeleteRes = await axios.get(`${API_URL}/user_studies`, {
        params: { user_id: id },
      });
      const userStudiesDelete = userStudiesDeleteRes.data;

      for (let i = 0; i < userStudiesDelete.length; i++) {
        await axios.delete(
          `${API_URL}/user_studies/${userStudiesDelete[i].id}`
        );
      }

      const userDirectionsDeleteRes = await axios.get(
        `${API_URL}/user_directions`,
        { params: { user_id: id } }
      );
      const userDirectionsDelete = userDirectionsDeleteRes.data;

      for (let i = 0; i < userDirectionsDelete.length; i++) {
        await axios.delete(
          `${API_URL}/user_directions/${userDirectionsDelete[i].id}`
        );
      }

      setLoadUser(false);

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

  return (
    <UserContext.Provider
      value={{
        createUser,
        updateUser,
        deleteUser,
        getUsers,
        getUser,
        users,
        user,
        loadUser,
        clearState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
