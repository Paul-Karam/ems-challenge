import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import CalendarApp from "../CalendarComp/calendar";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData() as { timesheetsAndEmployees: any[] };
  const [isTableView, setIsTableView] = useState(true);

  const handleToggleView = () => {
    setIsTableView((prevView) => !prevView);
  };

  const timesheetsTable = {
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

  const btn = {
    backgroundColor: '#B2A5FF',
    borderColor: '#500073',
    borderRadius: '5px',
    padding: '5px 10px',
    fontFamily: 'Inter'
  }

  return (
    <div>
      <div>
        <button onClick={handleToggleView} style={btn}>
          {isTableView ? "Switch to Calendar View" : "Switch to Table View"}
        </button>
      </div>
      {/* Replace `true` by a variable that is changed when the view buttons are clicked */}
      {isTableView ? (
        // <div>
        //   {timesheetsAndEmployees.map((timesheet: any) => (
        //     <div key={timesheet.id}>
        //       <ul>
        //         <li>
        //           <Link to={`/timesheets/${timesheet.id}`}>
        //             Timesheet #{timesheet.id}
        //           </Link>
        //         </li>
        //         <ul>
        //           <li> Employee: <Link to={`/employees/${timesheet.employee_id}`}>{timesheet.full_name}</Link></li>
        //           <li>Start Time: {timesheet.start_time}</li>
        //           <li>End Time: {timesheet.end_time}</li>
        //         </ul>
        //       </ul>
        //     </div>
        //   ))}
        // </div>
        <div style={timesheetsTable}>
          <h1 style={titleStyle1}>Timesheets</h1>
          <table style={table}>
            <thead>
              <tr>
                <th style={titleStyle1}>Timesheet #</th>
                <th style={titleStyle1}>Employee</th>
                <th style={titleStyle1}>Start Time</th>
                <th style={titleStyle1}>End Time</th>
              </tr>
            </thead>
            <tbody>
              {timesheetsAndEmployees.map((timesheet: any) => (
                <tr key={timesheet.id}>
                  <td style={titleStyle2}>
                    <Link to={`/timesheets/${timesheet.id}`}>
                      Timesheet #{timesheet.id}
                    </Link>
                  </td>
                  <td style={titleStyle2}>
                    <Link to={`/employees/${timesheet.employee_id}`}>
                      {timesheet.full_name}
                    </Link>
                  </td>
                  <td style={titleStyle2}>{timesheet.start_time}</td>
                  <td style={titleStyle2}>{timesheet.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      ) : (
        <CalendarApp timesheets={timesheetsAndEmployees} />
      )}
      <hr />
      <ul>
        <Link to="/timesheets/new"><button style={btn}>New Timesheet</button></Link>
      </ul>
    </div>
  );
}
