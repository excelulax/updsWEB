
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

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import { getAuth, getIdToken, signInAnonymously } from "firebase/auth";
import { deleteToken, getToken, onMessage } from "firebase/messaging";
import { messaging } from '../DB';
import { getMessaging } from "firebase/messaging";
export const ModalR = () => {
    const toast = useRef(null);

    const loguearse = () => {
        signInAnonymously(getAuth()).then(usuario => console.log(usuario));
    }

    const activarMensajes = async () => {
        const token = await getToken(messaging, {
            vapidKey: "BORR2yWfivOZ_TjSaIP1h1ZKXPey8-0SCGAr-8ZmLRbvG6TiCxt7nQmAhjqKgvyOjb2i1vH81vvNGE4ULWezotc"
        }).catch(error => console.log("error generar token"));

        if (token) console.log("tu token:", token);
        if (!token) console.log("no tienes token");
    }

    useEffect(() => {
        onMessage(messaging, message => {
            console.log("tu mensaje:", message);
            toast.current.show({ severity: 'success', summary: `${message.notification.title}`, detail: `${message.notification.body}` });
        })
    }, []);


    const cerrarSesion = () => {
        const auth = getAuth();
        auth.signOut().then(() => {
            console.log("no sesion");
        }).catch((error) => {
            console.log("error cerrar sesion");
        });
    }

    const eliminarToken = async () => {
        // const messaging = getMessaging();
        // messaging.deleteToken().then(() => {
        //     // Token deleted.
        // }).catch((error) => {
        //     // An error occurred.
        // });
        //  await firebase.messaging().deleteToken();
        const eliminar = await deleteToken(messaging).then(() => {
            console.log("si");
        }).catch((error) => {
            console.log('error', error);
        })
    }

    const mostrarejemplo = () => {
        toast.current.show({
            severity: 'success',
            summary: <>
                <div className='flex items-center justify-between'>
                    <p>hola</p>
                    <img src="https://www.upds.edu.bo/wp-content/uploads/2020/10/upds_logo-1-1-1.png" alt="" width="35" className='' />
                </div>
            </>,
            detail: 'Lorem ipsum, dolor sit amet '
        });
    }

    return (<>
        <Toast ref={toast}></Toast>
        <div className='mt-40'>
            <button
                onClick={loguearse}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">login</button>
            <br />


            <button
                onClick={activarMensajes}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">generar token</button>
            <br />

            <button
                onClick={mostrarejemplo}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ejemplo</button>
            <br />

            <button
                onClick={cerrarSesion}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">login out</button>
            <br />

            <button
                onClick={eliminarToken}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">eliminar token</button>
            <br />
        </div>
    </>
    )
}


export default ModalR;
