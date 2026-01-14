
# PontUau

PontUau is a flight punctuality prediction system that uses machine learning and statistical analysis to predict whether a flight will be delayed or not.

## Main goals
- Predict flight delays in advance 
- Identify ponctuality patterns by airline
- Analyse historical statistics of specifics routes
- Provide insights for operational improvement

## Endpoints
![endpoints](./flight-prediction-api/src/main/resources/static/img/endpoints.jpeg)

## Functionalities
- Predict - Tells if a flight is gonna be on time or delayed.
- Statistics - Show how many predictions were made, and how much were delayed or on time.
- Airlines - Show the Airline with most prediction flights on time or delayed, by year or from all time.
- Routes - Bring the route with most delayed or on time predictions. 

### Requirements for running
- Docker 29.1.2 or +.
### Requirements for developing
- Java 21 or +;
- Python 3.12.10 or +;
- Maven;

## How to use:
- Open the terminal on the root of the project
- Enter the command: ```docker-compose up --build```
- Open your browser and type ```http://localhost:8080/swagger-ui.html```

## Project Structure
```
PontUau/
├── flight-prediction-api/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── com/
│   │   │   │       ├── flightontime/
│   │   │   │           ├── api/
│   │   │   │               ├── config/
│   │   │   │               │   ├── CorsConfig.java
│   │   │   │               │   └── WebClientConfig.java
│   │   │   │               ├── controller/
│   │   │   │               │   ├── FlightController.java
│   │   │   │               │   └── PredictionController.java
│   │   │   │               ├── domain/
│   │   │   │               │   ├── Flight.java
│   │   │   │               │   └── FlightRepository.java
│   │   │   │               ├── dto/
│   │   │   │               │   ├── AirlineDelayedData.java
│   │   │   │               │   ├── AirlineOnTimeData.java
│   │   │   │               │   ├── FlightDTO.java
│   │   │   │               │   ├── PredictionRequestDTO.java
│   │   │   │               │   ├── PredictionResponseDTO.java
│   │   │   │               │   ├── RouteDelayedData.java
│   │   │   │               │   ├── RouteOnTimeData.java
│   │   │   │               │   ├── StatisticsByYearData.java
│   │   │   │               │   └── StatisticsData.java
│   │   │   │               ├── infra/
│   │   │   │               │   ├── exception/
│   │   │   │               │   │   ├── ResourceNotFoundException.java
│   │   │   │               │   │   └── RestExceptionHandler.java
│   │   │   │               │   ├── validations/
│   │   │   │               │   │   ├── time/
│   │   │   │               │   │   │   └── ExpectedTime.java
│   │   │   │               │   │   └── RepositoryValidator.java
│   │   │   │               │   └── ValidatorException.java
│   │   │   │               ├── service/
│   │   │   │               │   ├── FlightService.java
│   │   │   │               │   └── PredictionService.java
│   │   │   │               └── FlightPredictionApiApplication.java
│   │   │   ├── resources/
│   │   │       ├── static/
│   │   │       │   ├── img/
│   │   │       │       └── endpoints.jpeg
│   │   │       ├── templates/
│   │   │       └── application.properties
│   │   ├── test/
│   │       ├── java/
│   │           ├── com/
│   │               ├── flightontime/
│   │                   ├── api/
│   │                       ├── controller/
│   │                       │   └── PredictionControllerTest.java
│   │                       ├── domain/
│   │                       │   └── FlightTest.java
│   │                       ├── infra/
│   │                       │   ├── validations/
│   │                       │       ├── time/
│   │                       │           └── ExpectedTimeTest.java
│   │                       ├── service/
│   │                       │   └── PredictionServiceTest.java
│   │                       └── FlightPredictionApiApplicationTests.java
│   ├── Dockerfile
│   ├── README.md
│   └── pom.xml
├── flight-prediction-model/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── config/
│   │   │   ├── __init__.py
│   │   │   └── settings.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── feature_engineering.py
│   │   │   └── prediction_service.py
│   │   ├── __init__.py
│   │   └── main.py
│   ├── model/
│   │   └── modelo_previsao_atraso_voos_v2.pkl
│   ├── Dockerfile
│   ├── README.md
│   └── requirements.txt
├── README.md
└── docker-compose.yml
```

## Development Team

<div align="center">

  <a href="https://github.com/seu-usuario">
    <img src="https://github.com/Bruno-BandeiraH.png" width="150px;" alt="Foto do Seu Nome"/><br>
    <b>Bruno Bandeira</b>
  </a>

  <a href="https://github.com/colega1">
    <img src="https://github.com/Rafael-LynX.png" width="150px;" alt="Foto do Colega"/><br>
    <b>Rafael Vieira</b>
  </a>

</div>

## Technologies
- Backend: Spring Boot 4, fastAPI
- Language: Java 21
- Database: MySQL 8+
- Documentation: SpringDoc
- Tests: JUnit 5, Mockito
- Versioning: Git, GitHub
- Build: Maven
