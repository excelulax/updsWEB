import React from 'react'
import { Modal} from 'flowbite-react';

const DetalleNoticia = ({_mostrar2,_cerrar2,_noticia2}) => {
    if (!_mostrar2) return null;
    return <>
        {/* MODAL VER NOTICIA */}
        <Modal show={_mostrar2} onClose={_cerrar2} size="2xl" position="center">
            <Modal.Header>
                {_noticia2.titulo}
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        <img src={_noticia2.imagen} width="200px" height="200px" alt="" />
                    </div>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        {_noticia2.texto}
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between w-full">
                    <div>
                        <p>{_noticia2.like} Me gusta</p>
                    </div>
                    <div>
                        <p>{_noticia2.fecha} <small className='italic'>24:00 Hrs</small></p>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>

    </>
}
export default DetalleNoticia;