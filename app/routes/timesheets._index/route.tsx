import { useLoaderData, Link } from "react-router";
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

  return (
    <div>
      <div>
        <button>Table View</button>
        <button>Calendar View</button>
      </div>
      {/* Replace `true` by a variable that is changed when the view buttons are clicked */}
      {true ? (
        <div>
          {timesheetsAndEmployees.map((timesheet: any) => (
            <div key={timesheet.id}>
              <ul>
                <li>
                  <Link to={`/timesheets/${timesheet.id}`}>
                    Timesheet #{timesheet.id}
                  </Link>
                </li>
                <ul>
                  <li> Employee: <Link to={`/employees/${timesheet.employee_id}`}>{timesheet.full_name}</Link> (ID: {timesheet.employee_id})</li>
                  <li>Start Time: {timesheet.start_time}</li>
                  <li>End Time: {timesheet.end_time}</li>
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>
            To implement, see <a href="https://schedule-x.dev/docs/frameworks/react">Schedule X React documentation</a>.
          </p>
        </div>
      )}
      <hr />
      <ul>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
