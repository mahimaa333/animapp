const express = require('express');
const router = express.Router();
const colors = require('colors');
const axios = require('axios');
const moment = require('moment');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const db = require('../config/connections');

const headers = {
  'Content-Type': 'application/json'
};

router.put('/put/expired/subscription', (req, res) => {
  subscription = req.body.subscription;
  invoice = req.body.subscription_invoice;
  token = req.body.token;
  let insertInvoiceSql = `INSERT INTO rp_invoice SET ?`;
  let updateSql = `UPDATE subscription SET state = ?, current_start = ?, current_end = ? WHERE subscription_id = ?`;
  if (token){
    try {
      jwt.verify(token, config.secret);
      decoded = jwt.decode(token);
    } catch (error) {
      res.send({error: 'Verification failed: Invalid token!'});
    }
    if (decoded) {
      subscription.state = 'active';
      invoice.invoice_number = 'inv_' + 'p' + invoice.practice_id + 'u' + invoice.user_id + new Date().getUTCMilliseconds();
      db.query(insertInvoiceSql, invoice, (err, result) => {
        if (err) throw err;
        db.query(updateSql, [subscription.state, subscription.current_start, subscription.current_end, invoice.subscription_id], (err, result) => {
          if (err) throw err;
        });
      });
      res.send({success: true});
    }
  } else {
    res.send({error: 'Tokken not present!'});
  }
});

router.post('/newuserreg', (req, res) => {
  subscription = req.body.subscription;
  invoice = req.body.subscription_invoice;
  token = req.body.token;
  let insertSql = 'INSERT INTO subscription SET ?';
  let insertInvoiceSql = `INSERT INTO rp_invoice SET ?`;
  let updateSql = `UPDATE subscription SET state = 'active' WHERE subscription_id = ?`;
  if (token){
    try {
      jwt.verify(token, config.secret);
      decoded = jwt.decode(token);
    } catch (error) {
      res.send({error: 'Verification failed: Invalid token!'});
    }
    if (decoded) {
      subscription.subscription_id = 'sub_' + 'p' + subscription.practice_id + 'u' + subscription.user_id + new Date().getUTCMilliseconds();
      subscription.state = 'created';
      invoice.subscription_id = subscription.subscription_id;
      invoice.invoice_number = 'inv_' + 'p' + invoice.practice_id + 'u' + invoice.user_id + new Date().getUTCMilliseconds();
      db.query(insertSql, subscription, (err, result) => {
        if (err) throw err;
      });
      db.query(insertInvoiceSql, invoice, (err, result) => {
        if (err) throw err;
        db.query(updateSql, invoice.subscription_id, (err, result) => {
          if (err) throw err;
        });
      });
      res.send({success: true, subscription_id: invoice.subscription_id});
    }
  } else {
    res.send({error: 'Tokken not present!'});
  }
});

/* router.get('/sub/:subscription_id', (req, res) => {
  var subscription_id = req.params.subscription_id;
  console.log(subscription_id);
  if(subscription_id){
    let sqlsub = `SELECT * FROM rp_subscription WHERE id=?`;
    let query2 = db.query(sqlsub,subscription_id,(err,resultsub, fields) =>{
      let sqlcust = `SELECT * FROM rp_customer WHERE id=?`;
      let query3 = db.query(sqlcust,resultsub[0].customer_id, (err,resultcust, fields) =>{
        let sqlinv = `SELECT * FROM rp_invoice WHERE subscription_id=?`;
        let query4 = db.query(sqlinv,subscription_id,(err,resultinv, fields) => {
          if (resultinv.length) {
            res.json({success: true,
              invoice_details:resultinv,
              subscription_details: resultsub[0],
              customer_details: resultcust[0]
            });
          } else {
            res.json({
              success: false,
              error: 'No Subscription records found for the given subscription id'
            });
          }
        });
      });
    });
  }
}); */

router.post('/subcancel', (req, res) => {
  console.log(req.body.resub)
  const subscription_id = req.body.subscription_id;
  const token = req.body.token;
  const resub = req.body.resub;

  if(resub){
    let sql = 'SELECT state, current_start, current_end FROM subscription WHERE subscription_id = ?';
    db.query(sql,subscription_id, (err, resultdetails) => {
      if (resultdetails.length && (resultdetails[0].state === 'pending')) {
        if (!(moment().isBetween(resultdetails[0].current_start, resultdetails[0].current_end))) {
          let updateSql = `UPDATE subscription SET state = 'pending', sub_active = '1' WHERE subscription_id = ?`;
          db.query(updateSql, subscription_id, (err, result) => {
            if (err) throw err;
          });
          res.send({success: true});
        } else {
          let updateSql = `UPDATE subscription SET state = 'active', sub_active = '1' WHERE subscription_id = ?`;
          db.query(updateSql, subscription_id, (err, result) => {
            if (err) throw err;
          });
          res.send({success: true});
        }
      }
    });
  } else {
    let sql = 'SELECT state, current_start, current_end FROM subscription WHERE subscription_id = ?';
    db.query(sql,subscription_id, (err, resultdetails) => {
      if (resultdetails.length && (resultdetails[0].state === 'active')) {
          let updateSql = `UPDATE subscription SET state = 'pending', sub_active = '0' WHERE subscription_id = ?`;
          db.query(updateSql, subscription_id, (err, result) => {
            if (err) throw err;
          });
          res.send({success: true});
      }
    });
  }


});


// router.post('/subcancel', (req, res) => {
//   const subscription_id = req.body.subscription_id;
//   const token = req.body.token;
//   let updateSql = `UPDATE subscription SET state = 'completed' WHERE subscription_id = ?`;
//   if (token){
//     try {
//       jwt.verify(token, config.secret);
//       decoded = jwt.decode(token);
//     } catch (error) {
//       res.send({error: 'Verification failed: Invalid token!'});
//     }
//     if (decoded) {
//       db.query(updateSql, subscription_id, (err, result) => {
//         if (err) throw err;
//       });
//       res.send({success: true, subscription_id: invoice.subscription_id});
//     }
//   } else {
//     res.send({error: 'Tokken not present!'});
//   }
// });

router.get('/invoice/:user_id/:practice_id', (req, res) => {
  const user_id = req.params.user_id;
  const practice_id = req.params.practice_id;
  let sql = `
  SELECT 
  a.*,
  b.*,
  c.*
  FROM rp_invoice as a
  INNER JOIN user as b ON a.user_id = b.user_id
  INNER JOIN practice as c ON a.practice_id = b.practice_id
  WHERE a.user_id = ? AND a.practice_id = ?`;
  db.query(sql, [user_id, practice_id], (err, result) =>{
    if (err) throw err;
    res.send(result);
  });
});




module.exports=router;