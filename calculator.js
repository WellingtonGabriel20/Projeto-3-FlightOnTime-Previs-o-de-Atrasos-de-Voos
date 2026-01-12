// Calculator JavaScript

document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);

    // Combine date and time
    const date = formData.get('data_partida');
    const time = formData.get('hora_partida');
    const dataPartida = `${date.split('-').reverse().join('-')}T${time}:00`;

    // Build request object
    const requestData = {
        companhia: formData.get('companhia'),
        origem: formData.get('origem'),
        destino: formData.get('destino'),
        distancia_km: parseInt(formData.get('distancia_km')),
        data_partida: dataPartida,
        alta_temporada: formData.get('alta_temporada')
    };

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processando...</span>';
    submitButton.disabled = true;

    try {
        // TODO: Replace with actual API call
        // const response = await fetch('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(requestData)
        // });
        // const result = await response.json();

        // Simulated response for demonstration
        const result = simulateAPIResponse(requestData);

        // Store data in sessionStorage
        sessionStorage.setItem('requestData', JSON.stringify(requestData));
        sessionStorage.setItem('responseData', JSON.stringify(result));

        // Redirect to result page
        window.location.href = 'result.html';

    } catch (error) {
        console.error('Erro ao calcular previsão:', error);
        alert('Erro ao processar a solicitação. Tente novamente.');

        // Restore button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

function simulateAPIResponse(data) {
    // Simulate API response based on input
    // This is just for demonstration - replace with actual API call

    const probability = Math.random(); // Random probability between 0 and 1
    const prediction = probability > 0.5 ? 'Atrasado' : 'Pontual';

    return {
        previsao: prediction,
        probabilidade: parseFloat(probability.toFixed(2))
    };
}

// Auto-calculate distance based on origin and destination (optional)
const airportDistances = {
    'GRU-GIG': 350,
    'GIG-GRU': 350,
    'GRU-BSB': 870,
    'BSB-GRU': 870,
    'GRU-CGH': 10,
    'CGH-GRU': 10,
    'GIG-SDU': 15,
    'SDU-GIG': 15,
    'GRU-CNF': 490,
    'CNF-GRU': 490,
    'GRU-SSA': 1450,
    'SSA-GRU': 1450,
    'GRU-FOR': 2380,
    'FOR-GRU': 2380,
    'GRU-REC': 2130,
    'REC-GRU': 2130,
    'GRU-POA': 850,
    'POA-GRU': 850,
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
        }
    }
}

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('data_partida').setAttribute('min', today);
