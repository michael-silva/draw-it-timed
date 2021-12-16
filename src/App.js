import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import { Terms } from './pages/Terms'
import { Main } from './pages/Main'

const isDevelop = process.env.NODE_ENV === 'development'

function App() {
  return (
    <BrowserRouter basename={isDevelop ? '/' : process.env.PUBLIC_URL}>
    <div className="App">
      <header className="App-header">
        <div className="App-title">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Draw it Timed!</h1>
        </div>
        <nav className="App-navbar">
          <ul>
            <li>
              <Link to="/" className="App-link">Main</Link>
            </li>
            <li>
              <Link to="/terms" className="App-link">Terms</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
      <Routes>
          <Route path="/terms" element={<Terms />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
