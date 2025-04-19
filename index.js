var express = require('express');
var cors = require('cors');
require('dotenv').config()
var bodyParser = require('body-parser')
var app = express();
const multer = require('multer'); 

const fs = require('fs');

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Đường dẫn lưu trữ tệp
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Đặt tên tệp
    cb(null, file.originalname);
  }
});

// Tạo middleware Multer
const upload = multer({ storage: storage });

// Sử dụng middleware Multer trong tuyến đường
// 'upfile' ở đây là key name trong file tạo biểu mẫu html
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    let file = req.file; // Đúng
    console.log(file);
    res.json({
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    });
  });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});