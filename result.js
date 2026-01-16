// Get data from sessionStorage
const requestData = JSON.parse(sessionStorage.getItem('requestData') || '{}');
const responseData = JSON.parse(sessionStorage.getItem('responseData') || '{}');
const isSimulated = sessionStorage.getItem('isSimulated') === 'true';

// Check if data exists
if (!requestData.icao_empresa || !responseData.previsao) {
    // No data found, redirect to calculator
    window.location.href = 'calculator.html';
} else {
    // ==========================================
    // VALIDAÇÃO DE CONSISTÊNCIA
    // ==========================================
    // Garante que a classificação corresponda à probabilidade
    // Se probabilidade > 0.5, deve ser "Atrasado"
    // Se probabilidade <= 0.5, deve ser "Pontual"

    const probabilidade = responseData.probabilidade;
    let previsaoCorrigida = responseData.previsao;

    if (probabilidade > 0.5 && responseData.previsao === 'Pontual') {
        console.warn('⚠️ Inconsistência detectada: Status "Pontual" mas probabilidade indica "Atrasado". Corrigindo...');
        previsaoCorrigida = 'Atrasado';
    } else if (probabilidade <= 0.5 && responseData.previsao === 'Atrasado') {
        console.warn('⚠️ Inconsistência detectada: Status "Atrasado" mas probabilidade indica "Pontual". Corrigindo...');
        previsaoCorrigida = 'Pontual';
    }

    // Atualiza o responseData com a previsão corrigida
    responseData.previsao = previsaoCorrigida;

    // Display results
    displayResults();

    // Show simulation warning if applicable
    if (isSimulated) {
        showSimulationWarning();
    }
}

function displayResults() {
    // Update status
    const statusValue = document.getElementById('statusValue');
    const resultStatus = document.getElementById('resultStatus');

    statusValue.textContent = responseData.previsao;

    if (responseData.previsao === 'Atrasado') {
        resultStatus.classList.add('delayed');
    }

    // Update probability - ajusta baseado no status
    let probabilityPercent;
    let probabilityLabel;

    if (responseData.previsao === 'Pontual') {
        // Se é pontual, mostra probabilidade de pontualidade (inverso da probabilidade de atraso)
        probabilityPercent = Math.round((1 - responseData.probabilidade) * 100);
        probabilityLabel = 'Probabilidade de Pontualidade';
    } else {
        // Se é atrasado, mostra probabilidade de atraso
        probabilityPercent = Math.round(responseData.probabilidade * 100);
        probabilityLabel = 'Probabilidade de Atraso';
    }

    document.getElementById('probabilityValue').textContent = `${probabilityPercent}%`;
    document.getElementById('probabilityBar').style.width = `${probabilityPercent}%`;
    document.getElementById('probabilityLabel').textContent = probabilityLabel;

    // Update flight information (usando códigos ICAO da API)
    document.getElementById('companhiaValue').textContent = requestData.icao_empresa;
    document.getElementById('rotaValue').textContent =
        `${requestData.icao_aerodromo_origem} → ${requestData.icao_aerodromo_destino}`;
    document.getElementById('distanciaValue').textContent = `${requestData.distancia_km} km`;

    // Format date/time
    const partida = requestData.partida_prevista;
    document.getElementById('dataHoraValue').textContent = partida;

    // Remove campo temporada (não existe mais)
    const temporadaElement = document.getElementById('temporadaValue');
    if (temporadaElement) {
        temporadaElement.parentElement.style.display = 'none';
    }

    // Display JSON data
    document.getElementById('requestData').textContent = JSON.stringify(requestData, null, 2);
    document.getElementById('responseData').textContent = JSON.stringify(responseData, null, 2);
}

function showSimulationWarning() {
    // Cria aviso de modo de simulação
    const warning = document.createElement('div');
    warning.style.cssText = `
        background: rgba(255, 193, 7, 0.1);
        border: 2px solid rgba(255, 193, 7, 0.5);
        border-radius: 12px;
        padding: 16px;
        margin: 20px 0;
        text-align: center;
        color: #ffc107;
    `;
    warning.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <strong>Modo de Demonstração</strong><br>
        <small>API não disponível. Usando dados simulados para demonstração.</small>
    `;

    // Insere no topo da página de resultado
    const resultHeader = document.querySelector('.result-header');
    if (resultHeader) {
        resultHeader.parentElement.insertBefore(warning, resultHeader);
    }
}

// Clear session storage when leaving the page
window.addEventListener('beforeunload', function () {
    sessionStorage.removeItem('requestData');
    sessionStorage.removeItem('responseData');
    sessionStorage.removeItem('isSimulated');
});
