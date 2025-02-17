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
import OwnerDashboard from "./components/dashboard/OwnerDashboard";
import ReportDashboard from "./components/report/ReportDashboard";
import BuyersReport from "./components/report/BuyersReport";
import RentersReport from "./components/report/RentersReport";
import InstallmentsReport from "./components/report/InstallmentsReport";
import RenterDetails from "./components/report/RenterDetails";
import InstallmentDetails from "./components/report/InstallmentDetails";

function App() {
  return (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<Login />} />
            {/* 🔹 لوحة التحكم مع المسارات المحمية */}
              <Route
                  element={
                      <PrivateRoute>
                          <DashboardLayout />
                      </PrivateRoute>
                  }
              >
                  <Route path="/" element={<OwnerDashboard/>}/>

                  <Route path="/reports" element={<ReportDashboard />} />
                  <Route path="/buyers" element={<BuyersReport />} />
                  <Route path="/renters" element={<RentersReport />} />
                  <Route path="/installments" element={<InstallmentsReport />} />
                  <Route path="/renter/:userId/:propertyId" element={<RenterDetails />} />
                  <Route path="/installment/:userId/:propertyId" element={<InstallmentDetails />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/edit-property/:id" element={<EditProperty />} />
                  <Route path="/create-property" element={<CreateProperty />} />
                  <Route path="/properties" element={<PropertyList />} />
                  <Route path="/chat" element={<Chat />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
  );
}

export default App;
