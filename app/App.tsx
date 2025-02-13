import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeesPage from "./routes/employees._index/route";
import EmployeePage from "./routes/employees.$employeeId._index/route";
import NewEmployeePage from "./routes/employees.new/route";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeesPage />}>
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/new" element={<NewEmployeePage />} />
          <Route path="employees/:employeeId" element={<EmployeePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
