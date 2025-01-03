const express = require('express')
const path = require("path");
const app = express()
const port = 10000

const buildPath = path.normalize(path.join(__dirname, './dist'));

app.use(express.static(__dirname + '/dist'))

// app.get('/', (req, res) => {
//     res.sendFile('views/main.html', {root: __dirname })
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})