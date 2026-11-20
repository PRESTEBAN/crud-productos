# CRUD de Productos con Angular y Firebase

## Propósito
Aplicación web en Angular que administra productos almacenados en Cloud Firestore,
con actualización en tiempo real mediante un Observable
(Práctica 02.2 – Programación y Plataformas Web, Universidad Politécnica Salesiana).

- **Aplicación desplegada (Vercel):** https://TU-APP.vercel.app
- **Repositorio (GitHub):** https://github.com/TU-USUARIO/TU-REPOSITORIO

## Funciones del CRUD
- **Crear:** formulario que registra un producto en la colección `productos`.
- **Consultar:** tabla HTML alimentada por un Observable (`onSnapshot`) que se actualiza en tiempo real.
- **Actualizar:** el botón *Editar* carga los datos en el formulario y guarda los cambios en el mismo documento, usando su identificador.
- **Eliminar:** solicita confirmación; si se cancela, el producto se conserva.
- **Validaciones:** nombre y categoría con texto; precio numérico mayor o igual a 0; stock entero mayor o igual a 0.
- Mensajes cuando una operación falla o cuando la colección está vacía.

## Modelo de producto
| Campo     | Tipo   | Descripción                              |
|-----------|--------|------------------------------------------|
| id        | string | Identificador del documento en Firestore |
| nombre    | string | Nombre del producto                      |
| precio    | number | Precio (≥ 0)                             |
| stock     | number | Cantidad entera (≥ 0)                    |
| categoria | string | Categoría del producto                   |

## Arquitectura
- `src/app/services/producto.service.ts`: único lugar con acceso a Firestore (consulta en tiempo real, crear, actualizar y eliminar).
- `src/app/productos/`: componente con el formulario, las validaciones y la tabla.
- `src/app/models/producto.model.ts`: interfaz del producto.

## Configuración de Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com) y registrar una app web.
2. Activar **Cloud Firestore** con reglas que permitan leer y escribir en la colección `productos`.
3. Copiar `src/environments/environment.example.ts` como `src/environments/environment.ts`
   y completar las credenciales. Este archivo está en `.gitignore` y no se sube al repositorio.

## Instalación y ejecución local
```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
cd TU-REPOSITORIO
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
npm start
```
Abrir http://localhost:4200

## Despliegue en Vercel
1. Importar el repositorio de GitHub en [Vercel](https://vercel.com).
2. Configurar:
   - **Build Command:** `node scripts/set-env.js && npm run build`
   - **Output Directory:** `dist/productos-app/browser`
3. Agregar las variables de entorno: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`,
   `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`.
4. Desplegar y probar las cuatro operaciones desde la URL pública.