import { Link } from 'react-router-dom';

export function Error() {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <p className='uppercase font-bold text-4xl'>Error 404</p>
      <p>Pagina no encontrada</p>
      <Link
        to='/dashboard'
        className='bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 px-3 mt-5'
      >
        Volver al inicio
      </Link>
    </div>
  );
}
