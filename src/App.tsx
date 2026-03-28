import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import Lab1 from './Pages/Lab1/Lab1';
import Lab2 from './Pages/Lab2/Lab2';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navLinks">
            <Link to="/lab1">Лабораторна робота № 1</Link>
            <Link to="/lab2">Лабораторна робота № 2</Link>
            <Link to="/lab3">Лабораторна робота № 3</Link>
            <Link to="/lab4">Лабораторна робота № 4</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Lab1 />} />
            <Route path="/lab1" element={<Lab1 />} />
            <Route path="/lab2" element={<Lab2 />} />
            {/* <Route path="/lab3" element={<Lab3 />} /> */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;