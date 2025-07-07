# BLACKCAT - E-commerce Frontend

## Información del Equipo

- **Vicente Javier Figueroa Lazo**  
  Correo: vicente.figueroa01@alumnos.ucn.cl  
  RUT: 21.536.417-8

- **Vicente Arnoldo Castro Zepeda**  
  Correo: vicente.castro02@alumnos.ucn.cl  
  RUT: 21.448.750-0

---

## Descripción del Proyecto

**BLACKCAT** es una aplicación web frontend desarrollada con **Next.js 14** utilizando el sistema de enrutamiento **App Router**, diseñada para ofrecer una experiencia moderna en comercio electrónico. Permite registrar usuarios, iniciar sesión, explorar productos, visualizar detalles, gestionar un carrito de compras y administrar el sistema según el rol del usuario.

El proyecto está conectado a un **backend funcional**, proporcionando autenticación JWT, persistencia de datos y operaciones en tiempo real con la API REST.

---

## Repositorios

- **Frontend:** https://github.com/VicenteeFigueroa/Taller-2  
- **Backend:** https://github.com/FernandoChav/AyudantiaWebMovil/tree/main  
- **Figma:** https://www.figma.com/design/Y3A2jigVwZAPpsy1LFa8gQ/Usuario-no-autenticado?node-id=0-1&t=2FmxwTiU9SBaCkgS-1

---

## Requisitos del Sistema

- Node.js 18+
- NPM
- Git
- .NET SDK 7+
- Navegador moderno
- Visual Studio Code (recomendado)

---

## Instalación y Ejecución

### 1. Clonar el repositorio del frontend

```bash
git clone https://github.com/VicenteeFigueroa/Taller-2.git
cd Taller-2
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo llamado `.env` en la raíz del proyecto con la siguiente línea:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Ejecutar el frontend


npm run dev

La aplicación estará disponible en: http://localhost:3000

---

## Ejecución del Backend (.NET)

### a. Clonar el repositorio


git clone https://github.com/FernandoChav/AyudantiaWebMovil.git
cd AyudantiaWebMovil/backend


### b. Ejecutar el backend

dotnet run


Esto levantará la API en: `http://localhost:5000`

---

## Estructura del Proyecto

```
src/
├── app/               # Rutas y layouts
├── components/        # Componentes reutilizables (ui/ y shared/)
├── views/             # Composición visual de páginas
├── contexts/          # Manejo de estados globales (auth, cart)
├── services/          # Comunicación con la API (Axios)
├── hooks/             # Hooks personalizados
├── interfaces/        # Tipado de entidades
├── styles/            # Estilos globales
└── utils/             # Funciones auxiliares
```

---

## Funcionalidades

### Usuario No Autenticado

- Catálogo con paginación, filtros y ordenamiento
- Detalle de producto con imágenes, descripción y validación de stock

### Usuario Cliente

- Registro y login con JWT + redirección por rol
- Edición de perfil con validación visual
- Carrito persistente por usuario
- Checkout con validaciones
- Historial de pedidos con filtros y vista detallada

### Usuario Administrador

- Panel administrativo protegido
- Creación de productos (formulario completo con imagen)
- Listado y gestión de productos
- Gestión de usuarios (habilitar/deshabilitar)

---

## Comandos Útiles


# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Lint y formato
npm run lint
npm run format


---

## Consideraciones Finales

- Asegúrate de tener el backend ejecutándose en `http://localhost:5000`
- La aplicación sigue los lineamientos de diseño entregados en Figma
- Se respetan buenas prácticas: separación de responsabilidades, arquitectura modular, validaciones, rutas protegidas, uso de Axios con interceptores y Context API

---





