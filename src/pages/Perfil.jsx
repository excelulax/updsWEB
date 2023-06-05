import { useState } from 'react'

const Perfil = () => {
    return <>
        <div className='mt-20 block'>
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-auto">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Cambiar Contraseña</h5>
                <hr />
                <form>
                    <div className="mb-6">
                        <label htmlFor="claveAnterior" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Clave Anterior</label>
                        <input type="password" id="claveAnterior" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="claveNueva" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Clave Nueva</label>
                        <input type="password" id="claveNueva" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="claveConfirmar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repetir Clave Nueva</label>
                        <input type="password" id="claveConfirmar" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="mt-2 block m-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cambiar Clave</button>
                </form>

            </div>
        </div>
    </>
}

export default Perfil