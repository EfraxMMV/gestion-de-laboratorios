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

// Función para manejar el login actualizada
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

// Función para manejar el registro actualizada
async function handleRegister() {
  const nombre = document.getElementById('registerName').value;
  const apellidos = document.getElementById('registerLastName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const codigoLab = document.getElementById('registerLabCode').value;

  if (!nombre || !apellidos || !email || !password) {
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
        codigoLab 
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
  const id = document.getElementById('idInput').value;
  const cpu = document.getElementById('cpuInput').value;
  const ram = document.getElementById('ramInput').value;
  const gpu = document.getElementById('gpuInput').value;
  const almacenamiento = document.getElementById('almacenamientoInput').value;
  const monitor = document.getElementById('monitorInput').value;
  const estado = document.getElementById('estadoInput').value;
  
  if (!id || !cpu || !ram || !gpu || !almacenamiento || !monitor || !estado) {
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
        cpu: `CPU${id.padStart(3, '0')}`,
        ram: `RAM${id.padStart(3, '0')}`,
        gpu: `GPU${id.padStart(3, '0')}`,
        almacenamiento: `ALM${id.padStart(3, '0')}`,
        monitor: `MON${id.padStart(3, '0')}`,
        estado: estado === '1' ? 1 : estado === '2' ? 2 : 3
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal('modalAgregar');
      loadEquipos();
    } else {
      alert('Error al agregar equipo');
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

  const equipoId = id.replace('EQ', '');
  
  try {
    const response = await fetch(`http://localhost:3000/api/equipos/${equipoId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal('modalEliminar');
      loadEquipos();
    } else {
      alert('Error al eliminar equipo');
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
      </div>
      <button class="btn-secondary" onclick="closeModal('reportModal')">Cerrar</button>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-content">${modalContent}</div>`;
    document.body.appendChild(modal);
    openModal('reportModal');
    
  } catch (error) {
    console.error('Error al generar reporte:', error);
    alert('Error al generar el reporte');
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