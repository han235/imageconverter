const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.array('images'), async (req, res) => {
    try {
        const files = req.files;
        const outputDir = 'output/';
        const zipFilePath = 'download/images.zip';
        const zipOutput = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.pipe(zipOutput);

        for (const file of files) {
            const inputPath = file.path;
            const outputPath = path.join(outputDir, file.originalname);

            // 이미지 변환 (예시: PNG 형식으로 변환)
            await sharp(inputPath).toFormat('png').toFile(outputPath);

            archive.file(outputPath, { name: file.originalname });
        }

        archive.finalize();

        zipOutput.on('close', () => {
            res.download(zipFilePath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 내부 오류가 발생했습니다.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`서버가 \${PORT}번 포트에서 실행중입니다.\`);
});
