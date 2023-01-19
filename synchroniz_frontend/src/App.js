import logo from './logo.svg';
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupModal from './pages/Starterpage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/start' element={<SignupModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
