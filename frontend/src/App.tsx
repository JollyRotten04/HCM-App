import { Routes, Route } from "react-router-dom";
import { SelectedOptionProvider } from "./contexts/SelectedOptionContext";
import { UserTypeProvider } from "./contexts/UserTypeContext";
import { MetricsProvider } from "./contexts/MetricsContext";
import { KPIStatsProvider } from "./contexts/KPIStatsContext";
import Login from "./views/Login";
import MainContainer from "./views/MainContainer";

function App() {
  return (
    <SelectedOptionProvider>
        <UserTypeProvider>
          <MetricsProvider>
            <KPIStatsProvider>

              <div className="h-screen overflow-y-auto overflow-x-hidden">

              {/* Route Definitions */}
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/authenticated" element={<MainContainer />} />
                {/* <Route path="/employee" element={<Employee />} /> */}
              </Routes>
            </div>
          </KPIStatsProvider>
        </MetricsProvider>
      </UserTypeProvider>
    </SelectedOptionProvider>
  );
}

export default App;
