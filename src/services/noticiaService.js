import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import DB from "../DB";

const getAllData = async () => {
    const dataRef = collection(DB.db, "Noticia");
    const querySnapshot = await getDocs(dataRef);
    const dataDB = querySnapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        }
    });
    return dataDB;
};


const setData = async (Noticia) => {
    try {
        const docRef = await addDoc(collection(DB.db, "Noticia"), {
            titulo: Noticia.titulo,
            imagen: Noticia.imagen,
            pie: Noticia.pie,
            texto: Noticia.texto,
            prioridad: Noticia.prioridad,
            fecha: Noticia.fecha,
            categoria: Noticia.categoria,
            url: Noticia.url,
            like: 0
        });
        console.log("Documento ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error agregar: ", e);
    }
}


// const deleteData = async (id) => {
//     await deleteDoc(doc(DB.db, "Noticia", id));
//     console.log("eliminado ID:",id);
// }

const deleteData = async (id) => {
    const docRef = doc(DB.db, "Noticia", id);
    try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            await deleteDoc(docRef);
            console.log("eliminado ID:", id);
            return "exito";
        } else {
            console.log("ID no encontrado:", id);
            return "error";
        }
    } catch (error) {
        console.error("Error al eliminar ID:", id, error);
        return "error";
    }
}


const getData = async (id) => {
    const docRef = doc(DB.db, "Noticia", id);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
}

const updateData = async (id, Noticia) => {
    const noticia = doc(DB.db, "Noticia", id);
    await updateDoc(noticia, {
        titulo: Noticia.titulo,
        imagen: Noticia.imagen,
        pie: Noticia.pie,
        texto: Noticia.texto,
        prioridad: Noticia.prioridad,
        fecha: Noticia.fecha,
        categoria: Noticia.categoria,
        url: Noticia.url,
        like: Noticia.like
    });
    console.log("actualizado ID: ", id);
}

export default { getAllData, setData, deleteData, updateData, getData };