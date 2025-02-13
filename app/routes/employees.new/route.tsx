import { Form , redirect, useActionData, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { Link } from "react-router";

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



export default function NewEmployeePage() {
  const actionData = useActionData(); // Get server-side response (errors or success)
  return (
    <div>
      <h1>Create New Employee</h1>

      {/* Display success message */}
      {actionData?.success && <p style={{ color: "green" }}>{actionData.success}</p>}

      <Form method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required />
          {actionData?.errors?.full_name && <p style={{ color: "red" }}>{actionData.errors.full_name}</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required/>
          {actionData?.errors?.email && <p style={{ color: "red" }}>{actionData.errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone_number">phone_number</label>
          <input type="tel" name="phone_number" id="phone_number" required/>
          {actionData?.errors?.phone_number && <p style={{ color: "red" }}>{actionData.errors.phone_number}</p>}
        </div>
        <div>
          <label htmlFor="date_of_birth">Date Of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" />
          {actionData?.errors?.date_of_birth && <p style={{ color: "red" }}>{actionData.errors.date_of_birth}</p>}
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" required />
          {actionData?.errors?.job_title && <p style={{ color: "red" }}>{actionData.errors.job_title}</p>}
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <select id="department" name="department">
              <option value="technology">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="accounting">Accounting</option>
              <option value="sales">Sales</option>
          </select>
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input type="number" name="salary" id="salary" min="1500"/>
          {actionData?.errors?.salary && <p style={{ color: "red" }}>{actionData.errors.salary}</p>}
        </div>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input type="date" name="start_date" id="start_date"/>
          {actionData?.errors?.start_date && <p style={{ color: "red" }}>{actionData.errors.start_date}</p>}
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input type="date" name="end_date" id="end_date"/>
          {actionData?.errors?.end_date && <p style={{ color: "red" }}>{actionData.errors.end_date}</p>}
        </div>
        {/* <div>
          <label htmlFor="photo">Employee Photo</label>
          <input type="file" name="photo" id="photo" accept="image/*" />
        </div>
        <div>
          <label htmlFor="cv">CV</label>
          <input type="file" name="cv" id="cv" accept=".pdf,.doc,.docx" />
        </div>
        <div>
          <label htmlFor="id_document">ID Document</label>
          <input type="file" name="id_document" id="id_document" accept="image/*,application/pdf" />
        </div> */}
        <button type="submit">Create Employee</button>
      </Form>
      <hr/>
      <ul>
        <li><Link to='/employees'>Employees</Link></li>
        <li><Link to='/timesheets'>Timesheets</Link></li>
      </ul>
    </div>
  );
}
