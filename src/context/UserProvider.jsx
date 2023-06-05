import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import DB from "../DB";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(false);

    useEffect(() => {
        const unsusbribe = onAuthStateChanged(DB.auth, (user) => {
            if (user) {
                const { uid } = user;
                setUser({ uid });
            } else {
                setUser(false);
            }
        });
        return () => unsusbribe();
    }, []);

    // useEffect(() => {
    //     const unsusbribe = onAuthStateChanged(DB.auth, (user) => {
    //         if (user) {
    //             const { uid, email, displayName,  } = user;
    //             setUser({ uid, email, displayName,  });
    //         } else {
    //             setUser(null);
    //         }
    //     });
    //     return () => unsusbribe();
    // }, []);

    const loginUser = (email, password) =>
        signInWithEmailAndPassword(DB.auth, email, password);

    return (
        <UserContext.Provider value={{ user, setUser, loginUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;