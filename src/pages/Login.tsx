import { Formik, FormikErrors } from 'formik';
import { useAuth } from '../hooks/useAuth';
import { AuthUser } from '../interfaces/user';

export function Login() {
  const { errorAuth, loginUser } = useAuth();

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col items-center justify-center mt-10'>
        <p className='text-3xl text-[#2D3035] font-bold'>Prueba tecnica</p>
        <img
          width={150}
          src='https://zocoweb.com.ar/static/media/logo.e3c0b2196cc23f84f67a.png'
          alt='logo_auth'
        />
      </div>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          let errors: FormikErrors<AuthUser> = {};

          if (values.email.trim() === '') {
            errors.email = 'Requerido';
          } else if (
            !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
              values.email
            )
          ) {
            errors.email = 'Dirección de Email invalida';
          }

          if (values.password.trim() === '') {
            errors.password = 'Requerido';
          } else if (/\s/.test(values.password)) {
            errors.password = 'La contraseña no puede tener espacios.';
          } else if (
            values.password.split('').length < 6 ||
            values.password.split('').length > 14
          ) {
            errors.password =
              'La contraseña debe tener entre 6 y 14 caracteres.';
          }

          return errors;
        }}
        onSubmit={(values) => {
          loginUser({ ...values });
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
        }) => (
          <form
            onSubmit={handleSubmit}
            className='w-full shadow-md mt-10 max-h-80 flex flex-col justify-center p-10 bg-white max-w-md mx-auto'
          >
            <p className='text-center pb-4 uppercase font-bold'>
              Iniciar sesión
            </p>
            <input
              type='text'
              id='email'
              name='email'
              placeholder='email'
              className={`bg-gray-50 ${
                touched.email && errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                {errors.email}
              </p>
            )}
            <input
              type='text'
              id='password'
              name='password'
              placeholder='password'
              className={`mt-4 bg-gray-50 ${
                touched.password && errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              } border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <p className='text-start text-red-500 text-[10px] uppercase font-bold'>
                {errors.password}
              </p>
            )}
            <button
              type='submit'
              className='bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 mt-5'
            >
              Iniciar Sesión
            </button>
            {errorAuth && (
              <p className='text-center text-red-500 text-sm pt-4 uppercase font-bold'>
                {errorAuth}
              </p>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
}
