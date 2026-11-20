import { Injectable } from '@angular/core';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot,
  orderBy, query, updateDoc, Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Producto } from './producto';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private colRef = collection(db, 'productos');

  escuchar(
    alCambiar: (productos: Producto[]) => void,
    alFallar: (error: Error) => void,
  ): Unsubscribe {
    const q = query(this.colRef, orderBy('nombre'));
    return onSnapshot(
      q,
      (snap) =>
        alCambiar(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Producto) }))),
      alFallar,
    );
  }

  crear(p: Producto) {
    return addDoc(this.colRef, p);
  }

  actualizar(id: string, p: Producto) {
    return updateDoc(doc(db, 'productos', id), { ...p });
  }

  eliminar(id: string) {
    return deleteDoc(doc(db, 'productos', id));
  }
}