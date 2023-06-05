import React, { useState, useEffect, useRef } from 'react'
import { Modal, Label, TextInput, FileInput, Textarea, Select, Radio } from 'flowbite-react';
import { Button } from 'primereact/button';
import { set, useForm } from 'react-hook-form';
import { async } from '@firebase/util';
import { Toast } from 'primereact/toast';
import updsRespondeService from '../services/updsRespondeService';

const DetalleUPDSresponde = ({ _mostrar, _cerrar, _detalle, _retorno }) => {
    const respuestaRef = useRef();
    const urlRef = useRef();
    const toast = useRef(null);
    const [loadingResponder, setLoadingResponder] = useState(false);
    const [consulta, setConsulta] = useState({});
    const [respuesta, setRespuesta] = useState(_detalle.respuesta);
    const [url, setUrl] = useState(_detalle.urlMasInformacion);

    useEffect(() => {
        if (_mostrar) {
            setUrl(_detalle.urlMasInformacion);
            setRespuesta(_detalle.respuesta);
            setConsulta(_detalle);
        }
    }, [_mostrar]);

    useEffect(() => {
        if (_mostrar) {
            urlRef.current.focus();
        }
    }, [url]);
    useEffect(() => {
        if (_mostrar) {
            respuestaRef.current.focus();
        }
    }, [respuesta]);


    const responder = async () => {
        const nuevaConsulta = {
            ...consulta,
            respuesta: respuesta,
            urlMasInformacion: url
        };
        setLoadingResponder(true);
        const res = await updsRespondeService.updateData(_detalle.id, { respuesta: respuesta, urlMasInformacion: url });
        if (res === "exito") {
            toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Tu mensaje se ha enviado correctamente.' });
            setLoadingResponder(false);
            _retorno(nuevaConsulta);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un error al enviar la respuesta.' });
            setLoadingResponder(false);
        }
    }



    return <>
        <Toast ref={toast}></Toast>
        <Modal show={_mostrar} onClose={_cerrar} size="2xl" position="center">
            <Modal.Header>
                {_detalle.tipoConsulta}
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
                                            {_detalle.nombre}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                            Categoria:
                                        </th>
                                        <td className="px-6 py-4">
                                            {_detalle.categoria}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                            Telefono:
                                        </th>
                                        <td className="px-6 py-4">
                                            {_detalle.telefono}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                            Celular:
                                        </th>
                                        <td className="px-6 py-4">
                                            {_detalle.celular}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                            Tipo Consulta:
                                        </th>
                                        <td className="px-6 py-4">
                                            {_detalle.tipoConsulta}
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
                                                {_detalle.consulta}
                                            </p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                            Fecha:
                                        </th>
                                        <td className="px-6 py-4">
                                            {_detalle.fecha} <small className='italic'>{_detalle.hora} Hrs</small>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='p-2'>
                                <div>
                                    <label htmlFor="respuesta" className="pt-2 mx-2 block mb-2 text-base font-medium text-gray-900 dark:text-white">Respuesta</label>
                                    <textarea id="respuesta" rows="4" className=" block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escribir la respuesta aqui ..." name='respuesta' ref={respuestaRef} value={respuesta} onChange={(e) => { setRespuesta(e.target.value) }}></textarea>
                                </div>
                                <div className='mt-4'>
                                    <label htmlFor="url" className="mx-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL para más información</label>
                                    <input type="text" id="url" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='formato: http://www.example.com' name='url' ref={urlRef} value={url} onChange={(e) => { setUrl(e.target.value) }} />
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
                        <p>{_detalle.fecha} <small className='italic'>{_detalle.hora} Hrs</small></p>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    </>
}
export default DetalleUPDSresponde