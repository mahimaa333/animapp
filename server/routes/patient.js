const express = require('express');
const router = express.Router();

const db = require('../config/connections');


  router.get('/', (req,res) => {
    res.send('patient works');
  });


  router.post("/priorhistory", (req, res) => {
    var temp = req.body.priorhistory;
    var checkcat = req.body.checkcat;
    // if(checkcat) {
    //   var vacc = temp.catvacc;

    // }
    var med_history = temp.priormeds;

    var priorhistory = {
      obtained:temp.obtained,
      resides:temp.resides,
      diet:temp.diet,
      name:temp.name,
      litter_box:temp.litter_box,
      flea_prevent:temp.flea_prevent,
      dewormed:temp.dewormed,
      phy_exam:temp.phy_exam,
      dent_exam:temp.dent_exam,
      surgeries:temp.surgeries,
      diag_test:temp.diag_test,
      add_notes:temp.add_notes,
      microchip:temp.microchip,
      microchip_no:temp.microchip_no,
      mated_before:temp.mated_before,
      mated_litter:temp.mated_litter,
      mated_lngbck:temp.mated_lngbck,
      practice_id:temp.practice_id,
      user_id:temp.user_id,
      patient_id:temp.patient_id,
    }

    let sql = "INSERT INTO prior_history SET ?";
    let query = db.query(sql, priorhistory, (err, result) => {
      if (err) throw err;
      let id = result.insertId;
      for (i = 0; i < med_history.length; i++) {
            let med_his = {
              prior_illness: med_history[i].prior_illness,
              current_med: med_history[i].current_med,
              allergies: med_history[i].allergies,
              prior_id: id,
            };
        let sql1 = "INSERT INTO prior_medhistory SET ?";
        db.query(sql1, med_his, (err, result, fields) => {
        });
      }

      if(checkcat) {
        var cat_vacc = temp.catvacc;
        var catvacc = {
          rabies:cat_vacc.rabies,
          panleuvirus:cat_vacc.panleuvirus,
          rhinotrac:cat_vacc.rhinotrac,
          calcivirus:cat_vacc.calcivirus,
          feline:cat_vacc.feline,
          other:cat_vacc.other,
          prior_id:id
      }
      let sql2 = "INSERT INTO prior_catvacc SET ?";
      db.query(sql2, catvacc, (err, result, fields) => {
      });
    }


    if(!checkcat) {
      var dog_vacc = temp.dogvacc;
      var dogvacc = {
        rabies:dog_vacc.rabies,
        parvovirus:dog_vacc.parvovirus,
        hepatitis:dog_vacc.hepatitis,
        canine:dog_vacc.canine,
        other:dog_vacc.other,
        prior_id:id
    }
    let sql3 = "INSERT INTO prior_dogvacc SET ?";
    db.query(sql3, dogvacc, (err, result, fields) => {
    });
    }
    res.json({
      success:true,
      prior_id:id
    });
    });
 
  });


  router.get("/priorhistory/:patientid/:checkcat", (req, res) => {
    var patientid = req.params.patientid;
    var checkcat = req.params.checkcat;
    var medHis = [];
    let sql = `SELECT * FROM prior_history WHERE patient_id=?`;
    let query = db.query(sql, patientid, (err, result) => {
      if (err) throw err;
      if (!result.length) {
        res.json({ 
          success:false,
          msg:"error no record found" 
        });
      } else {
      var prior_id = result[0].prior_id;
      var timestamp = result[0].timestamp;
      var priorhistory = {
        obtained:result[0].obtained,
        resides:result[0].resides,
        diet:result[0].diet,
        name:result[0].name,
        litter_box:result[0].litter_box,
        flea_prevent:result[0].flea_prevent,
        dewormed:result[0].dewormed,
        phy_exam:result[0].phy_exam,
        dent_exam:result[0].dent_exam,
        surgeries:result[0].surgeries,
        diag_test:result[0].diag_test,
        add_notes:result[0].add_notes,
        microchip:result[0].microchip,
        microchip_no:result[0].microchip_no,
        mated_before:result[0].mated_before,
        mated_litter:result[0].mated_litter,
        mated_lngbck:result[0].mated_lngbck,
      }


      let sql2 = 'SELECT * FROM prior_medhistory WHERE prior_id=?';   
      db.query(sql2, prior_id, (err, result2) => {
        console.log(result2);
        if (err){
          console.log("Error Occured in prior history ");
          console.log("error is : ",err);
          res.json({
            success: false
          })
        }else{
          if(checkcat == 'true'){
            let sql = `SELECT * FROM prior_catvacc WHERE prior_id=?`;
            let query = db.query(sql, prior_id, (err, resultcat) => {              
              if (err) throw err;
                var cat_vacc = {
                  rabies:resultcat[0].rabies,
                  panleuvirus:resultcat[0].panleuvirus,
                  rhinotrac:resultcat[0].rhinotrac,
                  calcivirus:resultcat[0].calcivirus,
                  feline:resultcat[0].feline,
                  other:resultcat[0].other,
                }
                res.json({
                  success:true,
                  priorhistory:priorhistory,
                  priormeds:result2,
                  catvacc:cat_vacc,
                  timestamp:timestamp,
                  prior_id:prior_id
                });
            });
          } 
          if(checkcat == 'false'){
            let sql = `SELECT * FROM prior_dogvacc WHERE prior_id=?`;
            let query = db.query(sql, prior_id, (err, resultdog) => {
              if (err) throw err;
                var dog_vacc = {
                  rabies:resultdog[0].rabies,
                  parvovirus:resultdog[0].parvovirus,
                  hepatitis:resultdog[0].hepatitis,
                  canine:resultdog[0].canine,
                  other:resultdog[0].other,
                }
                res.json({
                  success:true,
                  priorhistory:priorhistory,
                  priormeds:result2,
                  dogvacc:dog_vacc,
                  timestamp:timestamp,
                  prior_id:prior_id
                });
            });
          }
        }        
      });
    }
  });
 
  });



  router.get("/medhistory/:patientid", (req, res) => {
    var patientid = req.params.patientid;
    let sql = `SELECT * FROM emr_records WHERE patient_id=?`;
    let query = db.query(sql, patientid, (err, result) => {
      if (err) throw err;
      if (!result.length) {
        res.json({ 
          success:false,
          msg:"error no record found" 
        });
      } else {
        res.json({
          success:true,
          url:result[0].url,
        });
      }
    });
  });



  router.put("/priorhistory", (req, res) => {

    var temp = req.body.priorhistory;
    var checkcat = req.body.checkcat;
    var prior_id  = req.body.prior_id;
    var deletedMeds = req.body.deleted;
    // if(checkcat) {
    //   var vacc = temp.catvacc;

    // }

    var med_history = temp.priormeds;
    var priorhistory = {
      obtained:temp.obtained,
      resides:temp.resides,
      diet:temp.diet,
      name:temp.name,
      litter_box:temp.litter_box,
      flea_prevent:temp.flea_prevent,
      dewormed:temp.dewormed,
      phy_exam:temp.phy_exam,
      dent_exam:temp.dent_exam,
      surgeries:temp.surgeries,
      diag_test:temp.diag_test,
      add_notes:temp.add_notes,
      microchip:temp.microchip,
      microchip_no:temp.microchip_no,
      mated_before:temp.mated_before,
      mated_litter:temp.mated_litter,
      mated_lngbck:temp.mated_lngbck,
    }
    
    deletedMeds.map(insidedelete => {
      let sqldelete = 'DELETE FROM prior_medhistory WHERE medhistory_id=?';
        db.query(sqldelete,insidedelete.medhistory_id, (err, resultcheck) => {
        if(err) throw err;
      });
    });

    let sql = "UPDATE prior_history SET ? WHERE prior_id=?";
    let query = db.query(sql,[priorhistory,prior_id], (err, result) => {
      if (err) throw err;
      let id = result.insertId;

      if(med_history.length == 0){
      }else{
        console.log(med_history.medhistory_id);
      for (i = 0; i < med_history.length; i++) {
        if(med_history[i].medhistory_id){
            let med_his = {
              prior_illness: med_history[i].prior_illness,
              current_med: med_history[i].current_med,
              allergies: med_history[i].allergies,
            };
        let sql1 = "UPDATE prior_medhistory SET ? WHERE medhistory_id = ?";
        db.query(sql1,[med_his,med_history[i].medhistory_id], (err, result, fields) => {
          if (err) throw err;
        });
      } else {
        let med_his = {
          prior_illness: med_history[i].prior_illness,
          current_med: med_history[i].current_med,
          allergies: med_history[i].allergies,
          prior_id: prior_id
        };
        let sql1 = "INSERT INTO prior_medhistory SET ?";
        db.query(sql1, med_his, (err, result, fields) => {
          if (err) throw err;
        });
      }
    }
  }



      if(checkcat) {
        var cat_vacc = temp.catvacc;
        var catvacc = {
          rabies:cat_vacc.rabies,
          panleuvirus:cat_vacc.panleuvirus,
          rhinotrac:cat_vacc.rhinotrac,
          calcivirus:cat_vacc.calcivirus,
          feline:cat_vacc.feline,
          other:cat_vacc.other,
      }
      let sql2 = " UPDATE prior_catvacc SET ? WHERE prior_id=?";
      db.query(sql2,[catvacc,prior_id], (err, result, fields) => {
        if (err) throw err;
        res.json({
          success:true,
          prior_id:prior_id
        });
      });
    }


    if(!checkcat) {
      var dog_vacc = temp.dogvacc;
      var dogvacc = {
        rabies:dog_vacc.rabies,
        parvovirus:dog_vacc.parvovirus,
        hepatitis:dog_vacc.hepatitis,
        canine:dog_vacc.canine,
        other:dog_vacc.other,
    }
    let sql3 = " UPDATE prior_dogvacc SET ? WHERE prior_id=?";
    db.query(sql3, [dogvacc, prior_id], (err, result, fields) => {
      if (err) throw err;
      res.json({
        success:true,
        prior_id:prior_id
      });
    });
    }
    });
 

 
  });





router.get('/getallcreditnote/:practice_id/:first/:rows/:status', (req, res) => {
  console.log('dooddd adsfasdfas');
  var status = req.params.status;
  var first = parseInt(req.params.first, 10);
  var rows = parseInt(req.params.rows, 10);
  var practice_id = req.params.practice_id;
  let totalRecordsSql;
  let sql;
  let totalRecordsArgs = [];
  let sqlArgs = [];
  if (status === 'null') {
    totalRecordsSql = `SELECT COUNT(creditnote_id) as total_records FROM credit_notes WHERE practice_id = ?`;
    sql = `SELECT
              a.*,
              b.name,
              b.email_id
            FROM credit_notes as a
            INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
            WHERE a.practice_id = ?
            GROUP BY creditnote_id
            ORDER BY creditnote_id DESC
            LIMIT ?, ?`;
    totalRecordsArgs = [practice_id];
    sqlArgs = [practice_id, first, rows];
  } else {
    totalRecordsSql = `SELECT COUNT(creditnote_id) as total_records FROM credit_notes WHERE practice_id = ? AND status = ?`;
    sql = `SELECT
              a.*,
              b.name,
              b.email_id
            FROM credit_notes as a
            INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
            WHERE a.practice_id = ? AND a.status = ?
            GROUP BY creditnote_id
            ORDER BY creditnote_id DESC
            LIMIT ?, ?`;
    totalRecordsArgs = [practice_id, status];
    sqlArgs = [practice_id, status, first, rows];
  }
  let query = db.query(totalRecordsSql, totalRecordsArgs, (err, result) => {
    if (err) throw err;
    console.log(result);
    var total_records = result[0].total_records;
    db.query(sql, sqlArgs, (err, result) => {
      if (err) throw err;
      res.send({result: result.length ? result : [{msg: 'No records found!'}], total_records: total_records,change: true});
    });
  });
});


  router.get("/outstandingamount/:pet_parent_id", (req, res) => {

    console.log('working ont he outstanding');
    var pet_parent_id = req.params.pet_parent_id;
    var outstandingHistory = [];
    let paidSql = `SELECT a.*, b.name as patientname
                  FROM invoice as a LEFT JOIN patient as b ON a.patient_id = b.patient_id
                  WHERE a.pet_parent_id = ? AND a.status = 'Paid'`;
    let sql = "SELECT a.*, b.name as patientname FROM invoice as a LEFT JOIN patient as b ON a.patient_id = b.patient_id WHERE a.pet_parent_id = ? AND a.status = 'Outstanding'";
    db.query(paidSql, pet_parent_id, (err, paidInvoices) => {
      if (err) throw err;
      db.query(sql,pet_parent_id, (err, result, fields) => {
        if (err) throw err;
        for (i = 0; i < result.length; i++) {
          console.log('invoice_id', result[i].invoice_id);
          let temp = {
            invoice_id : result[i].invoice_id,
            final_discount: result[i].final_discount,
            ref : result[i].ref,
            payment_type: result[i].payment_type,
            total: result[i].total,
            status: result[i].status,
            pet_parent_id: result[i].pet_parent_id,
            patient_id: result[i].patient_id,
            patientname: result[i].patientname,
            credits: result[i].credits,
          }
          let sqlcheck = "SELECT * FROM payment WHERE invoice_id = ? ORDER BY payment_id DESC LIMIT 1";
          db.query(sqlcheck, result[i].invoice_id, (err, resultpay, fields) => {
            if (err) throw err;
            if (resultpay.length) {
              outstandingHistory.push({
                date: resultpay[0].date,
                outstanding: resultpay[0].outstanding,
                timestamp: resultpay[0].timestamp,
                invoice_id : temp.invoice_id,
                ref : temp.ref,
                payment_type: temp.payment_type,
                total: temp.total,
                status: temp.status,
                final_discount: temp.final_discount,
                pet_parent_id: temp.pet_parent_id,
                patient_id: temp.patient_id,
                patientname: temp.patientname,
                credits: temp.credits
              });
            }
          });
        }
        let sqlss = "SELECT * FROM invoice WHERE pet_parent_id = ? AND status = 'Outstanding'";
        db.query(sqlss, pet_parent_id, (err, result, fields) => {
          if (err) throw err;
          console.log(outstandingHistory);
          res.json({
            success:true,
            history:outstandingHistory,
            paidInvoices: paidInvoices
          });
        });
      });
    });
  });

  



  router.get("/creditnotesamount/:pet_parent_id", (req, res) => {
    console.log('asdfsadfcbecing credits amount');
    var pet_parent_id = req.params.pet_parent_id;
    let sql = "SELECT a.*, b.name, b.email_id FROM credit_notes as a INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE a.pet_parent_id = ?";
    db.query(sql,pet_parent_id, (err, result, fields) => {
      if (err) throw err;
        if(result){
          res.json({
            success:true,
            history:result
          }); 
        } else {
          success:false
        }
    });
  });





module.exports=router;