import React, { useEffect, useState } from 'react';
import './Lista-cap.css'; // Crie um novo arquivo de CSS para estilizar essa página

function Lista() {
    const capitals = [
        { name: 'Tokyo', country: 'Japan' },
        { name: 'Paris', country: 'France' },
        { name: 'London', country: 'UK' },
        { name: 'Canberra', country: 'Australia' },
        { name: 'Ottawa', country: 'Canada' },
        { name: 'Brasília', country: 'Brazil' },
        { name: 'Moscow', country: 'Russia' },
        { name: 'Beijing', country: 'China' },
        { name: 'Washington', country: 'USA' },
        { name: 'Berlin', country: 'Germany' },
    ];

    const [capitalsData, setCapitalsData] = useState([]);

    useEffect(() => {
        const fetchCapitalsData = async () => {
            const fetchedData = await Promise.all(capitals.map(async (capital) => {
                try {
                    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=3df87e2ebd594825b7a185537242009&q=${capital.name}&aqi=no`);
                    const data = await response.json();
                    return {
                        name: capital.name,
                        country: capital.country,
                        temperature: Math.floor(data.current.temp_c),
                        localTime: data.location.localtime,
                    };
                } catch (error) {
                    console.error(`Erro ao buscar dados para ${capital.name}:`, error);
                    return null;
                }
            }));
            setCapitalsData(fetchedData.filter(data => data !== null));
        };

        fetchCapitalsData();
    }, []);

    return (
        <div className="capitals-weather">
            <h2>Weather in World Capitals</h2>
            <div className="capitals-list">
                {capitalsData.map((capital, index) => (
                    <div key={index} className="capital-card">
                        <h3>{capital.name}, {capital.country}</h3>
                        <p>Temperature: {capital.temperature}°C</p>
                        <p>Local Time: {capital.localTime}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lista;
