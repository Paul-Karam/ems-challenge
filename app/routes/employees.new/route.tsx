import { Form , redirect, useActionData, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {

  let errors: Record<string, string> = {}; // Store validation errors
  const formData = await request.formData();

  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const date_of_birth = formData.get("date_of_birth") as string;
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  // const photo = formData.get("photo");
  // const cv = formData.get("cv");
  // const idDocument = formData.get("id_document");

  // Basic Validations
  if (!full_name) errors.full_name = "Full Name is required.";
  if (!email) errors.email = "Email is required.";
  if (!phone_number) errors.phone_number = "Phone Number is required.";
  if (!date_of_birth) errors.date_of_birth = "Date of Birth is required.";


  // Age validation (must be 18+)
  if (date_of_birth) {
    const birthDate = new Date(date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      errors.date_of_birth = "Employee must be at least 18 years old.";
    }
  }

  const db = await getDB();
  await db.run(
    `INSERT INTO employees 
    (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date]
  );

  return redirect("/employees");
}

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

export default function NewEmployeePage() {
  const actionData = useActionData(); // Get server-side response (errors or success)
  return (
    <div style={employeeInfo}>
      <h1 style={empTitle}>Create New Employee</h1>

      {/* Display success message */}
      {actionData?.success && <p style={{ color: "green" }}>{actionData.success}</p>}

      <Form method="post" encType="multipart/form-data" style={formBody}>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required style={empInfo}/>
          {actionData?.errors?.full_name && <p style={{ color: "red" }}>{actionData.errors.full_name}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required style={empInfo}/>
          {actionData?.errors?.email && <p style={{ color: "red" }}>{actionData.errors.email}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="phone_number">phone_number</label>
          <input type="tel" name="phone_number" id="phone_number" required style={empInfo}/>
          {actionData?.errors?.phone_number && <p style={{ color: "red" }}>{actionData.errors.phone_number}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="date_of_birth">Date Of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" style={empInfo}/>
          {actionData?.errors?.date_of_birth && <p style={{ color: "red" }}>{actionData.errors.date_of_birth}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" required style={empInfo}/>
          {actionData?.errors?.job_title && <p style={{ color: "red" }}>{actionData.errors.job_title}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="department">Department</label>
          <select id="department" name="department" style={empInfo}>
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="accounting">Accounting</option>
              <option value="sales">Sales</option>
          </select>
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="salary">Salary</label>
          <input style={empInfo} type="number" name="salary" id="salary" min="1500"/>
          {actionData?.errors?.salary && <p style={{ color: "red" }}>{actionData.errors.salary}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="start_date">Start Date</label>
          <input style={empInfo} type="date" name="start_date" id="start_date"/>
          {actionData?.errors?.start_date && <p style={{ color: "red" }}>{actionData.errors.start_date}</p>}
        </div>
        <div  style={formEntry}>
          <label style={empTitle} htmlFor="end_date">End Date</label>
          <input style={empInfo} type="date" name="end_date" id="end_date"/>
          {actionData?.errors?.end_date && <p style={{ color: "red" }}>{actionData.errors.end_date}</p>}
        </div>
        <button type="submit" style={btn}>Create Employee</button>
      </Form>
    </div>
  );
}
