import express from 'express';

const app = express();
const PORT = 5001;

app.get('/', (req, res) => res.send('Hello'));

console.log('Starting debug server...');
app.listen(PORT, () => {
    console.log(`Debug server running on port ${PORT}`);
});
console.log('Listen called.');
