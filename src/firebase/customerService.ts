import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { Customer, ServiceHistory, Note } from '../types/customer';

// Collection references
const customersCollection = 'customers';
const serviceHistoryCollection = 'serviceHistory';
const notesCollection = 'notes';

// Customer CRUD operations
export const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, customersCollection), {
    ...customer,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateCustomer = async (id: string, customer: Partial<Customer>) => {
  const docRef = doc(db, customersCollection, id);
  await updateDoc(docRef, {
    ...customer,
    updatedAt: Timestamp.now()
  });
};

export const deleteCustomer = async (id: string) => {
  await deleteDoc(doc(db, customersCollection, id));
};

export const getCustomer = async (id: string) => {
  const docRef = doc(db, customersCollection, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Customer;
  }
  return null;
};

export const getAllCustomers = async () => {
  const querySnapshot = await getDocs(collection(db, customersCollection));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[];
};

// Service History CRUD operations
export const addServiceHistory = async (service: Omit<ServiceHistory, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, serviceHistoryCollection), {
    ...service,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateServiceHistory = async (id: string, service: Partial<ServiceHistory>) => {
  const docRef = doc(db, serviceHistoryCollection, id);
  await updateDoc(docRef, service);
};

export const deleteServiceHistory = async (id: string) => {
  await deleteDoc(doc(db, serviceHistoryCollection, id));
};

export const getCustomerServiceHistory = async (customerId: string) => {
  const q = query(
    collection(db, serviceHistoryCollection),
    where('customerId', '==', customerId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ServiceHistory[];
};

// Notes CRUD operations
export const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, notesCollection), {
    ...note,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateNote = async (id: string, note: Partial<Note>) => {
  const docRef = doc(db, notesCollection, id);
  await updateDoc(docRef, {
    ...note,
    updatedAt: Timestamp.now()
  });
};

export const deleteNote = async (id: string) => {
  await deleteDoc(doc(db, notesCollection, id));
};

export const getCustomerNotes = async (customerId: string) => {
  const q = query(
    collection(db, notesCollection),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Note[];
};
