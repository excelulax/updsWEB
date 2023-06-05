import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Modal, TextInput } from 'flowbite-react';
import noticiaService from '../services/noticiaService'
import notificacionService from '../services/notificacionService';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';


const Notificaciones = () => {
    addLocale('es', {
        startsWith: "comienza con",
        contains: "contiene",
        notContains: "no contiene",
        endsWith: "termina con",
        equals: "igual",
        notEquals: "no igual",
        noFilter: "sin filtro"
    });
    locale("es");
    const toast = useRef(null);
    const [titulo, setTitulo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [valorFiltroGlobal, setValorFiltroGlobal] = useState('');
    const [tipos] = useState(['otros', 'noticias', 'eventos']);
    const [filtros, setFiltros] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        titulo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tipo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        mensaje: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    useEffect(() => {
        const getConsultas = async () => {
            try {
                const data = await notificacionService.getAllData();
                setNotificaciones(data);
                setLoading(false);
            }
            catch (err) { console.log(err); }
        }
        getConsultas();
    }, []);

    const filtroGlobal = (e) => {
        const value = e.target.value;
        let _filters = { ...filtros };
        _filters['global'].value = value;
        setFiltros(_filters);
        setValorFiltroGlobal(value);
    };

    const renderHeader = () => {
        return (
            <div className='flex justify-end'>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={valorFiltroGlobal} onChange={filtroGlobal} placeholder="Busqueda Global" />
                </span>
            </div>
        );
    };

    const AccionesBotones = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    text
                    icon="pi pi-send"
                    rounded
                    outlined
                    severity="warning"
                    label='Reenviar'
                />
            </React.Fragment>
        );
    };
    var currentdate = new Date();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        let obj = {
            mensaje: mensaje,
            titulo: titulo,
            fecha: `${currentdate.getFullYear()}/${currentdate.getMonth()}/${currentdate.getDate()}`,
            hora: `${currentdate.getHours()}:${currentdate.getMinutes()}`,
            tipo: "eventos",
        }
        const res = await notificacionService.setData(obj);
        if (res.length > 0) {
            // let _consultas = consultas.filter((val) => val.id !== consulta.id);
            // setConsultas(_consultas);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Notificacion enviada correctamente.' });
            let _notificaciones = [...notificaciones];
            obj.id = res;
            _notificaciones.push(obj);
            setNotificaciones(_notificaciones);
            setLoadingSubmit(false);
            limpiar();
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al enviar la Notificacion.' });
            setLoadingSubmit(false);
        }
    }

    const tipoListaPlantilla = (option) => {
        return <Tag value={option} />;
    };
    const filtroListaTipo = (options) => {
        return (
            <Dropdown value={options.value} options={tipos} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={tipoListaPlantilla} placeholder="Todos" className="p-column-filter" showClear style={{ minWidth: '2rem' }} />
        );
    };

    const fechaHora = (rowData) => {
        return (
            <>{rowData.fecha} <small className='italic'>{rowData.hora} Hrs</small></>
        );
    };

    const limpiar = () => {
        setTitulo('');
        setMensaje('');
        console.log(notificaciones);
    }

    return <>
        <Toast ref={toast}></Toast>
        <div className='mt-40 w-4/5 h-80 block m-auto'>
            <div className='grid md:grid-cols-12 md:gap-3 w-full'>
                <div className='pri col-span-3'>
                    <div className="w-full min-w-max max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Nueva Notificacion</h5>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titulo</label>
                                <input type="text" name="titulo" id="titulo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="titulo de la notificacion" required value={titulo} onChange={(e) => { setTitulo(e.target.value) }} maxLength="40" autoComplete='off' />
                                {titulo && <small className='text-gray-400'>{titulo.length}/40</small>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mensaje</label>
                                <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="mensaje de la notificacion" value={mensaje} onChange={(e) => { setMensaje(e.target.value) }} maxLength="350"></textarea>
                                {mensaje && <small className='text-gray-400'>{mensaje.length}/350</small>}
                            </div>
                            {/* <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Enviar</button> */}
                            <div className='flex justify-between'>
                                <Button
                                    icon="pi pi-send"
                                    severity="success"
                                    label='Enviar'
                                    loading={loadingSubmit}
                                />
                                <Button
                                    type='button'
                                    text
                                    icon="pi pi-refresh"
                                    severity="danger"
                                    rounded
                                    label='Limpiar formulario'
                                    onClick={limpiar}
                                    loading={loadingSubmit}
                                    style={{ fontSize: '12px' }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className='seg col-span-9'>
                    {/* <div className="relative overflow-x-auto shadow-md sm:rounded-lg"> */}
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <DataTable
                            size="small"
                            value={notificaciones}
                            paginator
                            rows={10}
                            dataKey="id"
                            loading={loading}
                            rowsPerPageOptions={[2, 5, 10, 25, 50]}
                            header={renderHeader}
                            filters={filtros}
                            filterDisplay="row"
                            globalFilterFields={['titulo', 'fecha', 'tipo', 'mensaje']}
                            emptyMessage="Sin Datos."
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} Consultas"
                        >
                            <Column
                                header="Acciones"
                                body={AccionesBotones}
                                headerStyle={{ width: '1rem' }}
                                // style={{ fontWeight: 'bold', textAlign: 'center' }}
                                // body={(data, options) => options.rowIndex + 1}
                                align={'center'}
                            />
                            <Column
                                header="Titulo"
                                field='titulo'
                                sortable
                                filter
                                filterPlaceholder='Buscar Titulo'
                                filterType=''
                                align={'center'}
                                style={{ minWidth: '10rem', maxWidth: "13rem" }}
                                bodyClassName={'whitespace-nowrap overflow-hidden text-ellipsis hover:whitespace-normal'}
                            // bodyStyle={{fontSize:'13px'}}
                            />
                            <Column
                                field="fecha"
                                header="Fecha"
                                body={fechaHora}
                                sortable
                                filter
                                filterPlaceholder="Buscar Fecha"
                                filterType=''
                                style={{ minWidth: '10rem', maxWidth: "14rem" }}
                                align={'center'}
                            />
                            <Column
                                field="tipo"
                                header="Tipo"
                                sortable
                                filter
                                filterElement={filtroListaTipo}
                                // filterPlaceholder="Buscar por Tipo"
                                filterType=''
                                style={{ minWidth: '11rem', maxWidth: "15rem" }}
                                align={'center'}
                            />
                            <Column
                                field="mensaje"
                                header="Mensaje"
                                sortable
                                filter
                                filterPlaceholder='Buscar Mensaje'
                                style={{ minWidth: '10rem', maxWidth: "15rem" }}
                                bodyClassName={'whitespace-nowrap overflow-hidden text-ellipsis hover:whitespace-normal'}
                                filterType=''
                                align={'center'}
                            />
                        </DataTable>
                    </div>
                </div>
                {/* <p className='whitespace-nowrap overflow-hidden text-ellipsis hover:whitespace-normal hover:border-gray-900'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel molestias, non quae corporis in velit aliquid cum quis quasi porro odio quia tempore repellat fuga obcaecati sequi, pariatur sint. Obcaecati?</p> */}
            </div>
        </div>
    </>
}
export default Notificaciones