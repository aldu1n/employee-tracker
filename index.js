const inquirer = require('inquirer');
const { table } = require('table');
const mysql = require('mysql2/promise');

const sanitizeInput = (str) => {
  return str.replace(/['";=]/g, "");
};

async function init() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password123',
      database: 'employer_db'
    });

    const { options } = await inquirer.prompt([
      {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Update Employee Role'
        ]
      }
    ]);

    switch (options) {
      case 'View All Departments':
        const departments = await db.query('SELECT * FROM department;');
        const depData = departments[0];
          const a = depData.map(row => Object.values(row));
          a.unshift(["Department ID", "Department Name"]);
          console.log(table(a));
        break;

      case 'View All Roles':
        const roles = await db.query('SELECT role.id, title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id;');
        const roleData = roles[0];
          const b = roleData.map(row => Object.values(row));
          b.unshift(["Role ID", "Role Title", "Role Salary", "Department Name"]);
          console.log(table(b));
        break;

      case 'View All Employees':
        const employees = await db.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;");
        const empData = employees[0];
          const c = empData.map(row => Object.values(row));
          c.unshift(["Employee ID", "First Name", "Last Name", "Employee Role", "Department", "Salary", "Manager"]);
          console.log(table(c));
        break;

      case 'Add Department':
        const departmentAnswers = await inquirer.prompt([{
          type: 'input',
          name: 'department',
          message: 'What is the name of the department?'
        }]);
        await db.query(`INSERT INTO department (name) VALUES ('${departmentAnswers.department}')`);
        console.log('Successfully added to the database!');
        break;

      case 'Add Role':
        const roleAnswers = await inquirer.prompt([
          {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
          },
          {
            type: 'input',
            name: 'department',
            message: 'What is the ID of the department the role belongs to?'
          }
        ]);
        await db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${sanitizeInput(roleAnswers.role)}', '${sanitizeInput(roleAnswers.salary)}', '${sanitizeInput(roleAnswers.department)}')`);
        console.log('Successfully added to the database!');
        break;

      case 'Add Employee':
        const employeeAnswers = await inquirer.prompt([
          {
            type: 'input',
            name: 'fname',
            message: "What is the employee's first name?"
          },
          {
            type: 'input',
            name: 'lname',
            message: "What is the employee's last name?"
          },
          {
            type: 'input',
            name: 'role',
            message: "What is the ID of the employee's role?"
          },
          {
            type: 'input',
            name: 'manager',
            message: "What is the ID of the employee's manager (if none, leave blank)?"
          }
        ]);
        await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${sanitizeInput(employeeAnswers.fname)}', '${sanitizeInput(employeeAnswers.lname)}', '${sanitizeInput(employeeAnswers.role)}', '${sanitizeInput(employeeAnswers.manager)}')`);
        console.log('Successfully added to the database!');
        break;
      
      case 'Update Employee Role':
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

init();
