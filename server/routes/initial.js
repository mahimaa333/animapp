const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');

const db = require('../config/connections');
const config = require('../config/database');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer'),
path = require('path');
EmailTemplate = require('email-templates').EmailTemplate,
Promise = require('bluebird');



function sendEmail(obj){
  return transporter.sendMail(obj);
}

function loadTemplate (templateName , contexts) {
  let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
  return Promise.all(contexts.map((context)=>{
    return new Promise((resolve , reject) => {
      template.render(context,(err, result) => {
        if(err) reject(err);
        else resolve({
          email:result,
          context,
        });
      });
    });
  }));
}

router.get('/', (req,res) => {
  res.send('intial works');
});

router.put('/practice', (req,res) => {
    let practicedetails = {
      name: req.body.name,
      mobile_no: req.body.mobile_no,
      country_code: req.body.country_code,
      currency_symbol: req.body.currency_symbol,
      currency_code: req.body.currency_code,
      speciality: req.body.speciality,
      salesagent_number: req.body.salesagent_number,
      card_no: req.body.card_no,
      website: req.body.website,
      email_id: req.body.email_id,
      logo:req.body.logo,
      tax:req.body.tax,
      clinic_id_name: req.body.clinic_id_name
    };
    let sqltotalcheck = 'SELECT * FROM practice WHERE practice_id=?';
    let querytotalcheck = db.query(sqltotalcheck ,[req.body.practice_id],(err,resulttotal, fields) =>{
      if(resulttotal[0].email_id != req.body.email_id) {
    let sqlemailcheck = 'SELECT * FROM practice WHERE email_id=?';
    let queryemailcheck = db.query(sqlemailcheck,[practicedetails.email_id],(err,resultemail, fields) =>{
      if(err) throw err;
      if(!resultemail.length){
        if(resulttotal[0].mobile_no == req.body.mobile_no){
          let sql = 'UPDATE practice SET ? WHERE practice_id=?';
          let query = db.query(sql,[practicedetails,req.body.practice_id],(err,result) =>{
            if(err) throw err;
              let addressdetails = {
                address: req.body.address.address,
                city: req.body.address.city,
                pincode: req.body.address.pincode,
                locality: req.body.address.locality,
                country: req.body.address.country
              };
              let sql2 = 'UPDATE practice_address SET ? WHERE practice_id=?';
              let query2 = db.query(sql2,[addressdetails,req.body.practice_id],(err,result) =>{
                if(err) throw err;
              });
              res.json({
                success:true
              });
          });
        } else {
          let sqlphonecheck = 'SELECT * FROM practice WHERE mobile_no=?';
          let queryphonecheck = db.query(sqlphonecheck,[practicedetails.mobile_no],(err,resultphone, fields) =>{
            if(err) throw err;
            if(!resultphone.length){
              let sql = 'UPDATE practice SET ? WHERE practice_id=?';
              let query = db.query(sql,[practicedetails,req.body.practice_id],(err,result) =>{
                if(err) throw err;
                  let addressdetails = {
                    address: req.body.address.address,
                    city: req.body.address.city,
                    pincode: req.body.address.pincode,
                    locality: req.body.address.locality,
                    country: req.body.address.country
                  };
                  let sql2 = 'UPDATE practice_address SET ? WHERE practice_id=?';
                  let query2 = db.query(sql2,[addressdetails,req.body.practice_id],(err,result) =>{
                    if(err) throw err;
                  });
                  res.json({
                    success:true
                  });
              });
            } else {
              res.json({
                success:false,
                msg:'Mobile Number already exists'
              });
            }
           });
            }
        } else {
              res.json({
                success:false,
                msg:'Email already exists'
              });
            }
          });
        } else if (resulttotal[0].mobile_no != req.body.mobile_no) {
          let sqlphonecheck = 'SELECT * FROM practice WHERE mobile_no=?';
          let queryphonecheck = db.query(sqlphonecheck,[practicedetails.mobile_no],(err,resultphone, fields) =>{
            if(err) throw err;
            if(!resultphone.length){
              let sql = 'UPDATE practice SET ? WHERE practice_id=?';
              let query = db.query(sql,[practicedetails,req.body.practice_id],(err,result) =>{
                if(err) throw err;
                  let addressdetails = {
                    address: req.body.address.address,
                    city: req.body.address.city,
                    pincode: req.body.address.pincode,
                    locality: req.body.address.locality,
                    country: req.body.address.country
                  };
                  let sql2 = 'UPDATE practice_address SET ? WHERE practice_id=?';
                  let query2 = db.query(sql2,[addressdetails,req.body.practice_id],(err,result) =>{
                    if(err) throw err;
                  });
                  res.json({
                    success:true
                  });
              });
            } else {
              res.json({
                success:false,
                msg:'Mobile Number already exists'
              });
            }
           });
          } else {
            let sql = 'UPDATE practice SET ? WHERE practice_id=?';
            let query = db.query(sql,[practicedetails,req.body.practice_id],(err,result) =>{
              if(err) throw err;
                let addressdetails = {
                  address: req.body.address.address,
                  city: req.body.address.city,
                  pincode: req.body.address.pincode,
                  locality: req.body.address.locality,
                  country: req.body.address.country
                };
                let sql2 = 'UPDATE practice_address SET ? WHERE practice_id=?';
                let query2 = db.query(sql2,[addressdetails,req.body.practice_id],(err,result) =>{
                  if(err) throw err;
                });
                res.json({
                  success:true
                });
            });
          }
        });
      });


router.put('/user', (req,res) => {
  let userdetails = {
    name:req.body.name,
    registration_no:req.body.registration_no,
    mobile_no:req.body.mobile_no,
    card_no:req.body.card_no,
    email_id:req.body.email_id
  };
  let sqltotalcheck = 'SELECT * FROM user WHERE user_id=?';
  let querytotalcheck = db.query(sqltotalcheck ,[req.body.user_id],(err,resulttotal, fields) =>{
    if(resulttotal[0].email_id != req.body.email_id) {
      let sqlemailcheck = 'SELECT * FROM user WHERE email_id=?';
      let queryemailcheck = db.query(sqlemailcheck,[userdetails.email_id],(err,resultemail, fields) =>{
        if(err) throw err;
        if(!resultemail.length){
          if(resulttotal[0].mobile_no == req.body.mobile_no){
            let sql = 'UPDATE user SET ? WHERE user_id=?';
            let query = db.query(sql,[userdetails,req.body.user_id],(err,result) =>{
              if(err) throw err;
              res.json({
                success:true
              });
            });
          } else {
            let sqlphonecheck = 'SELECT * FROM user WHERE mobile_no=?';
            let queryphonecheck = db.query(sqlphonecheck,[userdetails.mobile_no],(err,resultphone, fields) =>{
              if(err) throw err;
              if(!resultphone.length){
            let sql = 'UPDATE user SET ? WHERE user_id=?';
            let query = db.query(sql,[userdetails,req.body.user_id],(err,result) =>{
              if(err) throw err;
              res.json({
                success:true
              });
            });
          } else {
            res.json({
              success:false,
              msg:'Mobile Number already exists'
            });
          }
         });
          }
      } else {
            res.json({
              success:false,
              msg:'Email already exists'
            });
          }
        });
    } else if (resulttotal[0].mobile_no != req.body.mobile_no) {
      let sqlphonecheck = 'SELECT * FROM user WHERE mobile_no=?';
      let queryphonecheck = db.query(sqlphonecheck,[userdetails.mobile_no],(err,resultphone, fields) =>{
        if(err) throw err;
        if(!resultphone.length){
      let sql = 'UPDATE user SET ? WHERE user_id=?';
      let query = db.query(sql,[userdetails,req.body.user_id],(err,result) =>{
        if(err) throw err;
        res.json({
          success:true
        });
      });
    } else {
      res.json({
        success:false,
        msg:'Mobile Number already exists'
      });
    }
    });
  } else {
    let sql = 'UPDATE user SET ? WHERE user_id=?';
    let query = db.query(sql,[userdetails,req.body.user_id],(err,result) =>{
      if(err) throw err;
      res.json({
        success:true
      });
    });
  }
});
});

  router.post('/practice', (req,res) => {
    var clientId_name=(req.body.name).split(" ");
    var clinic_id_name = [];
    clientId_name.forEach(element => {
      clinic_id_name.push(element.slice(0,1));
    });
    let practicedetails = {
      name: req.body.name,
      country_code: req.body.country_code,
      currency_code: req.body.currency_code,
      currency_symbol: req.body.currency_symbol,
      mobile_no: req.body.mobile_no,
      speciality: req.body.speciality,
      salesagent_number: req.body.salesagent_number,
      card_no: req.body.card_no,
      website: req.body.website,
      email_id: req.body.email_id,
      logo: req.body.logo,
      tax:req.body.tax,
      clinic_id_name:clinic_id_name.join("")
    };
    let sqlemailcheck = 'SELECT * FROM practice WHERE email_id=?';
    let queryemailcheck = db.query(sqlemailcheck,[practicedetails.email_id],(err,resultemail, fields) =>{
      if(err) throw err;
      if(!resultemail.length){
        let sqlphonecheck = 'SELECT * FROM practice WHERE mobile_no=? and country_code=?';
        let queryphonecheck = db.query(sqlphonecheck,[practicedetails.mobile_no, practicedetails.country_code],(err,resultphone, fields) =>{
          if(err) throw err;
          if(!resultphone.length){
            let sql = 'INSERT INTO practice SET ?';
            let query = db.query(sql,practicedetails,(err,result) =>{
              if(err) throw err;
              let id = result.insertId;

                let addressdetails = {
                  practice_id:id,
                  address: req.body.address.address,
                  city: req.body.address.city,
                  pincode: req.body.address.pincode,
                  locality: req.body.address.locality,
                  country: req.body.address.country
                };
                let sql2 = 'INSERT INTO practice_address SET ?';
                let query2 = db.query(sql2,addressdetails,(err,result) =>{
                  if(err) throw err;
                });

                let addressAmenity = {
                  practice_id:id,
                  ac_boarding: req.body.ac_boarding,
                  non_ac_boarding: req.body.non_ac_boarding,
                  ambulance_services: req.body.ambulance,
                  open: req.body.open,
                  pharmacy: req.body.pharmacy,
                  store: req.body.store,
                  in_home_diagnostics: req.body.in_house
                };
                let sql3 = 'INSERT INTO practice_amenity SET ?';
                let query3 = db.query(sql3,addressAmenity,(err,result) =>{
                  if(err) throw err;
                });
                res.json({
                  success:true,
                  practice_id: id,
                  name: req.body.name,
                  country_code_country: req.body.country_code+' '+req.body.address.country
                });
            });
      } else {
        res.json({
          success:false,
          msg:'Mobile Number already exists'
        });
      }
     });
    } else {
          res.json({
            success:false,
            msg:'Email already exists'
          });
        }
      });
  });




router.post('/user', (req,res) => {

  console.log(req.body);
  console.log(req.body.insidecheck);
    var password = req.body.user.password;
    var adminuser = req.body.adminuser;
    req.body.user.password = crypto.pbkdf2Sync(req.body.user.password,'this-is-a-text', 100000,60, 'sha512');

    let userdetails = {
      name: req.body.user.name,
      registration_no: req.body.user.registration_no,
      mobile_no:req.body.user.mobile_no,
      card_no: req.body.user.card_no,
      email_id: req.body.user.email_id,
      role: req.body.user.role,
      password: req.body.user.password,
      practice_id: req.body.user.practice_id,
      user_speciality: req.body.user.user_speciality
    };

    let sqlemailcheck = 'SELECT * FROM user WHERE email_id=?';
    let queryemailcheck = db.query(sqlemailcheck,[userdetails.email_id],(err,resultemail, fields) =>{
      if(err) throw err;
      if(!resultemail.length){
        let sqlphonecheck = 'SELECT * FROM user WHERE mobile_no=?';
        let queryphonecheck = db.query(sqlphonecheck,[userdetails.mobile_no],(err,resultphone, fields) =>{
          if(err) throw err;
          if(!resultphone.length){
            let sql = 'INSERT INTO user SET ?';
            let query = db.query(sql,userdetails,(err,result) =>{
              if(err) throw err;
              var payload = {user_id: result.insertId,practice_id: userdetails.practice_id, initialemail: true };
              var token = jwt.sign(payload, config.secret, {
                expiresIn: 86400 //1 day in second
              });
              if(req.body.insidecheck){
                let users = [
                  {
                    password: password,
                    link: req.body.link,
                    username: userdetails.name,
                    token: token,
                    email: userdetails.email_id
                  }
                ];
                console.log(users);
                loadTemplate('initialnewuserverification', users).then((results) => {
                  return Promise.all(results.map((result) => {
                    sendEmail({
                      to:result.context.email,
                      from: '"AnimApp" <care@animapp.in>',
                      subject: result.email.subject,
                      html: result.email.html,
                      text:result.email.text,
                    })
                  }));
                }).then(() => {
                 var currentuserid =  result.insertId;
                  // to add to the subscription table
                  let insertSql = 'INSERT INTO subscription SET ?';
                  let insertInvoiceSql = `INSERT INTO rp_invoice SET ?`;
                  let updateSql = `UPDATE subscription SET state = 'active' WHERE subscription_id = ?`;
                  var subscription = {
                    subscription_id: 'sub_' + 'p' + adminuser.practice_id + 'u' + currentuserid + new Date().getUTCMilliseconds(),
                    state: 'created',
                    practice_id: adminuser.practice_id,
                    user_id: currentuserid,
                    current_start: adminuser.current_start,
                    current_end: adminuser.current_end
                  };
                  var rp_invoice = {
                    subscription_id: 'sub_' + 'p' + subscription.practice_id + 'u' + subscription.user_id + new Date().getUTCMilliseconds(),
                    invoice_number: 'inv_' + 'p' + adminuser.practice_id + 'u' + currentuserid + new Date().getUTCMilliseconds(),
                    date: adminuser.date,
                    amount: adminuser.amount,
                    billing_start: adminuser.current_start,
                    billing_end: adminuser.current_end,
                    practice_id: adminuser.practice_id,
                    user_id: currentuserid
                  };
                  console.log('sub', subscription);
                  console.log('rp-invoice', rp_invoice);
                  db.query(insertSql, subscription, (err, result) => {
                    if (err) throw err;
                  });
                  db.query(insertInvoiceSql, rp_invoice, (err, result) => {
                    if (err) throw err;
                    db.query(updateSql, rp_invoice.subscription_id, (err, result) => {
                      if (err) throw err;
                    });
                  });
                  res.json({
                    success:true,
                    user_id : currentuserid,
                    subscription_id: rp_invoice.subscription_id
                  });

                  // end of subscription
                });
              } else {
                let users = [
                  {
                    link: req.body.link,
                    username: userdetails.name,
                    token: token,
                    email: userdetails.email_id,
                    password: password
                  }
                ];
                console.log(users);
                loadTemplate('initialverification', users).then((results) => {
                  return Promise.all(results.map((result) => {
                    sendEmail({
                      to:result.context.email,
                      from: '"AnimApp" <care@animapp.in>',
                      subject: result.email.subject,
                      html: result.email.html,
                      text:result.email.text,
                    })
                  }));
                }).then(() => {
                  res.json({
                    success:true,
                    user_id : result.insertId
                  });
                });
              }
            });
          } else {
            res.json({
              success:false,
              msg:'Mobile Number already exists'
            });
          }
         });
        } else {
              res.json({
                success:false,
                msg:'Email already exists'
              });
            }
          });
      });


  router.post('/emailverified/:user_id', (req,res) => {
    let sql = 'UPDATE user SET email_verified = 1 WHERE user_id=?';
    let query = db.query(sql, req.params.user_id,(err,result) => {
      if(err) throw err;
      res.json({
        success:true
      });
    });
  });



  router.get('/user/:id', (req,res) => {
    var user_id = req.params.id;
    let selectsql = 'SELECT a.*,b.country_code, c.country FROM user as a LEFT JOIN practice AS b ON a.practice_id=b.practice_id LEFT JOIN practice_address AS c ON a.practice_id=c.practice_id WHERE a.user_id=?';
    let query = db.query(selectsql,user_id,(err,result) =>{
      if(err) throw err;
      let userdetails = {
        user_id: result[0].user_id,
        name:result[0].name,
        registration_no:result[0].registration_no,
        mobile_no:result[0].mobile_no,
        card_no:result[0].card_no,
        email_id:result[0].email_id,
        role:result[0].role,
        practice_id:result[0].practice_id,
        country_code:result[0].country_code,
        country:result[0].country
      };
      res.json({
        success:true,
        practice_id : result[0].practice_id,
        user_name: result[0].name,
        user:userdetails
      })
    });
  });


  router.get('/usersubdetails/:id', (req,res) => {
    var user_id = req.params.id;
    let selectsql = 'SELECT * FROM subscription WHERE user_id = ?';
    let query = db.query(selectsql,user_id,(err,result) =>{
      if(err) throw err;
      res.json({
        success:true,
        subdetails: result[0],
      })
    });
  });



  router.get('/getallusers/:id', (req,res) => {
    var practice_id = req.params.id;
    let selectsql = `
    SELECT
    a.name,
    a.email_id,
    a.mobile_no,
    a.role,
    a.user_id,
    a.practice_id,
    c.name as practice_name,
    c.country_code,
    d.country,
    b.*
    FROM user as a
    LEFT JOIN practice as c ON a.practice_id = c.practice_id
    LEFT JOIN practice_address as d on a.practice_id=d.practice_id
    LEFT JOIN subscription as b ON a.user_id = b.user_id
    WHERE a.practice_id = ?`;
    let query = db.query(selectsql, practice_id, (err,result) =>{
      console.log(result);
      if(err) throw err;
      if (result.length) {
        res.json({
          success:true,
          user: result,
          country_code_country: result[0].country_code+" "+result[0].country
        });
      } else {
        res.json({
          success:false,
          error: 'No user records found'
        })
      }
    });
  });


  // router.get('/getallusers/:id', (req,res) => {
  //   var practice_id = req.params.id;
  //   let selectsql = 'SELECT * FROM user WHERE practice_id = ?';
  //   let query = db.query(selectsql,practice_id,(err,result) =>{
  //     if(err) throw err;
  //     res.json({
  //       success:true,
  //       user: result
  //     })
  //   });
  // });



  router.get('/citydropdown', (req,res) => {
    var city = [];
    let selectsql = 'SELECT * FROM dropdown_city';
    let query = db.query(selectsql,(err,result) =>{
      if(err) throw err;
      for (var i = 0; i < result.length; i++) {
        city.push({
          label: result[i].city,
          value:{city: result[i].city, pincode: result[i].pincode}
        });
      }
      res.json({
        city:city
      })
    });
  });


  router.get('/dashboard/invoicemonths/:practice_id/:user_id', (req,res) => {
    if(req.params.user_id !== 'null') {
    console.log('insidedashboardinvoicemonthsssssssss',req.params.practice_id, req.params.user_id);
    let sql = 'SELECT date FROM `invoice` WHERE `practice_id` = ? AND `user_id`= ? ORDER BY invoice_id ASC limit 1';
    let query = db.query(sql,[req.params.practice_id, req.params.user_id],(err,resultstartdate) => {
    if(resultstartdate.length){
    let sql = 'SELECT date FROM `invoice` WHERE `practice_id` = ? AND `user_id`= ? ORDER BY invoice_id DESC limit 1';
    let query = db.query(sql,[req.params.practice_id, req.params.user_id] ,(err,resultendate) => {
    if(err) throw err;
    res.json({
    success:true,
    startdate: resultstartdate[0].date,
    enddate: resultendate[0].date
    });
    });
    } else {
    res.json({
    success:false
    });
    }
    });
    } else {
    console.log('notinsidedashboardinvoicemonthsssssssss');
    let sql = 'SELECT date FROM `invoice` WHERE `practice_id` = ? ORDER BY invoice_id ASC limit 1';
    let query = db.query(sql, req.params.practice_id,(err,resultstartdate) => {
    if(resultstartdate.length){
    console.log(resultstartdate[0].date);
    let sql = 'SELECT date FROM `invoice` WHERE `practice_id` = ? ORDER BY invoice_id DESC limit 1';
    let query = db.query(sql, req.params.practice_id,(err,resultendate) => {
    console.log(resultendate[0].date);
    if(err) throw err;
    res.json({
    success:true,
    startdate: resultstartdate[0].date,
    enddate: resultendate[0].date
    });
    });
    } else {
    res.json({
    success:false
    });
    }
    });
    }
    });


    router.get('/dashboard/patientmonths/:practice_id/:user_id', (req,res) => {
      if(req.params.user_id !== 'null') {
      console.log('insidedashboardinvoicemonthsssssssss',req.params.practice_id, req.params.user_id);
      let sql = 'SELECT timestamp FROM `record` WHERE `practice_id` = ? AND `user_id`= ? ORDER BY timestamp ASC limit 1';
      let query = db.query(sql,[req.params.practice_id, req.params.user_id],(err,resultstartdate) => {
      if(resultstartdate.length){
      console.log(resultstartdate[0].timestamp);
      let sql = 'SELECT timestamp FROM `record` WHERE `practice_id` = ? AND `user_id`= ? ORDER BY timestamp DESC limit 1';
      let query = db.query(sql,[req.params.practice_id, req.params.user_id] ,(err,resultendate) => {
      console.log(resultendate[0].timestamp);
      if(err) throw err;
      res.json({
      success:true,
      startdate: resultstartdate[0].timestamp,
      enddate: resultendate[0].timestamp
      });
      });
      } else {
      res.json({
      success:false
      });
      }
      });
      } else {
      console.log('notinsidedashboardinvoicemonthsssssssss');
      let sql = 'SELECT timestamp FROM `record` WHERE `practice_id` = ? ORDER BY timestamp ASC limit 1';
      let query = db.query(sql, req.params.practice_id,(err,resultstartdate) => {
      if(resultstartdate.length){
      console.log(resultstartdate[0].timestamp);
      let sql = 'SELECT timestamp FROM `record` WHERE `practice_id` = ? ORDER BY timestamp DESC limit 1';
      let query = db.query(sql, req.params.practice_id,(err,resultendate) => {
      console.log(resultendate[0].timestamp);
      if(err) throw err;
      res.json({
      success:true,
      startdate: resultstartdate[0].timestamp,
      enddate: resultendate[0].timestamp
      });
      });
      } else {
      res.json({
      success:false
      });
      }
      });
      }
      });

      router.get('/dashboard/inventorymonths/:practice_id/:user_id', (req,res) => {
        // if(req.params.user_id !== 'null') {
        // console.log('insidedashboardinvoicemonthsssssssss',req.params.practice_id, req.params.user_id);
        // let sql = 'SELECT timestamp FROM `consumed_stock` WHERE `practice_id` = ? AND `user_id`= ? ORDER BY consumed_id ASC limit 1';
        // let query = db.query(sql,[req.params.practice_id, req.params.user_id],(err,resultstartdate) => {
        // console.log(resultstartdate[0].timestamp);
        // let sql = 'SELECT timestamp FROM `consumed_stock` WHERE `practice_id` = ? AND `user_id`= ? ORDER BY consumed_id DESC limit 1';
        // let query = db.query(sql,[req.params.practice_id, req.params.user_id] ,(err,resultendate) => {
        // console.log(resultendate[0].timestamp);
        // if(err) throw err;
        // res.json({
        // success:true,
        // startdate: resultstartdate[0].timestamp,
        // enddate: resultendate[0].timestamp
        // });
        // });
        // });
        // } else {
        console.log('notinsidedashboardinvoicemonthsssssssss');
        let sql = 'SELECT timestamp FROM `consumed_stock` WHERE `practice_id` = ? ORDER BY consumed_id ASC limit 1';
        let query = db.query(sql, req.params.practice_id,(err,resultstartdate) => {
        if(resultstartdate.length){
        console.log(resultstartdate[0].timestamp);
        let sql = 'SELECT timestamp FROM `consumed_stock` WHERE `practice_id` = ? ORDER BY consumed_id DESC limit 1';
        let query = db.query(sql, req.params.practice_id,(err,resultendate) => {
        console.log(resultendate[0].timestamp);
        if(err) throw err;
        res.json({
        success:true,
        startdate: resultstartdate[0].timestamp,
        enddate: resultendate[0].timestamp
        });
        });
      } else {
        res.json({
        success:false
        });
        }
        });

        // }
        });
  module.exports=router;
