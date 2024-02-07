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

    // console.log(answers);

    if (answers.options === 'View All Departments') {
      const departments = await db.query('SELECT * FROM department;');
      for (i = 0; i < departments.length; i++) {
        const arrOfDeps = departments[i].map( row => Object.values(row));
        arrOfDeps.unshift(["id", "name"]);
        console.log(table(arrOfDeps));
      }
    }

    if (answers.options === 'View All Roles') {
      const roles = await db.query('')
    }

  } 
  
  catch (error) {
    if (error.isTtyError) {
      // Handle TTY error
    } else {
      // Handle other errors
    }
  }
}

init();
