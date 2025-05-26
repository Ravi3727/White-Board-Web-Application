import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AllCanvas from "./components/Canvases/AllCanvas";
import CanvasPage from "./components/Canvases/CanvasPage";
import CanvasEditPage from "./components/Canvases/CanvasEditPage";

function App() {
  return (
    <>
      
      <BoardProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/allCanvas" element={<AllCanvas />} />
            <Route path="/canvas/:id" element={<CanvasPage />} />
            <Route path="/edit/:id" element={<CanvasEditPage />} />
            <Route path="/" element={
              <>
                <ToolboxProvider>
                  <Toolbar />
                  <Board />
                  <Toolbox />
                </ToolboxProvider>
              </>
            } />
          </Routes>
        </Router>
      </BoardProvider>
    </>
  );
}

export default App;