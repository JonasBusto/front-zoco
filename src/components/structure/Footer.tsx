export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='bg-white font-semibold uppercase shadow mt-auto text-center py-2'>
      Prueba tecnica <span className='text-[#B3C300]'>Zoco</span> - {year}
    </footer>
  );
}
