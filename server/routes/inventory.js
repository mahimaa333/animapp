const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');


const passport = require('passport');
const jwt = require('jsonwebtoken');

const db = require('../config/connections');

router.get('/', (req,res) => {
  res.send('inventory works');
});


router.post('/additem',(req,res)=>{
  var item = req.body.item;
  var stock = req.body.stock;
  var add_item = {
      name:item.name,
      code:item.code,
      stock_unit:item.stock_unit,
      strength:item.strength,
      manufacturer:item.manufacturer,
      total_stocklevel:0,
      reorder_level:item.reorder_level,
      type:item.type,
      practice_id:item.practice_id,
      user_id:item.user_id
  };
  let sql = "INSERT INTO add_item SET ?";
  let query = db.query(sql, add_item, (err, result) => {
    if (err) throw err;
      res.json({
        success:true,
        item_id: result.insertId
      });
  });
});


  router.get("/gettotalitem/:id/:first/:rows/:category", (req, res) => {
    var category = req.params.category;
    var first = req.params.first;
    var rows = req.params.rows;
    var practice_id = req.params.id;
    var item = [];
    var start = null;
    var end = null;
    let totalSql = `SELECT COUNT(item_id) as total FROM add_item WHERE practice_id = ?`;
    //Paginator Removed
    // let preSql = `SELECT item_id FROM add_item WHERE practice_id = ? ORDER BY item_id DESC LIMIT ?, ?`;
    let preSql = `SELECT item_id FROM add_item WHERE practice_id = ? ORDER BY item_id DESC`;
    let totalSqlArgs = [practice_id];
    let preSqlArgs = [practice_id, parseInt(first, 10), parseInt(rows, 10)];
    let sql = 'select a.item_id,a.name,a.code,a.stock_unit,a.strength,a.manufacturer,a.total_stocklevel,a.reorder_level,a.type,b.expiry_date,b.current_stocklevel,b.base_unit,b.base FROM add_item a LEFT OUTER JOIN add_itemstock b ON a.item_id = b.item_id WHERE a.practice_id=? AND a.item_id >= ? AND a.item_id <= ? ORDER BY a.item_id DESC';
    let allResultSql = 'select a.item_id,a.name,a.code,a.stock_unit,a.strength,a.manufacturer,a.total_stocklevel,a.reorder_level,a.type,b.expiry_date,b.current_stocklevel,b.base_unit,b.base FROM add_item a LEFT OUTER JOIN add_itemstock b ON a.item_id = b.item_id WHERE a.practice_id=? ORDER BY a.item_id DESC';
    if (category !== 'null') {
      totalSql = `SELECT COUNT(item_id) as total FROM add_item WHERE practice_id = ? AND type = ?`;
      //Paginator Removed
      // preSql = `SELECT item_id FROM add_item WHERE practice_id = ? AND type = ? ORDER BY item_id DESC LIMIT ?, ?`;
      preSql = `SELECT item_id FROM add_item WHERE practice_id = ? AND type = ? ORDER BY item_id DESC`;
      totalSqlArgs = [practice_id, category];
      preSqlArgs = [practice_id, category, parseInt(first, 10), parseInt(rows, 10)];
    // }
    let query = db.query(totalSql, totalSqlArgs, (err, result) => {
      if (err) throw err;
      var total = result[0].total;
      if (first != 'undefined' && rows != 'undefined') {
        db.query(preSql, [practice_id, category, parseInt(first, 10), parseInt(rows, 10)], (err, preSqlResult) => {
          if (err) throw err;
          if (preSqlResult[0]) {
            if (preSqlResult[0].item_id != preSqlResult[preSqlResult.length - 1].item_id) {
              end = preSqlResult[0].item_id;
              start =  preSqlResult[preSqlResult.length - 1].item_id;
            } else {
              end = start = preSqlResult[0].item_id;
            }
          }
          db.query(sql, [practice_id, start, end], (err, result) => {
            if (err) throw err;
            if(!result.length){
                res.json({success:false});
            } else {
              processInventory(result).then(processInventory => {
                item = processInventory;
                res.json({
                  success: true,
                  listsuccess: true,
                  item: item,
                  total: total
                });
              });
            }
          });
        });
      } else {
        db.query(allResultSql, practice_id, (err, result) => {
          if (err) throw err;
          if(!result.length){
              res.json({success:false});
          } else {
            processInventory(result).then(processInventory => {
              item = processInventory;
              res.json({
                success: true,
                listsuccess: true,
                item: item,
                total: total
              });
            });
          }
        });
      }
    });
  }else{
    let query = db.query(totalSql, totalSqlArgs, (err, result) => {
      if (err) throw err;
      var total = result[0].total;
      if (first != 'undefined' && rows != 'undefined') {
        db.query(preSql, [practice_id, parseInt(first, 10), parseInt(rows, 10)], (err, preSqlResult) => {
          if (err) throw err;
          if (preSqlResult[0]) {
            if (preSqlResult[0].item_id != preSqlResult[preSqlResult.length - 1].item_id) {
              end = preSqlResult[0].item_id;
              start =  preSqlResult[preSqlResult.length - 1].item_id;
            } else {
              end = start = preSqlResult[0].item_id;
            }
          }
          db.query(sql, [practice_id, start, end], (err, result) => {
            if (err) throw err;
            if(!result.length){
                res.json({success:false});
            } else {
              processInventory(result).then(processInventory => {
                item = processInventory;
                res.json({
                  success: true,
                  listsuccess: true,
                  item: item,
                  total: total
                });
              });
            }
          });
        });
      } else {
        db.query(allResultSql, practice_id, (err, result) => {
          if (err) throw err;
          if(!result.length){
              res.json({success:false});
          } else {
            processInventory(result).then(processInventory => {
              item = processInventory;
              res.json({
                success: true,
                listsuccess: true,
                item: item,
                total: total
              });
            });
          }
        });
      }
    });
  }
  });


  function processInventory(result) {
    const processInventory = new Promise((resolve, reject) => {
      var item = [];
      item.push({
        item_id: result[0].item_id,
        name: result[0].name,
        code: result[0].code,
        stock_unit: result[0].stock_unit,
        strength: result[0].strength,
        manufacturer: result[0].manufacturer,
        total_stocklevel: result[0].total_stocklevel,
        reorder_level: result[0].reorder_level,
        type: result[0].type,
        base_unit: result[0].base_unit,
        total: result[0].base * result[0].current_stocklevel,
        expiry_status: [
          {
            expiry_date: result[0].expiry_date,
            current_stocklevel: result[0].current_stocklevel
          }
        ]
      });

      for (var i = 1; i < result.length; i++) {
        if (result[i].item_id == result[i - 1].item_id) {
          for (var j = 0; j < item.length; j++) {
            if (item[j].item_id == result[i].item_id) {
              item[j].total = item[j].total + result[i].base * result[i].current_stocklevel;
              item[j].expiry_status.push({
                expiry_date: result[i].expiry_date,
                current_stocklevel: result[i].current_stocklevel
              });
            }
          }
        } else {
          item.push({
            item_id: result[i].item_id,
            name: result[i].name,
            code: result[i].code,
            stock_unit: result[i].stock_unit,
            strength: result[i].strength,
            manufacturer: result[i].manufacturer,
            total_stocklevel: result[i].total_stocklevel,
            reorder_level: result[i].reorder_level,
            type: result[i].type,
            base_unit: result[i].base_unit,
            total: result[i].base * result[i].current_stocklevel,
            expiry_status: [
              {
                expiry_date: result[i].expiry_date,
                current_stocklevel: result[i].current_stocklevel
              }
            ]
          });
        }
      }
      resolve(item);
    });
    return processInventory;
  }


  router.get("/getallstockitem/:id", (req, res) => {
    var item_id = req.params.id;
    var stocklist = [];
    var stockhistory = [];
    let sql2 = "SELECT * FROM add_item WHERE item_id=?";
    let query3 = db.query(sql2, item_id, (err, result2) => {
      if (err) throw err;
      if (!result2.length) {
        res.json({ success: false });
      } else {
        var item = { item_id: result2[0].item_id, name: result2[0].name, code: result2[0].code, stock_unit: result2[0].stock_unit, strength: result2[0].strength, manufacturer: result2[0].manufacturer, total_stocklevel: result2[0].total_stocklevel, reorder_level: result2[0].reorder_level, type: result2[0].type };
        let sql = "SELECT * FROM add_itemstock WHERE item_id=?";
        let query = db.query(sql, item_id, (err, result) => {
          if (err) throw err;
          if (!result.length) {
            res.json({ success: true, listsuccess: false, item: item });
          } else {
            for (var i = 0; i < result.length; i++) {
              stocklist.push(result[i]);
            }
            let sqlmain = `(SELECT
              a.consumed_id,
              a.timestamp,
              (CASE WHEN a.batch_no THEN a.batch_no ELSE d.batch_no END) AS batch_no,
              (CASE WHEN a.c_quantity THEN a.c_quantity ELSE a.consumed_stocklevel END) AS c_quantity,
              (CASE WHEN a.c_quantity THEN a.unit ELSE e.stock_unit END) AS unit,
              (CASE WHEN a.total THEN a.total ELSE a.consumed_stocklevel * d.retail_price END) AS total,
              a.consumed_in,
              a.recordconsume_id,
              a.status,
              b.name as doctorname,
              c.name as patientname
            FROM consumed_stock AS a
            INNER JOIN user AS b ON a.user_id = b.user_id
            INNER JOIN patient AS c ON a.patient_id = c.patient_id
            INNER JOIN add_itemstock AS d ON a.itemstock_id = d.itemstock_id
            INNER JOIN add_item AS e ON a.item_id = e.item_id
            WHERE a.item_id=? AND a.patient_id IS NOT NULL)
            UNION
            (SELECT
              a.consumed_id,
              a.timestamp,
              (CASE WHEN a.batch_no THEN a.batch_no ELSE d.batch_no END) AS batch_no,
              (CASE WHEN a.c_quantity THEN a.c_quantity ELSE a.consumed_stocklevel END) AS c_quantity,
              (CASE WHEN a.c_quantity THEN a.unit ELSE e.stock_unit END) AS unit,
              (CASE WHEN a.total THEN a.total ELSE a.consumed_stocklevel * d.retail_price END) AS total,
              a.consumed_in,
              a.recordconsume_id,
              a.status,
              b.name as doctorname,
              NULL as patientname
            FROM consumed_stock AS a
            INNER JOIN user AS b ON a.user_id = b.user_id
            INNER JOIN add_itemstock AS d ON a.itemstock_id = d.itemstock_id
            INNER JOIN add_item AS e ON a.item_id = e.item_id
            WHERE a.item_id=? AND a.patient_id IS NULL) ORDER BY consumed_id DESC`;
            // let sqlmain = "SELECT * FROM consumed_stock WHERE item_id=?";
            let query = db.query(sqlmain,[item_id,item_id] , (err, resulthistory) => {
            if (err) throw err;
            for (var j = 0; j < resulthistory.length; j++) {
              stockhistory.push(resulthistory[j]);
            }
            res.json({
              success: true,
              listsuccess: true,
              item: item,
              stock: stocklist,
              history: stockhistory
            });
            });
            }
          });
        }

        });
      });

      router.get("/gettreatmentsonlyinventory/:query/:practice_id", (req, res) => {
        var practice_id = req.params.practice_id;
        var query = req.params.query;
        var stocklist = [];
        let sql = `(SELECT
                    CONCAT(a.name, ' ' , a.strength) as name,
                    NULL as details,
                    a.stock_unit,
                    b.base,
                    b.base_unit,
                    b.batch_no,
                    b.expiry_date,
                    b.current_stocklevel,
                    b.itemstock_id,
                    b.item_id,
                    b.retail_price,
                    b.tax
                  FROM add_item AS a
                  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
                  WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NOT NULL AND b.current_stocklevel <> '0')
                  UNION
                  (SELECT
                    a.name,
                    NULL as details,
                    a.stock_unit,
                    b.base,
                    b.base_unit,
                    b.batch_no,
                    b.expiry_date,
                    b.current_stocklevel,
                    b.itemstock_id,
                    b.item_id,
                    b.retail_price,
                    b.tax
                  FROM add_item AS a
                  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
                  WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NULL AND b.current_stocklevel <> '0')`;
        db.query(sql,
        ['%' + query + '%', practice_id,
        '%' + query + '%', practice_id],
        (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      });

      router.get("/gettreatmentsinventory/:query/:practice_id/:inventory", (req, res) => {
        var inventory = req.params.inventory;
        var practice_id = req.params.practice_id;
        var query = req.params.query;
        var stocklist = [];
        if(inventory === 'false'){
          let sql = `(SELECT
            CONCAT(a.name, ' ' , a.strength) as name,
            NULL as details,
            a.stock_unit,
            b.base,
            b.base_unit,
            b.batch_no,
            b.expiry_date,
            b.current_stocklevel,
            b.itemstock_id,
            b.item_id,
            b.retail_price,
            b.tax
          FROM add_item AS a
          INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
          WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NOT NULL AND b.current_stocklevel <> '0')
          UNION
          (SELECT
            a.name,
            NULL as details,
            a.stock_unit,
            b.base,
            b.base_unit,
            b.batch_no,
            b.expiry_date,
            b.current_stocklevel,
            b.itemstock_id,
            b.item_id,
            b.retail_price,
            b.tax
          FROM add_item AS a
          INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
          WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NULL AND b.current_stocklevel <> '0')
          UNION
          (SELECT
            a.name,
            'Procedure Catalog' as details,
            NULL as stock_unit,
            NULL as base,
            NULL as base_unit,
            NULL as batch_no,
            NULL as expiry_date,
            NULL as current_stocklevel,
            NULL as itemstock_id,
            NULL as item_id,
            a.price as retail_price,
            a.tax
            FROM catalog_proc AS a
            WHERE a.name LIKE ? AND practice_id = ?)
            UNION
            (SELECT
            a.name,
            'Lab Diagnosis' as details,
            NULL as stock_unit,
            NULL as base,
            NULL as base_unit,
            NULL as batch_no,
            NULL as expiry_date,
            NULL as current_stocklevel,
            NULL as itemstock_id,
            NULL as item_id,
            a.price as retail_price,
            a.tax
            FROM catalog_diaglab AS a
            WHERE a.name LIKE ? AND practice_id = ?)
            UNION
            (SELECT
            a.name,
            'Imaging Catalog' as details,
            NULL as stock_unit,
            NULL as base,
            NULL as base_unit,
            NULL as batch_no,
            NULL as expiry_date,
            NULL as current_stocklevel,
            NULL as itemstock_id,
            NULL as item_id,
            a.price as retail_price,
            a.tax
            FROM catalog_diagimag AS a
            WHERE a.name LIKE ? AND practice_id = ?)
            UNION
            (SELECT
            a.name,
            'Preventive Catalog' as details,
            NULL as stock_unit,
            NULL as base,
            NULL as base_unit,
            NULL as batch_no,
            NULL as expiry_date,
            NULL as current_stocklevel,
            NULL as itemstock_id,
            NULL as item_id,
            a.price as retail_price,
            a.tax
            FROM catalog_prev AS a
            WHERE a.name LIKE ? AND practice_id = ?)`;
    db.query(sql,
    ['%' + query + '%', practice_id,
    '%' + query + '%', practice_id,
    '%' + query + '%', practice_id,
    '%' + query + '%', practice_id,
    '%' + query + '%', practice_id,
    '%' + query + '%', practice_id],
    (err, result) => {
    if (err) throw err;
    res.send(result);
    });
    } else {
      console.log('elsepart');
      let sql = `(SELECT
        CONCAT(a.name, ' ' , a.strength) as name,
        NULL as details,
        a.stock_unit,
        b.base,
        b.base_unit,
        b.batch_no,
        b.expiry_date,
        b.current_stocklevel,
        b.itemstock_id,
        b.item_id,
        b.retail_price,
        b.tax
      FROM add_item AS a
      INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
      WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NOT NULL)
      UNION
      (SELECT
        a.name,
        NULL as details,
        a.stock_unit,
        b.base,
        b.base_unit,
        b.batch_no,
        b.expiry_date,
        b.current_stocklevel,
        b.itemstock_id,
        b.item_id,
        b.retail_price,
        b.tax
      FROM add_item AS a
      INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
      WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NULL)`;
    db.query(sql,
    ['%' + query + '%', practice_id,
    '%' + query + '%', practice_id],
    (err, result) => {
    if (err) throw err;
    res.send(result);
    });
     }
  });


  // router.get("/gettreatmentsinventory/:query/:practice_id", (req, res) => {
  //   var practice_id = req.params.practice_id;
  //   var query = req.params.query;
  //   var stocklist = [];
  //   let sql = `(SELECT
  //               CONCAT(a.name, ' ' , a.strength) as name,
  //               NULL as details,
  //               a.stock_unit,
  //               b.base,
  //               b.base_unit,
  //               b.batch_no,
  //               b.expiry_date,
  //               b.current_stocklevel,
  //               b.itemstock_id,
  //               b.item_id,
  //               b.retail_price,
  //               b.tax
  //             FROM add_item AS a
  //             INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  //             WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NOT NULL)
  //             UNION
  //             (SELECT
  //               a.name,
  //               NULL as details,
  //               a.stock_unit,
  //               b.base,
  //               b.base_unit,
  //               b.batch_no,
  //               b.expiry_date,
  //               b.current_stocklevel,
  //               b.itemstock_id,
  //               b.item_id,
  //               b.retail_price,
  //               b.tax
  //             FROM add_item AS a
  //             INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  //             WHERE a.name LIKE ? AND practice_id = ? AND a.strength IS NULL)
  //             UNION
  //             (SELECT
  //               a.name,
  //               'Procedure Catalog' as details,
  //               NULL as stock_unit,
  //               NULL as base,
  //               NULL as base_unit,
  //               NULL as batch_no,
  //               NULL as expiry_date,
  //               NULL as current_stocklevel,
  //               NULL as itemstock_id,
  //               NULL as item_id,
  //               a.price as retail_price,
  //               a.tax
  //               FROM catalog_proc AS a
  //               WHERE a.name LIKE ? AND practice_id = ?)
  //               UNION
  //               (SELECT
  //               a.name,
  //               'Lab Diagnosis' as details,
  //               NULL as stock_unit,
  //               NULL as base,
  //               NULL as base_unit,
  //               NULL as batch_no,
  //               NULL as expiry_date,
  //               NULL as current_stocklevel,
  //               NULL as itemstock_id,
  //               NULL as item_id,
  //               a.price as retail_price,
  //               a.tax
  //               FROM catalog_diaglab AS a
  //               WHERE a.name LIKE ? AND practice_id = ?)
  //               UNION
  //               (SELECT
  //               a.name,
  //               'Imaging Catalog' as details,
  //               NULL as stock_unit,
  //               NULL as base,
  //               NULL as base_unit,
  //               NULL as batch_no,
  //               NULL as expiry_date,
  //               NULL as current_stocklevel,
  //               NULL as itemstock_id,
  //               NULL as item_id,
  //               a.price as retail_price,
  //               a.tax
  //               FROM catalog_diagimag AS a
  //               WHERE a.name LIKE ? AND practice_id = ?)
  //               UNION
  //               (SELECT
  //               a.name,
  //               'Preventive Catalog' as details,
  //               NULL as stock_unit,
  //               NULL as base,
  //               NULL as base_unit,
  //               NULL as batch_no,
  //               NULL as expiry_date,
  //               NULL as current_stocklevel,
  //               NULL as itemstock_id,
  //               NULL as item_id,
  //               a.price as retail_price,
  //               a.tax
  //               FROM catalog_prev AS a
  //               WHERE a.name LIKE ? AND practice_id = ?)`;
  //   db.query(sql,
  //   ['%' + query + '%', practice_id,
  //   '%' + query + '%', practice_id,
  //   '%' + query + '%', practice_id,
  //   '%' + query + '%', practice_id,
  //   '%' + query + '%', practice_id,
  //   '%' + query + '%', practice_id],
  //   (err, result) => {
  //     if (err) throw err;
  //     res.send(result);
  //   });
  // });

  router.get("/gettreatments/:query/:practice_id", (req, res) => {
    var practice_id = req.params.practice_id;
    var query = req.params.query;
    var stocklist = [];
    let sql = `(SELECT
                a.name,
                'Procedure Catalog' as details,
                a.price as retail_price,
                a.tax
              FROM catalog_proc AS a
              WHERE a.name LIKE ? AND practice_id = ?)
              UNION
              (SELECT
              a.name,
              'Lab Diagnosis' as details,
              a.price as retail_price,
              a.tax
              FROM catalog_diaglab AS a
              WHERE a.name LIKE ? AND practice_id = ?)
              UNION
              (SELECT
              a.name,
              'Imaging Catalog' as details,
              a.price as retail_price,
              a.tax
              FROM catalog_diagimag AS a
              WHERE a.name LIKE ? AND practice_id = ?)
              UNION
              (SELECT
              a.name,
              'Preventive Catalog' as details,
              a.price as retail_price,
              a.tax
              FROM catalog_prev AS a
              WHERE a.name LIKE ? AND practice_id = ?)`;
    db.query(sql, ['%' + query + '%', practice_id, '%' + query + '%', practice_id, '%' + query + '%', practice_id, '%' + query + '%', practice_id, '%' + query + '%', practice_id], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

  router.get("/getstockitemlist/:id", (req, res) => {
    var item_id = req.params.id;
    var stocklist = [];
    let sql2 = 'SELECT name,stock_unit FROM add_item WHERE item_id=?';
    let query3 = db.query(sql2, item_id, (err, result2) => {
        if (err) throw err;
        if(!result2.length){
            res.json({success:false});
        } else {
        // var item = {
        //     item_id: result2[0].item_id,
        //     name: result2[0].name,
        //     code: result2[0].code,
        //     stock_unit: result2[0].stock_unit,
        //     strength: result2[0].strength,
        //     manufacturer: result2[0].manufacturer,
        //     total_stocklevel: result2[0].total_stocklevel,
        //     reorder_level: result2[0].reorder_level,
        //     type: result2[0].type,
        // }
        let name = result2[0].name;
        let stock_unit = result2[0].stock_unit;
        let sql = 'SELECT * FROM add_itemstock WHERE item_id=?';
        let query = db.query(sql, item_id, (err, result) => {
            if (err) throw err;
            if(!result.length){
            res.json({
              success: true,
              listsuccess: false
            });
            } else {
            for (var i = 0; i < result.length; i++) {
            stocklist.push({
                label: result[i].batch_no,
                value: {
                    itemstock_id: result[i].itemstock_id,
                    name: name,
                    expiry_date: result[i].expiry_date,
                    current_stocklevel: result[i].current_stocklevel,
                    base: result[i].base,
                    base_unit: result[i].base_unit,
                    batch_no: result[i].batch_no,
                    stock_unit: stock_unit,
                    retail_price: result[i].retail_price
                }
            });
            }
            res.json({
                success: true,
                listsuccess: true,
                stock: stocklist
            });
            }
        });
    }
  });
});


router.put('/additem',(req,res)=>{
    var item = req.body.item;
    var item_id = req.body.item_id;
    var add_item = {
        name:item.name,
        code:item.code,
        stock_unit:item.stock_unit,
        reorder_level:item.reorder_level,
        type:item.type,
    };
    let sql = "UPDATE add_item SET ? WHERE item_id=?";
    let query = db.query(sql,[add_item,item_id ], (err, result) => {
      if (err) throw err;
      res.json({
        success:true,
        item:item,
        });
    });
});



// router.put('/addstock',(req,res)=>{
//     console.log("entering updatestock");
//     var stock = req.body.stock;
//     console.log(stock);
//     var itemstock_id = req.body.itemstock_id;
//     console.log(itemstock_id);
//     let add_itemstock = {
//         batch_no: stock.batch_no,
//         expiry_date: stock.expiry_date,
//         initial_stocklevel: stock.initial_stocklevel,
//         retail_price: stock.retail_price,
//     }
//     let sql = "UPDATE add_itemstock SET ? WHERE itemstock_id=?";
//     let query = db.query(sql,[add_itemstock,itemstock_id], (err, result) => {
//       if (err) throw err;
//       console.log(result);
//       res.json({
//         success:true,
//         stock:stock,
//         });
//     });
// });


router.delete("/additem/:id", (req, res) => {
    var item_id = req.params.id;
    let sqldeletediag = 'DELETE FROM add_item WHERE item_id=?';
    let query = db.query(sqldeletediag,item_id, (err, result) => {
      if (err) throw err;
      let sqldelete = 'DELETE FROM add_itemstock WHERE item_id=?';
      let query = db.query(sqldelete, item_id, (err, result) => {
        if (err) throw err;
        res.json({
            success:true,
        });
    });
    });
  });


router.delete("/addstock/:id/:stocklevel/:item_id", (req, res) => {
    var itemstock_id = req.params.id;
    var stocklevel = req.params.stocklevel;
    var item_id = req.params.item_id;
    let sqldeletediag = 'DELETE FROM add_itemstock WHERE itemstock_id=?';
    let query = db.query(sqldeletediag,itemstock_id, (err, result) => {
      if (err) throw err;
      let sqlupdate = "UPDATE add_item SET total_stocklevel = total_stocklevel - ? WHERE item_id=?";
      let query = db.query(sqlupdate,[stocklevel,item_id], (err, result) => {
        if (err) throw err;
        res.json({
            success:true,
            stocklevel: stocklevel
        });
      });
    });
  });


router.post('/addstock', (req, res) => {
    var stock_unit = req.body.stock_unit;
    let data = req.body;
    delete data['stock_unit'];
    let sql = `INSERT INTO add_itemstock SET ?`;
    let updateItemSql = `UPDATE add_item SET stock_unit = ?, total_stocklevel = CASE WHEN total_stocklevel THEN total_stocklevel ELSE 0 END + ? WHERE item_id=?`;
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        var itemstock_id = result.insertId;
        db.query(updateItemSql, [stock_unit, data.current_stocklevel, data.item_id ,], (err, result) => {
            if (err) throw err;
            res.send({itemstock_id: itemstock_id});
        });
    });
});

router.post('/consumestock', (req, res) => {
    let data = req.body;
    console.log(data);
    let sql = `INSERT INTO consumed_stock SET ?`;
    let updateItemSql = `UPDATE add_item SET total_stocklevel = total_stocklevel - ? WHERE item_id=?`;
    let updateStockSql = `UPDATE add_itemstock SET current_stocklevel = current_stocklevel - ? WHERE itemstock_id=?`;
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        db.query(updateStockSql, [data.consumed_stocklevel, data.itemstock_id], (err, result) => {
            if (err) throw err;
            db.query(updateItemSql, [data.consumed_stocklevel, data.item_id], (err, result) => {
                if (err) throw err;
                res.sendStatus(200);
            });
        });
    });
});

router.get('/dashboard/inventory/:practice_id', (req, res) => {
  var practice_id = req.params.practice_id;
  let stockSql = `SELECT
  SUM(d.total_stocklevel) as total_stocklevel,
  SUM(d.low_stock) as low_stock,
  SUM(d.reorder) as reorder,
  SUM(d.expired_stock) as expired_stock
  FROM (SELECT (a.total_stocklevel) as total_stocklevel,
  (CASE WHEN (a.reorder_level - a.total_stocklevel) > 0 THEN (a.reorder_level - a.total_stocklevel) ELSE 0 END) as low_stock,
  (CASE WHEN (a.reorder_level - a.total_stocklevel) > 0 THEN a.reorder_level ELSE 0 END) as reorder,
  SUM(CASE WHEN b.expiry_date < ? THEN b.current_stocklevel ELSE 0 END) as expired_stock FROM add_item as a INNER JOIN add_itemstock as b ON a.item_id = b.item_id
  WHERE practice_id = ? GROUP BY a.item_id) as d`;
  let query = db.query(stockSql, [moment().format('YYYY-MM-DD'), practice_id], (err, result) => {
      if (err) throw err;
      res.send(result);
  });
});

router.get('/gettaxes', (req, res) => {
  let sql = 'SELECT tax FROM tax';
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
});

module.exports=router;
