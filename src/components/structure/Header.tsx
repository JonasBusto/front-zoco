import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logoutUser } = useAuth();

  return (
    <header className='bg-white px-3 py-2'>
      <nav className='flex justify-between max-w-[1000px] mx-auto'>
        <div className='flex items-center justify-center'>
          <Link
            to='/dashboard'
            className='flex hover:cursor-pointer hover:opacity-90 items-center justify-center w-12 h-12 text-white bg-[#B3C300]'
          >
            <i className='pi pi-home text-lg'></i>
          </Link>
        </div>
        {user.role === 'admin' && (
          <div className='flex flex-wrap items-center'>
            <Link
              to='/studies'
              className='font-bold uppercase mx-3 hover:text-[#B3C300] border-2 border-s-black hover:border-s-[#B3C300] px-3 py-2 sm:border-0 sm:p-0'
            >
              <i className='pi pi-address-book inline-block sm:!hidden'></i>
              <span className='hidden sm:inline-block'>Estudios</span>
            </Link>
            <Link
              to='/directions'
              className='font-bold uppercase mx-3 hover:text-[#B3C300] border-2 border-s-black hover:border-s-[#B3C300] px-3 py-2 sm:border-0 sm:p-0'
            >
              <i className='pi pi-map-marker inline-block sm:!hidden'></i>
              <span className='hidden sm:inline-block'>Direcciones</span>
            </Link>
          </div>
        )}
        <button
          onClick={logoutUser}
          className='flex hover:cursor-pointer hover:opacity-90 items-center justify-center w-12 h-12 text-white bg-red-400'
        >
          <i className='pi pi-sign-out text-lg'></i>
        </button>
      </nav>
    </header>
  );
}
