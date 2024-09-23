import React, { useEffect, useState } from 'react';
import './CapitalsList.css';
import { Link } from 'react-router-dom';
import casa from '../assets/casa.svg';

const capitals = [
    { name: 'Brasília', country: 'Brasil' },
    { name: 'Lisboa', country: 'Portugal' },
    { name: 'Tóquio', country: 'Japão' },
    { name: 'Canberra', country: 'Austrália' },
    { name: 'Ottawa', country: 'Canadá' },
    { name: 'Washington D.C.', country: 'Estados Unidos' },
    { name: 'Berlim', country: 'Alemanha' },
    { name: 'Paris', country: 'França' },
    { name: 'Madri', country: 'Espanha' },
    { name: 'Roma', country: 'Itália' }
];

const CapitalsList = () => {
    const [capitalsData, setCapitalsData] = useState([]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const data = await Promise.all(
                capitals.map(async (capital) => {
                    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=3df87e2ebd594825b7a185537242009&q=${capital.name}&aqi=no`);
                    const weatherData = await response.json();

                    if (!response.ok) {
                        console.error(`Erro ao buscar dados para ${capital.name}`);
                        return null;
                    }

                    return {
                        name: capital.name,
                        country: capital.country,
                        temperature: Math.floor(weatherData.current.temp_c),
                        time: weatherData.location.localtime
                    };
                })
            );
            setCapitalsData(data.filter(item => item)); // Remove itens nulos
        };

        fetchWeatherData();
    }, []);

    return (
        <div className="teste">
            <div className="weather">
                <div className="capitals-list">
                    <div className="container">
                        <h1>Capitais</h1>
                        <div className="icon-circle">
                            <Link to="/">
                                <img src={casa} alt="Ícone de casa" />
                            </Link>
                        </div>
                    </div>
                    <div className="cards-container">
                        {capitalsData.map((capital, index) => (
                            <div key={index} className="capital-card">
                                <h2>{capital.name}</h2>
                                <p>País: {capital.country}</p>
                                <p>Temperatura: {capital.temperature}°C</p>
                                <p>Horário: {new Date(capital.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CapitalsList;
