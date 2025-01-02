require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/download', require('./events/pinataInteractions/downloadBook'));
app.use('/list-books', require('./events/pinataInteractions/listBooks'));
app.use('/upload', require('./events/pinataInteractions/uploadBook'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});