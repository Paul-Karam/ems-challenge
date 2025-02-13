import { useLoaderData, useActionData } from "react-router";
import { Form } from "react-router";
import { useState, useEffect } from "react";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: { employeeId: string } }) {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId]);

  if (!employee) {
    throw new Response("Employee Not Found", { status: 404 });
  }

  return { employee };
}

export async function action({ request, params }: { request: Request; params: { employeeId: string } }) {
  const formData = await request.formData();
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const jobTitle = formData.get("job_title") as string;
  const department = formData.get("department") as string;
  const salary = formData.get("salary") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;

  const db = await getDB();
  await db.run(
    `UPDATE employees SET full_name = ?, email = ?, phone_number = ?, job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ? WHERE id = ?`,
    [fullName, email, phoneNumber, jobTitle, department, salary, startDate, endDate, params.employeeId]
  );

  return {success: true}; // Stay on the same page after saving
}

export default function EmployeePage() {
  const { employee } = useLoaderData();
  const actionData = useActionData();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState(employee);

  // Hide edit form after successful update
  useEffect(() => {
    if (actionData?.success) {
      setIsEditing(false);
      setUpdatedEmployee({ ...updatedEmployee }); // Update state to reflect changes
    }
  }, [actionData]);


  return (
    <div>
      <h1>Employee Profile</h1>

      {isEditing ? (
        // Edit Mode: Show the Form
        <Form method="post">
          <div>
            <label>Full Name</label>
            <input type="text" name="full_name" defaultValue={employee.full_name} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" defaultValue={employee.email} required />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="tel" name="phone_number" defaultValue={employee.phone_number} required />
          </div>
          <div>
            <label>Job Title</label>
            <input type="text" name="job_title" defaultValue={employee.job_title} required />
          </div>
          <div>
            <label>Department</label>
            <select name="department" defaultValue={employee.department}>
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="accounting">Accounting</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div>
            <label>Salary</label>
            <input type="number" name="salary" defaultValue={employee.salary} min="1500" required />
          </div>
          <div>
            <label>Start Date</label>
            <input type="date" name="start_date" defaultValue={employee.start_date} required />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" name="end_date" defaultValue={employee.end_date || ""} />
          </div>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </Form>
      ) : (
        // View Mode: Show Employee Details
        <>
          <p><strong>Full Name:</strong> {employee.full_name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone Number:</strong> {employee.phone_number}</p>
          <p><strong>Job Title:</strong> {employee.job_title}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Salary:</strong> ${employee.salary}</p>
          <p><strong>Start Date:</strong> {employee.start_date}</p>
          <p><strong>End Date:</strong> {employee.end_date || "N/A"}</p>

          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    {/* <div>
      <h1>Employee Profile</h1>
      <p><strong>Full Name:</strong> {employee.full_name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Phone Number:</strong> {employee.phone_number}</p>
      <p><strong>Date of Birth:</strong> {employee.date_of_birth}</p>
      <p><strong>Job Title:</strong> {employee.job_title}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Salary:</strong> ${employee.salary}</p>
      <p><strong>Start Date:</strong> {employee.start_date}</p>
      <p><strong>End Date:</strong> {employee.end_date || "N/A"}</p> */}

      {/* Navigation */}
      {/* <ul>
        <li><Link to="/employees">Back to Employees</Link></li>
        <li><Link to="/employees/new">New Employee</Link></li>
        <li><Link to={`/employees/${employee.id}/edit`}>Edit Employee</Link></li>
      </ul>*/}
    </div> 
  )
}
