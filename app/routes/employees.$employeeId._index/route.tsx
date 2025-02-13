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
      <h1 style={empTitle}>Employee Profile</h1>

      {isEditing ? (
        // Edit Mode: Show the Form
        <Form method="post" style={formBody}>
          <div style={formEntry}>
            <label style={empTitle}>Full Name</label>
            <input style={empInfo} type="text" name="full_name" defaultValue={employee.full_name} required />
          </div>
          <div style={formEntry}>
            <label style={empTitle}>Email</label>
            <input style={empInfo} type="email" name="email" defaultValue={employee.email} required />
          </div>
          <div style={formEntry}>
            <label style={empTitle}>Phone Number</label>
            <input style={empInfo} type="tel" name="phone_number" defaultValue={employee.phone_number} required />
          </div>
          <div style={formEntry}>
            <label style={empTitle}>Job Title</label>
            <input style={empInfo} type="text" name="job_title" defaultValue={employee.job_title} required />
          </div>
          <div style={formEntry}>
            <label style={empTitle}>Department</label>
            <select name="department" defaultValue={employee.department} style={empInfo}>
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="accounting">Accounting</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div style={formEntry}>
            <label style={empTitle}>Salary</label>
            <input style={empInfo} type="number" name="salary" defaultValue={employee.salary} min="1500" required />
          </div>
          <div style={formEntry}>
            <label style={empTitle}>Start Date</label>
            <input style={empInfo} type="date" name="start_date" defaultValue={employee.start_date} required />
          </div>
          <div style={formEntry}>
            <label style={empTitle}>End Date</label>
            <input style={empInfo} type="date" name="end_date" defaultValue={employee.end_date || ""} />
          </div>

          <button type="submit" style={btn}>Save Changes</button>
          <button type="button" style={btn} onClick={() => setIsEditing(false)}>Cancel</button>
        </Form>
      ) : (
        // View Mode: Show Employee Details
        <div style={employeeInfoBody}>
          <p style={empInfo}><strong>Full Name:</strong> {employee.full_name}</p>
          <p style={empInfo}><strong>Email:</strong> {employee.email}</p>
          <p style={empInfo}><strong>Phone Number:</strong> {employee.phone_number}</p>
          <p style={empInfo}><strong>Job Title:</strong> {employee.job_title}</p>
          <p style={empInfo}><strong>Department:</strong> {employee.department}</p>
          <p style={empInfo}><strong>Salary:</strong> ${employee.salary}</p>
          <p style={empInfo}><strong>Start Date:</strong> {employee.start_date}</p>
          <p style={empInfo}><strong>End Date:</strong> {employee.end_date || "N/A"}</p>

          <button style={btn} onClick={() => setIsEditing(true)}>Edit Employee Information</button>
        </div>
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
