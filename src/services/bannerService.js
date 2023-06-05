import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import DB from "../DB";

const getAllData = async () => {
    const dataRef = collection(DB.db, "Banner");
    const querySnapshot = await getDocs(dataRef);
    const dataDB = querySnapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data()
        }
    });
    return dataDB;
};


const setData = async (Banner) => {
    try {
        const docRef = await addDoc(collection(DB.db, "Banner"), {
            ...Banner
        });
        console.log("Documento ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error agregar: ", e);
        return "";
    }
}


const deleteData = async (id) => {
    const docRef = doc(DB.db, "Banner", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        await updateDoc(docRef, { estado: false });
        console.log("actualizado ID:", id);
        return "exito";
    } else {
        console.log("id no existe");
        return "error";
    }
}

const activateData = async (id) => {
    const docRef = doc(DB.db, "Banner", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        await updateDoc(docRef, { estado: true });
        console.log("actualizado ID:", id);
        return "exito";
    } else {
        console.log("id no existe");
        return "error";
    }
}

const getData = async (id) => {
    const docRef = doc(DB.db, "Banner", id);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() };
}

// const updateData = async (id, Banner) => {
//     const banner = doc(DB.db, "Banner", id);
//     await updateDoc(banner, {
//         ...Banner
//     });
//     console.log("actualizado ID: ", id);
// }

const updateData = async (id, Banner) => {
    const bannerRef = doc(DB.db, "Banner", id);
    const bannerSnap = await getDoc(bannerRef);
    if (bannerSnap.exists()) {
        await updateDoc(bannerRef, {
            ...Banner
        });
        console.log("actualizado ID: ", id);
        return "exito";
    } else {
        console.error("ID no existe ", id);
        return "error";
    }
}

const updatePositionData = async (id,posicion) => {
    const docRef = doc(DB.db, "Banner", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        await updateDoc(docRef, { posicion:  posicion});
        console.log("posicion actualizado ID:", id);
        return "exito";
    } else {
        console.log("id no existe");
        return "error";
    }
}

export default { getAllData, setData, deleteData, updateData, getData, activateData,updatePositionData };