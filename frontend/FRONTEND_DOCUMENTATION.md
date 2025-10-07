# Documentación del Frontend - Faustinee

## Descripción General

El frontend de Faustinee es una aplicación web desarrollada en React con TypeScript que proporciona una interfaz moderna y responsiva para gestionar un sistema de blog/CMS. Incluye un dashboard administrativo completo y una interfaz pública para visualizar contenido.

## Tecnologías Utilizadas

- **React 18.3** - Biblioteca de interfaz de usuario
- **TypeScript 5.6** - Tipado estático
- **Vite 6.0** - Herramienta de construcción
- **Tailwind CSS 3.4** - Framework de estilos
- **React Router 7.1** - Enrutamiento
- **Zustand 5.0** - Gestión de estado
- **Axios 1.7** - Cliente HTTP
- **TipTap 3.0** - Editor de texto enriquecido

## Estructura del Proyecto

```
frontend/
├── public/
│   └── logo.jpeg                 # Logo de la aplicación
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── Dashboard/            # Componentes del dashboard
│   │   │   ├── DataTable.tsx     # Tabla de datos
│   │   │   ├── Forms/            # Formularios
│   │   │   │   ├── CoverForm.tsx
│   │   │   │   ├── EditEntityForm.tsx
│   │   │   │   ├── EditPasswordModal.tsx
│   │   │   │   └── UserForm.tsx
│   │   │   ├── Layout.tsx        # Layout del dashboard
│   │   │   ├── PaginatedTable.tsx
│   │   │   ├── PaginationControls.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── Buttons/
│   │   │   └── Button.tsx
│   │   ├── Layouts/              # Layouts de páginas
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── NewsSection.tsx
│   │   │   └── PostList.tsx
│   │   ├── Post/                 # Componentes de posts
│   │   │   ├── PostHorizontal.tsx
│   │   │   ├── PostLargeL.tsx
│   │   │   └── PostVertical.tsx
│   │   ├── ui/                   # Componentes UI base
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── BlogEditor.tsx        # Editor de blog
│   │   ├── CoverGalery.tsx       # Galería de covers
│   │   ├── EditorTipTap.tsx      # Editor TipTap
│   │   ├── FeaturedPost.tsx      # Post destacado
│   │   ├── Footer.tsx            # Pie de página
│   │   ├── Header.tsx            # Cabecera
│   │   ├── LoginForm.tsx         # Formulario de login
│   │   ├── Modal.tsx             # Modal genérico
│   │   ├── Nota.tsx              # Componente de nota
│   │   └── ProtectedRoute.tsx    # Ruta protegida
│   ├── hooks/                    # Hooks personalizados
│   │   ├── useAuth.tsx           # Hook de autenticación
│   │   ├── useCMS.tsx            # Hook de CMS
│   │   ├── useLoading.tsx        # Hook de loading
│   │   ├── usePost.tsx           # Hook de posts
│   │   ├── useTheme.tsx          # Hook de tema
│   │   ├── useUser.ts            # Hook de usuarios
│   │   └── use-mobile.tsx        # Hook de detección móvil
│   ├── interfaces/               # Definiciones de tipos
│   │   ├── Cover.ts              # Interfaz de covers
│   │   ├── Image.ts              # Interfaz de imágenes
│   │   ├── Page.ts               # Interfaz de páginas
│   │   ├── Post.ts               # Interfaz de posts
│   │   ├── types.ts              # Tipos generales
│   │   └── User.ts               # Interfaz de usuarios
│   ├── lib/
│   │   └── utils.ts              # Utilidades
│   ├── pages/                    # Páginas de la aplicación
│   │   ├── Dashboard/            # Páginas del dashboard
│   │   │   ├── covers/
│   │   │   │   └── index.tsx
│   │   │   ├── posts/
│   │   │   │   └── index.tsx
│   │   │   ├── users/
│   │   │   │   └── index.tsx
│   │   │   └── login.tsx
│   │   ├── Home.tsx              # Página principal
│   │   ├── NewByCategory.tsx     # Noticias por categoría
│   │   └── Nota.tsx              # Página de nota individual
│   ├── stores/                   # Stores de Zustand
│   │   ├── postsStores.ts        # Store de posts
│   │   ├── sesionStore.ts        # Store de sesión
│   │   └── usersStore.ts         # Store de usuarios
│   ├── assets/                   # Recursos estáticos
│   │   ├── empresas/             # Logos de empresas
│   │   ├── fonts/                # Fuentes personalizadas
│   │   └── ...                   # Otros assets
│   ├── App.tsx                   # Componente principal
│   ├── App.css                   # Estilos globales
│   ├── index.css                 # Estilos base
│   └── main.tsx                  # Punto de entrada
├── package.json                  # Dependencias y scripts
├── tailwind.config.js            # Configuración de Tailwind
├── vite.config.ts                # Configuración de Vite
├── tsconfig.json                 # Configuración de TypeScript
└── eslint.config.js              # Configuración de ESLint
```

## Características Principales

### 🎨 Interfaz de Usuario
- **Diseño responsivo** adaptado a móviles y desktop
- **Tema personalizable** con soporte para modo oscuro
- **Componentes reutilizables** basados en Radix UI
- **Animaciones suaves** con AOS (Animate On Scroll)
- **Tipografía personalizada** con múltiples fuentes

### 📝 Editor de Contenido
- **Editor TipTap** con funcionalidades avanzadas:
  - Formato de texto (negrita, cursiva, subrayado)
  - Colores y resaltado
  - Enlaces y tablas
  - Subíndices y superíndices
  - Alineación de texto
- **Upload de imágenes** con compresión automática
- **Vista previa en tiempo real**
- **Soporte para HTML** completo

### 🔐 Sistema de Autenticación
- **Login seguro** con JWT
- **Rutas protegidas** para administración
- **Gestión de sesión** persistente
- **Logout automático** por expiración

### 📊 Dashboard Administrativo
- **Gestión de usuarios** (CRUD completo)
- **Gestión de posts** con editor avanzado
- **Gestión de covers** (portadas)
- **Tablas paginadas** con filtros y búsqueda
- **Estadísticas** y métricas

### 🖼️ Gestión de Medios
- **Upload de imágenes** optimizado
- **Compresión automática** para archivos grandes
- **Galería de covers** con vista previa
- **Gestión de imágenes** en posts

## Hooks Personalizados

### useAuth
Maneja la autenticación y autorización:
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### usePost
Gestiona operaciones de posts:
```typescript
const { 
  posts, 
  createPost, 
  updatePost, 
  deletePost, 
  uploadImage 
} = usePost();
```

### useLoading
Maneja estados de carga:
```typescript
const { loading, open, close, setMessage } = useLoading();
```

## Gestión de Estado

### Zustand Stores

#### postsStores
```typescript
interface PostsStore {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Post) => void;
  deletePost: (id: string) => void;
  setPosts: (posts: Post[]) => void;
}
```

#### sesionStore
```typescript
interface SesionStore {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearSession: () => void;
}
```

#### usersStore
```typescript
interface UsersStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: number, user: User) => void;
  deleteUser: (id: number) => void;
  setUsers: (users: User[]) => void;
}
```

## Componentes Principales

### Dashboard Layout
```typescript
<DashboardLayout>
  <Sidebar />
  <main>
    <DataTable />
    <PaginatedTable />
  </main>
</DashboardLayout>
```

### Editor TipTap
```typescript
<EditorTipTap
  content={content}
  onChange={setContent}
  placeholder="Escribe tu contenido..."
/>
```

### Formularios
- **UserForm**: Creación y edición de usuarios
- **CoverForm**: Gestión de covers
- **EditEntityForm**: Formulario genérico de edición

## Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:8001
VITE_APP_NAME=Faustinee
```

### Tailwind CSS
Configuración personalizada en `tailwind.config.js`:
- Colores personalizados
- Fuentes personalizadas
- Breakpoints responsivos
- Animaciones personalizadas

### Vite
Configuración en `vite.config.ts`:
- Alias de rutas
- Plugins de React
- Configuración de build
- Proxy para desarrollo

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Linting
npm run lint

# Vista previa de producción
npm run preview
```

## Dependencias Principales

### UI y Estilos
- `@radix-ui/*` - Componentes UI accesibles
- `tailwindcss` - Framework de CSS
- `lucide-react` - Iconos
- `class-variance-authority` - Variantes de componentes

### Funcionalidad
- `react-router-dom` - Enrutamiento
- `axios` - Cliente HTTP
- `zustand` - Gestión de estado
- `immer` - Inmutabilidad

### Editor
- `@tiptap/*` - Editor de texto enriquecido
- `react-quill` - Editor alternativo
- `dompurify` - Sanitización HTML

### Utilidades
- `sweetalert2` - Alertas y modales
- `sonner` - Notificaciones toast
- `aos` - Animaciones
- `clsx` - Utilidades de clases CSS

## Arquitectura

### Patrón de Diseño
- **Componentes funcionales** con hooks
- **Composición** sobre herencia
- **Separación de responsabilidades**
- **Estado local** vs **estado global**

### Flujo de Datos
1. **Usuario** interactúa con componente
2. **Hook** procesa la acción
3. **Store** actualiza el estado
4. **API** sincroniza con backend
5. **UI** se re-renderiza

### Optimizaciones
- **Lazy loading** de componentes
- **Memoización** con React.memo
- **Compresión de imágenes** automática
- **Code splitting** con Vite

## Responsive Design

### Breakpoints
```css
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Pantalla grande */
```
## Accesibilidad

### Características Implementadas
- **Navegación por teclado**
- **ARIA labels** y roles
- **Contraste de colores** adecuado
- **Focus management**
- **Screen reader** friendly

## Despliegue

### Build de Producción
```bash
npm run build
```

## Licencia

Este proyecto es privado y pertenece a Faustinee.
