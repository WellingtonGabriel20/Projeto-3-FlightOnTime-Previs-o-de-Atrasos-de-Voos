// ==========================================
// CALCULADORA DE PREVISÃO DE VOOS - PONTUAU
// ==========================================
// Este arquivo gerencia a integração com a API de Machine Learning
// para previsão de atrasos de voos.
//
// API: https://github.com/Bruno-BandeiraH/flight-prediction-model
// Endpoint: POST /predict
//
// IMPORTANTE: A API usa códigos ICAO, mas o formulário usa códigos IATA.
// Este arquivo faz a conversão automática.
// ==========================================

// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

// URL da API - Altere conforme o ambiente
const API_CONFIG = {
    // Desenvolvimento local (Docker rodando na porta 8000)
    development: 'http://localhost:8080',

    // Produção (substitua pela URL real quando deployar a API)
    production: 'https://sua-api-em-producao.com'
};

// Detecta automaticamente o ambiente
const IS_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = IS_DEVELOPMENT ? API_CONFIG.development : API_CONFIG.production;
const API_ENDPOINT = `${API_BASE_URL}/predict`;

console.log(`🚀 Ambiente: ${IS_DEVELOPMENT ? 'DESENVOLVIMENTO' : 'PRODUÇÃO'}`);
console.log(`📡 API URL: ${API_ENDPOINT}`);

// ==========================================
// MAPEAMENTOS IATA → ICAO
// ==========================================
// A API espera códigos ICAO, mas o formulário usa códigos IATA (mais conhecidos).
// Estes mapeamentos fazem a conversão automática.

/**
 * Mapeamento de códigos IATA para ICAO - Companhias Aéreas
 * IATA: Código de 2 letras usado comercialmente (ex: AD para Azul)
 * ICAO: Código de 3 letras usado pela aviação civil (ex: AZU para Azul)
 */
const AIRLINE_IATA_TO_ICAO = {
    'G3': 'GLO',   // Gol Linhas Aéreas
    'AD': 'AZU',   // Azul Linhas Aéreas
    'LA': 'TAM',   // LATAM Airlines
    'AZ': 'AZU',   // Avianca (usa mesmo código da Azul)
    'TP': 'TAP'    // TAP Air Portugal
};

/**
 * Mapeamento de códigos IATA para ICAO - Aeroportos
 * IATA: Código de 3 letras usado comercialmente (ex: GRU para Guarulhos)
 * ICAO: Código de 4 letras usado pela aviação civil (ex: SBGR para Guarulhos)
 * 
 * Padrão Brasil: SB + código específico
 */
const AIRPORT_IATA_TO_ICAO = {
    'GRU': 'SBGR',  // São Paulo - Guarulhos
    'GIG': 'SBGL',  // Rio de Janeiro - Galeão
    'BSB': 'SBBR',  // Brasília
    'CGH': 'SBSP',  // São Paulo - Congonhas
    'SDU': 'SBRJ',  // Rio de Janeiro - Santos Dumont
    'CNF': 'SBCF',  // Belo Horizonte - Confins
    'SSA': 'SBSV',  // Salvador
    'FOR': 'SBFZ',  // Fortaleza
    'REC': 'SBRF',  // Recife
    'POA': 'SBPA',  // Porto Alegre
    'CWB': 'SBCT',  // Curitiba
    'FLN': 'SBFL',  // Florianópolis
    'BEL': 'SBBE',  // Belém
    'VCP': 'SBKP',  // Campinas
    'MCP': 'SBMQ',  // Macapá
    'MCZ': 'SBMO',  // Maceió
    'NVT': 'SBNF',  // Navegantes
    'NAT': 'SBNT',  // Natal
    'VIX': 'SBVT',  // Vitória
    'MAO': 'SBEG'   // Manaus
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Calcula o tempo de voo estimado em horas baseado na distância
 * 
 * @param {number} distanciaKm - Distância em quilômetros
 * @returns {number} Tempo de voo estimado em horas (com 2 casas decimais)
 * 
 * Fórmula: tempo = distância / velocidade_média
 * Velocidade média de cruzeiro: 800 km/h
 */
function calculateFlightTime(distanciaKm) {
    const VELOCIDADE_MEDIA_CRUZEIRO = 800; // km/h
    const tempoHoras = distanciaKm / VELOCIDADE_MEDIA_CRUZEIRO;
    return parseFloat(tempoHoras.toFixed(2));
}

/**
 * Formata a data e hora para o formato esperado pela API
 * 
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {string} hora - Hora no formato HH:MM
 * @returns {string} Data/hora no formato ISO: DD-MM-YYYYTHH:MM:00
 */
function formatDateTime(data, hora) {
    // Converte YYYY-MM-DD para DD-MM-YYYY
    const [ano, mes, dia] = data.split('-');
    return `${ano}-${mes}-${dia}T${hora}:00`;
}

// ==========================================
// PROCESSAMENTO DO FORMULÁRIO
// ==========================================

document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    console.log('📝 Formulário enviado');

    // Captura dados do formulário
    const formData = new FormData(e.target);
    const date = formData.get('data_partida');
    const time = formData.get('hora_partida');
    const companhiaIATA = formData.get('companhia');
    const origemIATA = formData.get('origem');
    const destinoIATA = formData.get('destino');
    const distanciaKm = parseFloat(formData.get('distancia_km'));

    // Converte códigos IATA para ICAO
    const companhiaICAO = AIRLINE_IATA_TO_ICAO[companhiaIATA];
    const origemICAO = AIRPORT_IATA_TO_ICAO[origemIATA];
    const destinoICAO = AIRPORT_IATA_TO_ICAO[destinoIATA];

    // Valida se os códigos foram encontrados
    if (!companhiaICAO || !origemICAO || !destinoICAO) {
        console.error('❌ Erro: Código não encontrado no mapeamento');
        alert('Erro: Código de companhia ou aeroporto inválido.');
        return;
    }

    // Monta objeto de requisição para a API
    // Formato esperado pela API (ver documentação em GitHub)
    const apiRequest = {
        icao_empresa: companhiaICAO,
        icao_aerodromo_origem: origemICAO,
        icao_aerodromo_destino: destinoICAO,
        partida_prevista: formatDateTime(date, time),
        tempo_voo_estimado_hr: calculateFlightTime(distanciaKm),
        distancia_km: distanciaKm
    };

    console.log('📤 Dados enviados para API:', apiRequest);

    // Mostra estado de carregamento no botão
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processando...</span>';
    submitButton.disabled = true;

    try {
        // ==========================================
        // CHAMADA À API REAL
        // ==========================================

        console.log(`📡 Enviando requisição para: ${API_ENDPOINT}`);

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequest)
        });

        // ==========================================
        // TRATAMENTO DE ERROS DA API
        // ==========================================
        if (!response.ok) {
            // Tenta extrair mensagem de erro da API
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                // Se não conseguir parsear JSON, usa erro genérico
                errorData = {
                    field: 'generic',
                    message: `Erro HTTP ${response.status}: ${response.statusText}`
                };
            }

            console.error('❌ Erro da API:', errorData);

            // Usa o error-handler para exibir erro amigável
            const alertContainer = document.querySelector('.calculator-container');
            const form = document.getElementById('predictionForm');

            await handleApiError(response, errorData, alertContainer, form);

            // Restaura botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            return; // Para a execução aqui
        }

        // Extrai JSON da resposta
        const apiResponse = await response.json();
        console.log('📥 Resposta da API:', apiResponse);

        // ==========================================
        // TRANSFORMA RESPOSTA DA API PARA FORMATO DO FRONT-END
        // ==========================================
        // API retorna: { previsao_atraso: 0 ou 1, probabilidade_atraso: 0.0-1.0 }
        // Front-end espera: { previsao: "Pontual" ou "Atrasado", probabilidade: 0.0-1.0 }

        // Validação de consistência: garante que a classificação corresponda à probabilidade
        let previsao;
        const probabilidade = apiResponse.probabilidade_atraso;

        // Se a probabilidade de atraso é > 0.5, deve ser "Atrasado"
        // Se a probabilidade de atraso é <= 0.5, deve ser "Pontual"
        if (probabilidade > 0.5) {
            previsao = 'Atrasado';
            if (apiResponse.previsao_atraso === 0) {
                console.warn('⚠️ Inconsistência detectada: API retornou Pontual mas probabilidade indica Atrasado. Corrigindo...');
            }
        } else {
            previsao = 'Pontual';
            if (apiResponse.previsao_atraso === 1) {
                console.warn('⚠️ Inconsistência detectada: API retornou Atrasado mas probabilidade indica Pontual. Corrigindo...');
            }
        }

        const frontendResponse = {
            previsao: previsao,
            probabilidade: probabilidade
        };

        console.log('✅ Previsão:', frontendResponse.previsao);
        console.log('📊 Probabilidade:', (frontendResponse.probabilidade * 100).toFixed(0) + '%');

        // Armazena dados no sessionStorage para exibir na página de resultado
        sessionStorage.setItem('requestData', JSON.stringify(apiRequest));
        sessionStorage.setItem('responseData', JSON.stringify(frontendResponse));

        // Redireciona para página de resultado
        window.location.href = 'result.html';

    } catch (error) {
        console.error('❌ Erro ao conectar com a API:', error);
        console.warn('⚠️ Ativando modo de simulação (fallback)');

        // ==========================================
        // MODO DE SIMULAÇÃO (FALLBACK)
        // ==========================================
        // Se a API não estiver disponível, usa dados simulados
        // Isso permite que a calculadora funcione mesmo sem a API deployada

        // Exibe aviso de modo simulação
        const alertContainer = document.querySelector('.calculator-container');
        showWarningMessage(
            'API não disponível. Usando modo de demonstração com dados simulados.',
            alertContainer
        );

        // Aguarda 2 segundos para o usuário ver o aviso
        await new Promise(resolve => setTimeout(resolve, 2000));

        const simulatedResponse = {
            previsao: Math.random() > 0.5 ? 'Pontual' : 'Atrasado',
            probabilidade: parseFloat(Math.random().toFixed(2))
        };

        console.log('🎲 Usando dados simulados:', simulatedResponse);
        console.log('💡 Para usar a API real, certifique-se de que ela está rodando');

        // Armazena dados simulados
        sessionStorage.setItem('requestData', JSON.stringify(apiRequest));
        sessionStorage.setItem('responseData', JSON.stringify(simulatedResponse));
        sessionStorage.setItem('isSimulated', 'true'); // Flag para indicar simulação

        // Redireciona para página de resultado
        window.location.href = 'result.html';
    }
});

// ==========================================
// AUTO-PREENCHIMENTO DE DISTÂNCIA
// ==========================================
// Preenche automaticamente a distância quando origem e destino são selecionados

const airportDistances = {
    'GRU-GIG': 350, 'GIG-GRU': 350,
    'GRU-BSB': 870, 'BSB-GRU': 870,
    'GRU-CGH': 10, 'CGH-GRU': 10,
    'GIG-SDU': 15, 'SDU-GIG': 15,
    'GRU-CNF': 490, 'CNF-GRU': 490,
    'GRU-SSA': 1450, 'SSA-GRU': 1450,
    'GRU-FOR': 2380, 'FOR-GRU': 2380,
    'GRU-REC': 2130, 'REC-GRU': 2130,
    'GRU-POA': 850, 'POA-GRU': 850,
};

document.getElementById('origem').addEventListener('change', updateDistance);
document.getElementById('destino').addEventListener('change', updateDistance);

function updateDistance() {
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;

    if (origem && destino && origem !== destino) {
        const key = `${origem}-${destino}`;
        const distance = airportDistances[key];

        if (distance) {
            document.getElementById('distancia_km').value = distance;
            console.log(`📏 Distância auto-preenchida: ${distance} km`);
        }
    }
}

// Define data mínima como hoje
const today = new Date().toISOString().split('T')[0];
document.getElementById('data_partida').setAttribute('min', today);

console.log('✅ Calculator.js carregado com sucesso');
