var http = require('http');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

// Load employees from text file
const loadEmployees = () => {
  try {
    const data = fs.readFileSync('employees.txt', 'utf8');
    return data ? data.trim().split('\n').map(line => {
      const [id, name, email, phone, salary] = line.split(',');
      return { id: parseInt(id), name, email, phone, salary: parseFloat(salary) };
    }) : [];
  } catch (error) {
    console.error('Error reading employees.txt:', error);
    return [];
  }
};

// Save employees to text file
const saveEmployees = (employees) => {
  try {
    const data = employees.map(emp => `${emp.id},${emp.name},${emp.email},${emp.phone},${emp.salary}`).join('\n');
    fs.writeFileSync('employees.txt', data, 'utf8');
  } catch (error) {
    console.error('Error writing employees.txt:', error);
  }
};

// Generate HTML content for employee table
const generateEmployeeTable = (employees) => {
  let tableContent = '<table border="1"><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Salary</th><th>Action</th></tr>';
  employees.forEach(emp => {
    tableContent += `
      <tr>
        <form method="POST" action="/update" style="display:inline;">
          <td>${emp.id}<input type="hidden" name="id" value="${emp.id}"></td>
          <td><input type="text" name="name" value="${emp.name}" required></td>
          <td><input type="email" name="email" value="${emp.email}" required></td>
          <td><input type="text" name="phone" value="${emp.phone}" required></td>
          <td><input type="number" name="salary" value="${emp.salary}" required></td>
          <td>
            <button type="submit">Update</button>
          </td>
        </form>
        <form method="POST" action="/delete" style="display:inline;">
          <td>
            <input type="hidden" name="id" value="${emp.id}">
            <button type="submit">Delete</button>
          </td>
        </form>
      </tr>`;
  });
  tableContent += '</table>';
  return tableContent;
};

http.createServer(function(req, res) {
    if (req.method === 'GET') {
        if (req.url === '/') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`
                <html>
                    <head>
                        <title>Employee Portal</title>
                    </head>
                    <body>
                        <h1>Welcome to Employee Portal!</h1>
                        <button onclick="redirectToEmployeeTable()">Employee Salary Table</button>
                        <button onclick="redirectToAddEmployee()">Add New Employee</button>
                        <script>
                            function redirectToEmployeeTable() {
                                window.location.href = '/employee';
                            }
                            function redirectToAddEmployee() {
                                window.location.href = '/add_employee';
                            }
                        </script>
                    </body>
                </html>
            `);
        } else if (req.url === '/employee') {
            const employees = loadEmployees();
            const employeeTable = generateEmployeeTable(employees);
            
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`
                <html>
                    <head>
                        <title>Employee Salary Table</title>
                    </head>
                    <body>
                        <h1>Employee Salary Table</h1>
                        ${employeeTable}
                        <button onclick="redirectToAddEmployee()">Add New Employee</button>
                        <script>
                            function redirectToAddEmployee() {
                                window.location.href = '/add_employee';
                            }
                        </script>
                    </body>
                </html>
            `);
        } else if (req.url === '/add_employee') {
            fs.readFile(path.join(__dirname, 'add_employee.html'), function(err, data) {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('404 Not Found');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h1>404 Not Found</h1>');
        }
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const parsedBody = querystring.parse(body);
            
            if (req.url === '/update') {
                const id = parseInt(parsedBody.id);
                const name = parsedBody.name;
                const email = parsedBody.email;
                const phone = parsedBody.phone;
                const salary = parseFloat(parsedBody.salary);
                const employees = loadEmployees();
                
                const employee = employees.find(emp => emp.id === id);
                if (employee) {
                    employee.name = name;
                    employee.email = email;
                    employee.phone = phone;
                    employee.salary = salary;
                    saveEmployees(employees);
                    res.writeHead(302, { 'Location': '/employee' });
                    res.end();
                } else {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h1>Employee not found</h1>');
                }
            } else if (req.url === '/delete') {
                const id = parseInt(parsedBody.id);
                let employees = loadEmployees();
                
                employees = employees.filter(emp => emp.id !== id);
                saveEmployees(employees);
                res.writeHead(302, { 'Location': '/employee' });
                res.end();
            } else if (req.url === '/add') {
                const name = parsedBody.name;
                const email = parsedBody.email;
                const phone = parsedBody.phone;
                const salary = parseFloat(parsedBody.salary);
                const employees = loadEmployees();
                
                const newId = employees.length ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
                employees.push({ id: newId, name, email, phone, salary });
                saveEmployees(employees);
                res.writeHead(302, { 'Location': '/employee' });
                res.end();
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('<h1>404 Not Found</h1>');
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 Not Found</h1>');
    }
}).listen(3032);

console.log('Server running at http://127.0.0.1:3032/');
