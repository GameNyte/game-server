const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const Model = require('../middleware/models.js');
router.param('model', Model);
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  Bucket: process.env.BUCKET_NAME
});
const uploadsBusinessGallery = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'game-nyte-maps',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
    }
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array('galleryImage', 4);
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}
router.post('/profile-img-upload', (req, res) => {
  uploadsBusinessGallery(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      res.json({ error: error });
    } else {
      if (req.files === undefined) {
        console.log('Error: No File Selected!');
        res.json('Error: No File Selected');
      } else {
        let fileArray = req.files,
          fileLocation;
        const galleryImgLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          console.log('filenm', fileLocation);
          galleryImgLocationArray.push(fileLocation)
        }
        res.json({
          filesArray: fileArray,
          locationArray: galleryImgLocationArray
        });
      }
    }
  })
});

module.exports = router;