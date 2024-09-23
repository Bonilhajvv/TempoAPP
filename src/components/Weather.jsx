import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import humidityIcon from '../assets/humidity.png';
import maxIcon from '../assets/max.svg';
import minIcon from '../assets/min.svg';
import precipitacao from '../assets/precipitacao.svg';
import sunrise from '../assets/sunrise.svg';
import sunset from '../assets/sunset.svg';
import uv from '../assets/uv.svg';
import lista from '../assets/lista.svg';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import windIcon from '../assets/wind.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

function Weather() {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState('PR'); // Valor inicial para Paraná
    const [selectedCity, setSelectedCity] = useState('Curitiba'); // Valor inicial para Curitiba
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);

    const allIcons = {
        'clear': clear,
        'cloudy': cloud,
        'partly cloudy': cloud,
        'overcast': cloud,
        'drizzle': drizzle,
        'rain': rain,
        'snow': snow,
    };

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
                const data = await response.json();
                setStates(data.sort((a, b) => a.nome.localeCompare(b.nome)));
            } catch (error) {
                console.error('Erro ao buscar estados:', error);
            }
        };

        fetchStates();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (selectedState) {
                try {
                    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`);
                    const data = await response.json();
                    setCities(data.sort((a, b) => a.nome.localeCompare(b.nome)));
                } catch (error) {
                    console.error('Erro ao buscar cidades:', error);
                }
            }
        };

        fetchCities();
    }, [selectedState]);

    useEffect(() => {
        search();
    }, []);

    const classifyWind = (windSpeed) => {
        if (windSpeed < 1) {
            return "Calmo: O vento não é perceptível.";
        } else if (windSpeed >= 1 && windSpeed < 6) {
            return "Ar leve: Pode-se ver a fumaça e as folhas se movendo.";
        } else if (windSpeed >= 6 && windSpeed < 12) {
            return "Brisa leve: As folhas e ramos pequenos se movem.";
        } else if (windSpeed >= 12 && windSpeed < 20) {
            return "Brisa fraca: Pequenos galhos se movem, e o vento é audível.";
        } else if (windSpeed >= 20 && windSpeed < 29) {
            return "Brisa moderada: Movem-se os galhos das árvores, poeira e pequenos papéis levantados.";
        } else if (windSpeed >= 29 && windSpeed < 39) {
            return "Brisa forte: Movimentação de grandes galhos e árvores pequenas.";
        } else if (windSpeed >= 39 && windSpeed < 50) {
            return "Vento fresco: Movem-se os ramos das árvores, dificuldade em manter um guarda chuva aberto e assobio em fios de postes.";
        } else if (windSpeed >= 50 && windSpeed < 62) {
            return "Vento forte: Movem-se as árvores grandes e a uma dificuldade em andar contra o vento.";
        } else if (windSpeed >= 62 && windSpeed < 75) {
            return "Ventania: Quebram-se galhos de árvores.";
        } else if (windSpeed >= 75 && windSpeed < 89) {
            return "Ventania forte: Ligeiro dano estrutural,quase impossível andar contra o vento, danos em árvores e pequenas construções.";
        } else if (windSpeed >= 89 && windSpeed < 103) {
            return "Tempestade: Árvores arrancadas e danos estruturais consideráveis.";
        } else if (windSpeed >= 103 && windSpeed < 118) {
            return "Tempestade violenta: Estragos generalizados em construções.";
        } else if (windSpeed >= 118) {
            return "Furacão: Estragos generalizados em construções.";
        } else {
            return "Velocidade do vento inválida.";
        }
    };

    const search = async () => {
        if (!selectedCity) {
            alert("Selecione uma cidade");
            return;
        }
        try {
            const url = `http://api.weatherapi.com/v1/current.json?key=3df87e2ebd594825b7a185537242009&q=${selectedCity}&aqi=no`;
            const url2 = `http://api.weatherapi.com/v1/forecast.json?key=3df87e2ebd594825b7a185537242009&q=${selectedCity}&days=7&aqi=no&alerts=no`;  // Alterado para 7 dias
            const url3 = `http://api.weatherapi.com/v1/astronomy.json?key=3df87e2ebd594825b7a185537242009&q=${selectedCity}&dt=2024-09-20`;
            // const url4 = ``;

            const response = await fetch(url);
            const response2 = await fetch(url2);
            const response3 = await fetch(url3);
            // const response4 = await fetch(url4);

            const data = await response.json();
            const data2 = await response2.json();
            const data3 = await response3.json();
            // const data4 = await response4.json();

            console.log(data);
            console.log(data2);
            console.log(data3);
            // console.log(data4);

            if (!response.ok) {
                alert("Cidade não encontrada");
                return;
            }

            const condition = data.current.condition.text.toLowerCase();
            let icon = clear;
            for (let key in allIcons) {
                if (condition.includes(key)) {
                    icon = allIcons[key];
                    break;
                }
            }

            setWeatherData({
                humidity: data.current.humidity,
                wind: data.current.wind_kph,
                temperature: Math.floor(data.current.temp_c),
                location: {
                    name: data.location.name,
                    lat: data.location.lat,
                    lon: data.location.lon,
                },
                maxtemp_c: Math.floor(data2.forecast.forecastday[0].day.maxtemp_c),
                mintemp_c: Math.floor(data2.forecast.forecastday[0].day.mintemp_c),
                totalprecip_mm: data2.forecast.forecastday[0].day.totalprecip_mm,
                uv: data.current.uv,
                sunrise: data3.astronomy.astro.sunrise,
                sunset: data3.astronomy.astro.sunset,
                icon: icon,
                forecast: data2.forecast.forecastday,
            });

            const hourly = data2.forecast.forecastday[0].hour.map(hour => ({
                time: `${new Date(hour.time).getHours()}:00`,
                temperature: hour.temp_c,
            }));
            setHourlyData(hourly);

            const windAlert = classifyWind(data.current.wind_kph);
            alert(windAlert);
        } catch (error) {
            setWeatherData(false);
        }
    };

    return (
        <div className="teste">
            <div className="weather">
                <div className="search-bar">
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                    >
                        <option value="">Selecione um estado</option>
                        {states.map(state => (
                            <option key={state.id} value={state.sigla}>{state.nome}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedState}
                    >
                        <option value="">Selecione uma cidade</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.nome}>{city.nome}</option>
                        ))}
                    </select>

                    <img
                        src={search_icon}
                        alt="Ícone de busca"
                        onClick={search}
                    />
                    <Link to="/lista/CapitalsList">
                        <img
                            href="/"
                            src={lista}
                            alt="Ícone de lista - link para navegação"
                        />

                    </Link>
                </div>
                {weatherData ? (
                    <>
                        <img src={weatherData.icon} alt="Clima" className="weather-icon" />
                        <p className="temperature">{weatherData.temperature}°C</p>
                        <p className="location">{weatherData.location.name}</p>

                        <div className="weather-data">
                            <div className="col">
                                <img src={maxIcon} alt="Ícone de máxima" width={60} height={60} />
                                <div>
                                    <p>{weatherData.maxtemp_c}°C</p>
                                    <span>Máxima</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={minIcon} alt="Ícone de mínima" width={60} height={60} />
                                <div>
                                    <p>{weatherData.mintemp_c}°C</p>
                                    <span>Mínima</span>
                                </div>
                            </div>
                        </div>

                        <div className="weather-data">
                            <div className="col">
                                <img src={humidityIcon} alt="Ícone de umidade" />
                                <div>
                                    <p>{weatherData.humidity} %</p>
                                    <span>Umidade</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={windIcon} alt="Ícone de vento" />
                                <div>
                                    <p>{weatherData.wind} Km/H</p>
                                    <span>Velocidade</span>
                                </div>
                            </div>
                        </div>

                        <div className="weather-data">
                            <div className="col">
                                <img src={precipitacao} width={60} height={60} />
                                <div>
                                    <p>{weatherData.totalprecip_mm} mm</p>
                                    <span>Precipitação</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={uv} width={60} height={60} />
                                <div>
                                    <p>{weatherData.uv}</p>
                                    <span>Índice UV</span>
                                </div>
                            </div>
                        </div>

                        <div className="weather-data">
                            <div className="col">
                                <img src={sunrise} width={60} height={60} />
                                <div>
                                    <p>{weatherData.sunrise}</p>
                                    <span>Nascer do sol</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={sunset} width={60} height={60} />
                                <div>
                                    <p>{weatherData.sunset}</p>
                                    <span>Por do sol</span>
                                </div>
                            </div>
                        </div>



                        <div className="container-mapa">
                            <iframe
                                title="Map"
                                width="100%"
                                height="100%"
                                src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyB_Y2QDEcZEF7gYS8xLPYN_6DI9znIe_i0&center=${weatherData.location.lat},${weatherData.location.lon}&zoom=10`}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>



                        <div className="temperature-chart">
                            <h2>Temperatura durante o dia</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" stroke="#ffffff" />
                                    <YAxis stroke="#ffffff" />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} itemStyle={{ color: '#ffffff' }} />
                                    <Legend wrapperStyle={{ color: '#ffffff' }} />
                                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>



                        <div className="forecast">
                            <h2>Previsão dos Próximos Dias</h2>
                            <div className="forecast-container">
                                {weatherData.forecast.map((day, index) => {
                                    const conditionText = day.day.condition.text.toLowerCase();
                                    let icon = clear;

                                    for (let key in allIcons) {
                                        if (conditionText.includes(key)) {
                                            icon = allIcons[key];
                                            break;
                                        }
                                    }

                                    return (
                                        <div key={index} className="forecast-day">
                                            <p>{new Date(day.date).toLocaleDateString()}</p>
                                            <img src={icon} alt={day.day.condition.text} width={50} height={50} />
                                            <p><strong>Máx:</strong> {Math.floor(day.day.maxtemp_c)}°C</p>
                                            <p><strong>Mín:</strong> {Math.floor(day.day.mintemp_c)}°C</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default Weather;
