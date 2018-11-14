const express = require('express');
const app = express();

const path = __dirname + '/dist';
const port = 8080;

app.use(express.static(path));
app.get('*', (req, res) => {
    res.sendFile(path + '/index.html');
});

app.listen(port);