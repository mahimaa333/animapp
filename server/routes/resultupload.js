const cors =  require('cors');
const express = require('express');
const router = express.Router();
const config = require('../config/database');
const db = require('../config/connections');

const AWS = require('aws-sdk');
const multerS3 =  require('multer-s3');
const multer = require('multer');


const BUCKET_NAME = 'animappcareimages';
const IAM_USER_KEY = 'AKIARBVXWLSFCDRA6XCV';
const IAM_USER_SECRET = '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';

router.use(cors()); // CORS error occured for Image result upload

var s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, 'imaging/' + Date.now().toString() + '-' + file.originalname)
      }
    })
  })

  var uploadpractice = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, 'practice/' + Date.now().toString() + '-' + file.originalname)
      }
    })
  })



router.get('/', (req,res) => {
    res.send('Upload works');
});


router.post('/uploadimaging', upload.any(), (req,res) => {
  console.log('entering uploadingimage');
  console.log(req.files[0]);
    const dataimage = {
      attachment: req.files[0].location,
      notes: req.body.notes,
      planimg_id: req.body.planimg_id
    }
    console.log(dataimage);
    let sql1 = "INSERT INTO catalog_imagresult SET ?";
    db.query(sql1, dataimage, (err, result, fields) => {
      if (err) throw err;
      res.json({
        success:true,
        files: req.files,
        planimg_id: req.body.planimg_id,
        diagimag_id: result.insertId
      });
    });
});


router.post('/uploadpracticelogo', uploadpractice.any(), (req,res) => {
    res.json({
      success: true,
      logo:req.files[0].location
    });
})


router.get('/lab/:practice_id/:planlab_id/:diaglab_id/', (req,res) => {
  var practice_id = req.params.practice_id;
  var planlab_id = req.params.planlab_id;
  var diaglab_id = req.params.diaglab_id;
  var fetchResult = {};
  console.log('get lab results api called: planlab_id: ', planlab_id, ' diaglab_id: ', diaglab_id, 'practice_id: ', practice_id);

  let fetchResultSql = `SELECT a.labresult_image, c.*, b.result, b.notes as result_notes, b.labresult_test_id FROM catalog_labresult as a INNER JOIN catalog_labresult_tests as b ON a.labresult_id = b.labresult_id INNER JOIN catalog_lablist as c ON b.lablist_id = c.lablist_id WHERE a.practice_id = ? AND a.planlab_id = ? AND a.diaglab_id = ?`;
  let dateSql = `SELECT timestamp, labresult_image FROM catalog_labresult WHERE practice_id = ? AND planlab_id = ? AND diaglab_id = ?`;
  let sql = `SELECT * FROM catalog_lablist WHERE diaglab_id = ?`;

  let query = db.query(fetchResultSql, [practice_id, planlab_id, diaglab_id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      db.query(dateSql, [practice_id, planlab_id, diaglab_id], (err, date) => {
        if (err) throw err;
        res.json({
          testlist: result,
          view: true,
          date: date[0].timestamp
        });
      });
    } else {
      db.query(sql, diaglab_id, (err, result) => {
        if (err) throw err;
        result.map(item => {
          item['result'] = null;
          item['result_notes'] = item.notes;
        });
        res.json({
          testlist: result,
          firstsave: true
        });
      });
    }
  });
});


router.get('/imaging/:diagimag_id', (req,res) => {
  var planimag_id = req.params.diagimag_id;

  let fetchResultSql = `SELECT * FROM catalog_imagresult WHERE planimg_id=?`;
  let query = db.query(fetchResultSql, planimag_id, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json({
        imagingdata: result,
        view: true
      });
    } else {
      res.json({
        view: false
      });
    }
  });
});



router.post('/lab', (req,res) => {
  console.log('post lab result api called! : ', req.body);
  var testlist = req.body.testlist;
  var firstsave = null;
  req.body.firstsave ? firstsave = true : firstsave = false;
  let labresultSql = `INSERT INTO catalog_labresult SET ?`;
  let labresultTestSql = `INSERT INTO catalog_labresult_tests SET ?`;
  let updatelabresultTestSql = `UPDATE catalog_labresult_tests SET ? WHERE labresult_test_id = ?`;
  if (firstsave) {
    console.log('first save', firstsave);
    db.query(labresultSql, req.body.labresult, (err, result) => {
      if (err) throw err;
      var labresult_id = result.insertId;
      testlist.map(item => {
        var test = {
          result: item.result,
          notes: item.result_notes,
          lablist_id: item.lablist_id,
          labresult_id: labresult_id
        };
        db.query(labresultTestSql, test, (err, result) => {
          if (err) throw err;
        });
      });
      res.json({
        success: true
      });
    });
  }
  // } else {
  //   console.log('not first save', firstsave);
  //   testlist.map(item => {
  //     var test = {
  //       result: item.result,
  //       notes: item.result_notes
  //     };
  //     db.query(labresultTestSql, test, (err, result) => {
  //       if (err) throw err;
  //     });
  //   });
  //   res.sendStatus(200);
  // }
});

module.exports=router;
