import React from 'react';
import Weather from './components/Weather';
import CapitalsList from './lista/CapitalsList';
import { Routes, RouterProvider, Route } from 'react-router-dom';
const App = () => {
  return (
    <div className="App">
      <Routes>
            <Route path="/" element={<Weather />} />
            <Route path="/lista/:nomeCapital" element={<CapitalsList/>} />
          </Routes>
    </div>
    
  );
}

export default App;