Información del Equipo
Integrante 1: Vicente Javier Figueroa Lazo, vicente.figueroa01@alumnos.ucn.cl, 21.536.417-8
Integrante 2: Vicente Arnoldo Castro Zepeda, vicente.castro02@alumnos.ucn.cl, 21.448.750-0

--Descripción del Proyecto--
Este proyecto corresponde al desarrollo del frontend para un sistema de e-commerce llamado BLACKCAT, construido con Next.js 14 utilizando App Router. Se implementa una interfaz visual moderna, con páginas para registrar usuarios, iniciar sesión, ver productos destacados y acceder al detalle de cada producto.
Por ahora, el proyecto tiene un enfoque visual no funcional: no hay conexión real al backend ni autenticación activa. Se encuentra preparado para futuras integraciones.

----Requisitos del Sistema----
-Node.js v18 o superior
-NPM
-Git
-Navegador moderno
-Visual Studio Code (recomendado)

----Instalación y Ejecución-----
Clonar el repositorio:
git clone https://github.com/VicenteeFigueroa/Taller-2.git
cd Taller-2

Instalar dependencias:
npm install

Ejecutar la aplicación:
npm run dev

La app estará disponible en:
http://localhost:3000

----Estructura del Proyecto----

src/app: Definición de rutas como /, /register, /login, /products/[id]
src/views: Vistas de las páginas (RegisterPage, ProductDetailPage, etc.)
src/components: Navbar, modales, botones, campos, etc.

----Vistas Implementadas----

Home: Página principal con productos destacados
Registro (/register): Formulario validado con zod y react-hook-form
Inicio de sesión (/login): Vista visual de autenticación
Detalle de Producto (/products/[id]): Vista con diseño visual del producto
Navbar persistente: con logo y botón para login

----Routing y Navegación----
Implementado con Link de Next.js (next/link)
Desde la vista principal se puede acceder al detalle del producto mediante los botones "Ver más"
El logo redirige al Home
La barra superior (navbar) se mantiene entre vistas (registrar, iniciar sesión)