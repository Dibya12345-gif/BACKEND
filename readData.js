const fs = require('fs');

// Function to read JSON file and parse its content
function readJSONFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            callback(err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            callback(parseErr);
        }
    });
}

// Function to write data to JSON file
function writeJSONFile(filename, data, callback) {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            callback(err);
            return;
        }
        callback(null);
    });
}

// CRUD Operations
const filename = 'employees.json';

// Create - Add a new employee
function addEmployee(newEmployee) {
    readJSONFile(filename, (err, employees) => {
        if (err) return;
        employees.push(newEmployee);
        writeJSONFile(filename, employees, (err) => {
            if (err) return;
            console.log('Employee added successfully');
        });
    });
}

// Read - List all employees
function listEmployees() {
    readJSONFile(filename, (err, employees) => {
        if (err) return;
        console.log('Employee List:');
        employees.forEach(employee => {
            console.log(`${employee.name} earns $${employee.salary}`);
        });
    });
}

// Update - Update an employee's salary
function updateEmployee(name, newSalary) {
    readJSONFile(filename, (err, employees) => {
        if (err) return;
        const employee = employees.find(emp => emp.name === name);
        if (employee) {
            employee.salary = newSalary;
            writeJSONFile(filename, employees, (err) => {
                if (err) return;
                console.log('Employee salary updated successfully');
            });
        } else {
            console.log('Employee not found');
        }
    });
}

// Delete - Remove an employee
function deleteEmployee(name) {
    readJSONFile(filename, (err, employees) => {
        if (err) return;
        const filteredEmployees = employees.filter(emp => emp.name !== name);
        writeJSONFile(filename, filteredEmployees, (err) => {
            if (err) return;
            console.log('Employee deleted successfully');
        });
    });
}

// Example usage
addEmployee({ name: 'David', salary: 80000 });
listEmployees();
updateEmployee('Alice', 55000);
deleteEmployee('Bob');
listEmployees();
