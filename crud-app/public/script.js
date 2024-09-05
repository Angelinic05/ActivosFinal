document.addEventListener('DOMContentLoaded', () => {
    fetchData('inicio'); // Por defecto, cargar la página de inicio
});

async function fetchData(page) {
    try {
        let endpoint = '';
        switch(page) {
            case 'colaboradores':
                endpoint = 'http://localhost:3001/api/colaboradores-activos';
                break;
            case 'computadores':
                endpoint = 'http://localhost:3001/api/computadores';
                break;
            case 'mouse':
                endpoint = 'http://localhost:3001/api/mouse';
                break;
            case 'teclados':
                endpoint = 'http://localhost:3001/api/teclados';
                break;
            case 'celulares':
                endpoint = 'http://localhost:3001/api/celulares';
                break;
            case 'simcar':
                endpoint = 'http://localhost:3001/api/simcar';
                break;
            default:
                endpoint = 'http://localhost:3001/api/inicio'; // Página de inicio
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            console.error(`No se pudieron obtener los datos de ${page}`);
            displayNoData(page);
            return;
        }
        displayData(page, data);
    } catch (error) {
        console.error(`Error al obtener datos de ${page}:`, error);
        displayError(page, error);
    }
}

function displayData(page, data) {
    const appDiv = document.getElementById('app');
    switch(page) {
        case 'colaboradores':
            displayColaboradoresActivos(data);
            break;
        case 'computadores':
        case 'mouse':
        case 'teclados':
        case 'celulares':
        case 'simcar':
            displayActivos(data, page);
            break;
        case 'inicio':
        default:
            appDiv.innerHTML = '<h2>Bienvenido a la Gestión de Activos</h2>';
    }
}

function displayColaboradoresActivos(colaboradores) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '<h2>Colaboradores y Activos</h2>';

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Cédula</th>
                <th>Nombre Completo</th>
                <th>Activos</th>
            </tr>
        </thead>
        <tbody>
            ${colaboradores.map(c => `
                <tr>
                    <td>${c.cedula}</td>
                    <td>${c.nombre_completo}</td>
                    <td>
                        ${c.activos.length > 0 ? 
                            `<ul>
                                ${c.activos.map(a => `
                                    <li>
                                        <strong>Tipo:</strong> ${a.tipo || 'N/A'}<br>
                                        <strong>Detalle:</strong> ${a.detalle || 'N/A'}<br>
                                        ${a.tipo === 'Computador' ? `
                                            <strong>Serial:</strong> ${a.serial || 'N/A'}<br>
                                            <strong>Marca:</strong> ${a.marca || 'N/A'}<br>
                                            <strong>Procesador:</strong> ${a.procesador || 'N/A'}<br>
                                            <strong>RAM:</strong> ${a.ram || 'N/A'}<br>
                                            <strong>S.O.:</strong> ${a.sistema_operativo || 'N/A'}
                                        ` : a.tipo === 'Mouse' ? `
                                            <strong>Serial:</strong> ${a.serial || 'N/A'}<br>
                                            <strong>Marca:</strong> ${a.marca || 'N/A'}<br>
                                            <strong>Modelo:</strong> ${a.modelo || 'N/A'}<br>
                                            <strong>Tipo:</strong> ${a.tipo || 'N/A'}
                                        ` : `
                                            <strong>Serial:</strong> ${a.serial || 'N/A'}<br>
                                            <strong>Marca:</strong> ${a.marca || 'N/A'}<br>
                                        `}
                                    </li>
                                `).join('')}
                            </ul>`
                            : 'No tiene activos asignados'}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    appDiv.appendChild(table);
}

function displayActivos(activos, tipo) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h2>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h2>`;

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Serial</th>
                <th>Marca</th>
                <th>Tipo</th>
                ${tipo === 'computadores' ? `<th>Procesador</th><th>RAM</th><th>S.O.</th>` : ''}
            </tr>
        </thead>
        <tbody>
            ${activos.map(a => `
                <tr>
                    <td>${a.serial || 'N/A'}</td>
                    <td>${a.marca || 'N/A'}</td>
                    <td>${a.tipo || 'N/A'}</td>
                    ${tipo === 'computadores' ? `
                        <td>${a.procesador || 'N/A'}</td>
                        <td>${a.ram || 'N/A'}</td>
                        <td>${a.sistema_operativo || 'N/A'}</td>
                    ` : ''}
                </tr>
            `).join('')}
        </tbody>
    `;
    appDiv.appendChild(table);
}

function displayNoData(page) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h2>No hay datos disponibles para ${page}</h2>`;
}

function displayError(page, error) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `<h2>Error al obtener los datos de ${page}</h2><p>${error.message}</p>`;
}
