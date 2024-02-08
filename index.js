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

    const inquire = () => {
      inquirer
        .prompt([
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
        ])
        .then(async (answers) => {
          switch (answers.options) {
            case 'View All Departments':
              try {
                const departments = await db.query('SELECT * FROM department;');
                const depData = departments[0];
                const arr = depData.map(row => Object.values(row));
                arr.unshift(["Department ID", "Department Name"]);
                console.log(table(arr));
                setTimeout(() => {
                  inquire();
                }, 2000);
              } catch (error) {
                console.error(error);
              }
              break;

            case 'View All Roles':
              try {
                const roles = await db.query('SELECT role.id, title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id;');
                const roleData = roles[0];
                const arr = roleData.map(row => Object.values(row));
                arr.unshift(["Role ID", "Role Title", "Role Salary", "Department Name"]);
                console.log(table(arr));
                setTimeout(() => {
                  inquire();
                }, 2000);
              } catch (error) {
                console.error(error);
              }
              break;

            case 'View All Employees':
              try {
              const employees = await db.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;");
              const empData = employees[0];
              const arr = empData.map(row => Object.values(row));
              arr.unshift(["Employee ID", "First Name", "Last Name", "Employee Role", "Department", "Salary", "Manager"]);
              console.log(table(arr));
              setTimeout(() => {
                inquire();
              }, 2000);
            } catch (error) {
              console.error(error);
            }
            break;

            case 'Add Department':
              try {
                const answers = await inquirer.prompt([{
                    type: 'input',
                    name: 'department',
                    message: 'What is the name of the department?'
                    }]);
                await db.query(`INSERT INTO department (name) VALUES ('${sanitizeInput(answers.department)}')`);
                console.log('Successfully added to the database!');
                setTimeout(() => {
                  inquire();
                }, 2000);
              } catch (error) {
                console.error(error);
              }
              break;

              case 'Add Role':
                try {
                  const answers = await inquirer.prompt([
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
                await db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${sanitizeInput(answers.role)}', '${sanitizeInput(answers.salary)}', '${sanitizeInput(answers.department)}')`);
                console.log('Successfully added to the database!');
                setTimeout(() => {
                  inquire();
                }, 2000);
              } catch (error) {
                console.error(error);
              }
              break;

              case 'Add Employee':
                try {
                  const answers = await inquirer.prompt([
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
                      message: "What is the ID of the employee's manager (if none, enter NULL)?"
                    }
                  ]);
                  await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${sanitizeInput(answers.fname)}', '${sanitizeInput(answers.lname)}', '${sanitizeInput(answers.role)}', ${sanitizeInput(answers.manager)})`);
                  console.log('Successfully added to the database!');
                  setTimeout(() => {
                    inquire();
                  }, 2000);
                } catch (error) {
                  console.error(error);
                }
                break;
                case 'Update Employee Role':
                  try {
                    const answers = await inquirer.prompt([
                      {
                        type: 'input',
                        name: 'empID',
                        message: "What is the employee's ID?"
                      },
                      {
                        type: 'input',
                        name: 'roleID',
                        message: "what is the ID of the new role?"
                      }
                    ]);
                      await db.query(`UPDATE employee SET role_id = '${sanitizeInput(answers.roleID)}' WHERE id = '${sanitizeInput(answers.empID)}'`);
                      console.log('Successfully updated!');
                      setTimeout(() => {
                        inquire();
                      }, 2000);
                  }
                  catch (error) {
                    console.error(error);
                  }
                break;
              }
        })
        .catch((error) => {
          if (error.isTtyError) {
          } else {}
        });
    };
    inquire();

  } catch (error) {
  console.log(error)
  }
}

init()
