import app from "./firebase.config.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        return { success: false, error: error.code };
    }
};

export const registerFullUser = async (userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );
        const user = userCredential.user;
        
        // Update profile with name
        await updateProfile(user, { displayName: userData.name });

        // Save to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: userData.name,
            email: userData.email,
            cellphone: userData.cellphone || '',
            finca: userData.finca || '',
            createdAt: new Date()
        });

        return { success: true, user };
    } catch (error) {
        console.error("Error en el servicio de registro:", error);
        let errorMessage = "Error al registrarse";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "El correo ya está en uso";
        }
        return { success: false, error: errorMessage };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return { success: true, user };
    } catch (error) {
        console.error("Error en el servicio de login:", error.code);
        let errorMessage = "Error al iniciar sesión";
        if (error.code === 'auth/invalid-credential') {
            errorMessage = "Correo o contraseña incorrectos";
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = "El usuario no existe";
        }
        return { success: false, error: errorMessage };
    }
};
