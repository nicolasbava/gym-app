# Configuración de Autenticación con Google en Supabase

## Pasos para configurar Google OAuth en Supabase

### 1. Configurar Google OAuth en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** > **Credentials**
4. Haz clic en **Create Credentials** > **OAuth client ID**
5. Si es la primera vez, configura la pantalla de consentimiento OAuth:
   - Tipo de aplicación: **External**
   - Completa la información requerida
   - Agrega tu email de prueba si es necesario
6. Crea las credenciales OAuth:
   - Tipo de aplicación: **Web application**
   - Nombre: Luxion Fitness (o el que prefieras)
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (para desarrollo)
     - `https://tu-dominio.com` (para producción)
   - **Authorized redirect URIs**:
     - `https://iccxfoufkkzshcjrsiwu.supabase.co/auth/v1/callback`
7. Copia el **Client ID** y **Client Secret**

### 2. Configurar en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com/)
2. Navega a **Authentication** > **Providers**
3. Busca **Google** en la lista de proveedores
4. Activa el toggle de Google
5. Ingresa las credenciales:
   - **Client ID (for OAuth)**: Pega el Client ID de Google Cloud Console
   - **Client Secret (for OAuth)**: Pega el Client Secret de Google Cloud Console
6. Haz clic en **Save**

### 3. Configurar Redirect URLs en Supabase

1. En el mismo panel de Supabase, ve a **Authentication** > **URL Configuration**
2. Agrega las siguientes URLs en **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (para desarrollo)
   - `https://tu-dominio.com/auth/callback` (para producción)

### 4. Actualizar variables de entorno

Asegúrate de que tu archivo `.env` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://iccxfoufkkzshcjrsiwu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_b7iJlf9doOsvsm447jN_OQ_7YMcwa4i
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Para producción, cambia `NEXT_PUBLIC_SITE_URL` a tu dominio real.

### 5. Instalar dependencias

```bash
npm install
```

### 6. Probar la autenticación

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a `http://localhost:3000/auth`
3. Haz clic en "Continuar con Google"
4. Deberías ser redirigido a Google para autenticarte
5. Después de autenticarte, serás redirigido de vuelta a tu aplicación

## Notas importantes

- El **Client Secret** debe mantenerse seguro y nunca exponerse en el código del cliente
- Las URLs de redirección deben coincidir exactamente en Google Cloud Console y Supabase
- Para producción, asegúrate de actualizar todas las URLs con tu dominio real
- El middleware protegerá las rutas que requieren autenticación automáticamente
