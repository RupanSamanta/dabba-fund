const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'server running on PORT: ' + PORT});
})

app.listen(PORT, () => {
    console.log('Server running on PORT: ' + PORT);
})