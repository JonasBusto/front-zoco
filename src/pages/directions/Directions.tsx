import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { useDirections } from '../../hooks/useDirections';
import { Load } from '../../components/component/Load';
import { Direction } from '../../interfaces/direction';
import { User } from '../../interfaces/user';

export function ActionDirection({
  direction,
  deleteDirection,
  checkUse,
}: {
  direction: Direction;
  deleteDirection: (id: string) => void;
  checkUse: (id: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [checkUseDirections, setCheckUseDirections] = useState<null | User[]>(
    null
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const getCheckUse = async () => {
      const res: any = await checkUse(direction.id || '');
      setCheckUseDirections(res);
    };

    getCheckUse();
  }, []);

  if (!checkUseDirections) {
    return <Load />;
  }

  return (
    <div className='flex'>
      <Link
        to={'/directions/upload/' + direction.id}
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
        header={'Eliminar Dirección ' + direction.id}
        headerStyle={{ padding: '10px' }}
        className='w-96'
      >
        {checkUseDirections?.length > 0 ? (
          <div className='p-2'>
            <p className='text-red-400 font-bold mb-3'>
              Esta dirección no puede ser eliminada ya que esta asociada a los
              usuarios:
            </p>
            <div className='flex flex-col'>
              {checkUseDirections.map((user, index) => (
                <Link
                  to={'/users/upload/' + user.id}
                  className='text-gray-700 font-bold hover:underline uppercase'
                  key={user.id}
                >
                  {index + 1 + '. ' + user.email}
                </Link>
              ))}
            </div>
            <p className='text-[#B3C300] font-bold mt-6'>
              Elimine las asociaciones y vuelva a intentarlo
            </p>
          </div>
        ) : (
          <div className='p-4'>
            <p>¿Está seguro de eliminar esta dirección?</p>
            <div className='flex justify-between mt-3'>
              <button
                onClick={handleClose}
                className='bg-[#B3C300] text-white w-36 p-2 hover:opacity-90 hover:cursor-pointer'
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteDirection(direction?.id || '');
                  handleClose();
                }}
                className='bg-red-400 text-white w-36 p-2 hover:opacity-90 hover:cursor-pointer'
              >
                <i className='pi pi-check'></i>Confirmar
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export function DirectionList() {
  const {
    directions,
    checkUseDirections,
    deleteDirectionById,
    getAllDirections,
    loadDirection,
  } = useDirections();

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    getAllDirections();
  }, []);

  if (loadDirection) {
    return <Load />;
  }

  return (
    <div className='mx-10 mt-10'>
      <div className='bg-white mx-auto max-w-[1000px] p-5'>
        <div className='mb-4'>
          <div className='flex flex-wrap justify-between items-center mb-2'>
            <p className='font-bold text-xl uppercase'>Lista de direcciones</p>
            <Link
              to='/directions/upload'
              className='bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 px-5'
            >
              <i className='pi pi-plus sm:me-3'></i>
              <span className='hidden sm:inline-block'>Agregar</span>
            </Link>
          </div>
          <InputText
            placeholder='Buscar Dirección'
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
          value={directions}
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
            field='name'
            header='Nombre'
            style={{ minWidth: '300px' }}
          ></Column>
          <Column
            header='Acciones'
            body={(direction) => (
              <ActionDirection
                deleteDirection={() =>
                  deleteDirectionById({ id: direction.id })
                }
                direction={direction}
                checkUse={checkUseDirections}
              />
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
