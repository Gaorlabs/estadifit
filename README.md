# 🥗 Estado Fit - Catálogo Digital y Sistema de Pedidos WhatsApp

Aplicación web moderna y rápida para **Estado Fit** (Repostería artesanal saludable y platos fit). Diseñada con experiencia mobile-first para clientes tanto en tienda física (salón) como para pedidos a domicilio (delivery).

---

## ✨ Características Principales

- **🛵 Modo Pedir Delivery:**
  - Carrito de compras interactivo con cálculo automático.
  - Formulario ágil: Nombre, Teléfono, Dirección de entrega y Referencias.
  - Métodos de pago peruanos con copia rápida de datos: **Yape / Plin (999 888 777)** y **BCP (193-98765432-0-12)**.
  - Envío automático del pedido formateado y detallado directo a **WhatsApp**.

- **🍽️ Modo Ver Carta en Salón:**
  - Modo catálogo limpio pensado para que los clientes en mesa exploren fotos, descripciones, macros y precios sin saturación.
  - Botón de asistencia directa para solicitar la atención de su mesero.

- **📱 Código QR para Mesas:**
  - Generador de código QR incorporado listo para descargar en PNG de alta calidad o imprimir en mesas y barras del restaurante.

- **✨ Portada & Vitrina Interactiva:**
  - Logo con animación de resplandor y levitación suave.
  - Carrusel automático de antojos destacados (Cuchareables, Tortas Fit, Galletones, Salados).
  - Selector rápido de categorías y filtros por dietas (Sin Azúcar, Keto, Alto en Proteína, Vegano, Sin Gluten).

- **🌓 Modo Oscuro / Claro:**
  - Adaptación visual fluida a cualquier preferencia de usuario.

---

## 🛠️ Tecnologías

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Animaciones:** Motion & CSS Keyframes optimizados
- **Generación QR:** qrcode

---

## 🚀 Cómo ejecutar en desarrollo local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU-USUARIO/estado-fit-app.git
   cd estado-fit-app
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador en `http://localhost:3000`.

---

## 📦 Cómo subir este proyecto a GitHub

1. Crea un nuevo repositorio en [GitHub](https://github.com/new) con el nombre `estado-fit-app` (deja sin marcar "Initialize with README").
2. En tu terminal, dentro de la carpeta del proyecto, ejecuta:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/estado-fit-app.git
   git branch -M main
   git push -u origin main
   ```
   *(Reemplaza `TU-USUARIO` por tu usuario de GitHub).*

---

## ⚡ Cómo publicar en Vercel (Gratis en 1 minuto)

El proyecto ya incluye `vercel.json` configurado para Vite y Single Page Application (SPA).

1. Inicia sesión en [Vercel](https://vercel.com/) con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** y selecciona **"Project"**.
3. Selecciona tu repositorio **`estado-fit-app`** y presiona **"Import"**.
4. Vercel autodetectará la configuración:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Haz clic en **"Deploy"**.

¡Listo! En menos de 60 segundos tendrás tu enlace público HTTPS de Vercel (ej: `estado-fit-app.vercel.app`) para compartir con tus clientes o enlazar a tu Instagram y WhatsApp Business.
