// reportes.js
import { db } from './firebase-config.js';

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Elementos del DOM
const botonExportarCSV = document.getElementById("btnExportarCSV");
const graficaCanvas = document.getElementById('graficoCultivos')?.getContext('2d');
const reporteCultivos = document.getElementById('reporteCultivos');
const filtroForm = document.getElementById('formReporteFiltro');
const botonExportarPDF = document.getElementById("btnExportarPDF");
const canvas = document.getElementById("graficoCultivos");
const mensaje = document.getElementById("mensajeSinDatos");

// Variables de datos y gráfico
let datosCultivo = {};
let chart = null;

// Obtener y agrupar cultivos por tipo desde Firestore
async function obtenerDatosCultivos() {
  datosCultivo = {};

  try {
    const cultivosCol = collection(db, "cultivos");
    const snapshot = await getDocs(cultivosCol);

    snapshot.forEach(doc => {
      const cultivo = doc.data().tipoPlanta || "Desconocido";
      datosCultivo[cultivo] = (datosCultivo[cultivo] || 0) + 1;
    });

    mostrarListaCultivos(datosCultivo);
    generarGrafico(datosCultivo);
  } catch (error) {
    console.error("Error al obtener cultivos:", error);
  }
}

// Mostrar la lista de cultivos en HTML
function mostrarListaCultivos(datos) {
  if (!reporteCultivos) return;
  reporteCultivos.innerHTML = '';
  for (const tipo in datos) {
    const li = document.createElement('li');
    li.textContent = `${tipo}: ${datos[tipo]}`;
    reporteCultivos.appendChild(li);
  }
}

// Generar el gráfico con Chart.js
function generarGrafico(datos) {
  if (!graficaCanvas) return;

  const etiquetas = Object.keys(datos);
  const valores = Object.values(datos);

  if (chart) chart.destroy();

  if (etiquetas.length === 0) {
    canvas.style.display = "none";
    mensaje.style.display = "block";
    botonExportarPDF.disabled = true;
    botonExportarCSV.disabled = true;
    return;
  }

  canvas.style.display = "block";
  mensaje.style.display = "none";
  botonExportarPDF.disabled = false;
  botonExportarCSV.disabled = false;

  chart = new Chart(graficaCanvas, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Cantidad de Cultivos por Tipo',
        data: valores,
        backgroundColor: 'rgba(94, 42, 126, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Distribución de Cultivos por Tipo'
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

// Filtro por tipo de cultivo
filtroForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const filtro = document.getElementById("filtroTipo").value.toLowerCase();
  const datosFiltrados = {};

  for (const [tipo, cantidad] of Object.entries(datosCultivo)) {
    if (tipo.toLowerCase().includes(filtro)) {
      datosFiltrados[tipo] = cantidad;
    }
  }

  mostrarListaCultivos(datosFiltrados);
  generarGrafico(datosFiltrados);
});

// Exportar gráfico como PDF
botonExportarPDF?.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  if (!canvas) return;
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("landscape");
  pdf.text("Reporte de Cultivos", 10, 10);
  pdf.addImage(imgData, "PNG", 10, 20, 260, 120);
  pdf.save("reporte_cultivos.pdf");
});

// Exportar datos como archivo CSV
botonExportarCSV?.addEventListener("click", () => {
  if (!datosCultivo || Object.keys(datosCultivo).length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const filas = [["Tipo de Cultivo", "Cantidad"]];
  for (const [tipo, cantidad] of Object.entries(datosCultivo)) {
    filas.push([tipo, cantidad]);
  }

  const contenidoCSV = filas.map(f => f.join(",")).join("\n");
  const blob = new Blob([contenidoCSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "reporte_cultivos.csv";
  enlace.click();

  URL.revokeObjectURL(url);
});

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", obtenerDatosCultivos);
