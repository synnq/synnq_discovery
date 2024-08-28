const express = require('express');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// In-memory storage for registered nodes
let nodes = {};

// Endpoint to register a new node
app.post('/register_node', (req, res) => {
    const { id, address, public_key } = req.body;

    if (!id || !address || !public_key) {
        return res.status(400).send('Node must include id, address, and public_key');
    }

    // Check if the node is already registered
    if (nodes[id]) {
        console.log(`Node with id ${id} is already registered.`);
    } else {
        nodes[id] = { id, address, public_key };
        console.log(`Node registered: ${id}`);
    }

    // Respond with the list of all nodes
    res.status(200).json(Object.values(nodes));
});

// Endpoint to get all registered nodes
app.get('/nodes', (req, res) => {
    res.status(200).json(Object.values(nodes));
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Discovery service running on port ${PORT}`);
});