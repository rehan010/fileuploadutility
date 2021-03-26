//
// const express = require('express');
// const app = express();
// const base64Img = require('base64-img');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fs = require('fs');
// const port = 4000;
//
// app.use(cors())
// app.use(express.static('./'))
// app.use(bodyParser.json({ limit: '50mb' }));

// app.post('/upload', (req, res) => {
//   const { file } = req.body;
//   var base_path = ((JSON.parse(JSON.stringify(req.body))).base_path).toString();
//
//   if (base_path.charAt(0) == '/'){
//     base_path = base_path.substring(1);
//   }
//
//   const dir = (base_path).toString();
//   console.log(dir);
//   fs.exists(dir, exist => {
//   if (!exist) {
//       fs.mkdirSync(dir,{ recursive: true },err => {
//         if(err)
//           console.log(err);
//           return err
//       })
//     }});

  // base64Img.img(file, dir, Date.now(), function(err, filepath) {
  //   const pathArr = filepath.split('/')
  //   const fileName = pathArr[pathArr.length - 1];
  //   res.status(200).json({
  //     success: true,
  //     url: 'http://127.0.0.1:'+ port+'/'+filepath
  //   })
  // });

// });

// let buff = new Buffer(data, 'base64');
// fs.writeFileSync('stack-abuse-logo-out.png', buff);


// handle single file upload



// app.post('/uploadfile', (req, res) => {
//    const filename = (JSON.parse(JSON.stringify(req.body))).filename;
//    const base_path = (JSON.parse(JSON.stringify(req.body))).base_path;
//    const base_64 = (JSON.parse(JSON.stringify(req.body))).data;
//    console.log(filename);
//    console.log(base_path);
//    console.log(base_64);
//    const dir = ('./uploads'+base_path).toString();
//    // console.log(dir);
//    // fs.mkdir(dir,{ recursive: true });
//    const fileContents = Buffer.from(base_64, 'base64')
//     fs.writeFile(filename, fileContents, (err) => {
//       if (err) return console.error(err)
//       console.log('file saved to ', filename)
//     });


   // const base_path = JSON.parse(JSON.stringify(req.body));
   // var wstream = fs.createWriteStream('myOutput.txt');
   // wstream.write();
   // wstream.write('Another line\n');
   // wstream.end();
   // if (!file) {
   //    return res.status(400).send({ message: 'Please upload a file.' });
   // }
//    return res.send({ message: 'File uploaded successfully.'});
// });



// request handlers
// app.get('/', (req, res) => {
//    res.send('File upload Api');
// });
//
// app.listen(port, () => {
//    console.log('Server started on: ' + port);
// });



//-----Runing code with form file ------//
var express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
var app = express();
var port = process.env.PORT || 4000;
app.options('*', cors());
// enable CORS
 app.use(cors());

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// serving static files
app.use('/uploads', express.static('uploads'));

// handle storage using multer
const storage = multer.diskStorage({
destination: (req, file, cb) => {
  const base_path = ((JSON.parse(JSON.stringify(req.body))).base_path);
  const artifect_type = ((JSON.parse(JSON.stringify(req.body))).artifect_type);
  const filename = (JSON.parse(JSON.stringify(req.body))).filename;
  const dataFile = req.files;
  const art_type = artifect_type.split(',');
  const dir = ('./uploads'+base_path.split(',')[dataFile.length-1]).toString();
  file['artifect_type'] =art_type[dataFile.length-1];
  fs.exists(dir, exist => {
  if (!exist) {
    return fs.mkdir(dir,{ recursive: true }, error => cb(error, dir))
  }
  return cb(null, dir)
  })
},
filename: (req, file, cb) => {

  cb(null, Date.now()+'-' +file.originalname.replace(/\s+/g, ''));

  // cb(null, file.fieldname + '-' + Date.now());
}
})

const upload = multer({ storage })

// app.post('/uploadfile', upload.single('dataFile'), (req, res, next) => {
//    const file = req.file;
//    const base_path = JSON.parse(JSON.stringify(req.body));
//
//    if (!file) {
//       return res.status(400).send({ message: 'Please upload a file.' });
//    }
//    return res.send({ message: 'File uploaded successfully.', file });
// });


//handle multiple file upload
app.post('/uploadfile',upload.array('dataFiles', 10),  (req, res,next) => {
  try {
   const files = req.files;
   const base_path = JSON.parse(JSON.stringify(req.body)).base_path;
   const artifect_type = JSON.parse(JSON.stringify(req.body)).artifect_type;

   if (!files || (files && files.length === 0)) {
      return res.status(400).send({ message: 'Please upload a file.' });
   }
   // else if (base_path.split(',').length != files.length){
   //   return res.status(400).send({ message: 'base_path length are not same as files' });
   // }
   // else if (artifect_type.split(',').length != files.length){
   //   return res.status(400).send({ message: 'Artifect_type length are not same as files' });
   // }

   files.forEach(function(file) {
   file.path = 'http://51.83.41.210:4000/'+file.path;


});

   return res.send({ message: 'File uploaded successfully.', files });
 }
 catch(error) {
       console.log(error);
        res.send(400);
 }
});
//request handlers
app.get('/', (req, res) => {
   res.send('<h1>File upload Api</h1><br><p>Call /uploadfile for single file upload using params dataFile and filename</p>'
   +'<br><p>Call /uploadmultifile for single file upload using params dataFiles and filename</p>');
});
// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })
app.listen(port, () => {
   console.log('Server started on: ' + port);
});
