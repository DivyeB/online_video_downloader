const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Download video
app.post('/download', async (req, res) => {
    const url = req.body.url;
    const quality = req.body.quality;

    try {
        // Fetch video info
        const info = await ytdl.getInfo(url);

        // Get available formats
        const formats = info.formats;
        console.log('Available formats:', formats); // Debug: Log formats

        // Map quality to format
        const qualityMap = {
            '1080p': '137', // Example IDs; adjust based on your format IDs
            '720p': '22',
            '480p': '135',
            '360p': '18'
        };

        // Choose the format
        const formatId = qualityMap[quality];
        const format = formats.find(f => f.itag === parseInt(formatId) && f.hasVideo);

        if (format) {
            res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
            ytdl(url, { format: format }).pipe(res);
        } else {
            res.status(400).send('Requested quality format is not available');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching video');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
