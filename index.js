const express = require('express');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// In-memory storage for registered nodes
let nodes = {};

// Endpoint to register a new node
app.post('/register_node', (req, res) => {
    const { id, public_key } = req.body;
    const address = req.ip; // Get the IP address of the sender

    if (!id || !address || !public_key) {
        return res.status(400).send('Node must include id, address, and public_key');
    }

    // Update the node if it is already registered, otherwise add a new node
    nodes[id] = { id, address, public_key };
    console.log(`Node registered/updated: ${id}`);

    // Respond with the list of all nodes
    res.status(200).json(Object.values(nodes));
});

// Endpoint to delete a node by its ID
app.post('/delete_node', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('Node ID must be provided');
    }

    if (nodes[id]) {
        delete nodes[id];
        console.log(`Node deleted: ${id}`);
        res.status(200).send(`Node with id ${id} has been deleted`);
    } else {
        res.status(404).send(`Node with id ${id} not found`);
    }
});

// Endpoint to get all registered nodes
app.get('/nodes', (req, res) => {
    res.status(200).json(Object.values(nodes));
});

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Discovery service running on port ${PORT}`);
});