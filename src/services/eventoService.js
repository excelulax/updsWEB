import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import DB from "../DB";

const getAllData = async () => {
    const dataRef = collection(DB.db, "Evento");
    const querySnapshot = await getDocs(dataRef);
    const dataDB = querySnapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        }
    });
    return dataDB;
};


const setData = async (Evento) => {
    try {
        const docRef = await addDoc(collection(DB.db, "Evento"), {
            organizador: Evento.organizador,
            titulo: Evento.titulo,
            imagen: Evento.imagen,
            lugar: Evento.lugar,
            fechaInicioDia: Evento.fechaInicioDia,
            fechaInicioMes: Evento.fechaFinMes,
            fechaInicioAnio: Evento.fechaFinAnio,
            fechaInicioHora: Evento.fechaFinHora,
            fechaInicioMinuto: Evento.fechaInicioMinuto,
            fechaFinDia: Evento.fechaFinDia,
            fechaFinMes: Evento.fechaFinMes,
            fechaFinAnio: Evento.fechaFinAnio,
            fechaFinHora: Evento.fechaFinHora,
            fechaFinMinuto: Evento.fechaFinMinuto,
            descripcion: Evento.descripcion,
            url: Evento.url,
            like: 0,
        });
        console.log("Documento ID: ", docRef.id);
    } catch (e) {
        console.error("Error agregar: ", e);
    }
}


const deleteData = async (id) => {
    await deleteDoc(doc(DB.db, "Evento", id));
    console.log("eliminado ID:", id);
}

const getData = async (id) => {
    const docRef = doc(DB.db, "Evento", id);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
}

const updateData = async (id, Evento) => {
    const evento = doc(DB.db, "Evento", id);
    await updateDoc(evento, {
        organizador: Evento.organizador,
        titulo: Evento.titulo,
        imagen: Evento.imagen,
        lugar: Evento.lugar,
        fechaInicioDia: Evento.fechaInicioDia,
        fechaInicioMes: Evento.fechaFinMes,
        fechaInicioAnio: Evento.fechaFinAnio,
        fechaInicioHora: Evento.fechaFinHora,
        fechaInicioMinuto: Evento.fechaInicioMinuto,
        fechaFinDia: Evento.fechaFinDia,
        fechaFinMes: Evento.fechaFinMes,
        fechaFinAnio: Evento.fechaFinAnio,
        fechaFinHora: Evento.fechaFinHora,
        fechaFinMinuto: Evento.fechaFinMinuto,
        descripcion: Evento.descripcion,
        url: Evento.url,
        like: Evento.like
    });
    console.log("actualizado ID: ", id);
}

export default { getAllData, setData, deleteData, updateData, getData };