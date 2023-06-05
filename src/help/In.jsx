import React from 'react'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { messaging } from '../DB'
import { getToken, onMessage } from 'firebase/messaging'
import { Toast } from 'flowbite-react'
export const In = () => {
    const toast = useRef(null);
    const mostrar = () => {
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Consulta eliminada correctamente.' });
    }
    return (<>
        <div>
            <Toast ref={toast}></Toast>
            <h1>lol</h1>
        </div>
    </>
    )
}
