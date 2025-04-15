import { useParams } from 'react-router-dom';
import { Formik, FormikErrors } from 'formik';
import { useDirections } from '../../hooks/useDirections';
import { useEffect } from 'react';
import { Load } from '../../components/component/Load';
import { Direction } from '../../interfaces/direction';

export function UploadDirection() {
  const { id } = useParams();
  const {
    direction,
    getDirectionById,
    createNewDirection,
    updateDirectionById,
    clearStateDirection,
    loadDirection,
  } = useDirections();

  let valuesForm: Direction = {
    id: undefined,
    name: '',
  };

  useEffect(() => {
    if (id) {
      getDirectionById({ id });
    } else {
      clearStateDirection();
    }
  }, [id]);

  if (id && direction) {
    valuesForm = {
      id: direction.id,
      name: direction.name,
    };
  }

  if (loadDirection) {
    return <Load />;
  }

  return (
    <div className='w-full'>
      <div className='m-4 mt-10'>
        <Formik
          initialValues={valuesForm}
          enableReinitialize
          validate={(values) => {
            let errors: FormikErrors<Direction> = {};

            if (values.name.trim() === '') {
              errors.name = 'Requerido';
            }

            return errors;
          }}
          onSubmit={(values) => {
            if (id && direction) {
              updateDirectionById({ id, ...values });
            } else {
              createNewDirection({ ...values });
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
                Cargar dirección
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
