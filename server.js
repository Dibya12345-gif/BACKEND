const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const filename = 'employees.json';

// Function to read JSON file and parse its content
function readJSONFile(callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseErr) {
            callback(parseErr, null);
        }
    });
}

// Function to write data to JSON file
function writeJSONFile(data, callback) {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}

// Serve the form HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create - Add a new employee
app.post('/add', (req, res) => {
    const newEmployee = { name: req.body.name, salary: parseFloat(req.body.salary) };
    readJSONFile((err, employees) => {
        if (err) return res.status(500).send('Error reading file');
        employees.push(newEmployee);
        writeJSONFile(employees, (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/');
        });
    });
});

// Read - List all employees
app.get('/list', (req, res) => {
    readJSONFile((err, employees) => {
        if (err) return res.status(500).send('Error reading file');
        let html = '<h1>Employee List</h1><ul>';
        employees.forEach(employee => {
            html += `<li>${employee.name} earns $${employee.salary}</li>`;
        });
        html += '</ul><a href="/">Go back</a>';
        res.send(html);
    });
});

// Update - Update an employee's salary
app.post('/update', (req, res) => {
    const name = req.body.name;
    const newSalary = parseFloat(req.body.salary);
    readJSONFile((err, employees) => {
        if (err) return res.status(500).send('Error reading file');
        const employee = employees.find(emp => emp.name === name);
        if (employee) {
            employee.salary = newSalary;
            writeJSONFile(employees, (err) => {
                if (err) return res.status(500).send('Error writing file');
                res.redirect('/');
            });
        } else {
            res.status(404).send('Employee not found');
        }
    });
});

// Delete - Remove an employee
app.post('/delete', (req, res) => {
    const name = req.body.name;
    readJSONFile((err, employees) => {
        if (err) return res.status(500).send('Error reading file');
        const filteredEmployees = employees.filter(emp => emp.name !== name);
        writeJSONFile(filteredEmployees, (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
