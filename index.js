const inquirer = require('inquirer');

const { table } = require('table');

const mysql = require('mysql2/promise'); 

async function init() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password123',
      database: 'employer_db'
    });

    const answers = await inquirer.prompt([
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

    if (answers.options === 'View All Departments') {
      const departments = await db.query('SELECT * FROM department;');
      for (i = 0; i < departments.length; i++) {
        const arrOfArrs = departments[i].map( row => Object.values(row));
        arrOfArrs.unshift(["Department ID", "Department Name"]);
        console.log(table(arrOfArrs));
      }
    };

    if (answers.options === 'View All Roles') {
      const roles = await db.query('SELECT role.id, title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id;');
      for (i = 0; i < roles.length; i++) {
        const arrOfArrs = roles[i].map( row => Object.values(row));
        arrOfArrs.unshift(["Role ID", "Role Title", "Role Salary", "Department Name"]);
        console.log(table(arrOfArrs));
      }
    };

    if (answers.options === 'View All Employees') {
      const employees = await db.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;"
      );
      for (i = 0; i < employees.length; i++) {
        const arrOfArrs = employees[i].map( row => Object.values(row));
        arrOfArrs.unshift(["Employee ID", "First Name", "Last Name", "Employee Role", "Department", "Salary", "Manager"]);
        console.log(table(arrOfArrs));
      }
    };

    
  } 
  
  catch (error) {
    if (error.isTtyError) {
      console.log(error);
    } else {
      console.log(error);
    }
  }
}

init();