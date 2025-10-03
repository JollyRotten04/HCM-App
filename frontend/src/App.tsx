import { Routes, Route } from "react-router-dom";
import { SelectedOptionProvider } from "./contexts/SelectedOptionContext";
import Login from "./views/Login";
import MainContainer from "./views/MainContainer";

function App() {
  return (
    <SelectedOptionProvider>
        <div className="h-screen overflow-y-auto overflow-x-hidden">

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/authenticated" element={<MainContainer />} />
          {/* <Route path="/employee" element={<Employee />} /> */}
        </Routes>
      </div>
    </SelectedOptionProvider>
  );
}

export default App;
