# Manual de Uso — Portal Hotel Termas Chillán

> Versión 1.0 · Mayo 2026

---

## Índice

1. [Descripción general del sistema](#1-descripción-general-del-sistema)
2. [Portal del Huésped](#2-portal-del-huésped)
   - 2.1 [Inicio](#21-inicio)
   - 2.2 [Mi Habitación](#22-mi-habitación)
   - 2.3 [Restaurantes](#23-restaurantes)
   - 2.4 [Wellness (Spa y Gimnasio)](#24-wellness-spa-y-gimnasio)
   - 2.5 [Actividades](#25-actividades)
   - 2.6 [Familia](#26-familia)
   - 2.7 [Emergencias](#27-emergencias)
   - 2.8 [Cambio de idioma](#28-cambio-de-idioma)
   - 2.9 [Instalación como app (PWA)](#29-instalación-como-app-pwa)
3. [Panel de Administración](#3-panel-de-administración)
   - 3.1 [Acceso y roles](#31-acceso-y-roles)
   - 3.2 [Dashboard](#32-dashboard)
   - 3.3 [Módulo Alertas](#33-módulo-alertas)
   - 3.4 [Módulo Spa](#34-módulo-spa)
   - 3.5 [Módulo Restaurantes](#35-módulo-restaurantes)
   - 3.6 [Módulo Actividades](#36-módulo-actividades)
   - 3.7 [Módulo Familia](#37-módulo-familia)
   - 3.8 [Módulo Habitación](#38-módulo-habitación)
   - 3.9 [Módulo Eventos](#39-módulo-eventos-solo-superadmin)
   - 3.10 [Módulo Usuarios](#310-módulo-usuarios-solo-superadmin)
   - 3.11 [Módulo Logs](#311-módulo-logs-solo-superadmin)
   - 3.12 [Configuración del sistema](#312-configuración-del-sistema-solo-superadmin)
4. [Gestión de contenido multilingüe](#4-gestión-de-contenido-multilingüe)
5. [Subida de imágenes](#5-subida-de-imágenes)
6. [Preguntas frecuentes](#6-preguntas-frecuentes)

---

## 1. Descripción general del sistema

El portal **Hotel Termas Chillán** es una plataforma web progresiva (PWA) diseñada para dos audiencias:

| Audiencia | Acceso | Propósito |
|-----------|--------|-----------|
| **Huéspedes** | `/home` (sin login) | Consultar servicios del hotel, menús, actividades, spa y más |
| **Administradores** | `/admin` (con login) | Gestionar todo el contenido visible para los huéspedes |

**Tecnologías clave:**
- Aplicación Next.js (TypeScript)
- Base de datos PostgreSQL (Neon serverless)
- Soporte trilingüe: Español · English · Português
- Traducción automática vía DeepL al guardar contenido

---

## 2. Portal del Huésped

El portal es accesible desde cualquier dispositivo. En móvil se recomienda instalarlo como app (ver sección 2.9). La navegación principal se encuentra en la **barra inferior** (móvil) y en el **encabezado** (escritorio).

### 2.1 Inicio

**Ruta:** `/home`

La pantalla de inicio muestra:

- **Alertas activas** — Avisos importantes del hotel (cierre de instalaciones, eventos especiales, etc.).
- **Próximos eventos** — Listado de actividades programadas con fecha, hora y lugar.
- **Accesos rápidos** — Atajos a las secciones principales.
- **Actividades de temporada** — Carrusel con las experiencias disponibles según la época del año (verano/invierno).

> Las alertas y eventos se administran desde el panel de administración.

---

### 2.2 Mi Habitación

**Ruta:** `/habitacion`

Contiene toda la información relacionada con los servicios de la habitación:

| Sección | Contenido |
|---------|-----------|
| **Housekeeping** | Horarios y procedimiento de limpieza |
| **Seguridad** | Protocolos de seguridad y emergencias internas |
| **Caja / Checkout** | Horarios y procedimiento de pago y salida |
| **Protocolo** | Normas de convivencia y uso de instalaciones |
| **Reglas** | Política del hotel |
| **Productos** | Catálogo de productos disponibles en la habitación (minibar, amenities) |
| **Emergencias** | Acceso rápido a números de emergencia |

Cada sección se puede expandir/contraer tocando el encabezado.

---

### 2.3 Restaurantes

**Ruta:** `/restaurantes`

El hotel cuenta con tres opciones de gastronomía:

| Restaurante | Estilo | Ruta |
|-------------|--------|------|
| **La Arboleda** | Restaurante principal, cocina refinada | `/restaurantes/arboleda` |
| **La Grieta** | Bar casual, picadas y tragos | `/restaurantes/la-grieta` |
| **Muffin Café** | Pastelería, desayunos, snacks | `/restaurantes/muffin` |

En cada página de restaurante encontrarás:
- Carta completa organizada por **categorías y subcategorías**
- **Precios** de cada ítem
- **Horarios de atención**
- Descripción de platos y bebidas

---

### 2.4 Wellness: Spa y Gimnasio

**Ruta principal:** `/wellness`

Desde esta sección se accede a:

#### Spa Alunco (`/wellness/spa`)
- Catálogo de servicios: masajes, rituales, faciales, circuitos hídricos, pedicura/manicura
- Precio y duración de cada tratamiento
- Para reservar, llamar al **interno 3544**

#### Gimnasio (`/wellness/gimnasio`)
- Listado de clases disponibles
- Horarios y precios
- Descripción de cada clase

---

### 2.5 Actividades

**Ruta:** `/actividades`

Las actividades se organizan automáticamente según la **temporada**:

- **Verano** (noviembre – mayo): trekking, ciclismo, canopy, etc.
- **Invierno** (junio – octubre): ski, snowboard, actividades en nieve, etc.

Cada actividad muestra:
- Nombre y descripción
- Precio
- Categoría (deporte, aventura, cultura, etc.)
- Imagen representativa

---

### 2.6 Familia

**Ruta:** `/familia`

Programas y servicios orientados a familias con niños:

| Programa | Descripción |
|----------|-------------|
| **Club de niños** | Actividades recreativas supervisadas |
| **Guardería** | Cuidado infantil con horarios definidos |
| **Actividades familiares** | Programas estacionales para toda la familia |

Se muestran horarios, edades permitidas y reglas de cada programa.

---

### 2.7 Emergencias

**Ruta:** `/emergencia`

Acceso rápido a los números de emergencia del hotel:

- **Desde habitación:** marcar `3500`
- **Desde celular externo:** `+56 2 2322 3500`

---

### 2.8 Cambio de idioma

El portal está disponible en **tres idiomas**. Para cambiar el idioma, tocar el ícono de bandera en el encabezado:

| Bandera | Idioma |
|---------|--------|
| 🇨🇱 | Español (por defecto) |
| 🇺🇸 | English |
| 🇧🇷 | Português |

El idioma seleccionado se guarda automáticamente en el dispositivo.

---

### 2.9 Instalación como app (PWA)

El portal funciona como una aplicación instalable en teléfonos sin necesidad de tiendas de aplicaciones.

**En iPhone (Safari):**
1. Abrir el portal en Safari
2. Tocar el ícono de **Compartir** (cuadrado con flecha)
3. Seleccionar **"Agregar a pantalla de inicio"**
4. Confirmar con **Agregar**

**En Android (Chrome):**
1. Abrir el portal en Chrome
2. Tocar los tres puntos (**⋮**) en la esquina superior derecha
3. Seleccionar **"Instalar aplicación"** o **"Agregar a pantalla de inicio"**

Una vez instalada, el portal se abre como una app nativa sin barra del navegador.

---

## 3. Panel de Administración

### 3.1 Acceso y roles

**URL de acceso:** `/admin/login`

Ingresar con email y contraseña proporcionados por el administrador del sistema.

El sistema maneja dos niveles de acceso:

| Rol | Acceso |
|-----|--------|
| **Superadmin** | Acceso total: todos los módulos, usuarios, logs y configuración |
| **Admin de módulo** | Acceso restringido a un módulo específico (ej: solo Spa, solo Restaurantes) |

> Si intentas acceder a un módulo sin permiso, serás redirigido automáticamente.

Para **cerrar sesión**, hacer clic en el botón "Cerrar sesión" en la barra lateral del panel.

---

### 3.2 Dashboard

**Ruta:** `/admin`

Muestra estadísticas generales del contenido activo:

- Total de servicios de spa
- Total de ítems en menús
- Total de actividades
- Alertas activas

---

### 3.3 Módulo Alertas

**Ruta:** `/admin/alertas`  
**Acceso:** Todos los admins

Las alertas aparecen en la pantalla de inicio del huésped.

#### Crear una alerta
1. Hacer clic en **"Nueva alerta"**
2. Completar:
   - **Título** — Resumen breve
   - **Mensaje** — Texto detallado
   - **Tipo** — `info` (azul), `warning` (naranja) o `closed` (rojo)
3. Activar el toggle **"Activa"** si debe mostrarse inmediatamente
4. Guardar — el sistema genera automáticamente la traducción al inglés y portugués

#### Editar / desactivar
- Hacer clic en el ícono de edición (lápiz) en la fila de la alerta
- Para ocultarla temporalmente, desactivar el toggle sin eliminarla

#### Eliminar
- Hacer clic en el ícono de basura — **esta acción es irreversible**

---

### 3.4 Módulo Spa

**Ruta:** `/admin/spa`  
**Acceso:** Superadmin · Admin de Spa

Gestiona los servicios del Spa Alunco y el Gimnasio.

#### Servicios de Spa
Los servicios se organizan en 5 categorías:
- Masajes · Rituales · Faciales · Circuito Hídrico · Pedicura & Manicura

Para **agregar un servicio:**
1. Seleccionar la categoría correspondiente
2. Clic en **"Nuevo servicio"**
3. Completar nombre, descripción, duración (minutos) y precio
4. Guardar — la traducción se genera automáticamente

#### Clases de Gimnasio
- Crear, editar y eliminar clases con nombre, descripción, horario y precio

#### Horarios
- Actualizar los horarios de atención para Spa, Sala de Tratamientos y Peluquería

#### Imagen de portada
- Subir o reemplazar la imagen hero de la sección Wellness

---

### 3.5 Módulo Restaurantes

**Ruta:** `/admin/restaurantes`  
**Acceso:** Superadmin · Admin de Restaurantes

Gestiona los menús y horarios de los tres restaurantes.

#### Ítems del menú
1. Seleccionar el restaurante en el selector superior: **La Arboleda / La Grieta / Muffin**
2. Clic en **"Nuevo ítem"**
3. Completar:
   - Nombre y descripción
   - **Categoría** (ej: Entradas, Fondos, Postres, Tragos)
   - **Subcategoría** (opcional, para mayor organización)
   - Precio
4. Guardar

Para reordenar ítems dentro de una categoría, usar el campo **"Orden"** al editar.

#### Horarios de restaurante
- Editar la información de horarios de atención de cada local

---

### 3.6 Módulo Actividades

**Ruta:** `/admin/actividades`  
**Acceso:** Superadmin · Admin de Actividades

Gestiona las actividades de temporada.

#### Crear una actividad
1. Clic en **"Nueva actividad"**
2. Completar:
   - Nombre y descripción
   - **Temporada**: `verano` o `invierno`
   - **Categoría** (deporte, aventura, etc.)
   - Precio
   - Imagen (opcional)
3. Guardar

Las actividades se mostrarán en el portal según la temporada actual (detectada automáticamente por la fecha).

---

### 3.7 Módulo Familia

**Ruta:** `/admin/familia`  
**Acceso:** Superadmin · Admin de Familia

Gestiona los programas familiares.

#### Tipos de programa
| Tipo | Descripción |
|------|-------------|
| `club` | Club de niños |
| `guarderia` | Guardería |
| `actividad` | Actividad familiar estacional |

Para cada programa se puede editar: nombre, descripción, horario, temporada e imagen.

---

### 3.8 Módulo Habitación

**Ruta:** `/admin/habitacion`  
**Acceso:** Superadmin · Admin de Habitación

#### Secciones informativas
Edita el contenido de las secciones del menú "Mi Habitación":
- Housekeeping · Seguridad · Caja · Protocolo · Convivencia

Cada sección tiene título y contenido en texto libre (soporte Markdown básico).

#### Productos
Gestiona el catálogo de productos de la habitación (minibar, amenities):
- Agregar/editar/eliminar productos con nombre, categoría y precio

---

### 3.9 Módulo Eventos *(solo Superadmin)*

**Ruta:** `/admin/eventos`

Los eventos aparecen en la pantalla de inicio del huésped.

#### Crear un evento
1. Clic en **"Nuevo evento"**
2. Completar:
   - **Día y mes** (número)
   - **Hora** (formato HH:MM)
   - **Título** — nombre del evento
   - **Descripción** — detalle
   - **Lugar** — ubicación dentro del hotel
3. Guardar — traducción automática generada

---

### 3.10 Módulo Usuarios *(solo Superadmin)*

**Ruta:** `/admin/usuarios`

Gestiona las cuentas de acceso al panel de administración.

#### Crear un usuario
1. Clic en **"Nuevo usuario"**
2. Completar:
   - Nombre completo
   - Email (será el usuario de login)
   - Contraseña temporal
   - **Rol**: `superadmin` o `admin`
   - **Módulo** (si es admin de módulo): spa, restaurantes, actividades, familia, habitacion
3. Guardar

#### Seguridad
- Las contraseñas se almacenan cifradas (bcrypt) — nunca en texto plano
- Cada usuario solo tiene acceso al módulo asignado
- Se recomienda cambiar la contraseña temporal en el primer acceso

---

### 3.11 Módulo Logs *(solo Superadmin)*

**Ruta:** `/admin/logs`

Registro de auditoría de todas las acciones realizadas en la plataforma.

Cada entrada del log incluye:
- **Tipo**: `guest` (huésped) o `admin`
- **Acción** realizada
- **Módulo** afectado
- **Actor**: nombre y email del responsable
- **Fecha y hora**

Útil para rastrear cambios, detectar errores o revisar la actividad reciente.

---

### 3.12 Configuración del sistema *(solo Superadmin)*

**Ruta:** `/admin/configuracion`

Almacén de configuraciones globales del sistema en formato clave–valor.

Permite ajustar parámetros del sistema sin necesidad de modificar el código fuente.

---

## 4. Gestión de contenido multilingüe

El sistema soporta **tres idiomas**: Español, Inglés y Portugués.

### Traducción automática
Al guardar cualquier contenido desde el panel de administración (servicios, menús, actividades, etc.), el sistema utiliza la **API de DeepL** para generar automáticamente las traducciones al inglés y portugués.

> **Importante:** La traducción automática es una ayuda, pero puede contener errores de contexto cultural. Se recomienda revisar las traducciones generadas para contenido crítico (precios, protocolos de seguridad).

### Cómo funciona
1. El admin escribe el contenido **en español**
2. Al guardar, el sistema envía el texto a DeepL
3. Las traducciones se almacenan en el campo `translations` de la base de datos
4. El portal del huésped muestra la versión correcta según el idioma elegido

---

## 5. Subida de imágenes

Varios módulos permiten subir imágenes (Spa, Actividades, Familia):

**Requisitos recomendados:**
- Formato: JPG o PNG
- Tamaño máximo: 5 MB por imagen
- Relación de aspecto sugerida: **16:9** (1920×1080 px) para imágenes hero; **4:3** para cards

**Proceso:**
1. En el formulario de edición, hacer clic en el área de subida de imagen
2. Seleccionar el archivo desde el dispositivo
3. El sistema procesa y almacena la imagen
4. Guardar el formulario para que el cambio quede aplicado

---

## 6. Preguntas frecuentes

**¿Cómo desactivo una alerta sin eliminarla?**  
En la lista de alertas, deshabilitar el toggle "Activa". La alerta queda guardada pero invisible para los huéspedes.

**¿Por qué un ítem no aparece en el portal?**  
Verificar que el toggle **"Activo"** esté habilitado. Los ítems inactivos son visibles solo en el panel de administración.

**¿Puedo cambiar el idioma del contenido manualmente?**  
Sí. Al editar un ítem, las traducciones generadas automáticamente son editables campo por campo.

**¿Qué pasa si olvido mi contraseña?**  
Contactar a un Superadmin para que restablezca la contraseña desde el módulo Usuarios.

**¿Cómo sé quién modificó un contenido?**  
Revisar el módulo **Logs** en `/admin/logs`. Cada cambio queda registrado con el usuario y la fecha exacta.

**¿Las actividades cambian solas entre verano e invierno?**  
Sí. El portal detecta automáticamente la temporada según la fecha actual (junio–octubre = invierno, resto del año = verano) y muestra las actividades correspondientes. No requiere intervención manual.

**¿Los huéspedes necesitan crear una cuenta?**  
No. El portal del huésped es de acceso libre, sin registro ni login. Solo el panel de administración requiere autenticación.

---

*Para soporte técnico, contactar al equipo de desarrollo.*
