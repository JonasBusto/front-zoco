import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { UserStudies } from '../interfaces/study';
import { UserDirections } from '../interfaces/direction';
import { API_URL } from '../helpers/constants';
import { User } from '../interfaces/user';

export const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');
  const [token, setToken] = useState<null | string>(null);
  const [role, setRole] = useState<null | string>(null);
  const [isLoadAuth, setIsLoadAuth] = useState(true);
  const { updateUser } = useContext(UserContext);

  const getUserAttributes = async ({ userId }: { userId: string }) => {
    const userStudies = await axios.get(`${API_URL}/user_studies`, {
      params: {
        user_id: userId,
      },
    });
    const userDirections = await axios.get(`${API_URL}/user_directions`, {
      params: {
        user_id: userId,
      },
    });

    const resStudies = await Promise.all(
      userStudies.data.map((study: UserStudies) =>
        axios.get(`${API_URL}/studies/` + study.study_id)
      )
    );
    const studies = resStudies.map((study) => study.data);

    const resDirections = await Promise.all(
      userDirections.data.map((direction: UserDirections) =>
        axios.get(`${API_URL}/directions/${direction.direction_id}`)
      )
    );
    const directions = resDirections.map((direction) => direction.data);

    return { studies, directions };
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        params: { email, password },
      });

      const userCheck = res.data[0];

      if (!userCheck) {
        setErrorAuth('Email o contraseña invalidos');
        return {
          success: false,
          data: null,
          error: {
            message: 'Email o contraseña invalidos',
          },
        };
      }

      const { studies, directions } = await getUserAttributes({
        userId: userCheck.id,
      });
      const token = btoa(`${userCheck.email}:${userCheck.role}`);

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userCheck));

      setIsAuthenticated(true);
      setUser({ ...userCheck, studies, directions });
      setToken(token);
      setRole(userCheck.role);
      setIsLoadAuth(false);
      setErrorAuth('');

      return {
        success: true,
        data: userCheck,
        error: null,
      };
    } catch (error) {
      setErrorAuth('Error al realizar la acción');

      return {
        success: false,
        data: null,
        error: {
          message: 'Error al realizar la acción',
        },
      };
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setRole(null);
  };

  const updateProfile = async (user: User) => {
    try {
      const res = await updateUser({ ...user });

      setUser({ ...res.data });

      return {
        success: true,
        data: { ...res.data },
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

  useEffect(() => {
    const getUser = async () => {
      const checkUser = sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user') || '')
        : null;
      const checkToken = sessionStorage.getItem('token');

      if (checkUser && checkToken) {
        const decodeToken = atob(checkToken);
        const roleFromToken = decodeToken.split(':')[1];

        const { studies, directions } = await getUserAttributes({
          userId: checkUser.id,
        });

        setIsAuthenticated(true);
        setUser({ ...checkUser, studies, directions });
        setRole(roleFromToken);
        setToken(checkToken);
      }
      setIsLoadAuth(false);
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadAuth,
        token,
        role,
        updateProfile,
        isAuthenticated,
        login,
        logout,
        errorAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
