const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; 
 

app.get('/', (req, res) => {
    res.send('Server is ready');    
})

// Allow only this origin
app.use(cors({
    origin: 'http://localhost:5173', 
}));

app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306, 
    user: 'root',
    password: 'Adnan@123',
    database: 'clients_db',
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// API to get clients
app.get('/getClients', (req, res) => {
    const query = `
        SELECT 
            PTY_ID, PTY_FirstName, PTY_LastName, PTY_Phone, PTY_SSN, 
            Add_ID, Add_Line1, Add_City, Add_Zip, 
            Stt_Name AS Add_State
        FROM 
            OPT_Party
        LEFT JOIN 
            OPT_Address ON OPT_Party.PTY_ID = OPT_Address.Add_PartyID
        LEFT JOIN 
            SYS_State ON OPT_Address.Add_State = SYS_State.Stt_ID
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ clients: results });
    });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
