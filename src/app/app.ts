import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Unsubscribe } from 'firebase/firestore';
import { Producto } from './producto';
import { ProductosService } from './productos.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  productos = signal<Producto[]>([]);
  cargando = signal(true);
  mensaje = signal('');
  filtro = signal('');
  editandoId = signal<string | null>(null);

  categorias = computed(() => [...new Set(this.productos().map((p) => p.categoria))].sort());
  visibles = computed(() =>
    this.filtro() ? this.productos().filter((p) => p.categoria === this.filtro()) : this.productos(),
  );

  form: Producto = this.vacio();
  private dejarDeEscuchar?: Unsubscribe;

  constructor(private servicio: ProductosService) {}

  ngOnInit() {
    this.dejarDeEscuchar = this.servicio.escuchar(
      (lista) => {
        this.productos.set(lista);
        this.cargando.set(false);
      },
      (error) => {
        this.cargando.set(false);
        this.mensaje.set('No se pudo leer Firestore: ' + error.message);
      },
    );
  }

  ngOnDestroy() {
    this.dejarDeEscuchar?.();
  }

  async guardar() {
    const f = this.form;
    if (!f.nombre.trim() || !f.categoria.trim() || f.precio == null || f.stock == null) {
      this.mensaje.set('Completa nombre, precio, stock y categoría.');
      return;
    }
    const datos: Producto = {
      nombre: f.nombre.trim(),
      categoria: f.categoria.trim(),
      precio: Number(f.precio),
      stock: Number(f.stock),
    };
    try {
      const id = this.editandoId();
      if (id) {
        await this.servicio.actualizar(id, datos);
        this.mensaje.set('Producto actualizado.');
      } else {
        await this.servicio.crear(datos);
        this.mensaje.set('Producto creado.');
      }
      this.cancelar();
    } catch (e: any) {
      this.mensaje.set('Error al guardar: ' + e.message);
    }
  }

  editar(p: Producto) {
    this.editandoId.set(p.id!);
    this.form = { nombre: p.nombre, precio: p.precio, stock: p.stock, categoria: p.categoria };
    this.mensaje.set('');
  }

  cancelar() {
    this.editandoId.set(null);
    this.form = this.vacio();
  }

  async eliminar(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await this.servicio.eliminar(p.id!);
      this.mensaje.set('Producto eliminado.');
    } catch (e: any) {
      this.mensaje.set('Error al eliminar: ' + e.message);
    }
  }

  private vacio(): Producto {
    return { nombre: '', precio: null as unknown as number, stock: null as unknown as number, categoria: '' };
  }
}