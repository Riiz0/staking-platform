import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//page imports
import Home from './pages/home'
import More from './pages/more'
import Stake from './pages/stake'

function App() {
 return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/more" element={<More />} />
          <Route path="/stake" element={<Stake />} />
        </Routes>
      </div>
    </Router>
 );
}

export default App;
