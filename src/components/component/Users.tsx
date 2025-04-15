import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { useUsers } from '../../hooks/useUsers';
import { Load } from './Load';
import { User } from '../../interfaces/user';

export function ActionUser({
  user,
  deleteUser,
}: {
  user: User;
  deleteUser: (id: string) => void;
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='flex'>
      <Link
        to={'/users/upload/' + user.id}
        className='flex items-center justify-center bg-[#B3C300] hover:opacity-90 hover:cursor-pointer text-white w-11 h-11 mx-2'
      >
        <i className='pi pi-file-edit'></i>
      </Link>
      <button
        className='bg-red-400 hover:opacity-90 hover:cursor-pointer text-white w-11 h-11 mx-2'
        onClick={handleShow}
      >
        <i className='pi pi-trash'></i>
      </button>

      <Dialog
        visible={show}
        onHide={handleClose}
        header={'Eliminar Usuario ' + user.id}
        headerStyle={{ padding: '10px' }}
        className='w-96'
      >
        <div className='p-4'>
          <p>¿Está seguro de eliminar este usuario?</p>
          <div className='flex justify-between mt-3'>
            <button
              onClick={handleClose}
              className='bg-[#B3C300] text-white w-36 p-2 hover:opacity-90 hover:cursor-pointer'
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                deleteUser(user?.id || '');
                handleClose();
              }}
              className='bg-red-400 text-white w-36 p-2 hover:opacity-90 hover:cursor-pointer'
            >
              <i className='pi pi-check'></i>Confirmar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export function UserList() {
  const { users, deleteUserById, getAllUser, loadUser } = useUsers();

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    getAllUser();
  }, []);

  if (loadUser) {
    return <Load />;
  }

  return (
    <div className='mx-10 mt-10'>
      <div className='bg-white mx-auto max-w-[1000px] p-5'>
        <div className='mb-4'>
          <div className='flex flex-wrap justify-between items-center mb-2'>
            <p className='font-bold text-xl uppercase'>Lista de usuarios</p>
            <Link
              to='/users/upload'
              className='bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 px-5'
            >
              <i className='pi pi-plus sm:me-3'></i>
              <span className='hidden sm:inline-block'>Agregar</span>
            </Link>
          </div>
          <InputText
            placeholder='Buscar Usuario'
            className='border text-gray-900 text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
            onInput={(e) => {
              setFilters({
                global: {
                  value: e.currentTarget.value,
                  matchMode: FilterMatchMode.CONTAINS,
                },
              });
            }}
          />
        </div>

        <DataTable
          paginator
          stripedRows
          removableSort
          selectionMode='single'
          filters={filters}
          rows={5}
          emptyMessage='Sin resultados'
          rowsPerPageOptions={[5, 10, 25, 50]}
          value={users}
        >
          <Column
            sortable
            field='id'
            header='ID'
            className='py-5 px-4'
            headerStyle={{
              padding: '15px',
            }}
          ></Column>
          <Column
            sortable
            field='email'
            header='Email'
            style={{ minWidth: '300px' }}
          ></Column>
          <Column
            sortable
            field='role'
            header='Rol'
            style={{ minWidth: '300px' }}
          ></Column>
          <Column
            header='Acciones'
            body={(user) => (
              <ActionUser
                deleteUser={() => deleteUserById({ id: user.id })}
                user={user}
              />
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
