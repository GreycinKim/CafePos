import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import POSPage from './pages/POSPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<POSPage />} />
            </Routes>
        </Router>
    );
}

export default App;
