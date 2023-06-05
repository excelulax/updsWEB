

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
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import updsRespondeService from '../services/updsRespondeService';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import DetalleUPDSresponde from '../components/DetalleUPDSresponde';

const UpdsResponde = () => {
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
    let consultaVacia = {
        categoria: "",
        celular: "",
        consulta: "",
        email: "",
        estado: true,
        fecha: "",
        hora: "",
        nombre: "",
        respuesta: "",
        telefono: "",
        tipoConsulta: "",
        urlMasInformacion: ""
    }
    const toast = useRef(null);
    const [consulta, setConsulta] = useState(consultaVacia);

    const [respuesta, setRespuesta] = useState('');
    const [url, setUrl] = useState('');

    const [consultas, setConsultas] = useState([]);
    const [dialogoEliminar, setDialogoEliminar] = useState(false);
    const [loadingEliminar, setLoadingEliminar] = useState(false);
    const [loadingResponder, setLoadingResponder] = useState(false);
    const [modalDetalle, setModalDetalle] = useState(false);
    const [loading, setLoading] = useState(true);
    const [valorFiltroGlobal, setValorFiltroGlobal] = useState('');
    const [tipos] = useState(['Preguntas', 'Sugerencias', 'Reclamos', 'Felicitaciones']);
    const [categorias] = useState(['Estudiantes', 'Padres de Familia', 'Docentes', 'Otros']);
    const [filtros, setFiltros] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tipoConsulta: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha: { value: null, matchMode: FilterMatchMode.CONTAINS },
        categoria: { value: null, matchMode: FilterMatchMode.CONTAINS },
        consulta: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    useEffect(() => {
        const getConsultas = async () => {
            try {
                const data = await updsRespondeService.getAllData();
                const objetosConEstadoTrue = data.filter((objeto) => objeto.estado === true);
                setConsultas(objetosConEstadoTrue);
                setLoading(false);
            }
            catch (err) { console.log(err); }
        }
        getConsultas();
    }, []);

    const categoriaListaPlantilla = (option) => {
        return <Tag value={option} />;
    };

    const tipoListaPlantilla = (option) => {
        return <Tag value={option} />;
    };

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
    const filtroListaCategoria = (options) => {
        return (
            <Dropdown value={options.value} options={categorias} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={categoriaListaPlantilla} placeholder="Todos" className="p-column-filter" showClear style={{ minWidth: '2rem' }} />
        );
    };

    const filtroListaTipo = (options) => {
        return (
            <Dropdown value={options.value} options={tipos} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={tipoListaPlantilla} placeholder="Todos" className="p-column-filter" showClear style={{ minWidth: '2rem' }} />
        );
    };
    const AccionesBotones = (rowData) => {
        return (
            <React.Fragment>
                <Button text icon="pi pi-eye" rounded outlined severity="warning" onClick={() => { modalDetalleMostrar(rowData) }} />
                <Button text icon="pi pi-trash" rounded outlined severity="danger" onClick={() => { dialogoEliminarMostrar(rowData) }} />
            </React.Fragment>
        );
    };

    const fechaHora = (rowData) => {
        return (
            <>{rowData.fecha} <small className='italic'>{rowData.hora} Hrs</small></>
        );
    };

    const modalDetalleMostrar = (data) => {
        setConsulta(data);
        setModalDetalle(true);
    }

    const dialogoEliminarOcultar = () => {
        setDialogoEliminar(false);
    }
    const dialogoEliminarMostrar = (data) => {
        setConsulta(data);
        setDialogoEliminar(true);
    }

    const eliminarConsulta = async () => {
        setLoadingEliminar(true);
        const res = await updsRespondeService.deleteData(consulta.id);
        if (res === "exito") {
            let _consultas = consultas.filter((val) => val.id !== consulta.id);
            setConsultas(_consultas);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Consulta eliminada correctamente.' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al eliminar la Consulta.' });
        }
        dialogoEliminarOcultar();
        setLoadingEliminar(false);
    }

    const dialogoEliminarFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={dialogoEliminarOcultar}
            />
            <Button
                label="Si"
                icon="pi pi-check"
                loading={loadingEliminar}
                onClick={eliminarConsulta}
                severity="danger"
            />
        </React.Fragment>
    );

    function entrada(obj) {
        setModalDetalle(false);
        let _consultas = [...consultas];
        for (let i = 0; i < _consultas.length; i++) {
            if (_consultas[i].id === obj.id) {
                _consultas[i] = obj;
                break;
            }
        }
        setConsultas(_consultas);
    }

    return (<>
        <Toast ref={toast}></Toast>
        <div className="card mt-40 w-11/12 h-80 block m-auto">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <DataTable
                    size="small"
                    value={consultas}
                    paginator
                    rows={10}
                    dataKey="id"
                    loading={loading}
                    rowsPerPageOptions={[2, 5, 10, 25, 50]}
                    header={renderHeader}
                    filters={filtros}
                    filterDisplay="row"
                    globalFilterFields={['nombre', 'fecha', 'categoria', 'textoConsulta', 'tipoConsulta']}
                    emptyMessage="Sin Datos."
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} Consultas"
                >
                    <Column
                        header="#"
                        headerStyle={{ width: '1rem' }}
                        style={{ fontWeight: 'bold', textAlign: 'center' }}
                        body={(data, options) => options.rowIndex + 1}
                        align={'center'}
                    />
                    <Column
                        header="Tipo Consulta"
                        field='tipoConsulta'
                        sortable
                        filter
                        filterElement={filtroListaTipo}
                        align={'center'}
                    />
                    <Column
                        field="nombre"
                        header="Nombre"
                        sortable
                        filter
                        filterPlaceholder="Buscar por Nombre"
                        filterType=''
                        style={{ minWidth: '15rem', maxWidth: "16rem" }}
                        align={'center'}
                    />
                    <Column
                        field="fecha"
                        header="Fecha"
                        body={fechaHora}
                        sortable
                        filter
                        filterPlaceholder="Buscar por Fecha"
                        filterType=''
                        style={{ minWidth: '15rem', maxWidth: "15rem" }}
                        align={'center'}
                    />
                    <Column
                        field="categoria"
                        header="Categoria"
                        sortable
                        filter
                        filterElement={filtroListaCategoria}
                        style={{ minWidth: '10rem', maxWidth: "14rem" }}
                        align={'center'}
                    />
                    <Column
                        field='consulta'
                        header="Consulta"
                        bodyClassName={'whitespace-nowrap overflow-hidden text-ellipsis'}
                        sortable
                        filter
                        filterPlaceholder="Buscar por Texto"
                        filterType=''
                        style={{ minWidth: '15rem', maxWidth: "20rem" }}
                        align={'center'}
                    />
                    <Column
                        body={AccionesBotones}
                        header="Acciones"
                        exportable={false}
                        style={{ minWidth: '8rem', maxWidth: "10rem" }}
                        align={'center'}
                    />
                </DataTable>
            </div>

            {/* DIALOGO ELIMINAR CONSULTA */}
            <Dialog visible={dialogoEliminar} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={dialogoEliminarFooter} onHide={dialogoEliminarOcultar}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        ¿Estás seguro de que quieres eliminar la consulta?
                    </span>
                </div>
            </Dialog>
            <DetalleUPDSresponde _mostrar={modalDetalle} _cerrar={() => setModalDetalle(false)} _detalle={consulta} _retorno={entrada} />


            {/* <Modal show={modalDetalle} onClose={() => { setModalDetalle(false) }} size="2xl" position="center">
                <Modal.Header>
                    {consulta.tipoConsulta}
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <tbody>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th scope="row" className="w-2/4 px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                Nombre:
                                            </th>
                                            <td className="w-2/4 px-6 py-4">
                                                {consulta.nombre}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                Categoria:
                                            </th>
                                            <td className="px-6 py-4">
                                                {consulta.categoria}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                Telefono:
                                            </th>
                                            <td className="px-6 py-4">
                                                {consulta.telefono}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                Celular:
                                            </th>
                                            <td className="px-6 py-4">
                                                {consulta.celular}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                Tipo Consulta:
                                            </th>
                                            <td className="px-6 py-4">
                                                {consulta.tipoConsulta}
                                            </td>
                                        </tr>
                                        <tr >
                                            <th colSpan={2} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white dark:bg-gray-800">
                                                Texto Consulta:
                                            </th>
                                        </tr>
                                        <tr >
                                            <th colSpan={2} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-violet-200 dark:text-white dark:bg-gray-800">
                                                <p className='whitespace-pre-line'>
                                                    {consulta.consulta}
                                                </p>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                Fecha:
                                            </th>
                                            <td className="px-6 py-4">
                                                {consulta.fecha} <small className='italic'>{consulta.hora} Hrs</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='p-2'>
                                    <div>
                                        <label htmlFor="respuesta" className="pt-2 mx-2 block mb-2 text-base font-medium text-gray-900 dark:text-white">Respuesta</label>
                                        <textarea id="respuesta" rows="4" className=" block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escribir la respuesta aqui ..." name='respuesta' onChange={inputRespuesta} defaultValue={respuesta}></textarea>
                                    </div>
                                    <div className='mt-4'>
                                        <label htmlFor="url" className="mx-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL para más información</label>
                                        <input type="text" id="url" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='formato: http://www.example.com' name='url'
                                            onChange={(e)=> {setUrl(e.target.value)}} defaultValue={url} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-between w-full">
                        <div>
                            <Button
                                label="Responder"
                                icon="pi pi-send"
                                loading={loadingResponder}
                                onClick={responder}
                            />
                        </div>
                        <div className='flex items-center'>
                            <p>{consulta.fecha} <small className='italic'>{consulta.hora} Hrs</small></p>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal> */}
        </div>
    </>

    );
}

export default UpdsResponde