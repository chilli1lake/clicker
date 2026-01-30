import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="bottom-right" 
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(240 10% 8%)',
            border: '1px solid hsl(43 74% 49% / 0.2)',
            color: 'hsl(45 100% 95%)',
          },
        }}
      />
    </div>
  );
}

export default App;
