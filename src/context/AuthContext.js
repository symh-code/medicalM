import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Importa Firebase Auth y Firestore
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado adicional para identificar si el usuario es administrador
  const [loading, setLoading] = useState(true);

  // Escucha cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Verificar si el usuario es administrador consultando Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin || false); // Asume que Firestore tiene un campo `isAdmin`
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para registrar usuarios
  const register = async (email, password, isAdmin = false) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Guardar información adicional del usuario en Firestore
    await setDoc(doc(db, 'users', newUser.uid), {
      email: newUser.email,
      isAdmin,
    });

    setUser(newUser);
    setIsAdmin(isAdmin);
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;

    setUser(loggedInUser);

    // Verificar si el usuario es administrador
    const userDocRef = doc(db, 'users', loggedInUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setIsAdmin(userDoc.data().isAdmin || false);
    } else {
      setIsAdmin(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, register, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
