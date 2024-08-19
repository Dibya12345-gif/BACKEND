var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res) {
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
                    <script>
                        function redirectToEmployeeTable() {
                            window.location.href = '/employee';
                        }
                    </script>
                </body>
            </html>
        `);
    } else if (req.url === '/employee') {
        fs.readFile(path.join(__dirname, 'Employee.html'), function(err, data) {
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
        res.end('404 Not Found');
    }
}).listen(3001);

console.log('Server running at http://127.0.0.1:3001/');
