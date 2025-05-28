// Importaciones de módulos
import { login, logout, onUserChanged } from "./auth.js";
import { agregarCultivo, obtenerCultivos } from "./cultivos.js";
import { agregarRegistroHistorial, obtenerHistorial } from "./historial.js";

// Firebase Firestore
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Referencias del DOM
const formLogin = document.getElementById("formLogin");
const loginSection = document.getElementById("login");
const menuLateral = document.getElementById("menuLateral");
const contenido = document.getElementById("contenido");
const btnLogout = document.getElementById("btnLogout");
const formCultivo = document.getElementById("formCultivo");
const listaCultivos = document.getElementById("listaCultivos");

// LOGIN
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = formLogin.email.value;
  const password = formLogin.password.value;

  try {
    await login(email, password);
    formLogin.reset();
  } catch (error) {
    alert("Error de inicio de sesión: " + error.message);
  }
});

// LOGOUT
btnLogout.addEventListener("click", async () => {
  try {
    await logout();
  } catch (error) {
    alert("Error al cerrar sesión: " + error.message);
  }
});

// Cambios de estado de usuario
onUserChanged(async (user) => {
  if (user) {
    document.body.classList.add("logged-in");
    loginSection.classList.add("oculto");
    menuLateral.classList.remove("oculto");
    contenido.classList.remove("oculto");

    await cargarCultivos();
    await calcularConsumoInsumosUltimaSemana();
    await listarTareasProximas();
    await generarGraficoProductividad();
  } else {
    document.body.classList.remove("logged-in");
    loginSection.classList.remove("oculto");
    menuLateral.classList.add("oculto");
    contenido.classList.add("oculto");
  }
});

// Cambio de panel en menú
window.mostrarPanel = function (idPanel, event) {
  event.preventDefault();

  document.querySelectorAll("#menuLateral a").forEach((a) =>
    a.classList.remove("activo")
  );
  event.currentTarget.classList.add("activo");

  document.querySelectorAll("main .panel").forEach((panel) => {
    panel.classList.toggle("activo", panel.id === idPanel);
  });

  // Si se accede al panel de historial, mostrarlo
  if (idPanel === "historial") {
    mostrarHistorial();
  }
};

// REGISTRO DE CULTIVOS
formCultivo.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cultivo = {
    nombre: formCultivo.nombreCultivo.value,
    fechaSiembra: formCultivo.fechaSiembra.value,
    tipoPlanta: formCultivo.tipoPlanta.value,
    tratamientos: formCultivo.tratamientos.value,
    fechaCosecha: formCultivo.fechaCosecha.value,
  };

  try {
    await agregarCultivo(cultivo);
    await agregarRegistroHistorial({
      fecha: new Date().toISOString(),
      descripcion: `Se registró un cultivo: ${cultivo.nombre}`
    });

    alert("Cultivo registrado correctamente.");
    formCultivo.reset();
    await cargarCultivos();
  } catch (error) {
    alert("Error al registrar cultivo: " + error.message);
  }
});

// Mostrar cultivos en lista
async function cargarCultivos() {
  try {
    const cultivos = await obtenerCultivos();
    if (cultivos.length === 0) {
      listaCultivos.innerHTML = "<p>No hay cultivos registrados.</p>";
      return;
    }

    let html = "<ul>";
    cultivos.forEach((c) => {
      html += `<li><strong>${c.nombre}</strong> - Siembra: ${c.fechaSiembra} - Tipo: ${c.tipoPlanta}</li>`;
    });
    html += "</ul>";
    listaCultivos.innerHTML = html;
  } catch (error) {
    listaCultivos.innerHTML = "<p>Error al cargar cultivos.</p>";
  }
}

// 🔽 DASHBOARD: INSUMOS
async function calcularConsumoInsumosUltimaSemana() {
  const lista = document.getElementById("consumoInsumos");
  if (!lista) return;
  lista.innerHTML = "<li>Cargando...</li>";

  const insumosCol = collection(db, "insumos");
  const hoy = new Date();
  const hace7dias = new Date();
  hace7dias.setDate(hoy.getDate() - 7);

  const q = query(insumosCol, where("fecha", ">=", hace7dias.toISOString()));
  const snapshot = await getDocs(q);

  const resumen = {};
  snapshot.forEach(doc => {
    const insumo = doc.data();
    const tipo = insumo.tipo;
    resumen[tipo] = (resumen[tipo] || 0) + Number(insumo.cantidad || 0);
  });

  lista.innerHTML = Object.entries(resumen).map(([tipo, total]) =>
    `<li>${tipo}: ${total.toFixed(2)}</li>`
  ).join("") || "<li>No hay registros recientes.</li>";
}

// 🔽 DASHBOARD: TAREAS PRÓXIMAS
async function listarTareasProximas() {
  const lista = document.getElementById("tareasProximas");
  if (!lista) return;

  const planCol = collection(db, "planificaciones");
  const hoy = new Date();
  const dentroDe7 = new Date();
  dentroDe7.setDate(hoy.getDate() + 7);

  const q = query(planCol, where("fecha", ">=", hoy.toISOString()), where("fecha", "<=", dentroDe7.toISOString()));
  const snapshot = await getDocs(q);

  const tareas = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    tareas.push(`${data.fecha} - ${data.actividad}`);
  });

  lista.innerHTML = tareas.length
    ? tareas.map(t => `<li>${t}</li>`).join("")
    : "<li>No hay tareas próximas</li>";
}

// 🔽 DASHBOARD: GRÁFICO DE PRODUCTIVIDAD
let chartProductividad = null;

async function generarGraficoProductividad() {
  const canvas = document.getElementById("graficoProductividad");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const cultivosCol = collection(db, "cultivos");
  const snapshot = await getDocs(cultivosCol);

  const conteoPorSemana = {};
  snapshot.forEach(doc => {
    const cultivo = doc.data();
    if (!cultivo.fechaSiembra) return;
    const fecha = new Date(cultivo.fechaSiembra);
    const semana = `${fecha.getFullYear()}-W${Math.ceil(fecha.getDate() / 7)}`;
    conteoPorSemana[semana] = (conteoPorSemana[semana] || 0) + 1;
  });

  const etiquetas = Object.keys(conteoPorSemana).sort();
  const valores = etiquetas.map(k => conteoPorSemana[k]);

  if (chartProductividad) chartProductividad.destroy();

  chartProductividad = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas,
      datasets: [{
        label: "Cultivos por Semana",
        data: valores,
        borderColor: "#7e57c2",
        backgroundColor: "#ede7f6",
        tension: 0.2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Productividad Semanal de Cultivos'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

// 📘 HISTORIAL: Mostrar historial de actividades
async function mostrarHistorial() {
  const lista = document.getElementById("listaHistorial");
  if (!lista) return;

  try {
    const historial = await obtenerHistorial();

    if (historial.length === 0) {
      lista.innerHTML = "<li>No hay registros en el historial.</li>";
      return;
    }

    lista.innerHTML = historial.map(reg =>
      `<li><strong>${reg.fecha}</strong>: ${reg.descripcion}</li>`
    ).join("");
  } catch (error) {
    console.error("Error al cargar historial:", error);
    lista.innerHTML = "<li>Error al cargar historial.</li>";
  }
}
