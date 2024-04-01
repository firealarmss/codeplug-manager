const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const directoryPath = path.join(__dirname, 'codeplugs');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log('Error reading directory');
            return res.send('Error loading page');
        }

        let data = {};

        files.forEach(file => {
            const parts = file.split('-');
            if (parts.length < 3) return;

            const brand = parts[0];
            const model = parts[1];
            const bandWithExt = parts.slice(2).join('-');
            const band = bandWithExt.substring(0, bandWithExt.lastIndexOf('.')) || 'unknown';

            if (!data[brand]) data[brand] = {};
            if (!data[brand][model]) data[brand][model] = new Set();
            data[brand][model].add(band);
        });

        Object.keys(data).forEach(brand => {
            Object.keys(data[brand]).forEach(model => {
                data[brand][model] = Array.from(data[brand][model]).sort();
            });
        });

        res.render('index', { data: JSON.stringify(data) });
    });
});


app.get('/search', (req, res) => {
    const { brand, model, band } = req.query;
    const directoryPath = path.join(__dirname, 'codeplugs');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.log('Error getting directory information.');
        } else {
            let filteredFiles = files.filter(file => {
                const parts = file.split('-');
                if (parts.length < 3) {
                    return false;
                }
                const fileBrand = parts[0];
                const fileModel = parts[1];
                const bandAndExtension = parts.slice(2).join('-');
                const fileBand = bandAndExtension.substring(0, bandAndExtension.lastIndexOf('.'));

                return fileBrand.toLowerCase() === brand.toLowerCase() &&
                    fileModel.toLowerCase() === model.toLowerCase() &&
                    fileBand.toLowerCase() === band.toLowerCase();
            });
            res.render('results', { files: filteredFiles });
        }
    });
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'codeplugs', filename);
    res.download(filePath);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));