import React, { useState, useEffect, useRef } from 'react'
import { Modal, Label, TextInput, Checkbox, FileInput, Textarea, Select, Dropdown, Radio } from 'flowbite-react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import bannerService from '../services/bannerService';
import { Image } from 'primereact/image';
import { set, useForm } from 'react-hook-form';
import { async } from '@firebase/util';

const Banner = () => {
    const toast = useRef(null);
    const inputIMG = useRef();
    //banner modelo
    let bannerVacio = {
        imagen: "",
        enlace: "",
        fecha: "",
        posicion: 1,
        estado: ""
    };
    const [show, setShow] = useState(false);
    const [eliminarBannerDialogo, setEliminarBannerDialogo] = useState(false);
    const [activarBannerDialogo, setACtivarBannerDialogo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingOK, setLoadingOK] = useState(false);
    const [banners, setBanners] = useState([]);
    const [bannersFiltro, setBannersFiltro] = useState([]);
    const [bannersContador, setBannersContador] = useState(0);
    const [bannerPosicion, setBannerPosicion] = useState(0);
    const [valorSelectFiltro, setValorSelectFiltro] = useState(0);
    const [banner, setBanner] = useState(bannerVacio);
    const [btnregistrar, setBtnregistrar] = useState(false);
    const [btnactualizar, setBtnactualizar] = useState(false);
    const [imagenURL, setImagenURL] = useState('https://static.thenounproject.com/png/1034957-200.png');
    const [bannerID, setBannerID] = useState('');
    const [bannerIndex, setBannerIndex] = useState(0);
    const [contar, setContar] = useState(0);
    const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm();

    //TRAER LOS DATOS
    useEffect(() => {
        const getBanners = async () => {
            try {
                const data = await bannerService.getAllData();
                setBanners(data);
                setBannersFiltro(data);
                setBannersContador(data.length);
            }
            catch (err) { console.log(err); }
        }
        getBanners();
    }, []);

    var currentdate = new Date();


    //agregar datos
    const onSubmit = async (data) => {

        setLoading(true);
        data.imagen = imagenURL;
        data.estado = false;
        data.fecha = `${currentdate.getFullYear()}/${currentdate.getMonth()}/${currentdate.getDate()}`;
        data.hora = `${currentdate.getHours()}:${currentdate.getMinutes()}`;
        data.posicion = 1;

        setBanner(await data);
        console.log(banner);
        const NuevoId = await bannerService.setData(data);
        setShow(false);
        setBannerPosicion(1);

        if (NuevoId.length > 0) {
            data.id = NuevoId;
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Banner agregado correctamente.' });
            let _banners = [...banners];
            _banners.push(data);
            setBanners(_banners);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El Banner no se agregado correctamente.' });
        }

        setLoading(false);
    }

    //FILTRAR BANNER POR POSICION
    const ListarFiltro = (e) => {
        console.log("filtrar por: ", e);
        setValorSelectFiltro(e);
        if (e == 0) {
            setBannersFiltro(banners);
            setBannersContador(banners.length);
        } else {
            let contador = 0;
            const filteredList = new Array(banners.length).fill(null);
            banners.forEach((item, index) => {
                if (item.posicion == e) {
                    filteredList[index] = item;
                    contador++;
                }
            });
            setBannersFiltro(filteredList);
            setBannersContador(contador);
        }
    }

    useEffect(() => {
        ListarFiltro(bannerPosicion);
    }, [banners]);

    function CargarIMG(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImagenURL(reader.result.toString());
            };
        }
    }

    //ELIMINAR (DESACTIVAR) BANNER
    const eliminarBanner = async () => {
        setLoading(true);
        const respuesta = await bannerService.deleteData(bannerID);
        setLoading(false);
        if (respuesta === "exito") {
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Banner desactivado correctamente.' });
            let _banner = [...banners];
            _banner[bannerIndex].estado = false;
            setBanners(_banner);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al eliminar el Banner.' });
        }
        ocultarEliminarBannerDialogo();
    }
    const ocultarEliminarBannerDialogo = () => {
        setEliminarBannerDialogo(false);
    };
    const mostrarEliminarBannerDialogo = (id, index, posicion) => {
        setBannerID(id);
        setBannerIndex(index);
        setEliminarBannerDialogo(true);
        setBannerPosicion(posicion);
    };
    const eliminarBannerDialogoFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined onClick={ocultarEliminarBannerDialogo} />
            <Button
                label="Si"
                icon="pi pi-check"
                loading={loading}
                onClick={eliminarBanner}
                severity="danger" />
        </React.Fragment>
    );


    //ACTIVAR BANNER
    const activarBanner = async () => {
        console.log("Id: ", bannerID, "Index: ", bannerIndex, " posicion: ",bannerPosicion);
        setLoading(true);
        const respuesta = await bannerService.activateData(bannerID);
        //setLoading(false);
        if (respuesta === "exito") {
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Banner activado correctamente.' });
            let _banner = [...banners];
            _banner[bannerIndex].estado = true;
            cambiarEstado();
            setBanners(_banner);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al activar el Banner.' });
        }
        //ocultarActivarBannerDialogo();
    }
    const ocultarActivarBannerDialogo = () => {
        setACtivarBannerDialogo(false);
    };
    const mostrarActivarBannerDialogo = (id, index, posicion) => {
        setBannerPosicion(posicion);
        setBannerID(id);
        setBannerIndex(index);
        setACtivarBannerDialogo(true);
    };

    const activarBannerDialogoFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined onClick={ocultarActivarBannerDialogo} />
            <Button
                label="Si"
                icon="pi pi-check"
                loading={loading}
                onClick={activarBanner}
                severity="danger" />
        </React.Fragment>
    );

    //ACTUALIZAR BANNER
    const actualizarBanner = (index, posicion) => {
        let _banners = [...banners];
        setBanner(_banners[index]);
        setBannerID(_banners[index].id);
        setBannerIndex(index);
        setImagenURL(_banners[index].imagen);
        setValue('enlace', _banners[index].enlace);
        setBtnactualizar(true);
        setBtnregistrar(false);
        setBannerPosicion(posicion);
        setShow(true);
    }
    const guardarBanner = async () => {
        try {
            setLoading(true);
            let bann = { ...banner }
            bann.imagen = imagenURL;
            bann.enlace = getValues('enlace');
            delete bann.id;
            const respuesta = await bannerService.updateData(bannerID, bann);
            if (respuesta === "exito") {
                bann.id = bannerID;
                let _banners = [...banners];
                _banners[bannerIndex] = bann;
                setBanners(_banners);
                toast.current.show({ severity: 'success', summary: 'Exito', detail: 'El Banner se actualizo correctamente.' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al actualizar el Banner.' });
            }
            setLoading(false);
            setShow(false);
            inputIMG.current.value = null;
        } catch (e) {
            console.log("error:", e);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al actualizar el Banner.' });
            setLoading(false);
        }

    }


    function reiniciarFormulario() {
        setImagenURL("https://static.thenounproject.com/png/1034957-200.png");
        setValue('enlace', '');
        inputIMG.current.value = null;
    }


    //CAMBIAR POSICION BANNER
    const cambiarPosicionBanner = (index, e, id) => {
        setBannerIndex(index);
        setBannerPosicion(e);
        setBannerID(id);
    }
    //CONFIRMAR CAMBIAR POSICION DE BANNER
    const confirmarPosicionBanner = async () => {
        setLoadingOK(true);
        console.log("id:", bannerID, " indice:", bannerIndex, " posicion:", bannerPosicion);
        const ans = await bannerService.updatePositionData(bannerID, bannerPosicion);
        if (ans == "exito") {
            let _banners = [...banners];
            _banners[bannerIndex].posicion = bannerPosicion;
            setBanners(_banners);
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'La posicion del Banner se actualizo correctamente.' });
            ListarFiltro(bannerPosicion);
            setValorSelectFiltro(bannerPosicion);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Lo sentimos, hubo un problema al actualizar el Banner.' });
        }
        setLoadingOK(false);
    }


    //CAMBIAR ESTADO DEL BANNER Y DESACTIVAR LOS DEMAS
    const cambiarEstado = async () => {
        let _bannersFiltrados = [...bannersFiltro];
        for (let i = 0; i < _bannersFiltrados.length; i++) {
            let element = _bannersFiltrados[i];
            if (element != null && element.id !== bannerID && element.posicion == bannerPosicion) {
                if (element.estado) {
                    await bannerService.deleteData(element.id);
                    element.estado = false;
                }
            }
        }
        setBannersFiltro(_bannersFiltrados);
        setLoading(false);
        ocultarActivarBannerDialogo();
    }


    return <>
        <Toast ref={toast}></Toast>
        <div className=' w-4/5 mt-28 m-auto flex justify-between'>
            <React.Fragment>
            </React.Fragment>
            <div className='flex gap-2'>
                <p className='my-2'><span className='font-bold text-xl'>{bannersContador}</span> <span className='font-light'>banners</span> <span className='font-bold'>Posicion:</span></p>
                <select id="posicion" className="w-25 h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => ListarFiltro(e.target.value)} value={valorSelectFiltro}>
                    <option value={0}>Todos</option>
                    <option value={1} >1</option>
                    <option value={2} >2</option>
                    <option value={3} >3</option>
                    <option value={4} >4</option>
                    <option value={5} >5</option>
                </select>
            </div>


            {/* <button type="button" className="h-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Nuevo Banner</button> */}
            <Button onClick={() => { setShow(!show); setBtnregistrar(true); reiniciarFormulario(); setBtnactualizar(false); }}>Nuevo Banner</Button>

        </div>
        <div className='mt-10 w-4/5 h-80  m-auto flex gap-5 flex-wrap'>
            {bannersFiltro.map((item, index) => (
                (item) &&
                <div key={item.id}  className={
                    (item.estado) ?
                        "w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        :
                        "blur-sm hover:blur-none w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"}>
                    <a href="#">
                        {/* <img className="p-5 rounded-t-lg" src={item.imagen} alt="banner imagen" /> */}
                        <Image src={item.imagen} alt="Image" className="p-5 rounded-t-lg" preview />
                    </a>
                    <div className="px-2 pb-5">
                        <a target="_blank" href={item.enlace}>
                            <small>{item.enlace.length < 50 ? item.enlace : item.enlace.slice(0, 50) + "..."}</small>
                        </a>
                        <p className='py-3'>
                            {item.fecha} <small className='italic font-light'>{item.hora}Hrs</small> {(item.estado) ? "🟢" : "🔴"}
                        </p>
                        {
                            (item.estado) ?
                                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={() => { mostrarEliminarBannerDialogo(item.id, index, item.posicion) }}
                                >Desactivar</button>
                                :
                                <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                                    onClick={() => { mostrarActivarBannerDialogo(item.id, index, item.posicion) }}
                                >Activar</button>
                        }
                        <button type="button" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={() => { actualizarBanner(index, item.posicion) }}
                        >Editar</button>
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cambiar posicion:</label>
                        <div className="grid md:grid-cols-3 md:gap-6 w-full">
                            <div className="relative z-0 w-full mb-6 group col-span-2">
                                <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={(e) => cambiarPosicionBanner(index, e.target.value, item.id)} defaultValue={item.posicion}>
                                    <option defaultValue="1">1</option>
                                    <option defaultValue="2">2</option>
                                    <option defaultValue="3">3</option>
                                    <option defaultValue="4">4</option>
                                    <option defaultValue="5">5</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <Button label="ok"
                                    className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                                    loading={loadingOK}
                                    onClick={confirmarPosicionBanner} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>


        {/* MODAL AGREGAR NUEVO BANNER */}
        <Modal show={show} size="2xl" onClose={() => setShow(!show)} position="center">
            <form onSubmit={handleSubmit(onSubmit)} method="post">
                <Modal.Header>
                    Banner
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="imagen" value="Imagen" />
                                <small className='font-light'> Max. 250 Kb.</small>
                            </div>
                            <div className='flex justify-between items-center'>
                                <label htmlFor="imagen" className='border-dashed border-2 p-2 rounded-2xl'>
                                    <svg className='w-20' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                                    </svg>
                                    <small>Nueva Imagen</small>
                                </label>
                                <input ref={inputIMG} type='file' className='hidden' id='imagen' name='imagen' onChange={CargarIMG}></input>
                                {/* {imagenURL && <img src={imagenURL} className='w-96 h-16 object-contain' />} */}
                                {imagenURL && <Image src={imagenURL} alt="Imagen" width='300px' height='50px' preview />}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="enlace" value="URL más información" />
                            </div>
                            <TextInput id="enlace" placeholder='Ejem: http://www.domingosavio.com' name='enlace' required={true} {...register("enlace")} maxLength="200"
                            />
                            <small>{contar}/200 caracteres</small>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {btnregistrar ?
                        <Button
                            type='submit'
                            label='Guardar Nuevo'
                            severity='success'
                            loading={loading}
                        /> : null
                    }
                    {btnactualizar ?
                        <Button
                            severity='help'
                            type='button'
                            label="Guardar"
                            loading={loading}
                            onClick={() => guardarBanner()} /> : null
                    }
                    <Button
                        type='button'
                        severity='danger'
                        label='Cancelar'
                        onClick={() => setShow(false)} />
                </Modal.Footer>
            </form>
        </Modal>

        {/* DIALOGO ELIMINAR BANNER */}
        <Dialog visible={eliminarBannerDialogo} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={eliminarBannerDialogoFooter} onHide={ocultarEliminarBannerDialogo}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    ¿Estás seguro de que quieres eliminar este Banner?
                </span>
            </div>
        </Dialog>

        <Dialog visible={activarBannerDialogo} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={activarBannerDialogoFooter} onHide={ocultarActivarBannerDialogo}>
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    ¿Estás seguro de que quieres activar este Banner?
                </span>
            </div>
        </Dialog>
    </>
}

export default Banner
