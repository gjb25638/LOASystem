const express = require('express')
const app = express()
const path = require('path');
const dist = path.join(__dirname, 'dist')
const port = 8080

app.use(express.static(path))
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(port)
