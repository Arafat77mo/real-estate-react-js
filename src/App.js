import './App.css';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { store } from './app/store';
import Login from "./components/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import PropertyList from "./components/properties/PropertyList";
import Chat from "./components/chat/Chat";
import PropertyDetail from "./components/properties/PropertyDetail";
import EditProperty from "./components/properties/EditProperty";
import CreateProperty from "./components/properties/CreateProperty";

function App() {
  return (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout/>}/>
            {/* 🔹 لوحة التحكم مع المسارات المحمية */}
              <Route
                  element={
                      <PrivateRoute>
                          <DashboardLayout />
                      </PrivateRoute>
                  }
              >
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/edit-property/:id" element={<EditProperty />} />
                  <Route path="/property" element={<CreateProperty />} />
                  <Route path="/properties" element={<PropertyList />} />
                  <Route path="/chat" element={<Chat />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
  );
}

export default App;
