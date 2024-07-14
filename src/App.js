
import './App.css';
import CardContainer from './Components/CardContainer';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Search } from './Components/Search';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<CardContainer />}></Route>
          <Route path="/search" element={ <Search/>}></Route>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
