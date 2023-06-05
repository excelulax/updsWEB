
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
//noticia
import noticiaService from '../services/noticiaService';

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';


//temas
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { async } from '@firebase/util';
import FormularioRegistro from '../components/FormularioRegistro';
import DetalleNoticia from '../components/DetalleNoticia';

const Noticia = () => {
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

    //modelo de noticia
    let noticiaVacio = {
        id: "",
        titulo: "",
        imagen: "https://static.thenounproject.com/png/1034957-200.png",
        pie: "",
        texto: "",
        prioridad: "",
        fecha: "",
        categoria: "",
        url: "",
        like: 0
    };
    const [ver, mostrar] = useState(false);
    const [verr, detalle] = useState(false);

    const [noticias, setNoticias] = useState([]);
    const [valorFiltroGlobal, setValorFiltroGlobal] = useState('');
    const [noticia, setNoticia] = useState(noticiaVacio);
    const [submitted, setSubmitted] = useState(false);
    const [loadingDT, setLoadingDT] = useState(true);
    const [filtros, setFiltros] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        titulo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        like: { value: null, matchMode: FilterMatchMode.CONTAINS },
        fecha: { value: null, matchMode: FilterMatchMode.CONTAINS },
        texto: { value: null, matchMode: FilterMatchMode.CONTAINS },
        categoria: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [categorias] = useState(['Actividades Academicas', 'Actividades UPDS', 'Extensión', 'Postgrado', 'Responsabilidad Social', 'Socialero UPDS', 'UPDS informa']);
    const [eliminarNoticiaDialogo, setEliminarNoticiaDialogo] = useState(false);
    const [noticiaDialogo, setNoticiaDialogo] = useState(false);

    const ocultarEliminarNoticiaDialogo = () => {
        setEliminarNoticiaDialogo(false);
    };
    const mostrarEliminarNoticiaDialogo = (rowData) => {
        setNoticia(rowData);
        setEliminarNoticiaDialogo(true);
    };

    //traer datos
    useEffect(() => {
        const getNoticias = async () => {
            try {
                const data = await noticiaService.getAllData();
                setNoticias(data);
                setLoadingDT(false);
            }
            catch (err) { console.log(err); }
        }
        getNoticias();
    }, []);


    //mostrar imagen en fila
    const ImagenNoticia = (noticia) => {
        // return <img src={noticia.imagen} alt="imagen" className="w-16 shadow-sm shadow-2 rounded-xl" />;
        return <Image src={noticia.imagen} className="w-16 shadow-sm shadow-2 rounded-xl" alt="Imagen" preview />
    };
    //listar las las categorias para cada fila
    const FilaCategoria = (rowData) => {
        return <Tag value={rowData.categoria} />;
    };
    //listar categorias para filstrar
    const categoriaListaPlantilla = (option) => {
        return <Tag value={option} />;
    };












    //cargar objeto y mostrar modal para editar
    const [index, setIndex] = useState(false);
    const editarNoticia = (noticia, index) => {

        for (let i = 0; i < noticias.length; i++) {
            let element = noticias[i];
            if (element.id === noticia.id) {
                console.log("index: ", i);
                setIndex(i);
                break;
            }
        }
        setNoticia(noticia);
        mostrar(true);

    }

    //cargar objeto y mostrar detalles
    const detalles = (noticia) => {
        setNoticia(noticia);
        detalle(true);
    }

    //listar botonoes de acciones
    const AccionesBotonnes = (rowData, option) => {
        return (
            <React.Fragment>
                <Button text icon="pi pi-eye" rounded outlined severity="success" onClick={() => detalles(rowData)} />
                <Button text icon="pi pi-pencil" rounded outlined severity='help' onClick={() => editarNoticia(rowData, option.rowIndex)} />
                <Button text icon="pi pi-trash" rounded outlined severity="danger" onClick={() => mostrarEliminarNoticiaDialogo(rowData)} />
                <Button text icon="pi pi-send" rounded outlined severity="warning" onClick={() => mostrarEliminarNoticiaDialogo(rowData)} />
            </React.Fragment>
        );
    };









    //buscador global
    const filtroGlobal = (e) => {
        const value = e.target.value;
        let _filters = { ...filtros };
        _filters['global'].value = value;
        setFiltros(_filters);
        setValorFiltroGlobal(value);
    };
    //seleccionar y firltrar por categoria
    const filtroListaCategoria = (options) => {
        return (
            <Dropdown value={options.value} options={categorias} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={categoriaListaPlantilla} placeholder="Todos" className="p-column-filter" showClear style={{ minWidth: '2rem' }} />
        );
    };

    const renderHeader = () => {
        return (
            <div className='flex justify-between'>
                <div className="flex flex-wrap gap-2">
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={() => { mostrar(true); setNoticia(noticiaVacio) }} />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={valorFiltroGlobal} onChange={filtroGlobal} placeholder="Busqueda Global" />
                </span>
            </div>
        );
    };











    const toast = useRef(null);
    //----------------------------------
    const llamadaDeleteData = async (id) => {
        setLoading(true);
        const respuesta = await noticiaService.deleteData(id);
        setLoading(false);

        setEliminarNoticiaDialogo(false);
        if (respuesta === "exito") {
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Noticia eliminada correctamente.' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al eliminar la noticia.' });
        }

        let _noticias = noticias.filter((val) => val.id !== noticia.id);

        setNoticias(_noticias);
        setNoticia(noticiaVacio);

    }
    const [loading, setLoading] = useState(false);
    // ------------------------------------
    //DIALOGO
    const eliminarNoticiaDialogoFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined onClick={ocultarEliminarNoticiaDialogo} />
            <Button
                label="Si"
                icon="pi pi-check"
                loading={loading}
                onClick={() => llamadaDeleteData(noticia.id)}
                severity="danger" />
        </React.Fragment>
    );





    function entrada(obj) {
        let __noticias = [...noticias];
        let __noticia = { ...obj };
        if (noticia.id.length > 0) {
            __noticia.id = noticia.id;
            console.log("indice: ", index);
            console.log("ID: ", __noticia.id);
            __noticias[index] = __noticia;
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Noticia Actualizada', life: 3000 });
        } else {
            __noticias.push(__noticia);
            console.log("nuevo::", obj);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Noticia Agregada', life: 3000 });

        }
        setNoticias(__noticias);
        setIndex(false);
    }







    const noticiaDialogoFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined />
            <Button label="Guardar" icon="pi pi-check" />
        </React.Fragment>
    );

    return (
        <div className="card mt-40 w-11/12 h-80 block m-auto">
            <Toast ref={toast}></Toast>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <DataTable
                    size="small"
                    value={noticias}
                    paginator
                    rows={10}
                    dataKey="id"
                    loading={loadingDT}
                    rowsPerPageOptions={[2, 5, 10, 25, 50]}
                    header={renderHeader}
                    filters={filtros}
                    filterDisplay="row"
                    globalFilterFields={['titulo', 'texto', 'fecha', 'categoria']}
                    emptyMessage="Sin Datos."
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} Noticias">
                    <Column
                        header="#"
                        headerStyle={{ width: '3rem' }}
                        body={(data, options) => options.rowIndex + 1}
                        bodyStyle={{ fontWeight: 'bold' }}
                        style={{ minWidth: '1rem', maxWidth: "2rem" }}
                    />
                    <Column
                        field='imagen'
                        body={ImagenNoticia}
                        header="Imagen"
                        align={'center'}
                        style={{ minWidth: '5rem', maxWidth: "5rem" }}
                    />
                    <Column
                        field="titulo"
                        header="Titulo"
                        sortable
                        filter
                        filterPlaceholder="Buscar Titulo"
                        filterType=''
                        align={'center'}
                        style={{ minWidth: '5rem', maxWidth: "18rem" }}
                    />
                    <Column
                        field="like"
                        header="Like"
                        sortable
                        filter
                        filterPlaceholder="Buscar Like"
                        filterType=''
                        align={'center'}
                        style={{ minWidth: '5rem', maxWidth: "15rem" }}
                    />
                    <Column
                        field="fecha"
                        header="Fecha"
                        sortable
                        filter
                        filterPlaceholder="Buscar Fecha"
                        filterType=''
                        align={'center'}
                        style={{ minWidth: '10rem', maxWidth: "15rem" }}
                    />
                    <Column
                        field='texto'
                        bodyClassName={'whitespace-nowrap overflow-hidden text-ellipsis'}
                        header="Texto"
                        sortable
                        filter
                        filterPlaceholder="Buscar Texto"
                        filterType=''
                        align={'center'}
                        style={{ minWidth: '10rem', maxWidth: "20rem" }}
                    />
                    <Column
                        field='categoria'
                        header="Categoria"
                        showFilterMenu={false}
                        body={FilaCategoria}
                        filter
                        filterElement={filtroListaCategoria}
                        sortable
                        align={'center'}
                        style={{ minWidth: '10rem', maxWidth: "12rem" }}
                    />
                    <Column
                        body={AccionesBotonnes}
                        header="Acciones"
                        exportable={false}
                        style={{ minWidth: '14rem' }}
                        align={'center'}

                    />
                </DataTable>
            </div>


            {/* DIALOGON ELIMINAR NOTICIA */}
            <Dialog visible={eliminarNoticiaDialogo} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={eliminarNoticiaDialogoFooter} onHide={ocultarEliminarNoticiaDialogo}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {noticia && (
                        <span>
                            ¿Estás seguro de que quieres eliminar <b>{noticia.titulo}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
            <FormularioRegistro _mostrar={ver} _cerrar={() => mostrar(false)} _noticia={noticia} _retorno={entrada} />
            <DetalleNoticia _mostrar2={verr} _cerrar2={() => detalle(false)} _noticia2={noticia} />

        </div>
    );
}

export default Noticia;
