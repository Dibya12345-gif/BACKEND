const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express(); 
const port = 3000;

app.use(bodyParser.json());

let employees = [];

// Load employees from file
const loadEmployees = () => {
  try {
    const data = fs.readFileSync('Salary.json', 'utf8');
    employees = JSON.parse(data);
  } catch (error) {
    employees = [];
    console.error("Error loading employees:", error);
  }
};

// Save employees to file
const saveEmployees = () => {
  try {
    fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2));
  } catch (error) {
    console.error("Error saving employees:", error);
  }
};

loadEmployees();

// Routes for CRUD operations

// Get all employees
app.get('/employees', (req, res) => {
  res.json(employees);
});

// Get an employee by ID
app.get('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employees.find(emp => emp.id === id);
  if (employee) {
    res.json(employee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

// Add a new employee
app.post('/employees', (req, res) => {
  const newEmployee = {
    id: employees.length ? employees[employees.length - 1].id + 1 : 1,
    ...req.body
  };
  employees.push(newEmployee);
  saveEmployees();
  res.status(201).json(newEmployee);
});

// Update an existing employee
app.put('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employees[index] = { id, ...req.body };
    saveEmployees();
    res.json(employees[index]);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    const deletedEmployee = employees.splice(index, 1);
    saveEmployees();
    res.json(deletedEmployee);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
