// Result Page JavaScript

// Get data from sessionStorage
const requestData = JSON.parse(sessionStorage.getItem('requestData') || '{}');
const responseData = JSON.parse(sessionStorage.getItem('responseData') || '{}');

// Check if data exists
if (!requestData.companhia || !responseData.previsao) {
    // No data found, redirect to calculator
    window.location.href = 'calculator.html';
} else {
    // Display results
    displayResults();
}

function displayResults() {
    // Update status
    const statusValue = document.getElementById('statusValue');
    const resultStatus = document.getElementById('resultStatus');

    statusValue.textContent = responseData.previsao;

    if (responseData.previsao === 'Atrasado') {
        resultStatus.classList.add('delayed');
    }

    // Update probability
    const probabilityPercent = Math.round(responseData.probabilidade * 100);
    document.getElementById('probabilityValue').textContent = `${probabilityPercent}%`;
    document.getElementById('probabilityBar').style.width = `${probabilityPercent}%`;

    // Update flight information
    const companhiaNames = {
        'G3': 'Gol',
        'AD': 'Azul',
        'LA': 'LATAM',
        'AZ': 'Avianca',
        'TP': 'TAP'
    };

    document.getElementById('companhiaValue').textContent =
        `${companhiaNames[requestData.companhia] || requestData.companhia} (${requestData.companhia})`;

    document.getElementById('rotaValue').textContent =
        `${requestData.origem} → ${requestData.destino}`;

    document.getElementById('distanciaValue').textContent =
        `${requestData.distancia_km} km`;

    // Format date/time
    const dateTime = new Date(requestData.data_partida.replace('T', ' '));
    const formattedDate = dateTime.toLocaleDateString('pt-BR');
    const formattedTime = dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('dataHoraValue').textContent =
        `${formattedDate} às ${formattedTime}`;

    document.getElementById('temporadaValue').textContent = requestData.alta_temporada;

    // Display JSON data
    document.getElementById('requestData').textContent =
        JSON.stringify(requestData, null, 2);

    document.getElementById('responseData').textContent =
        JSON.stringify(responseData, null, 2);
}

// Clear session storage when leaving the page
window.addEventListener('beforeunload', function () {
    // Only clear if navigating away from result page
    if (!window.location.href.includes('result.html')) {
        sessionStorage.removeItem('requestData');
        sessionStorage.removeItem('responseData');
    }
});
