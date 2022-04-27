const https = require('https');

const version_registry = 'https://raw.githubusercontent.com/AlixANNERAUD/Xila/master/version_registry.json';

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {

    });


https.get(url, (res) => {
    let body = "";
    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body)
        }
        catch (error) {

        };

    });

}).on("error", (error) => {
    console.error(error.message);
});




let formidable = require('formidable');
let fs = require('fs');
const { on } = require('events');


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    // Create an instance of the form object

    let form = new formidable.IncomingForm();

    form.parse(req, function (error, fields, file) {
        let filepath = file.fileupload.filepath;
        let newpath = "C:/upload-example/";

        newpath += file.fileupload.originalFIlename;

        fs.rename(filepath, newpath, function () {
            // Send a NodeJS file upload confirmation message
            res.write('NodeJS File upload sucess !');
            res.end();
        }
        )
    })

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('Hello World');
    res.end();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});