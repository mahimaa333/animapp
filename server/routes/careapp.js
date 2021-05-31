const express = require('express');
const router = express.Router();
const moment = require('moment');
const config = require('../config/database');
const db = require('../config/connections');
const colors = require('colors');
const http = require('http');

router.get('/', (req, res) => {
    res.send('Welcome to AnimApp care Mobile API.');
});

/*********************************** Reasons *****************************************/

//Select All Reasons
router.get('/symptoms_subjective/:practice_id', (req, res) => {
    temp = req.params.practice_id;
    sql = `(select symptoms from symptoms_subjective where practice_id IS NULL) 
    union
    (select symptoms from symptoms_subjective where  practice_id = ?)`;
    let query = db.query(sql, temp, (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json({ msg: 'No Symptoms Matched' });
        } else {
            res.json(data);
        };
    });
});

//Add New Reason
router.post('/symptomslistadd', (req, res) => {
    var symptom = req.body;
    console.log(symptom);
    let sql = "INSERT INTO symptoms_subjective SET ?";
    let query = db.query(sql, symptom, (err, result) => {
        if (err) throw err;
        res.send({ success: true, msg: 'Data inserted' });
    });
});

//Consulted Reason
router.post('/consulted/reason', (req, res) => {
    var reason = req.body;
    console.log(reason);
    let sql = `INSERT INTO subjective SET ?`;
    let query = db.query(sql, reason, (err, result) => {
        if (err) throw err;
        res.send({ success: true, id: result.insertId });
    });
});

//Update Reason
router.put('/consulted/reason', (req, res) => {
    var cheifcom = req.body.reason;
    var subject_id = req.body.subject_id;
    console.log(cheifcom, subject_id);
    let sql = "UPDATE subjective SET cheifcom = '" + cheifcom + "' where subject_id = '" + subject_id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

//Select Consulted Reasons
// router.get('/view/reasons/:subject_id', (req, res) => {
//     temp = req.params.subject_id;
//     sql = `select * from subjective where subject_id = ?`;
//     let query = db.query(sql, temp, (err, data, fields) => {
//         if (err) throw err;
//         if (!data.length) {
//             res.json({ success: false, data: data });
//         } else {
//             res.json({ success: true, data: data });
//         };
//     });
// });

/*************************************** Vitals ***********************************/

//Vital's
router.post('/consulted/vitals', (req, res) => {
    var objective = req.body;
    console.log(objective);
    let sql = "INSERT INTO objective SET ?";
    let query = db.query(sql, objective, (err, result) => {
        console.log(result);
        if (err) throw err;
        res.send({ success: true, id: result.insertId });
    });
});

//Update Vitals
router.put('/consulted/vitals/:objective_id', (req, res) => {
    var objective = req.body;
    var objective_id = req.params.objective_id;
    console.log(objective, objective_id);
    let sql = "UPDATE objective SET ? where objective_id ='" + objective_id + "'";
    let query = db.query(sql, objective, (err, result) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

//Select Consulted Vitals
// router.get('/view/vitals/:objective_id', (req, res) => {
//     temp = req.params.objective_id;
//     sql = `select * from objective where objective_id = ?`;
//     let query = db.query(sql, temp, (err, data, fields) => {
//         if (err) throw err;
//         if (!data.length) {
//             res.json({ success: false, data: data });
//         } else {
//             res.json({ success: true, data: data });
//         };
//     });
// });

/*********************************** Diagnoses **************************************/

//Select All Diagnoses
router.get('/diagnoses/:practice_id', (req, res) => {
    temp = req.params.practice_id;
    sql = `(select * from assessment_dropdown where practice_id IS NULL) 
    union
    (select * from assessment_dropdown where  practice_id = ?)`;
    let query = db.query(sql, temp, (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json({ msg: 'No Symptoms Matched' });
        } else {
            res.json(data);
        };
    });
});

//Add New Diagnoses
router.post('/diagnosesadd', (req, res) => {
    var symptom = req.body;
    console.log(symptom);
    let sql = "INSERT INTO assessment_dropdown SET ?";
    let query = db.query(sql, symptom, (err, result) => {
        if (err) throw err;
        res.send({ success: true, id: result.insertId });
    });
});

//Consulted Diagnoses
router.post('/consulted/diagnoses', (req, res) => {
    var reason = req.body;
    console.log(reason);
    let sql = "INSERT INTO assessment SET ?";
    let query = db.query(sql, reason, (err, result) => {
        if (err) throw err;
        res.send({ success: true, id: result.insertId });
    });
});

//Update Diagnoses
router.put('/consulted/diagnoses/:assess_id', (req, res) => {
    var reason = req.body;
    var assess_id = req.params.assess_id;
    console.log(reason, assess_id);
    let sql = "UPDATE assessment SET ? where assess_id ='" + assess_id + "'";
    let query = db.query(sql, reason, (err, result) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

//Select Consulted Diagnoses
// router.get('/view/diagnoses/:assess_id', (req, res) => {
//     temp = req.params.assess_id;
//     sql = `select * from assessment where assess_id = ?`;
//     let query = db.query(sql, temp, (err, data, fields) => {
//         if (err) throw err;
//         if (!data.length) {
//             res.json({ success: false, data: data });
//         } else {
//             res.json({ success: true, data: data });
//         };
//     });
// });

/********************************** Physical Examination *****************************/

//Physical Examination
router.post('/consulted/physicalexamination', (req, res) => {
    var physical_examination = req.body;
    console.log(physical_examination);
    let sql = "INSERT INTO physicalexam SET ?";
    let query = db.query(sql, physical_examination, (err, result) => {
        console.log(result);
        if (err) throw err;
        res.send({ success: true, id: result.insertId });
    });
});

//Update Physical Examination
router.put('/consulted/physicalexamination/:phy_id', (req, res) => {
    var physical_examination = req.body;
    var phy_id = req.params.phy_id;
    console.log(physical_examination, phy_id);
    let sql = "UPDATE physicalexam SET ? where phy_id ='" + phy_id + "'";
    let query = db.query(sql, physical_examination, (err, result) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

//Select Consulted Physical Examination
// router.get('/view/physicalexamination/:phy_id', (req, res) => {
//     temp = req.params.phy_id;
//     sql = `select * from physicalexam where phy_id = ?`;
//     let query = db.query(sql, temp, (err, data, fields) => {
//         if (err) throw err;
//         if (!data.length) {
//             res.json({ success: false, data: data });
//         } else {
//             res.json({ success: true, data: data });
//         };
//     });
// });

/************************************* Preventive Care **********************************/

//Select Consulted Preventive Care
router.get('/view/preventive_care/:preventive_id', (req, res) => {
    temp = req.params.preventive_id;
    sql = `select * from pc_vaccination where preventive_id = ?`;
    let query = db.query(sql, temp, (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.send(data);
        } else {
            res.send(data);
        };
    });
});

//Preventive Reminder
router.post('/preventive/nextschedule', (req, res) => {
    console.log(req.body);
    let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
    let clinicSql = `SELECT name as clinic_name, mobile_no as clinic_no FROM practice WHERE practice_id = ?`;
    db.query(selectSql, req.body.patient_id, (err, result) => {
        if (err) throw err;
        var mobileNo = result[0].mobile_no;
        var parentName = result[0].name;
        var petName = result[0].pet_name;
        db.query(clinicSql, req.body.practice_id, (err, result) => {
            if (err) throw err;
            var clinicName = result[0].clinic_name;
            var clinicNumber = result[0].clinic_no;
            var date = moment(req.body.date).format('DD-MM-YY');
            ///////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
            // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67941&F1=' + parentName + '&F2=' + petName + '&F3=' + req.body.preventive_type + '&F4=' + clinicName.slice(0, 30) + '&F5=' + clinicName.slice(30, clinicName.length) + '&F6=' + date + '&F7=' + clinicNumber + '&response=Y';
            var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                '&message=Hello ' + parentName + ', your pet ' + petName + ' reminder for the next round of ' + req.body.preventive_type + ' at ' + clinicName.slice(0, 30) + ' is on ' + date + '.  Please call us at ' + clinicNumber + ' to confirm a time. Note: Prevention is better than Cure - AnimAp'
            '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161493001835019&response=Y'
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            http.get(reminderUrl);
            var data = req.body;
            var scheduleDetails = {
                preventive_type: data.preventive_type,
                date: data.date,
                time: null,
                user_id: data.user_id,
                practice_id: data.practice_id,
                patient_id: data.patient_id,
                preventive_id: null
            }
            let insertSQL = 'INSERT INTO preventive_reminder set ?';
            let insertQuery = db.query(insertSQL, scheduleDetails, (err, result) => {
                if (err) throw err;
                res.json({
                    success: true
                })
            });
        });
    });
});

/************************************* Treatment Plan **********************************/

//Select All in Plan
router.get('/plan/:practice_id', (req, res) => {
    temp = req.params.practice_id;
    sql = "(SELECT proc_id as id,name,price,tax,total,concat('procedure_catalog') as type FROM catalog_proc where practice_id= '" + temp + "') union (SELECT prev_id as id,name,price,tax,total,concat('preventive_catalog') as type FROM catalog_prev where practice_id= '" + temp + "') union (SELECT diagimag_id as id,name,price,tax,total,concat('diagimag_catalog') as type FROM catalog_diagimag where practice_id= '" + temp + "') union (SELECT diaglab_id as id,name,price,tax,total,concat('diaglab_catalog') as type FROM catalog_diaglab where practice_id= '" + temp + "')";
    let query = db.query(sql, (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json(data);
        } else {
            res.json(data);
        };
    });
});
/**
 * Done by Vijay 
 *  Patch up work, below function calculate current age (1Y 11M 8D) to insert age into preventive_care
 *  when it is posted ( /consulted/plan/:pracice_id/:user_id/:patient_id )
 */
function calculateAge(dateOfBirth) {
    let today = moment();
    let dob = moment(dateOfBirth);
    let diff = today.diff(dob, 'days'); // returns no of days
    let year = Math.floor(diff / 365); // to calculate year
    let month = Math.floor(Math.floor(diff % 365) / 31);// to calculate month
    let day = Math.floor(Math.floor(Math.floor(diff % 365) % 31)); // to calculate day
    console.log(today.diff(dob, 'days'), year, month, day);
    return `${year}Y ${month}M ${day}D`;
}


/**
 * This API is rewritten below, this is deprecated because it does not response with ample data for mobile
 * app 
 * 
 * 
// Consulted plan
router.post('/consulted/plan/:practice_id/:user_id/:patient_id', (req, res) => {
    var plan = req.body;
    var practice_id = req.params.practice_id;
    var user_id = req.params.user_id;
    var patient_id = req.params.patient_id;
    console.log(plan);
    let procedure_catalog = "INSERT INTO plan_procedures SET ?";
    let preventive_care = "INSERT INTO preventive_care SET ?";
    let pc_vaccination = "INSERT INTO pc_vaccination SET ?";
    let diagimag_catalog = "INSERT INTO plan_imaging SET ?";
    let diaglab_catalog = "INSERT INTO plan_lab SET ?";
    let plan_insert = "INSERT INTO planning SET ?";
    let prev_data = {
        practice_id: practice_id,
        user_id: user_id,
        patient_id: patient_id,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    let plan_data = {
        practice_id: practice_id,
        user_id: user_id,
        patient_id: patient_id,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    let query = db.query(plan_insert, plan_data, (err, result) => {
        if (err) throw err;
        var plan_id = result.insertId;

        let preventive_create_flag = false;
        var preventive_id;
        /**
         * before it generates preventive_id without any condition, this create bug ( Create empty preventive 
         * history if no preventive item is selected )         
         
        plan.forEach(ele =>{
            if(ele.type == 'preventive_catalog'){
                preventive_create_flag = true;                
            }   
        })  
        if(preventive_create_flag){
            let query = db.query('select age_dob as dob from patient where patient_id= ?', patient_id, (err, result)=>{
                let dob = result[0].dob;
                prev_data.age =  calculateAge(dob); // current age in (1Y 11M 5D) format to insert into preventive_care
                let query = db.query(preventive_care, prev_data, (err, result) => {
                    if (err) throw err;
                    preventive_id = result.insertId;
                    console.log('element.typepreventive_idpreventive_idpreventive_idpreventive_id', preventive_id);                    
                })
            })
        }   
            plan.forEach(element => {
                console.log('element.type', element.type);
                if (element.type == 'procedure_catalog') {
                    let procedure_catalog_data = {
                        plan_id: plan_id,
                        proc_id: element.type_id,
                        test: element.name
                    };
                    let query = db.query(procedure_catalog, procedure_catalog_data, (err, result) => {
                        if (err) throw err;
                    });
                } else if (element.type == 'preventive_catalog') {
                    // let query = db.query(preventive_care, prev_data, (err, result) => {
                    //     if (err) throw err;
                    //     preventive_id = result.insertId;
                    let pc_vaccination_data = {
                        preventive_id: preventive_id,
                        prev_id: element.type_id,
                        treatment: element.name,
                        c_quantity: '1'
                    };
                    console.log('pc_vaccination_data', pc_vaccination_data);
                    let query = db.query(pc_vaccination, pc_vaccination_data, (err, result) => {
                        if (err) throw err;
                    });
                    // });
                } else if (element.type == 'diagimag_catalog') {
                    let diagimag_catalog_data = {
                        plan_id: plan_id,
                        diagimag_id: element.type_id,
                        test: element.name
                    };
                    let query = db.query(diagimag_catalog, diagimag_catalog_data, (err, result) => {
                        if (err) throw err;
                    });
                } else if (element.type == 'diaglab_catalog') {
                    let diaglab_catalog_data = {
                        plan_id: plan_id,
                        diaglab_id: element.type_id,
                        test: element.name
                    };
                    let query = db.query(diaglab_catalog, diaglab_catalog_data, (err, result) => {
                        if (err) throw err;
                    });
                }
            });
            Promise.all(plan).then(res.send({ success: true, preventive_id: preventive_id, plan_id: plan_id }));    
        });
    });
    */

/************************************** Records ****************************************/

//Create records
router.post('/create/record', (req, res) => {
    var record = req.body;
    console.log(record);
    let sql = "INSERT INTO record SET ?";
    let query = db.query(sql, record, (err, result) => {
        console.log(result);
        let record_id = result.insertId;
        if (err) throw err;
        if (record.event_type == "preventive_care") {
            let sql1 = "UPDATE preventive_reminder SET time = ? where reminder_id = ?";
            let query1 = db.query(sql1, [moment().utcOffset("+05:30").format('HH:mm:ss'), record.event_id], (err, result1) => {
                if (err) throw err;
                console.log(result1);
                res.send({ success: true, id: record_id });
            });
        } else {
            res.send({ success: true, id: record_id });
        }
    });
});

//Select Record
router.get('/record/:record_id/:event_id', (req, res) => {
    record_id = req.params.record_id;
    event_id = req.params.event_id;
    sql = `select * from record where event_id = ? and record_id = ?`;
    let query = db.query(sql, [event_id, record_id], (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json(data);
        } else {
            res.json(data);
        };
    });
});

//Select plan & preventive from record

router.get('/invoiceid/:record_id', (req, res) => {
    let record_id = req.params.record_id;
    console.log(record_id);
    let record = `select * from record where record_id= ?`;
    let query = db.query(record, record_id, (err, data) => {
        if (err) throw err;
        let preventive_id = data[0].preventive_id;
        let plan_id = data[0].plan_id;
        console.log(preventive_id, plan_id);
        if (!preventive_id && plan_id) {
            let invoice = `select * from invoice where preventive_id is null and plan_id= ?`;
            let query = db.query(invoice, [plan_id], (err, data1) => {
                if (err) throw err;
                res.send(data1[0]);
            });
        } else if (preventive_id && !plan_id) {
            console.log();
            let invoice = `select * from invoice where preventive_id= ? and plan_id is null`;
            let query = db.query(invoice, [preventive_id], (err, data1) => {
                if (err) throw err;
                res.send(data1[0]);
            });
        } else if (preventive_id && plan_id) {
            let invoice = `select * from invoice where preventive_id= ? and plan_id =?`;
            let query = db.query(invoice, [preventive_id, plan_id], (err, data1) => {
                if (err) throw err;
                res.send(data1[0]);
            });
        } else if (!preventive_id && !plan_id) {
            res.send(null);
        }
    });
});

//Select View record

router.get('/recordview/:record_id', (req, res) => {
    let record_id = req.params.record_id;
    console.log('record_id', record_id);
    let record = `select subjective.cheifcom,
    objective.temp,objective.weight,objective.pulse,objective.resprate,
    objective.mucmemb,objective.mucmemb_notes,objective.lymnodes,objective.lymnodes_notes,
    objective.hydration,objective.crt,objective.bcs,objective.visual_exam,objective.visexam_notes,
    assessment.diagnosis,record.preventive_id,record.prescription_id,physicalexam.*
    from record
    left join subjective on record.subject_id IS NOT NULL and record.subject_id = subjective.subject_id
    left join objective on record.objective_id IS NOT NULL and record.objective_id = objective.objective_id
    left join physicalexam on record.objective_id IS NOT NULL and objective.objective_id = physicalexam.objective_id
    left join assessment on record.assess_id IS NOT NULL and record.assess_id = assessment.assess_id
    where record.record_id = ?`;
    let query = db.query(record, record_id, (err, data) => {
        if (err) throw err;
        console.log('data[0]', data[0]);
        res.send(data[0]);
    });
});

//Update Vitals in Record
router.put('/record/objective', (req, res) => {
    var record_id = req.body.record_id;
    var objective_id = req.body.objective_id;
    sql = `UPDATE record SET objective_id = ? where record_id = ?`;
    let query = db.query(sql, [objective_id, record_id], (err, data, fields) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

//Update Diagnoses in Record
router.put('/record/diagnoses', (req, res) => {
    var record_id = req.body.record_id;
    var assess_id = req.body.assess_id;
    sql = `UPDATE record SET assess_id = ? where record_id = ?`;
    let query = db.query(sql, [assess_id, record_id], (err, data, fields) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

//Update Plan and Preventive in Record
router.put('/record/treatmentplan', (req, res) => {
    var record_id = req.body.record_id;
    var plan_id = req.body.plan_id;
    var preventive_id = req.body.preventive_id;
    sql = "UPDATE record SET plan_id = '" + plan_id + "', preventive_id ='" + preventive_id + "' where record_id = '" + record_id + "'";
    let query = db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.send({ success: true });
    });
});

/************************************** Invoice ****************************************/

//Generate Invoice

router.post('/create/invoice/:practice_id/:user_id/', (req, res) => {
    var invoice = req.body;
    var practice_id = req.params.practice_id;
    var user_id = req.params.user_id;
    var date = moment().format('YYYY-MM');
    // console.log(record);
    let sql = "select count(*) as count from invoice where date like '" + date + "%' and practice_id ='" + practice_id + "'";
    let query = db.query(sql, (err, result) => {
        let ref_count = result[0].count + 1;
        console.log(ref_count);
        if (err) throw err;
        let sql = "select * from patient where patient_id = '" + invoice.patient_id + "'";
        let query = db.query(sql, (err, result) => {
            let pet_parent_id = result[0].pet_parent_id;
            if (err) throw err;
            let invoice_data = {
                ref: 'IN:' + prefixZeroes(practice_id, 2) + '-' + moment().format('YYMM') + '-' + prefixZeroes(ref_count, 4),
                date: moment().format('YYYY-MM-DD'),
                status: 'Draft',
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                practice_id: practice_id,
                user_id: user_id,
                patient_id: invoice.patient_id,
                preventive_id: invoice.preventive_id,
                plan_id: invoice.plan_id,
                pet_parent_id: pet_parent_id,
                queuestaff: '0'
            };
            let invoice_insert = 'INSERT INTO invoice SET ?';
            let query1 = db.query(invoice_insert, invoice_data, (err, result1) => {
                if (err) throw err;
                res.send({ success: true, id: result1.insertId });
            });
        });
    });
});

//Consulted in Invoice Items

router.post('/create/invoiceitems/:invoice_id', (req, res) => {
    var invoice_items = req.body;
    var invoice_id = req.params.invoice_id;
    var total = 0;
    invoice_items.forEach(element => {
        let invoice_items_data = [];
        if (element.type == 'procedure_catalog') {
            invoice_items_data = {
                invoice_id: invoice_id,
                name: element.name,
                quantity: '1',
                retail_price: element.price,
                tax: element.tax,
                total: element.total,
                procedure_id: element.procedure_id
            };
            total = total + element.total;
            console.log(invoice_items_data);
            let invoice_items_insert = 'INSERT INTO invoice_items SET ?';
            let query1 = db.query(invoice_items_insert, invoice_items_data, (err, result1) => {
                if (err) throw err;
            });
        } else if (element.type == 'preventive_catalog') {
            invoice_items_data = {
                invoice_id: invoice_id,
                name: element.name,
                quantity: '1',
                retail_price: element.price,
                tax: element.tax,
                total: element.total,
                // procedure_id: element.type_id,
                pc_vaccine_id: element.pc_vaccine_id
            };
            total = total + element.total;
            console.log(invoice_items_data);
            let invoice_items_insert = 'INSERT INTO invoice_items SET ?';
            let query1 = db.query(invoice_items_insert, invoice_items_data, (err, result1) => {
                if (err) throw err;
            });
        } else if (element.type == 'diagimag_catalog') {
            invoice_items_data = {
                invoice_id: invoice_id,
                name: element.name,
                quantity: '1',
                retail_price: element.price,
                tax: element.tax,
                total: element.total,
                planimg_id: element.diagimg_id
            };
            total = total + element.total;
            console.log(invoice_items_data);
            let invoice_items_insert = 'INSERT INTO invoice_items SET ?';
            let query1 = db.query(invoice_items_insert, invoice_items_data, (err, result1) => {
                if (err) throw err;
            });
        } else if (element.type == 'diaglab_catalog') {
            invoice_items_data = {
                invoice_id: invoice_id,
                name: element.name,
                quantity: '1',
                retail_price: element.price,
                tax: element.tax,
                total: element.total,
                planlab_id: element.diaglab_id
            };
            total = total + element.total;
            console.log(invoice_items_data);
            let invoice_items_insert = 'INSERT INTO invoice_items SET ?';
            let query1 = db.query(invoice_items_insert, invoice_items_data, (err, result1) => {
                if (err) throw err;
            });
        }
    });
    Promise.all(invoice_items).then(data => {
        let invoice_update = "UPDATE invoice SET total = '" + total + "' where invoice_id = '" + invoice_id + "'";
        let query2 = db.query(invoice_update, (err, update) => {
            if (err) throw err;
            res.send({ success: true });
        });
    });
});

//Delete Invoice & Invoice-Items

router.delete('/create/invoice/:invoice_id', (req, res) => {
    var invoice_id = req.params.invoice_id;
    let sql = `select * from invoice_items where invoice_id = ?`;
    let query = db.query(sql, invoice_id, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            let delete_invoiceItems = `Delete from invoice_items where invoice_item_id = ?`;
            result.forEach(element => {
                let query1 = db.query(delete_invoiceItems, element.invoice_item_id, (err, result1) => {
                    if (err) throw err;
                });
            });
        }
        Promise.all(result).then(data => {
            let delete_invoice = `Delete from invoice where invoice_id = ?`;
            let query2 = db.query(delete_invoice, invoice_id, (err, result2) => {
                if (err) throw err;
                res.send({ success: true });
            });
        });

    });
});

//Select Invoice & Invoice-Item

router.get('/invoice/:invoice_id', (req, res) => {
    let invoice_id = req.params.invoice_id;
    let invoice = `SELECT a.*,b.name,b.logo,c.address,c.locality,c.city,c.country,c.pincode FROM invoice AS a 
        LEFT JOIN practice AS b ON a.practice_id=b.practice_id
        LEFT JOIN practice_address AS c ON a.practice_id=c.practice_id
        WHERE a.invoice_id = ?`;
    let query = db.query(invoice, invoice_id, (err, data) => {
        let invoice_data = data;
        if (err) throw err;
        let invoiceItems = `SELECT * from invoice_items WHERE invoice_id = ?`;
        let query = db.query(invoiceItems, invoice_id, (err, data, fields) => {
            if (err) throw err;
            let invoiceItems_data = data;
            res.send({ success: true, invoice: invoice_data, invoiceItems: invoiceItems_data });
        });
    });
});

//Select Invoice & Invoice-Item

router.put('/invoice', (req, res) => {
    let invoice_id = req.body.invoice_id;
    let invoice = `update invoice set queuestaff = '1' where invoice_id = ?`;
    let query = db.query(invoice, invoice_id, (err, data) => {
        if (err) throw err;
        // res.send({ success: true });
        let sqlselect = `SELECT * FROM invoice WHERE invoice_id = ?`;
        let query = db.query(sqlselect, invoice_id, (err, resultdata) => {
            socketIO.emit('invoice', resultdata.length ? resultdata[0] : null);
            res.send({ success: true });
        });
    });
});

/************************************* Previous Consultation ***********************************/

router.get('/records/:practice_id/:patient_id', (req, res) => {
    let sql1;
    var practice_id = req.params.practice_id;
    var patient_id = req.params.patient_id;
    if (req.query.data === 'timestamp') {
        var queryparam = req.query.date;
        sql1 = `
        SELECT
          record.timestamp
        FROM
          record
          WHERE
          record.practice_id=? AND
          record.patient_id=?
        ORDER BY record.record_id DESC
        LIMIT 1
      `;
        let query = db.query(sql1, [queryparam, practice_id, patient_id], (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else {
        sql1 = `SELECT
                record.record_id,
                record.timestamp,
                user.name,
                user.role
              FROM
                record
              INNER JOIN user ON record.user_id=user.user_id
              WHERE
                record.practice_id=? AND
                record.patient_id=?
              ORDER BY
                record.record_id DESC`;
        let query = db.query(sql1, [practice_id, patient_id], (err, result) => {
            if (err) throw err;
            result.map(record => {
                record.role === 'Doctor' || record.role === 'Admin' ? record.name = 'Dr. ' + record.name : record.name = record.name
                delete record.role;
            });
            res.send(result);
        });
    }
});

/************************************* Prescription **********************************/

router.get('/prescription/:practice_id', (req, res) => {
    let practice_id = req.params.practice_id;
    let prescription = `SELECT b.* FROM prescription as a 
    inner join pres_meds as b on a.prescription_id = b.prescription_id
    where a.practice_id in ( 2 , ? )`;
    let query = db.query(prescription, practice_id, (err, data) => {
        var newarr = [];
        var unique = {};
        data.forEach(item => {
            if (item.med_name.slice(item.med_name.length - 1, item.med_name.length) == " ") {
                if (item.med_name.slice(item.med_name.length - 2, item.med_name.length) == "  ") {
                    item.med_name = item.med_name.slice(0, item.med_name.length - 2);
                    if (!unique[item.med_name]) {
                        newarr.push(item);
                        unique[item.med_name] = item;
                        unique[item.prefix] = item;
                    } else {
                        if (unique[item.med_name] && !unique[item.prefix]) {
                            newarr.push(item);
                            unique[item.med_name] = item;
                            unique[item.prefix] = item;
                        }
                    }
                } else {
                    item.med_name = item.med_name.slice(0, item.med_name.length - 1);
                    if (!unique[item.med_name]) {
                        newarr.push(item);
                        unique[item.med_name] = item;
                        unique[item.prefix] = item;
                    } else {
                        if (unique[item.med_name] && !unique[item.prefix]) {
                            newarr.push(item);
                            unique[item.med_name] = item;
                            unique[item.prefix] = item;
                        }
                    }
                }
            } else {
                if (!unique[item.med_name]) {
                    newarr.push(item);
                    unique[item.med_name] = item;
                    unique[item.prefix] = item;
                } else {
                    if (unique[item.med_name] && !unique[item.prefix]) {
                        newarr.push(item);
                        unique[item.med_name] = item;
                        unique[item.prefix] = item;
                    }
                }
            }
        });
        if (err) throw err;
        res.send({ success: true, prescription: newarr });
    });
});

// router.post('/prescription', (req, res) => {
//     let prescribe = req.body.prescription;
//     let practice_id = req.body.practice_id;
//     let user_id = req.body.user_id;
//     let patient_id = req.body.patient_id;
//     let record_id = req.body.record_id;
//     let prescription = {
//         practice_id: practice_id,
//         user_id: user_id,
//         patient_id: patient_id,
//         consume_id: '1'
//     };
//     let prescription_insert = 'INSERT INTO prescription SET ?';
//     let query1 = db.query(prescription_insert, prescription, (err, result1) => {
//         if (err) throw err;
//         // res.send({ success: true, id: result1.insertId });
//         prescribe.forEach(element => {
//             element.prescription_id = result1.insertId;
//             let pres_insert = 'INSERT INTO prescription SET ?';
//             let query1 = db.query(pres_insert, element, (err, result) => {
//                 if (err) throw err;
//             });
//         });
//     });
// });

//Consulted Prescription
router.post('/consulted/prescription', (req, res) => {
    let prescriptionDetails = req.body;
    let prescriptionInsert = 'INSERT INTO prescription SET ?';
    let query1 = db.query(prescriptionInsert, prescriptionDetails, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Something Went Wrong. Kindly try again!!!' });
        } else {
            res.send({ success: true, id: result.insertId });
        }
    });
});

//Consulted Prescription Medicines
router.post('/consulted/prescription/medicine', (req, res) => {
    let prescriptionMedDetails = req.body;
    let prescriptionMedInsert = 'INSERT INTO pres_meds SET ?';
    let query1 = db.query(prescriptionMedInsert, prescriptionMedDetails, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Something Went Wrong. Kindly try again!!!' });
        } else {
            res.send({ success: true, id: result.insertId });
        }
    });
});

//Consulted Prescription Medicines Get
router.get('/consulted/prescription/medicine/:prescriptionId', (req, res) => {
    let prescriptionId = req.params.prescriptionId;
    let prescriptionMedInsert = 'Select * from pres_meds where prescription_id = ?';
    let query1 = db.query(prescriptionMedInsert, prescriptionId, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Something Went Wrong. Kindly try again!!!' });
        } else {
            res.send({ success: true, result: result });
        }
    });
});

//Consulted Prescription Medicines Delete
router.delete('/consulted/prescription/medicine/:prescriptionMedId', (req, res) => {
    let prescriptionMedId = req.params.prescriptionMedId;
    let prescriptionMedDelete = 'Delete from pres_meds where presmeds_id = ?';
    let query1 = db.query(prescriptionMedDelete, prescriptionMedId, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Something Went Wrong. Kindly try again!!!' });
        } else {
            res.send({ success: true, msg: 'Medicine Deleted Successfully...' });
        }
    });
});

// Update Prescription in Record Table
router.put('/prescription/update', (req, res) => {
    let prescription_id = req.body.prescription_id;
    let record_id = req.body.record_id;
    let invoice = `update record set prescription_id = ? where record_id = ?`;
    let query = db.query(invoice, [prescription_id, record_id], (err, data) => {
        if (err) {
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    });
});

/************************************* prefixZeroes ***********************************/

function prefixZeroes(num, width) {
    var prefix;
    prefix = prefix || '0';
    num = num + '';
    return num.length >= width ? num : new Array(width - num.length + 1).join(prefix) + num;
}

/**
 * 
 * VIJAY's CODE
 * Brooks was here, so was VJ
 * 
 */

/** 
 * For searching patient based on given query, the query can be either parent_name, mobileno, 
 * patient_name, clinic_id, or clinic_id_name, query search in all these fields 
 * */
router.get('/search/:query/:practice_id', (req, res) => {
    let practice_id = req.params.practice_id;
    let query = req.params.query;

    let sql = `
    select a.pet_parent_id, a.mobile_no, a.name, b.patient_id, b.name as pet_name, b.breed, 
    b.age_dob as dob, b.sex, concat (c.clinic_id_name,'-',b.clinic_id) as clinic_id 
    FROM pet_parent a INNER JOIN patient b 
    ON a.pet_parent_id=b.pet_parent_id 
    left join practice c on a.practice_id = c.practice_id 
    WHERE (a.mobile_no LIKE '%${query}%' OR a.name LIKE '%${query}%' 
       OR b.name LIKE '%${query}%' OR b.clinic_id LIKE '%${query}%' 
       OR c.clinic_id_name LIKE '%${query}%') 
       AND a.practice_id = ${practice_id} 
       AND b.status IS NULL 
       group by b.patient_id
       order by b.clinic_id DESC;`;

    db.query(sql, (err, result) => {
        let resu = [];
        // if(err) throw err;
        if (result) {
            result.forEach((row) => {
                resu.push(row);
            })
            res.json(resu);
        } else {
            res.json(resu);
        }
    })
});

/**
 * This api is for fetching details of the selected search result from above API endpoint.
 * But the response includes details of the all the patients for the specified pet_parent_id 
 * along with given patient_id
 */
router.get('/details/:practice_id/:pet_parent_id/:patient_id', (req, res) => {
    let practice_id = req.params.practice_id;
    let pet_parent_id = req.params.pet_parent_id;
    let patient_id = req.params.patient_id;

    let sql = `
    select b.pet_parent_id,b.mobile_no, c.patient_id, concat(a.clinic_id_name,'-',c.clinic_id) as clinic_id, b.name, b.mobile_no, 
    c.name as pet_name, c.age_dob, c.species, c.breed, c.sex, c.color
    from practice as a left join pet_parent as b 
    on a.practice_id=b.practice_id
    left join patient as c 
    on b.pet_parent_id=c.pet_parent_id
    where b.practice_id=? and c.pet_parent_id=? and c.status is null`;

    db.query(sql, [practice_id, pet_parent_id], (err, result) => {
        let parent_details = {};
        let pet_details = [];
        let active_pet_details = {};
        if (result.length > 0) {
            // setting up parent information
            parent_details.name = result[0].name;
            parent_details.mobile_no = result[0].mobile_no;

            // setting up pets information
            result.forEach((pet) => {
                temp = {};
                temp.patient_id = pet.patient_id;
                temp.pet_name = pet.pet_name;
                temp.dob = pet.age_dob;
                temp.species = pet.species;
                temp.breed = pet.breed;
                temp.gender = pet.sex;
                temp.color = pet.color;
                temp.clinic_id = pet.clinic_id;

                // this active flag is to show which patient_id is selected from the search result in front end               
                if (pet.patient_id == patient_id) {
                    temp.active = true;
                } else {
                    temp.active = false;
                }

                // push to array to return array of objects
                pet_details.push(temp);
            });
            res.json({ 'parent_details': parent_details, 'pet_details': pet_details });
        }
    })
});

/**
 * Support API for addding new patient, it searches for already existing pet_parent name or mobile_no
 * for the specified practice_id
 */
router.get('/exists/:query/:practice_id', (req, res) => {
    let query = req.params.query;
    let practice_id = req.params.practice_id;
    var sql = `select pet_parent_id, name, mobile_no from pet_parent where (name like '%${query}%' or
        mobile_no like '%${query}%') and practice_id=?`;

    if (query == 'full') { // to retrive all the pet_parent name for the 
        sql = `select pet_parent_id, name, mobile_no from pet_parent where practice_id=?`;
    }
    let q = db.query(sql, [practice_id], (err, result) => {
        // if(err) throw err;
        let arr = [];
        if (result) {
            result.forEach((obj) => {
                temp = {};
                temp.pet_parent_id = obj.pet_parent_id;
                temp.pet_parent_name = obj.name;
                temp.mobile_no = obj.mobile_no;
                arr.push(temp);
            });
            res.json(arr);
        } else {
            res.json(arr);
        }
    });
    console.log(q.sql);
});

/**
 * This api is for adding new patient by creating new pet parent if pet parent not already exists
 */
router.post('/new/patient', (req, res) => {
    let isNewParent = req.body.is_new_parent;
    let practice_id = req.body.practice_id;
    let pet_parent_details = req.body.pet_parent_details;
    let patient_details = req.body.patient_details;

    let parent_sql = 'insert into pet_parent set ?';
    let patient_sql = `insert into patient set ? `;

    if (isNewParent) { // executes if parent profile doest not exists
        db.query(parent_sql, pet_parent_details, (err, result) => {
            if (!err) {
                patient_details.pet_parent_id = result.insertId; // pet_parent_id needed for inserting new patient
                db.query('select (count(patient_id)+1) as clinic_id from patient where practice_id=?', [practice_id], (err, result) => {
                    if (result) {
                        patient_details.clinic_id = result[0].clinic_id; // clinic_id required for inserting new patient
                        db.query(patient_sql, [patient_details], (err, result) => {
                            if (result) {
                                res.json({ 'pet_parent_id': patient_details.pet_parent_id, 'patient_id': result.insertId });
                            }
                        });
                    }
                });
            } else {
                console.log("Error occured : " + err);
            }
        });
    } else { // executed if parent profile already exists
        db.query('select (count(patient_id)+1) as clinic_id from patient where practice_id=?', [practice_id], (err, result) => {
            if (result) {
                patient_details.clinic_id = result[0].clinic_id;
                db.query(patient_sql, [patient_details], (err, result) => {
                    if (result) {
                        res.json({ 'patient_id': result.insertId });
                    }
                });
            }
        });
    }
});
/**
 * Adds new appointment and emit the event
 */
router.post("/appointment", (req, res) => {
    var data = req.body;
    let insertSQL = "INSERT INTO appointment set ?";
    let insertQuery = db.query(insertSQL, data, (err, result) => {
        if (err) throw err;
        let eventType = 'appointment';
        data.walkin ? eventType = 'walkin' : eventType = 'appointment';
        data.new_patient ? eventType = 'new_patient' : eventType = 'appointment';
        res.send({ id: result.insertId, event_type: eventType });
        const getsql = `
            SELECT
            c.mobile_no, a.appointment_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob,
            (CASE WHEN a.new_patient = true THEN 'new_patient' ELSE CASE WHEN a.walkin = true THEN 'walkin' ELSE 'appointment' END END) AS event_type,
            e.name as doctorname,
            d.record_id, a.practice_id, a.user_id
            FROM appointment a INNER JOIN patient b ON a.patient_id=b.patient_id
            INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
            LEFT JOIN record as d ON a.appointment_id = d.event_id
            LEFT JOIN user as e ON a.user_id = e.user_id
            WHERE a.appointment_id = ?
            `;
        console.log('date = ', req.body.date);
        if (moment(req.body.date, 'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD'))) {
            new Promise((resolve, reject) => {
                db.query(getsql, result.insertId, (err, appointment) => {
                    if (err) throw err;
                    resolve(appointment[0]);
                });
            }).then(appointment => {
                socketIO.emit('appointment', appointment);
            });
        }
    });
});
/**
 * This API is helper for /consulted/plan/:practice_id/:parent_id/:patient_id
 * while inserting into invoice_items pc_vaccine_id is must to retrive preventive_care
 *  in care-web-app previous consultation. So this api help to accomplish that
 */
router.get('/getvaccineid/:preventive_id', (req, res) => {
    let prev_id = req.params.preventive_id;
    let sql = 'select * from pc_vaccination where preventive_id=?';
    db.query(sql, prev_id, (err, result) => {
        if (err) {
            console.log(err);
        }
        let pc_vaccine = [];
        result.forEach(row => {
            pc_vaccine.push(row.pc_vaccine_id);
        });
        res.json(pc_vaccine);
    })
})
/**
 * This API is to resolve the flow in care mobile app, when moved from plan to billing an invoice_id is 
 * created, again when moved to plan, and again billing the new items are added in new invoice_id to 
 * avoid that this api was created, so that when we add items after moving back and forth we update with 
 * existing items and newly added items
 */
router.delete('/deleteitems/:inovice_id', (req, res) => {
    let invoice_id = req.params.inovice_id;
    let sql = "delete from invoice_items where invoice_id=?";
    db.query(sql, invoice_id, (err, result) => {
        if (err) {
            res.json({
                status: false
            });
        } else {
            res.json({
                status: true
            })
        }
    })
})

/**
 * This is helper API to resolve the bug Plan not viewed in care webb app, when consultation done via 
 * care mobile app, The problem that occurred was there is no response with procedure_id for insert in 
 *  plan_procedures table in api /consulted/plan/:practice_id/:parent_id/:patient_id, this procedure_id
 * has to be updated in invoice_items table so the the plan can be retrived in care web app 
 */
router.get('/getprocedureid/:plan_id', (req, res) => {
    let plan_id = req.params.plan_id;
    let sql = 'select proc_id, procedure_id from plan_procedures where plan_id=?';
    db.query(sql, plan_id, (err, result) => {
        if (err) {
            res.json({
                status: false,
                err: err
            })
        } else {
            let obj = {};
            result.forEach(row => {
                obj[row.proc_id] = row.procedure_id
            })
            res.json({
                status: true,
                obj: obj
            })
        }
    });
})

class Database {
    constructor(connection) {
        this.con = connection;
    }
    query(sql, params, appendObj, getId = false) {
        return new Promise((resolve, reject) => {
            this.con.query(sql, params, (err, result) => {
                if (err) {
                    console.log("Inside Database Query ", err);
                    reject(err);
                } else {
                    let obj = {
                        result: result,
                    }

                    // check and set following params
                    if (appendObj) {
                        obj['append'] = appendObj
                    }
                    if (getId) {
                        obj['insertId'] = result.insertId
                    }

                    resolve(obj);
                }
            })
        });
    }
    queryForInsertid(sql, params) {
        return new Promise((resolve, reject) => {
            this.con.query(sql, params, (err, result) => {
                if (err) {
                    console.log("Inside Database Query ", err);
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            })
        });
    }
}

/**
 * It returns promises, db_con is db connection with promises
 */
function generatePlanId(db_con, practice_id, user_id, patient_id) {
    let plan_insert = "INSERT INTO planning SET ?";
    let plan_data = {
        practice_id: practice_id,
        user_id: user_id,
        patient_id: patient_id,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    return db_con.queryForInsertid(plan_insert, plan_data);
}

/**
 *  To update newly created plan in the corresponding record_id
 * NOTE : It is used only in update flow in moible app, initally from the mobile itself it is done is using 
 *        API call.
 */
function updatePlanInRecord(db_con, record_id, plan_id) {
    let update_plan_sql = "update record set plan_id=? where record_id=?";
    return db_con.query(update_plan_sql, [plan_id, record_id]);
}

function deletePlanId(db_con, record_id, plan_id) {
    let record_plan_delete_sql = "update record set plan_id=null where record_id=?";
    db_con.query(record_plan_delete_sql, record_id)
        .then(() => {
            let plan_delete_sql = "delete from planning where plan_id=?";
            return db_con.query(plan_delete_sql, plan_id);
        })
}

/**
 * This function is used to update the total in invoice after CRUDing the invoice_items
 */
function updateInvoiceTotal(invoice_id) {

    let sql = `update invoice set total = (select sum(total) as total from invoice_items where invoice_id=?)
    where invoice_id=?`;

    db.query(sql, [invoice_id, invoice_id]);
}

router.get("/test/run", (req, res) => {
    let con = new Database(db);
    let preventive_create_flag = false;
    let prev_data = {
        practice_id: 74,
        user_id: 92,
        patient_id: 5933,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    con.query('select age_dob as dob from patient where patient_id= 5931')
        .then(result => {
            console.log("returned result : ", result);
            let dob = result.result[0].dob;
            console.log("Bday : ", dob);
            prev_data.age = calculateAge(dob);
            if (preventive_create_flag) {
                return con.queryForInsertid("insert into preventive_care set ?", prev_data);
            } else {
                return;
            }
        })
        .then(data => {
            console.log("preventive_id : ", data);
            if (data) {
                preventive_id = data;
            } else {
                console.log("do not set preventive_id ");
            }
        })
    // if(preventive_create_flag){
    //     let query = db.query('select age_dob as dob from patient where patient_id= ?', patient_id, (err, result)=>{
    //         let dob = result[0].dob;
    //         prev_data.age =  calculateAge(dob); // current age in (1Y 11M 5D) format to insert into preventive_care
    //         let query = db.query(preventive_care, prev_data, (err, result) => {
    //             if (err) throw err;
    //             preventive_id = result.insertId;
    //             console.log('element.typepreventive_idpreventive_idpreventive_idpreventive_id', preventive_id);                    
    //         })
    //     })
    // } 
})

/**
 * This API is called when user moves from invoice page back to plan selection page
 * to only delete the already ready selected data this API is used. This API just deletes the data 
 * 
 * NOTE : First it was created with Http DELETE METHOD, for some reason it couldnt carry body, analysis
 * found that sometimes the body gets blocked for DELETE request, so done using put method
 */
router.put('/consulted/plan/delete/:record_id/:plan_id/:type', (req, res) => {
    let plan_id = req.params.plan_id;
    let record_id = req.params.record_id;
    let type = req.params.type;
    let clear_plan_id_flag = req.body.clear_planning;

    console.log("Plan_id : ", plan_id, " record_id : ", record_id, " type : ", type);

    console.log("DELETE BODY : ", req.body);

    let con = new Database(db);

    /**
     * for :type = procedure_catalog
     * step 1: retrive procedure_ids from req.body
     * step 2: with inovice_id from req.body and procedure_id from above step, loop and delete items in 
     *         invoice_items table
     * step 3: following that delete from plan_procedures with the procedure_id
     * 
     * for :type = preventive_catalog
     * step 1:  loop through and delete rows in pc_vaccination based on prev_id and preventive_id
     * step 2: if clear_preventive_care is true, then delete row from preventive_care, and make null in
     *         corresponding record row with reference to record_id
     * 
     * for :type = diagimg_catalog
     * step 1: loop through the planimg_ids and delete from invoice_items
     * step 2: loop through the planimg_ids and delete from plan_imaging
     * 
     * for :type = diaglab_catalog
     * step 1: loop through the planlab_ids and delete from invoice_items
     * step 2: loop through the planlab_ids and delete from plan_lab
     * */
    if (type == 'procedure_catalog') {
        // get inovice_id, plan_id from the body
        let invoice_id = req.body.invoice_id;
        let procedure_ids = req.body.procedure_id;
        let promiseArr = [];

        procedure_ids.forEach(procedure_id => {
            // delete invoice_items from invoice_items table based on plan_id, procedure_id                
            let invoice_item_delete_sql = "delete from invoice_items where invoice_id=? and procedure_id=?";
            promiseArr.push(con.query(invoice_item_delete_sql, [invoice_id, procedure_id]));

            // delete procedures from plan_procedures table
            let plan_procedure_delete_sql = "delete from plan_procedures where procedure_id=?";
            promiseArr.push(con.query(plan_procedure_delete_sql, [procedure_id]));
        })

        Promise.all(promiseArr)
            .then(obj => {
                console.log("Delete After Promise OBJ : ", obj);
                if (clear_plan_id_flag) {
                    return deletePlanId(con, record_id, plan_id);
                }
            }).then(obj => {
                console.log(obj);
                updateInvoiceTotal(invoice_id);
                res.json({
                    status: true,
                    desc: "procedure_catalog deletion done"
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    status: false,
                    error: err
                })
            })
    } else if (type == 'preventive_catalog') {
        let invoice_id = req.body.invoice_id;
        let preventive_id = req.body.preventive_id;
        let clear_preventive_care = req.body.clear_preventive_care;
        let pc_vaccine_ids = req.body.pc_vaccine_id;

        let promiseArr = [];

        pc_vaccine_ids.forEach(pc_vaccine_id => {
            let invoice_items_delete_sql = "delete from invoice_items where invoice_id=? and pc_vaccine_id=?";
            promiseArr.push(con.query(invoice_items_delete_sql, [invoice_id, pc_vaccine_id]))

            let sql = "delete from pc_vaccination where preventive_id=? and pc_vaccine_id=?";
            promiseArr.push(con.query(sql, [preventive_id, pc_vaccine_id]));
        })

        Promise.all(promiseArr)
            .then(obj => {
                console.log("Preventive_catalog_delete : ", obj);
                updateInvoiceTotal(invoice_id);

                // when clear_preventive_care flag is true the preventive_id is deleted from preventive_care
                if (clear_preventive_care) {
                    let sql = "update record set preventive_id=null where record_id=?";
                    con.query(sql, [record_id])
                        .then(() => {
                            let sql = "delete from preventive_care where preventive_id=?";
                            return con.query(sql, [preventive_id])
                        })
                        .then((obj) => {
                            console.log(obj);
                            res.json({
                                success: true,
                                desc: "preventive_catalog clear all deletion done"
                            })
                        })
                        .catch(err => {
                            res.json({
                                success: false,
                                error: err
                            })
                        })
                } else {
                    res.json({
                        status: true,
                        desc: "preventive_catalog deletion done"
                    })
                }
            })
            .catch(err => {
                res.json({
                    success: false,
                    error: err
                })
            })

    } else if (type == 'diagimag_catalog') {
        let invoice_id = req.body.invoice_id;
        let planimg_ids = req.body.planimg_id;

        let promiseArr = [];

        planimg_ids.forEach(planimg_id => {
            let sql = "delete from invoice_items where invoice_id=? and planimg_id=?"
            promiseArr.push(con.query(sql, [invoice_id, planimg_id]));

            let sql_planimg = "delete from plan_imaging where planimg_id=?";
            promiseArr.push(con.query(sql_planimg, [planimg_id]));
        })

        Promise.all(promiseArr)
            .then(() => {
                if (clear_plan_id_flag) {
                    return deletePlanId(con, record_id, plan_id);
                }
            })
            .then(obj => {
                updateInvoiceTotal(invoice_id);
                res.json({
                    status: true,
                    desc: "planimg_id were successfully deleted"
                })
            })
            .catch(err => {
                res.json({
                    status: false,
                    error: err
                })
            })
    } else if (type == 'diaglab_catalog') {
        let invoice_id = req.body.invoice_id;
        let planlab_ids = req.body.planlab_id;

        let promiseArr = [];

        planlab_ids.forEach(planlab_id => {
            let sql = "delete from invoice_items where invoice_id=? and planlab_id=?";
            promiseArr.push(con.query(sql, [invoice_id, planlab_id]));

            let sql_planlab = "delete from plan_lab where planlab_id=?";
            promiseArr.push(con.query(sql_planlab, [planlab_id]));
        })

        Promise.all(promiseArr)
            .then(() => {
                if (clear_plan_id_flag) {
                    return deletePlanId(con, record_id, plan_id);
                }
            })
            .then(obj => {
                updateInvoiceTotal(invoice_id);
                res.json({
                    status: true,
                    desc: "planlab_id successfully deleted"
                })
            })
            .catch(err => {
                res.json({
                    status: false,
                    error: err
                })
            })
    } else {
        res.json({
            status: false,
            error: "does not match any thing"
        })
    }
})

/**
 * This API is rewrittened one, add feature to response with insertIds of all the catalogs so that it can
 * be used in mobile app while inserting into inovice_items
 */
router.post('/consulted/plan/:practice_id/:user_id/:patient_id', (req, res) => {
    var plan = req.body;
    var practice_id = req.params.practice_id;
    var user_id = req.params.user_id;
    var patient_id = req.params.patient_id;
    console.log(plan);
    let procedure_catalog = "INSERT INTO plan_procedures SET ?";
    let preventive_care = "INSERT INTO preventive_care SET ?";
    let pc_vaccination = "INSERT INTO pc_vaccination SET ?";
    let diagimag_catalog = "INSERT INTO plan_imaging SET ?";
    let diaglab_catalog = "INSERT INTO plan_lab SET ?";

    let prev_data = {
        practice_id: practice_id,
        user_id: user_id,
        patient_id: patient_id,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    }


    let preventive_create_flag = false;
    let create_plan_flag = false;
    var preventive_id;
    var plan_id;
    /**
     * before it generates preventive_id without any condition, this create bug ( Create empty preventive 
     * history if no preventive item is selected )         
     */
    plan.forEach(ele => {
        if (ele.type == 'preventive_catalog') {
            preventive_create_flag = true;
        }
        if (ele.type == 'procedure_catalog' || ele.type == 'diagimag_catalog' || ele.type == 'diaglab_catalog') {
            create_plan_flag = true;
        }
    });

    let promiseArr = [];
    let planPromiseArr = [];
    let con = new Database(db);

    if (create_plan_flag) { // create plan_id if plan exists        
        planPromiseArr.push(generatePlanId(con, practice_id, user_id, patient_id));
    }

    Promise.all(planPromiseArr)
        .then(insertIds => {   // setting plan_id
            console.log("Plan id creation : ", insertIds);
            if (insertIds[0]) {
                plan_id = insertIds[0];
            }
        })
        .then(() => {          // preparing data for creating preventive_id        
            return con.query('select age_dob as dob from patient where patient_id= ?', [patient_id]);
        })
        .then(result => {      // checking and creating preventive_id      
            let dob = result.result[0].dob;
            prev_data.age = calculateAge(dob);
            if (preventive_create_flag) {
                return con.queryForInsertid(preventive_care, prev_data);
            } else {
                return;
            }
        })
        .then(data => {        // inseting all the plans and preventive_care            
            if (data) {
                preventive_id = data;
            }

            plan.forEach(element => {
                console.log('element.type', element.type);
                if (element.type == 'procedure_catalog') {
                    let procedure_catalog_data = {
                        plan_id: plan_id,
                        proc_id: element.type_id,
                        test: element.name
                    };
                    promiseArr.push(con.query(procedure_catalog, procedure_catalog_data, {}, true));
                } else if (element.type == 'preventive_catalog') {
                    let pc_vaccination_data = {
                        preventive_id: preventive_id,
                        prev_id: element.type_id,
                        treatment: element.name,
                        c_quantity: '1'
                    };
                    console.log('pc_vaccination_data', pc_vaccination_data);
                    promiseArr.push(con.query(pc_vaccination, pc_vaccination_data, {}, true));
                } else if (element.type == 'diagimag_catalog') {
                    let diagimag_catalog_data = {
                        plan_id: plan_id,
                        diagimag_id: element.type_id,
                        test: element.name
                    };
                    promiseArr.push(con.query(diagimag_catalog, diagimag_catalog_data, {}, true));
                } else if (element.type == 'diaglab_catalog') {
                    let diaglab_catalog_data = {
                        plan_id: plan_id,
                        diaglab_id: element.type_id,
                        test: element.name
                    };
                    promiseArr.push(con.query(diaglab_catalog, diaglab_catalog_data, {}, true));
                }
            });
            // resolving all promises
            return Promise.all(promiseArr)
        })
        .then(obj => {         // fetching and preparing inserId's for the response 
            let arr = [];

            // preparing to return insertId's of the plan for invoice_items update
            obj.forEach(element => {
                arr.push(element.insertId)
            })
            console.log(arr);
            let response = {
                success: true,
                insertIds: arr
            }
            if (preventive_id) {
                response['preventive_id'] = preventive_id;
            }
            if (plan_id) {
                response['plan_id'] = plan_id;
            }
            res.json(response);
        })
        .catch(err => {
            res.json({
                success: false,
                error: err
            })
        })
});

/**
 * This API is accessed when the user in CARE mobile app updates the plan data by moving back from invoice
 * page to plan procedure page
 */
router.put('/consulted/plan/:record_id/:practice_id/:user_id/:patient_id', (req, res) => {

    let con = new Database(db);

    console.log("BODY -----", req.body);

    var record_id = req.params.record_id;
    var practice_id = req.params.practice_id;
    var user_id = req.params.user_id;
    var patient_id = req.params.patient_id;
    var invoice_id = req.body.invoice_id;
    var plans_all = req.body.allplan;
    var plan_create_flag = req.body.plan_create_flag;
    var preventive_create_flag = req.body.preventive_create_flag;
    var plan_id;
    var preventive_id;

    console.log("ALL PLANS ", plans_all);

    let proc_plans = plans_all["procedure_catalog"];
    let prev_plans = plans_all["preventive_catalog"];
    let img_plans = plans_all["planimg_catalog"];
    let lab_plans = plans_all["planlab_catalog"];

    let finalObj = {
        proc: [],
        prev: [],
        img: [],
        lab: []
    };

    let planPromiseArr = [];
    let procPromiseArr = [];
    let prevPromiseArr = [];
    let imgPromiseArr = [];
    let labPromiseArr = [];

    console.log("-------------plan_create_flag : ", plan_create_flag);
    if (plan_create_flag) {   // creating planId if plan_create_flag is true
        planPromiseArr.push(generatePlanId(con, practice_id, user_id, patient_id));
    } else {
        plan_id = req.body.plan_id;
        console.log("-------plan_id from body : ", plan_id);
    }

    Promise.all(planPromiseArr)
        .then(insertIds => {
            /** updating in record, only if plan_id is newly created ,this is done only when plan_id is created 
             *  in the back and forth flow 
             */
            if (insertIds[0]) {
                plan_id = insertIds[0];
                console.log("-----------plan_id after generating : ", plan_id);
                return updatePlanInRecord(con, record_id, plan_id);
            }
        })
        .then(() => {
            console.log("plan_id after resolving everything : ", plan_id);
            // inserting and setting promise for procedure_catalog
            proc_plans.forEach(plan => {
                let procedure_catalog = "INSERT INTO plan_procedures SET ?";
                let procedure_catalog_data = {
                    plan_id: plan_id,
                    proc_id: plan.type_id,
                    test: plan.name
                };
                procPromiseArr.push(con.query(procedure_catalog, procedure_catalog_data, plan, true));
            });
            console.log("Before proc promise ");
            Promise.all(procPromiseArr)
                .then(arrays => {
                    console.log("ARRAYS ------------ : ", arrays);
                    for (i = 0; i < proc_plans.length; i++) {
                        let procedure_id = arrays[i].insertId;
                        finalObj['proc'].push(procedure_id);
                        let element = arrays[i].append;
                        let insertInvoiceItemsSql = "INSERT INTO invoice_items SET ?";
                        let invoice_items_data = {
                            invoice_id: invoice_id,
                            name: element.name,
                            quantity: '1',
                            retail_price: element.price,
                            tax: element.tax,
                            total: element.total,
                            procedure_id: procedure_id
                        };
                        return con.queryForInsertid(insertInvoiceItemsSql, invoice_items_data);
                    }
                })
                .then(() => {   // for preventive care

                    // inserting and setting promise for preventive_catalog    
                    con.query('select age_dob as dob from patient where patient_id= ?', [patient_id])
                        .then(result => {     // checking to create preventive_id or not

                            console.log("-----------preventive_create_flag : ", preventive_create_flag);
                            if (preventive_create_flag) {
                                let dob = result.result[0].dob;
                                let prev_data = {
                                    practice_id: practice_id,
                                    user_id: user_id,
                                    patient_id: patient_id,
                                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                console.log("Preventive_data : ", prev_data);
                                prev_data.age = calculateAge(dob);
                                return con.queryForInsertid("INSERT INTO preventive_care SET ?", prev_data);
                            } else {
                                return;
                            }
                        })
                        .then(data => {       // checking and setting preventive_id and inserting to pc_vaccination
                            // let preventive_id;                   
                            if (data) {
                                preventive_id = data;

                                // update the record if new preventive_id is created
                                let record_id = req.body.record_id;
                                let updateRecordSql = "update record set preventive_id=? where record_id=?"

                                con.query(updateRecordSql, [preventive_id, record_id]);

                            } else {
                                preventive_id = req.body.preventive_id;
                            }
                            console.log("Preventive_id : ", preventive_id);
                            prev_plans.forEach(plan => {
                                let pc_vaccination = "INSERT INTO pc_vaccination SET ?";
                                let pc_vaccination_data = {
                                    preventive_id: preventive_id,
                                    prev_id: plan.type_id,
                                    treatment: plan.name,
                                    c_quantity: '1'
                                };
                                prevPromiseArr.push(con.query(pc_vaccination, pc_vaccination_data, plan, true));
                            });

                            Promise.all(prevPromiseArr)
                                .then(arrays => {
                                    console.log("Preventivve Plan s : ", arrays);
                                    for (i = 0; i < prev_plans.length; i++) {
                                        let pc_vaccine_id = arrays[i].insertId;
                                        finalObj['prev'].push(pc_vaccine_id);
                                        let element = arrays[i].append;
                                        let invoice_items_data = {
                                            invoice_id: invoice_id,
                                            name: element.name,
                                            quantity: '1',
                                            retail_price: element.price,
                                            tax: element.tax,
                                            total: element.total,
                                            pc_vaccine_id: pc_vaccine_id
                                        };
                                        console.log("pc_vaccine_id data : ", invoice_items_data);
                                        let invoice_items_insert = 'INSERT INTO invoice_items SET ?';
                                        con.query(invoice_items_insert, invoice_items_data);
                                    }
                                })
                                .then(() => {  // plan img 
                                    img_plans.forEach(plan => {
                                        let diagimg_catalog = "INSERT INTO plan_imaging SET ?";
                                        let diagimg_catalog_data = {
                                            plan_id: plan_id,
                                            diagimag_id: plan.type_id,
                                            test: plan.name
                                        };
                                        imgPromiseArr.push(con.query(diagimg_catalog, diagimg_catalog_data, plan, true));
                                    });

                                    Promise.all(imgPromiseArr)
                                        .then(arrays => {
                                            for (i = 0; i < img_plans.length; i++) {
                                                let diagimg_id = arrays[i].insertId;
                                                finalObj['img'].push(diagimg_id);
                                                let element = arrays[i].append;
                                                let insertInvoiceItemsSql = "INSERT INTO invoice_items SET ?";
                                                let invoice_items_data = {
                                                    invoice_id: invoice_id,
                                                    name: element.name,
                                                    quantity: '1',
                                                    retail_price: element.price,
                                                    tax: element.tax,
                                                    total: element.total,
                                                    planimg_id: diagimg_id
                                                };
                                                con.query(insertInvoiceItemsSql, invoice_items_data);
                                            }
                                        })
                                        .then(() => {  // plan lab starts

                                            // inserting and setting promise for planlab_catalog
                                            lab_plans.forEach(plan => {
                                                let diaglab_catalog = "INSERT INTO plan_lab SET ?";
                                                let diaglab_catalog_data = {
                                                    plan_id: plan_id,
                                                    diaglab_id: plan.type_id,
                                                    test: plan.name
                                                };
                                                labPromiseArr.push(con.query(diaglab_catalog, diaglab_catalog_data, plan, true));
                                            });
                                            Promise.all(labPromiseArr)
                                                .then(arrays => {
                                                    for (i = 0; i < lab_plans.length; i++) {
                                                        let diaglab_id = arrays[i].insertId;
                                                        finalObj['lab'].push(diaglab_id);
                                                        let element = arrays[i].append;
                                                        let insertInvoiceItemsSql = "INSERT INTO invoice_items SET ?";
                                                        let invoice_items_data = {
                                                            invoice_id: invoice_id,
                                                            name: element.name,
                                                            quantity: '1',
                                                            retail_price: element.price,
                                                            tax: element.tax,
                                                            total: element.total,
                                                            planlab_id: diaglab_id
                                                        };
                                                        return con.queryForInsertid(insertInvoiceItemsSql, invoice_items_data);
                                                    }
                                                })
                                                .then(() => {
                                                    console.log(finalObj);
                                                    updateInvoiceTotal(invoice_id);
                                                    let obj = {
                                                        status: true,
                                                        object: finalObj,
                                                        desc: "Inserted successfully"
                                                    };
                                                    if (plan_create_flag) {
                                                        obj['plan_id'] = plan_id;
                                                    }
                                                    if (preventive_create_flag) {
                                                        obj['preventive_id'] = preventive_id;
                                                    }
                                                    res.json(obj);
                                                })
                                                .catch(err => {
                                                    console.log("error in finalPromiseCatch : ", err);
                                                    res.json({
                                                        status: false,
                                                        error: err,
                                                        desc: "Error in finalPromiseArr catch"
                                                    })
                                                });
                                        })
                                })
                        })
                })
        })
        .catch(err => {
            console.log("error in planPromiseArr : ", err);
            res.json({
                status: false,
                error: err,
                desc: "Error in creating plan_id"
            })
        })
});

/**
 * This API is used to add items that are directly added in invoice page
 */
router.post('/invoiceitems/add/:invoice_id', (req, res) => {

    let con = new Database(db);

    let invoice_id = req.params.invoice_id;
    let invoice_items = req.body.items;
    /**
     * {
     *  name :
     *  quantity:
     *  retail_price:
     *  tax:
     *  total:
     *  invoice_id:
     * }
     */
    let invoice_items_promise_arr = [];
    let invoice_items_sql = "INSERT INTO invoice_items SET ?";
    invoice_items.forEach(item => {
        let invoice_items_data = {
            name: item.name,
            quantity: item.quantity,
            retail_price: item.retail_price,
            tax: item.tax,
            total: item.total,
            invoice_id: invoice_id
        }
        invoice_items_promise_arr.push(con.queryForInsertid(invoice_items_sql, invoice_items_data));
    }) // forEach

    Promise.all(invoice_items_promise_arr)
        .then(insertIds => {
            updateInvoiceTotal(invoice_id);
            res.json({
                status: true,
                invoice_item_ids: insertIds
            })
        })
        .catch(err => {
            res.json({
                status: false,
                error: err
            })
        })
});

/**
 * This API is used to delete the items that are directly added in invoice page
 */
router.delete('/invoiceitems/delete/:invoice_id/:invoice_item_id', (req, res) => {
    let invoice_id = req.params.invoice_id;
    let invoice_item_id = req.params.invoice_item_id;

    let invoice_item_delete_sql = 'delete from invoice_items where invoice_item_id = ?';

    db.query(invoice_item_delete_sql, invoice_item_id, (err) => {
        if (err) {
            res.json({
                status: false,
                error: err
            })
        } else {
            updateInvoiceTotal(invoice_id);
            res.json({
                status: true,
                desc: 'successfully deleted the item_id ', invoice_item_id
            })
        }
    })
})

module.exports = router;