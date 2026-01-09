import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DocumentProvider } from "./context/DocumentContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <DocumentProvider>
            <AppRoutes />
          </DocumentProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
