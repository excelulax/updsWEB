import { useState } from 'react'
import { Modal, Button, Label, TextInput, Checkbox, FileInput, Textarea, Select, Dropdown } from 'flowbite-react';
import eventoService from '../services/eventoService';
import { set, useForm } from 'react-hook-form';

const lista = await eventoService.getAllData();


const Evento = () => {
    const [show, setShow] = useState(false);

    const [modalVer, setModalVer] = useState(false);
    const [btnregistrar, setBtnregistrar] = useState(false);
    const [btnactualizar, setBtnactualizar] = useState(false);

    const [imagenURL, setImagenURL] = useState('https://static.thenounproject.com/png/1034957-200.png');
    const [eventoID, seteventoID] = useState('');
    const [eventoLIKE, setEventoLIKE] = useState(0);

    const { register, handleSubmit, watch, formState: { errors }, setValue, getValues } = useForm();

    const onSubmit = async (data) => {
        data.imagen = imagenURL;
        await eventoService.setData(data);
        setShow(false);
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

    const Eliminar = async (id) => {
        await eventoService.deleteData(id);
    }

    const Obtener = async (id) => {
        const evento = await eventoService.getData(id);
        setValue('organizador', evento.organizador);
        setValue('titulo', evento.titulo);
        setImagenURL(evento.imagen);
        setValue('lugar', evento.lugar);

        setValue('fechaInicioDia', evento.fechaInicioDia);
        setValue('fechaInicioMes', evento.fechaInicioMes);
        setValue('fechaInicioAnio', evento.fechaInicioAnio);
        setValue('fechaInicioHora', evento.fechaInicioHora);
        setValue('fechaInicioMinuto', evento.fechaInicioMinuto);


        setValue('fechaFinDia', evento.fechaFinDia);
        setValue('fechaFinMes', evento.fechaFinMes);
        setValue('fechaFinAnio', evento.fechaFinAnio);
        setValue('fechaFinHora', evento.fechaFinHora);
        setValue('fechaFinMinuto', evento.fechaFinMinuto);

        setValue('descripcion', evento.descripcion);
        setValue('url', evento.url);

        seteventoID(evento.id);
        setEventoLIKE(evento.like);
        setBtnregistrar(false);
        setBtnactualizar(true);
    }

    function Reset() {
        setValue('organizador', '');
        setValue('titulo', '');
        setValue('lugar', '');

        setValue('fechaInicioDia', '');
        setValue('fechaInicioMes', '');
        setValue('fechaInicioAnio', '');
        setValue('fechaInicioHora', '');
        setValue('fechaInicioMinuto', '');


        setValue('fechaFinDia', '');
        setValue('fechaFinMes', '');
        setValue('fechaFinAnio', '');
        setValue('fechaFinHora', '');
        setValue('fechaFinMinuto', '');

        setValue('descripcion', '');
        setValue('url', '');
        setBtnactualizar(false);
        setImagenURL('https://static.thenounproject.com/png/1034957-200.png');
    }

    const Actualizar = async () => {
        const eve = {
            organizador: getValues('organizador'),
            titulo: getValues('titulo'),
            lugar: getValues('lugar'),

            fechaInicioDia: getValues('fechaInicioDia'),
            fechaInicioMes: getValues('fechaInicioMes'),
            fechaInicioAnio: getValues('fechaInicioAnio'),
            fechaInicioHora: getValues('fechaInicioHora'),
            fechaInicioMinuto: getValues('fechaInicioMinuto'),


            fechaFinDia: getValues('fechaFinDia'),
            fechaFinMes: getValues('fechaFinMes'),
            fechaFinAnio: getValues('fechaFinAnio'),
            fechaFinHora: getValues('fechaFinHora'),
            fechaFinMinuto: getValues('fechaFinMinuto'),

            descripcion: getValues('descripcion'),
            url: getValues('url'),

            like:eventoLIKE,
            imagen:imagenURL
        }
        await eventoService.updateData(eventoID, eve);
        setShow(false);
    }


    return <>
        <div className='mt-40 w-4/5 h-80 block m-auto'>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900 p-2">
                    <div className='flex gap-2'>
                        <p className='my-1 ml-2'><span className='font-bold text-xl'>{lista.length}</span> <span className='font-light'>eventos</span></p>
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                            </div>
                            <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar evento" />
                        </div>
                    </div>
                    {/* <button type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Gregar</button> */}
                    <div className='mr-2'>
                        <Button onClick={() => { setShow(!show); setBtnregistrar(!btnregistrar); Reset(); }}>Agregar</Button>
                    </div>
                </div>

                <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Imagen
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Titulo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Like
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Fecha
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Descripcion
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody >
                        {lista.map((item) => (
                            <tr key={item.id}>
                                <td><img src={item.imagen} alt="imagen" width="100px" height="100px" className='block m-auto' /></td>
                                <td>{item.titulo}</td>
                                <td>{item.like}</td>
                                <td>{item.fechaInicioAnio + "-" + item.fechaInicioMes + "-" + item.fechaInicioDia} <small className='italic'>{item.fechaInicioHora}:{item.fechaInicioMinuto} Hrs</small></td>
                                <td>{item.descripcion.length <= 100 ? item.descripcion : item.descripcion.slice(0, 100) + "..."}</td>
                                <td className="px-1 py-5">
                                    <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                    >Ver</button>
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => { Obtener(item.id); setShow(true); }} >Editar</button>
                                    <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                        onClick={() => Eliminar(item.id)}>Eliminar</button>
                                    <button type="button" className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">Notificacion</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>


        {/* MODAL AGREGAR NUEVO EVENTO */}
        <Modal show={show} size="2xl" onClose={() => setShow(!show)} position="center">
            <form onSubmit={handleSubmit(onSubmit)} method="post">
                <Modal.Header>
                    Nuevo Evento
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="organizador" value="Organizador" />
                            </div>
                            <TextInput id="organizador" required={true} name="organizador" {...register("organizador")} />
                            <small>0/200 caracteres</small>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="titulo" value="titulo" />
                            </div>
                            <TextInput id="titulo" required={true} name="titulo"  {...register("titulo")} />
                            <small>0/200 caracteres</small>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="imagen" value="Imagen" />
                                <small className='font-light'> Max. 250 Kb.</small>
                            </div>
                            <div className='flex justify-between'>
                                <FileInput className='w-40' id='imagen' required={true} onChange={() => CargarIMG(event)}></FileInput>
                                <img src={imagenURL} width="150px" height="150px" alt="imagen" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="lugar" value="Lugar" />
                            </div>
                            <Textarea id='lugar' placeholder='lugar donde se realizara el evento' required={true} name="lugar" {...register("lugar")}>
                            </Textarea>
                        </div>

                        <div className='flex justify-between'>
                            <div>
                                <div className="mb-2 block ">
                                    <Label htmlFor="fecha" value="Fecha y Hora Inicio del Evento" />
                                </div>
                                <div className="flex gap-2">
                                    <Label value="Fecha" className='font-light py-2' />
                                    <Select id="fecha" required={true} name="fechaInicioDia" {...register("fechaInicioDia")}>
                                        <option value="01" >1</option>
                                        <option value="02" >2</option>
                                        <option value="03" >3</option>
                                        <option value="04" >4</option>
                                        <option value="05" >5</option>
                                        <option value="06" >6</option>
                                        <option value="07" >7</option>
                                        <option value="08" >8</option>
                                        <option value="09" >9</option>
                                        <option value="10" >10</option>
                                        <option value="11" >11</option>
                                        <option value="12" >12</option>
                                        <option value="13" >13</option>
                                        <option value="14" >14</option>
                                        <option value="15" >15</option>
                                        <option value="16" >16</option>
                                        <option value="17" >17</option>
                                        <option value="18" >18</option>
                                        <option value="19" >19</option>
                                        <option value="20" >20</option>
                                        <option value="21" >21</option>
                                        <option value="22" >22</option>
                                        <option value="23" >23</option>
                                        <option value="24" >24</option>
                                        <option value="25" >25</option>
                                        <option value="26" >26</option>
                                        <option value="27" >27</option>
                                        <option value="28" >28</option>
                                        <option value="29" >29</option>
                                        <option value="30" >30</option>
                                        <option value="31" >31</option>
                                    </Select>
                                    <Select id="fecha" required={true} name="fechaInicioMes" {...register("fechaInicioMes")}>
                                        <option value="01">Ene</option>
                                        <option value="02">Feb</option>
                                        <option value="03">Mar</option>
                                        <option value="04">Abr</option>
                                        <option value="05">May</option>
                                        <option value="06">Jun</option>
                                        <option value="07">Jul</option>
                                        <option value="08">Ago</option>
                                        <option value="09">Sep</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dic</option>
                                    </Select>
                                    <Select id="fecha" required={true} name="fechaInicioAnio" {...register("fechaInicioAnio")}>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </Select>

                                    <Label value="Hora " className='font-light py-2' />
                                    <TextInput type="number" className='w-14' max={23} min={0} required={true} name="fechaInicioHora" {...register("fechaInicioHora")} />
                                    <Label value=":" className='font-light py-2' />
                                    <TextInput type="number" className='w-14' max={59} min={0} required={true} name="fechaInicioMinuto" {...register("fechaInicioMinuto")} />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between'>
                            <div>
                                <div className="mb-2 block ">
                                    <Label htmlFor="fecha" value="Fecha y Hora Fin del Evento" />
                                </div>
                                <div className="flex gap-2">
                                    <Label value="Fecha" className='font-light py-2' />
                                    <Select id="fecha" required={true} name="fechaFinDia" {...register("fechaFinDia")}>
                                        <option value="01" >1</option>
                                        <option value="02" >2</option>
                                        <option value="03" >3</option>
                                        <option value="04" >4</option>
                                        <option value="05" >5</option>
                                        <option value="06" >6</option>
                                        <option value="07" >7</option>
                                        <option value="08" >8</option>
                                        <option value="09" >9</option>
                                        <option value="10" >10</option>
                                        <option value="11" >11</option>
                                        <option value="12" >12</option>
                                        <option value="13" >13</option>
                                        <option value="14" >14</option>
                                        <option value="15" >15</option>
                                        <option value="16" >16</option>
                                        <option value="17" >17</option>
                                        <option value="18" >18</option>
                                        <option value="19" >19</option>
                                        <option value="20" >20</option>
                                        <option value="21" >21</option>
                                        <option value="22" >22</option>
                                        <option value="23" >23</option>
                                        <option value="24" >24</option>
                                        <option value="25" >25</option>
                                        <option value="26" >26</option>
                                        <option value="27" >27</option>
                                        <option value="28" >28</option>
                                        <option value="29" >29</option>
                                        <option value="30" >30</option>
                                        <option value="31" >31</option>
                                    </Select>
                                    <Select id="fecha" required={true} name="fechaFinMes" {...register("fechaFinMes")}>
                                        <option value="01">Ene</option>
                                        <option value="02">Feb</option>
                                        <option value="03">Mar</option>
                                        <option value="04">Abr</option>
                                        <option value="05">May</option>
                                        <option value="06">Jun</option>
                                        <option value="07">Jul</option>
                                        <option value="08">Ago</option>
                                        <option value="09">Sep</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dic</option>
                                    </Select>
                                    <Select id="fecha" required={true} name="fechaFinAnio" {...register("fechaFinAnio")}>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </Select>

                                    <Label value="Hora " className='font-light py-2' />
                                    <TextInput type="number" className='w-14' max={23} min={0} required={true} name="fechaFinHora" {...register("fechaFinHora")} />
                                    <Label value=":" className='font-light py-2' />
                                    <TextInput type="number" className='w-14' max={59} min={0} required={true} name="fechaFinMinuto" {...register("fechaFinMinuto")} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="descripcion" value="Descripcion" />
                            </div>
                            <Textarea id='lugar' placeholder='descripcion del evento' required={true} name="descripcion" {...register("descripcion")}>
                            </Textarea>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="url" value="URL más información" />
                            </div>
                            <TextInput id="url" required={true} name="url" {...register("url")} />
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
                    <Button onClick={() => setShow(false)}>Cancelar</Button>
                </Modal.Footer>
            </form>
        </Modal>


        {/* MODAL VER EVENTO */}
        <Button onClick={() => setModalVer(true)}>Modal</Button>
        <Modal show={modalVer} size="2xl" onClose={() => setModalVer(!modalVer)} position="center">
            <Modal.Header>
                TITULO DE EVENTO
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <img src={imagenURL} width="200px" height="200px" alt="" />
                    </div>
                </div>
                <div >
                    <strong>Organizador:</strong><p>{getValues('organizador')}</p>
                </div>
                <div>
                    <strong>Lugar:</strong>
                </div>
                <div>
                    <strong>Lugar:</strong>
                </div>
                <div>
                    <strong>Fecha Inicio del Evento:</strong>
                </div>
                <div>
                    <strong>Fecha Fin del Evento:</strong>
                </div>
                <div>
                    <strong>Descripcion:</strong>
                </div>
                <div>
                    <strong>URL mas informacion:</strong>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between w-full">
                    <div>
                        <p>666 Me gusta</p>
                    </div>
                    <div>
                        <p>10/10/10 <small className='italic'>24:00 Hrs</small></p>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    </>
}

export default Evento