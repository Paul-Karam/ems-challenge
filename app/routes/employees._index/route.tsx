import { useLoaderData } from "react-router"
import { Link } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")

  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
  return (
    <div>
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Start Date</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: any) => (
            <tr key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.job_title}</td>
              <td>{employee.department}</td>
              <td>${employee.salary}</td>
              <td>{employee.start_date}</td>
              <td>
                <Link to={`/employees/${employee.id}`}>View Profile</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Navigation */}
      <ul>
        <li><Link to="/employees/new">New Employee</Link></li>
        <li><Link to="/timesheets/">Timesheets</Link></li>
      </ul>
    </div>
  )
}
