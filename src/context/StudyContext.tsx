import axios from 'axios';
import { createContext, useState } from 'react';
import { Study } from '../interfaces/study';
import { API_URL } from '../helpers/constants';

export const StudyContext = createContext<any>({});

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [studies, setStudies] = useState<null | Study[]>(null);
  const [study, setStudy] = useState(null);
  const [loadStudy, setLoadStudy] = useState(true);

  const getStudies = async () => {
    try {
      const res = await axios.get(`${API_URL}/studies`);

      setStudies(res.data);
      setLoadStudy(false);

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

  const getStudy = async ({ id }: { id: string }) => {
    try {
      const res = await axios.get(`${API_URL}/studies/${id}`);

      const study = res.data;

      setStudy(study);
      setLoadStudy(false);

      if (!study) {
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
        data: study,
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
    setStudy(null);
    setLoadStudy(false);
  };

  const createStudy = async ({ name }: { name: string }) => {
    try {
      const res = await axios.post(`${API_URL}/studies/`, {
        name,
      });

      setLoadStudy(false);

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

  const updateStudy = async ({ id, name }: { id: string; name: string }) => {
    try {
      const res = await axios.put(`${API_URL}/studies/${id}`, {
        name,
      });

      setLoadStudy(false);

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

  const deleteStudy = async ({ id }: { id: string }) => {
    try {
      const res = await axios.delete(`${API_URL}/studies/${id}`);

      const newArray = studies
        ? studies?.filter(
            (study: Study) => (study.id || '').toString() !== id.toString()
          )
        : [];

      setStudies(newArray);
      setLoadStudy(false);

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
      const res = await axios.get(`${API_URL}/user_studies`, {
        params: {
          study_id: id,
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
    <StudyContext.Provider
      value={{
        createStudy,
        updateStudy,
        deleteStudy,
        getStudies,
        getStudy,
        studies,
        study,
        loadStudy,
        clearState,
        checkUse,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}
