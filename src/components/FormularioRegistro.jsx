import React, { useState, useEffect } from 'react'
import { Modal, Button, Label, TextInput, FileInput, Textarea, Select, Radio } from 'flowbite-react';
import { Image } from 'primereact/image';
import noticiaService from '../services/noticiaService';
import { set, useForm } from 'react-hook-form';
import { async } from '@firebase/util';

const FormularioRegistro = ({ _mostrar, _cerrar, _noticia, _retorno }) => {
    const [show, setShow] = useState(false);
    const [btnregistrar, setBtnregistrar] = useState(false);
    const [btnactualizar, setBtnactualizar] = useState(false);

    const [imagenURL, setImagenURL] = useState('https://static.thenounproject.com/png/1034957-200.png');
    const [noticiaID, setNoticiaID] = useState('');
    const [noticiaLIKE, setNoticiaLIKE] = useState(0);

    const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm();

    const tituloValue = watch('titulo', '');

    const onSubmit = async (data) => {
        data.imagen = imagenURL;
        const id = await noticiaService.setData(data);

        data.id = id;
        data.like = 0;
        retornar(data);
        _cerrar();
    }
    const retornar = (obj) => {
        _retorno(obj);
    }

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
    useEffect(() => {
        setValue('titulo', _noticia.titulo);
        setValue('pie', _noticia.pie);
        setValue('texto', _noticia.texto);
        setValue('prioridad', _noticia.prioridad);
        setValue('fecha', _noticia.fecha);
        setValue('categoria', _noticia.categoria);
        setValue('url', _noticia.url);
        setNoticiaLIKE(_noticia.like);
        setImagenURL(_noticia.imagen);

        setNoticiaID(_noticia.id);

        if (noticiaID.length > 0) {
            setBtnregistrar(false);
            setBtnactualizar(true);
        } else {
            setBtnregistrar(true);
            setBtnactualizar(false);
        }
    }, [_noticia, noticiaID]);

    const Actualizar = async () => {
        const noti = {
            titulo: getValues('titulo'),
            pie: getValues('pie'),
            texto: getValues('texto'),
            prioridad: getValues('prioridad'),
            fecha: getValues('fecha'),
            categoria: getValues('categoria'),
            url: getValues('url'),
            imagen: imagenURL,
            like: noticiaLIKE
        }
        _retorno(noti);
        _cerrar();
        await noticiaService.updateData(noticiaID, noti);
    }
    if (!_mostrar) return null;

    return <>
        {/* MODAL AGREGAR NUEVA NOTICIA */}
        <Modal show={_mostrar} onClose={_cerrar} position="center">
            <form onSubmit={handleSubmit(onSubmit)} method="post">
                <Modal.Header>
                    Nueva Noticia
                </Modal.Header>
                <Modal.Body  style={{maxHeight:"750px", overflow:'auto',}}>
                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="titulo" value="Titulo" />
                            </div>
                            <TextInput id="titulo" {...register('titulo')}  maxLength="200"/>
                            <small>0/200 caracteres</small>
                            <small className='text-gray-400'>{tituloValue.length}/40</small>
                        </div>

                        <div >
                            <div className="mb-2 block">
                                <label htmlFor="imagen" >
                                    Imagen
                                    <small className='font-light'> Max. 250 Kb.</small></label>
                            </div>
                            <div className='flex justify-between'>
                                <label className='flex justify-center items-center' htmlFor="imagen">
                                    <svg className='w-20' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                                    </svg>
                                </label>
                                <FileInput className='hidden' id='imagen' required={true} onChange={() => CargarIMG(event)}></FileInput>
                                {/* <img src={imagenURL} width="150px" height="150px" alt="imagen" /> */}
                                <Image src={imagenURL} alt="Imagen" width="150px" height='150px' preview />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="pie" value="Pie de imagen" />
                            </div>
                            <TextInput id="pie" required={true} {...register("pie")} />
                            <small>0/200 caracteres</small>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="texto" value="Texto" />
                            </div>
                            <Textarea id='texto' placeholder='texto largo de la noticia' {...register("texto")}>
                            </Textarea>
                        </div>

                        <div className='flex justify-between'>
                            <div>
                                <div className="mb-2 block ">
                                    <Label htmlFor="prioridad" value="Prioridad" />
                                </div>
                                <div className="flex gap-2 py-2">
                                    <div className="flex items-center gap-2">
                                        <Radio id='prioridad' name='prioridad' value={'si'} {...register("prioridad")}></Radio>
                                        <Label>SI</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Radio id='prioridad' name='prioridad' value={'no'} {...register("prioridad")}></Radio>
                                        <Label>NO</Label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 block ">
                                    <Label htmlFor="fecha" value="Fecha de Publicacion" />
                                </div>
                                <div className="flex gap-2">
                                    <TextInput id="fecha" type="date" required={true} {...register("fecha")} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 block ">
                                    <Label htmlFor="categoria" value="Categoria" />
                                </div>
                                <div className="flex gap-2">
                                    <Select id="categoria" required={true} {...register("categoria")}>
                                        <option value="Actividades Academicas">Actividades Academicas</option>
                                        <option value="Actividades UPDS">Actividades UPDS</option>
                                        <option value="Extensión">Extensión</option>
                                        <option value="Postgrado">Postgrado</option>
                                        <option value="Responsabilidad Social">Responsabilidad Social</option>
                                        <option value="Socialero UPDS">Socialero UPDS</option>
                                        <option value="UPDS informa">UPDS informa</option>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="url" value="URL más información" />
                            </div>
                            <TextInput id="url" placeholder='formato http://www.ejemplo.com' required={true} {...register("url")} />
                            <small>0/200 caracteres</small>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {btnregistrar ?
                        <Button type='submit' >Guardar Nuevo</Button>
                        :
                        null
                    }
                    {btnactualizar ?
                        <Button onClick={() => Actualizar()}>Guardar</Button>
                        :
                        null
                    }
                    <Button onClick={() => _cerrar()}>Cancelar</Button>
                </Modal.Footer>
            </form>
        </Modal>
    </>
}
export default FormularioRegistro