// routes/timesheets.$timesheetId._index/route.tsx
import { useState, useEffect } from "react";
import {
  Form,
  useLoaderData,
  useActionData,
  redirect
} from "react-router-dom";
import { getDB } from "~/db/getDB";

// Loader: Fetch the timesheet and join with the employee's full name.
export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  );
  if (!timesheet) {
    throw new Response("Timesheet Not Found", { status: 404 });
  }
  return { timesheet };
}

// Action: Update the timesheet (validating that start_time is before end_time)
export async function action({ request, params }: { request: Request; params: { timesheetId: string } }) {
  const formData = await request.formData();
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const description = formData.get("description") as string;

  // Validate required fields
  const errors: Record<string, string> = {};
  if (!start_time) errors.start_time = "Start time is required.";
  if (!end_time) errors.end_time = "End time is required.";

  if (start_time && end_time) {
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    if (startDate >= endDate) {
      errors.time = "Start time must be before end time.";
    }
  }

  // if (Object.keys(errors).length > 0) {
  //   return json({ errors, values: Object.fromEntries(formData) }, { status: 400 });
  // }

  // Format the datetime-local values for SQLite (replace "T" with a space)
  const formattedStartTime = start_time.replace("T", " ");
  const formattedEndTime = end_time.replace("T", " ");

  const db = await getDB();
  try {
    await db.run(
      `UPDATE timesheets 
       SET start_time = ?, end_time = ?, description = ? 
       WHERE id = ?`,
      [formattedStartTime, formattedEndTime, description, params.timesheetId]
    );
  } catch (error) {
    console.error("DB Update Error:", error);
  }

  return redirect(`/timesheets`);
}

// Component: View and edit a single timesheet.
export default function TimesheetPage() {
  const { timesheet } = useLoaderData() as { timesheet: any };
  const actionData = useActionData() as {
    errors?: Record<string, string>;
    values?: Record<string, string>;
  } | null; 

  const [isEditing, setIsEditing] = useState(false);
  // We'll use local state to keep track of the timesheet details.
  const [currentTimesheet, setCurrentTimesheet] = useState(timesheet);

  // When actionData is returned and there are new values, update local state and exit edit mode.
  useEffect(() => {
    if (actionData && actionData.values && !actionData.errors) {
      // Update local timesheet state using the values returned from the action.
      // We need to convert the datetime from "YYYY-MM-DDTHH:MM" back to our stored format.
      const updated = {
        ...currentTimesheet,
        start_time: actionData.values.start_time.replace("T", " "),
        end_time: actionData.values.end_time.replace("T", " "),
        description: actionData.values.description
      };
      console.log('console dot sermeye');
      setCurrentTimesheet(updated);
      setIsEditing(false);
    }
  }, [actionData, currentTimesheet]);

  const btn = {
    backgroundColor: '#B2A5FF',
    borderColor: '#500073',
    borderRadius: '5px',
    padding: '5px 10px',
    fontFamily: 'Inter'
  }

  const employeeInfo = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    letterSpacing: '1.5px'
  };
  const employeeInfoBody = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: '20px'
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
    <div style={employeeInfo}>
      <h1 style={empTitle}>Timesheet Details</h1>
      {isEditing ? (
        // Edit Mode: Show the form pre-filled with the current timesheet details.
        <Form method="post" style={formBody}>
          <div style={formEntry}>
            <label style={empTitle} htmlFor="start_time">Start Time</label>
            <input
              style={empInfo}
              type="datetime-local"
              name="start_time"
              id="start_time"
              // Convert "YYYY-MM-DD HH:MM" to "YYYY-MM-DDTHH:MM" for input value.
              defaultValue={currentTimesheet.start_time.replace(" ", "T")}
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
              defaultValue={currentTimesheet.end_time.replace(" ", "T")}
              required
            />
            {actionData?.errors?.end_time && (
              <p style={{ color: "red" }}>{actionData.errors.end_time}</p>
            )}
          </div>
          <div style={formEntry}>
            <label style={empTitle} htmlFor="description">Description</label>
            <input
              style={empInfo}
              type="text"
              name="description"
              id="description"
              placeholder="Describe the work done"
              defaultValue={currentTimesheet.description || ""}
            />
          </div>
          {actionData?.errors?.time && (
            <p style={{ color: "red" }}>{actionData.errors.time}</p>
          )}
          <button type="submit" style={btn}>Save Changes</button>
          <button type="button" style={btn} onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </Form>
      ) : (
        // View Mode: Display the timesheet details.
        <div style={employeeInfoBody}>
          <p style={empInfo}>
            <strong>Timesheet ID:</strong> {currentTimesheet.id}
          </p>
          <p style={empInfo}>
            <strong>Employee:</strong> {currentTimesheet.full_name}
          </p>
          <p style={empInfo}>
            <strong>Start Time:</strong> {currentTimesheet.start_time}
          </p>
          <p style={empInfo}>
            <strong>End Time:</strong> {currentTimesheet.end_time}
          </p>
          <p style={empInfo}>
            <strong>Description:</strong>{" "}
            {currentTimesheet.description || "N/A"}
          </p>
          <button onClick={() => setIsEditing(true)} style={btn}>Edit Timesheet</button>
        </div>
      )}
      <hr />
      {/* <ul>
        <li>
          <a href="/timesheets">Back to Timesheets</a>
        </li>
        <li>
          <a href="/employees">Employees</a>
        </li>
      </ul> */}
    </div>
  );
}
