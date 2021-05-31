const express = require('express');
const router = express.Router();

const db = require('../config/connections');

router.get('/calendar/:practice_id/:user_id', (req, res) => {
  var practice_id = req.params.practice_id;
  var user_id = req.params.user_id;
  let sql = "SELECT * from calendar_settings WHERE practice_id=? && user_id=?";
  let selectQuery = db.query(sql, [practice_id, user_id], (err, data) => {
    if (err) throw err;
    res.json({
      success: true,
      data: data
    });
  });
});

router.delete('/deletecalendarsettings/:practice_id/:user_id', (req, res) => {
  var practice_id = req.params.practice_id;
  var user_id = req.params.user_id;
  let deleteSql = "DELETE FROM calendar_settings WHERE practice_id=? && user_id=? ";
  let query = db.query(deleteSql, [practice_id, user_id], (err, result) => {
    if (err) throw err;
    res.json({
      success: true
    })
  });
});

router.post('/', (req, res) => {
  var schedule = req.body;
  var data = {
    practice_id: schedule.practice_id,
    user_id: schedule.user_id,
    timeinterval: schedule.timeinterval,
    starttime: schedule.starttime,
    endtime: schedule.endtime,
    Monday: schedule.Monday,
    Tuesday: schedule.Tuesday,
    Wednesday: schedule.Wednesday,
    Thursday: schedule.Thursday,
    Friday: schedule.Friday,
    Saturday: schedule.Saturday,
    Sunday: schedule.Sunday
  };
  let sql = "INSERT INTO calendar_settings set ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    res.json({
      success: true
    })
  });
});

router.post('/diaglab', (req, res) => {
  var lab = req.body.lab;
  var lablist = req.body.lablist;
  var practice_id = req.body.practice_id;
  var labcomp = {
    name: lab.name,
    tax: lab.tax,
    price: lab.price,
    total: lab.total,
    notes: lab.notes,
    practice_id: practice_id
  };
  let sql = "INSERT INTO catalog_diaglab SET ?";
  let query = db.query(sql, labcomp, (err, result) => {
    if (err) throw err;
    let id = result.insertId;
    for (i = 0; i < lablist.length; i++) {
      let lablistcomp = {
        name: lablist[i].name,
        cat_range: lablist[i].cat_range,
        dog_range: lablist[i].dog_range,
        unit: lablist[i].unit,
        notes: lablist[i].notes,
        diaglab_id: id
      };
      let sql1 = "INSERT INTO catalog_lablist SET ?";
      db.query(sql1, lablistcomp, (err, result) => {
        if (err) throw err;
      });
    }
    res.json({
      success: true,
      lab: labcomp,
      diaglab_id: id
    })
  });
});


router.get("/diaglab/:id", (req, res) => {
  var practice_id = req.params.id;
  var lab = [];
  let sql = 'SELECT * FROM catalog_diaglab WHERE practice_id=?';
  let query = db.query(sql, practice_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ success: false });
    }
    else {
      for (var i = 0; i < result.length; i++) {
        lab.push({
          diaglab_id: result[i].diaglab_id,
          name: result[i].name,
          tax: result[i].tax,
          price: result[i].price,
          total: result[i].total,
          notes: result[i].notes
        });
      }
      res.json({
        success: true,
        lab: lab
      });
    }
  });
});



router.get("/diaglablist/:id", (req, res) => {
  var diaglab_id = req.params.id;
  var lablist = [];
  let sql2 = 'SELECT * FROM catalog_diaglab WHERE diaglab_id=?';
  let query3 = db.query(sql2, diaglab_id, (err, result2) => {
    if (err) throw err;
    if (!result2.length) {
      res.json({ success: false });
    } else {
      var lab = {
        name: result2[0].name,
        tax: result2[0].tax,
        price: result2[0].price,
        total: result2[0].total,
        notes: result2[0].notes,
      }
    }
    let sql = 'SELECT * FROM catalog_lablist WHERE diaglab_id=?';
    let query = db.query(sql, diaglab_id, (err, result) => {
      if (err) throw err;
      if (!result.length) {
        res.json({
          success: true,
          listsuccess: false,
          lab: lab,
          diaglab_id: diaglab_id
        });
      } else {
        for (var i = 0; i < result.length; i++) {
          lablist.push({
            lablist_id: result[i].lablist_id,
            name: result[i].name,
            cat_range: result[i].cat_range,
            dog_range: result[i].dog_range,
            unit: result[i].unit,
            notes: result[i].notes,
          });
        }
        res.json({
          success: true,
          listsuccess: true,
          lablist: lablist,
          lab: lab,
          diaglab_id: diaglab_id
        });
      }
    });
  });
});


router.delete("/diaglab/:id", (req, res) => {
  var diaglab_id = req.params.id;
  let sqldeletediag = 'DELETE FROM catalog_diaglab WHERE diaglab_id=?';
  let query = db.query(sqldeletediag, diaglab_id, (err, result) => {
    if (err) throw err;
    let sqldelete = 'DELETE FROM catalog_lablist WHERE diaglab_id=?';
    let query = db.query(sqldelete, diaglab_id, (err, result) => {
      if (err) throw err;
      res.json({
        success: true,
      });
    });
  });
});


router.put('/diaglab', (req, res) => {
  var lab = req.body.lab;
  var lablist = req.body.lablist;
  var deletelab = req.body.deletedlab;
  var diaglab_id = req.body.diaglab_id;

  var labcomp = {
    name: lab.name,
    tax: lab.tax,
    price: lab.price,
    total: lab.total,
    notes: lab.notes,
  };

  deletelab.map(insidedelete => {
    console.log(insidedelete);
    let sqldelete = 'DELETE FROM catalog_lablist WHERE lablist_id=?';
    db.query(sqldelete, insidedelete.lablist_id, (err, resultcheck) => {
      if (err) throw err;
    });
  });


  let sql = "UPDATE catalog_diaglab SET ? WHERE diaglab_id=?";
  let query = db.query(sql, [labcomp, diaglab_id], (err, result) => {
    if (err) throw err;

    for (i = 0; i < lablist.length; i++) {

      console.log(lablist[i].lablist_id);
      if (lablist[i].lablist_id) {
        console.log('updating');
        let lablistcomp = {
          name: lablist[i].name,
          cat_range: lablist[i].cat_range,
          dog_range: lablist[i].dog_range,
          unit: lablist[i].unit,
          notes: lablist[i].notes,
          diaglab_id: diaglab_id
        };
        console.log(lablistcomp);
        let sql1 = "UPDATE catalog_lablist SET ? WHERE lablist_id = ?";
        db.query(sql1, [lablistcomp, lablist[i].lablist_id], (err, result) => {
          if (err) throw err;
        });
      } else {
        console.log('inserting');
        let lablistcomp = {
          name: lablist[i].name,
          cat_range: lablist[i].cat_range,
          dog_range: lablist[i].dog_range,
          unit: lablist[i].unit,
          notes: lablist[i].notes,
          diaglab_id: diaglab_id
        };
        let sql1 = "INSERT INTO catalog_lablist SET ?";
        db.query(sql1, lablistcomp, (err, result) => {
          if (err) throw err;
        });
      }
    }


    res.json({
      success: true,
      lab: labcomp,
      diaglab_id: diaglab_id
    });
  });
});

// to be changed to the new database
router.get('/diagonelab/:lab/:practice_id', (req, res) => {
  var array = [];
  temp = req.params.lab;
  practice_id = req.params.practice_id

  let sql = 'SELECT *, 1 AS quantity, price as retail_price FROM catalog_diaglab WHERE name LIKE ? && practice_id = ?';
  let query = db.query(sql, ['%' + temp + '%', practice_id], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ msg: 'No Lab Orders Matched' });
    } else {
      //   for (var i = 0; i < result.length; i++) {
      //     array.push({ 
      //       diaglab_id: result[i].diaglab_id,
      //       name: result[i].name, 
      //       // tax: result[i].tax,
      //       // price: result[i].price, 
      //       notes: result[i].notes });
      // }
      res.json(result);
    }
  });
});
// end




router.post('/diagimag', (req, res) => {
  var imag = req.body.imag;
  var deleteimag = req.body.deletedimag;
  var practice_id = req.body.practice_id;

  deleteimag.map(insidedelete => {
    let sqldelete = 'DELETE FROM catalog_diagimag WHERE diagimag_id=?';
    db.query(sqldelete, insidedelete.diagimag_id, (err, resultcheck) => {
      if (err) throw err;
    });
  });

  imag.map(insidecheck => {
    if (insidecheck.diagimag_id) {
      let imaglistcomp = {
        name: insidecheck.name,
        tax: insidecheck.tax,
        price: insidecheck.price,
        notes: insidecheck.notes,
        total: insidecheck.total
      }
      console.log("updating");
      let sql1 = "UPDATE catalog_diagimag SET ? WHERE diagimag_id = ?";
      db.query(sql1, [imaglistcomp, insidecheck.diagimag_id], (err, result) => {
        if (err) throw err;
        console.log(result);
      });
    } else {
      let imaglistcomp = {
        name: insidecheck.name,
        tax: insidecheck.tax,
        price: insidecheck.price,
        notes: insidecheck.notes,
        total: insidecheck.total,
        practice_id: practice_id
      };
      console.log("inserting");
      let sql1 = "INSERT INTO catalog_diagimag SET ?";
      db.query(sql1, imaglistcomp, (err, result) => {
        if (err) throw err;
      });
    }
  });

  res.json({
    success: true
  });

});


router.post("/postoneimagcata", (req, res) => {
  var imag = req.body.imag;
  var practice_id = req.body.practice_id;
  let imaglistcomp = {
    name: imag.name,
    tax: imag.tax,
    price: imag.price,
    notes: imag.notes,
    total: imag.total,
    practice_id: practice_id
  };
  let sql1 = "INSERT INTO catalog_diagimag SET ?";
  db.query(sql1, imaglistcomp, (err, result) => {
    if (err) throw err;
    res.json({
      success: true,
      diagimag_id: result.insertId,
    })
  });
});


router.get("/diagimag/:id", (req, res) => {
  var practice_id = req.params.id;
  var imag = [];
  let sql = 'SELECT * FROM catalog_diagimag WHERE practice_id=?';
  let query = db.query(sql, practice_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ success: false });
    } else {
      res.json({
        success: true,
        imag: result
      });
    }
  });
});

router.get('/diagoneimag/:imag/:practice_id', (req, res) => {
  var array = [];
  temp = req.params.imag;
  practice_id = req.params.practice_id

  let sql = 'SELECT *, 1 AS quantity, price as retail_price FROM catalog_diagimag WHERE name LIKE ? && practice_id = ?';
  let query = db.query(sql, ['%' + temp + '%', practice_id], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      array.push('NoMessageAdded');
      res.json(array);
    } else {
      // for (var i = 0; i < result.length; i++) {
      //     array.push();
      // }
      res.json(result);
    }
  });
});

router.get('/diagoneprev/:prev/:practice_id', (req, res) => {
  var array = [];
  temp = req.params.prev;
  practice_id = req.params.practice_id
  let sql = 'SELECT *, 1 AS quantity, price as retail_price FROM catalog_prev WHERE name LIKE ? && practice_id = ?';
  let query = db.query(sql, ['%' + temp + '%', practice_id], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      array.push('NoMessageAdded');
      res.json(array);
    } else {
      // for (var i = 0; i < result.length; i++) {
      //     array.push();
      // }
      res.json(result);
    }
  });
});


router.post('/proccata', (req, res) => {
  var proc = req.body.proc;
  var practice_id = req.body.practice_id;
  var deleteproc = req.body.deletedproc;

  deleteproc.map(insidedelete => {
    let sqldelete = 'DELETE FROM catalog_proc WHERE proc_id=?';
    db.query(sqldelete, insidedelete.proc_id, (err, resultcheck) => {
      if (err) throw err;
    });
  });

  for (i = 0; i < proc.length; i++) {
    if (proc[i].proc_id) {
      let proccatacomp = {
        name: proc[i].name,
        tax: proc[i].tax,
        price: proc[i].price,
        total: proc[i].total,
        notes: proc[i].notes
      };
      console.log("updating");
      let sql1 = "UPDATE catalog_proc SET ? WHERE proc_id = ?";
      db.query(sql1, [proccatacomp, proc[i].proc_id], (err, result) => {
        if (err) throw err;
        console.log(result);
      });
    } else {
      let proccatacomp = {
        name: proc[i].name,
        tax: proc[i].tax,
        price: proc[i].price,
        total: proc[i].total,
        notes: proc[i].notes,
        practice_id: practice_id
      };
      let sql1 = "INSERT INTO catalog_proc SET ?";
      db.query(sql1, proccatacomp, (err, result) => {
        if (err) throw err;
      });
    }
  }

  res.json({
    success: true
  });


});

router.post("/postoneproccata", (req, res) => {
  var proc = req.body.proc;
  var practice_id = req.body.practice_id;
  let proccatacomp = {
    name: proc.name,
    tax: proc.tax,
    price: proc.price,
    total: proc.total,
    notes: proc.notes,
    practice_id: practice_id
  };
  let sql1 = "INSERT INTO catalog_proc SET ?";
  db.query(sql1, proccatacomp, (err, result) => {
    if (err) throw err;
    res.json({
      success: true,
      proc_id: result.insertId,
    })
  });
});

router.post("/postoneprevcata", (req, res) => {
  var prev = req.body.prev;
  var practice_id = req.body.practice_id;
  let prevcatacomp = {
    name: prev.name,
    tax: prev.tax,
    price: prev.price,
    total: prev.total,
    practice_id: practice_id
  };
  let sql1 = "INSERT INTO catalog_prev SET ?";
  db.query(sql1, prevcatacomp, (err, result) => {
    if (err) throw err;
    res.json({
      success: true,
      prev_id: result.insertId,
    })
  });
});


router.get("/proccata/:id", (req, res) => {
  var practice_id = req.params.id;
  var proc = [];
  let sql = 'SELECT * FROM catalog_proc WHERE practice_id=?';
  let query = db.query(sql, practice_id, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.json({ success: false });
    } else {
      res.json({
        success: true,
        proc: result
      });
    }
  });
});

router.post('/prevcata', (req, res) => {
  var prev = req.body.prev;
  var practice_id = req.body.practice_id;
  var deletedprev = req.body.deletedprev;
  deletedprev.map(insidedelete => {
    let sqldelete = 'DELETE FROM catalog_prev WHERE prev_id=?';
    db.query(sqldelete, insidedelete.prev_id, (err, resultcheck) => {
      if (err) throw err;
    });
  });
  for (i = 0; i < prev.length; i++) {
    if (prev[i].prev_id) {
      let prevcatacomp = {
        name: prev[i].name,
        tax: prev[i].tax,
        price: prev[i].price,
        total: prev[i].total
      };
      console.log("updating");
      let sql1 = "UPDATE catalog_prev SET ? WHERE prev_id = ?";
      db.query(sql1, [prevcatacomp, prev[i].prev_id], (err, result) => {
        if (err) throw err;
        console.log(result);
      });
    } else {
      let prevcatacomp = {
        name: prev[i].name,
        tax: prev[i].tax,
        price: prev[i].price,
        total: prev[i].total,
        practice_id: practice_id
      };
      let sql1 = "INSERT INTO catalog_prev SET ?";
      db.query(sql1, prevcatacomp, (err, result) => {
        if (err) throw err;
      });
    }
  }
  res.json({
    success: true
  });
});

//Vighnesh New Add Preventive Catalog
router.post("/addPerventive", (req, res) => {
  let sql = "INSERT INTO catalog_prev SET ?";
  db.query(sql, req.body, (err, result) => {
    if (err) {
      res.json({
        success: false
      });
    } else {
      res.json({
        success: true
      });
    }
  });
});

//Vighnesh New Add Imaging Catalog
router.post("/addDiagImg", (req, res) => {
  let sql = "INSERT INTO catalog_diagimag SET ?";
  db.query(sql, req.body, (err, result) => {
    if (err) {
      res.json({
        success: false
      });
    } else {
      res.json({
        success: true
      });
    }
  });
});

//Vighnesh New Add Procedure Catalog
router.post("/addProcCatalog", (req, res) => {
  let sql = "INSERT INTO catalog_proc SET ?";
  db.query(sql, req.body, (err, result) => {
    if (err) {
      res.json({
        success: false
      });
    } else {
      res.json({
        success: true
      });
    }
  });
});


router.get("/prevcata/:practice_id", (req, res) => {
  // router.get("/proccata/:practice_id/:user_id", (req, res) => {
  var practice_id = req.params.practice_id;
  // var user_id = req.params.user_id;
  let sql = 'SELECT * FROM catalog_prev WHERE practice_id=?';
  let query = db.query(sql, practice_id, (err, result) => {
    // [practice_id, user_id]
    if (err) throw err;
    if (!result.length) {
      res.json({ success: false });
    } else {
      res.json({
        success: true,
        prev: result
      });
    }
  });
});



router.get('/diagoneproc/:proc/:practice_id', (req, res) => {
  var array = [];
  temp = req.params.proc;
  practice_id = req.params.practice_id

  let sql = 'SELECT *, 1 AS quantity, price as retail_price FROM catalog_proc WHERE name LIKE ? && practice_id = ?';
  let query = db.query(sql, ['%' + temp + '%', practice_id], (err, result, fields) => {
    if (err) throw err;
    if (!result.length) {
      array.push('NoMessageAdded');
      res.json(array);
    } else {
      // for (var i = 0; i < result.length; i++) {
      //     array.push();
      // }
      res.json(result);
    }
  });
});
module.exports = router;