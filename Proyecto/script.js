function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Funciones para los botones
function agregarEquipo() {
  openModal('modalAgregar');
}

function eliminarEquipo() {
  openModal('modalEliminar');
}

// Función para redirigir al inventario
function goToInventory(labId) {
  window.location.href = `inventario.html?labId=${labId}`;
}

// Función para manejar el login
async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    alert('Por favor ingresa correo y contraseña');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.laboratorio) {
        goToInventory(data.user.laboratorio.Id_Lab);
      } else {
        alert('No tienes un laboratorio asignado');
      }
    } else {
      alert(data.message || 'Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
}

// Función para manejar el registro
async function handleRegister() {
  const nombre = document.getElementById('registerName').value;
  const apellidos = document.getElementById('registerLastName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const nombreLab = document.getElementById('registerLabName').value;
  const codigoLab = document.getElementById('registerLabCode').value;

  if (!nombre || !apellidos || !email || !password || !nombreLab) {
    alert('Por favor completa los campos obligatorios');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        nombre, 
        apellidos, 
        email, 
        password, 
        nombreLab,
        codigoLab: codigoLab || null
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Registro exitoso! Por favor inicie sesión');
      closeModal('registerModal');
    } else {
      alert(data.message || 'Error al registrar');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
}

// Función para cargar equipos del laboratorio
async function loadEquipos() {
  const urlParams = new URLSearchParams(window.location.search);
  const labId = urlParams.get('labId');
  
  if (!labId) {
    console.error('No se proporcionó labId');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/equipos/${labId}`);
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    
    const equipos = await response.json();
    
    const tbody = document.getElementById('equiposBody');
    tbody.innerHTML = '';
    
    equipos.forEach(equipo => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>EQ${equipo.Id_Equipo.toString().padStart(3, '0')}</td>
        <td>${equipo.CPU}</td>
        <td>${equipo.RAM}</td>
        <td>${equipo.GPU}</td>
        <td>${equipo.Almacenamiento}</td>
        <td>${equipo.Monitor}</td>
        <td>${equipo.Estado}</td>
        <td>
          <button class="btn-edit" onclick="editarEquipo('EQ${equipo.Id_Equipo.toString().padStart(3, '0')}')">✏️ Editar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar equipos:', error);
    alert('Error al cargar los equipos');
  }
}

// Función para confirmar agregar equipo
async function confirmarAgregar() {
  const cpu = document.getElementById('cpuInput').value;
  const ram = document.getElementById('ramInput').value;
  const gpu = document.getElementById('gpuInput').value;
  const almacenamiento = document.getElementById('almacenamientoInput').value;
  const monitor = document.getElementById('monitorInput').value;
  const estado = document.getElementById('estadoInput').value;
  
  if (!cpu || !ram || !gpu || !almacenamiento || !monitor || !estado) {
    alert('Por favor completa todos los campos');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const labId = urlParams.get('labId');
  
  if (!labId) {
    alert('No se pudo identificar el laboratorio');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/equipos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        labId,
        cpu,
        ram,
        gpu,
        almacenamiento,
        monitor,
        estado: estado === '1' ? 1 : estado === '2' ? 2 : 3
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal('modalAgregar');
      alert('Equipo agregado con éxito');
      loadEquipos();
      
      // Limpiar formulario
      document.getElementById('cpuInput').value = '';
      document.getElementById('ramInput').value = '';
      document.getElementById('gpuInput').value = '';
      document.getElementById('almacenamientoInput').value = '';
      document.getElementById('monitorInput').value = '';
      document.getElementById('estadoInput').value = '1';
    } else {
      alert('Error al agregar equipo: ' + (data.message || ''));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
}

// Función para confirmar eliminar equipo
async function confirmarEliminar() {
  const id = document.getElementById('eliminarIdInput').value;
  
  if (!id) {
    alert('Por favor ingresa el ID del equipo');
    return;
  }

  if (!confirm(`¿Estás seguro de eliminar el equipo con ID ${id}?`)) {
    return;
  }

  const equipoId = id.replace('EQ', '');
  
  try {
    const response = await fetch(`http://localhost:3000/api/equipos/${equipoId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal('modalEliminar');
      alert(`Se ha eliminado con éxito el equipo con ID ${id}`);
      loadEquipos();
    } else {
      alert('Error al eliminar equipo: ' + (data.message || ''));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
}

// Función para editar equipo
function editarEquipo(id) {
  const equipoId = id.replace('EQ', '');
  
  // Buscar el equipo en la tabla para prellenar el formulario
  const rows = document.querySelectorAll('#equiposBody tr');
  let equipoData = null;
  
  rows.forEach(row => {
    if (row.cells[0].textContent === id) {
      equipoData = {
        cpu: row.cells[1].textContent,
        ram: row.cells[2].textContent,
        gpu: row.cells[3].textContent,
        almacenamiento: row.cells[4].textContent,
        monitor: row.cells[5].textContent,
        estado: row.cells[6].textContent.includes('Buen') ? '1' : 
                row.cells[6].textContent.includes('Mal') ? '2' : '3'
      };
    }
  });
  
  if (!equipoData) {
    alert('No se encontró el equipo');
    return;
  }
  
  document.getElementById('editEquipoId').textContent = id;
  document.getElementById('editCpuInput').value = equipoData.cpu;
  document.getElementById('editRamInput').value = equipoData.ram;
  document.getElementById('editGpuInput').value = equipoData.gpu;
  document.getElementById('editAlmacenamientoInput').value = equipoData.almacenamiento;
  document.getElementById('editMonitorInput').value = equipoData.monitor;
  document.getElementById('editEstadoInput').value = equipoData.estado;
  
  openModal('modalEditar');
}

// Función para confirmar edición
async function confirmarEditar() {
  const equipoId = document.getElementById('editEquipoId').textContent.replace('EQ', '');
  const cpu = document.getElementById('editCpuInput').value;
  const ram = document.getElementById('editRamInput').value;
  const gpu = document.getElementById('editGpuInput').value;
  const almacenamiento = document.getElementById('editAlmacenamientoInput').value;
  const monitor = document.getElementById('editMonitorInput').value;
  const estado = document.getElementById('editEstadoInput').value;
  
  if (!cpu || !ram || !gpu || !almacenamiento || !monitor || !estado) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Validar que el monitor sea un número
  if (isNaN(parseFloat(monitor))) {
    alert('Por favor ingresa un tamaño de monitor válido (ej: 24.0)');
    return;
  }

  // Validar que el almacenamiento tenga formato correcto
  const partesAlmacenamiento = almacenamiento.split(' ');
  if (partesAlmacenamiento.length !== 2 || isNaN(parseInt(partesAlmacenamiento[1]))) {
    alert('Por favor ingresa el almacenamiento en formato "Tipo Capacidad" (ej: SSD 500)');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/equipos/${equipoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cpu,
        ram,
        gpu,
        almacenamiento,
        monitor,
        estado: estado === '1' ? 1 : estado === '2' ? 2 : 3
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal('modalEditar');
      alert('Equipo actualizado con éxito');
      loadEquipos();
    } else {
      alert('Error al actualizar equipo: ' + (data.message || ''));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
}

// Función para generar reporte
async function generateReport() {
  const urlParams = new URLSearchParams(window.location.search);
  const labId = urlParams.get('labId');
  
  if (!labId) {
    alert('No se pudo identificar el laboratorio');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/reporte/${labId}`);
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    
    const reporte = await response.json();
    
    const modalContent = `
      <h3>Reporte del Laboratorio</h3>
      <div class="report-container">
        <div class="report-summary">
          <h4>Estado General del Laboratorio</h4>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${reporte.porcentajeBuenEstado}%"></div>
          </div>
          <p>${reporte.porcentajeBuenEstado}% de equipos en buen estado</p>
        </div>
        <div class="report-details">
          <p><strong>Total de equipos:</strong> ${reporte.totalEquipos}</p>
          <p><strong>En buen estado:</strong> ${reporte.buenEstado}</p>
          <p><strong>En mal estado:</strong> ${reporte.malEstado}</p>
          <p><strong>En mantenimiento:</strong> ${reporte.enMantenimiento}</p>
        </div>
        <div id="detallesProblemas" style="display: none; margin-top: 20px;">
          <h4>Equipos con problemas</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${reporte.equiposProblema.map(eq => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${eq.Id_Equipo}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${eq.Estado}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <button class="btn-primary" id="btnDetalles">Más detalles</button>
        <button class="btn-primary" onclick="descargarReporte(${labId})">Descargar PDF</button>
        <button class="btn-secondary" onclick="closeModal('reportModal')">Cerrar</button>
      </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-content">${modalContent}</div>`;
    document.body.appendChild(modal);
    openModal('reportModal');
    
    // Configurar botón de detalles
    document.getElementById('btnDetalles').addEventListener('click', function() {
      const detalles = document.getElementById('detallesProblemas');
      if (detalles.style.display === 'none') {
        detalles.style.display = 'block';
        this.textContent = 'Menos detalles';
      } else {
        detalles.style.display = 'none';
        this.textContent = 'Más detalles';
      }
    });
    
  } catch (error) {
    console.error('Error al generar reporte:', error);
    alert('Error al generar el reporte');
  }
}

// Función para descargar reporte en PDF
async function descargarReporte(labId) {
  try {
    // Mostrar indicador de carga
    const loadingIndicator = document.createElement('div');
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.5)';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.zIndex = '1000';
    
    const spinner = document.createElement('div');
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.animation = 'spin 1s linear infinite';
    
    loadingIndicator.appendChild(spinner);
    document.body.appendChild(loadingIndicator);

    // Agregar animación CSS si no existe
    if (!document.getElementById('spin-animation')) {
      const style = document.createElement('style');
      style.id = 'spin-animation';
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Obtener datos del reporte
    const reportResponse = await fetch(`http://localhost:3000/api/reporte/${labId}`);
    if (!reportResponse.ok) throw new Error('Error al obtener datos del reporte');
    
    const reporteData = await reportResponse.json();

    // Generar PDF
    const pdfResponse = await fetch('http://localhost:3000/api/reporte-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reporteData }),
    });

    if (!pdfResponse.ok) {
      throw new Error('Error al generar el PDF');
    }

    // Crear blob y descargar
    const blob = await pdfResponse.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `reporte_laboratorio_${labId}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    window.URL.revokeObjectURL(blobUrl);
    a.remove();
    loadingIndicator.remove();

  } catch (error) {
    console.error('Error al descargar reporte:', error);
    alert('Error al generar el reporte PDF: ' + error.message);
    
    // Asegurarse de quitar el indicador de carga en caso de error
    const loadingIndicator = document.querySelector('div[style*="rgba(0,0,0,0.5)"]');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }
}

// Al cargar la página de inventario
if (window.location.pathname.includes('inventario.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const labId = urlParams.get('labId');
    
    if (labId) {
      document.getElementById('labCode').textContent = `LAB${labId.padStart(3, '0')}`;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('userName').textContent = user.Nombre_Encargado;
      if (user.laboratorio) {
        document.getElementById('labName').textContent = user.laboratorio.Nombre_Lab;
      }
    }
    
    document.querySelector('#modalAgregar .btn-primary').onclick = confirmarAgregar;
    document.querySelector('#modalEliminar .btn-primary').onclick = confirmarEliminar;
    
    loadEquipos();
  });
}

// Para la página de inicio
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('#loginModal .btn-primary');
  if (loginBtn) {
    loginBtn.onclick = handleLogin;
  }
  
  const registerBtn = document.querySelector('#registerModal .btn-primary');
  if (registerBtn) {
    registerBtn.onclick = handleRegister;
  }
});