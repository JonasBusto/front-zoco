import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { useStudies } from '../../hooks/useStudies';
import { Load } from '../../components/component/Load';
import { Study } from '../../interfaces/study';
import { User } from '../../interfaces/user';

export function ActionStudy({
  study,
  deleteStudy,
  checkUse,
}: {
  study: Study;
  deleteStudy: (id: string) => void;
  checkUse: (id: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [checkUseStudies, setCheckUseStudies] = useState<null | User[]>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const getCheckUse = async () => {
      const res: any = await checkUse(study.id || '');
      setCheckUseStudies(res);
    };

    getCheckUse();
  }, []);

  if (!checkUseStudies) {
    return <Load />;
  }

  return (
    <div className='flex'>
      <Link
        to={'/studies/upload/' + study.id}
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
        header={'Eliminar Estudio ' + study.id}
        headerStyle={{ padding: '10px' }}
        className='w-96'
      >
        {checkUseStudies?.length > 0 ? (
          <div className='p-2'>
            <p className='text-red-400 font-bold mb-3'>
              Este estudio no puede ser eliminado ya que esta asociado a los
              usuarios:
            </p>
            <div className='flex flex-col'>
              {checkUseStudies.map((user, index) => (
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
            <p>¿Está seguro de eliminar este estudio?</p>
            <div className='flex justify-between mt-3'>
              <button
                onClick={handleClose}
                className='bg-[#B3C300] text-white w-36 p-2 hover:opacity-90 hover:cursor-pointer'
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteStudy(study.id || '');
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

export function StudyList() {
  const {
    studies,
    checkUseStudies,
    deleteStudyById,
    getAllStudies,
    loadStudy,
  } = useStudies();

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    getAllStudies();
  }, []);

  if (loadStudy) {
    return <Load />;
  }

  return (
    <div className='mx-10 mt-10'>
      <div className='bg-white mx-auto max-w-[1000px] p-5'>
        <div className='mb-4'>
          <div className='flex flex-wrap justify-between items-center mb-2'>
            <p className='font-bold text-xl uppercase'>Lista de estudios</p>
            <Link
              to='/studies/upload'
              className='bg-[#B3C300] hover:opacity-90 hover:cursor-pointer uppercase text-white py-2 px-5'
            >
              <i className='pi pi-plus sm:me-3'></i>
              <span className='hidden sm:inline-block'>Agregar</span>
            </Link>
          </div>
          <InputText
            placeholder='Buscar Estudio'
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
          value={studies}
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
            body={(study) => (
              <ActionStudy
                deleteStudy={() => deleteStudyById({ id: study.id })}
                study={study}
                checkUse={checkUseStudies}
              />
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
