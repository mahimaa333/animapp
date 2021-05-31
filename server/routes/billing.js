const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const db = require('../config/connections');


// router.get('/invoicesall/:practice_id/:first/:rows/:status/:pet_parent_id', (req, res) => {
//   var status = req.params.status;
//   var first = parseInt(req.params.first, 10);
//   var rows = parseInt(req.params.rows, 10);
//   var practice_id = req.params.practice_id;
//   var pet_parent_id = req.params.pet_parent_id;
//   let totalRecordsSql;
//   let sql;
//   let totalRecordsArgs = [];
//   let sqlArgs = [];
//   console.log('general status: ', status, pet_parent_id);
//   if (status == 'null' && pet_parent_id === 'undefined') {
//     console.log('sss');
//     totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ?`;
//     sql = `SELECT
//     a.final_discount,
//     SUM(d.payment_amount) as paid,
//     a.invoice_id,
//     a.pet_parent_id,
//     a.patient_id,
//     a.ref,
//     a.date,
//     a.credits,
//     a.payment_type,
//     a.total,
//     a.status,
//     b.name,
//     c.name as patient_name
//   FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
//   INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//   LEFT JOIN patient as c ON a.patient_id = c.patient_id
//   LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
//   GROUP BY invoice_id DESC`;
//     totalRecordsArgs = [practice_id];
//     sqlArgs = [practice_id, first, rows];
//     console.log(sqlArgs);
//   } else if (status !== 'null' && pet_parent_id === 'undefined') {
//     console.log(status);
//     totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND status = ?`;
//     sql = `SELECT
//             a.final_discount,
//             SUM(d.payment_amount) as paid,
//             a.invoice_id,
//             a.pet_parent_id,
//             a.patient_id,
//             a.ref,
//             a.date,
//             a.credits,
//             a.payment_type,
//             a.total,
//             a.status,
//             b.name,
//             c.name as patient_name
//             FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND status = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
//             INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//             LEFT JOIN patient as c ON a.patient_id = c.patient_id
//             LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
//             GROUP BY invoice_id DESC`;
//     totalRecordsArgs = [practice_id, status];
//     sqlArgs = [practice_id, status, first, rows];
//   } else if (status === 'null' && pet_parent_id !== 'undefined') {
//     totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND pet_parent_id = ?`;
//     sql = `SELECT
//     a.final_discount,
//     SUM(d.payment_amount) as paid,
//     a.invoice_id,
//     a.pet_parent_id,
//     a.patient_id,
//     a.ref,
//     a.date,
//     a.credits,
//     a.payment_type,
//     a.total,
//     a.status,
//     b.name,
//     c.name as patient_name
//   FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND pet_parent_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
//   INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//   LEFT JOIN patient as c ON a.patient_id = c.patient_id
//   LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
//   GROUP BY invoice_id DESC`;
//     totalRecordsArgs = [practice_id, pet_parent_id];
//     sqlArgs = [practice_id, pet_parent_id, first, rows];
//   } else if (status !== 'null' && pet_parent_id !== 'undefined') {
//     console.log(status);
//     totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND status = ? AND pet_parent_id = ?`;
//     sql = `SELECT
//             a.final_discount,
//             SUM(d.payment_amount) as paid,
//             a.invoice_id,
//             a.pet_parent_id,
//             a.patient_id,
//             a.ref,
//             a.date,
//             a.credits,
//             a.payment_type,
//             a.total,
//             a.status,
//             b.name,
//             c.name as patient_name
//             FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND status = ? AND pet_parent_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
//             INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//             LEFT JOIN patient as c ON a.patient_id = c.patient_id
//             LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
//             GROUP BY invoice_id DESC`;
//     totalRecordsArgs = [practice_id, status, pet_parent_id];
//     sqlArgs = [practice_id, status, pet_parent_id, first, rows];
//   }
//   console.log(totalRecordsSql);
//   let query = db.query(totalRecordsSql, totalRecordsArgs, (err, result) => {
//     if (err) throw err;
//     console.log('sssrun22');
//     var total_records = result[0].total_records;
//     db.query(sql, sqlArgs, (err, resultnew) => {
//       if (err) throw err;
//       console.log('sssrun');
//       res.send({result: resultnew.length ? resultnew : [{msg: 'No records found!'}], total_records: total_records});
//     });
//   });
// });

router.get('/maininvoices/:practice_id/:first/:rows/:status/:pet_parent_id/:user_id', (req, res) => {
  var status = req.params.status;
  var first = parseInt(req.params.first, 10);
  var rows = parseInt(req.params.rows, 10);
  var practice_id = req.params.practice_id;
  var user_id = req.params.user_id;
  var pet_parent_id = req.params.pet_parent_id;
  let totalRecordsSql;
  let sql;
  let totalRecordsArgs = [];
  let sqlArgs = [];
  console.log('general status: ', status, pet_parent_id, user_id);
  if (status === 'null' && pet_parent_id === 'null' && user_id === 'null') {
    console.log('sss');
    totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ?`;
    sql = `SELECT
    a.final_discount,
    SUM(d.payment_amount) as paid,
    a.invoice_id,
    a.pet_parent_id,
    a.patient_id,
    a.ref,
    a.date,
    a.credits,
    a.payment_type,
    a.total,
    a.status,
    b.name,
    c.name as patient_name
  FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
  INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN patient as c ON a.patient_id = c.patient_id
  LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
  GROUP BY invoice_id 
  ORDER BY invoice_id DESC`;
    totalRecordsArgs = [practice_id];
    sqlArgs = [practice_id, first, rows];
    console.log(sqlArgs);
  } else if (status !== 'null' && pet_parent_id === 'null' && user_id === 'null') {
    console.log(status);
    totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND status = ?`;
    sql = `SELECT
              a.final_discount,
              SUM(d.payment_amount) as paid,
              a.invoice_id,
              a.pet_parent_id,
              a.patient_id,
              a.ref,
              a.date,
              a.payment_type,
              a.total,
              a.status,
              b.name,
              c.name as patient_name
            FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND status = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
            INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
            LEFT JOIN patient as c ON a.patient_id = c.patient_id
            LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
            GROUP BY invoice_id
            ORDER BY invoice_id DESC`;
    totalRecordsArgs = [practice_id, status];
    sqlArgs = [practice_id, status, first, rows];
  } else if (status === 'null' && pet_parent_id !== 'null' && user_id === 'null') {
    totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND pet_parent_id = ?`;
    sql = `SELECT
    a.final_discount,
    SUM(d.payment_amount) as paid,
    a.invoice_id,
    a.pet_parent_id,
    a.patient_id,
    a.ref,
    a.date,
    a.credits,
    a.payment_type,
    a.total,
    a.status,
    b.name,
    c.name as patient_name
  FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND pet_parent_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
  INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN patient as c ON a.patient_id = c.patient_id
  LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
  GROUP BY invoice_id
  ORDER BY invoice_id DESC`;
    totalRecordsArgs = [practice_id, pet_parent_id];
    sqlArgs = [practice_id, pet_parent_id, first, rows];
  } else if (status !== 'null' && pet_parent_id !== 'null' && user_id === 'null') {
    console.log(status);
    totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND status = ? AND pet_parent_id = ?`;
    sql = `SELECT
              a.final_discount,
              SUM(d.payment_amount) as paid,
              a.invoice_id,
              a.pet_parent_id,
              a.patient_id,
              a.ref,
              a.date,
              a.payment_type,
              a.total,
              a.status,
              b.name,
              c.name as patient_name
            FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND status = ? AND pet_parent_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
            INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
            LEFT JOIN patient as c ON a.patient_id = c.patient_id
            LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
            GROUP BY invoice_id
            ORDER BY invoide_id DESC`;
    totalRecordsArgs = [practice_id, status, pet_parent_id];
    sqlArgs = [practice_id, status, pet_parent_id, first, rows];
  } else if (status === 'null' && pet_parent_id === 'null' && user_id !== 'undefined') {
    console.log('sssinsideuserid');
    totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ?`;
    sql = `SELECT
    a.final_discount,
    SUM(d.payment_amount) as paid,
    a.invoice_id,
    a.pet_parent_id,
    a.patient_id,
    a.ref,
    a.date,
    a.credits,
    a.payment_type,
    a.total,
    a.status,
    b.name,
    c.name as patient_name
  FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND user_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
  INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN patient as c ON a.patient_id = c.patient_id
  LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
  GROUP BY invoice_id
  ORDER BY invoice_id DESC`;
    totalRecordsArgs = [practice_id];
    sqlArgs = [practice_id, user_id, first, rows];
    console.log(sqlArgs);
  } else if (status !== 'null' && pet_parent_id === 'null' && user_id !== 'undefined') {
    console.log(status);
    totalRecordsSql = `SELECT COUNT(invoice_id) as total_records FROM invoice WHERE practice_id = ? AND status = ?`;
    sql = `SELECT
              a.final_discount,
              SUM(d.payment_amount) as paid,
              a.invoice_id,
              a.pet_parent_id,
              a.patient_id,
              a.ref,
              a.date,
              a.payment_type,
              a.total,
              a.status,
              b.name,
              c.name as patient_name
            FROM (SELECT invoice_id FROM invoice WHERE practice_id = ? AND status = ? AND user_id = ? ORDER BY invoice_id DESC LIMIT ?, ? ) o JOIN invoice as a ON a.invoice_id = o.invoice_id
            INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
            LEFT JOIN patient as c ON a.patient_id = c.patient_id
            LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
            GROUP BY invoice_id
            ORDER BY invoide_id DESC`;
    totalRecordsArgs = [practice_id, status];
    sqlArgs = [practice_id, status, user_id, first, rows];
  }
  console.log(totalRecordsSql);
  let query = db.query(totalRecordsSql, totalRecordsArgs, (err, result) => {
    if (err) throw err;
    console.log('sssrun22');
    var total_records = result[0].total_records;
    db.query(sql, sqlArgs, (err, resultnew) => {
      if (err) throw err;
      console.log('sssrun');
      res.send({ result: resultnew.length ? resultnew : [{ msg: 'No records found!' }], total_records: total_records });
    });
  });
});




// router.get('/returninvoices/:practice_id/:first/:rows/:status/:pet_parent_id', (req, res) => {
//   console.log('get returninvoices api called');
//   var pet_parent_id = req.params.pet_parent_id;
//   var status = req.params.status;
//   var first = parseInt(req.params.first, 10);
//   var rows = parseInt(req.params.rows, 10);
//   var practice_id = req.params.practice_id;
//   let totalRecordsSql;
//   let sql;
//   let totalRecordsArgs = [];
//   let sqlArgs = [];
//   if (status === 'null' && pet_parent_id !== 'null') {
//     totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND pet_parent_id = ?`;
//     sql = `SELECT
//               a.final_discount,
//               NULL as paid,
//               a.return_invoice_id,
//               a.pet_parent_id,
//               a.patient_id,
//               a.ref,
//               a.date,
//               a.payment_type,
//               a.total,
//               a.status,
//               b.name,
//               c.name as patient_name
//               FROM return_invoice as a
//               INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//               LEFT JOIN patient as c ON a.patient_id = c.patient_id
//               WHERE a.practice_id = ? AND a.pet_parent_id = ?
//               GROUP BY return_invoice_id DESC
//               LIMIT ?, ?`;
//     totalRecordsArgs = [practice_id, pet_parent_id];
//     sqlArgs = [practice_id, pet_parent_id, first, rows];
//   } else if (status === 'null' && pet_parent_id === 'null') {
//     totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ?`;
//     sql = `SELECT
//               a.final_discount,
//               NULL as paid,
//               a.return_invoice_id,
//               a.pet_parent_id,
//               a.patient_id,
//               a.ref,
//               a.date,
//               a.payment_type,
//               a.total,
//               a.status,
//               b.name,
//               c.name as patient_name
//               FROM return_invoice as a
//               INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//               LEFT JOIN patient as c ON a.patient_id = c.patient_id
//               WHERE a.practice_id = ?
//               GROUP BY return_invoice_id DESC
//               LIMIT ?, ?`;
//       totalRecordsArgs = [practice_id];
//       sqlArgs = [practice_id, first, rows];
//     } else if (status !== 'null' && pet_parent_id === 'null') {
//       totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND status = ?`;
//       sql = `SELECT
//                 a.final_discount,
//                 NULL as paid,
//                 a.return_invoice_id,
//                 a.pet_parent_id,
//                 a.patient_id,
//                 a.ref,
//                 a.date,
//                 a.payment_type,
//                 a.total,
//                 a.status,
//                 b.name,
//                 c.name as patient_name
//               FROM return_invoice as a
//               INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//               LEFT JOIN patient as c ON a.patient_id = c.patient_id
//               WHERE a.practice_id = ? AND a.status = ?
//               GROUP BY return_invoice_id DESC
//               LIMIT ?, ?`;
//       totalRecordsArgs = [practice_id, status];
//       sqlArgs = [practice_id, status, first, rows];
//     } else if (status !== 'null' && pet_parent_id !== 'null') {
//       totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND status = ? AND pet_parent_id = ?`;
//       sql = `SELECT
//                 a.final_discount,
//                 NULL as paid,
//                 a.return_invoice_id,
//                 a.pet_parent_id,
//                 a.patient_id,
//                 a.ref,
//                 a.date,
//                 a.payment_type,
//                 a.total,
//                 a.status,
//                 b.name,
//                 c.name as patient_name
//               FROM return_invoice as a
//               INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//               LEFT JOIN patient as c ON a.patient_id = c.patient_id
//               WHERE a.practice_id = ? AND a.status = ? AND a.pet_parent_id = ?
//               GROUP BY return_invoice_id DESC
//               LIMIT ?, ?`;
//       totalRecordsArgs = [practice_id, status, pet_parent_id];
//       sqlArgs = [practice_id, status, pet_parent_id, first, rows];
//     }
//     // console.log(sql, sqlArgs);
//     let query = db.query(totalRecordsSql, totalRecordsArgs, (err, result) => {
//       if (err) throw err;
//       var total_records = result[0].total_records;
//       db.query(sql, sqlArgs, (err, result) => {
//         if (err) throw err;
//         res.send({result: result.length ? result : [{msg: 'No records found!'}], total_records: total_records});
//       });
//     });
//   });


router.get('/returninvoices/:practice_id/:user_id/:first/:rows/:status/:pet_parent_id', (req, res) => {
  console.log('get returninvoices api called');
  var pet_parent_id = req.params.pet_parent_id;
  var status = req.params.status;
  var first = parseInt(req.params.first, 10);
  var rows = parseInt(req.params.rows, 10);
  var user_id = req.params.user_id;
  var practice_id = req.params.practice_id;
  let totalRecordsSql;
  let sql;
  let totalRecordsArgs = [];
  let sqlArgs = [];


  if (status === 'null' && pet_parent_id !== 'null' && user_id === 'null') {
    totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND pet_parent_id = ?`;
    sql = `SELECT
              a.final_discount,
              NULL as paid,
              a.return_invoice_id,
              a.pet_parent_id,
              a.patient_id,
              a.ref,
              a.date,
              a.payment_type,
              a.total,
              a.status,
              b.name,
              c.name as patient_name
              FROM return_invoice as a
              INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
              LEFT JOIN patient as c ON a.patient_id = c.patient_id
              WHERE a.practice_id = ? AND a.pet_parent_id = ?
              GROUP BY return_invoice_id
              ORDER BY return_invoice_id DESC
              LIMIT ?, ?`;
    totalRecordsArgs = [practice_id, pet_parent_id];
    sqlArgs = [practice_id, pet_parent_id, first, rows];
  } else if (status === 'null' && pet_parent_id === 'null' && user_id === 'null') {
    totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ?`;
    sql = `SELECT
              a.final_discount,
              NULL as paid,
              a.return_invoice_id,
              a.pet_parent_id,
              a.patient_id,
              a.ref,
              a.date,
              a.payment_type,
              a.total,
              a.status,
              b.name,
              c.name as patient_name
              FROM return_invoice as a
              INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
              LEFT JOIN patient as c ON a.patient_id = c.patient_id
              WHERE a.practice_id = ?
              GROUP BY return_invoice_id
              ORDER BY return_invoice_id DESC
              LIMIT ?, ?`;
    totalRecordsArgs = [practice_id];
    sqlArgs = [practice_id, first, rows];
  } else if (status !== 'null' && pet_parent_id === 'null' && user_id === 'null') {
    totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND status = ?`;
    sql = `SELECT
                a.final_discount,
                NULL as paid,
                a.return_invoice_id,
                a.pet_parent_id,
                a.patient_id,
                a.ref,
                a.date,
                a.payment_type,
                a.total,
                a.status,
                b.name,
                c.name as patient_name
              FROM return_invoice as a
              INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
              LEFT JOIN patient as c ON a.patient_id = c.patient_id
              WHERE a.practice_id = ? AND a.status = ?
              GROUP BY return_invoice_id 
              ORDER BY return_invoide_id DESC
              LIMIT ?, ?`;
    totalRecordsArgs = [practice_id, status];
    sqlArgs = [practice_id, status, first, rows];
  } else if (status !== 'null' && pet_parent_id !== 'null' && user_id === 'null') {
    totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND status = ? AND pet_parent_id = ?`;
    sql = `SELECT
                a.final_discount,
                NULL as paid,
                a.return_invoice_id,
                a.pet_parent_id,
                a.patient_id,
                a.ref,
                a.date,
                a.payment_type,
                a.total,
                a.status,
                b.name,
                c.name as patient_name
              FROM return_invoice as a
              INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
              LEFT JOIN patient as c ON a.patient_id = c.patient_id
              WHERE a.practice_id = ? AND a.status = ? AND a.pet_parent_id = ?
              GROUP BY return_invoice_id 
              ORDER BY return_invoice_id DESC
              LIMIT ?, ?`;
    totalRecordsArgs = [practice_id, status, pet_parent_id];
    sqlArgs = [practice_id, status, pet_parent_id, first, rows];
  } else if (status === 'null' && pet_parent_id === 'null' && user_id !== 'undefined') {
    totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ?`;
    sql = `SELECT
                a.final_discount,
                NULL as paid,
                a.return_invoice_id,
                a.pet_parent_id,
                a.patient_id,
                a.ref,
                a.date,
                a.payment_type,
                a.total,
                a.status,
                b.name,
                c.name as patient_name
                FROM return_invoice as a
                INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
                LEFT JOIN patient as c ON a.patient_id = c.patient_id
                WHERE a.practice_id = ? AND a.user_id = ?
                GROUP BY return_invoice_id
                ORDER BY return_invoice_id DESC
                LIMIT ?, ?`;
    totalRecordsArgs = [practice_id];
    sqlArgs = [practice_id, user_id, first, rows];
  } else if (status !== 'null' && pet_parent_id === 'null' && user_id !== 'undefined') {
    totalRecordsSql = `SELECT COUNT(return_invoice_id) as total_records FROM return_invoice WHERE practice_id = ? AND status = ?`;
    sql = `SELECT
                a.final_discount,
                NULL as paid,
                a.return_invoice_id,
                a.pet_parent_id,
                a.patient_id,
                a.ref,
                a.date,
                a.payment_type,
                a.total,
                a.status,
                b.name,
                c.name as patient_name
              FROM return_invoice as a
              INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
              LEFT JOIN patient as c ON a.patient_id = c.patient_id
              WHERE a.practice_id = ? AND a.user_id = ? AND a.status = ?
              GROUP BY return_invoice_id 
              ORDER BY return_invoice_id DESC
              LIMIT ?, ?`;
    totalRecordsArgs = [practice_id, status];
    sqlArgs = [practice_id, user_id, status, first, rows];
  }
  // console.log(sql, sqlArgs);
  let query = db.query(totalRecordsSql, totalRecordsArgs, (err, result) => {
    if (err) throw err;
    var total_records = result[0].total_records;
    db.query(sql, sqlArgs, (err, result) => {
      if (err) throw err;
      res.send({ result: result.length ? result : [{ msg: 'No records found!' }], total_records: total_records });
    });
  });
});




router.get('/invoicesallclient/:practice_id/:pet_parent_id', (req, res) => {
  console.log('dsaf asdf a sfd');
  var practice_id = req.params.practice_id;
  var pet_parent_id = req.params.pet_parent_id;
  let sqlArgs = [];
  let sql = `SELECT
              a.final_discount,
              SUM(d.payment_amount) as paid,
              a.invoice_id,
              a.pet_parent_id,
              a.patient_id,
              a.ref,
              a.date,
              a.credits,
              a.payment_type,
              a.total,
              a.status,
              b.name,
              c.name as patient_name
            FROM invoice as a
            INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
            LEFT JOIN patient as c ON a.patient_id = c.patient_id
            LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
            WHERE a.practice_id = ? AND a.pet_parent_id = ?
            GROUP BY invoice_id`;
  sqlArgs = [practice_id, pet_parent_id];
  db.query(sql, sqlArgs, (err, result) => {
    if (err) throw err;
    res.send({
      success: true,
      result: result
    });
  });
});

function deletePreventiveCare(invoice_id) {
  const deletePreventiveCare = new Promise((resolve, reject) => {
    console.log('working on deleting of preventive care');
    let sql = `SELECT preventive_id, practice_id, user_id, patient_id  FROM invoice WHERE invoice_id = ?`;
    let deletePC = `DELETE FROM preventive_care WHERE preventive_id = ?`;
    let selectPCVacc = `SELECT pc_vaccine_id FROM pc_vaccination WHERE preventive_id = ?`;
    let deletePCVacc = `DELETE FROM pc_vaccination WHERE pc_vaccine_id = ?`;
    let query = db.query(sql, invoice_id, (err, result) => {
      if (err) throw err;
      if (result[0].preventive_id) {
        var practice_id = result[0].practice_id;
        var user_id = result[0].user_id;
        var patient_id = result[0].patient_id;
        var preventive_id = result[0].preventive_id;
        // db.query(deletePC, preventive_id, (err, result) => {
        // if (err) throw err;
        db.query(selectPCVacc, preventive_id, (err, resultcheckpres) => {
          resultcheckpres.map(itempres => {
            let sqldata = 'SELECT * FROM `record_consumables` WHERE pc_vaccine_id=?';
            db.query(sqldata, itempres.pc_vaccine_id, (err, resultcheck) => {
              if (err) throw err;
              resultcheck.map(item => {
                console.log(resultcheck);
                let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
                let consumeSql = `INSERT INTO consumed_stock SET ?`;
                let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
                let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
                let consumed = {
                  consumed_stocklevel: item.quantity,
                  practice_id: practice_id,
                  user_id: user_id,
                  item_id: item.item_id,
                  itemstock_id: item.itemstock_id,
                  status: 'deleted',
                  recordconsume_id: item.recordconsume_id,

                  name: item.name,
                  batch_no: item.batch_no,
                  c_quantity: item.c_quantity,
                  unit: item.stock_unit,
                  total: item.total,
                  patient_id: patient_id
                };
                db.query(consumeSql, consumed, (err, result) => {
                  if (err) throw err;
                  db.query(stockSql, [item.quantity, item.itemstock_id], (err, result) => {
                    if (err) throw err;
                    db.query(updateItemSql, [item.quantity, item.item_id], (err, result) => {
                      if (err) throw err;
                      db.query(sqldelete, item.recordconsume_id, (err, resultcheck) => {
                        if (err) throw err;
                      });
                    });
                  });
                });
              });
            });
            // db.query(deletePCVacc, itempres.pc_vaccine_id, (err, resultcheck) => {
            //   if (err) throw err;
            // });
          });
          if (err) throw err;
          resolve({ preventive_id: preventive_id });
        });
        // });
      } else {
        resolve();
      }
    });
  });
  return deletePreventiveCare;
}




// function deletePreventiveCare(invoice_id) {
//   const deletePreventiveCare = new Promise((resolve, reject) => {
//     console.log('working on deleting of preventive care');
//     let sql = `SELECT preventive_id, practice_id, user_id, patient_id  FROM invoice WHERE invoice_id = ?`;
//     let deletePC = `DELETE FROM preventive_care WHERE preventive_id = ?`;
//     let selectPCVacc = `SELECT pc_vaccine_id FROM pc_vaccination WHERE preventive_id = ?`;
//     let deletePCVacc = `DELETE FROM pc_vaccination WHERE pc_vaccine_id = ?`;
//     let query = db.query(sql, invoice_id, (err, result) => {
//       if (err) throw err;
//       if (result[0].preventive_id) {
//         var practice_id = result[0].practice_id;
//         var user_id = result[0].user_id;
//         var patient_id = result[0].patient_id;
//         var preventive_id = result[0].preventive_id;
//         db.query(deletePC, preventive_id, (err, result) => {
//           if (err) throw err;
//           db.query(selectPCVacc, preventive_id, (err, resultcheckpres) => {
//             resultcheckpres.map(itempres => {
//               let sqldata = 'SELECT * FROM `record_consumables` WHERE pc_vaccine_id=?';
//               db.query(sqldata, itempres.pc_vaccine_id, (err, resultcheck) => {
//                 if (err) throw err;
//                 resultcheck.map(item => {
//                   console.log(resultcheck);
//                   let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
//                   let consumeSql = `INSERT INTO consumed_stock SET ?`;
//                   let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
//                   let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
//                   let consumed = {
//                     consumed_stocklevel: item.quantity,
//                     practice_id: practice_id,
//                     user_id: user_id,
//                     item_id: item.item_id,
//                     itemstock_id: item.itemstock_id,
//                     status: 'deleted',
//                     recordconsume_id: item.recordconsume_id,

//                     name: item.name,
//                     batch_no: item.batch_no,
//                     c_quantity: item.c_quantity,
//                     unit: item.stock_unit,
//                     total: item.total,
//                     patient_id: patient_id
//                   };
//                   db.query(consumeSql, consumed, (err, result) => {
//                     if (err) throw err;
//                     db.query(stockSql, [item.quantity, item.itemstock_id], (err, result) => {
//                       if (err) throw err;
//                       db.query(updateItemSql, [item.quantity, item.item_id], (err, result) => {
//                         if (err) throw err;
//                         db.query(sqldelete, item.recordconsume_id, (err, resultcheck) => {
//                           if (err) throw err;
//                         });
//                       });
//                     });
//                   });
//                 });
//               });
//               db.query(deletePCVacc, itempres.pc_vaccine_id, (err, resultcheck) => {
//                 if (err) throw err;
//               });
//             });
//             if (err) throw err;
//             resolve({ preventive_id: preventive_id });
//           });
//         });
//       } else {
//         resolve();
//       }
//     });
//   });
//   return deletePreventiveCare;
// }

function deletePlanning(invoice_id) {
  const deletePlanning = new Promise((resolve, reject) => {
    console.log('working on deleting of planning');
    let sql = `SELECT plan_id, practice_id, user_id, patient_id FROM invoice WHERE invoice_id = ?`;
    let getPlanningsSql = `SELECT procedure_id, planimg_id, planlab_id, recordconsume_id FROM invoice_items WHERE invoice_id = ?
    AND procedure_id IS NOT NULL OR planimg_id IS NOT NULL OR planlab_id IS NOT NULL`;
    let deleteProcSql = `DELETE FROM plan_procedures WHERE procedure_id = ?`;
    let deleteLabSql = `DELETE FROM plan_lab WHERE planlab_id = ?`;
    let deleteImgSql = `DELETE FROM plan_imaging WHERE planimg_id = ?`;

    let sql4 = 'SELECT * FROM `record_consumables` WHERE plan_id=?';
    let sql5 = 'SELECT * FROM `plan_treatments` WHERE plan_id=? AND recordconsume_id = 0';
    let query = db.query(sql, invoice_id, (err, result) => {
      if (err) throw err;
      if (result[0].plan_id) {
        var plan_id = result[0].plan_id;
        var practice_id = result[0].practice_id;
        var user_id = result[0].user_id;
        var patient_id = result[0].patient_id;
        let query = db.query(getPlanningsSql, invoice_id, (err, result) => {
          if (err) throw err;
          result.map(item => {
            if (item.procedure_id) {
              // db.query(deleteProcSql, item.procedure_id, (err, result) => {
              //   if (err) throw err;
              // });
            } else if (item.planlab_id) {
              // db.query(deleteLabSql, item.planlab_id, (err, result) => {
              //   if (err) throw err;
              // });
            } else if (item.recordconsume_id) {
              let sqldata = 'SELECT * FROM `record_consumables` WHERE recordconsume_id=?';
              db.query(sqldata, item.recordconsume_id, (err, resultcheck) => {
                if (err) throw err;
                let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
                let consumeSql = `INSERT INTO consumed_stock SET ?`;
                let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
                let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
                let consumed = {
                  consumed_stocklevel: resultcheck[0].quantity,
                  practice_id: practice_id,
                  user_id: user_id,
                  item_id: resultcheck[0].item_id,
                  itemstock_id: resultcheck[0].itemstock_id,
                  status: 'deleted',
                  recordconsume_id: resultcheck[0].recordconsume_id,

                  name: resultcheck[0].name,
                  batch_no: resultcheck[0].batch_no,
                  c_quantity: resultcheck[0].c_quantity,
                  unit: resultcheck[0].stock_unit,
                  total: resultcheck[0].total,
                  patient_id: patient_id
                };
                db.query(consumeSql, consumed, (err, result) => {
                  if (err) throw err;
                  db.query(stockSql, [resultcheck[0].quantity, resultcheck[0].itemstock_id], (err, result) => {
                    if (err) throw err;
                    db.query(updateItemSql, [resultcheck[0].quantity, resultcheck[0].item_id], (err, result) => {
                      if (err) throw err;
                      db.query(sqldelete, item.recordconsume_id, (err, resultcheck) => {
                        if (err) throw err;
                      });
                    });
                  });
                });
              });
            } else if (item.planimg_id) {
              // db.query(deleteImgSql, item.planimg_id, (err, result) => {
              //   if (err) throw err;
              // });
            }
          });

          let sqldata = 'SELECT * FROM `record_consumables` WHERE plan_id=?';
          db.query(sqldata, plan_id, (err, resultcheck) => {
            if (err) throw err;
            resultcheck.map(item => {
              console.log(resultcheck);
              let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
              let consumeSql = `INSERT INTO consumed_stock SET ?`;
              let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
              let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
              let consumed = {
                consumed_stocklevel: item.quantity,
                practice_id: practice_id,
                user_id: user_id,
                item_id: item.item_id,
                itemstock_id: item.itemstock_id,
                status: 'deleted',
                recordconsume_id: item.recordconsume_id,

                name: item.name,
                batch_no: item.batch_no,
                c_quantity: item.c_quantity,
                unit: item.stock_unit,
                total: item.total,
                patient_id: patient_id
              };
              db.query(consumeSql, consumed, (err, result) => {
                if (err) throw err;
                db.query(stockSql, [item.quantity, item.itemstock_id], (err, result) => {
                  if (err) throw err;
                  db.query(updateItemSql, [item.quantity, item.item_id], (err, result) => {
                    if (err) throw err;
                    db.query(sqldelete, item.recordconsume_id, (err, resultcheck) => {
                      if (err) throw err;
                    });
                  });
                });
              });
            });
          });
          resolve({ plan_id: plan_id });
        });
      } else {
        resolve();
      }
    });
  });
  return deletePlanning;
}

// function deletePlanning(invoice_id) {
//   const deletePlanning = new Promise((resolve, reject) => {
//     console.log('working on deleting of planning');
//     let sql = `SELECT plan_id, practice_id, user_id, patient_id FROM invoice WHERE invoice_id = ?`;
//     let getPlanningsSql = `SELECT procedure_id, planimg_id, planlab_id, recordconsume_id FROM invoice_items WHERE invoice_id = ?
//     AND procedure_id IS NOT NULL OR planimg_id IS NOT NULL OR planlab_id IS NOT NULL`;
//     let deleteProcSql = `DELETE FROM plan_procedures WHERE procedure_id = ?`;
//     let deleteLabSql = `DELETE FROM plan_lab WHERE planlab_id = ?`;
//     let deleteImgSql = `DELETE FROM plan_imaging WHERE planimg_id = ?`;

//     let sql4 = 'SELECT * FROM `record_consumables` WHERE plan_id=?';
//     let sql5 = 'SELECT * FROM `plan_treatments` WHERE plan_id=? AND recordconsume_id = 0';
//     let query = db.query(sql, invoice_id, (err, result) => {
//       if (err) throw err;
//       if (result[0].plan_id) {
//         var plan_id = result[0].plan_id;
//         var practice_id = result[0].practice_id;
//         var user_id = result[0].user_id;
//         var patient_id = result[0].patient_id;
//         let query = db.query(getPlanningsSql, invoice_id, (err, result) => {
//           if (err) throw err;
//           result.map(item => {
//             if (item.procedure_id) {
//               db.query(deleteProcSql, item.procedure_id, (err, result) => {
//                 if (err) throw err;
//               });
//             } else if (item.planlab_id) {
//               db.query(deleteLabSql, item.planlab_id, (err, result) => {
//                 if (err) throw err;
//               });
//             } else if (item.recordconsume_id) {
//               let sqldata = 'SELECT * FROM `record_consumables` WHERE recordconsume_id=?';
//               db.query(sqldata, item.recordconsume_id, (err, resultcheck) => {
//                 if (err) throw err;
//                 let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
//                 let consumeSql = `INSERT INTO consumed_stock SET ?`;
//                 let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
//                 let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
//                 let consumed = {
//                   consumed_stocklevel: resultcheck[0].quantity,
//                   practice_id: practice_id,
//                   user_id: user_id,
//                   item_id: resultcheck[0].item_id,
//                   itemstock_id: resultcheck[0].itemstock_id,
//                   status: 'deleted',
//                   recordconsume_id: resultcheck[0].recordconsume_id,

//                   name: resultcheck[0].name,
//                   batch_no: resultcheck[0].batch_no,
//                   c_quantity: resultcheck[0].c_quantity,
//                   unit: resultcheck[0].stock_unit,
//                   total: resultcheck[0].total,
//                   patient_id: patient_id
//                 };
//                 db.query(consumeSql, consumed, (err, result) => {
//                   if (err) throw err;
//                   db.query(stockSql, [resultcheck[0].quantity, resultcheck[0].itemstock_id], (err, result) => {
//                     if (err) throw err;
//                     db.query(updateItemSql, [resultcheck[0].quantity, resultcheck[0].item_id], (err, result) => {
//                       if (err) throw err;
//                       db.query(sqldelete, item.recordconsume_id, (err, resultcheck) => {
//                         if (err) throw err;
//                       });
//                     });
//                   });
//                 });
//               });
//             } else if (item.planimg_id) {
//               db.query(deleteImgSql, item.planimg_id, (err, result) => {
//                 if (err) throw err;
//               });
//             }
//           });

//           let sqldata = 'SELECT * FROM `record_consumables` WHERE plan_id=?';
//           db.query(sqldata, plan_id, (err, resultcheck) => {
//             if (err) throw err;
//             resultcheck.map(item => {
//               console.log(resultcheck);
//               let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
//               let consumeSql = `INSERT INTO consumed_stock SET ?`;
//               let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
//               let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
//               let consumed = {
//                 consumed_stocklevel: item.quantity,
//                 practice_id: practice_id,
//                 user_id: user_id,
//                 item_id: item.item_id,
//                 itemstock_id: item.itemstock_id,
//                 status: 'deleted',
//                 recordconsume_id: item.recordconsume_id,

//                 name: item.name,
//                 batch_no: item.batch_no,
//                 c_quantity: item.c_quantity,
//                 unit: item.stock_unit,
//                 total: item.total,
//                 patient_id: patient_id
//               };
//               db.query(consumeSql, consumed, (err, result) => {
//                 if (err) throw err;
//                 db.query(stockSql, [item.quantity, item.itemstock_id], (err, result) => {
//                   if (err) throw err;
//                   db.query(updateItemSql, [item.quantity, item.item_id], (err, result) => {
//                     if (err) throw err;
//                     db.query(sqldelete, item.recordconsume_id, (err, resultcheck) => {
//                       if (err) throw err;
//                     });
//                   });
//                 });
//               });
//             });
//           });
//           resolve({ plan_id: plan_id });
//         });
//       } else {
//         resolve();
//       }
//     });
//   });
//   return deletePlanning;
// }

// router.delete('/:invoice_id', (req, res) => {
//   var invoice_id = req.params.invoice_id;
//   let deleteItemsSql = `DELETE FROM invoice_items WHERE invoice_id = ?`;
//   let sql = `DELETE FROM invoice WHERE invoice_id = ?`;
//   // deletePreventiveCare(invoice_id);
//   // deletePlanning(invoice_id)
//   new Promise.all([deletePreventiveCare(invoice_id), deletePlanning(invoice_id)]).then(values => {
//     console.log('inside the invoice');
//     const selectSql = `SELECT plan_id, preventive_id FROM invoice WHERE invoice_id = ?`;
//     db.query(selectSql, invoice_id, (err, result) => {
//       console.log(result[0]);
//       if (result[0].plan_id) {
//         const recordSql = `UPDATE record SET preventive_id = NULL, plan_id = NULL WHERE plan_id = ?`;
//         db.query(recordSql, result[0].plan_id, (err, result) => {
//           if (err) throw err;
//           let query = db.query(deleteItemsSql, invoice_id, (err, result) => {
//             if (err) throw err;
//             db.query(sql, invoice_id, (err, result) => {
//               if (err) throw err;
//               console.log('00000000000000000000000000000000000000000000000000000000000000000', result)
//               res.send(result);
//             });
//           });
//         });
//       } else if (result[0].preventive_id) {
//         const recordSql = `UPDATE record SET preventive_id = NULL, plan_id = NULL WHERE preventive_id = ?`;
//         db.query(recordSql, result[0].preventive_id, (err, result) => {
//           if (err) throw err;
//           let query = db.query(deleteItemsSql, invoice_id, (err, result) => {
//             if (err) throw err;
//             db.query(sql, invoice_id, (err, result) => {
//               if (err) throw err;
//               console.log('00000000000000000000000000000000000000000000000000000000000000000', result);
//               res.send(result);
//             });
//           });
//         });
//       }
//     });
//   });
// });

router.delete("/:invoice_id", (req, res) => {
  var invoice_id = req.params.invoice_id;
  let sql = `UPDATE invoice SET status = 'Deleted' WHERE invoice_id = ?`;
  db.query(sql, invoice_id, (err, result) => {
    if (err) throw err;
    new Promise.all([deletePreventiveCare(invoice_id), deletePlanning(invoice_id)]).then(values => {
      console.log('00000000000000000000000000000000000000000000000000000000000000000', result);
      res.send(result);
    });
  });
});

// router.get('/getpretotal/:pet_parent_id/:invoice_id', (req, res) => {
//   var pet_parent_id = req.params.pet_parent_id;
//   var invoice_id = req.params.invoice_id;
//   let pretotalSql = `SELECT b.outstanding, b.credit FROM invoice AS a INNER JOIN payment AS b ON a.invoice_id = b.invoice_id WHERE a.pet_parent_id = ? ORDER BY b.payment_id DESC LIMIT 1`;
//   let totalUpdateSql = `UPDATE invoice SET total = ? WHERE invoice_id = ?`;
//   let query = db.query(pretotalSql, pet_parent_id, (err, result) => {
//     if (err) throw err;
//     if(result.length > 0)
//     {
//       if (result[0].outstanding) {
//         let total = result[0].outstanding;
//         db.query(totalUpdateSql, [total, invoice_id], (err, result) => {
//           if (err) throw err;
//           res.send({total: total});
//         });
//       } else if (result[0].credit) {
//         let total = result[0].credit * -1;
//         db.query(totalUpdateSql, [total, invoice_id], (err, result) => {
//           if (err) throw err;
//           res.send({total: total});
//         });
//       } else {
//         let total = 0;
//         db.query(totalUpdateSql, [total, invoice_id], (err, result) => {
//           if (err) throw err;
//           res.send({total: total});
//         });
//       }
//     } else {
//       let total = 0;
//       res.send({total: total});
//     }
//   });
// });
router.delete('/deletereturninvoice/:return_invoice_id', (req, res) => {
  let return_invoice_id = req.params.return_invoice_id;
  let deleteItemsSql = `DELETE FROM return_invoice_items WHERE return_invoice_id = ?`;
  let deleteRISql = `DELETE FROM return_invoice WHERE return_invoice_id = ?`;
  let invoiceIdSql = `SELECT linked_invoice FROM return_invoice WHERE return_invoice_id = ?`;
  db.query(invoiceIdSql, return_invoice_id, (err, result) => {
    if (err) throw err;
    invoice_id = result[0].linked_invoice;
    db.query(deleteItemsSql, return_invoice_id, (err, result) => {
      if (err) throw err;
      db.query(deleteRISql, [return_invoice_id], (err, result) => {
        if (err) throw err;
        res.send({ invoice_id: invoice_id });
      });
    });
  });
});

function RINumberGenerator(invoicePrefix, substr, practice_id, return_invoice_id) {
  const RINumberGenerator = new Promise((resolve, reject) => {
    // check and change the sql
    let refSql = `SELECT COUNT(return_invoice_id) + 1 as counter FROM return_invoice WHERE ref LIKE ? AND practice_id=?`;
    db.query(refSql, ['%' + substr + '%', practice_id], (err, result) => {
      if (err) throw err;
      var practice_id_str = prefixZeroes(practice_id, 2);
      var counter_str = prefixZeroes(result[0].counter, 4);
      var invoiceNumber = invoicePrefix + practice_id_str + substr + counter_str;
      resolve(invoiceNumber);
    });
  })
  return RINumberGenerator;
}

router.post('/addrefund/:return_invoice_id/:status/:returnAmount/:total/:substr/:practice_id/:user_id', (req, res) => {
  let substr = req.params.substr;
  let total = req.params.total;
  let practice_id = req.params.practice_id;
  let user_id = req.params.user_id;
  let RIPay = req.body;
  let return_invoice_id = req.params.return_invoice_id;
  let status = req.params.status;
  console.log('status: ', status);
  let returnAmount = req.params.returnAmount;
  let invoiceIdSql = `SELECT linked_invoice FROM return_invoice WHERE return_invoice_id = ?`;
  let statusPISql = `UPDATE invoice SET status = 'Paid' WHERE invoice_id = ?`;
  let selectRIItemsSql = `SELECT quantity, itemstock_id, item_id FROM return_invoice_items WHERE return_invoice_id = ?`;
  let statusRISql = `UPDATE return_invoice SET status = 'Refund', ref = ?, total = ?, payment_type = ? WHERE return_invoice_id = ?`;
  let addPayRISql = `INSERT INTO return_payment SET ?`;
  let updateItemStockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
  let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
  let consumeSql = `INSERT INTO consumed_stock SET ?`;
  let finalRIItemsSql = `SELECT * FROM return_invoice_items WHERE return_invoice_id = ?`;
  db.query(selectRIItemsSql, return_invoice_id, (err, result) => {
    if (err) throw err;
    if (result.length) {
      result.map(item => {
        if (item.itemstock_id) {
          db.query(updateItemStockSql, [item.quantity, item.itemstock_id], (err, result) => {
            if (err) throw err;
            db.query(updateItemSql, [item.quantity, item.item_id], (err, result) => {
              if (err) throw err;
              let consumed = {
                consumed_stocklevel: item.quantity,
                practice_id: practice_id,
                user_id: user_id,
                item_id: item.item_id,
                itemstock_id: item.itemstock_id,
                status: 'returned'
              };
              db.query(consumeSql, consumed, (err, result) => {
                if (err) throw err;
              });
            });
          });
        }
      })
    }
  });
  console.log('status checking'.red, status);
  if (status === 'paid') {
    db.query(invoiceIdSql, return_invoice_id, (err, result) => {
      if (err) throw err;
      let invoice_id = result[0].linked_invoice;
      db.query(statusPISql, [invoice_id], (err, result) => {
        if (err) throw err;
      });
    });
  }

  RINumberGenerator('RI:', substr, practice_id, return_invoice_id).then(data => {
    db.query(addPayRISql, [RIPay], (err, result) => {
      if (err) throw err;
      const RIPayId = result.insertId;
      db.query(statusRISql, [data, total, RIPay.type, return_invoice_id], (err, result) => {
        if (err) throw err;
        db.query(finalRIItemsSql, [return_invoice_id], (err, result) => {
          if (err) throw err;
          res.send({ status: 'Refund', items: result, ref: data, payment_type: RIPay.type });
        });
      });
    });
  });
});


router.post('/validatereturninvoice/:return_invoice_id/:returnAmount/:total/:substr/:practice_id/:PIStatus/:user_id', (req, res) => {
  let user_id = req.params.user_id;
  let total = req.params.total;
  let PIStatus = req.params.PIStatus;
  let substr = req.params.substr;
  let practice_id = req.params.practice_id;
  let RIPay = req.body;
  let return_invoice_id = req.params.return_invoice_id;
  let returnAmount = req.params.returnAmount;
  let currentdate = moment().format('YYYY-MM');
  let currentdate_from = currentdate + '-01';
  let currentdate_to = currentdate + '-' + moment().format('DD');
  // let currentdate = moment().format('YYYY-MM-DD');
  let invoiceIdSql = `SELECT linked_invoice FROM return_invoice WHERE return_invoice_id = ?`;
  let statusPISql = `UPDATE invoice SET status = 'Paid' WHERE invoice_id = ?`;
  let addPayPISql = `INSERT INTO payment SET ?`;
  let selectPaySql = `select * from payment left join invoice on invoice.invoice_id = payment.invoice_id where invoice.practice_id = ? and payment.date >= ? and payment.date <= ?`;
  let selectRIItemsSql = `SELECT quantity, itemstock_id, item_id FROM return_invoice_items WHERE return_invoice_id = ?`;
  let statusRISql = `UPDATE return_invoice SET status = 'Validated', ref = ?, total = ? WHERE return_invoice_id = ?`;
  let addPayRISql = `INSERT INTO return_payment SET ?`;
  let updateItemStockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
  let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
  let consumeSql = `INSERT INTO consumed_stock SET ?`;
  let finalRIItemsSql = `SELECT * FROM return_invoice_items WHERE return_invoice_id = ?`;
  db.query(selectRIItemsSql, return_invoice_id, (err, result) => {
    if (err) throw err;
    if (result.length) {
      result.map(item => {
        if (item.itemstock_id) {
          db.query(updateItemStockSql, [item.quantity, item.itemstock_id], (err, result) => {
            if (err) throw err;
            db.query(updateItemSql, [item.quantity, item.item_id], (err, result) => {
              if (err) throw err;
              let consumed = {
                consumed_stocklevel: item.quantity,
                practice_id: practice_id,
                user_id: user_id,
                item_id: item.item_id,
                itemstock_id: item.itemstock_id,
                status: 'returned'
              };
              db.query(consumeSql, consumed, (err, result) => {
                if (err) throw err;
              });
            });
          });
        }
      })
    }
  });

  if (PIStatus === 'change') {
    db.query(invoiceIdSql, return_invoice_id, (err, result) => {
      if (err) throw err;
      let invoice_id = result[0].linked_invoice;
      db.query(statusPISql, [invoice_id], (err, result) => {
        if (err) throw err;
      });
    });
  } else {
    db.query(invoiceIdSql, return_invoice_id, (err, result) => {
      if (err) throw err;
      let invoice_id = result[0].linked_invoice;
      db.query(selectPaySql, [practice_id, currentdate_from, currentdate_to], (err, result) => {
        if (err) throw err;
        let pn_ref = 'PR-' + prefixZeroes(practice_id, 2) + '-' + moment(currentdate, 'YYYY-MM').format('YY') + '' + moment(currentdate, 'YYYY-MM').format('MM') + '-' + prefixZeroes((result.length + 1), 4);
        let PIPay = {
          pn_ref: pn_ref,
          date: RIPay.date,
          type: 'Return',
          payment_amount: total,
          outstanding: returnAmount,
          invoice_id: invoice_id
        }
        db.query(addPayPISql, [PIPay], (err, result) => {
          if (err) throw err;
        });
      });
    });
  }

  RINumberGenerator('RI:', substr, practice_id, return_invoice_id).then(data => {
    db.query(addPayRISql, [RIPay], (err, result) => {
      if (err) throw err;
      const RIPayId = result.insertId;
      db.query(statusRISql, [data, total, return_invoice_id], (err, result) => {
        if (err) throw err;
        db.query(finalRIItemsSql, [return_invoice_id], (err, result) => {
          if (err) throw err;
          res.send({ status: 'Validated', items: result, ref: data, payment_type: RIPay.type });
        });
      });
    });
  });
});


router.get('/returninvoiceitems/:invoice_id', (req, res) => {
  let invoice_id = req.params.invoice_id;
  // let creditSql = `SELECT outstanding FROM payment WHERE invoice_id = ? AND type != 'Return' ORDER BY payment_id DESC LIMIT 1`;
  let creditSql = `SELECT outstanding
                  FROM payment
                  WHERE invoice_id = ? AND
                  (type = 'Cash'
                  OR type = 'Cheque'
                  OR type = 'Debit Card'
                  OR type = 'Credit Card'
                  OR type = 'IMPS'
                  OR type = 'NEFT'
                  OR type = 'RTGS'
                  OR type = 'Wallet'
                  OR type IS NULL
                  OR type = 'bycash'
                  OR type = 'byvisa'
                  OR type = 'bycheck'
                  OR type = 'excesspayment'
                  OR type = 'returnitem'
                  OR type = 'bymastercard'
                  OR type = 'advancepayment'
                  OR type = 'byelectronicwire'
                  OR type = 'adjustmentpayment'
                  OR type = 'bycredit/debitcard'
                  OR type = 'bycheque'
                  OR type = 'byonlinebanktransfer'
                ) ORDER BY payment_id DESC LIMIT 1`;
  let detailsSql = `SELECT
                    a.linked_invoice,
                    a.ref,
                    a.date,
                    a.payment_type,
                    a.status,
                    a.timestamp,
                    b.name,
                    b.mobile_no,
                    b.email_id,
                    c.age_dob,
                    a.pet_parent_id,
                    c.name as pet_name,
                    c.patient_id,
                    d.ref as invoice_ref,
                    ROUND(d.total - (CASE WHEN d.final_discount THEN d.final_discount ELSE 0 END)) as final_total,
                    d.final_discount,
                    d.credits,
                    concat(e.clinic_id_name,'-',c.clinic_id) as patient_clinic_id
                    FROM return_invoice as a
                    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
                    LEFT JOIN patient as c ON a.patient_id = c.patient_id
                    INNER JOIN invoice as d ON a.linked_invoice = d.invoice_id
                    LEFT JOIN practice as e ON a.practice_id = e.practice_id
                    WHERE a.return_invoice_id = ?`;
  let invoiceItemsSql = `SELECT a.*, NULL as edit
            FROM invoice_items as a
            WHERE a.invoice_id = ?
            ORDER BY invoice_item_id ASC`;
  let retInvoiceItemsSql = `SELECT a.*
                            FROM return_invoice_items as a
                            WHERE a.return_invoice_id = ?
                            ORDER BY a.return_invoice_item_id ASC`;
  let query = db.query(detailsSql, invoice_id, (err, result) => {
    if (err) throw err;
    const details = result[0];
    const linked_invoice = result[0].linked_invoice;
    const status = result[0].status;
    db.query(creditSql, [linked_invoice], (err, result) => {
      if (err) throw err;
      let outstanding = result.length ? result[0].outstanding : null;
      if (status === 'Draft') {
        db.query(invoiceItemsSql, [linked_invoice], (err, result) => {
          console.log('inside if');
          if (err) throw err;
          let invoiceItems = result;
          db.query(retInvoiceItemsSql, [invoice_id], (err, result) => {
            if (err) throw err;
            if (result.length) {
              invoiceItems.map(item => {
                const retItem = result.find(retItem => retItem.linked_invoice_item === item.invoice_item_id);
                if (retItem) {
                  item['checked'] = true;
                  item['return_qty'] = retItem.quantity;
                } else {
                  item['checked'] = false;
                  item['return_qty'] = 0;
                }
              });
              res.send({
                success: true,
                details: details,
                status: status,
                items: invoiceItems,
                outstanding: outstanding
              });
            } else {
              invoiceItems.map(item => {
                item['checked'] = false;
                item['return_qty'] = 0;
              });
              res.send({
                success: true,
                details: details,
                status: status,
                items: invoiceItems,
                outstanding: outstanding
              });
            }
          });
        });
      } else {
        console.log('inside else');
        db.query(retInvoiceItemsSql, [invoice_id], (err, result) => {
          if (err) throw err;
          res.send({
            success: true,
            details: details,
            status: status,
            items: result,
            outstanding: outstanding
          });
        });
      }
    });
  });
});

// *************** CHECK
router.get("/items/:invoice_id", (req, res) => {
  let invoice_id = req.params.invoice_id;
  // let previousPay = `SELECT
  //                   payment.outstanding,
  //                   payment.credit
  //                   FROM invoice INNER JOIN
  //                     (select invoice_id,
  //                     max(outstanding) as outstanding,
  //                     min(credit) as credit
  //                     from payment
  //                     WHERE credit IS NOT NULL OR outstanding IS NOT NULL
  //                     GROUP BY invoice_id) as payment ON (invoice.invoice_id = payment.invoice_id)
  //                   WHERE invoice.invoice_id != 75 AND invoice.patient_id = 6 AND invoice.status = 'Credit' OR invoice.status = 'Outstanding' GROUP BY invoice.invoice_id DESC`;
  let creditSql = `SELECT outstanding FROM payment WHERE invoice_id = ? ORDER BY payment_id DESC LIMIT 1`;
  let detailsSql = `SELECT a.ref,
                    a.date,
                    a.payment_type,
                    a.status,
                    a.timestamp,
                    b.name,
                    b.mobile_no,
                    b.email_id,
                    c.age_dob,
                    a.pet_parent_id,
                    c.name as pet_name,
                    c.patient_id,
                    d.return_invoice_id,
                    d.ref as return_ref,
                    concat(e.clinic_id_name,'-',c.clinic_id) as patient_clinic_id
                    FROM invoice as a
                    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
                    LEFT JOIN patient as c ON a.patient_id = c.patient_id
                    LEFT JOIN return_invoice as d ON a.invoice_id = d.linked_invoice
                    LEFT JOIN practice as e ON a.practice_id = e.practice_id
                    WHERE a.invoice_id = ?`;
  let discountSql = `SELECT status, discount, discount_relative FROM invoice WHERE invoice_id = ?`;
  let creditcheck = `SELECT status, credits FROM invoice WHERE invoice_id = ?`;
  let itemsSql = `(SELECT a.*
            FROM invoice_items as a
            WHERE a.invoice_id = ?)
            UNION
            (SELECT a.*
            FROM invoice_items as a
            WHERE a.invoice_id = ? AND a.item_id is NULL AND a.itemstock_id is NULL)
            ORDER BY invoice_item_id ASC`;
  let annotateSql = `SELECT linked_invoice_item, quantity as return_qty FROM return_invoice_items WHERE return_invoice_id = ?`;
  let query = db.query(detailsSql, invoice_id, (err, result) => {
    if (err) throw err;
    var details = result[0];
    var pet_parent_id = result[0].pet_parent_id;
    db.query(discountSql, invoice_id, (err, result) => {
      if (err) throw err;
      var status = result[0].status;
      var discount = {
        value: result[0].discount,
        relative: result[0].discount_relative
      };
      db.query(creditcheck, invoice_id, (err, resultcredit) => {
        if (err) throw err;
        var credits = resultcredit[0].credits;
        db.query(itemsSql, [invoice_id, invoice_id], (err, result) => {
          if (err) throw err;
          var items = result;
          db.query(creditSql, invoice_id, (err, result) => {
            if (err) throw err;
            var outstanding = result;
            if (details.return_invoice_id) {
              db.query(
                annotateSql,
                details.return_invoice_id,
                (err, result) => {
                  if (err) throw err;
                  if (result.length) {
                    result.map(retItem => {
                      const index = items.findIndex(
                        item =>
                          item.invoice_item_id === retItem.linked_invoice_item
                      );
                      if (index >= 0) {
                        items[index]["return"] = true;
                        items[index]["return_qty"] = retItem.return_qty;
                      }
                    });
                    res.send({
                      details: details,
                      discount: discount,
                      credits: credits,
                      items: items,
                      status: status,
                      outstanding: outstanding.length
                        ? outstanding[0].outstanding
                        : null
                    });
                  }
                }
              );
            } else {
              res.send({
                details: details,
                discount: discount,
                credits: credits,
                items: items,
                status: status,
                outstanding: outstanding.length
                  ? outstanding[0].outstanding
                  : null
              });
            }
          });
        });
      });
    });
  });
});


router.post('/addreturninvoiceitem', (req, res) => {
  var returnInvoiceItem = req.body;
  let preSql = `SELECT return_invoice_item_id FROM return_invoice_items WHERE return_invoice_id = ? AND linked_invoice_item = ?`;
  let insertSql = `INSERT INTO return_invoice_items SET ?`;
  let updateSql = `UPDATE return_invoice_items SET quantity = ?, total = ? WHERE return_invoice_item_id = ?`;
  db.query(preSql, [returnInvoiceItem.return_invoice_id, returnInvoiceItem.linked_invoice_item], (err, result) => {
    if (err) throw err;
    if (result.length) {
      const return_invoice_item_id = result[0].return_invoice_item_id;
      db.query(updateSql, [returnInvoiceItem.quantity, returnInvoiceItem.total, return_invoice_item_id], (err, result) => {
        if (err) throw err;
        res.send({ return_invoice_item_id: return_invoice_item_id });
      });
    } else {
      db.query(insertSql, returnInvoiceItem, (err, result) => {
        if (err) throw err;
        res.send({ return_invoice_item_id: result.insertId });
      });
    }
  });
});
////////////*****************************TEST CHANGES FOR POSTING AND INSERTING INDIVIDUAL DISCOUNT *****************************************//////////////////////
router.post('/testaddreturninvoiceitem', (req, res) => {
  var returnInvoiceItem = req.body;
  console.log(returnInvoiceItem)
  let preSql = `SELECT return_invoice_item_id FROM return_invoice_items WHERE return_invoice_id = ? AND linked_invoice_item = ?`;
  let insertSql = `INSERT INTO return_invoice_items SET ?`;
  let updateSql = `UPDATE return_invoice_items SET quantity = ?, total = ?, individual_discount = ?, final_discount = ? WHERE return_invoice_item_id = ?`;
  let updateDisSql = `UPDATE return_invoice SET final_discount = CASE WHEN final_discount IS NULL THEN 0 ELSE final_discount END + ? WHERE return_invoice_id = ?`;
  let discountSql = 
  db.query(preSql, [returnInvoiceItem.return_invoice_id, returnInvoiceItem.linked_invoice_item], (err, result) => {
    if (err) throw err;
    if (result.length) {
      const return_invoice_item_id = result[0].return_invoice_item_id;
      db.query(updateSql, [returnInvoiceItem.quantity, returnInvoiceItem.total,returnInvoiceItem.individual_discount,returnInvoiceItem.final_discount, return_invoice_item_id], (err, result) => {
        if (err) throw err;
        db.query(updateDisSql,[returnInvoiceItem.final_discount, returnInvoiceItem.return_invoice_id], (err, result) => {
          if (err) throw err;
        res.send({ return_invoice_item_id: return_invoice_item_id });
      });
    });
    } else {
      db.query(insertSql, returnInvoiceItem, (err, result) => {
        if (err) throw err;
        const return_invoice_item_id = result.insertId;
        db.query(updateDisSql,[returnInvoiceItem.final_discount, returnInvoiceItem.return_invoice_id], (err, result) => {
          if (err) throw err;
        res.send({ return_invoice_item_id: return_invoice_item_id });
        });
      });
    }
  });
});

///////*************************************************************************************************/
router.delete('/deletereturninvoiceitem/:return_invoice_id/:linked_invoice_item', (req, res) => {
  const return_invoice_id = req.params.return_invoice_id;
  const linked_invoice_item = req.params.linked_invoice_item;
  let preSql = `SELECT return_invoice_item_id, final_discount FROM return_invoice_items WHERE return_invoice_id = ? AND linked_invoice_item = ?`;
  let deleteSql = `DELETE FROM return_invoice_items WHERE return_invoice_item_id = ?`;
  let updateDisSql = `UPDATE return_invoice SET final_discount = CASE WHEN final_discount IS NULL THEN 0 ELSE final_discount END - ? WHERE return_invoice_id = ?`;
  db.query(preSql, [return_invoice_id, linked_invoice_item], (err, result) => {
    if (err) throw err;
    if (result.length) {
      const return_invoice_item_id = result[0].return_invoice_item_id;
      const final_discount = result[0].final_discount;
      console.log(final_discount,".....................test");
      db.query(deleteSql, [return_invoice_item_id], (err, result) => {
        if (err) throw err;
        db.query(updateDisSql,[final_discount, return_invoice_id], (err, result) => {
          if (err) throw err;
        res.send({ return_invoice_item_id: return_invoice_item_id });
      });
    });
    } else {
      res.send({ return_invoice_item_id: 'Item not present.' });
    }
  });
});

//////*****************************FUN NOT USED YET******************************************** */
router.post('/returninvoice', (req, res) => {
  var returnInvoice = req.body;
  let sql = `INSERT INTO return_invoice SET ?`;
  db.query(sql, returnInvoice, (err, result) => {
    if (err) throw err;
    res.send({ return_invoice_id: result.insertId });
  });
});



router.post('/createdraft', (req, res) => {
  // var draft = req.body;
  // let lastSql = 'SELECT invoice_id FROM invoice ORDER BY invoice_id DESC LIMIT 1';
  // let sql = `INSERT INTO invoice SET ?`;
  // let query = db.query(lastSql, draft, (err, result) => {
  //   if (err) throw err;
  //   draft.ref = 'Draft';
  //   db.query(sql, draft, (err, result) => {
  //     if (err) throw err;
  //     res.send({invoice_id: result.insertId});
  //   });
  // });
  var draft = req.body;
  putParentPractice(draft.pet_parent_id, draft.practice_id).then((data) => {
    let lastSql = 'SELECT invoice_id FROM invoice ORDER BY invoice_id DESC LIMIT 1';
    let sql = `INSERT INTO invoice SET ?`;
    let wsDataSql = `SELECT
  a.invoice_id,
  a.status,
  a.ref,
  b.name as parentname,
  (CASE WHEN d.role = 'Receptionist' THEN NULL
    ELSE d.name
  END) as doctorname,
  a.practice_id,
  a.user_id,
  a.date
  FROM invoice as a
  LEFT JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN user as d ON a.user_id = d.user_id
  WHERE invoice_id = ?`;
    let query = db.query(lastSql, draft, (err, result) => {
      if (err) throw err;
      // draft.ref = 'Draft';
      // draft.ref = 'IN:02-1806-0054';

      db.query(sql, draft, (err, result) => {
        if (err) throw err;
        let invoice_id = result.insertId;
        db.query(wsDataSql, invoice_id, (err, result) => {
          if (err) throw err;
          console.log('DraftDraftDraftDraftDraftDraftDraftDraftDraft');
          // socketIO.emit('invoice', result.length ? result[0] : null);
          if (draft.ref == 'Draft' && result[0].ref == 'Draft') {
            console.log('DraftDraftDraftDraftDraftDraftDraftDraftDraft');
            const substr = moment(result[0].date).format('-YYMM-');
            invoiceNumberGenerator('IN:', substr, draft.practice_id, invoice_id, result[0].ref).then(data => {
              res.send({ invoice_id: invoice_id });
            });
          } else {
            res.send({ invoice_id: invoice_id });
          }
        });
      });
    });
  });
});



// router.post('/createdraft', (req, res) => {
//   var draft = req.body;
//   putParentPractice(draft.pet_parent_id, draft.practice_id).then((data) => {
//     let lastSql = 'SELECT invoice_id FROM invoice ORDER BY invoice_id DESC LIMIT 1';
//     let sql = `INSERT INTO invoice SET ?`;
//     let query = db.query(lastSql, draft, (err, result) => {
//       if (err) throw err;
//       draft.ref = 'Draft';
//       db.query(sql, draft, (err, result) => {
//         if (err) throw err;
//         res.send({invoice_id: result.insertId});
//       });
//     });
//   });
// });


function putParentPractice(pet_parent_id, practice_id) {
  const promise = new Promise((resolve, reject) => {
    console.log(pet_parent_id, practice_id);
    let sql = 'SELECT * FROM pet_parent_practice WHERE pet_parent_id = ? AND practice_id = ?';
    let query = db.query(sql, [pet_parent_id, practice_id], (err, result) => {
      if (result.length) {
        let sql = 'UPDATE pet_parent_practice SET active = 1 WHERE pet_parent_id = ? AND practice_id = ?';
        let query = db.query(sql, [pet_parent_id, practice_id], (err, resultinsert) => {
          if (err) throw err;
          resolve(true);
        });
      } else {
        console.log('second table filled');
        resolve(true);
      }
    });
  });
  return promise;
}


router.post('/additem', (req, res) => {
  var item = req.body;
  var total = parseFloat((item.quantity * item.retail_price) + ((item.quantity * item.retail_price) * (item.tax / 100)));
  let repeatSql = `SELECT invoice_item_id FROM invoice_items WHERE item_id = ? AND itemstock_id = ? AND vaccination = ? AND invoice_id = ?`;
  let updateItemSql = `UPDATE invoice_items SET total = total + ?, quantity = quantity + ? WHERE invoice_item_id = ?`;
  let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
  let sql = `INSERT INTO invoice_items SET ?`;
  let query = db.query(repeatSql, [item.item_id, item.itemstock_id, item.vaccination, item.invoice_id], (err, result) => {
    if (err) throw err;
    if (result.length !== 0) {
      let invoice_item_id = result[0].invoice_item_id;
      db.query(updateItemSql, [item.retail_price, item.quantity, invoice_item_id], (err, result) => {
        if (err) throw err;
        db.query(updateSql, [total, item.invoice_id], (err, result) => {
          if (err) throw err;
          res.send({ invoice_item_id: invoice_item_id });
        });
      });
    } else {
      db.query(sql, item, (err, result) => {
        if (err) throw err;
        let invoice_item_id = result.insertId;
        db.query(updateSql, [total, item.invoice_id], (err, result) => {
          if (err) throw err;
          res.send({ invoice_item_id: invoice_item_id });
        });
      });
    }
  });

});

//***********************************TEST FUN FOR POST AND UPDATE OF INVOICE ITEMS****************************************************************/
router.post('/testadditem', (req, res) => {
  console.log(req.body,"test...................")
  var item = req.body;
  var total = parseFloat((item.quantity * item.retail_price) + (((item.quantity * item.retail_price)-item.final_discount) * (item.tax / 100)));
  let repeatSql = `SELECT invoice_item_id FROM invoice_items WHERE item_id = ? AND itemstock_id = ? AND vaccination = ? AND invoice_id = ?`;
  let updateItemSql = `UPDATE invoice_items SET total = ?, quantity =  ?, individual_discount_relative = ?, individual_discount = ?, final_discount = ? WHERE invoice_item_id = ?`;
  let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
  let updateDisSql = `UPDATE invoice SET final_discount = CASE WHEN final_discount IS NULL THEN 0 ELSE final_discount END + ? WHERE invoice_id = ?`;
  let sql = `INSERT INTO invoice_items SET ?`;
  let query = db.query(repeatSql, [item.item_id, item.itemstock_id, item.vaccination, item.invoice_id], (err, result) => {
    if (err) throw err;
    console.log(result,"test....");
    if (result.length !== 0) {
      let invoice_item_id = result[0].invoice_item_id;
      db.query(updateItemSql, [item.retail_price, item.quantity,item.individual_discount_relative,item.individual_discount,item.final_discount, invoice_item_id], (err, result) => {
        if (err) throw err;
        db.query(updateSql, [total, item.invoice_id], (err, result) => {
          if (err) throw err;
          db.query(updateDisSql, [item.final_discount,item.invoice_id],(err, result)=>{
            if(err) throw err;
          res.send({ invoice_item_id: invoice_item_id });
          });
        });
      });
    } else {
      db.query(sql, item, (err, result) => {
        if (err) throw err;
        let invoice_item_id = result.insertId;
        db.query(updateSql, [total, item.invoice_id], (err, result) => {
          if (err) throw err;
          db.query(updateDisSql, [item.final_discount,item.invoice_id],(err, result)=>{
            if(err) throw err;
            res.send({ invoice_item_id: invoice_item_id });
          });
        });
      });
    }
  });

});
/*************************************************************************************************** */

router.post('/updateinvoiceprev', (req, res) => {
  var preventive_id = req.body.preventive_id;
  var invoice_id = req.body.invoice_id;
  let updateSql = `UPDATE invoice SET preventive_id = ? WHERE invoice_id = ?`;
  db.query(updateSql, [preventive_id, invoice_id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.post('/deleteitem/:invoice_item_id', (req, res) => {
  var item = req.body;
  var invoice_item_id = req.params.invoice_item_id;
  var total = parseFloat((item.quantity * item.retail_price) + ((item.quantity * item.retail_price) * (item.tax / 100)));
  console.log('total: ', total, invoice_item_id, item);
  let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
  let sql = `DELETE FROM invoice_items WHERE invoice_item_id = ?`;
  let query = db.query(sql, invoice_item_id, (err, result) => {
    if (err) throw err;
    db.query(updateSql, [total, item.invoice_id], (err, result) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});
//////***********************************************TEST FOR DELETE FUN*************************************************/
router.post('/testdeleteitem/:invoice_item_id', (req, res) => {
  var item = req.body;
  var invoice_item_id = req.params.invoice_item_id;
  var total = parseFloat((item.quantity * item.retail_price) + (((item.quantity * item.retail_price)-item.final_discount) * (item.tax / 100)));
  console.log('total: ', total, invoice_item_id, item);
  let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
  let sql = `DELETE FROM invoice_items WHERE invoice_item_id = ?`;
  let updateDisSql = `UPDATE invoice SET final_discount = CASE WHEN final_discount IS NULL THEN 0 ELSE final_discount END - ? WHERE invoice_id = ?`;
  let query = db.query(sql, invoice_item_id, (err, result) => {
    if (err) throw err;
    db.query(updateSql, [total, item.invoice_id], (err, result) => {
      if (err) throw err;
      db.query(updateDisSql, [item.final_discount, item.invoice_id], (err, result)=>{
        if (err) throw err;
        res.sendStatus(200);
      });
    });
  });
});
////************************************************************************************* */
router.put('/updatesingleitem/:invoice_item_id', (req, res) => {
  var item = req.body;
  var invoice_item_id = req.params.invoice_item_id;
  let sqlselect = `SELECT * FROM invoice_items WHERE invoice_item_id = ?`;
  let queryselect = db.query(sqlselect, invoice_item_id, (err, result) => {
    var totalprevious = parseFloat((result[0].quantity * result[0].retail_price) + ((result[0].quantity * result[0].retail_price) * (result[0].tax / 100)));
    let updateSqlprevious = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
    db.query(updateSqlprevious, [totalprevious, item.invoice_id], (err, result) => {
      var total = parseFloat((item.quantity * item.retail_price) + ((item.quantity * item.retail_price) * (item.tax / 100)));
      var totalinvoiceitems = parseFloat(item.quantity * item.retail_price);
      console.log(totalinvoiceitems);
      let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
      let sql = `UPDATE invoice_items SET quantity =  ?, retail_price = ?, total = ? WHERE invoice_item_id = ?`;
      let query = db.query(sql, [item.quantity, item.retail_price, totalinvoiceitems, invoice_item_id], (err, result) => {
        if (err) throw err;
        db.query(updateSql, [total, item.invoice_id], (err, result) => {
          if (err) throw err;
          res.json({
            success: true
          })
        });
      });
    });
  });
});
//********************************************TEST FUN FOR SINGLE UPDATE************************************************************/
router.put('/testupdatesingleitem/:invoice_item_id', (req, res) => {
  var item = req.body;
  var invoice_item_id = req.params.invoice_item_id;
  let sqlselect = `SELECT * FROM invoice_items WHERE invoice_item_id = ?`;
  let queryselect = db.query(sqlselect, invoice_item_id, (err, result) => {
    console.log(result,"first result");
    var finaldiscountprevious = result[0].final_discount;
    console.log(finaldiscountprevious,"finaltest");
    var totalprevious = parseFloat((result[0].quantity * result[0].retail_price) + (((result[0].quantity * result[0].retail_price)-result[0].final_discount) * (result[0].tax / 100)));
    let updateSqlprevious = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
    let updateSqldisprevious = `UPDATE invoice SET final_discount = CASE WHEN final_discount IS NULL THEN 0 ELSE final_discount END - ? WHERE invoice_id = ?`;
    db.query(updateSqlprevious, [totalprevious, item.invoice_id], (err, result) => {
      db.query(updateSqldisprevious, [finaldiscountprevious, item.invoice_id],(err,result)=>{
      var total = parseFloat((item.quantity * item.retail_price) + (((item.quantity * item.retail_price)-item.final_discount) * (item.tax / 100)));
      var totalinvoiceitems = parseFloat(item.quantity * item.retail_price);
      console.log(totalinvoiceitems,"test data");
      let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
      let updateDisSql = `UPDATE invoice SET final_discount = CASE WHEN final_discount IS NULL THEN 0 ELSE final_discount END + ? WHERE invoice_id = ?`;
      let sql = `UPDATE invoice_items SET quantity =  ?, retail_price = ?, total = ?, individual_discount_relative = ?, individual_discount = ?, final_discount = ?  WHERE invoice_item_id = ?`;
      let query = db.query(sql, [item.quantity, item.retail_price, totalinvoiceitems, item.individual_discount_relative,item.individual_discount,item.final_discount, invoice_item_id], (err, result) => {
        if (err) throw err;
        db.query(updateSql, [total, item.invoice_id], (err, result) => {
          if (err) throw err;
          db.query(updateDisSql,[item.final_discount, item.invoice_id],(err,result) => {
            if (err) throw err;
          res.json({
            success: true
          });
        });
        });
        });
      });
    });
  });
});
//*************************************************************************************************/
router.delete('/deleteproc/:procedure_id', (req, res) => {
  let deleteproc = 'DELETE FROM plan_procedures WHERE procedure_id = ?';
  let query = db.query(deleteproc, req.params.procedure_id, (err, result) => {
    if (err) throw err;
    res.json({
      success: true
    })
  });
});

router.delete('/deletelab/:planlab_id', (req, res) => {
  let deletelab = 'DELETE FROM plan_lab WHERE planlab_id = ?';
  let query = db.query(deletelab, req.params.planlab_id, (err, result) => {
    if (err) throw err;
    res.json({
      success: true
    })
  });
});

router.delete('/deleteimag/:planimg_id', (req, res) => {
  let deleteimag = 'DELETE FROM plan_imaging WHERE planimg_id = ?';
  let query = db.query(deleteimag, req.params.planimg_id, (err, result) => {
    if (err) throw err;
    res.json({
      success: true
    })
  });
});

router.put('/updatediscount/:invoice_id', (req, res) => {
  var final_discount = 0;
  var invoice_id = req.params.invoice_id;
  var discount = req.body.value;
  var discount_relative = req.body.relative;
  console.log(discount,discount_relative,"test...........................");
  let updateTotalSql = '';
  if (discount_relative) {
    final_discount = discount / 100;
    updateTotalSql = 'UPDATE invoice SET final_discount = ((CASE WHEN total THEN total ELSE 0 END) * ?) WHERE invoice_id = ?';
  } else {
    final_discount = discount;
    updateTotalSql = 'UPDATE invoice SET final_discount = ? WHERE invoice_id = ?';
  }
  let sql = `UPDATE invoice SET discount = ?, discount_relative = ? WHERE invoice_id = ?`;
  let query = db.query(sql, [discount, discount_relative, invoice_id], (err, result) => {
    if (err) throw err;
    db.query(updateTotalSql, [final_discount, invoice_id], (err, result) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});


router.get('/getdiscount/:invoice_id', (req, res) => {
  var invoice_id = req.params.invoice_id;
  let getdiscount = 'select * from invoice WHERE invoice_id = ?';
  let query = db.query(getdiscount, invoice_id, (err, result) => {
    if (err) throw err;
    res.send({ final_discount: result[0].final_discount, discount: result[0].discount });
  });
});
/////////////////////////////////////////////////////////////////////////////////
router.get('/getdiscountreturnInvoice/:return_invoice_id', (req, res) => {
  var return_invoice_id = req.params.return_invoice_id;
  let getdiscount = 'select * from return_invoice WHERE return_invoice_id = ?';
  let query = db.query(getdiscount, return_invoice_id, (err, result) => {
    if (err) throw err;
    res.send({ final_discount: result[0].final_discount });
  });
});
////////////////////////////////////////////////////////////
function prefixZeroes(num, width) {
  var prefix;
  prefix = prefix || '0';
  num = num + '';
  return num.length >= width ? num : new Array(width - num.length + 1).join(prefix) + num;
}

function preventiveCare(invoice_id, ref) {
  console.log('i_id: ', invoice_id, 'ref: ', ref);
  let getPreventiveSql = 'SELECT preventive_id FROM invoice WHERE invoice_id = ?';
  let getItemsSql = `SELECT * FROM pc_vaccination WHERE preventive_id = ?`;
  let addPcVaccinationSql = `INSERT INTO pc_history SET ?`;
  let deletePreventiveSql = `DELETE FROM preventive_care WHERE preventive_id = ?`;
  if (ref.indexOf('Draft') !== -1) {
    let query = db.query(getPreventiveSql, invoice_id, (err, result) => {
      if (err) throw err;
      var preventive_id = result[0].preventive_id;
      if (preventive_id) {
        db.query(getItemsSql, preventive_id, (err, result) => {
          if (err) throw err;
          var items = result;
          if (result.length === 0) {
            db.query(deletePreventiveSql, preventive_id, (err, result) => {
              if (err) throw err;
            });
          } else {
            for (let i = 0; i < items.length; i++) {
              console.log(items[i]);
              var pc_vaccination = {
                type_care: items[i].treatment,
                treatment: items[i].vaccination,
                preventive_id: preventive_id
              };
              db.query(addPcVaccinationSql, pc_vaccination, (err, result) => {
                if (err) throw err;
              });
            }
          }
        });
      }
    });
  }
}

function invoiceNumberGenerator(invoicePrefix, substr, practice_id, invoice_id, ref) {
  const invoiceNumberGenerator = new Promise((resolve, reject) => {
    let refSql = `SELECT COUNT(invoice_id) + 1 as counter FROM invoice WHERE ref LIKE ? AND practice_id=?`;
    let statusSql = `SELECT ref FROM invoice WHERE invoice_id = ?`;
    let updateSql = `UPDATE invoice SET ref = ? WHERE invoice_id = ?`;
    if (ref.indexOf('Draft') !== -1) {
      db.query(refSql, ['%' + substr + '%', practice_id], (err, result) => {
        if (err) throw err;
        var practice_id_str = prefixZeroes(practice_id, 2);
        var counter_str = prefixZeroes(result[0].counter, 4);
        var invoiceNumber = invoicePrefix + practice_id_str + substr + counter_str;
        db.query(updateSql, [invoiceNumber, invoice_id], (err, result) => {
          if (err) throw err;
          resolve(invoiceNumber);
        });
      });
    } else {
      resolve(null);
    }
  })
  return invoiceNumberGenerator;
}

function consumeStock(invoice_id, ref, user_id, practice_id) {
  // console.log(invoice_id);
  let patientSQL = `SELECT patient_id FROM invoice WHERE invoice_id = ?`;
  let itemSql = `SELECT quantity, item_id, itemstock_id FROM invoice_items WHERE invoice_id = ? AND item_id IS NOT NULL AND itemstock_id IS NOT NULL`;
  let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel - ? WHERE item_id=?`;
  let consumeSql = `INSERT INTO consumed_stock SET ?`;
  let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel - ? WHERE itemstock_id = ?`;
  db.query(patientSQL, invoice_id, (err, resultinvoice) => {
    if (err) throw err;
    var patient_id = resultinvoice[0].patient_id;
    db.query(itemSql, invoice_id, (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        let quantity = result[i].quantity;
        let item_id = result[i].item_id;
        let itemstock_id = result[i].itemstock_id;
        let consumed = {
          consumed_stocklevel: quantity,
          practice_id: practice_id,
          user_id: user_id,
          item_id: item_id,
          itemstock_id: itemstock_id,
          status: 'consumed',
          patient_id: patient_id,
        };
        db.query(consumeSql, consumed, (err, result) => {
          if (err) throw err;
        });
        db.query(stockSql, [quantity, itemstock_id], (err, result) => {
          if (err) throw err;
        });
        db.query(updateItemSql, [quantity, item_id], (err, result) => {
          if (err) throw err;
        });
      }
    });
  });
}

router.post('/addpayment/:invoice_id/:practice_id/:user_id/:substr/:ref', (req, res) => {
  console.log('i_id: ', req.params.invoice_id, 'ref: ', req.params.ref)
  var ref = req.params.ref;
  var practice_id = req.params.practice_id;
  var user_id = req.params.user_id;
  var invoice_id = req.params.invoice_id;

  var status = req.body.status;

  delete req.body.status;

  var payment = req.body;
  var payment_type = req.body.type;

  let currentdate = moment().format('YYYY-MM');
  let currentdate_from = currentdate + '-01';
  let currentdate_to = currentdate + '-' + moment().format('DD');

  let updateSql = `UPDATE invoice SET status = ?, payment_type = ? WHERE invoice_id = ?`;
  let paymentSql = `INSERT INTO payment SET ?`;
  let selectPaySql = `select * from payment left join invoice on invoice.invoice_id = payment.invoice_id where invoice.practice_id = ? and payment.date >= ? and payment.date <= ?`;

  preventiveCare(invoice_id, ref);
  consumeStock(invoice_id, ref, user_id, practice_id);
  db.query(selectPaySql, [practice_id, currentdate_from, currentdate_to], (err, result) => {
    if (err) throw err;
    let pn_ref = 'PR-' + prefixZeroes(practice_id, 2) + '-' + moment(currentdate, 'YYYY-MM').format('YY') + '' + moment(currentdate, 'YYYY-MM').format('MM') + '-' + prefixZeroes((result.length + 1), 4);
    payment.pn_ref = pn_ref;
    let query = db.query(paymentSql, payment, (err, result) => {
      if (err) throw err;
      db.query(updateSql, [status, payment_type, invoice_id], (err, result) => {
        if (err) throw err;
        // invoiceNumberGenerator('IN:', req.params.substr, practice_id, invoice_id, ref).then(data => {
        let select_ref = `select * from invoice where invoice_id = ?`;
        let query = db.query(select_ref, invoice_id, (err, result) => {
          if (err) throw err;
          res.send({ ref: result[0].ref });
        });
        // });
      });
    });
  });
});



//doing thissss ......
router.get('/queueinvoicestaff/:invoice_id', (req, res) => {
  var invoice_id = req.params.invoice_id;
  console.log(invoice_id);
  let sql = `UPDATE invoice SET queuestaff= '1' WHERE invoice_id = ?`;
  let query = db.query(sql, invoice_id, (err, result) => {
    if (err) throw err;
    let sqlselect = `SELECT * FROM invoice WHERE invoice_id = ?`;
    let query = db.query(sqlselect, invoice_id, (err, resultdata) => {
      socketIO.emit('invoice', resultdata.length ? resultdata[0] : null);
      res.json({
        success: true
      })
    });
  });
});

router.get('/paymenthistory/:invoice_id', (req, res) => {
  var invoice_id = req.params.invoice_id;
  let sql = `SELECT SUM(payment_amount) as paid FROM payment WHERE invoice_id = ?`;
  let query = db.query(sql, invoice_id, (err, result) => {
    if (err) throw err;
    res.send({ paid: result[0].paid });
  });
});

router.post('/preventivecare', (req, res) => {
  var preventiveCare = req.body.item;
  var record_id = req.body.record_id;
  let sql = `INSERT INTO preventive_care SET ?`;
  let query = db.query(sql, preventiveCare, (err, result) => {
    var preventive_id = result.insertId;
    let sql2 = "UPDATE record SET preventive_id = ? WHERE record_id = ?";
    let query2 = db.query(sql2, [preventive_id, record_id], (err, resultnew) => {
      if (err) throw err;
      res.send({ preventive_id: preventive_id });
    });
  });
});


router.post('/preventivecareadditems', (req, res) => {

  var temp = req.body.prev_comp;
  var deletedarray = req.body.deleted_items;
  var invoice_id = req.body.invoice_id;
  var preventive_id = req.body.preventive_id;
  var practice_id = req.body.practice_id;
  var user_id = req.body.user_id;

  var patient_id = req.body.patient_id;


  deletedarray.map(procdelete => {
    let sqldelete = 'DELETE FROM pc_vaccination WHERE pc_vaccine_id=?';
    db.query(sqldelete, procdelete.pc_vaccine_id, (err, resultcheck) => {
      if (err) throw err;
      var total = parseFloat((procdelete.quantity * procdelete.retail_price) + ((procdelete.quantity * procdelete.retail_price) * (procdelete.tax / 100)));
      console.log('total: ', total);
      let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
      let sql = `DELETE FROM invoice_items WHERE invoice_id=? AND pc_vaccine_id=?`;
      let query = db.query(sql, [procdelete.invoice_id, procdelete.pc_vaccine_id], (err, result) => {
        if (err) throw err;
        db.query(updateSql, [total, procdelete.invoice_id], (err, result) => {
          if (err) throw err;
        });
      });

      console.log('check this to delete items', procdelete);
      let sqldeleteinv = 'DELETE FROM record_consumables WHERE pc_vaccine_id=?';
      db.query(sqldeleteinv, procdelete.pc_vaccine_id, (err, resultcheckinv) => {
        if (err) throw err;
        let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
        let consumeSql = `INSERT INTO consumed_stock SET ?`;
        let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
        let consumed = {
          consumed_stocklevel: procdelete.inv_quantity,
          practice_id: practice_id,
          user_id: user_id,
          item_id: procdelete.inv_item_id,
          itemstock_id: procdelete.inv_itemstock_id,
          status: 'deleted',
          recordconsume_id: procdelete.inv_recordconsume_id,

          name: procdelete.inv_name,
          batch_no: procdelete.inv_batch_no,
          c_quantity: procdelete.inv_c_quantity,
          unit: procdelete.inv_stock_unit,
          total: procdelete.inv_total,
          patient_id: patient_id
        };
        db.query(consumeSql, consumed, (err, result) => {
          if (err) throw err;
        });
        db.query(stockSql, [procdelete.inv_quantity, procdelete.inv_itemstock_id], (err, result) => {
          if (err) throw err;
        });
        db.query(updateItemSql, [procdelete.inv_quantity, procdelete.inv_item_id], (err, result) => {
          if (err) throw err;
        });
      });

    });
  });


  for (i = 0; i < temp.length; i++) {
    console.log(temp[i].pc_vaccine_id);

    if (temp[i].pc_vaccine_id) {

    } else {
      let vaccination = {
        prev_id: temp[i].prev_id,
        preventive_id: preventive_id,
        treatment: temp[i].name,
        vaccination: temp[i].inv_name,
        c_quantity: temp[i].inv_c_quantity,
        stock_unit: temp[i].inv_stock_unit
      };


      let invoicepreventive = {
        name: temp[i].name,
        quantity: temp[i].quantity,
        retail_price: temp[i].retail_price,
        tax: temp[i].tax,
        total: temp[i].total,
        invoice_id: invoice_id,
        vaccination: temp[i].inv_name,
        batch_no: temp[i].inv_batch_no
      };

      let record_consume = {
        name: temp[i].inv_name,
        c_quantity: temp[i].inv_c_quantity,
        stock_unit: temp[i].inv_stock_unit,
        stock_selected: temp[i].inv_stock_selected,
        item_id: temp[i].inv_item_id,
        itemstock_id: temp[i].inv_itemstock_id,
        batch_no: temp[i].inv_batch_no,
        quantity: temp[i].inv_quantity,
        retail_price: temp[i].inv_retail_price,
        tax: temp[i].inv_tax,
        total: temp[i].inv_total
      };

      console.log(temp);
      console.log(vaccination);
      console.log(invoicepreventive);
      console.log(record_consume);


      let totalprev = parseFloat((temp[i].quantity * temp[i].total) + ((temp[i].quantity * temp[i].total) * (temp[i].tax / 100)));
      let sql1 = "INSERT INTO pc_vaccination SET ?";
      db.query(sql1, vaccination, (err, resultproc) => {
        if (err) throw err;
        invoicepreventive.pc_vaccine_id = resultproc.insertId;
        record_consume.pc_vaccine_id = resultproc.insertId;
        let sqlinvoiceproc = "INSERT INTO invoice_items SET ?";
        db.query(sqlinvoiceproc, invoicepreventive, (err, resultinvproc) => {
          if (err) throw err;
          let updateSqlproc = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
          db.query(updateSqlproc, [totalprev, invoice_id], (err, resulttotalproc) => {
            if (err) throw err;

            let sql1 = "INSERT INTO record_consumables SET ?";
            db.query(sql1, record_consume, (err, resulttreatrecord) => {
              if (err) throw err;
              let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel - ? WHERE item_id=?`;
              let consumeSql = `INSERT INTO consumed_stock SET ?`;
              let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel - ? WHERE itemstock_id = ?`;
              let consumed = {
                consumed_stocklevel: record_consume.quantity,
                practice_id: practice_id,
                user_id: user_id,
                item_id: record_consume.item_id,
                itemstock_id: record_consume.itemstock_id,
                status: 'consumed',
                recordconsume_id: resulttreatrecord.insertId,

                name: record_consume.name,
                batch_no: record_consume.batch_no,
                c_quantity: record_consume.c_quantity,
                unit: record_consume.stock_unit,
                total: record_consume.total,
                patient_id: patient_id
              };
              db.query(consumeSql, consumed, (err, result) => {
                if (err) throw err;
              });
              db.query(stockSql, [record_consume.quantity, record_consume.itemstock_id], (err, result) => {
                if (err) throw err;
              });
              db.query(updateItemSql, [record_consume.quantity, record_consume.item_id], (err, result) => {
                if (err) throw err;
              });
            });
          });
        });
      });
    }
  }

  res.json({
    success: true
  })



});



router.get('/preventivecaretreatments/:preventive_id', (req, res) => {
  var preventive_id = req.params.preventive_id;

  console.log('seeeing this', preventive_id);
  let sqlcheck = 'SELECT pc_vaccination.*, record_consumables.batch_no FROM pc_vaccination LEFT JOIN record_consumables ON pc_vaccination.pc_vaccine_id = record_consumables.pc_vaccine_id  WHERE pc_vaccination.preventive_id = ?';
  let query = db.query(sqlcheck, preventive_id, (err, result) => {
    console.log(result);
    res.json({
      success: true,
      value: result
    })
  });

});




router.get('/preventivecare/:preventive_id', (req, res) => {
  var preventive_id = req.params.preventive_id;

  preventiveItems = [];
  let sql4 = 'SELECT * FROM record_consumables WHERE plan_id=?';
  let sqlcheck = 'SELECT * FROM pc_vaccination WHERE preventive_id = ?';
  let query = db.query(sqlcheck, preventive_id, (err, result) => {
    console.log(result);

    if (result.length > 0) {
      // for (i = 0; i < result.length; i++) {
      // console.log('result[i].pc_vaccine_id',result[i].pc_vaccine_id);
      // let sql = `SELECT a.*,b.recordconsume_id as inv_recordconsume_id, b.name as inv_name, b.stock_unit as inv_stock_unit, b.c_quantity as inv_c_quantity, b.stock_selected as inv_stock_selected, b.itemstock_id as inv_itemstock_id, b.item_id as inv_item_id, b.batch_no as inv_batch_no, b.quantity as inv_quantity, b.retail_price as inv_retail_price, b.tax as inv_tax, b.total as inv_total 
      // FROM invoice_items as a 
      // LEFT JOIN record_consumables as b ON a.pc_vaccine_id = b.pc_vaccine_id 
      // WHERE a.pc_vaccine_id = ?`;
      // let query = db.query(sql, result[i].pc_vaccine_id, (err, resultinside) => {
      //   preventiveItems.push(resultinside[0]);
      // });
      // }
      result.forEach(element => {
        console.log('result[i].pc_vaccine_id', element.pc_vaccine_id);
        let sql = `SELECT a.*,b.recordconsume_id as inv_recordconsume_id, b.name as inv_name, b.stock_unit as inv_stock_unit, b.c_quantity as inv_c_quantity, b.stock_selected as inv_stock_selected, b.itemstock_id as inv_itemstock_id, b.item_id as inv_item_id, b.batch_no as inv_batch_no, b.quantity as inv_quantity, b.retail_price as inv_retail_price, b.tax as inv_tax, b.total as inv_total 
        FROM invoice_items as a 
        LEFT JOIN record_consumables as b ON a.pc_vaccine_id = b.pc_vaccine_id 
        WHERE a.pc_vaccine_id = ?`;
        let query = db.query(sql, element.pc_vaccine_id, (err, resultinside) => {
          if (resultinside.length > 0) {
            preventiveItems.push(resultinside[0]);
          }
        });
      });
      Promise.all(result).then(data => {
        console.log('preventiveItems', preventiveItems);
        let query = db.query(sqlcheck, preventive_id, (err, result) => {
          console.log('result', result);
          res.json({
            success: true,
            value: preventiveItems
          })
        });
      });
    } else {
      console.log('preventiveItems', preventiveItems);
      res.json({
        success: true,
        value: preventiveItems
      });
    }
  });
});

router.get('/preventivecarehistory/:patient_id', (req, res) => {
  var patient_id = req.params.patient_id;
  console.log('patient_id:', patient_id)
  // let sql = 'SELECT a.*, b.*, c.name FROM preventive_care as a left JOIN pc_history as b ON a.preventive_id = b.preventive_id left JOIN `user` as c ON a.user_id = c.user_id WHERE patient_id = ? ORDER BY a.preventive_id DESC';
  let sql = `SELECT d.treatment as hist_type_care,d.vaccination as hist_treatment,a.*, b.*, c.name FROM preventive_care as a 
  left JOIN pc_history as b ON a.preventive_id = b.preventive_id 
  left JOIN user as c ON a.user_id = c.user_id 
  left JOIN pc_vaccination as d ON a.preventive_id = d.preventive_id
  WHERE patient_id = ? ORDER BY a.preventive_id DESC`;
  let query = db.query(sql, patient_id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get('/invoicepaymenthistory/:invoice_id', (req, res) => {
  var invoice_id = req.params.invoice_id;
  console.log('invoice_id:', invoice_id);
  if (invoice_id != 'undefined') {
    let sql = "(select pn_ref as ref, payment_amount, type, date from payment where invoice_id = " + invoice_id + " and payment_amount <> '0') union (select cn_ref as ref,amount as payment,concat('Credits') as type, timestamp as date from credit_history where invoice_id = " + invoice_id + ")";
    let query = db.query(sql, (err, result) => {
      console.log('12212121')
      if (err) throw err;
      console.log('12212121')
      res.send(result);
    });
  }
});
////:::::::::::::::::::::::::::::::::check wheather used or not::::::::::::::::::::::::::::::::::::::::
router.post('/additemfromplanning/:invoice_id', (req, res) => {
  //this api is not finished yet
  var invoice_id = req.params.invoice_id;
  var final = req.body;
  // var plan = [];
  // var final = plan.concat(planning.procedures, planning.labOrders , planning.imagingOrders);
  let selectSql = `SELECT quantity, tax, retail_price , individual_discount, individual_discount_relative,final_discount FROM invoice_items WHERE invoice_id = ? AND proc_id IS NOT NULL OR diagimag_id IS NOT NULL OR diaglab_id IS NOT NULL`;
  let totalSubSql = 'UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?';
  let totalAddSql = 'UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?';
  let deleteSql = `DELETE FROM invoice_items WHERE invoice_id = ? AND proc_id IS NOT NULL OR diagimag_id IS NOT NULL OR diaglab_id IS NOT NULL`;
  let sql = `INSERT INTO invoice_items SET ?`;
  let query = db.query(selectSql, invoice_id, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      var total = parseFloat((result[i].quantity * result[i].retail_price) + ((result[i].quantity * result[i].retail_price) * (result[i].tax / 100)));
      db.query(totalSubSql, [total, invoice_id], (err, result) => {
        if (err) throw err;
      });
    }
    db.query(deleteSql, invoice_id, (err, result) => {
      if (err) throw err;
      for (let i = 0; i < final.length; i++) {
        db.query(sql, final[i], (err, result) => {
          if (err) throw err;
          var total = parseFloat((final[i].quantity * final[i].retail_price) + ((final[i].quantity * final[i].retail_price) * (final[i].tax / 100)));
          db.query(totalAddSql, [total, invoice_id], (err, result) => {
            if (err) throw err;
          });
        });
      }
    });
    res.sendStatus(200);
  });
});

router.get('/receptiondashboard/paymentreceipts/:date/:practice_id/:payment_status/:payment_type', (req, res) => {
  let date = req.params.date;
  let payment_status = req.params.payment_status;
  let payment_type = req.params.payment_type;
  let practice_id = req.params.practice_id;

  console.log('Dashboard Payment Receipts:', date, payment_status, payment_type);
  let sql1 = `SELECT patient.name as patient_name, pet_parent.name as pet_parent_name,
payment.pn_ref, payment.date, payment.type, payment.payment_amount,
invoice.ref, invoice.invoice_id
FROM payment
left join invoice on payment.invoice_id = invoice.invoice_id
left join patient on invoice.patient_id = patient.patient_id
left join pet_parent on invoice.pet_parent_id = pet_parent.pet_parent_id
where payment.date = ? and payment.type = ? and invoice.status = ? and invoice.practice_id = ?`;

  let sql2 = `SELECT patient.name as patient_name, pet_parent.name as pet_parent_name,
payment.pn_ref, payment.date, payment.type, payment.payment_amount,
invoice.ref, invoice.invoice_id
FROM payment
left join invoice on payment.invoice_id = invoice.invoice_id
left join patient on invoice.patient_id = patient.patient_id
left join pet_parent on invoice.pet_parent_id = pet_parent.pet_parent_id
where payment.date = ? and payment.type = ? and invoice.practice_id = ?`;

  let sql3 = `SELECT patient.name as patient_name, pet_parent.name as pet_parent_name,
payment.pn_ref, payment.date, payment.type, payment.payment_amount,
invoice.ref, invoice.invoice_id
FROM payment
left join invoice on payment.invoice_id = invoice.invoice_id
left join patient on invoice.patient_id = patient.patient_id
left join pet_parent on invoice.pet_parent_id = pet_parent.pet_parent_id
where payment.date = ? and invoice.status = ? and invoice.practice_id = ?`;

  let sql4 = `SELECT patient.name as patient_name, pet_parent.name as pet_parent_name,
payment.pn_ref, payment.date, payment.type, payment.payment_amount,
invoice.ref, invoice.invoice_id
FROM payment
left join invoice on payment.invoice_id = invoice.invoice_id
left join patient on invoice.patient_id = patient.patient_id
left join pet_parent on invoice.pet_parent_id = pet_parent.pet_parent_id
where payment.date = ? and payment.type IS NOT NULL and invoice.practice_id = ?`;

  if (payment_status && payment_type && payment_status !== 'null' && payment_type !== 'null') {
    db.query(sql1, [date, payment_type, payment_status, practice_id], (err, result) => {
      if (err) throw err;
      res.send({ success: true, result: result });
    });
  } else if ((!payment_status || payment_status == 'null') && payment_type && payment_type !== 'null') {
    db.query(sql2, [date, payment_type, practice_id], (err, result) => {
      if (err) throw err;
      res.send({ success: true, result: result });
    });
  } else if (payment_status && payment_status !== 'null' && (!payment_type || payment_type == 'null')) {
    db.query(sql3, [date, payment_status, practice_id], (err, result) => {
      if (err) throw err;
      res.send({ success: true, result: result });
    });
  } else if ((!payment_status || payment_status == 'null') && (!payment_type || payment_type == 'null')) {
    db.query(sql4, [date, practice_id], (err, result) => {
      if (err) throw err;
      res.send({ success: true, result: result });
    });
  }

});

/**
 * rewritten above API for revenue analytic dashboard
 */
router.get('/dashboardanalytics/paymentreceipts/:start_date/:end_date/:practice_id/:payment_type', (req, res) => {  
  let start_date = req.params.start_date;
  let end_date = req.params.end_date;  
  let payment_type = req.params.payment_type;
  let practice_id = req.params.practice_id;  
  
  let sql_params = [];
  let payment_type_addon = "";

  sql_params.push(start_date);
  sql_params.push(end_date);
  sql_params.push(practice_id);

  if(payment_type == "null"){
    payment_type_addon = "";
  }else{
    payment_type_addon = "and payment.type = ?";
    sql_params.push(payment_type);
  }  

  let sql1 = `SELECT patient.name as patient_name, pet_parent.name as pet_parent_name,
          payment.pn_ref, payment.date, payment.type, payment.payment_amount,
          invoice.ref, invoice.invoice_id
          FROM payment
          left join invoice on payment.invoice_id = invoice.invoice_id
          left join patient on invoice.patient_id = patient.patient_id
          left join pet_parent on invoice.pet_parent_id = pet_parent.pet_parent_id
          where ( payment.date BETWEEN ? AND ?) and invoice.practice_id = ? ${payment_type_addon} order by
          payment.payment_id desc`;

 db.query(sql1, sql_params, (err, result) => {
      console.log(this.sql);
      if (err) throw err;
      res.send({ success: true, result: result });
    });
});

router.get('/dashboard/revenue/monthly/:practice_id/:startOfCalculatedMonth/:endOfCurrentMonth', (req, res) => {
  var startOfCalculatedMonth = req.params.startOfCalculatedMonth;
  var endOfCurrentMonth = req.params.endOfCurrentMonth;
  var practice_id = req.params.practice_id;
  console.log('pracrice_id', req.params.practice_id, ' ', req.params.startOfCalculatedMonth, ' ', req.params.endOfCurrentMonth)
  let sql = `SELECT
  a.date as month,
  SUM(ROUND(a.total) - ROUND((CASE WHEN b.total THEN b.total ELSE 0 END))) as revenue
  FROM invoice as a
  LEFT JOIN return_invoice as b ON a.invoice_id = b.linked_invoice
  WHERE a.practice_id = ? AND a.status != 'Draft'  AND a.status != 'Deleted' AND a.date BETWEEN ? AND ?
  GROUP BY MONTH(a.date) LIMIT 7`;
  db.query(sql, [practice_id, startOfCalculatedMonth, endOfCurrentMonth], (err, result) => {
    if (err) throw err;
    let final = {};
    result.map(item => {
      console.log(item.month);
      final[moment(item.month).format('MMM YY')] = item.revenue
    })
    console.log('ff', final);
    res.send(final);
  });
});

// router.get('/dashboard/revenue/yearly/:practice_id', (req, res) => {
//   var practice_id = req.params.practice_id;
//   console.log('dashboard revenue api called: yearly', practice_id);
//   let sql = `SELECT
//   YEAR(a.date) as year,
//   SUM(ROUND(a.total)) as revenue
//   FROM invoice as a
//   WHERE a.practice_id = ? AND a.ref != 'Draft'
//   GROUP BY YEAR(a.date) LIMIT 7`;
//   db.query(sql, practice_id, (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

router.get('/dashboard/revenue/weekly/:practice_id/:startOfWeek/:endOfWeek', (req, res) => {
  var startOfWeek = req.params.startOfWeek;
  var endOfWeek = req.params.endOfWeek;
  var practice_id = req.params.practice_id;
  let sql = `SELECT
  a.date as day,
  SUM(ROUND(a.total) - ROUND((CASE WHEN b.total THEN b.total ELSE 0 END))) as revenue
  FROM invoice as a
  LEFT JOIN return_invoice as b ON a.invoice_id = b.linked_invoice
  WHERE a.practice_id = ? AND a.date BETWEEN ? AND ? AND a.status != 'Draft' AND a.status!= 'Deleted'
  GROUP BY DAY(a.date) LIMIT 7`;
  db.query(sql, [practice_id, startOfWeek, endOfWeek], (err, result) => {
    if (err) throw err;
    let final = {};
    result.map(item => {
      final[moment(item.day).format('DD MMM')] = item.revenue
    })
    res.send(final);
  });
});

function CNNumberGenerator(invoicePrefix, substr, practice_id) {
  const CNNumberGenerator = new Promise((resolve, reject) => {
    // check and change the sql
    let refSql = `SELECT COUNT(creditnote_id) + 1 as counter FROM credit_notes WHERE cn_ref LIKE ? AND practice_id=?`;
    db.query(refSql, ['%' + substr + '%', practice_id], (err, result) => {
      if (err) throw err;
      var practice_id_str = prefixZeroes(practice_id, 2);
      var counter_str = prefixZeroes(result[0].counter, 4);
      var invoiceNumber = invoicePrefix + practice_id_str + substr + counter_str;
      resolve(invoiceNumber);
    });
  });
  return CNNumberGenerator;
}

router.post('/creditnote/:substr/:practice_id', (req, res) => {
  var substr = req.params.substr;
  var practice_id = req.params.practice_id;
  var creditnote = req.body;
  // let lastSql = 'SELECT creditnote_id FROM credit_notes ORDER BY creditnote_id DESC LIMIT 1';
  let sqlinsert = `INSERT INTO credit_notes SET ?`;
  // let query = db.query(lastSql, (err, result) => {
  //   if (err) throw err;
  //   console.log(result.length);
  //   if(result.length > 0) {
  // creditnote.cn_ref = 'CN-' + prefixZeroes(result[0].creditnote_id + 1, 8);
  CNNumberGenerator('CN-', substr, practice_id).then(ref => {
    creditnote.cn_ref = ref;
    creditnote.status ? creditnote.status = creditnote.status : creditnote.status = 'Open';
    creditnote.currentamount = creditnote.initialamount;
    db.query(sqlinsert, creditnote, (err, resultinsert) => {
      if (err) throw err;
      res.json({
        success: true,
        invoice_id: resultinsert.insertId
      });
    });
    //   });
    // } else {
    //   creditnote.cn_ref = 'CN-00000001';
    //   creditnote.status ? creditnote.status = creditnote.status : creditnote.status = 'Open';
    //   creditnote.currentamount = creditnote.initialamount;
    //   console.log(creditnote)
    //   db.query(sqlinsert, creditnote, (err, resultinsert) => {
    //     if (err) throw err;
    //     res.json({
    //       success: true,
    //       invoice_id: resultinsert.insertId
    //     });
    //   });
    // }
  });
});

function getInvoiceNumber(preUpdateSql, invoice_id, practice_id) {
  const promise = new Promise((resolve, reject) => {
    db.query(preUpdateSql, [invoice_id], (err, result) => {
      if (err) throw err;
      if (result.length && result[0].ref === 'Draft') {
        // generate the invoice number and resolve with the invoice number
        invoiceNumberGenerator('IN:', moment().format('-YYMM-'), practice_id, invoice_id, result[0].ref).then(invoiceNumber => {
          resolve(invoiceNumber);
        });
      } else if (result.length && result[0].ref !== 'Draft') {
        // resolve with the ref
        resolve(result[0].ref);
      }
    })
  });
  return promise;
}


router.post("/addcreditnote", (req, res) => {
  var invoice_id = req.body.invoice_id;
  var practice_id = req.body.practice_id;
  var user_id = req.body.user_id;
  var credits = req.body.credits;
  var totalamount = req.body.totalamount;
  var paidtrue = req.body.paidtrue;
  var invoiceTotal = req.body.wholetotal;
  console.log(totalamount);
  let preUpdateSql = `SELECT ref FROM invoice WHERE invoice_id = ?`;
  let updateSql = `UPDATE invoice SET credits = credits + ?, status = 'Outstanding',payment_type = 'Credits', ref = ? WHERE invoice_id = ?`;
  let updateSqlPaid = `UPDATE invoice SET credits = credits + ?, status = 'Paid',payment_type = 'Credits', ref = ? WHERE invoice_id = ?`;
  let updateCreditSql = `UPDATE credit_notes SET currentamount = currentamount - ?, status = ? WHERE creditnote_id = ?`;
  let paymentSql = `INSERT INTO credit_history SET ?`;
  // let invoicePaymentSql = `INSERT INTO payment SET ?`;

  console.log(paidtrue);

  // let payment = {
  //   date: moment().format('YYYY-MM-DD'),
  //   type: 'Credits',
  //   payment_amount: totalamount,
  //   outstanding: invoiceTotal - totalamount,
  //   invoice_id: invoice_id
  // };

  // db.query(invoicePaymentSql, [payment], (err, result) => {
  //   if (err) throw err;
  // });

  if (paidtrue) {
    getInvoiceNumber(preUpdateSql, invoice_id, practice_id).then(ref => {
      db.query(updateSqlPaid, [totalamount, ref, invoice_id], (err, result) => {
        if (err) throw err;
      });
    });
  } else {
    getInvoiceNumber(preUpdateSql, invoice_id, practice_id).then(ref => {
      db.query(updateSql, [totalamount, ref, invoice_id], (err, result) => {
        if (err) throw err;
      });
    });
  }
  if (credits.length > 0) {
    for (let i = 0; i < credits.length; i++) {
      if (credits[i].consumeamount && credits[i].consumeamount > 0) {
        console.log(credits[i]);
        db.query(
          updateCreditSql,
          [
            credits[i].consumeamount,
            credits[i].consume_status,
            credits[i].creditnote_id
          ],
          (err, result) => {
            if (err) throw err;
            let temp = {
              creditnote_id: credits[i].creditnote_id,
              cn_ref: credits[i].cn_ref,
              amount: credits[i].consumeamount,
              invoice_id: invoice_id,
              practice_id: practice_id,
              user_id: user_id
            };
            console.log("temp", temp);
            db.query(paymentSql, temp, (err, result) => {
              if (err) throw err;
            });
          }
        );
      }
    }
    res.json({
      success: true
    });
  } else {
    res.json({
      success: false
    });
  }
});


router.post('/addmanyinvoicepayment/:substr/:practice_id', (req, res) => {
  let substr = req.params.substr;
  var practice_id = req.body.practice_id;
  var user_id = req.body.user_id;
  var paymentdetails = req.body.paymentdetails;
  var invoicedetails = req.body.invoicedetails;
  var pet_parent_id = req.body.pet_parent_id;

  var amountpaid = paymentdetails.payment_amount;

  // console.log(practice_id , user_id);
  // console.log(paymentdetails);
  // console.log(invoicedetails);
  // console.log(checker);

  amountpayment(amountpaid, invoicedetails, paymentdetails, practice_id).then(paymentstatus => {
    console.log(paymentstatus);
    if (paymentstatus.checker) {
      if (paymentstatus.amountpaid >= 1) {
        var amountcredited = paymentstatus.amountpaid.toFixed(0);
        // let lastSql = 'SELECT creditnote_id FROM credit_notes ORDER BY creditnote_id DESC LIMIT 1';
        let sqlinsert = `INSERT INTO credit_notes SET ?`;
        // let query = db.query(lastSql, (err, result) => {
        //   if (err) throw err;
        //   if(result.length > 0) {
        CNNumberGenerator('CN-', substr, practice_id).then(ref => {
          const creditnote = {
            cn_ref: ref,
            status: 'Open',
            practice_id: practice_id,
            user_id: user_id,
            pet_parent_id: pet_parent_id,
            currentamount: amountcredited,
            initialamount: amountcredited
          };
          db.query(sqlinsert, creditnote, (err, resultinsert) => {
            if (err) throw err;
            res.json({
              success: true,
              creditnote: true,
              amountcredited: amountcredited
            })
          });
        });

        // } else {
        //   const creditnote = {
        //     cn_ref: 'CN-00000001',
        //     status: 'Open',
        //     practice_id: practice_id,
        //     user_id: user_id,
        //     pet_parent_id: pet_parent_id,
        //     currentamount: amountcredited,
        //     initialamount: amountcredited
        //   };
        //   db.query(sqlinsert, creditnote, (err, resultinsert) => {
        //     if (err) throw err;
        //     console.log('excess');
        //     res.json({
        //       success: true,
        //       creditnote:true,
        //       fullpayment: false,
        //       amountcredited: amountcredited
        //     })
        //   });
        // }
        // });
        // console.log('creditnote created');
      } else {
        res.json({
          success: true,
          creditnote: false,
          fullpayment: true
        })
      }
    } else {
      if (paymentstatus.fullpayment) {
        console.log('full payment');
        res.json({
          success: true,
          creditnote: false,
          fullpayment: true
        })
      } else {
        console.log('outstanding');
        res.json({
          success: true,
          creditnote: false,
          fullpayment: false
        })
      }
    }
  });
});



function amountpayment(amountpaid, invoicedetails, paymentcheck, practice_id) {
  const paymentdetails = new Promise((resolve, reject) => {
    for (let i = 0; i < invoicedetails.length; i++) {
      if (invoicedetails[i].status == 'Outstanding') {
        if (invoicedetails[i].checkbox) {
          console.log(invoicedetails[i].outstandingrealamount);
          console.log(invoicedetails[i].outstandingrealamount - amountpaid);
          if (amountpaid > 0) {
            let currentdate = moment().format('YYYY-MM');
            let currentdate_from = currentdate + '-01';
            let currentdate_to = currentdate + '-' + moment().format('DD');
            if ((invoicedetails[i].outstandingrealamount - amountpaid) <= 0) {
              console.log('Paid');
              const payment = {
                date: paymentcheck.date,
                type: paymentcheck.type,
                payment_amount: invoicedetails[i].outstandingrealamount,
                outstanding: 0,
                invoice_id: invoicedetails[i].invoice_id
              }
              let updateSql = `UPDATE invoice SET status = ?, payment_type = ? WHERE invoice_id = ?`;
              let paymentSql = `INSERT INTO payment SET ?`
              let selectPaySql = `select * from payment left join invoice on invoice.invoice_id = payment.invoice_id where invoice.practice_id = ? and payment.date >= ? and payment.date <= ?`;
              db.query(selectPaySql, [practice_id, currentdate_from, currentdate_to], (err, result) => {
                if (err) throw err;
                let pn_ref = 'PR-' + prefixZeroes(practice_id, 2) + '-' + moment(currentdate, 'YYYY-MM').format('YY') + '' + moment(currentdate, 'YYYY-MM').format('MM') + '-' + prefixZeroes((result.length + 1), 4);
                let query = db.query(paymentSql, payment, (err, result) => {
                  if (err) throw err;
                  db.query(updateSql, ['Paid', paymentcheck.type, invoicedetails[i].invoice_id], (err, result) => {
                    if (err) throw err;
                  });
                });
              });
              amountpaid = amountpaid - invoicedetails[i].outstandingrealamount;
            } else {
              console.log('Outstanding', invoicedetails[i].outstandingrealamount - amountpaid);
              const payment = {
                date: paymentcheck.date,
                type: paymentcheck.type,
                payment_amount: amountpaid,
                outstanding: invoicedetails[i].outstandingrealamount - amountpaid,
                invoice_id: invoicedetails[i].invoice_id
              }
              let updateSql = `UPDATE invoice SET status = ?, payment_type = ? WHERE invoice_id = ?`;
              let paymentSql = `INSERT INTO payment SET ?`;
              let selectPaySql = `select * from payment left join invoice on invoice.invoice_id = payment.invoice_id where invoice.practice_id = ? and payment.date >= ? and payment.date <= ?`;
              db.query(selectPaySql, [practice_id, currentdate_from, currentdate_to], (err, result) => {
                if (err) throw err;
                let pn_ref = 'PR-' + prefixZeroes(practice_id, 2) + '-' + moment(currentdate, 'YYYY-MM').format('YY') + '' + moment(currentdate, 'YYYY-MM').format('MM') + '-' + prefixZeroes((result.length + 1), 4);
                let query = db.query(paymentSql, payment, (err, result) => {
                  if (err) throw err;
                  db.query(updateSql, ['Outstanding', paymentcheck.type, invoicedetails[i].invoice_id], (err, result) => {
                    if (err) throw err;
                  });
                });
              });
              // breakout as amount paid is consumed
              amountpaid = 0;
              resolve({ 'amountpaid': amountpaid, 'checker': false, 'fullpayment': false, 'invoicedetails': invoicedetails[i] });
            }
          } else {
            console.log('sadfasdfasdf');
            resolve({ 'amountpaid': amountpaid, 'checker': false, 'fullpayment': true });
          }
        }
      }
    } if (amountpaid > 0) {
      resolve({ 'amountpaid': amountpaid, 'checker': true });
    } else {
      console.log('sadfasdfasdf');
      resolve({ 'amountpaid': amountpaid, 'checker': false, 'fullpayment': true });
    }
  });
  return paymentdetails;
}



router.get("/todaydashbill/:date/:user_id/:practice_id", (req, res) => {
  let sql;
  var date = req.params.date;
  var user_id = req.params.user_id;
  var practice_id = req.params.practice_id;
  sql = `SELECT
        a.invoice_id,
        a.patient_id,
        a.ref,
        a.status,
        (CASE WHEN a.total THEN a.total
          ELSE 0
        END - CASE WHEN a.final_discount THEN a.final_discount
          ELSE 0
        END) as amount,
        (CASE WHEN d.role = 'Receptionist' THEN NULL
          ELSE d.name
        END) as doctorname,
        f.prescription_id,
        c.name as parentname,
        c.mobile_no,
        b.name as patientname
        FROM invoice as a
        INNER JOIN patient as b ON a.patient_id = b.patient_id
        LEFT JOIN record as f ON (a.preventive_id = f.preventive_id OR a.plan_id = f.plan_id)
        INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
        LEFT JOIN user as d ON a.user_id = d.user_id
        WHERE a.date=? AND a.practice_id=? AND queuestaff = '1'`;
  let sql_params = [
    date,
    practice_id
  ];
  db.query(sql, sql_params, (err, result) => {
    if (err) throw err;
    res.json({ success: true, result: result });
  });
});

router.get("/todayprescriptionbill/:date/:user_id/:practice_id", (req, res) => {
  let sql;
  var date = req.params.date;
  var user_id = req.params.user_id;
  var practice_id = req.params.practice_id;
  // SELECT * FROM `record` WHERE `timestamp` >= "2017-11-28 00:00:00" AND `timestamp` <= "2017-11-28 24:00:00"
  const starttime = date + ' 00:00:00';
  const endtime = date + ' 24:00:00';

  sql = `SELECT
        a.*,
        d.name as doctorname,
        c.name as parentname,
        b.name as patientname,
        c.mobile_no
        FROM record as a
        INNER JOIN patient as b ON a.patient_id = b.patient_id
        INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
        LEFT JOIN user as d ON a.user_id = d.user_id
        WHERE a.timestamp >= ? AND  a.timestamp <= ? AND a.practice_id=? AND prescription_id != 'NULL'`;
  let sql_params = [
    starttime,
    endtime,
    practice_id
  ];
  db.query(sql, sql_params, (err, result) => {
    if (err) throw err;
    res.json({ success: true, result: result });
  });
});





router.get("/todaydashappointments/:date/:practice_id", (req, res) => {
  let sql;
  var date = req.params.date;
  var practice_id = req.params.practice_id;
  sql = `
          (SELECT
            c.mobile_no,NULL as preventive_type, a.appointment_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob, e.name as doctorname,
            (CASE WHEN a.new_patient = true THEN 'new_patient' ELSE CASE WHEN a.walkin = true THEN 'walkin' ELSE 'appointment' END END) AS event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id, a.mobile_reason,
            c.name as pet_parent_name,g.cheifcom
          FROM appointment a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.appointment_id = d.event_id
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          UNION
          (SELECT
            c.mobile_no,NULL as preventive_type, a.follow_up_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob, e.name as doctorname, 'follow_up' as event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id, concat(null) as mobile_reason,
            c.name as pet_parent_name,g.cheifcom
          FROM follow_up a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.follow_up_id = d.event_id
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          UNION
          (SELECT
            c.mobile_no,NULL as preventive_type, a.surgery_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob, e.name as doctorname, 'surgery' as event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id, concat(null) as mobile_reason,
            c.name as pet_parent_name,g.cheifcom
          FROM surgery a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.surgery_id = d.event_id
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          UNION
          (SELECT
            c.mobile_no, a.preventive_type, a.reminder_id as id, b.patient_id, a.time, a.date, '30 minutes' as duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob, e.name as doctorname, 'preventive_care' as event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id, concat(null) as mobile_reason,
            c.name as pet_parent_name,g.cheifcom
          FROM preventive_reminder a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.reminder_id = d.event_id
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          ORDER BY time ASC
        `;

  let sql_params = [
    //follow_up
    date,
    practice_id,
    //appointment
    date,
    practice_id,
    //surgery
    date,
    practice_id,
    //PREVENTIVE
    date,
    practice_id
  ];
  db.query(sql, sql_params, (err, result) => {
    if (err) throw err;
    res.send({ success: true, result: result });
  });
});

router.get('/', (req, res) => {
  res.send('billing works');
});

/**
 * BROOKS was here, so was VJ
 */
/**
 * This API provides data revenue-analytics sales-by-services
 */
router.get('/dashboardanalytics/salesbyservices/:start_date/:end_date/:practice_id/:service_id', (req, res)=>{
  let start_date = req.params.start_date;
  let end_date = req.params.end_date;
  let practice_id = req.params.practice_id;
  let service_id = req.params.service_id;
  let service_id_proc_sql = "";
  let service_id_prev_sql = "";
  let service_id_lab_sql = "";
  let service_id_imag_sql = "";

  if(service_id != 'null'){
    service_id_proc_sql = ` and cp.proc_id = ${service_id}`;
    service_id_prev_sql = ` and cp.prev_id = ${service_id}`;
    service_id_lab_sql = ` and cdl.diaglab_id= ${service_id}`;
    service_id_imag_sql = ` and cdi.diagimag_id= ${service_id}`;
  }

  let sql = `
  select ii.name, sum(ii.total) as total
  from catalog_proc as cp inner join plan_procedures pp on cp.proc_id=pp.proc_id
  inner join invoice_items as ii on pp.procedure_id=ii.procedure_id
  inner join invoice as i on i.invoice_id=ii.invoice_id
  where cp.practice_id = ${practice_id} and i.date between '${start_date}' and '${end_date}' ${service_id_proc_sql}
  group by pp.proc_id
  union
  select ii.name, sum(ii.total) as total
  from catalog_prev as cp inner join pc_vaccination as pcv on cp.prev_id=pcv.prev_id
  inner join invoice_items as ii on pcv.pc_vaccine_id=ii.pc_vaccine_id
  inner join invoice as i on i.invoice_id=ii.invoice_id
  where cp.practice_id = ${practice_id} and i.date between '${start_date}' and '${end_date}' ${service_id_prev_sql}
  group by pcv.prev_id
  union
  select ii.name, sum(ii.total) as total
  from catalog_diaglab as cdl left join plan_lab as pl on cdl.diaglab_id=pl.diaglab_id
  left join invoice_items as ii on pl.planlab_id=ii.planlab_id
  inner join invoice as i on i.invoice_id=ii.invoice_id
  where cdl.practice_id = ${practice_id} and i.date between '${start_date}' and '${end_date}' ${service_id_lab_sql}
  group by pl.diaglab_id
  union 
  select ii.name, sum(ii.total) as total
  from catalog_diagimag as cdi left join plan_imaging as pi on cdi.diagimag_id=pi.diagimag_id
  left join invoice_items as ii on pi.planimg_id=ii.planimg_id
  inner join invoice as i on i.invoice_id=ii.invoice_id
  where cdi.practice_id = ${practice_id} and i.date between '${start_date}' and '${end_date}' ${service_id_imag_sql}
  group by cdi.diagimag_id
  `;

  db.query(sql,(err, result)=>{
    if(err){
      console.log("Error occured in /dashanalytics/salesbyservices : ", err);
      res.json({
        success: false,
        error: err
      })
    }else{
      res.json({
        success: true,
        data: result
      });
    }
  })

});


module.exports = router;
