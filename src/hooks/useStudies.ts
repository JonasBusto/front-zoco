import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import { useNavigate } from 'react-router-dom';

export function useStudies() {
  const {
    createStudy,
    updateStudy,
    deleteStudy,
    getStudies,
    getStudy,
    study,
    studies,
    clearState,
    loadStudy,
    checkUse,
  } = useContext(StudyContext);
  const navigate = useNavigate();

  const getAllStudies = async () => {
    const res = await getStudies();

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const getStudyById = async ({ id }: { id: string }) => {
    const res = await getStudy({ id });

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const createNewStudy = async ({ name }: { name: string }) => {
    const res = await createStudy({
      name,
    });

    if (!res.success) {
      alert(res.error.message);
    }

    navigate('/studies');
  };

  const updateStudyById = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    const res = await updateStudy({
      id,
      name,
    });

    if (!res.success) {
      alert(res.error.message);
    }

    navigate('/studies');
  };

  const deleteStudyById = async ({ id }: { id: string }) => {
    const res = await deleteStudy({
      id,
    });

    if (!res.success) {
      alert(res.error.message);
    }
  };

  const clearStateStudy = async () => {
    clearState();
  };

  const checkUseStudies = async (id: string) => {
    const res = await checkUse({ id });

    if (!res.success) {
      return [];
    }

    return res.data;
  };

  return {
    createNewStudy,
    updateStudyById,
    deleteStudyById,
    getAllStudies,
    getStudyById,
    study,
    studies,
    clearStateStudy,
    loadStudy,
    checkUseStudies,
  };
}
