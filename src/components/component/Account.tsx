import { Formik, FormikErrors } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useDirections } from '../../hooks/useDirections';
import { useStudies } from '../../hooks/useStudies';
import { Load } from './Load';
import { User } from '../../interfaces/user';

export function Account() {
  const { user, isLoadAuth, updateProfileUser } = useAuth();
  const { directions, getAllDirections } = useDirections();
  const { studies, getAllStudies } = useStudies();
  const [isEdit, setIsEdit] = useState(false);

  const handleChangeIsEdit = () => {
    setIsEdit(!isEdit);
  };

  let valuesForm: User = {
    email: '',
    password: '',
    role: '',
    studies: [],
    directions: [],
  };

  useEffect(() => {
    getAllDirections();
    getAllStudies();
  }, []);

  if (user) {
    valuesForm = {
      id: user.id,
      password: user.password,
      email: user.email,
      role: user.role,
      studies: user.studies,
      directions: user.directions,
    };
  }

  if (isLoadAuth) {
    return <Load />;
  }

  return (
    <div className='mx-5 my-3'>
      <div className='bg-white max-w-[900px] mx-auto shadow-sm p-5'>
        <div className='flex flex-wrap justify-between'>
          <h1 className='text-2xl uppercase font-bold'>Mi cuenta</h1>
          <div className='flex'>
            {isEdit ? (
              <button
                className='bg-red-400 uppercase text-white px-4 py-2 hover:opacity-90 hover:cursor-pointer'
                onClick={handleChangeIsEdit}
              >
                <i className='pi pi-times inline-block sm:!hidden'></i>
                <span className='hidden sm:inline-block'>Cancelar</span>
              </button>
            ) : (
              <button
                className='bg-[#B3C300] uppercase text-white px-4 py-2 hover:opacity-90 hover:cursor-pointer'
                onClick={handleChangeIsEdit}
              >
                <i className='pi pi-user-edit inline-block sm:!hidden'></i>
                <span className='hidden sm:inline-block'>Editar</span>
              </button>
            )}
          </div>
        </div>
        <div>
          {isEdit ? (
            <Formik
              initialValues={valuesForm}
              validate={() => {
                let errors: FormikErrors<User> = {};

                return errors;
              }}
              onSubmit={(values) => {
                updateProfileUser({ ...values }).then(() => {
                  setIsEdit(false);
                });
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
                errors,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className='mt-4 flex flex-col mb-4'>
                    <label htmlFor='email' className='text-gray-800'>
                      Email
                    </label>
                    <input
                      className={`bg-gray-50 ${
                        touched.email && errors.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white bg-gray-200`}
                      type='text'
                      name='email'
                      disabled={true}
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
                    {touched.role && errors.role && (
                      <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                        {errors.role}
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
                    {touched.role && errors.role && (
                      <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                        {errors.role}
                      </p>
                    )}
                  </div>
                  <div className='btn-upload d-flex justify-content-center mt-4'>
                    <button
                      type='submit'
                      className='w-full bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 mt-5'
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          ) : (
            <div className='flex flex-col mt-4'>
              <div className='mb-3'>
                <p className='uppercase'>Email:</p>
                <p className='text-gray-700 font-bold'>{user.email}</p>
              </div>
              <div className='mb-3'>
                <p className='uppercase'>Estudios:</p>
                <DataTable value={user.studies} showGridlines>
                  <Column
                    field='id'
                    header='ID'
                    style={{ width: '10rem' }}
                  ></Column>
                  <Column field='name' header='Nombre'></Column>
                </DataTable>
              </div>
              <div className='mb-3'>
                <p className='uppercase'>Direcciones:</p>
                <DataTable value={user.directions} showGridlines>
                  <Column
                    field='id'
                    header='ID'
                    style={{ width: '10rem' }}
                  ></Column>
                  <Column field='name' header='Nombre'></Column>
                </DataTable>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
