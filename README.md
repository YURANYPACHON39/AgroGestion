# PROYECTO-PROGRAMACION-2
# AGROGESTIÓN: Sistema Inteligente para la Administración de cultivos

## Descripción del problema que resuelve

Los agricultores dedicados al cultivo de zanahoria en zonas de clima frío enfrentan dificultades en la gestión técnica y operativa de sus cultivos, lo que reduce la eficiencia y rentabilidad de sus actividades. Algunos de los problemas más comunes incluyen:

- **Registro manual y desorganizado:** Muchos agricultores aún utilizan notas en papel o la memoria para el seguimiento del cultivo, lo que genera pérdidas de información clave.
- **Desperdicio de recursos:** Sin un control eficiente de insumos como agua, fertilizantes y pesticidas, es común incurrir en sobrecostos y aplicar materiales de manera inadecuada.
- **Falta de planificación:** La ausencia de cronogramas estructurados genera retrasos en labores críticas como la siembra, el riego o la cosecha, afectando el rendimiento.
- **Dificultad para analizar datos:** La falta de reportes estructurados impide evaluar el desempeño productivo y hacer mejoras en futuras temporadas.

**AgroGestión** es una aplicación web moderna que centraliza y automatiza la gestión del cultivo de zanahoria, especialmente en zonas de clima frío. Ofrece una interfaz intuitiva, accesible desde cualquier navegador, con registro automatizado, control de recursos, planificación de actividades y reportes visuales.

## Integrantes del Equipo

- Monica Alejandra Avellaneda  
- Yurany Alejandra Pachon

## Lista Inicial de Módulos del Sistema

### Registro y Seguimiento de Cultivos
- Registro de información por cultivo: tipo de planta, fecha de siembra, tratamientos aplicados, fecha de cosecha.
- Visualización del historial con gráficos de crecimiento y productividad.
- Envío automático de alertas por correo electrónico para tareas programadas como riego, fertilización y cosecha.

### Planificación de Actividades
- Calendario interactivo para registrar tareas como siembra, riego, fertilización y cosecha.
- Notificaciones automáticas por correo electrónico.

### Generación de Reportes y Análisis de Datos
- Informes detallados sobre el rendimiento, uso de recursos y cronogramas.
- Visualización gráfica de los datos (barras, líneas, pastel).
- Exportación de reportes en PDF o CSV (compatible con MATLAB).

## Interfaz de Usuario

La interfaz de AgroGestión ha sido diseñada para ser intuitiva, moderna y accesible desde cualquier navegador web. Su objetivo es brindar una experiencia clara, ordenada y visualmente agradable.

### Diseño General
- Aplicación web responsiva: compatible con PC, tabletas y celulares.
- Navegación lateral fija con menú vertical e íconos identificables.
- Panel principal tipo dashboard con datos clave.
- Estilo basado en Material Design: colores suaves, tarjetas informativas, tipografía clara.

### Componentes Principales

#### Pantalla de Inicio
- Inicio de sesión con correo y contraseña.
- Logo del sistema y mensaje de bienvenida.

#### Panel Principal
- Número de cultivos activos.
- Consumo de recursos en la última semana.
- Tareas próximas destacadas.
- Gráficos de productividad por cultivo.
- Accesos directos a los módulos principales.

#### Módulo de Cultivos
- Formulario de registro con validación.
- Tabla histórica de cultivos con filtros.
- Gráficos automáticos de productividad.

#### Módulo de Planificación
- Calendario dinámico tipo Google Calendar.
- Registro de tareas al hacer clic en una fecha.
- Envío de recordatorios por EmailJS.

#### Módulo de Reportes
- Filtros por tipo de cultivo, actividad o fecha.
- Visualización con gráficos interactivos.
- Botones para exportar PDF o CSV.

## Tecnología

| Elementos         | Descripción                                |
|--------------------|--------------------------------------------|
| Lenguaje           | JavaScript (JS), HTML, CSS                 |
| Base de Datos      | Firebase Firestore                         |
| Autenticación      | Firebase Authentication                    |
| Editor de Código   | Visual Studio Code                         |
| Servicio de Correo | EmailJS                                    |
| Librerías Extras   | Chart.js (gráficos), PDF (exportación)   |

## Flujo del Sistema

1. **Inicio de Sesión**
   - Acceso desde navegador.
   - Inicio de sesión mediante autenticación.

2. **Registro y Seguimiento**
   - Acceso al módulo de cultivos desde el menú.
   - Registro de datos en Firestore.
   - Visualización de historial con gráficos.

3. **Planificación de Actividades**
   - Calendario dinámico.
   - Registro y edición de tareas.
   - Envío automático de notificaciones.

4. **Reportes y Análisis**
   - Filtros por fecha, cultivo o actividad.
   - Visualización de gráficos.
   - Exportación a PDF o CSV.

5. **Panel Principal**
   - Resumen visual de cultivos y recursos.
   - Estadísticas clave y tareas próximas.
