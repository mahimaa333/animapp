const express = require("express");
const cors = require("cors");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");


const db = require('../config/connections');

router.use(cors());

router.get("/", (req, res) => {
  res.send("soap works");
});

router.post("/subjective", (req, res) => {
  temp = req.body.subjective;
  record_id = req.body.record_id;

  let subjectivemain = {
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id,
    addnotes: temp.addnotes,
    appetite: temp.appetite,
    attid: temp.attid,
    attidnotes: temp.attidnotes,
    drinking: temp.drinking,
    notice: temp.notice,
    poopng: temp.poopng,
    poopngnotes: temp.poopngnotes,
    urnatng: temp.urnatng,
    urnatngnotes: temp.urnatngnotes,
    cheifcom: temp.chiefcom,
    duration: temp.duration
  };

  let sql = "INSERT INTO subjective SET ?";
  let query = db.query(sql, subjectivemain, (err, result) => {
    if (err) throw err;
    let id = result.insertId;

    var sql2 = "UPDATE record SET subject_id = ? WHERE record_id = ?";
    let query2 = db.query(sql2, [id, record_id], (err, result) => {
      if (err) throw err;
    });
    res.send({ subjectinsert_id: id });
    // for(var i=0; i<temp.complaints.length; i++){
    //   let subjectivecomp = {
    //     durtime:temp.complaints[i].durtime,
    //     dur:temp.complaints[i].dur,
    //     cheifcom:temp.complaints[i].chiefcom,
    //     subject_id:id
    //   };
    //   let sql2 = 'INSERT INTO sub_complaint SET ?';
    //     let query2 = db.query(sql2,subjectivecomp,(err,result) =>{
    //       if(err) throw err;
    //       console.log(result);
    //   });
    // };
  });
});

router.post("/planning", (req, res) => {
  var temp = req.body.planning;
  var record_id = req.body.record_id;
  var invoice_id = req.body.invoice_id;
  var planning = {
    plan: temp.treatmentPlan,
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id
  };
  var procedures = temp.procedures;
  var labOrders = temp.labOrders;
  var imagingOrders = temp.imagingOrders;
  var inventoryOrders = temp.inventoryOrders;


  let sql = "INSERT INTO planning SET ?";
  let query = db.query(sql, planning, (err, result) => {
    if (err) throw err;
    let id = result.insertId;
    for (i = 0; i < procedures.length; i++) {
      let procedure = {
        test: procedures[i].procedure,
        instruction: procedures[i].instruction,
        plan_id: result.insertId,
        proc_id: procedures[i].proc_id
      };
      let invoiceprocedure = {
        name: procedures[i].name,
        quantity: procedures[i].quantity,
        retail_price: procedures[i].retail_price,
        tax: procedures[i].tax,
        total: procedures[i].total,
        invoice_id: invoice_id
      }
      let totalproc = parseFloat((procedures[i].quantity * procedures[i].total) + ((procedures[i].quantity * procedures[i].total) * (procedures[i].tax / 100)));
      let sql1 = "INSERT INTO plan_procedures SET ?";
      db.query(sql1, procedure, (err, resultproc) => {
        if (err) throw err;
        invoiceprocedure.procedure_id = resultproc.insertId;
        let sqlinvoiceproc = "INSERT INTO invoice_items SET ?";
        db.query(sqlinvoiceproc, invoiceprocedure, (err, resultinvproc) => {
          if (err) throw err;
          let updateSqlproc = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
          db.query(updateSqlproc, [totalproc, invoice_id], (err, resulttotalproc) => {
            if (err) throw err;
          });
        });
      });
    }
    for (j = 0; j < labOrders.length; j++) {
      let labOrder = {
        test: labOrders[j].test,
        instruction: labOrders[j].instruction,
        diaglab_id: labOrders[j].diaglab_id,
        plan_id: result.insertId
      };
      let invoicelab = {
        name: labOrders[j].name,
        quantity: labOrders[j].quantity,
        retail_price: labOrders[j].retail_price,
        tax: labOrders[j].tax,
        total: labOrders[j].total,
        invoice_id: invoice_id
      }
      let totallab = parseFloat((labOrders[j].quantity * labOrders[j].total) + ((labOrders[j].quantity * labOrders[j].total) * (labOrders[j].tax / 100)));
      let sql2 = "INSERT INTO plan_lab SET ?";
      db.query(sql2, labOrder, (err, resultlab) => {
        if (err) throw err;
        invoicelab.planlab_id = resultlab.insertId;
        let sqlinvoicelab = "INSERT INTO invoice_items SET ?";
        db.query(sqlinvoicelab, invoicelab, (err, resultinvlab) => {
          if (err) throw err;
          let updateSqllab = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
          db.query(updateSqllab, [totallab, invoice_id], (err, resulttotallab) => {
            if (err) throw err;
          });
        });
      });
    }
    for (k = 0; k < imagingOrders.length; k++) {
      let imagingOrder = {
        test: imagingOrders[k].test,
        instruction: imagingOrders[k].instruction,
        diagimag_id: imagingOrders[k].diagimag_id,
        plan_id: result.insertId
      };
      let invoiceimag = {
        name: imagingOrders[k].name,
        quantity: imagingOrders[k].quantity,
        retail_price: imagingOrders[k].retail_price,
        tax: imagingOrders[k].tax,
        total: imagingOrders[k].total,
        invoice_id: invoice_id
      }
      let totalimag = parseFloat((imagingOrders[k].quantity * imagingOrders[k].total) + ((imagingOrders[k].quantity * imagingOrders[k].total) * (imagingOrders[k].tax / 100)));
      let sql3 = "INSERT INTO plan_imaging SET ?";
      db.query(sql3, imagingOrder, (err, resultimag) => {
        if (err) throw err;
        invoiceimag.planimg_id = resultimag.insertId;
        let sqlinvoiceimag = "INSERT INTO invoice_items SET ?";
        db.query(sqlinvoiceimag, invoiceimag, (err, resultinvimag) => {
          if (err) throw err;
          let updateSqlimag = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
          db.query(updateSqlimag, [totalimag, invoice_id], (err, resulttotalimag) => {
            if (err) throw err;
          });
        });
      });
    }
    for (l = 0; l < inventoryOrders.length; l++) {
      if (inventoryOrders[l].itemstock_id && inventoryOrders[l].item_id) {
        let treatment = {
          plan_id: result.insertId,
          name: inventoryOrders[l].name,
          c_quantity: inventoryOrders[l].c_quantity,
          stock_unit: inventoryOrders[l].stock_unit,
          stock_selected: inventoryOrders[l].stock_selected,
          item_id: inventoryOrders[l].item_id,
          itemstock_id: inventoryOrders[l].itemstock_id,
          batch_no: inventoryOrders[l].batch_no,
          quantity: inventoryOrders[l].quantity,
          retail_price: inventoryOrders[l].retail_price,
          tax: inventoryOrders[l].tax,
          total: inventoryOrders[l].total
        };
        let InventoryOrder = {
          name: inventoryOrders[l].name,
          c_quantity: inventoryOrders[l].c_quantity,
          stock_unit: inventoryOrders[l].stock_unit,
          plan_id: result.insertId
        };
        let sql1 = "INSERT INTO record_consumables SET ?";
        db.query(sql1, treatment, (err, resulttreat) => {
          if (err) throw err;
          let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel - ? WHERE item_id=?`;
          let consumeSql = `INSERT INTO consumed_stock SET ?`;
          let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel - ? WHERE itemstock_id = ?`;
          let consumed = {
            consumed_stocklevel: treatment.quantity,
            practice_id: planning.practice_id,
            user_id: planning.user_id,
            item_id: treatment.item_id,
            itemstock_id: treatment.itemstock_id,
            status: 'consumed',
            recordconsume_id: resulttreat.insertId,

            name: treatment.name,
            batch_no: treatment.batch_no,
            c_quantity: treatment.c_quantity,
            unit: treatment.stock_unit,
            total: treatment.total,
            patient_id: temp.patient_id
          };
          db.query(consumeSql, consumed, (err, result) => {
            if (err) throw err;
          });
          InventoryOrder.recordconsume_id = resulttreat.insertId;
          let sql3 = "INSERT INTO plan_treatments SET ?";
          db.query(sql3, InventoryOrder, (err, resultimag) => {
            if (err) throw err;
          });
          db.query(stockSql, [treatment.quantity, treatment.itemstock_id], (err, result) => {
            if (err) throw err;
          });
          db.query(updateItemSql, [treatment.quantity, treatment.item_id], (err, result) => {
            if (err) throw err;
          });
        });
      } else {
        let InventoryOrder = {
          name: inventoryOrders[l].name,
          c_quantity: inventoryOrders[l].c_quantity,
          stock_unit: inventoryOrders[l].stock_unit,
          plan_id: result.insertId,
          recordconsume_id: 0
        };
        let sql3 = "INSERT INTO plan_treatments SET ?";
        db.query(sql3, InventoryOrder, (err, resultimag) => {
          if (err) throw err;
        });
      }
    }
    let sql4 = "UPDATE record SET plan_id = ? WHERE record_id = ?";
    db.query(sql4, [result.insertId, record_id], (err, result) => {
      if (err) throw err;
    });
    let sqlinvupdate = "UPDATE invoice SET plan_id = ? WHERE invoice_id = ?";
    db.query(sqlinvupdate, [result.insertId, invoice_id], (err, result) => {
      if (err) throw err;
    });
    res.send({ planinsert_id: id });
  });
});



router.put('/planning', (req, res) => {
  var temp = req.body.planning;
  var plan_id = req.body.plan_id;
  var invoice_id = req.body.invoice_id;

  var deletedarray = req.body.deleted;

  console.log(deletedarray);

  var planningpractice = {
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id
  };

  var planning = {
    plan: temp.treatmentPlan,
  }

  var procedures = temp.procedures;
  var labOrders = temp.labOrders;
  var imagingOrders = temp.imagingOrders;
  var inventoryOrders = temp.inventoryOrders;


  let sql = 'UPDATE planning SET ? WHERE plan_id=? ';
  let query = db.query(sql, [planning, plan_id], (err, result) => {


    deletedarray.deletedplanimaging.map(imagdelete => {
      let sqldelete = 'DELETE FROM plan_imaging WHERE planimg_id=?';
      db.query(sqldelete, imagdelete.planimg_id, (err, resultcheck) => {
        if (err) throw err;

        var total = parseFloat((imagdelete.quantity * imagdelete.retail_price) + ((imagdelete.quantity * imagdelete.retail_price) * (imagdelete.tax / 100)));
        console.log('total: ', total);
        let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
        let sql = `DELETE FROM invoice_items WHERE invoice_id=? AND planimg_id=?`;
        let query = db.query(sql, [imagdelete.invoice_id, imagdelete.planimg_id], (err, result) => {
          if (err) throw err;
          db.query(updateSql, [total, imagdelete.invoice_id], (err, result) => {
            if (err) throw err;
          });
        });


      });
    });


    deletedarray.deletedplanlabs.map(labdelete => {
      let sqldelete = 'DELETE FROM plan_lab WHERE planlab_id=?';
      db.query(sqldelete, labdelete.planlab_id, (err, resultcheck) => {
        if (err) throw err;

        var total = parseFloat((labdelete.quantity * labdelete.retail_price) + ((labdelete.quantity * labdelete.retail_price) * (labdelete.tax / 100)));
        console.log('total: ', total);
        let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
        let sql = `DELETE FROM invoice_items WHERE invoice_id=? AND planlab_id=?`;
        let query = db.query(sql, [labdelete.invoice_id, labdelete.planlab_id], (err, result) => {
          if (err) throw err;
          db.query(updateSql, [total, labdelete.invoice_id], (err, result) => {
            if (err) throw err;
          });
        });


      });
    });

    deletedarray.deletedplanprocedure.map(procdelete => {
      let sqldelete = 'DELETE FROM plan_procedures WHERE procedure_id=?';
      db.query(sqldelete, procdelete.procedure_id, (err, resultcheck) => {
        if (err) throw err;

        var total = parseFloat((procdelete.quantity * procdelete.retail_price) + ((procdelete.quantity * procdelete.retail_price) * (procdelete.tax / 100)));
        console.log('total: ', total);
        let updateSql = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END - ? WHERE invoice_id = ?`;
        let sql = `DELETE FROM invoice_items WHERE invoice_id=? AND procedure_id=?`;
        let query = db.query(sql, [procdelete.invoice_id, procdelete.procedure_id], (err, result) => {
          if (err) throw err;
          db.query(updateSql, [total, procdelete.invoice_id], (err, result) => {
            if (err) throw err;
          });
        });

      });
    });


    deletedarray.deletedinventory.map(invdelete => {
      console.log('check this to delete items', invdelete);
      console.log(invdelete.recordconsume_id);
      if (invdelete.itemstock_id && invdelete.item_id) {
        console.log('inside the record delete');
        console.log('check this to delete items', invdelete);
        let sqldelete = 'DELETE FROM record_consumables WHERE recordconsume_id=?';
        db.query(sqldelete, invdelete.recordconsume_id, (err, resultcheck) => {
          if (err) throw err;
          let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel + ? WHERE item_id=?`;
          let consumeSql = `INSERT INTO consumed_stock SET ?`;
          let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel + ? WHERE itemstock_id = ?`;
          let consumed = {
            consumed_stocklevel: invdelete.quantity,
            practice_id: planningpractice.practice_id,
            user_id: planningpractice.user_id,
            item_id: invdelete.item_id,
            itemstock_id: invdelete.itemstock_id,
            status: 'deleted',
            recordconsume_id: invdelete.recordconsume_id,

            name: invdelete.name,
            batch_no: invdelete.batch_no,
            c_quantity: invdelete.c_quantity,
            unit: invdelete.stock_unit,
            total: invdelete.total,
            patient_id: temp.patient_id
          };
          db.query(consumeSql, consumed, (err, result) => {
            if (err) throw err;
          });
          db.query(stockSql, [invdelete.quantity, invdelete.itemstock_id], (err, result) => {
            if (err) throw err;
          });
          db.query(updateItemSql, [invdelete.quantity, invdelete.item_id], (err, result) => {
            if (err) throw err;
          });
        });
      } else {
        console.log('outside the record delete');
        let sqldelete = 'DELETE FROM plan_treatments WHERE plantreat_id=?';
        db.query(sqldelete, invdelete.plantreat_id, (err, resultcheck) => {
          if (err) throw err;
        });
      }
    });









    for (i = 0; i < procedures.length; i++) {
      if (procedures[i].procedure_id) {
        let procedure = {
          instruction: procedures[i].instruction
        };
        let sql1 = "UPDATE plan_procedures SET ? WHERE procedure_id = ?";
        db.query(sql1, [procedure, procedures[i].procedure_id], (err, resultproc) => {
          if (err) throw err;
        });
      } else {
        let procedure = {
          test: procedures[i].procedure,
          instruction: procedures[i].instruction,
          proc_id: procedures[i].proc_id,
          plan_id: plan_id
        };
        let invoiceprocedure = {
          name: procedures[i].name,
          quantity: procedures[i].quantity,
          retail_price: procedures[i].retail_price,
          tax: procedures[i].tax,
          total: procedures[i].total,
          invoice_id: invoice_id
        }
        let totalproc = parseFloat((procedures[i].quantity * procedures[i].total) + ((procedures[i].quantity * procedures[i].total) * (procedures[i].tax / 100)));
        let sql1 = "INSERT INTO plan_procedures SET ?";
        db.query(sql1, procedure, (err, resultproc) => {
          if (err) throw err;
          invoiceprocedure.procedure_id = resultproc.insertId;
          let sqlinvoiceproc = "INSERT INTO invoice_items SET ?";
          db.query(sqlinvoiceproc, invoiceprocedure, (err, resultinvproc) => {
            if (err) throw err;
            let updateSqlproc = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
            db.query(updateSqlproc, [totalproc, invoice_id], (err, resulttotalproc) => {
              if (err) throw err;
            });
          });
        });
      }
    };





    for (j = 0; j < labOrders.length; j++) {
      if (labOrders[j].planlab_id) {
        let labOrder = {
          instruction: labOrders[j].instruction
        };
        let sql1 = "UPDATE plan_lab SET ? WHERE planlab_id = ?";
        db.query(sql1, [labOrder, labOrders[j].planlab_id], (err, resultlab) => {
          if (err) throw err;
        });
      } else {
        let labOrder = {
          test: labOrders[j].test,
          instruction: labOrders[j].instruction,
          diaglab_id: labOrders[j].diaglab_id,
          plan_id: plan_id
        };
        let invoicelab = {
          name: labOrders[j].name,
          quantity: labOrders[j].quantity,
          retail_price: labOrders[j].retail_price,
          tax: labOrders[j].tax,
          total: labOrders[j].total,
          invoice_id: invoice_id
        }
        let totallab = parseFloat((labOrders[j].quantity * labOrders[j].total) + ((labOrders[j].quantity * labOrders[j].total) * (labOrders[j].tax / 100)));
        let sql2 = "INSERT INTO plan_lab SET ?";
        db.query(sql2, labOrder, (err, resultlab) => {
          if (err) throw err;
          invoicelab.planlab_id = resultlab.insertId;
          let sqlinvoicelab = "INSERT INTO invoice_items SET ?";
          db.query(sqlinvoicelab, invoicelab, (err, resultinvlab) => {
            if (err) throw err;
            let updateSqllab = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
            db.query(updateSqllab, [totallab, invoice_id], (err, resulttotallab) => {
              if (err) throw err;
            });
          });
        });
      }
    };



    for (k = 0; k < imagingOrders.length; k++) {
      if (imagingOrders[k].planimg_id) {
        let imagingOrder = {
          instruction: imagingOrders[k].instruction,
        };
        let sql1 = "UPDATE plan_imaging SET ? WHERE planimg_id = ?";
        db.query(sql1, [imagingOrder, imagingOrders[k].planimg_id], (err, resultimg) => {
          if (err) throw err;
        });
      } else {
        let imagingOrder = {
          test: imagingOrders[k].test,
          instruction: imagingOrders[k].instruction,
          diagimag_id: imagingOrders[k].diagimag_id,
          plan_id: plan_id
        };
        let invoiceimag = {
          name: imagingOrders[k].name,
          quantity: imagingOrders[k].quantity,
          retail_price: imagingOrders[k].retail_price,
          tax: imagingOrders[k].tax,
          total: imagingOrders[k].total,
          invoice_id: invoice_id
        }
        let totalimag = parseFloat((imagingOrders[k].quantity * imagingOrders[k].total) + ((imagingOrders[k].quantity * imagingOrders[k].total) * (imagingOrders[k].tax / 100)));
        let sql3 = "INSERT INTO plan_imaging SET ?";
        db.query(sql3, imagingOrder, (err, resultimag) => {
          if (err) throw err;
          invoiceimag.planimg_id = resultimag.insertId;
          let sqlinvoiceimag = "INSERT INTO invoice_items SET ?";
          db.query(sqlinvoiceimag, invoiceimag, (err, resultinvimag) => {
            if (err) throw err;
            let updateSqlimag = `UPDATE invoice SET total = CASE WHEN total IS NULL THEN 0 ELSE total END + ? WHERE invoice_id = ?`;
            db.query(updateSqlimag, [totalimag, invoice_id], (err, resulttotalimag) => {
              if (err) throw err;
            });
          });
        });
      }
    };



    for (l = 0; l < inventoryOrders.length; l++) {
      console.log('checking this', inventoryOrders[l]);
      if (!inventoryOrders[l].recordconsume_id && !inventoryOrders[l].plantreat_id) {
        if (inventoryOrders[l].itemstock_id && inventoryOrders[l].item_id) {
          let treatment = {
            plan_id: plan_id,
            name: inventoryOrders[l].name,
            c_quantity: inventoryOrders[l].c_quantity,
            stock_unit: inventoryOrders[l].stock_unit,
            stock_selected: inventoryOrders[l].stock_selected,
            item_id: inventoryOrders[l].item_id,
            itemstock_id: inventoryOrders[l].itemstock_id,
            batch_no: inventoryOrders[l].batch_no,
            quantity: inventoryOrders[l].quantity,
            retail_price: inventoryOrders[l].retail_price,
            tax: inventoryOrders[l].tax,
            total: inventoryOrders[l].total
          };
          let InventoryOrder = {
            name: inventoryOrders[l].name,
            c_quantity: inventoryOrders[l].c_quantity,
            stock_unit: inventoryOrders[l].stock_unit,
            plan_id: plan_id
          };
          let sql1 = "INSERT INTO record_consumables SET ?";
          db.query(sql1, treatment, (err, resulttreat) => {
            if (err) throw err;
            let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel - ? WHERE item_id=?`;
            let consumeSql = `INSERT INTO consumed_stock SET ?`;
            let stockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel - ? WHERE itemstock_id = ?`;
            let consumed = {
              consumed_stocklevel: treatment.quantity,
              practice_id: planningpractice.practice_id,
              user_id: planningpractice.user_id,
              item_id: treatment.item_id,
              itemstock_id: treatment.itemstock_id,
              status: 'consumed',
              recordconsume_id: resulttreat.insertId,

              name: treatment.name,
              batch_no: treatment.batch_no,
              c_quantity: treatment.c_quantity,
              unit: treatment.stock_unit,
              total: treatment.total,
              patient_id: temp.patient_id
            };
            db.query(consumeSql, consumed, (err, result) => {
              if (err) throw err;
            });
            InventoryOrder.recordconsume_id = resulttreat.insertId;
            let sql3 = "INSERT INTO plan_treatments SET ?";
            db.query(sql3, InventoryOrder, (err, resultimag) => {
              if (err) throw err;
            });
            db.query(stockSql, [treatment.quantity, treatment.itemstock_id], (err, result) => {
              if (err) throw err;
            });
            db.query(updateItemSql, [treatment.quantity, treatment.item_id], (err, result) => {
              if (err) throw err;
            });
          });
        } else {
          let InventoryOrder = {
            name: inventoryOrders[l].name,
            c_quantity: inventoryOrders[l].c_quantity,
            stock_unit: inventoryOrders[l].stock_unit,
            plan_id: plan_id,
            recordconsume_id: 0
          };
          let sql3 = "INSERT INTO plan_treatments SET ?";
          db.query(sql3, InventoryOrder, (err, resultimag) => {
            if (err) throw err;
          });
        }
      } else {
        console.log('already exits');
      }
    };
    res.json({
      success: true
    });
  });
});


router.get("/getInvoiceID/:id", (req, res) => {
  var plan_id = req.params.id;
  let sql =
    `SELECT 
  a.total,
  a.ref,
  a.final_discount,
  a.invoice_id,
  a.credits,
  a.status, 
  SUM(d.payment_amount) as paid
  FROM invoice as a
  LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
  WHERE a.plan_id=?`;
  let query = db.query(sql, plan_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: "error no record found" });
    } else {
      res.json({
        success: true,
        ref: result[0].ref,
        paid: result[0].paid,
        total: result[0].total,
        final_discount: result[0].final_discount,
        invoice_id: result[0].invoice_id,
        status: result[0].status,
        credits: result[0].credits
      });
    }
  });
});

router.get("/getInvoiceIDprev/:id", (req, res) => {
  var preventive_id = req.params.id;
  let sql =
    `SELECT 
  a.total,
  a.ref,
  a.final_discount,
  a.invoice_id,
  a.status, 
  a.credits,
  SUM(d.payment_amount) as paid
  FROM invoice as a
  LEFT JOIN payment as d ON a.invoice_id = d.invoice_id
  WHERE a.preventive_id=?`;
  console.log('seeing this', preventive_id);
  let query = db.query(sql, preventive_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: "error no record found" });
    } else {
      res.json({
        success: true,
        ref: result[0].ref,
        paid: result[0].paid,
        total: result[0].total,
        final_discount: result[0].final_discount,
        invoice_id: result[0].invoice_id,
        status: result[0].status,
        credits: result[0].credits
      });
    }
  });
});

router.get("/getPlanID/:id", (req, res) => {
  var invoice_id = req.params.id;
  let sql = "SELECT plan_id FROM invoice WHERE invoice_id=?";
  let query = db.query(sql, invoice_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({
        success: false
      });
    } else {
      if (result[0].plan_id != null) {
        res.json({
          success: true
        });
      } else {
        res.json({
          success: false
        });
      }
    }
  });
});



router.post("/assessment", (req, res) => {
  var temp = req.body.assessment;
  var record_id = req.body.record_id;
  var assessment = {
    diagnosis: temp.diagnosis,
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id
  };
  let sql = "INSERT INTO assessment SET ?";
  let query = db.query(sql, assessment, (err, result) => {
    let id = result.insertId;
    if (err) throw err;
    let sql2 = "UPDATE record SET assess_id = ? WHERE record_id = ?";
    let query2 = db.query(sql2, [result.insertId, record_id], (err, result) => {
      if (err) throw err;
      res.send({ assessinsert_id: id });
    });
  });
});

router.post("/objective", (req, res) => {
  temp = req.body.objective;
  record_id = req.body.record_id;

  let objective = {
    temp: temp.temperature,
    pulse: temp.pulse,
    resprate: temp.respiratoryRate,
    weight: temp.weight,
    mucmemb: temp.mucousMembrane,
    mucmemb_notes: temp.mucmemb_notes,
    lymnodes: temp.lymphNodes,
    lymnodes_notes: temp.lymnodes_notes,
    hydration: temp.hydration,
    crt: temp.crt,
    bcs: temp.bcs,
    visual_exam: temp.mentation,
    visexam_notes: temp.visexam_notes,
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id
  };
  let sql = "INSERT INTO objective SET ?";
  let query = db.query(sql, objective, (err, result) => {
    if (err) throw err;
    let id = result.insertId;

    let objectiveparts = {
      objective_id: id,
      ears_ad: temp.parts.ears_ad,
      ears_as: temp.parts.ears_as,
      ears_au: temp.parts.ears_au,
      eyes_od: temp.parts.eyes_od,
      eyes_os: temp.parts.eyes_os,
      eyes_ou: temp.parts.eyes_ou,
      nose: temp.parts.nose,
      oc_tongue: temp.parts.oc_tongue,
      oc_dentition: temp.parts.oc_dentition,
      neck: temp.parts.neck,
      ms_rf: temp.parts.ms_rf,
      ms_lf: temp.parts.ms_lf,
      ms_rm: temp.parts.ms_rm,
      ms_lm: temp.parts.ms_lm,
      ms_axial: temp.parts.ms_axial,
      chest_cl: temp.parts.chest_cl,
      chest_rs: temp.parts.chest_rs,
      abd_dg: temp.parts.abd_dg,
      abd_us: temp.parts.abd_us,
      abd_rs: temp.parts.abd_rs,
      tail: temp.parts.tail,
      skin: temp.parts.skin,
      ns_brain: temp.parts.ns_brain,
      ns_sc: temp.parts.ns_sc,
      ns_cn: temp.parts.ns_cn,
      ns_pn: temp.parts.ns_pn
    };

    let sql2 = "INSERT INTO physicalexam SET ?";
    let query2 = db.query(sql2, objectiveparts, (err, result) => {
      if (err) throw err;
    });

    var sql3 = "UPDATE record SET objective_id = ? WHERE record_id = ?";
    let query3 = db.query(sql3, [id, record_id], (err, result) => {
      if (err) throw err;
    });
    res.send({ objectiveinsert_id: id });
  });
});

router.post("/record", (req, res) => {
  console.log('invalid date: ', req.body.record);
  var record = JSON.parse(req.body.record);
  console.log('record.event_id: ', record.event_id);
  if (record.event_id != "undefined" && record.event_id && record.event_type != "undefined" && record.event_type) {
    let sql = "INSERT INTO record SET ?";
    let query = db.query(sql, record, (err, result) => {
      if (err) throw err;
      res.send({ success: true, record_id: result.insertId });
    });
  } else {
    res.send({ success: false, record_id: 0 });
  }
});

router.get("/record/:id", (req, res) => {
  var record_id = req.params.id;
  let sql = `SELECT 
              record.record_id, 
              record.subject_id, 
              record.objective_id, 
              record.assess_id, 
              record.plan_id, 
              record.prescription_id,
              record.preventive_id,  
              record.user_id,
              record.practice_id, 
              record.timestamp,
              user.name,
              user.role
            FROM 
              record 
              INNER JOIN user ON record.user_id=user.user_id 
            WHERE 
              record_id=?`;
  let query = db.query(sql, record_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: "error no record found" });
    } else {
      res.json({
        record_id: result[0].record_id,
        subject_id: result[0].subject_id,
        objective_id: result[0].objective_id,
        assess_id: result[0].assess_id,
        plan_id: result[0].plan_id,
        prescription_id: result[0].prescription_id,
        preventive_id: result[0].preventive_id,
        user_id: result[0].user_id,
        practice_id: result[0].practice_id,
        timestamp: result[0].timestamp,
        doc_name: result[0].role === 'Doctor' || result[0].role === 'Admin' ? 'Dr. ' + result[0].name : result[0].name,
      });
    }
  });
});

router.get("/subjective/:id", (req, res) => {
  var subjective_id = req.params.id;
  let sql = "SELECT * FROM subjective WHERE subject_id=?";
  let query = db.query(sql, subjective_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: "error no record found" });
    } else {
      res.json({
        addnotes: result[0].addnotes,
        appetite: result[0].appetite,
        attid: result[0].attid,
        attidnotes: result[0].attidnotes,
        drinking: result[0].drinking,
        notice: result[0].notice,
        poopng: result[0].poopng,
        poopngnotes: result[0].poopngnotes,
        urnatng: result[0].urnatng,
        urnatngnotes: result[0].urnatngnotes,
        chiefcom: result[0].cheifcom,
        duration: result[0].duration
      });
    }
  });
});

router.get("/objective/:id", (req, res) => {
  var objective_id = req.params.id;
  let sql = "SELECT * FROM objective WHERE objective_id=?";
  let sql2 = "SELECT * FROM physicalexam WHERE objective_id=?";
  let query = db.query(sql, objective_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: "error no record found objective" });
    } else {
      let query = db.query(sql2, objective_id, (err, result2) => {
        if (err) throw err;
        if (!result2.length) {
          res.json({ msg: "error no record found in physicalexam" });
        } else {
          res.json({
            temperature: result[0].temp,
            pulse: result[0].pulse,
            respiratoryRate: result[0].resprate,
            weight: result[0].weight,
            mucousMembrane: result[0].mucmemb,
            mucmemb_notes: result[0].mucmemb_notes,
            lymphNodes: result[0].lymnodes,
            lymnodes_notes: result[0].lymnodes_notes,
            hydration: result[0].hydration,
            crt: result[0].crt,
            bcs: result[0].bcs,
            mentation: result[0].visual_exam,
            visexam_notes: result[0].visexam_notes,
            parts: {
              ears_ad: result2[0].ears_ad,
              ears_as: result2[0].ears_as,
              ears_au: result2[0].ears_au,
              eyes_od: result2[0].eyes_od,
              eyes_os: result2[0].eyes_os,
              eyes_ou: result2[0].eyes_ou,
              nose: result2[0].nose,
              oc_tongue: result2[0].oc_tongue,
              oc_dentition: result2[0].oc_dentition,
              neck: result2[0].neck,
              ms_rf: result2[0].ms_rf,
              ms_lf: result2[0].ms_lf,
              ms_rm: result2[0].ms_rm,
              ms_lm: result2[0].ms_lm,
              ms_axial: result2[0].ms_axial,
              chest_cl: result2[0].chest_cl,
              chest_rs: result2[0].chest_rs,
              abd_dg: result2[0].abd_dg,
              abd_us: result2[0].abd_us,
              abd_rs: result2[0].abd_rs,
              tail: result2[0].tail,
              skin: result2[0].skin,
              ns_brain: result2[0].ns_brain,
              ns_sc: result2[0].ns_sc,
              ns_cn: result2[0].ns_cn,
              ns_pn: result2[0].ns_pn
            }
          });
        }
      });
    }
  });
});

router.get("/assessment/:id", (req, res) => {
  var assess_id = req.params.id;
  let sql = "SELECT * FROM assessment WHERE assess_id=?";
  let query = db.query(sql, assess_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: "error no record found" });
    } else {
      res.json({
        diagnosis: result[0].diagnosis
      });
    }
  });
});

router.get('/planning/:id', (req, res) => {
  var plan_id = req.params.id;
  var treatmentPlan;
  var procedures = [];
  var labOrders = [];
  var imagingOrders = [];
  var inventoryOrders = [];
  var success = false;
  let sql = 'SELECT plan FROM planning WHERE plan_id=?';
  let sql1 = 'SELECT `proc_id`,`instruction`, `test`, `procedure_id` FROM plan_procedures WHERE plan_id=?';
  let sql2 = `SELECT plan_lab.diaglab_id , plan_lab.test, plan_lab.instruction, plan_lab.planlab_id, catalog_labresult.labresult_image
              FROM plan_lab 
              left join catalog_labresult on catalog_labresult.diaglab_id = plan_lab.diaglab_id and  catalog_labresult.planlab_id = plan_lab.planlab_id 
              WHERE plan_lab.plan_id=?`;
  let sql3 = 'SELECT diagimag_id, test, instruction,planimg_id FROM plan_imaging WHERE plan_id=?';
  let sql4 = 'SELECT * FROM record_consumables WHERE plan_id=?';
  let sql5 = 'SELECT * FROM plan_treatments WHERE plan_id=? and recordconsume_id = 0';

  let query = db.query(sql, plan_id, (err, result) => {
    if (err) throw err;
    treatmentPlan = result[0].plan;
    db.query(sql1, plan_id, (err, result) => {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        procedures.push({ procedure: result[i].test, instruction: result[i].instruction, proc_id: result[i].proc_id, procedure_id: result[i].procedure_id });
      }
      db.query(sql2, plan_id, (err, result) => {
        if (err) throw err;
        for (var j = 0; j < result.length; j++) {
          labOrders.push({ test: result[j].test, labresult_image: result[j].labresult_image, instruction: result[j].instruction, diaglab_id: result[j].diaglab_id, planlab_id: result[j].planlab_id });
        }
        db.query(sql3, plan_id, (err, result) => {
          if (err) throw err;
          for (var k = 0; k < result.length; k++) {
            imagingOrders.push({ test: result[k].test, instruction: result[k].instruction, diagimag_id: result[k].diagimag_id, planimg_id: result[k].planimg_id });
          }
          db.query(sql4, plan_id, (err, resultinv) => {
            if (err) throw err;
            for (var l = 0; l < resultinv.length; l++) {
              inventoryOrders.push(resultinv[l]);
            }
            db.query(sql5, plan_id, (err, resultinvtest) => {
              for (var m = 0; m < resultinvtest.length; m++) {
                inventoryOrders.push(resultinvtest[m]);
              }
              db.query(sql5, plan_id, (err, resultinvtest) => {
                res.send({
                  treatmentPlan: treatmentPlan,
                  procedures: procedures,
                  labOrders: labOrders,
                  imagingOrders: imagingOrders,
                  inventoryOrders: inventoryOrders
                })
              });
            });
          });
        });
      });
    });
  });
});


router.get("/prescription/:id", (req, res) => {
  var pres_id = req.params.id;
  pres_meds = [];
  let sql = 'SELECT * FROM pres_meds WHERE prescription_id=?';
  db.query(sql, pres_id, (err, result) => {
    if (err) throw err;
    res.send({
      pres_meds: result
    })
  });
});


router.get("/prescription_invoice/:id", (req, res) => {
  var pres_id = req.params.id;
  pres_meds = [];
  let sql = 'SELECT record_id FROM record WHERE prescription_id=?';
  db.query(sql, pres_id, (err, result) => {
    if (err) throw err;
    res.send({
      record_id: result[0].record_id
    })
  });
});

router.put("/assessment", (req, res) => {
  var temp = req.body.assessment;
  var assess_id = req.body.assess_id;
  var assessment = {
    diagnosis: temp.diagnosis,
  };
  let sql = "UPDATE assessment SET ? WHERE assess_id=?";
  let query = db.query(sql, [assessment, assess_id], (err, result) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// router.get('/planning/:id', (req, res) => {

//           var plan_id = req.params.id;

//           let sql = 'SELECT * FROM planning WHERE plan_id=?';
//           let sql1 = 'SELECT * FROM plan_procedures WHERE plan_id=?'; 
//           let sql2 = 'SELECT * FROM plan_lab WHERE plan_id=?';   
//           let sql3 = 'SELECT * FROM plan_imaging WHERE plan_id=?'; 


//           let query = db.query(sql, plan_id, (err, result) => {

//             var proceduresorders = [];
//             var laborders = [];
//             var imageorders = [];

//             if (err) throw err;
//             if(!result.length){
//             }
//             {
//             let query1 = db.query(sql1, plan_id, (err, result1) => {
//               if (err) throw err;
//                 for(var i=0; i<result1.length; i++){
//                 var procedure = {
//                   procedure: result1[i].procedure,
//                   instruction:result1[i].instruction
//                 }
//                 proceduresorders.push(procedure);
//                };

//             let query2 = db.query(sql2, plan_id, (err, result2) => {
//               if (err) throw err;
//                 for(var i=0; i<result2.length; i++){
//                 var lab = {
//                   test: result2[i].test,
//                   instruction:result2[i].instruction
//                 }
//                 laborders.push(lab);
//                };

//             let query3 = db.query(sql3, plan_id, (err, result3) => {
//               if (err) throw err;
//                 for(var i=0; i<result3.length; i++){
//                 var temp = {
//                   test: result3[i].test,
//                   instruction:result3[i].instruction
//                 }
//                 imageorders.push(temp);
//               };
//               console.log(proceduresorders);
//               res.json({
//                 procedures: proceduresorders,
//                 labOrders:laborders,
//                 imagingOrders:imageorders,
//                 treatmentPlan: result[0].plan
//               });

//             });
//           });
//         });




//             }
//           });
//         }); 



router.put('/subjective', (req, res) => {
  temp = req.body.subjective;
  subjective_id = req.body.subject_id;
  let subjectivemain = {
    subject_id: subjective_id,
    addnotes: temp.addnotes,
    appetite: temp.appetite,
    attid: temp.attid,
    attidnotes: temp.attidnotes,
    drinking: temp.drinking,
    notice: temp.notice,
    poopng: temp.poopng,
    poopngnotes: temp.poopngnotes,
    urnatng: temp.urnatng,
    urnatngnotes: temp.urnatngnotes,
    cheifcom: temp.chiefcom,
    duration: temp.duration
  };
  let sql = 'UPDATE subjective SET ? WHERE subject_id=? ';
  let query = db.query(sql, [subjectivemain, subjective_id], (err, result) => {
    if (err) throw err;
  });
});


router.put('/objective', (req, res) => {
  temp = req.body.objective;
  objective_id = req.body.objective_id;
  let objective = {
    objective_id: objective_id,
    temp: temp.temperature,
    pulse: temp.pulse,
    resprate: temp.respiratoryRate,
    weight: temp.weight,
    mucmemb: temp.mucousMembrane,
    mucmemb_notes: temp.mucmemb_notes,
    lymnodes: temp.lymphNodes,
    lymnodes_notes: temp.lymnodes_notes,
    hydration: temp.hydration,
    crt: temp.crt,
    bcs: temp.bcs,
    visual_exam: temp.mentation,
    visexam_notes: temp.visexam_notes,
  }
  let sql = 'UPDATE objective SET ? WHERE objective_id=? ';
  let query = db.query(sql, [objective, objective_id], (err, result) => {
    let objectiveparts = {
      objective_id: objective_id,
      ears_ad: temp.parts.ears_ad,
      ears_as: temp.parts.ears_as,
      ears_au: temp.parts.ears_au,
      eyes_od: temp.parts.eyes_od,
      eyes_os: temp.parts.eyes_os,
      eyes_ou: temp.parts.eyes_ou,
      nose: temp.parts.nose,
      oc_tongue: temp.parts.oc_tongue,
      oc_dentition: temp.parts.oc_dentition,
      neck: temp.parts.neck,
      ms_rf: temp.parts.ms_rf,
      ms_lf: temp.parts.ms_lf,
      ms_rm: temp.parts.ms_rm,
      ms_lm: temp.parts.ms_lm,
      ms_axial: temp.parts.ms_axial,
      chest_cl: temp.parts.chest_cl,
      chest_rs: temp.parts.chest_rs,
      abd_dg: temp.parts.abd_dg,
      abd_us: temp.parts.abd_us,
      abd_rs: temp.parts.abd_rs,
      tail: temp.parts.tail,
      skin: temp.parts.skin,
      ns_brain: temp.parts.ns_brain,
      ns_sc: temp.parts.ns_sc,
      ns_cn: temp.parts.ns_cn,
      ns_pn: temp.parts.ns_pn
    }
    let sql2 = 'UPDATE physicalexam SET ? WHERE objective_id=? ';
    let query2 = db.query(sql2, [objectiveparts, objective_id], (err, result) => {
      if (err) throw err;
    });
  });
});




router.get("/checkrecordlast/:practice_id/:user_id", (req, res) => {
  let sqlcheck = "SELECT * FROM record where practice_id = '"+ req.params.practice_id +"' and user_id = '"+ req.params.user_id +"'";
  db.query(sqlcheck, (err, result) => {
    if (!result.length) {
      res.sendStatus(200);
    }
    else {
      result.forEach(element => {
        if (element.subject_id == null && element.objective_id == null && element.plan_id == null && element.assess_id == null && element.prescription_id == null && element.preventive_id == null) {
          let sqldeleterecord = 'DELETE FROM record WHERE record_id = ?';
          db.query(sqldeleterecord, element.record_id, (err, result2) => {
          });
        }
      });      
      Promise.all(result).then(res.sendStatus(200));
    }
  });
});



router.post("/prescription", (req, res) => {
  var temp = req.body.prescription;
  var record_id = req.body.record_id;
  console.log('meds: '.red, temp.meds);
  var prescription = {
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id,
    consume_id: '1'
  };

  let sql = "INSERT INTO prescription SET ?";
  let query = db.query(sql, prescription, (err, result) => {
    var presMeds = temp.meds;
    if (err) throw err;
    let id = result.insertId;
    for (i = 0; i < presMeds.length; i++) {
      let presMedicines = {
        prefix: presMeds[i].prefix,
        med_name: presMeds[i].med_name,
        quan: presMeds[i].quan,
        quan_type: presMeds[i].quan_type,
        dur: presMeds[i].dur,
        dur_type: presMeds[i].dur_type,
        freq: presMeds[i].freq,
        instruction: presMeds[i].instruction,
        prescription_id: result.insertId
      };
      let sql1 = "INSERT INTO pres_meds SET ?";
      db.query(sql1, presMedicines, (err, result) => {
        if (err) throw err;
      });
    }
    let sql4 = "UPDATE record SET prescription_id = ? WHERE record_id = ?";
    db.query(sql4, [id, record_id], (err, result) => {
      if (err) throw err;
    });
    res.send({ prescription_id: id });
  });
});

router.put('/prescription', (req, res) => {
  var temp = req.body.prescription;
  var prescription_id = req.body.prescription_id;
  var deletedmeds = req.body.deleted;

  console.log('entering'.red, temp.meds);

  deletedmeds.map(insidedelete => {
    let sqldelete = 'DELETE FROM pres_meds WHERE presmeds_id=?';
    db.query(sqldelete, insidedelete.presmeds_id, (err, resultcheck) => {
      if (err) throw err;
    });
  });

  var presMeds = temp.meds;
  console.log(presMeds.length);
  for (i = 0; i < presMeds.length; i++) {
    console.log(presMeds[i].presmeds_id);
    if (presMeds[i].presmeds_id) {
      let presMedicines = {
        prefix: presMeds[i].prefix,
        med_name: presMeds[i].med_name,
        quan: presMeds[i].quan,
        quan_type: presMeds[i].quan_type,
        dur: presMeds[i].dur,
        dur_type: presMeds[i].dur_type,
        freq: presMeds[i].freq,
        instruction: presMeds[i].instruction
      };
      let sql1 = "UPDATE pres_meds SET ? WHERE presmeds_id = ?";
      db.query(sql1, [presMedicines, presMeds[i].presmeds_id], (err, result) => {
        if (err) throw err;
      });
    } else {
      let presMedicines = {
        prefix: presMeds[i].prefix,
        med_name: presMeds[i].med_name,
        quan: presMeds[i].quan,
        quan_type: presMeds[i].quan_type,
        dur: presMeds[i].dur,
        dur_type: presMeds[i].dur_type,
        freq: presMeds[i].freq,
        instruction: presMeds[i].instruction,
        prescription_id: prescription_id
      };
      let sql1 = "INSERT INTO pres_meds SET ?";
      db.query(sql1, presMedicines, (err, result) => {
        if (err) throw err;
      });
    }
  }
  console.log('exiting');
  res.json({
    success: true
  });

});


router.get('/planninginvoice/:planid/:invoiceid', (req, res) => {

  var plan_id = req.params.planid;
  var invoice_id = req.params.invoiceid;
  var treatmentPlan;
  var procedures = [];
  var labOrders = [];
  var imagingOrders = [];

  var labOrdersInvoice = [];
  var proceduresInvoice = [];
  var imagingOrdersInvoice = [];
  var treatmentsOrdersInvoice = [];


  var success = false;
  let sql = 'SELECT plan FROM planning WHERE plan_id=?';
  let sql1 = 'SELECT `proc_id`,`instruction`, `test`, `procedure_id` FROM plan_procedures WHERE plan_id=?';
  let sql2 = 'SELECT diaglab_id, test, instruction,planlab_id FROM plan_lab WHERE plan_id=?';
  let sql3 = 'SELECT `diagimag_id`,`test`,`instruction`,`planimg_id` AS planimag FROM `plan_imaging` WHERE plan_id=?';
  let sql4 = 'SELECT * FROM `record_consumables` WHERE plan_id=?';
  let sql5 = 'SELECT * FROM `plan_treatments` WHERE plan_id=? AND recordconsume_id = 0';


  let sqlprocinv = 'SELECT * FROM invoice_items WHERE invoice_id=? AND procedure_id=?';
  let sqlimaginv = 'SELECT * FROM invoice_items WHERE invoice_id=? AND planimg_id=?';
  let sqllabinv = 'SELECT * FROM invoice_items WHERE invoice_id=? AND planlab_id=?';

  let sqlcheck = 'SELECT * FROM invoice_items invoice_id=?';

  let query = db.query(sql, plan_id, (err, result) => {
    if (err) throw err;
    treatmentPlan = result[0].plan;
    db.query(sql1, plan_id, (err, result) => {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        const currentprocedure = {
          procedure: result[i].test,
          instruction: result[i].instruction,
          proc_id: result[i].proc_id,
          procedure_id: result[i].procedure_id
        };
        db.query(sqlprocinv, [invoice_id, result[i].procedure_id], (err, resultprocinv) => {
          if (err) throw err;
          proceduresInvoice.push({
            procedure: currentprocedure.procedure,
            instruction: currentprocedure.instruction,
            proc_id: currentprocedure.proc_id,
            procedure_id: currentprocedure.procedure_id,

            name: resultprocinv[0].name,
            quantity: resultprocinv[0].quantity,
            retail_price: resultprocinv[0].retail_price,
            tax: resultprocinv[0].tax,
            total: resultprocinv[0].total,
            invoice_id: resultprocinv[0].invoice_id,

          });
        });
      }
      db.query(sql2, plan_id, (err, resultlab) => {
        if (err) throw err;
        for (var j = 0; j < resultlab.length; j++) {
          const currentlab = {
            test: resultlab[j].test,
            instruction: resultlab[j].instruction,
            diaglab_id: resultlab[j].diaglab_id,
            planlab_id: resultlab[j].planlab_id
          };
          db.query(sqllabinv, [invoice_id, resultlab[j].planlab_id], (err, resultlabinv) => {
            if (err) throw err;
            labOrdersInvoice.push({
              test: currentlab.test,
              instruction: currentlab.instruction,
              diaglab_id: currentlab.diaglab_id,
              planlab_id: currentlab.planlab_id,

              name: resultlabinv[0].name,
              quantity: resultlabinv[0].quantity,
              retail_price: resultlabinv[0].retail_price,
              tax: resultlabinv[0].tax,
              total: resultlabinv[0].total,
              invoice_id: resultlabinv[0].invoice_id,

            });
          });
        }
        db.query(sql3, plan_id, (err, resultimag) => {
          if (err) throw err;
          for (var k = 0; k < resultimag.length; k++) {
            const currentimag = {
              test: resultimag[k].test,
              instruction: resultimag[k].instruction,
              diagimag_id: resultimag[k].diagimag_id,
              planimg_id: resultimag[k].planimag
            };
            db.query(sqlimaginv, [invoice_id, resultimag[k].planimag], (err, resultimaginv) => {
              if (err) throw err;
              imagingOrdersInvoice.push({
                test: currentimag.test,
                instruction: currentimag.instruction,
                diagimag_id: currentimag.diagimag_id,
                planimg_id: currentimag.planimg_id,

                name: resultimaginv[0].name,
                quantity: resultimaginv[0].quantity,
                retail_price: resultimaginv[0].retail_price,
                tax: resultimaginv[0].tax,
                total: resultimaginv[0].total,
                invoice_id: resultimaginv[0].invoice_id,
              });
              console.log(imagingOrdersInvoice);
            });
          }
          db.query(sql4, plan_id, (err, resulttreat) => {
            if (err) throw err;
            for (var l = 0; l < resulttreat.length; l++) {
              const currenttreat = {
                recordconsume_id: resulttreat[l].recordconsume_id,
                name: resulttreat[l].name,
                c_quantity: resulttreat[l].c_quantity,
                stock_unit: resulttreat[l].stock_unit,
                stock_selected: resulttreat[l].stock_selected,
                item_id: resulttreat[l].item_id,
                itemstock_id: resulttreat[l].itemstock_id,
                batch_no: resulttreat[l].batch_no,
                quantity: resulttreat[l].quantity,
                retail_price: resulttreat[l].retail_price,
                tax: resulttreat[l].tax,
                total: resulttreat[l].total
              };
              treatmentsOrdersInvoice.push(currenttreat);
              console.log(treatmentsOrdersInvoice);
            }

            db.query(sql5, plan_id, (err, resulttreatfront) => {
              if (err) throw err;
              for (var m = 0; m < resulttreatfront.length; m++) {
                const currenttreat = {
                  name: resulttreatfront[m].name,
                  c_quantity: resulttreatfront[m].c_quantity,
                  stock_unit: resulttreatfront[m].stock_unit,
                  plantreat_id: resulttreatfront[m].plantreat_id
                };
                treatmentsOrdersInvoice.push(currenttreat);
                console.log(treatmentsOrdersInvoice);
              }
              db.query(sqlcheck, invoice_id, (err, resultdummy) => {
                res.send({
                  treatmentPlan: treatmentPlan,
                  procedures: proceduresInvoice,
                  labOrders: labOrdersInvoice,
                  imagingOrders: imagingOrdersInvoice,
                  inventoryOrders: treatmentsOrdersInvoice
                })
              });
            });
          });
        });
      });
    });
  });
});


module.exports = router;

