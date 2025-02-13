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

  return (
    <div>
      <h1>Timesheet Details</h1>
      {isEditing ? (
        // Edit Mode: Show the form pre-filled with the current timesheet details.
        <Form method="post">
          <div>
            <label htmlFor="start_time">Start Time</label>
            <input
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
          <div>
            <label htmlFor="end_time">End Time</label>
            <input
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
          <div>
            <label htmlFor="description">Description</label>
            <input
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
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </Form>
      ) : (
        // View Mode: Display the timesheet details.
        <>
          <p>
            <strong>Timesheet ID:</strong> {currentTimesheet.id}
          </p>
          <p>
            <strong>Employee:</strong> {currentTimesheet.full_name}
          </p>
          <p>
            <strong>Start Time:</strong> {currentTimesheet.start_time}
          </p>
          <p>
            <strong>End Time:</strong> {currentTimesheet.end_time}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {currentTimesheet.description || "N/A"}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Timesheet</button>
        </>
      )}
      <hr />
      <ul>
        <li>
          <a href="/timesheets">Back to Timesheets</a>
        </li>
        <li>
          <a href="/employees">Employees</a>
        </li>
      </ul>
    </div>
  );
}
