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
  const employeesTable = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    letterSpacing: '1.5px',
    gap: '30px'
  };
  const titleStyle1 = {
    color: '#500073',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
    textAlign: 'center'
  }
  const titleStyle2 = {
    color: '#500073',
    textDecoration: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Inter',
    textAlign: 'center',
    padding: '15px 0'
  }
  const table = {
    width: '80%'
  }

  

  return (
    <div style={employeesTable}>
      <h1 style={titleStyle1}>Employees</h1>
      <table style={table}>
        <thead>
          <tr>
            <th style={titleStyle1}>Full Name</th>
            <th style={titleStyle1}>Job Title</th>
            <th style={titleStyle1}>Department</th>
            <th style={titleStyle1}>Salary</th>
            <th style={titleStyle1}>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: any) => (
            <tr key={employee.id}>
              <td style={titleStyle2}><Link to={`/employees/${employee.id}`}>{employee.full_name}</Link></td>
              <td style={titleStyle2}>{employee.job_title}</td>
              <td style={titleStyle2}>{employee.department}</td>
              <td style={titleStyle2}>${employee.salary}</td>
              <td style={titleStyle2}>{employee.start_date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Navigation */}
      {/* <ul>
        <li><Link to="/employees/new">New Employee</Link></li>
        <li><Link to="/timesheets/">Timesheets</Link></li>
      </ul> */}
    </div>
  )
}
