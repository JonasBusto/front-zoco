import { useParams } from 'react-router-dom';
import { Formik, FormikErrors } from 'formik';

import { useStudies } from '../../hooks/useStudies';
import { useEffect } from 'react';
import { Load } from '../../components/component/Load';
import { Study } from '../../interfaces/study';

export function UploadStudy() {
  const { id } = useParams();
  const {
    study,
    getStudyById,
    clearStateStudy,
    createNewStudy,
    updateStudyById,
    loadStudy,
  } = useStudies();

  let valuesForm: Study = {
    id: undefined,
    name: '',
  };

  useEffect(() => {
    if (id) {
      getStudyById({ id });
    } else {
      clearStateStudy();
    }
  }, [id]);

  if (id && study) {
    valuesForm = {
      id: study.id,
      name: study.name,
    };
  }

  if (loadStudy) {
    return <Load />;
  }

  return (
    <div className='w-full'>
      <div className='m-4 mt-10'>
        <Formik
          initialValues={valuesForm}
          enableReinitialize
          validate={(values) => {
            let errors: FormikErrors<Study> = {};

            if (values.name.trim() === '') {
              errors.name = 'Requerido';
            }

            return errors;
          }}
          onSubmit={(values) => {
            if (id && study) {
              updateStudyById({ id, ...values });
            } else {
              createNewStudy({ ...values });
            }
          }}
        >
          {({
            handleSubmit,
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
          }) => (
            <form
              onSubmit={handleSubmit}
              className='bg-white shadow-sm p-4 mx-auto max-w-[800px]'
            >
              <p className='text-center text-xl underline pb-4 uppercase font-bold'>
                Cargar estudio
              </p>
              <div className='mt-4 flex flex-col mb-4'>
                <label htmlFor='email' className='text-gray-800'>
                  Nombre
                </label>
                <input
                  className={`bg-gray-50 ${
                    touched.name && errors.name
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  type='text'
                  name='name'
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.name && errors.name && (
                  <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                    {errors.name}
                  </p>
                )}
              </div>
              <div className='btn-upload d-flex justify-content-center mt-4'>
                <button
                  type='submit'
                  className='w-full bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 mt-5'
                >
                  cargar
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
