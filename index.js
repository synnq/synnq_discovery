const express = require('express');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// In-memory storage for registered nodes
let nodes = {};

// Helper function to extract IPv4 address
function getIPv4(remoteAddress) {
    // If the IP is IPv6, it might be in the form "::ffff:192.168.1.1"
    if (remoteAddress.includes('::ffff:')) {
        return remoteAddress.split('::ffff:')[1];
    }
    return remoteAddress;
}

// Endpoint to register a new node
app.post('/register_node', (req, res) => {
    const { id, public_key } = req.body;
    const address = getIPv4(req.socket.remoteAddress); // Get the IPv4 address of the sender

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
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Discovery service running on port ${PORT}`);
});