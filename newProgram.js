const fs = require('fs');

// Load employees from file
const loadEmployees = () => {
  try {
    const data = fs.readFileSync('employees.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employees.json:', error);
    return [];
  }
};

// Example function to print all employees
const printEmployees = (employees) => {
  console.log('Employee List:');
  employees.forEach(emp => {
    console.log(`ID: ${emp.id}, Name: ${emp.name}, Salary: ${emp.salary}`);
  });
};

// Example function to calculate total salary
const calculateTotalSalary = (employees) => {
  return employees.reduce((total, emp) => total + emp.salary, 0);
};

// Main logic
const main = () => {
  const employees = loadEmployees();
  if (employees.length === 0) {
    console.log('No employees found.');
    return;
  }

  printEmployees(employees);
  const totalSalary = calculateTotalSalary(employees);
  console.log(`Total Salary: $${totalSalary}`);
};

main();