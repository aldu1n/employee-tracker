INSERT INTO department (name)
VALUES 
("Engineering"),
("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
("Software Engineer", 70000, 1),
("Salesperson", 40000, 2),
("Sales Lead", 55000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("John", "Jon", 1),
("Victor", "Vick", 2),
("Maria", "Green", 3);
