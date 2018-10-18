const AWS = require('aws-sdk');
let fs = require('fs');
let csv = require('fast-csv');

module.exports = uploadS3 = (resulData) => {

    let headerBodyDocumentSel = [];
    let fileSel = fs.createWriteStream('users.csv');
    let fileStream;
    let uploadParams;

    let s3 = new AWS.S3({
        region: 'holaMundo',
        accessKeyId: 'holaMundo',
        secretAccessKey: 'holaMundo'
    });

    headerBodyDocumentSel.push(['ID', 'NAME', 'AGE', 'CAREER', 'SEMESTER', 'GENDER', 'EMAIL', 'SCORE']);

    for (let user of resulData) {
        headerBodyDocumentSel.push([user.id, user.name, user.age, user.career, user.semester, user.gender, user.email, user.score]);
    }

    csv.write(headerBodyDocumentSel, { headers: true }).pipe(fileSel).on('finish', menssage => {
        fileStream = fs.createReadStream(fileSel.path);
        fileSel.end();
        uploadParams = { Bucket: 'proyectochidori', Key: 'users.csv', Body: fileStream };
        s3.upload(uploadParams, (err, data) => {
            if (err) { console.log("Error", err); } else if (data) { console.log("Upload Success", data.Location); }
        });
    });
}