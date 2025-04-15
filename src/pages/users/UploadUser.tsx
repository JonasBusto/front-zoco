import { useParams } from 'react-router-dom';
import { Formik, FormikErrors } from 'formik';
import { useUsers } from '../../hooks/useUsers';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { useEffect } from 'react';
import { useStudies } from '../../hooks/useStudies';
import { useDirections } from '../../hooks/useDirections';
import { Load } from '../../components/component/Load';
import { User } from '../../interfaces/user';

export function UploadUser() {
  const { id } = useParams();
  const {
    user,
    clearStateUser,
    loadUser,
    getUserById,
    createNewUser,
    updateUserById,
  } = useUsers();
  const { studies, getAllStudies } = useStudies();
  const { directions, getAllDirections } = useDirections();

  let valuesForm: User = {
    id: undefined,
    password: '',
    email: '',
    role: '',
    studies: [],
    directions: [],
  };

  useEffect(() => {
    getAllDirections();
    getAllStudies();
  }, []);

  useEffect(() => {
    if (id) {
      getUserById({ id });
    } else {
      clearStateUser();
    }
  }, [id]);

  if (id && user) {
    valuesForm = {
      id: user.id,
      password: user.password,
      email: user.email,
      role: user.role,
      studies: user.studies,
      directions: user.directions,
    };
  }

  if (loadUser) {
    return <Load />;
  }

  return (
    <div className='w-full'>
      <div className='m-4 mt-10'>
        <Formik
          initialValues={valuesForm}
          validate={(values) => {
            let errors: FormikErrors<User> = {};

            if (values.email.trim() === '') {
              errors.email = 'Requerido';
            } else if (
              !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
                values.email
              )
            ) {
              errors.email = 'Dirección de Email invalida';
            }

            if (errors.role === '') {
              errors.role = 'Requerido';
            }

            if (!id && !user) {
              if (values.password?.trim() === '') {
                errors.password = 'Requerido';
              } else if (/\s/.test(values.password || '')) {
                errors.password = 'La contraseña no puede tener espacios.';
              } else if (
                (values.password || '').split('').length < 6 ||
                (values.password || '').split('').length > 14
              ) {
                errors.password =
                  'La contraseña debe tener entre 6 y 14 caracteres.';
              }
            }

            if (values.role.trim() === '') {
              errors.role = 'Requerido';
            }

            if (values.studies.length === 0) {
              errors.studies = 'Requerido';
            }

            if (values.directions.length === 0) {
              errors.directions = 'Requerido';
            }

            return errors;
          }}
          onSubmit={(values) => {
            if (id && user) {
              updateUserById({ id, ...values });
            } else {
              createNewUser({ ...values });
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
            setFieldValue,
          }) => (
            <form
              onSubmit={handleSubmit}
              className='bg-white shadow-sm p-4 mx-auto max-w-[800px]'
            >
              <p className='text-center text-xl underline pb-4 uppercase font-bold'>
                Cargar usuario
              </p>
              <div className='mt-4 flex flex-col mb-4'>
                <label htmlFor='email' className='text-gray-800'>
                  Email
                </label>
                <input
                  className={`bg-gray-50 ${
                    touched.email && errors.email
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                    user && id ? 'bg-gray-200' : ''
                  }`}
                  type='text'
                  name='email'
                  disabled={user && id ? true : false}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                    {errors.email}
                  </p>
                )}
              </div>
              {(!id || !user) && (
                <div className='flex flex-col mb-4'>
                  <label htmlFor='password'>Contraseña</label>
                  <input
                    className={`bg-gray-50 ${
                      touched.password && errors.password
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                    type='text'
                    name='password'
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.password && errors.password && (
                    <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
              <div className='flex flex-col mb-4'>
                <label htmlFor='role'>Rol</label>
                <select
                  className={`bg-gray-50 ${
                    touched.role && errors.role
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  name='role'
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value=''>Seleccione uno</option>
                  <option value='user'>Usuario</option>
                  <option value='admin'>Administrador</option>
                </select>
                {touched.role && errors.role && (
                  <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                    {errors.role}
                  </p>
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='role'>Estudios</label>
                <MultiSelect
                  value={values.studies}
                  onChange={(e: MultiSelectChangeEvent) => {
                    setFieldValue('studies', e.value);
                  }}
                  options={studies}
                  optionLabel='name'
                  placeholder='Seleccione estudios'
                  maxSelectedLabels={3}
                  className='w-full md:w-20rem'
                />
                {touched.studies && errors.studies && (
                  <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                    {errors.studies as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <label htmlFor='role'>Direcciones</label>
                <MultiSelect
                  value={values.directions}
                  onChange={(e: MultiSelectChangeEvent) => {
                    setFieldValue('directions', e.value);
                  }}
                  options={directions}
                  optionLabel='name'
                  placeholder='Seleccione direcciones'
                  maxSelectedLabels={3}
                  className='w-full md:w-20rem'
                />
                {touched.directions && errors.directions && (
                  <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                    {errors.directions as string}
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
