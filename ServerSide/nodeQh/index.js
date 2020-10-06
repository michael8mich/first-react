import express from 'express'; // Web Framework
import sql from 'mssql'; // MS Sql Server client
import cors from 'cors';
import q from './routes/q';
import config from './config.json';
var multer = require('multer')

const app = express();
app.use(cors()); // Enable All CORS Requests
const server = app.listen(process.env.PORT || config.port, () => {
  const host = server.address().address
  const port = server.address().port

  console.log(`app listening at http://${host}:${port}`);
});
const sdmConfig = config.SDdb;
app.use('/q', q(sdmConfig, sql));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'public')
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
})

var upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {
     
  upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }
    return res.status(200).send(req.file)

  })

});


