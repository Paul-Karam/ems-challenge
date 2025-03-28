import { useLoaderData, useActionData, Form, Link, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id"); // <select /> input with name="employee_id"
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const description = formData.get("description");

  const errors: Record<string, string> = {};

  if (!employee_id) errors.employee_id = "Employee is required.";
  if (!start_time) errors.start_time = "Start time is required.";
  if (!end_time) errors.end_time = "End time is required.";


  if (start_time && end_time) {
    const startDate = new Date(start_time.toString());
    const endDate = new Date(end_time.toString());
    if (startDate >= endDate) {
      errors.time = "Start time must be before end time.";
    }
  }

  
  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, description) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time, description]
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  // Loader provides the list of employees.
  const { employees } = useLoaderData() as { employees: any[] };
  // Action data may include errors and submitted values.
  const actionData = useActionData() as {
    errors?: Record<string, string>;
    values?: Record<string, string>;
  };

  const btn = {
    backgroundColor: '#B2A5FF',
    borderColor: '#500073',
    borderRadius: '5px',
    padding: '5px 10px',
    fontFamily: 'Inter'
  }
  
  const timesheetInfo = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    letterSpacing: '1.5px'
  };
  const empInfo = {
    color: '#500073',
    textTransform: 'capitalize',
    fontFamily: 'Inter',
    textAlign: 'center'
  }
  const empTitle = {
    color: '#500073',
    textDecoration: 'none',
    textTransform: 'uppercase',
    fontFamily: 'Inter',
    textAlign: 'center',
    fontWeight: 'bold'
  }
  const formEntry = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
  const formBody = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '20%'
  }

  return (
    <div style={timesheetInfo}>
      <h1 style={empTitle}>Create New Timesheet</h1>
      <Form method="post" style={formBody}>
        <div style={formEntry}>
          <label style={empTitle} htmlFor="employee_id">Employee</label>
          <select
            style={empInfo}
            name="employee_id"
            id="employee_id"
            defaultValue={actionData?.values?.employee_id || ""}
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
          {actionData?.errors?.employee_id && (
            <p style={{ color: "red" }}>{actionData.errors.employee_id}</p>
          )}
        </div>
        <div style={formEntry}>
          <label style={empTitle} htmlFor="start_time">Start Time</label>
          <input
            style={empInfo}
            type="datetime-local"
            name="start_time"
            id="start_time"
            defaultValue={actionData?.values?.start_time || ""}
            required
          />
          {actionData?.errors?.start_time && (
            <p style={{ color: "red" }}>{actionData.errors.start_time}</p>
          )}
        </div>
        <div style={formEntry}>
          <label style={empTitle} htmlFor="end_time">End Time</label>
          <input
            style={empInfo}
            type="datetime-local"
            name="end_time"
            id="end_time"
            defaultValue={actionData?.values?.end_time || ""}
            required
          />
          {actionData?.errors?.end_time && (
            <p style={{ color: "red" }}>{actionData.errors.end_time}</p>
          )}
        </div>
        <div style={formEntry}>
          <label style={empTitle} htmlFor="description">Summary</label>
          <input
            style={empInfo}
            type="text"
            name="description"
            id="description"
            placeholder="Describe the work done"
            defaultValue={actionData?.values?.description || ""}
          />
        </div>
        {actionData?.errors?.time && (
          <p style={{ color: "red" }}>{actionData.errors.time}</p>
        )}
        <button type="submit" style={btn}>Create Timesheet</button>
      </Form>
    </div>
  );
}
