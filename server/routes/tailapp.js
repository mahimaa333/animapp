const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');
const config = require('../config/database');
const db = require('../config/connections');
const colors = require('colors');

const nodemailer = require('nodemailer'),
  path = require('path');
EmailTemplate = require('email-templates').EmailTemplate,
  Promise = require('bluebird');

const http = require('http');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');


const BUCKET_NAME = 'animappcareimages';
const IAM_USER_KEY = 'AKIARBVXWLSFCDRA6XCV';
const IAM_USER_SECRET = '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';

var s3 = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

var uploadpetimage = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, 'foo-folder/' + Date.now().toString() + '-' + file.originalname + '.jpg')
    }
  })
})

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    type: 'OAuth2',
    clientId: '033754409283-6m9d5hlnd1ue9716055j6p8a26l47dtr.apps.googleusercontent.com',
    clientSecret: 'Lbh3bJ90bc-GuzMEfnBtCwH1',
    refreshToken: '1/IZVgyeB9uHjYcijT4btN6BA7tWhV9v0fbs3Rqb0WwAA',
    accessToken: 'ya29.GlvuBKiyYjv6z2LUL9c-2dAVLjuIUSrxzfWwTz_tk32mRLaYCuqypzMyz8GvJ3quP_AOU4KfVRsQssfJAzxwkF8su518vLHUEcNELSUYV1liWXG-yGmnUqPolBLI',
    expires: 1484314697598,
    user: 'care@animapp.in', // generated ethereal user
    pass: '4nim4ppc4r30812' // generated ethereal password
  },
  tsl: {
    rejectUnauthorized: false
  }
});


function sendEmail(obj) {
  return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
  let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
  return Promise.all(contexts.map((context) => {
    return new Promise((resolve, reject) => {
      template.render(context, (err, result) => {
        if (err) reject(err);
        else resolve({
          email: result,
          context,
        });
      });
    });
  }));
}

// const soap = require('./soap');
// const email = require('./email');
// const initial = require('./initial');
// const settings = require('./settings');
// const patient = require('./patient');
// const inventory = require('./inventory');
// const billing = require('./billing');
// const resultupload = require('./resultupload');

router.get('/', (req, res) => {
  res.send('Welcome to AnimApp Mobile API.');
});

// router.use('/soap', soap);
// router.use('/email', email);
// router.use('/initial', initial);
// router.use('/settings', settings);
// router.use('/patient', patient);
// router.use('/inventory', inventory);
// router.use('/billing', billing);
// router.use('/result', resultupload);
var tokenchecker = function (req, res, next) {
  passport.authenticate('jwt', function (err, payload, info) {
    if (err) return next(err);
    if (payload) {
      console.log(payload);
      next();
    } else {
      res.send({
        success: false,
        msg: 'token invalid'
      })
    }
  })(req, res, next);
}


//testing api for mobile app
// router.get('/getpets/:pet_parent_id', tokenchecker, (req, res) => {
//   const pet_parent_id = req.params.pet_parent_id;
//   console.log(`mobile app test api called for getpets ${pet_parent_id}`);
//   let sqlcheck = `SELECT name,email_id,mobile_no FROM pet_parent WHERE pet_parent_id = ?`;
//   let query2 = db.query(sqlcheck, pet_parent_id, (err, resultparent) => {
//     const parentdetails = resultparent[0];
//     let sql = `SELECT * FROM patient WHERE pet_parent_id = ?`;
//     let query = db.query(sql, pet_parent_id, (err, result) => {
//       if (err) throw err;
//       res.send({
//         parent_details: parentdetails,
//         pets: result
//       });
//     });
//   });
// });

router.get('/dropdown/cat', (req, res) => {
  sql = `SELECT * FROM breeds where species_id=2`;
  let query = db.query(sql, (err, data) => {
    if (err) throw err;
    if (!data.length) {
      res.json(data);
    } else {
      res.json(data);
    };
  });
});

router.get('/dropdown/dog', (req, res) => {
  sql = `SELECT * FROM breeds where species_id=2`;
  let query = db.query(sql, (err, data) => {
    if (err) throw err;
    if (!data.length) {
      res.json(data);
    } else {
      res.json(data);
    };
  });
});

// router.get('/getpets/:pet_parent_id', tokenchecker, (req, res) => {
router.get('/getpets/:pet_parent_id', (req, res) => {
  const pet_parent_id = req.params.pet_parent_id;
  let sql = `select * from pet_parent where pet_parent_id=?`;
  let query = db.query(sql, pet_parent_id, (err, result) => {
    if (err) { throw err; }
    else {
      let mobile_no = result[0].mobile_no;
      const parentdetails = {
        name: result[0].name,
        email_id: result[0].email_id,
        mobile_no: result[0].mobile_no
      }
      let sql1 = `select patient.patient_id,patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,patient.image,patient.microchip_no,patient.identify_mark,patient.timestamp,patient.pet_parent_id,patient.status,patient.clinic_id,patient.practice_id from pet_parent left join patient on pet_parent.pet_parent_id =patient.pet_parent_id where pet_parent.mobile_no=?`
      let query1 = db.query(sql1, mobile_no, (err, result1) => {
        if (err) { throw err; }
        else {

          var newarr = [];
          var unique = {};

          result1.forEach(item => {
            if (!unique[item.name]) {
              newarr.push(item);
              unique[item.name] = item;
            }
          });

          console.log(newarr);

          // var newarr1 = [];
          // var unique1 = {};

          // newarr.forEach(item1=> {
          //     if (!unique1[item1.name]) {
          //         newarr1.push(item1);
          //         unique1[item1.name] = item1;
          //     }
          // });

          // console.log(newarr1);

          // var newarr1 = [];
          // var unique1 = {};

          // newarr.forEach(item1=> {
          //     if (!unique1[item1.name]) {
          //         newarr1.push(item1);
          //         unique1[item1.name] = item1;
          //     }
          // });

          // console.log(newarr1);

          // var newarr1 = [];
          // var unique1 = {};

          // newarr.forEach(item1=> {
          //     if (!unique1[item1.name]) {
          //         newarr1.push(item1);
          //         unique1[item1.name] = item1;
          //     }
          // });

          // console.log(newarr1);

          // result1.forEach(element=> {
          //   if(i == 0){
          //     result2.push(element);
          //     verifing_pet = element;
          //     console.log(i);
          //     console.log(verifing_pet);
          //     i = i+1;
          //   }
          //   else if (verifing_pet.name != element.name && verifing_pet.sex != element.sex,verifing_pet.species != element.species,verifing_pet.breed != element.breed,verifing_pet.age_dob != element.age_dob,verifing_pet.color != element.color)
          //   {
          //     result2.push(element);
          //     console.log(i);
          //     console.log(verifing_pet.name);
          //   }



          //   // if(verifing_pet == "undefined")
          //   // {
          //   //   result2.push(element);
          //   //   verifing_pet = element;
          //     // {
          //     //   patient_id: element.practice_id,
          //     //   name: element.name,
          //     //   sex: element.sex,
          //     //   species: element.species,
          //     //   breed: element.breed,
          //     //   age_dob: element.age_dob,
          //     //   color: element.color,
          //     //   image: element.image,
          //     //   microchip_no: element.microchip_no,
          //     //   identify_mark: element.identify_mark,
          //     //   timestamp: element.timestamp,
          //     //   pet_parent_id: element.pet_parent_id,
          //     //   status: element.status,
          //     //   clinic_id: element.clinic_id,
          //     //   practice_id: element.practice_id
          //     // };
          //   //   console.log('verify',verifing_pet);
          //   // }
          //   // else if (verifing_pet != "undefined" && verifing_pet.name != element.name && verifing_pet.sex != element.sex,verifing_pet.species != element.species,verifing_pet.breed != element.breed,verifing_pet.age_dob != element.age_dob,verifing_pet.color != element.color)
          //   // {
          //   //   result2.push(element);
          //   //   verifing_pet = {
          //   //     patient_id: element.practice_id,
          //   //     name: element.name,
          //   //     sex: element.sex,
          //   //     species: element.species,
          //   //     breed: element.breed,
          //   //     age_dob: element.age_dob,
          //   //     color: element.color,
          //   //     image: element.image,
          //   //     microchip_no: element.microchip_no,
          //   //     identify_mark: element.identify_mark,
          //   //     timestamp: element.timestamp,
          //   //     pet_parent_id: element.pet_parent_id,
          //   //     status: element.status,
          //   //     clinic_id: element.clinic_id,
          //   //     practice_id: element.practice_id
          //   //   };
          //   // }
          // });
          res.send({
            parent_details: parentdetails,
            pets: newarr
          });
        }
      });
    }
  });
});

router.get('/getpet/essential/dropdowns', (req, res) => {
  console.log(`mobile app test api called for getpet essential dropdowns`.yellow);
  let speciesSql = `SELECT
                    (CASE
                      WHEN species = 'canine' THEN 'dog'
                      WHEN species = 'feline' THEN 'cat'
                      ELSE species
                    END) AS species
                    FROM species`;
  let catBreedsSql = `SELECT breed FROM breeds WHERE practice_id IS NULL AND species_id = 2`;
  let dogBreedsSql = `SELECT breed FROM breeds WHERE practice_id IS NULL AND species_id = 1`;
  let query = db.query(speciesSql, (err, result) => {
    if (err) throw err;
    const speciesDropdown = result;
    let query = db.query(catBreedsSql, (err, result) => {
      if (err) throw err;
      const catBreedsDropdown = result;
      let query = db.query(dogBreedsSql, (err, result) => {
        if (err) throw err;
        const dogBreedsDropdown = result;
        res.send({
          speciesDropdown: speciesDropdown,
          catBreedsDropdown: catBreedsDropdown,
          dogBreedsDropdown: dogBreedsDropdown
        });
      });
    });
  });
});

router.get('/vitals_list/:objective_id', (req, res) => {
  let objective = `SELECT * FROM objective WHERE objective_id = ?`;
  let query = db.query(objective, req.params.objective_id, (err, result) => {
    if (err) throw err;

    if (result.length) {
      res.send({ data: result[0] });
    } else {
      res.send({ data: null });
    }

  });
});

router.get('/clinical_notes/:plan_id', (req, res) => {

  console.log(`mobile app test api called for getpet essential dropdowns`.yellow);
  const plan_id = req.params.plan_id;
  let plan_procedures = `SELECT * FROM plan_procedures WHERE plan_id = ?`;
  let plan_imaging = `SELECT * FROM plan_imaging WHERE plan_id = ?`;
  let plan_lab = `SELECT * FROM plan_lab  WHERE plan_id = ?`;
  let query = db.query(plan_procedures, plan_id, (err, result) => {
    if (err) throw err;
    const plan_procedures1 = result;
    let query = db.query(plan_imaging, plan_id, (err, result) => {
      if (err) throw err;
      const plan_imaging1 = result;
      let query = db.query(plan_lab, plan_id, (err, result) => {

        if (err) throw err;
        const plan_lab1 = result;
        res.send({
          plan_procedures: plan_procedures1,
          plan_imaging: plan_imaging1,
          plan_lab: plan_lab1
        });
      });
    });
  });
});


router.get('/get/records/:patient_id', (req, res) => {
  const patient_id = req.params.patient_id;
  const result1 = [];
  const promise = new Promise((resolve, reject) => {

    let sql1 = "select patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,pet_parent.pet_parent_id,pet_parent.mobile_no from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where patient.patient_id=" + req.params.patient_id;

    let query = db.query(sql1, (err, result) => {
      var mobile_no = result[0].mobile_no;

      let sql2 = "select patient.patient_id from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where pet_parent.mobile_no= '" + mobile_no + "' and patient.name ='" + result[0].name + "' and patient.sex= '" + result[0].sex + "' and patient.species= '" + result[0].species + "' and patient.breed= '" + result[0].breed + "' and patient.age_dob= '" + result[0].age_dob + "' and patient.color= '" + result[0].color + "'";


      let query1 = db.query(sql2, (err, result3) => {
        if (err) {
          throw err;
          resolve(true);
        } else {
          const result8 = [];
          result3.forEach(element1 => {
            result8.push(element1.patient_id);
          });

          let all_patient_id = result8.join(",");
          console.log("all_patient_id:", all_patient_id);
          console.log(`mobile app test api called for getRecords for patient: ${all_patient_id}`.yellow);
          let sql = "SELECT a.record_id,a.practice_id, DATE(a.timestamp) as date, a.subject_id, f.cheifcom as reason, a.objective_id, a.assess_id, a.plan_id, a.prescription_id, a.preventive_id, a.event_id, CONCAT(UCASE(LEFT(event_type, 1)),SUBSTRING(event_type, 2)) as event_type, CONCAT('Dr. ', d.name) as vet, c.name as clinic, CONCAT(c.clinic_id_name,'-',h.clinic_id) as patient_clinic_id, c.logo, g.address, g.city, g.pincode, g.locality, g.country, TIME(a.timestamp) as time FROM record AS a left JOIN practice AS c ON a.practice_id = c.practice_id left JOIN practice_address as g ON c.practice_id = g.practice_id left JOIN user AS d ON a.user_id = d.user_id left JOIN subjective AS f ON a.subject_id = f.subject_id left JOIN patient AS h ON a.patient_id = h.patient_id WHERE a.patient_id in (" + all_patient_id + ") ORDER BY a.record_id DESC";
          let query = db.query(sql, (err, result) => {
            if (err) {
              throw err;
              resolve(true);
            } else {
              result.forEach(element => {
                result1.push(element);
                // resolve(true);
              });
              resolve(true);
            }

          });
        }
      });
    });
  }).then((result) => {
    res.send({ records: result1 });
  }).catch((err) => {
    throw err;
  });
});

router.get('/get/pc/history/:preventive_id', (req, res) => {
  const patient_id = req.params.patient_id;
  const preventive_id = req.params.preventive_id;
  console.log(`mobile app test api called for getPC History for patient: ${patient_id}`.yellow);
  // let sql = "SELECT a.preventive_id, DATE(a.timestamp) as date, CONCAT('Dr. ', d.name) as vet, a.age, f.batch_no, k.treatment as type, f.name as treatment, c.name as clinic FROM preventive_care AS a left JOIN pc_history AS b ON a.preventive_id = b.preventive_id left JOIN pc_vaccination as k ON a.preventive_id = k.preventive_id left JOIN record_consumables AS f ON f.pc_vaccine_id = k.pc_vaccine_id left JOIN practice AS c ON a.practice_id = c.practice_id left JOIN user AS d ON a.user_id = d.user_id WHERE a.patient_id='"+patient_id+"' and a.preventive_id = '"+preventive_id+"' ORDER BY a.preventive_id DESC";
  // let query = db.query(sql, (err, result) => {
  //   if (err) throw err;
  //   console.log(result);
  //   res.send({ pcHistories: result });
  // });
  let sqlcheck = 'SELECT pc_vaccination.*, record_consumables.batch_no FROM pc_vaccination LEFT JOIN record_consumables ON pc_vaccination.pc_vaccine_id = record_consumables.pc_vaccine_id  WHERE pc_vaccination.preventive_id = ?';
  let query = db.query(sqlcheck, preventive_id, (err, result) => {
    console.log(result);
    res.send({ pcHistories: result });
  });
});

// router.get('/get/records/:patient_id', (req, res) => {
//   const patient_id = req.params.patient_id;
//   console.log(`mobile app test api called for getRecords for patient: ${patient_id}`.yellow);
//   let sql = `SELECT a.record_id,
//             DATE(e.date) as date,
//             f.subject_id,
//             f.cheifcom as reason,
//             a.objective_id,
//             a.assess_id,
//             a.plan_id,
//             a.prescription_id,
//             a.preventive_id,
//             e.appointment_id as event_id,
//             CONCAT(UCASE(LEFT(event_type, 1)),SUBSTRING(event_type, 2)) as event_type,
//             CONCAT('Dr. ', d.name) as vet,
//             c.name as clinic,
//             g.address,
//             g.city,
//             g.pincode,
//             g.locality,
//             g.country,
//             TIME(e.time) as time
//             FROM appointment AS e
//             LEFT JOIN practice AS c ON e.practice_id = c.practice_id
//             LEFT JOIN practice_address as g ON c.practice_id = g.practice_id
//             LEFT JOIN user AS d ON e.user_id = d.user_id
//             LEFT JOIN record AS a ON e.appointment_id = a.event_id
//             LEFT JOIN subjective AS f ON a.subject_id = f.subject_id
//             WHERE e.patient_id = ?
//             ORDER BY a.record_id DESC`;
//   let query = db.query(sql, patient_id, (err, result) => {
//     if (result.length<=0)
//     {

//       let sql1 = "select user.name as vet,practice.name as clinic,practice_address.address,practice_address.city,practice_address.country,practice_address.locality,practice_address.pincode,DATE(appointment.date) as date,appointment.appointment_id as event_id,TIME(appointment.time) as time from appointment inner join practice on appointment.practice_id = practice.practice_id inner join practice_address on appointment.practice_id = practice_address.practice_id inner join user on appointment.user_id = user.user_id inner join patient on appointment.patient_id = patient.patient_id where appointment.patient_id = ?";

// let mainuser = [];
//       let query = db.query(sql1, patient_id, (err, result1) => {
//         if (result1.length > 0) {

//           result.forEach(element => {
//                       records= {
//                         record_id: null,
//                         date: element.date,
//                         subject_id: null,
//                         objective_id: null,
//                         assess_id: null,
//                         plan_id: null,
//                         prescription_id: null,
//                         preventive_id: null,
//                         event_id: element.event_id,
//                         event_type: element.time,
//                         vet: element.vet,
//                         clinic: element.clinic,
//                         address: element.address,
//                         city: element.city,
//                         pincode: element.pincode,
//                         locality: element.locality,
//                         country: element.country,
//                         time: element.time
//                       };
//                     mainuser.push(records);
//                 }, this);

//           console.log("data is with record", records);
//                     res.send({
//                     records: mainuser
//                     });

//         }
//         else {
//           console.log("data is with record", result1.length);
//           res.send({
//           records: result1
//           });
//         }
//       });

//     }
//     else
//     {
//       console.log("data is with record", result.length);
//       res.send({ records: result });
//      }
//   });
// });

function getSubjective(params = {
  subject_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.subject_id === null) {
      console.log('subjective not found');
      resolve({ subjective: null });
    } else {
      let subSql = 'SELECT * FROM subjective WHERE subject_id = ?';
      let query = db.query(subSql, params.subject_id, (err, result) => {
        if (err) throw err;
        console.log('subjective found and resolved');
        resolve({ subjective: result[0] });
      });
    }
  });
  return promise;
}

function getVital(params = {
  objective_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.objective_id === null) {
      console.log('vitals not found');
      resolve({ vitals: null });
    } else {
      let vitalsSql = 'SELECT * FROM objective WHERE objective_id = ?';
      let vitalsQuery = db.query(vitalsSql, params.objective_id, (err, result) => {
        if (err) throw err;
        console.log('vitals found and resolved');
        resolve({ vitals: result[0] });
      });
    }
  });
  return promise;
}

function getPhysicalExam(params = {
  objective_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.objective_id === null) {
      console.log('physical exam not found');
      resolve({ physicalExam: null });
    } else {
      let physicalExamSql = 'SELECT * FROM physicalexam WHERE objective_id = ?';
      let physicalExamQuery = db.query(physicalExamSql, params.objective_id, (err, result) => {
        if (err) throw err;
        console.log('physical exam found and resolved');
        resolve({ physicalExam: result[0] });
      });
    }
  });
  return promise;
}

function getObjective(params = {
  objective_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.objective_id === null) {
      console.log('objective not found');
      resolve({ objective: null });
    } else {
      const objectivePromises = [
        getVital({
          objective_id: params.objective_id
        }),
        getPhysicalExam({
          objective_id: params.objective_id
        })
      ];
      Promise.all(objectivePromises).then(objective => {
        resolve({
          objective: {
            vitals: objective[0].vitals,
            physicalExam: objective[1].physicalExam
          }
        });
      });
    }
  });
  return promise;
}

function getAssessment(params = {
  assess_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.assess_id === null) {
      console.log('assessment not found');
      resolve({ assessment: null });
    } else {
      let assSql = 'SELECT * FROM assessment WHERE assess_id = ?';
      let query = db.query(assSql, params.assess_id, (err, result) => {
        if (err) throw err;
        console.log('assessment found and resolved');
        resolve({ assessment: result[0] });
      });
    }
  });
  return promise;
}

function getPlanning(params = {
  plan_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.plan_id === null) {
      resolve({ planning: null });
    } else {
      let planSql = 'SELECT * FROM planning WHERE plan_id = ?';
      let query = db.query(planSql, params.plan_id, (err, result) => {
        if (err) throw err;
        resolve({ planning: result[0] });
      });
    }
  });
  return promise;
}

function getClinicalNotes(params = {
  subject_id: null,
  objective_id: null,
  assess_id: null,
  plan_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    const resolveAll = new Promise.all([
      getSubjective({ subject_id: params.subject_id }), //0: subjective promise
      getObjective({ objective_id: params.objective_id }), //1: objective promise
      getAssessment({ assess_id: params.assess_id }) //2: assessment promise
      // getPlanning({plan_id: params.plan_id}) 3: planning promise
    ]).then(clinicalNotes => {
      console.log('clinical notes found and resolved')
      resolve({
        clinical_notes: {
          subjective: clinicalNotes[0].subjective, //subjective data array
          objective: clinicalNotes[1].objective, //objective data array
          assessment: clinicalNotes[2].assessment //assessment data array
          // planning: clinicalNotes[3].planning planning data array
        }
      });
    });
  });
  return promise;
}

function getPrescription(params = {
  prescription_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.prescription_id === null) {
      console.log('prescription not found');
      resolve({ prescription: null });
    } else {
      let prescriptionSql = 'SELECT * FROM pres_meds WHERE prescription_id = ?';
      let query = db.query(prescriptionSql, params.prescription_id, (err, result) => {
        if (err) throw err;
        console.log('prescription found and resolved');
        resolve({ prescription: result.length ? result : null });
      });
    }
  });
  return promise;
}

function getPreventiveCare(params = {
  preventive_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.preventive_id === null) {
      resolve({ preventive_care: null });
    } else {
      let preventiveSql = `SELECT a.preventive_id, DATE(a.timestamp) as date, CONCAT('Dr. ', d.name) as vet, a.age,
                          b.type_care as type, b.treatment, c.name as clinic
                          FROM preventive_care AS a
                          INNER JOIN pc_history AS b ON a.preventive_id = b.preventive_id
                          INNER JOIN practice AS c ON a.practice_id = c.practice_id
                          INNER JOIN user AS d ON a.user_id = d.user_id
                          WHERE preventive_id = ?
                          ORDER BY a.preventive_id DESC`;
      let query = db.query(preventiveSql, params.preventive_id, (err, result) => {
        if (err) throw err;
        resolve({ preventive_care: result });
      });
    }
  });
  return promise;
}

function getInvoice(params = {
  invoice_id: null
}) {
  const promise = new Promise((resolve, reject) => {
    if (params.invoice_id === null) {
      console.log('invoice not found');
      resolve({ invoice: null });
    } else {
      // resolve({invoice_id : params.invoice_id});
      let invoice_id = params.invoice_id;
      let creditSql = `SELECT outstanding FROM payment WHERE invoice_id = ? ORDER BY payment_id DESC LIMIT 1`;
      let detailsSql = `SELECT a.ref,
                        a.total,
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
                        d.ref as return_ref
                        FROM invoice as a
                        INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
                        LEFT JOIN patient as c ON a.patient_id = c.patient_id
                        LEFT JOIN return_invoice as d ON a.invoice_id = d.linked_invoice
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
        if (details.status !== 'Draft') {
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
                          console.log('invoice found and resolved');
                          resolve({
                            invoice: {
                              details: details,
                              discount: discount,
                              credits: credits,
                              items: items,
                              status: status,
                              outstanding: outstanding.length
                                ? outstanding[0].outstanding
                                : null
                            }
                          });
                        }
                      }
                    );
                  } else {
                    console.log('invoice found and resolved');
                    resolve({
                      invoice: {
                        details: details,
                        discount: discount,
                        credits: credits,
                        items: items,
                        status: status,
                        outstanding: outstanding.length
                          ? outstanding[0].outstanding
                          : null
                      }
                    });
                  }
                });
              });
            });
          });
        } else {
          console.log('invoice not found');
          resolve({ invoice: null });
        }
      });
    }
  });
  return promise;
}

router.get('/get/record/details/:record_id', (req, res) => {
  const record_id = req.params.record_id;
  console.log(`mobile app test api called for get record details for record_id: ${record_id}`.yellow);
  let idSql = `SELECT
              a.record_id,
              a.subject_id,
              a.objective_id,
              a.assess_id,
              a.plan_id,
              a.prescription_id,
              a.preventive_id,
              b.invoice_id as preventive_invoice_id,
              c.invoice_id as plan_invoice_id
              FROM record AS a
              LEFT JOIN invoice AS b ON a.preventive_id = b.preventive_id
              LEFT JOIN invoice AS c ON a.plan_id = c.plan_id
              WHERE a.record_id = ?
              GROUP BY a.record_id`;
  let query = db.query(idSql, record_id, (err, result) => {
    if (err) throw err;

    const promiseArray = [
      getClinicalNotes({
        subject_id: result[0].subject_id,
        objective_id: result[0].objective_id,
        assess_id: result[0].assess_id,
        plan_id: result[0].plan_id
      }),
      getPrescription({
        prescription_id: result[0].prescription_id
      }),
      // getPreventiveCare({
      //   preventive_id: result[0].preventive_id
      // }),
      getInvoice({
        invoice_id: result[0].preventive_invoice_id ? result[0].preventive_invoice_id : result[0].plan_invoice_id
      })
    ];

    const finalRecordDetails = new Promise.all(promiseArray).then(record => {
      console.log('record details found and resolved', record);
      res.send({
        clinical_notes: record[0].clinical_notes,  //clinical_notes data
        prescription: record[1].prescription,  //prescription data
        invoice: record[2].invoice  //invoice data
      });
    });
  });
});

function ifNewCreateNewPetParent(result) {
  const promise = new Promise((resolve, reject) => {
    if (result.length) {
      resolve(true);
    } else {
      // resolve promise after creating new pet_parent
      // for now not working for new pet_parents
      resolve(false);
    }
  });
  return promise;
}

router.post('/mobile-logincheckingotp', (req, res) => {
  const mobile_no = req.body.mobile_no;
  console.log(`mobile app test api called for login: ${mobile_no}`.green);
  let sql = `SELECT pet_parent_id FROM pet_parent WHERE mobile_no = ?`;
  let otpSql = `UPDATE pet_parent SET otp = ?, otp_expire_time = ? WHERE pet_parent_id = ?`;
  let query = db.query(sql, mobile_no, (err, result) => {
    if (err) throw err;
    ifNewCreateNewPetParent(result).then(proceed => {
      if (proceed) {
        const pet_parent_id = result[0].pet_parent_id;
        const otp = Math.floor(100000 + Math.random() * 900000);
        res.send({ success: true, pet_parent_id: pet_parent_id, otp: otp });
        const otpExpireTime = moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        console.log(`pet_parent_id: ${pet_parent_id}, otp: ${otp}, otpExpireTime: ${otpExpireTime}`.red);
        db.query(otpSql, [otp, otpExpireTime, pet_parent_id], (err, result) => {
          if (err) throw err;
        });

        //simultaneously send otp message
      } else {
        res.send({ error: true, msg: 'For now we dont support new pet parents! Check again later.' });
      }
    });
  });
});



router.get("/login/:boolean/:mobile_no/:player_id", (req, res) => {
  var boolean = req.params.boolean;
  var mobile_no = req.params.mobile_no;
  var player_id = req.params.player_id;
  if (boolean) {
    let sql = `SELECT pet_parent_id FROM pet_parent WHERE mobile_no = ?`;
    let query = db.query(sql, mobile_no, (err, result) => {
      console.log(result.length);

      if (result.length) {
        const pet_parent_id = result[0].pet_parent_id;
        const payload = { pet_parent_id: result[0].pet_parent_id };
        const token = jwt.sign(payload, config.secret, {
          expiresIn: 604800 //1 week in second
        });
        if (err) throw err;
        console.log("player_id:", player_id);
        res.send({
          success: true,
          msg: "OTP matched! You are logged in...",
          token: token,
          pet_parent_id: pet_parent_id,
          player_id: player_id
        });
        let player_update = `UPDATE pet_parent SET player_id = ? WHERE mobile_no = ?`;
        db.query(player_update, [player_id, mobile_no], (err, result) => {
          if (err) throw err;
          else {
            console.log("sucessfully updated the player_id");
          }
        });

      } else {
        res.send({
          success: false,
          msg: "no user exists with the mobile number"
        });
      }
    });
  } else {
    res.send({
      success: false,
      msg: "boolean is false"
    });
  }
});


router.post("/register", (req, res) => {
  var data = req.body;
  let sql = 'SELECT * FROM pet_parent WHERE mobile_no=?';
  let query = db.query(sql, [data.mobile_no], (err, resultcheck, fields) => {
    if (err) throw err;
    if (!resultcheck.length) {
      data.password = null;
      let sql2 = "INSERT INTO pet_parent(name,mobile_no,email_id,password,practice_id,user_id,player_id) values(?,?,?,?,?,?,?)";
      let query2 = db.query(sql2, [data.name, data.mobile_no, data.email_id, data.password, 0, 0, data.player_id], function (err, result) {
        if (err) throw err;
        const payload = { pet_parent_id: result.insertId };
        const token = jwt.sign(payload, config.secret, {
          expiresIn: 604800 //1 week in second
        });
        res.json({
          success: true,
          pet_parent_id: result.insertId,
          token: token,
          msg: 'user successfully registered'
        });
      });
    } else {
      res.json({
        success: false,
        msg: 'user mobile number already exists'
      });
    }
  });
});


router.post("/put/pet_parent", (req, res) => {
  var data = req.body;
  let sql = 'SELECT * FROM pet_parent WHERE pet_parent_id=?';
  let query = db.query(sql, data.pet_parent_id, (err, resultcheck1) => {
    if (err) throw err;
    let sql = 'SELECT * FROM pet_parent WHERE mobile_no=?';
    let query = db.query(sql, resultcheck1[0].mobile_no, (err, resultcheck) => {
      if (err) throw err;
      const promise = new Promise((resolve, reject) => {
        resultcheck.forEach(element => {
          var queryString_A =
            "UPDATE pet_parent SET name = '" +
            data.name +
            "', mobile_no = '" +
            data.mobile_no +
            "', email_id ='" +
            data.email_id +
            "' WHERE pet_parent_id = '" +
            element.pet_parent_id +
            "'";
          var queryString_B =
            "select * from pet_parent where pet_parent_id='" + data.pet_parent_id + "'";
          db.query(queryString_B, function (err_B, rows_B) {
            if (rows_B.length > 0) {
              db.query(queryString_A, function (err_A, rows_A) {
                if (err_A) {
                  console.log(queryString_A);
                  // res.send({ success: false, msg: "user not updated" });
                  throw err;
                } else {
                  // res.send({ success: true, msg: "user updated successfully" });
                  resolve(true);
                }
              });
            } else {
              // res.send({ success: false, msg: "Pet Parent does not exist." });
              // resolve(false);
            }
          });
        });
      }).then((result) => {
        res.send({ success: true, msg: "user updated successfully" });
      }).catch((err) => {
        res.send({ success: false, msg: "Pet Parent does not exist." });
      });
    });
  });
});



router.get('/mobilelogin/:mobile_no', (req, res) => {
  var mobile_no = req.params.mobile_no;
  let sql = `SELECT pet_parent_id FROM pet_parent WHERE mobile_no = ?`;
  let query = db.query(sql, mobile_no, (err, result) => {
    console.log(result.length);
    if (result.length) {
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false
      });
    }
  });
});



router.post('/verify-otp', (req, res) => {
  const otp = req.body.otp;
  const pet_parent_id = req.body.pet_parent_id;
  console.log(`mobile app test api called for verify-otp: ${otp} and pet_parent_id: ${pet_parent_id}`.blue);
  let sql = `SELECT otp, otp_expire_time, name, mobile_no, email_id, pet_parent_id FROM pet_parent WHERE pet_parent_id = ?`;
  let petSql = `SELECT patient_id, name, sex,
                (CASE
                  WHEN species = 'canine' THEN 'dog'
                  WHEN species = 'feline' THEN 'cat'
                  ELSE species
                END) AS species,
                breed, age_dob, color, clinic_id, image FROM patient WHERE pet_parent_id = ?`;
  let query = db.query(sql, pet_parent_id, (err, result) => {
    if (err) throw err;
    if (result.length) {
      db_otp = result[0].otp;
      db_otp_expire_time = result[0].otp_expire_time;
      if (moment().isBefore(moment(db_otp_expire_time, 'YYYY-MM-DD HH:mm:ss'))) {
        if (otp === db_otp) {
          //otp matched
          const pet_parent = {
            name: result[0].name,
            mobile_no: result[0].mobile_no,
            email_id: result[0].email_id,
            pet_parent_id: result[0].pet_parent_id
          }
          const payload = { pet_parent_id: result[0].pet_parent_id };
          const token = jwt.sign(payload, config.secret, {
            expiresIn: 604800 //1 week in second
          });
          db.query(petSql, pet_parent_id, (err, result) => {
            if (err) throw err;
            res.send({
              success: true,
              msg: 'OTP matched! You are logged in...',
              token: token,
              pet_parent: pet_parent,
              pets: result.length ? result : null
            });

          });
        } else {
          //otp not matched
          res.send({ error: true, msg: 'Wrong OTP! Please, try again.' });
        }
      } else {
        //time expired
        res.send({ error: true, msg: 'Time expired! Please, try again.' });
      }
    } else {
      // something went wrong
      res.send({ error: true, msg: 'Something went wrong! Please, try again.' });
    }

  });
});




router.post("/post/pet", uploadpetimage.any(), (req, res) => {
  let name = req.body.name;
  let sex = req.body.sex;
  let species = req.body.species;
  let breed = req.body.breed;
  let age_dob = req.body.age_dob;
  let color = req.body.color;
  let pet_parent_id = req.body.pet_parent_id;
  species === "Cat" ? (species = "Feline") : (species = species);
  species === "Dog" ? (species = "Canine") : (species = species);
  const imagelocation = req.files[0].location;
  console.log(`mobile app test api called for post pet: `.blue);
  let sql1 = `select * from pet_parent where pet_parent_id = ?`;
  let query = db.query(sql1, pet_parent_id, (err, result1) => {
    if (err) throw err;
    if (result1[0].practice_id == '0') {
      let sql =
        "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,image,practice_id) VALUES ('" +
        name +
        "','" +
        sex +
        "','" +
        species +
        "','" +
        breed +
        "','" +
        age_dob +
        "','" +
        color +
        "','" +
        pet_parent_id +
        "','" +
        imagelocation +
        "','" +
        result1[0].practice_id +
        "')";
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send({ patient_id: result.insertId });
      });
    } else if (parseInt(result1[0].practice_id) > 0) {

      let sql3 = `select * from pet_parent where mobile_no = ? and practice_id = '0'`;
      let query = db.query(sql3, result1[0].mobile_no, (err, result3) => {
        if (result3.length) {
          let sql = "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,image,practice_id) VALUES ('" + name +
            "','" + sex +
            "','" + species +
            "','" + breed +
            "','" + age_dob +
            "','" + color +
            "','" + result3[0].pet_parent_id +
            "','" + imagelocation +
            "','0')";
          let query = db.query(sql, (err, result) => {
            if (err) throw err;
            res.send({ patient_id: result.insertId });
          });
        } else {
          const register = {
            name: result1[0].name,
            mobile_no: result1[0].mobile_no,
            email_id: result1[0].email_id,
            password: result1[0].password,
            timestamp: result1[0].timestamp,
            practice_id: '0',
            user_id: '0',
            otp: result1[0].otp,
            otp_expire_time: result1[0].otp_expire_time,
            player_id: result1[0].player_id
          }
          let parent_register = `INSERT INTO pet_parent SET ? `;
          let query = db.query(parent_register, register, (err, parent) => {
            if (err) throw err;
            let sql = "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,image,practice_id) VALUES ('" + name +
              "','" + sex +
              "','" + species +
              "','" + breed +
              "','" + age_dob +
              "','" + color +
              "','" + parent.insertId +
              "','" + imagelocation +
              "','0')";
            let query = db.query(sql, (err, result) => {
              if (err) throw err;
              res.send({ patient_id: result.insertId });
            });
          });
        }
      });
      // let sql2 = "select * from patient where clinic_id and practice_id =" + result1[0].practice_id;
      // let query = db.query(sql2, result1[0].practice_id, (err, result3) => {
      //   if (err) throw err;
      //   let clinic_id = parseInt(result3.length) + 1;
      //   let sql =
      //     "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,image,practice_id,clinic_id) VALUES ('" +
      //     name +
      //     "','" +
      //     sex +
      //     "','" +
      //     species +
      //     "','" +
      //     breed +
      //     "','" +
      //     age_dob +
      //     "','" +
      //     color +
      //     "','" +
      //     pet_parent_id +
      //     "','" +
      //     imagelocation +
      //     "','" +
      //     result1[0].practice_id +
      //     "','" +
      //     clinic_id +
      //     "')";
      //   let query = db.query(sql, (err, result) => {
      //     if (err) throw err;
      //     res.send({ patient_id: result.insertId });
      //   });
      // });
    }
  });
});

router.post("/post/pet_without", (req, res) => {
  console.log(req);
  let name = req.body.name;
  let sex = req.body.sex;
  let species = req.body.species;
  let breed = req.body.breed;
  let age_dob = req.body.age_dob;
  let color = req.body.color;
  let pet_parent_id = req.body.pet_parent_id;
  console.log("pet_parent_id", pet_parent_id);
  species === "Cat" ? (species = "Feline") : (species = species);
  species === "Dog" ? (species = "Canine") : (species = species);
  // const imagelocation = req.files[0].location;
  console.log(`mobile app test api called for post pet: `.blue);
  let sql1 = `select * from pet_parent where pet_parent_id = ?`;
  let query = db.query(sql1, pet_parent_id, (err, result1) => {
    if (err) throw err;
    console.log("result1[0].practice_id", result1[0].practice_id);
    // let
    if (result1[0].practice_id == '0') {
      console.log("result1[0].practice_id", result1[0].practice_id);
      let sql =
        "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,practice_id) VALUES ('" +
        name +
        "','" +
        sex +
        "','" +
        species +
        "','" +
        breed +
        "','" +
        age_dob +
        "','" +
        color +
        "','" +
        pet_parent_id +
        // "','" +
        // imagelocation +
        "','" +
        result1[0].practice_id +
        "')";
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send({ patient_id: result.insertId });
      });
    } else if (result1[0].practice_id > 0) {
      let sql3 = `select * from pet_parent where mobile_no = ? and practice_id = '0'`;
      let query = db.query(sql3, result1[0].mobile_no, (err, result3) => {
        if (result3.length) {
          let sql = "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,practice_id) VALUES ('" + name +
            "','" + sex +
            "','" + species +
            "','" + breed +
            "','" + age_dob +
            "','" + color +
            "','" + result3[0].pet_parent_id +
            "','0')";
          let query = db.query(sql, (err, result) => {
            if (err) throw err;
            res.send({ patient_id: result.insertId });
          });
        } else {
          const register = {
            name: result1[0].name,
            mobile_no: result1[0].mobile_no,
            email_id: result1[0].email_id,
            password: result1[0].password,
            timestamp: result1[0].timestamp,
            practice_id: '0',
            user_id: '0',
            otp: result1[0].otp,
            otp_expire_time: result1[0].otp_expire_time,
            player_id: result1[0].player_id
          }
          let parent_register = `INSERT INTO pet_parent SET ? `;
          let query = db.query(parent_register, register, (err, parent) => {
            if (err) throw err;
            let sql = "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,practice_id) VALUES ('" + name +
              "','" + sex +
              "','" + species +
              "','" + breed +
              "','" + age_dob +
              "','" + color +
              "','" + parent.insertId +
              "','0')";
            let query = db.query(sql, (err, result) => {
              if (err) throw err;
              res.send({ patient_id: result.insertId });
            });
          });
        }
      });
      // console.log("result1[0].practice_id", result1[0].practice_id);
      // let sql2 = "select * from patient where clinic_id and practice_id =" + result1[0].practice_id;
      // let query = db.query(sql2, (err, result3) => {
      //   if (err) throw err;
      //   let clinic_id = parseInt(result3.length) + 1;
      //   let sql =
      //     "INSERT INTO patient (name,sex,species,breed,age_dob,color,pet_parent_id,practice_id,clinic_id) VALUES ('" +
      //     name +
      //     "','" +
      //     sex +
      //     "','" +
      //     species +
      //     "','" +
      //     breed +
      //     "','" +
      //     age_dob +
      //     "','" +
      //     color +
      //     "','" +
      //     pet_parent_id +
      //     // "','" +
      //     // imagelocation +
      //     "','" +
      //     result1[0].practice_id +
      //     "','" +
      //     clinic_id +
      //     "')";
      //   let query = db.query(sql, (err, result) => {
      //     if (err) throw err;
      //     console.log(`mobile app test api called for post pet: `.blue);
      //     res.send({ patient_id: result.insertId });
      //   });
      // });
    }
  });
});


router.post('/post/petimage', uploadpetimage.any(), (req, res) => {
  const patient_id = req.body.patient_id;
  const imagelocation = req.files[0].location;
  let sql = 'UPDATE patient SET image = ? WHERE patient_id = ?';
  let query = db.query(sql, [imagelocation, patient_id], (err, result) => {
    if (err) throw err;
    res.send({
      success: true,
      patient_id: patient_id
    });
  });
});

router.put('/put/pet', (req, res) => {
  let pet = req.body.pet;

  const promise = new Promise((resolve, reject) => {

    let sql1 = 'select patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,pet_parent.pet_parent_id,pet_parent.mobile_no from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where patient.patient_id = ?';
    let query = db.query(sql1, pet.patient_id, (err, result1) => {
      if (err) {
        throw err;
        resolve(true);
      } else {

        let sql2 = 'select pet_parent_id from pet_parent where mobile_no =?';
        let query = db.query(sql2, result1[0].mobile_no, (err, result2) => {
          if (err) {
            throw err;
            resolve(true);
          } else {

            result2.forEach(element => {

              let sql3 = "select * from patient where pet_parent_id ='" + element.pet_parent_id + "' and name ='" + result1[0].name + "' and sex ='" + result1[0].sex + "' and species ='" + result1[0].species + "' and breed ='" + result1[0].breed + "' and age_dob ='" + result1[0].age_dob + "' and color ='" + result1[0].color + "'";
              let query = db.query(sql3, element, (err, result3) => {

                if (err) {
                  throw err;
                  resolve(true);
                } else if (result3.length) {

                  result3.forEach(element1 => {

                    pet.species === 'Cat' ? pet.species = 'Feline' : pet.species = pet.species;
                    pet.species === 'Dog' ? pet.species = 'Canine' : pet.species = pet.species;
                    //pet.image = req.files[0].location;
                    pets = {
                      name: pet.name,
                      sex: pet.sex,
                      species: pet.species,
                      breed: pet.breed,
                      age_dob: pet.age_dob,
                      color: pet.color
                    }
                    console.log(`mobile app test api called for put pet: ${pet}`.blue);
                    let sql = 'UPDATE patient SET ? WHERE patient_id = ?';
                    let query = db.query(sql, [pets, element1.patient_id], (err, result) => {
                      if (err) {
                        throw err;
                        resolve(true);
                      } else {
                        // res.send({ success: true });
                        resolve(true);
                      }
                    });
                  });
                } else {
                  resolve(true);
                }
              });
            });
          }
        });
      }
    });
  }).then((result) => {
    if (result) {
      console.log("result:", result);
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false
      });
    }
  }).catch((err) => {
    throw err;
  });

});

router.get('/get/available-schedule/:user_id/:practice_id/:date', (req, res) => {
  // const pet = req.body.pet;
  // let sql = 'UPDATE patient SET ? WHERE patient_id = ?';
  // let query = db.query(sql, [pet, pet.patient_id], (err, result) => {
  //   if (err) throw err;
  //   res.send({success: true});
  // });
  var user_id = req.params.user_id;
  var practice_id = req.params.practice_id;
  var date = req.params.date;
  console.log(`mobile app test api called for get available-schedule user_id: ${user_id} and practice_id: ${practice_id}`.blue);
  // var date = moment().format('YYYY-MM-DD');
  var final = {};
  let settings_sql = `
    SELECT
      *
    FROM
      calendar_settings
    WHERE
      practice_id = ? AND user_id = ?
  `;
  let follow_sql = `
    SELECT
      time
    FROM
      follow_up
    WHERE
      date=? AND duration=? AND practice_id = ? AND user_id = ? AND (status IS NULL OR status = 'rescheduled')
  `;
  let appointment_sql = `
    SELECT
      time,
      new_patient
    FROM
      appointment
    WHERE
      date=? AND duration=? AND practice_id = ? AND user_id = ? AND (status = 'm-created' OR status IS NULL OR status = 'rescheduled')
  `;
  let surgery_sql = `
    SELECT
      time,
      duration,
      changed_time,
      changed_duration
    FROM
      surgery
    WHERE
      date=? AND practice_id = ? AND user_id = ? AND (status IS NULL OR status = 'rescheduled')
  `;
  let query = db.query(settings_sql, [practice_id, user_id], (err, result) => {
    if (err) throw err;
    let settings = result;
    console.log(result);
    let timeinterval = parseInt((result[0].timeinterval.split(' ')[0]), 10);
    let duration = timeinterval + ' minutes';
    db.query(follow_sql, [date, duration, practice_id, user_id], (err, result) => {
      if (err) throw err;
      result.forEach(element => {
        final[moment(element.time, 'HH:mm:ss').format('HH:mm:ss')] = 'follow_up';
      }, this);
      db.query(appointment_sql, [date, duration, practice_id, user_id], (err, result) => {
        if (err) throw err;
        result.forEach(element => {
          console.log("element.new_patient:", element.new_patient);
          if (element.new_patient) {
            final[moment(element.time, 'HH:mm:ss').format('HH:mm:ss')] = 'new_patient';
          } else {
            final[moment(element.time, 'HH:mm:ss').format('HH:mm:ss')] = 'appointment';
          }
        }, this);
        db.query(surgery_sql, [date, practice_id, user_id], (err, result) => {
          if (err) throw err;
          for (let i = 0; i < result.length; i++) {
            if (result[i].changed_time) {
              for (let j = 0; j <= result[i].changed_duration.split(' ')[0]; j = j + timeinterval) {
                final[moment(result[i].changed_time, 'HH:mm:ss').add({ minutes: j }).format('HH:mm:ss')] = 'surgery';
              }
            } else {
              for (let j = 0; j <= result[i].duration.split(' ')[0]; j = j + timeinterval) {
                final[moment(result[i].time, 'HH:mm:ss').add({ minutes: j }).format('HH:mm:ss')] = 'surgery';
              }
            }
          }
          res.send({ bookedSlots: final, settings: settings });
        });
      });
    });
  });
});

router.put('/get/available-schedule/:appointment_id/:pre_date/:pre_time/:date/:time/:event_type', (req, res) => {
  if (req.params.event_type == "appointment") {
    let settings_sql = "UPDATE appointment SET status = 'rescheduled', date='" + req.params.date + "' , time = '" + req.params.time + "', comment= 'rescheduled from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE appointment_id=" + req.params.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {


        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from appointment left join patient on patient.patient_id = appointment.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = appointment.user_id left join practice on practice.practice_id = appointment.practice_id where appointment.appointment_id=" + req.params.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s appointment has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          console.log(reminderUrl);
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
          console.log(reminderUrl);
          http.get(reminderUrl);
        });
        res.send({ result: result });

        console.log('updated successfully', settings_sql);

      }

    });
  }
  else if (req.params.event_type == "preventive_care") {
    console.log("preventive_care");

    let settings_sql = "UPDATE preventive_reminder SET status = 'rescheduled', date='" + req.params.date + "', comment= 'rescheduled from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + "' WHERE reminder_id=" + req.params.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {

        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from preventive_reminder left join patient on patient.patient_id = preventive_reminder.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = preventive_reminder.user_id left join practice on practice.practice_id = preventive_reminder.practice_id where preventive_reminder.reminder_id=" + req.params.appointment_id;

        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s preventive care has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          console.log(result1);
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6=&F7=' + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8=&F9=' + result1[0].practice_mobile + '&response=Y';

          http.get(reminderUrl);
        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });
  }
  else if (req.params.event_type == "follow_up") {
    console.log("follow_up");

    let settings_sql = "UPDATE follow_up SET status = 'rescheduled', date='" + req.params.date + "' , time = '" + req.params.time + "', comment= 'rescheduled from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE follow_up_id=" + req.params.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {

        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from follow_up left join patient on patient.patient_id = follow_up.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = follow_up.user_id left join practice on practice.practice_id = follow_up.practice_id where follow_up.follow_up_id=" + req.params.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {
            var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
            console.log(reminderUrl);
            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s Follow-up has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }

        });
        res.send({
          result: result
        });

        console.log('updated successfully', settings_sql);

      }

    });

  }
  else if (req.params.event_type == "surgery") {
    console.log("surgery");
    let settings_sql = "UPDATE surgery SET status = 'rescheduled', date='" + req.params.date + "' , time = '" + req.params.time + "', comment= 'rescheduled from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE surgery_id=" + req.params.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {

        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from surgery left join patient on patient.patient_id = surgery.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = surgery.user_id left join practice on practice.practice_id = surgery.practice_id where surgery.surgery_id=" + req.params.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {
            var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
            console.log(reminderUrl);
            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s surgery has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"

              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }


        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });
  }
  else {
    let settings_sql = "UPDATE appointment SET status = 'rescheduled', date='" + req.params.date + "' , time = '" + req.params.time + "', comment= 'rescheduled from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE appointment_id=" + req.params.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {


        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from appointment left join patient on patient.patient_id = appointment.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = appointment.user_id left join practice on practice.practice_id = appointment.practice_id where appointment.appointment_id=" + req.params.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s appointment has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.params.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.params.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.params.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
          console.log(reminderUrl);
        });
        res.send({ result: result });
        console.log('updated successfully', settings_sql);

      }

    });
  }

});


router.put('/get/available-schedule1', (req, res) => {
  console.log("appointment:", req.body.event_type);
  if (req.body.event_type == "appointment") {
    let settings_sql = "UPDATE appointment SET status = 'rescheduled', date='" + req.body.date + "' , time = '" + req.body.time + "', comment= 'rescheduled from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE appointment_id=" + req.body.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {


        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from appointment left join patient on patient.patient_id = appointment.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = appointment.user_id left join practice on practice.practice_id = appointment.practice_id where appointment.appointment_id=" + req.body.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s appointment has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
          http.get(reminderUrl);
        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });
  } else if (req.body.event_type == "preventive_care") {
    console.log("preventive_care");

    let settings_sql = "UPDATE preventive_reminder SET status = 'rescheduled', date='" + req.body.date + "', comment= 'rescheduled from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + "' WHERE reminder_id=" + req.body.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {

        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from preventive_reminder left join patient on patient.patient_id = preventive_reminder.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = preventive_reminder.user_id left join practice on practice.practice_id = preventive_reminder.practice_id where preventive_reminder.reminder_id=" + req.body.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s preventive care has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }

          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6=&F7=' + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8=&F9=' + result1[0].practice_mobile + '&response=Y';
          http.get(reminderUrl);
        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });
  } else if (req.body.event_type == "follow_up") {
    console.log("follow_up");

    let settings_sql = "UPDATE follow_up SET status = 'rescheduled', date='" + req.body.date + "' , time = '" + req.body.time + "', comment= 'rescheduled from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE follow_up_id=" + req.body.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {

        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from follow_up left join patient on patient.patient_id = follow_up.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = follow_up.user_id left join practice on practice.practice_id = follow_up.practice_id where follow_up.follow_up_id=" + req.body.appointment_id;



        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s Follow-up has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.params.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"
              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
          http.get(reminderUrl);

        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });

  } else if (req.body.event_type == "surgery") {
    console.log("surgery");
    let settings_sql = "UPDATE surgery SET status = 'rescheduled', date='" + req.body.date + "' , time = '" + req.body.time + "', comment= 'rescheduled from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE surgery_id=" + req.body.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {

        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from surgery left join patient on patient.patient_id = surgery.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = surgery.user_id left join practice on practice.practice_id = surgery.practice_id where surgery.surgery_id=" + req.body.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s surgery has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"

              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
          http.get(reminderUrl);
        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });
  } else {
    let settings_sql = "UPDATE appointment SET status = 'rescheduled', date='" + req.body.date + "' , time = '" + req.body.time + "', comment= 'rescheduled from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + "' WHERE appointment_id=" + req.body.appointment_id;

    let query = db.query(settings_sql, (err, result) => {
      if (err) {
        throw err;
      } else {


        let appointment = "select pet_parent.name as parent_name, pet_parent.player_id, patient.name as pets_name, user.name as doctor_name,pet_parent.mobile_no,practice.name as clinic_name,practice.mobile_no as practice_mobile from appointment left join patient on patient.patient_id = appointment.patient_id left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id left join user on user.user_id = appointment.user_id left join practice on practice.practice_id = appointment.practice_id where appointment.appointment_id=" + req.body.appointment_id;


        let query = db.query(appointment, (err, result1) => {
          if (result1.length > 0) {

            var sendNotification = function (data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
              };

              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };

              var https = require("https");
              var req = https.request(options, function (res) {
                res.on("data", function (data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                });
              });

              req.on("error", function (e) {
                console.log("ERROR:");
                console.log(e);
              });

              req.write(JSON.stringify(data));
              req.end();
            };

            var message = {
              app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
              contents: {
                en: "Hello " + result1[0].parent_name + ", your " + result1[0].pets_name + "'s appointment has been rescheduled by " + result1[0].doctor_name + " from " + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + " to " + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + " " + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + ".Thank you!"



              },
              include_player_ids: [result1[0].player_id]
            };

            sendNotification(message);
          }
          var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + result1[0].mobile_no + '&tempid=68845&F1=' + result1[0].parent_name + '&F2=' + result1[0].pets_name + '&F3=' + result1[0].clinic_name.slice(0, 30) + '&F4=' + result1[0].clinic_name.slice(30, result1[0].clinic_name.length) + '&F5=' + moment(req.body.pre_date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F6= ' + moment(req.body.pre_time, 'HH:mm:ss').format('hh:mm A') + '&F7=' + moment(req.body.date, 'YYYY-MM-DD').format('DD-MM-YYYY') + '&F8= ' + moment(req.body.time, 'HH:mm:ss').format('hh:mm A') + '&F9=' + result1[0].practice_mobile + '&response=Y';
          http.get(reminderUrl);
        });
        res.send({
          result: result
        });
        console.log('updated successfully', settings_sql);

      }

    });
  }

});






router.put('/delete', (req, res) => {

  let settings_sql = "UPDATE appointment SET status = 'deleted' ,comment= 'Deleted by Pet Parent' WHERE appointment_id=" + req.body.appointment_id;

  let query = db.query(settings_sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({ result: true });
      console.log('updated successfully', settings_sql);
    }
  });
});

router.get('/upcoming_events/:patient_id', (req, res) => {
  let current_date = moment().utcOffset("+05:30").format('YYYY-MM-DD');
  let current_datetime = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

  let sql1 = "select patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,pet_parent.pet_parent_id,pet_parent.mobile_no from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where patient.patient_id=" + req.params.patient_id;


  let query = db.query(sql1, (err, result) => {
    var mobile_no = result[0].mobile_no;

    let sql2 = "select patient.patient_id from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where pet_parent.mobile_no= '" + mobile_no + "' and patient.name ='" + result[0].name + "' and patient.sex= '" + result[0].sex + "' and patient.species= '" + result[0].species + "' and patient.breed= '" + result[0].breed + "' and patient.age_dob= '" + result[0].age_dob + "' and patient.color= '" + result[0].color + "'";

    let query1 = db.query(sql2, (err, result3) => {
      if (err) { throw err; }
      else {
        const result2 = [];
        console.log("result3:=======>", result3);
        // result3.forEach(element_patient_id => {
        const result8 = [];
        result3.forEach(element => {
          result8.push(element.patient_id);
        });
        console.log("hello====================================================================>", result8);
        let all_patient_id = result8.join(",");
        console.log("hello====================================================================>", all_patient_id);


        let upcoming_events = "(select record.record_id,appointment.appointment_id,practice.logo, appointment.date, appointment.time, appointment.user_id, appointment.practice_id, appointment.patient_id, appointment.duration, appointment.status, appointment.walkin, appointment.comment, appointment.mobile_reason as reason, concat(appointment.date, ' ', appointment.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Appointment') as event_type from appointment left join record on record.event_id = appointment.appointment_id left join practice on practice.practice_id = appointment.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = appointment.patient_id left join user on user.user_id = appointment.user_id where appointment.patient_id in (" + all_patient_id + ")) union (select record.record_id, surgery.surgery_id,practice.logo, surgery.date,surgery.time, surgery.user_id, surgery.practice_id, surgery.patient_id, surgery.duration, surgery.status, concat(null) as walkin, surgery.comment, concat(null) as reason, concat(surgery.date, ' ', surgery.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Surgery') as event_type from surgery left join record on record.event_id = surgery.surgery_id and record.event_type='surgery' left join practice on practice.practice_id = surgery.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = surgery.patient_id left join user on user.user_id = surgery.user_id where surgery.patient_id in (" + all_patient_id + ")) union (select record.record_id, follow_up.follow_up_id, practice.logo, follow_up.date, follow_up.time, follow_up.user_id, follow_up.practice_id, follow_up.patient_id, follow_up.duration, follow_up.status, concat(null) as walkin, follow_up.comment, concat(null) as reason, concat(follow_up.date, ' ', follow_up.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Follow_up') as event_type from follow_up left join record on record.event_id = follow_up.follow_up_id left join practice on practice.practice_id = follow_up.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = follow_up.patient_id left join user on user.user_id = follow_up.user_id where follow_up.patient_id in (" + all_patient_id + ")) union (select record.record_id,preventive_reminder.reminder_id as appointment_id, practice.logo,preventive_reminder.date,preventive_reminder.time,preventive_reminder.user_id,preventive_reminder.practice_id, preventive_reminder.patient_id,concat(null) as duration,preventive_reminder.status,concat(null) as walkin,preventive_reminder.comment,preventive_reminder.preventive_type as reason,concat(preventive_reminder.date,' ',preventive_reminder.time) as appointment_time ,user.name as vet,practice.name as clinic, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address,practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country,concat('Preventive_care') as event_type from preventive_reminder left join record on record.preventive_id=preventive_reminder.preventive_id left join practice on practice.practice_id = preventive_reminder.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = preventive_reminder.patient_id left join user on user.user_id = preventive_reminder.user_id where preventive_reminder.patient_id in (" + all_patient_id + "))";

        let query = db.query(upcoming_events, (err, result) => {

          if (err) {
            throw err;
          } else {

            // const promise = new Promise((resolve, reject) => {
            result.forEach(element => {
              //console.log('current_datetime',current_datetime);
              // console.log('current_datetime',current_time);
              if (element.record_id == null && (moment(element.appointment_time).format('YYYY-MM-DD HH:mm:ss') >= current_datetime || element.appointment_time == null)) {
                let record_id = element.record_id;
                let appointment_id = element.appointment_id;
                let date = element.date;
                let time = element.time;
                let user_id = element.user_id;
                let practice_id = element.practice_id;
                let patient_id = element.patient_id;
                let duration = element.duration;
                let status = element.status;
                let walkin = element.walkin;
                let comment = element.comment;
                let reason = element.reason;
                let clinic = element.clinic;
                let vet = element.vet;
                let logo = element.logo;
                let patient_clinic_id = element.patient_clinic_id;
                let address = element.address;
                let city = element.city;
                let pincode = element.pincode;
                let locality = element.locality;
                let country = element.country;
                let event_type;
                if (walkin == 1) {
                  event_type = "Walkin";
                } else {
                  event_type = element.event_type;
                }
                result2.push({ record_id, appointment_id, date, time, user_id, practice_id, patient_id, duration, status, walkin, comment, reason, logo, clinic, vet, patient_clinic_id, address, city, pincode, locality, country, event_type });
                // console.log("result7////////////////////////////////////////////////////////////",result7);
                // resolve(true);
                // result8.push({result7})
              }
              else {
                console.log('record id exist', element);
                // resolve(true);
              }
            });
            Promise.all(result2).then(res.send({ records: result2 }));
            console.log('selected successfully');
            // });
            // Promise.all(result2).then(result2.push({result2}));
          }
        });
        // });

      }
    });

  });
});

router.get('/overdue_events/:patient_id', (req, res) => {

  let current_datetime = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
  let current_date = moment().utcOffset("+05:30").format('YYYY-MM-DD');
  let sql1 = "select patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,pet_parent.pet_parent_id,pet_parent.mobile_no from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where patient.patient_id=" + req.params.patient_id;

  let query = db.query(sql1, (err, result) => {
    var mobile_no = result[0].mobile_no;

    let sql2 = "select patient.patient_id from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where pet_parent.mobile_no= '" + mobile_no + "' and patient.name ='" + result[0].name + "' and patient.sex= '" + result[0].sex + "' and patient.species= '" + result[0].species + "' and patient.breed= '" + result[0].breed + "' and patient.age_dob= '" + result[0].age_dob + "' and patient.color= '" + result[0].color + "'";

    let query1 = db.query(sql2, (err, result3) => {
      if (err) { throw err; }
      else {
        const result2 = [];
        console.log("result3:=======>", result3);
        // result3.forEach(element_patient_id => {
        const result8 = [];
        result3.forEach(element => {
          result8.push(element.patient_id);
        });
        console.log("hello====================================================================>", result8);
        // let current_time = moment().format('HH:mm:ss');

        // let upcoming_events = "select record.record_id,appointment.appointment_id,appointment.date,appointment.time,appointment.user_id,appointment.practice_id,appointment.patient_id,appointment.duration,appointment.status,appointment.walkin,appointment.comment,appointment.reason, concat(appointment.date,' ',appointment.time) as appointment_time ,practice.name as clinic_name, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country from appointment left join record on record.event_id = appointment.appointment_id left join practice on practice.practice_id = appointment.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = appointment.patient_id where appointment.patient_id = " + req.params.patient_id;// + " and appointment.date >= '" + current_date + "' and appointment.time >= '" + current_time + "'";

        // let upcoming_events = "(select record.record_id,appointment.appointment_id,appointment.date,appointment.time,appointment.user_id,appointment.practice_id,appointment.patient_id,appointment.duration,appointment.status,appointment.walkin,appointment.comment,appointment.reason, concat(appointment.date,' ',appointment.time) as appointment_time ,user.name as vet,practice.name as clinic, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country ,concat('Appointment') as event_type from appointment left join record on record.event_id = appointment.appointment_id left join practice on practice.practice_id = appointment.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = appointment.patient_id where appointment.patient_id = '" + req.params.patient_id + "') union (select record.record_id,surgery.surgery_id,surgery.date,surgery.time,surgery.user_id,surgery.practice_id,surgery.patient_id,surgery.duration,surgery.status,concat(null) as walkin,surgery.comment,concat(null) as reason, concat(surgery.date,' ',surgery.time) as appointment_time ,user.name as vet,practice.name as clinic, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country,concat('Surgery') as event_type from surgery left join record on record.event_id = surgery.surgery_id left join practice on practice.practice_id = surgery.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = surgery.patient_id where surgery.patient_id = '" + req.params.patient_id +"') union (select record.record_id,follow_up.follow_up_id,follow_up.date,follow_up.time,follow_up.user_id,follow_up.practice_id,follow_up.patient_id,follow_up.duration,follow_up.status,concat(null) as walkin,follow_up.comment,concat(null) as reason, concat(follow_up.date,' ',follow_up.time) as appointment_time ,user.name as vet,practice.name as clinic, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country,concat('Follow_up') as event_type from follow_up left join record on record.event_id = follow_up.follow_up_id left join practice on practice.practice_id = follow_up.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = follow_up.patient_id where follow_up.patient_id = '"+req.params.patient_id+"')";

        // let overdue_events = "(select record.record_id,appointment.appointment_id,practice.logo, appointment.date, appointment.time, appointment.user_id, appointment.practice_id, appointment.patient_id, appointment.duration, appointment.status, appointment.walkin, appointment.comment, appointment.reason, concat(appointment.date, ' ', appointment.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Appointment') as event_type from appointment left join record on record.event_id = appointment.appointment_id left join practice on practice.practice_id = appointment.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = appointment.patient_id left join user on user.user_id = appointment.user_id where appointment.patient_id = '" + req.params.patient_id + "') union (select record.record_id, surgery.surgery_id,practice.logo, surgery.date,surgery.time, surgery.user_id, surgery.practice_id, surgery.patient_id, surgery.duration, surgery.status, concat(null) as walkin, surgery.comment, concat(null) as reason, concat(surgery.date, ' ', surgery.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Surgery') as event_type from surgery left join record on record.event_id = surgery.surgery_id left join practice on practice.practice_id = surgery.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = surgery.patient_id left join user on user.user_id = surgery.user_id where surgery.patient_id = '" + req.params.patient_id + "') union (select record.record_id, follow_up.follow_up_id, practice.logo, follow_up.date, follow_up.time, follow_up.user_id, follow_up.practice_id, follow_up.patient_id, follow_up.duration, follow_up.status, concat(null) as walkin, follow_up.comment, concat(null) as reason, concat(follow_up.date, ' ', follow_up.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Follow_up') as event_type from follow_up left join record on record.event_id = follow_up.follow_up_id left join practice on practice.practice_id = follow_up.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = follow_up.patient_id left join user on user.user_id = follow_up.user_id where follow_up.patient_id = '" + req.params.patient_id + "') union (select record.record_id,preventive_reminder.reminder_id as appointment_id, practice.logo,preventive_reminder.date,preventive_reminder.time,preventive_reminder.user_id,preventive_reminder.practice_id, preventive_reminder.patient_id,concat(null) as duration,preventive_reminder.status,concat(null) as walkin,preventive_reminder.comment,preventive_reminder.preventive_type as reason,concat(preventive_reminder.date,' ',preventive_reminder.time) as appointment_time ,user.name as vet,practice.name as clinic, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address,practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country,concat('Preventive_care') as event_type from preventive_reminder left join record on record.preventive_id=preventive_reminder.preventive_id left join practice on practice.practice_id = preventive_reminder.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = preventive_reminder.patient_id left join user on user.user_id = preventive_reminder.user_id where preventive_reminder.patient_id = '" + req.params.patient_id + "')";
        let all_patient_id = result8.join(",");
        console.log("hello====================================================================>", all_patient_id);

        let overdue_events = "(select record.record_id,appointment.appointment_id,practice.logo, appointment.date, appointment.time, appointment.user_id, appointment.practice_id, appointment.patient_id, appointment.duration, appointment.status, appointment.walkin, appointment.comment, appointment.mobile_reason as reason, concat(appointment.date, ' ', appointment.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Appointment') as event_type from appointment left join record on record.event_id = appointment.appointment_id left join practice on practice.practice_id = appointment.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = appointment.patient_id left join user on user.user_id = appointment.user_id where appointment.patient_id in (" + all_patient_id + ")) union (select record.record_id, surgery.surgery_id,practice.logo, surgery.date,surgery.time, surgery.user_id, surgery.practice_id, surgery.patient_id, surgery.duration, surgery.status, concat(null) as walkin, surgery.comment, concat(null) as reason, concat(surgery.date, ' ', surgery.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Surgery') as event_type from surgery left join record on record.event_id = surgery.surgery_id and record.event_type='surgery' left join practice on practice.practice_id = surgery.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = surgery.patient_id left join user on user.user_id = surgery.user_id where surgery.patient_id in (" + all_patient_id + ")) union (select record.record_id, follow_up.follow_up_id, practice.logo, follow_up.date, follow_up.time, follow_up.user_id, follow_up.practice_id, follow_up.patient_id, follow_up.duration, follow_up.status, concat(null) as walkin, follow_up.comment, concat(null) as reason, concat(follow_up.date, ' ', follow_up.time) as appointment_time, user.name as vet, practice.name as clinic, concat(practice.clinic_id_name, '-', patient.clinic_id) as patient_clinic_id, practice_address.address, practice_address.city, practice_address.pincode, practice_address.locality, practice_address.country, concat('Follow_up') as event_type from follow_up left join record on record.event_id = follow_up.follow_up_id left join practice on practice.practice_id = follow_up.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = follow_up.patient_id left join user on user.user_id = follow_up.user_id where follow_up.patient_id in (" + all_patient_id + ")) union (select record.record_id,preventive_reminder.reminder_id as appointment_id, practice.logo,preventive_reminder.date,preventive_reminder.time,preventive_reminder.user_id,preventive_reminder.practice_id, preventive_reminder.patient_id,concat(null) as duration,preventive_reminder.status,concat(null) as walkin,preventive_reminder.comment,preventive_reminder.preventive_type as reason,concat(preventive_reminder.date,' ',preventive_reminder.time) as appointment_time ,user.name as vet,practice.name as clinic, concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice_address.address,practice_address.city, practice_address.pincode, practice_address.locality,practice_address.country,concat('Preventive_care') as event_type from preventive_reminder left join record on record.preventive_id=preventive_reminder.preventive_id left join practice on practice.practice_id = preventive_reminder.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = preventive_reminder.patient_id left join user on user.user_id = preventive_reminder.user_id where preventive_reminder.patient_id in (" + all_patient_id + "))";


        // const result2 = [];
        let query = db.query(overdue_events, (err, result) => {
          console.log('result===============', result);
          if (err) {
            throw err;
          } else {
            result.forEach(element => {
              console.log('current_datetime', current_datetime);
              // console.log('current_datetime',current_time);
              if (element.record_id == null && moment(element.appointment_time).format('YYYY-MM-DD HH:mm:ss') <= current_datetime) {
                let record_id = element.record_id;
                let appointment_id = element.appointment_id;
                let date = element.date;
                let time = element.time;
                let user_id = element.user_id;
                let practice_id = element.practice_id;
                let patient_id = element.patient_id;
                let duration = element.duration;
                let status = element.status;
                let walkin = element.walkin;
                let comment = element.comment;
                let reason = element.reason;
                let clinic = element.clinic;
                let vet = element.vet;
                let logo = element.logo;
                let patient_clinic_id = element.patient_clinic_id;
                let address = element.address;
                let city = element.city;
                let pincode = element.pincode;
                let locality = element.locality;
                let country = element.country;
                let event_type;
                if (walkin == 1) {
                  event_type = "Walkin";
                } else {
                  event_type = element.event_type;
                }
                result2.push({ record_id, appointment_id, date, time, user_id, practice_id, patient_id, duration, status, walkin, comment, reason, logo, clinic, vet, patient_clinic_id, address, city, pincode, locality, country, event_type });
              }
              else {
                console.log('record id exist');
              }
            })
            Promise.all(result2).then(res.send({ records: result2 }));
            console.log('selected successfully');
          }
        });
      }
    });
  });

});

router.post("/post/appointment", (req, res) => {
  console.log(req.body.appointment);
  const appointment = req.body.appointment;
  //const reason = req.body.reason;
  //const appointment_status = "Waiting";
  let sql = "SELECT patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,pet_parent.pet_parent_id,pet_parent.mobile_no FROM patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id WHERE patient.patient_id = ?";
  let query = db.query(sql, appointment.patient_id, (err, resultparent) => {
    const pet_parent_id = resultparent[0].pet_parent_id;
    const mobile_no = resultparent[0].mobile_no;
    putParentPractice1(pet_parent_id, appointment.practice_id, appointment.patient_id, appointment.user_id).then(data => {

      let sql1 = "select * from pet_parent where mobile_no ='" + mobile_no + "' and practice_id ='" + appointment.practice_id + "'";
      let query = db.query(sql1, (err, result) => {
        if (err) throw err;

        if (result.length) {

          let sql5 = "select * from patient where name ='" + resultparent[0].name + "' and sex= '" + resultparent[0].sex + "' and species= '" + resultparent[0].species + "' and breed= '" + resultparent[0].breed + "' and age_dob= '" + resultparent[0].age_dob + "' and color= '" + resultparent[0].color + "' and practice_id= '" + appointment.practice_id + "'";
          let query = db.query(sql5, appointment.patient_id, (err, result3) => {
            console.log(result3[0].patient_id);
            const appointment_final = {
              date: appointment.date,
              time: appointment.time,
              user_id: appointment.user_id,
              practice_id: appointment.practice_id,
              patient_id: result3[0].patient_id,
              duration: appointment.duration,
              new_patient: appointment.new_patient,
              walkin: appointment.walkin,
              mobile_reason: appointment.reason
            };
            let sql = "INSERT INTO appointment SET ?";
            let query = db.query(sql, [appointment_final], (err, result) => {
              if (err) throw err;
              const event_id = result.insertId;
              // updatetorecord(
              //   event_id,
              //   reason,
              //   appointment.practice_id,
              //   appointment.user_id,
              //   appointment.patient_id,
              //   appointment.date,
              //   appointment.time
              // ).then(sent => {
              //  updatetorecord1(
              //   event_id,
              //   reason,
              //   appointment.practice_id,
              //   appointment.user_id,
              //   appointment.patient_id,
              //   appointment.date,
              //   appointment.time
              // ).then(sent => {
              var queryString_A =
                "UPDATE appointment SET ismobile = '1' WHERE appointment_id = '" +
                event_id +
                "'";
              db.query(queryString_A, function (err_A, rows_A) {
                if (err_A) {
                  res.send({
                    appointment_id: event_id,
                    appointment_status: "failed"
                  });
                } else {





                  console.log("pet_parent_id:", tokenchecker, pet_parent_id);
                  let push_notification = "SELECT * FROM pet_parent WHERE pet_parent_id = ?";
                  let query = db.query(push_notification, pet_parent_id, (err, result1) => {

                    if (result1.length > 0) {
                      var sendNotification = function (data) {
                        var headers = {
                          "Content-Type": "application/json; charset=utf-8",
                          Authorization: "Basic NTBhNDQ5NGItYzcwMS00Y2U4LWJhNTctMTNhYTA1ODkzZGIy"
                        };

                        var options = {
                          host: "onesignal.com",
                          port: 443,
                          path: "/api/v1/notifications",
                          method: "POST",
                          headers: headers
                        };

                        var https = require("https");
                        var req = https.request(options, function (res) {
                          res.on("data", function (data) {
                            console.log("Response:");
                            console.log(JSON.parse(data));
                          });
                        });

                        req.on("error", function (e) {
                          console.log("ERROR:");
                          console.log(e);
                        });

                        req.write(JSON.stringify(data));
                        req.end();
                      };

                      var message = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: { en: "Hello " + result1[0].name + ",this is to reminder for your pet appointment has booked on " + moment(appointment.date, 'YYYY-MM-DD').format('DD-MM-YY') + " at " + moment(appointment.time, 'HH:mm:ss').format('hh:mm A') + ". Thank you! " },
                        include_player_ids: [result1[0].player_id]
                      };

                      sendNotification(message);
                    }

                  });

                  res.send({
                    appointment_id: event_id,
                    appointment_status: "success"
                  });
                }
              });
            });
          });
        }
      });
    });
  });
});

function putParentPractice(pet_parent_id, practice_id) {
  const promise = new Promise((resolve, reject) => {
    console.log(pet_parent_id, practice_id);
    let sql = 'SELECT * FROM pet_parent WHERE pet_parent_id = ? AND practice_id = ?';
    let query = db.query(sql, [pet_parent_id, practice_id], (err, result) => {
      if (err) throw err;
      if (!result.length) {
        let sql = 'SELECT * FROM pet_parent_practice WHERE pet_parent_id = ? AND practice_id = ?';
        let query = db.query(sql, [pet_parent_id, practice_id], (err, result) => {
          if (!result.length) {
            const data = {
              pet_parent_id: pet_parent_id,
              practice_id: practice_id
            }
            let sql = 'INSERT INTO pet_parent_practice SET ?';
            let query = db.query(sql, data, (err, resultinsert) => {
              if (err) throw err;
              resolve(true);
            });
          } else {
            console.log('second table filled');
            resolve(true);
          }
        });
      } else {
        console.log('first table filled');
        resolve(true);
      }
    });
  });
  return promise;
}

function putParentPractice1(pet_parent_id, practice_id, patient_id, user_id) {
  const promise = new Promise((resolve, reject) => {
    console.log(pet_parent_id, practice_id);
    let sql5 = 'SELECT * FROM pet_parent WHERE pet_parent_id = ?';
    let query = db.query(sql5, pet_parent_id, (err, result) => {

      let sql = "SELECT * FROM pet_parent WHERE practice_id = '" + practice_id + "' and mobile_no = '" + result[0].mobile_no + "'";
      let query = db.query(sql, practice_id, (err, result) => {
        if (err) throw err;
        console.log("qurey", sql);
        if (!result.length) {
          console.log("datain:", practice_id);
          let sql6 = 'SELECT * FROM pet_parent WHERE pet_parent_id = ?';
          let query = db.query(sql6, pet_parent_id, (err, result) => {
            const data = {
              name: result[0].name,
              mobile_no: result[0].mobile_no,
              email_id: result[0].email_id,
              password: result[0].password,
              timestamp: result[0].timestamp,
              practice_id: practice_id,
              user_id: user_id,
              otp: result[0].otp,
              otp_expire_time: result[0].otp_expire_time,
              player_id: result[0].player_id
              // pet_parent_id: pet_parent_id,
            }
            let sql1 = 'INSERT INTO pet_parent SET ?';
            let query = db.query(sql1, data, (err, resultinsert) => {
              if (err) {
                throw err;
                resolve(true);
              } else {
                console.log("result.insertId:", resultinsert.insertId);
                const inserted_pet_parent_id = resultinsert.insertId;

                let sql2 = 'select * from patient where patient_id = ?';
                let query = db.query(sql2, patient_id, (err, result1) => {
                  if (err) throw err;
                  if (result1.length) {
                    let sql3 = 'select * from patient where clinic_id and practice_id = ?';
                    let query = db.query(sql3, practice_id, (err, result2) => {
                      if (err) throw err;
                      if (result2.length >= 0) {

                        var clinic_id = parseInt(result2.length) + 1;
                        let patientdetails = {
                          name: result1[0].name,
                          sex: result1[0].sex,
                          species: result1[0].species,
                          breed: result1[0].breed,
                          age_dob: result1[0].age_dob,
                          color: result1[0].color,
                          image: result1[0].image,
                          microchip_no: result1[0].microchip_no,
                          identify_mark: result1[0].identify_mark,
                          pet_parent_id: inserted_pet_parent_id,
                          practice_id: practice_id,
                          clinic_id: clinic_id
                        };
                        let sql4 = "INSERT INTO patient set ?";
                        let query3 = db.query(sql4, patientdetails, function (err, result) {
                          if (err) throw err;
                          resolve(true);
                        });
                        resolve(true);
                      } else {
                        resolve(true);
                      }
                    });
                  } else {
                    resolve(true);
                  }
                });
              }
            });
          });
          resolve(true);
        } else {
          pet_parent_id = result[0].pet_parent_id;
          let sql1 = 'select * from patient where practice_id = ? and pet_parent_id = ?';
          let query = db.query(sql1, [practice_id, pet_parent_id], (err, resultinsert) => {
            if (err) {
              throw err;
              resolve(true);
            }
            if (!resultinsert.length) {
              var inserted_pet_parent_id = pet_parent_id;
              let sql2 = 'select * from patient where patient_id = ?';
              let query = db.query(sql2, patient_id, (err, result1) => {
                if (err) throw err;
                if (result1.length) {
                  let sql3 = 'select * from patient where clinic_id and practice_id = ?';
                  let query = db.query(sql3, practice_id, (err, result2) => {
                    if (err) throw err;
                    if (result2.length >= 0) {

                      var clinic_id = parseInt(result2.length) + 1;
                      let patientdetails = {
                        name: result1[0].name,
                        sex: result1[0].sex,
                        species: result1[0].species,
                        breed: result1[0].breed,
                        age_dob: result1[0].age_dob,
                        color: result1[0].color,
                        image: result1[0].image,
                        microchip_no: result1[0].microchip_no,
                        identify_mark: result1[0].identify_mark,
                        pet_parent_id: inserted_pet_parent_id,
                        practice_id: practice_id,
                        clinic_id: clinic_id
                      };
                      let sql4 = "INSERT INTO patient set ?";
                      let query3 = db.query(sql4, patientdetails, function (err, result) {
                        if (err) throw err;
                        resolve(true);
                      });
                      resolve(true);

                    } else {
                      resolve(true);
                    }
                  });
                } else {

                  resolve(true);
                }
              });
            } else {

              console.log("second pet verification");

              var inserted_pet_parent_id = pet_parent_id;
              let sql2 = 'select * from patient where patient_id = ?';
              let query = db.query(sql2, patient_id, (err, result1) => {
                if (err) throw err;
                if (result1.length) {
                  console.log("second pet verification:1");
                  let sql3 = 'select * from patient where clinic_id and practice_id = ?';
                  let query = db.query(sql3, practice_id, (err, result2) => {
                    if (err) throw err;
                    if (result2.length >= 0) {
                      console.log("second pet verification:2");
                      let sql5 = "select * from patient where name ='" + result1[0].name + "' and sex= '" + result1[0].sex + "' and species= '" + result1[0].species + "' and breed= '" + result1[0].breed + "' and age_dob= '" + result1[0].age_dob + "' and color= '" + result1[0].color + "' and pet_parent_id= '" + inserted_pet_parent_id + "' and practice_id= '" + practice_id + "'";
                      let query = db.query(sql5, patient_id, (err, result3) => {
                        if (err) throw err;
                        if (!result3.length) {
                          console.log("second pet verification:3");
                          var clinic_id = parseInt(result2.length) + 1;
                          let patientdetails = {
                            name: result1[0].name,
                            sex: result1[0].sex,
                            species: result1[0].species,
                            breed: result1[0].breed,
                            age_dob: result1[0].age_dob,
                            color: result1[0].color,
                            image: result1[0].image,
                            microchip_no: result1[0].microchip_no,
                            identify_mark: result1[0].identify_mark,
                            pet_parent_id: inserted_pet_parent_id,
                            practice_id: practice_id,
                            clinic_id: clinic_id
                          };
                          let sql4 = "INSERT INTO patient set ?";
                          let query3 = db.query(sql4, patientdetails, function (err, result) {
                            if (err) throw err;
                            console.log("second pet verification:4");
                            resolve(true);
                          });
                          resolve(true);

                        } else {
                          console.log("second pet verification:5");
                          resolve(true);
                        }
                      });
                    } else {
                      console.log("second pet verification:6");
                      resolve(true);
                    }
                  });
                } else {
                  console.log("second pet verification:7");
                  resolve(true);
                }
              });
            }
          });
          console.log('first table filled');
          // resolve(true);
        }
      });
    });
  });
  return promise;
}

function updatetorecord1(event_id, reason, practice_id, user_id, patient_id, date, time) {
  const promise = new Promise((resolve, reject) => {
    const timechanged = (date + ' ' + moment(time, 'hh:mm A').format('HH:mm:ss'));
    console.log(timechanged);
    const subdata = {
      practice_id: practice_id,
      user_id: user_id,
      patient_id: patient_id,
      cheifcom: reason
    }
    let sql = 'INSERT INTO subjective SET ?';
    let query = db.query(sql, subdata, (err, resultinsertsubjective) => {
      if (err) throw err;
      resolve(true);
    });
  });
  return promise;
}


function updatetorecord(event_id, reason, practice_id, user_id, patient_id, date, time) {
  const promise = new Promise((resolve, reject) => {
    const timechanged = (date + ' ' + moment(time, 'hh:mm A').format('HH:mm:ss'));
    console.log(timechanged);
    const subdata = {
      practice_id: practice_id,
      user_id: user_id,
      patient_id: patient_id,
      cheifcom: reason
    }
    let sql = 'INSERT INTO subjective SET ?';
    let query = db.query(sql, subdata, (err, resultinsertsubjective) => {
      if (err) throw err;
      const data = {
        event_type: 'appointment',
        event_id: event_id,
        subject_id: resultinsertsubjective.insertId,
        practice_id: practice_id,
        patient_id: patient_id,
        user_id: user_id,
        timestamp: timechanged
      }
      let sql = 'INSERT INTO record SET ?';
      let query = db.query(sql, data, (err, resultinsert) => {
        if (err) throw err;
        resolve(true);
      });
    });
  });
  return promise;
}

router.get('/allcliniclist/:city/:locality/:speciality', (req, res) => {
  let city = req.params.city;
  let locality = req.params.locality;
  let speciality = req.params.speciality;
  let fulldetails = [];
  let sql;
  if (city == "all" && locality == "all" && speciality == "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.activeclinic = 1 order by b.city";
  } else if (city !== "all" && locality !== "all" && speciality !== "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.speciality like '%" + speciality + "%' and b.city = '" + city + "' and b.locality ='" + locality + "' and a.activeclinic = 1 order by b.city";
  } else if (city !== "all" && locality == "all" && speciality == "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where b.city = '" + city + "' and a.activeclinic = 1 order by b.city";
  } else if (city == "all" && locality !== "all" && speciality == "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where b.locality ='" + locality + "' and a.activeclinic = 1 order by b.city";
  } else if (city == "all" && locality == "all" && speciality !== "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.speciality  like '%" + speciality + "%' and a.activeclinic = 1 order by b.city";
  } else if (city !== "all" && locality !== "all" && speciality == "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where b.city = '" + city + "' and b.locality ='" + locality + "' and a.activeclinic = 1 order by b.city";
  } else if (city == "all" && locality !== "all" && speciality !== "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.speciality  like '%" + speciality + "%' and b.locality ='" + locality + "' and a.activeclinic = 1 order by b.city";
  } else if (city !== "all" && locality == "all" && speciality !== "all") {
    sql = "SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.speciality  like '%" + speciality + "%' and b.city = '" + city + "' and a.activeclinic = 1 order by b.city";
  }
  // let sql = `SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id`;
  // let sql = `SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.practice_id = 2`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    const data = result.forEach(data => {
      console.log(data);
      let sql2 = `SELECT * FROM calendar_settings WHERE practice_id = ?`;
      let query = db.query(sql2, data.practice_id, (err, resultcalendar) => {
        if (err) throw err;
        console.log(result);
        fulldetails.push({
          details: data,
          timeinterval: resultcalendar
        })
      });
    });
    let sql = `SELECT * FROM practice as a INNER JOIN practice_address as b ON a.practice_id = b.practice_id where a.practice_id = 2`;
    let query = db.query(sql, (err, result) => {
      res.send({
        success: true,
        details: fulldetails
      });
    });
  });
});



router.get('/oneclinicdetails/:practie_id', (req, res) => {
  let mainuser = [];
  var practice_id = req.params.practie_id;
  let sql = `SELECT * FROM practice as a 
  INNER JOIN practice_address as b ON a.practice_id = b.practice_id 
  left JOIN subscription as c ON a.practice_id = c.practice_id
  WHERE a.practice_id = ?`;
  let query = db.query(sql, practice_id, (err, result) => {
    let sql2 = `SELECT * FROM user WHERE practice_id = ?`;
    let query = db.query(sql2, practice_id, (err, resultuser) => {
      resultuser.forEach(element => {
        if (element.role !== 'Staff') {
          let sql2 = `SELECT * FROM calendar_settings WHERE user_id = ?`;
          let query = db.query(sql2, element.user_id, (err, resultcalendar) => {
            if (resultcalendar.length > 0) {
              const data = {
                name: element.name,
                speciality: element.user_speciality,
                role: element.role,
                available_dates: {
                  Monday: resultcalendar[0].Monday,
                  Tuesday: resultcalendar[0].Tuesday,
                  Wednesday: resultcalendar[0].Wednesday,
                  Thursday: resultcalendar[0].Thursday,
                  Friday: resultcalendar[0].Friday,
                  Saturday: resultcalendar[0].Saturday,
                  Sunday: resultcalendar[0].Sunday
                },
                timeinterval: resultcalendar[0].timeinterval,
                available_time: resultcalendar
              }
              mainuser.push(data);
            }
            else {
              console.log("No time slot is Allocated");
            }
          });
        }
      });
      // let sql2 = `SELECT * FROM calendar_settings WHERE practice_id = ?`;
      let sql2 = `SELECT * FROM practice_amenity where practice_id = ?`;
      let query = db.query(sql2, practice_id, (err, resultamenity) => {
        if (err) throw err;
        console.log(result);
        res.send({
          success: true,
          onedetail: result[0],
          timeinterval: mainuser,
          amenity: resultamenity
        });
      });
    });
  });
});


router.post("/priorhistory", (req, res) => {
  var temp = req.body.priorhistory;
  var checkcat = req.body.checkcat;
  // if(checkcat) {
  //   var vacc = temp.catvacc;

  // }
  var med_history = temp.priormeds;

  var priorhistory = {
    obtained: temp.obtained,
    resides: temp.resides,
    diet: temp.diet,
    name: temp.name,
    litter_box: temp.litter_box,
    flea_prevent: temp.flea_prevent,
    dewormed: temp.dewormed,
    phy_exam: temp.phy_exam,
    dent_exam: temp.dent_exam,
    surgeries: temp.surgeries,
    diag_test: temp.diag_test,
    add_notes: temp.add_notes,
    microchip: temp.microchip,
    microchip_no: temp.microchip_no,
    mated_before: temp.mated_before,
    mated_litter: temp.mated_litter,
    mated_lngbck: temp.mated_lngbck,
    practice_id: temp.practice_id,
    user_id: temp.user_id,
    patient_id: temp.patient_id,
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

    if (checkcat) {
      var cat_vacc = temp.catvacc;
      var catvacc = {
        rabies: cat_vacc.rabies,
        panleuvirus: cat_vacc.panleuvirus,
        rhinotrac: cat_vacc.rhinotrac,
        calcivirus: cat_vacc.calcivirus,
        feline: cat_vacc.feline,
        other: cat_vacc.other,
        prior_id: id
      }
      let sql2 = "INSERT INTO prior_catvacc SET ?";
      db.query(sql2, catvacc, (err, result, fields) => {
      });
    }


    if (!checkcat) {
      var dog_vacc = temp.dogvacc;
      var dogvacc = {
        rabies: dog_vacc.rabies,
        parvovirus: dog_vacc.parvovirus,
        hepatitis: dog_vacc.hepatitis,
        canine: dog_vacc.canine,
        other: dog_vacc.other,
        prior_id: id
      }
      let sql3 = "INSERT INTO prior_dogvacc SET ?";
      db.query(sql3, dogvacc, (err, result, fields) => {
      });
    }

    res.json({
      success: true,
      prior_id: id
    });
  });

});





router.put("/priorhistory", (req, res) => {

  var temp = req.body.priorhistory;
  var checkcat = req.body.checkcat;
  var prior_id = req.body.prior_id;
  var deletedMeds = req.body.deleted;
  // if(checkcat) {
  //   var vacc = temp.catvacc;

  // }

  var med_history = temp.priormeds;
  var priorhistory = {
    obtained: temp.obtained,
    resides: temp.resides,
    diet: temp.diet,
    name: temp.name,
    litter_box: temp.litter_box,
    flea_prevent: temp.flea_prevent,
    dewormed: temp.dewormed,
    phy_exam: temp.phy_exam,
    dent_exam: temp.dent_exam,
    surgeries: temp.surgeries,
    diag_test: temp.diag_test,
    add_notes: temp.add_notes,
    microchip: temp.microchip,
    microchip_no: temp.microchip_no,
    mated_before: temp.mated_before,
    mated_litter: temp.mated_litter,
    mated_lngbck: temp.mated_lngbck,
  }

  deletedMeds.map(insidedelete => {
    let sqldelete = 'DELETE FROM prior_medhistory WHERE medhistory_id=?';
    db.query(sqldelete, insidedelete.medhistory_id, (err, resultcheck) => {
      if (err) throw err;
    });
  });

  let sql = "UPDATE prior_history SET ? WHERE prior_id=?";
  let query = db.query(sql, [priorhistory, prior_id], (err, result) => {
    if (err) throw err;
    let id = result.insertId;

    if (med_history.length == 0) {
    } else {
      console.log(med_history.medhistory_id);
      for (i = 0; i < med_history.length; i++) {
        if (med_history[i].medhistory_id) {
          let med_his = {
            prior_illness: med_history[i].prior_illness,
            current_med: med_history[i].current_med,
            allergies: med_history[i].allergies,
          };
          let sql1 = "UPDATE prior_medhistory SET ? WHERE medhistory_id = ?";
          db.query(sql1, [med_his, med_history[i].medhistory_id], (err, result, fields) => {
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
    if (checkcat) {
      var cat_vacc = temp.catvacc;
      var catvacc = {
        rabies: cat_vacc.rabies,
        panleuvirus: cat_vacc.panleuvirus,
        rhinotrac: cat_vacc.rhinotrac,
        calcivirus: cat_vacc.calcivirus,
        feline: cat_vacc.feline,
        other: cat_vacc.other,
      }
      let sql2 = " UPDATE prior_catvacc SET ? WHERE prior_id=?";
      db.query(sql2, [catvacc, prior_id], (err, result, fields) => {
        if (err) throw err;
        res.json({
          success: true,
          prior_id: prior_id
        });
      });
    }

    if (!checkcat) {
      var dog_vacc = temp.dogvacc;
      var dogvacc = {
        rabies: dog_vacc.rabies,
        parvovirus: dog_vacc.parvovirus,
        hepatitis: dog_vacc.hepatitis,
        canine: dog_vacc.canine,
        other: dog_vacc.other,
      }
      let sql3 = " UPDATE prior_dogvacc SET ? WHERE prior_id=?";
      db.query(sql3, [dogvacc, prior_id], (err, result, fields) => {
        if (err) throw err;
        res.json({
          success: true,
          prior_id: prior_id
        });
      });
    }
  });
});


router.get("/practice_details/:practiceid", (req, res) => {
  var practiceid = req.params.practiceid;
  var res_arr;
  if (practiceid != "") {
    var queryString_A =
      "SELECT practice.name,practice.mobile_no,practice.email_id,practice_address.address,practice_address.locality,practice_address.city,practice_address.pincode,practice_address.country FROM practice_address INNER JOIN practice ON (practice_address.practice_id = practice.practice_id) WHERE practice.practice_id ='" +
      practiceid +
      "'";
    db.query(queryString_A, function (err_A, rows_A) {
      if (rows_A.length > 0) {
        res_arr = { success: true, message: "Success", data: rows_A };
        res.send(res_arr);
      } else {
        res_arr = { status: 1, message: "Please enter the cleanic details" };
        res.send(res_arr);
      }
    });
  } else {
    res_arr = { status: 1, message: "Please enter the cleanic details" };
    res.send(res_arr);
  }
});

router.get("/addrecords/patient/:patient_id", (req, res) => {
  var patient_id = req.params.patient_id;
  let patient_details = `Select * from patient where patient_id = ?`;
  let query = db.query(patient_details, patient_id, (err, result) => {
    res_arr = { status: true, result: result[0] };
    res.send(res_arr);
  });
});

router.get("/addrecords/view/:record_id", (req, res) => {
  var record_id = req.params.record_id;
  sql = `select record.record_id,record.subject_id,record.preventive_id,record.objective_id,
  record.plan_id,record.patient_id,record.event_id,record.event_type, record.timestamp,
  subjective.cheifcom, planning.plan,objective.temp,objective.weight  from record
  left join subjective on record.subject_id=subjective.subject_id
  left join planning on record.plan_id=planning.plan_id
  left join objective on record.objective_id =objective.objective_id
  where record_id= ? `;

  let query = db.query(sql, record_id, (err, result) => {
    if (result.length > 0) {
      res_arr = { success: true, result: result[0] };
      res.send(res_arr);
    } else {
      res_arr = { success: false, result: result };
      res.send(res_arr);
    }
  });

});

router.get("/addrecords/:patient_id/:clinic_name/:doctor_name/:event_type/:date/:time/:reason/:temp/:weight/:notes/:paid_amount/:preventive_type", (req, res) => {
  var patient_id = req.params.patient_id;
  var preventive_type = req.params.preventive_type;
  var clinic_name = req.params.clinic_name;
  var doctor_name = req.params.doctor_name;
  var event_type = req.params.event_type;
  var date = req.params.date;
  var time = req.params.time;
  var reason = req.params.reason;
  var temp = req.params.temp;
  var weight = req.params.weight;
  var notes = req.params.notes;
  var paid_amount = req.params.paid_amount;
  console.log(clinic_name, doctor_name, event_type, date, time, reason, temp, weight, notes, paid_amount)
  let record = `INSERT INTO record SET ?`;
  let subjective = `INSERT INTO subjective SET ?`;
  let objective = `INSERT INTO objective SET ?`;
  let planning = `INSERT INTO planning SET ?`;
  let appointment = `INSERT INTO appointment SET ?`;
  let preventive_care = `INSERT INTO preventive_care SET ?`;
  let preventive_reminder = `INSERT INTO preventive_reminder SET ?`;
  let surgery = `INSERT INTO surgery SET ?`;
  let follow_up = `INSERT INTO follow_up SET ?`;
  let patient_details = `Select * from patient where patient_id = ?`;
  let walkin = '0';
  if (event_type == 'walkin') {
    walkin = '1'
  } else {
    walkin = '0'
  }
  const appointment_data = {
    date: date,
    time: time,
    user_id: null,
    practice_id: null,
    patient_id: patient_id,
    new_patient: 0,
    walkin: walkin
  };
  const surgery_data = {
    date: date,
    time: time,
    user_id: null,
    practice_id: null,
    patient_id: patient_id,
    surgery_type: 1
  }
  const follow_up_data = {
    date: date,
    time: time,
    user_id: null,
    practice_id: null,
    patient_id: patient_id
  }
  //appointment
  if (event_type === 'walkin' || event_type === 'appointment') {
    let query = db.query(appointment, [appointment_data], (err, result) => {
      if (err) throw err;
      let event_id = result.insertId;
      if (reason.length > 0 && reason !== null) {
        const subjective_data = {
          cheifcom: reason,
          patient_id: patient_id
        };
        let query = db.query(subjective, [subjective_data], (err, result) => {
          if (err) throw err;
          let subjective_id = result.insertId;
          if (temp.length > 0 || weight.length > 0) {
            const objective_data = {
              temp: temp,
              weight: weight,
              patient_id: patient_id
            };
            let query = db.query(objective, [objective_data], (err, result) => {
              if (err) throw err;
              let objective_id = result.insertId;
              if (notes.length > 0 && notes !== null) {
                const planning_data = {
                  practice_id: null,
                  user_id: null,
                  patient_id: patient_id,
                  plan: notes
                };
                let query = db.query(planning, [planning_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  const record_data = {
                    subject_id: subjective_id,
                    objective_id: objective_id,
                    plan_id: plan_id,
                    event_id: event_id,
                    event_type: event_type,
                    patient_id: patient_id,
                    practice_id: null,
                    user_id: null,
                    timestamp: date + ' ' + time
                  };
                  let query = db.query(record, [record_data], (err, result) => {
                    if (err) throw err;
                    let plan_id = result.insertId;
                    res_arr = { status: true, message: "Please enter the cleanic details" };
                    res.send(res_arr);
                  });
                });
              } else {
                let plan_id = null;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              }
            });
          } else {
            let objective_id = null;
            if (notes.length > 0 && notes !== null) {
              const planning_data = {
                practice_id: null,
                user_id: null,
                patient_id: patient_id,
                plan: notes
              };
              let query = db.query(planning, [planning_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              });
            } else {
              let plan_id = null;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                practice_id: null,
                patient_id: patient_id,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            }
          }
        });
      } else {
        let subjective_id = result.insertId;
        if (temp.length > 0 || weight.length > 0) {
          const objective_data = {
            temp: temp,
            weight: weight,
            patient_id: patient_id
          };
          let query = db.query(objective, [objective_data], (err, result) => {
            if (err) throw err;
            let objective_id = result.insertId;
            if (notes.length > 0 && notes !== null) {
              const planning_data = {
                practice_id: null,
                user_id: null,
                patient_id: patient_id,
                plan: notes
              };
              let query = db.query(planning, [planning_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              });
            } else {
              let plan_id = null;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            }
          });
        } else {
          let objective_id = null;
          if (notes.length > 0 && notes !== null) {
            const planning_data = {
              practice_id: null,
              user_id: null,
              patient_id: patient_id,
              plan: notes
            };
            let query = db.query(planning, [planning_data], (err, result) => {
              if (err) throw err;
              let plan_id = result.insertId;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            });
          } else {
            let plan_id = null;
            const record_data = {
              subject_id: subjective_id,
              objective_id: objective_id,
              plan_id: plan_id,
              event_id: event_id,
              event_type: event_type,
              patient_id: patient_id,
              practice_id: null,
              user_id: null,
              timestamp: date + ' ' + time
            };
            let query = db.query(record, [record_data], (err, result) => {
              if (err) throw err;
              let plan_id = result.insertId;
              res_arr = { status: true, message: "Please enter the cleanic details" };
              res.send(res_arr);
            });
          }
        }
      }
    });
  }
  //surgery
  if (event_type === 'surgery') {
    let query1 = db.query(surgery, [surgery_data], (err, result) => {
      if (err) throw err;
      let event_id = result.insertId;
      if (reason.length > 0 && reason !== null) {
        const subjective_data = {
          cheifcom: reason,
          patient_id: patient_id
        };
        let query2 = db.query(subjective, [subjective_data], (err, result) => {
          if (err) throw err;
          let subjective_id = result.insertId;
          if (temp.length > 0 || weight.length > 0) {
            const objective_data = {
              temp: temp,
              weight: weight,
              patient_id: patient_id
            };
            let query = db.query(objective, [objective_data], (err, result) => {
              if (err) throw err;
              let objective_id = result.insertId;
              if (notes.length > 0 && notes !== null) {
                const planning_data = {
                  practice_id: null,
                  user_id: null,
                  patient_id: patient_id,
                  plan: notes
                };
                let query = db.query(planning, [planning_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  const record_data = {
                    subject_id: subjective_id,
                    objective_id: objective_id,
                    plan_id: plan_id,
                    event_id: event_id,
                    event_type: event_type,
                    patient_id: patient_id,
                    practice_id: null,
                    user_id: null,
                    timestamp: date + ' ' + time
                  };
                  let query = db.query(record, [record_data], (err, result) => {
                    if (err) throw err;
                    let plan_id = result.insertId;
                    res_arr = { status: true, message: "Please enter the cleanic details" };
                    res.send(res_arr);
                  });
                });
              } else {
                let plan_id = null;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              }
            });
          } else {
            let objective_id = null;
            if (notes.length > 0 && notes !== null) {
              const planning_data = {
                practice_id: null,
                user_id: null,
                patient_id: patient_id,
                plan: notes
              };
              let query = db.query(planning, [planning_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              });
            } else {
              let plan_id = null;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            }
          }
        });
      } else {
        let subjective_id = result.insertId;
        if (temp.length > 0 || weight.length > 0) {
          const objective_data = {
            temp: temp,
            weight: weight,
            patient_id: patient_id
          };
          let query = db.query(objective, [objective_data], (err, result) => {
            if (err) throw err;
            let objective_id = result.insertId;
            if (notes.length > 0 && notes !== null) {
              const planning_data = {
                practice_id: null,
                user_id: null,
                patient_id: patient_id,
                plan: notes
              };
              let query = db.query(planning, [planning_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              });
            } else {
              let plan_id = null;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            }
          });
        } else {
          let objective_id = null;
          if (notes.length > 0 && notes !== null) {
            const planning_data = {
              practice_id: null,
              user_id: null,
              patient_id: patient_id,
              plan: notes
            };
            let query = db.query(planning, [planning_data], (err, result) => {
              if (err) throw err;
              let plan_id = result.insertId;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            });
          } else {
            let plan_id = null;
            const record_data = {
              subject_id: subjective_id,
              objective_id: objective_id,
              plan_id: plan_id,
              event_id: event_id,
              event_type: event_type,
              patient_id: patient_id,
              practice_id: null,
              user_id: null,
              timestamp: date + ' ' + time
            };
            let query = db.query(record, [record_data], (err, result) => {
              if (err) throw err;
              let plan_id = result.insertId;
              res_arr = { status: true, message: "Please enter the cleanic details" };
              res.send(res_arr);
            });
          }
        }
      }
    });
  }
  //follow_up
  if (event_type === 'follow_up') {
    let query2 = db.query(follow_up, [follow_up_data], (err, result) => {
      if (err) throw err;
      let event_id = result.insertId;
      if (reason.length > 0 && reason !== null) {
        const subjective_data = {
          cheifcom: reason,
          patient_id: patient_id
        };
        let query = db.query(subjective, [subjective_data], (err, result) => {
          if (err) throw err;
          let subjective_id = result.insertId;
          if (temp.length > 0 || weight.length > 0) {
            const objective_data = {
              temp: temp,
              weight: weight,
              patient_id: patient_id
            };
            let query = db.query(objective, [objective_data], (err, result) => {
              if (err) throw err;
              let objective_id = result.insertId;
              if (notes.length > 0 && notes !== null) {
                const planning_data = {
                  practice_id: null,
                  user_id: null,
                  patient_id: patient_id,
                  plan: notes
                };
                let query = db.query(planning, [planning_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  const record_data = {
                    subject_id: subjective_id,
                    objective_id: objective_id,
                    plan_id: plan_id,
                    event_id: event_id,
                    event_type: event_type,
                    patient_id: patient_id,
                    practice_id: null,
                    user_id: null,
                    timestamp: date + ' ' + time
                  };
                  let query = db.query(record, [record_data], (err, result) => {
                    if (err) throw err;
                    let plan_id = result.insertId;
                    res_arr = { status: true, message: "Please enter the cleanic details" };
                    res.send(res_arr);
                  });
                });
              } else {
                let plan_id = null;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              }
            });
          } else {
            let objective_id = null;
            if (notes.length > 0 && notes !== null) {
              const planning_data = {
                practice_id: null,
                user_id: null,
                patient_id: patient_id,
                plan: notes
              };
              let query = db.query(planning, [planning_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              });
            } else {
              let plan_id = null;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            }
          }
        });
      } else {
        let subjective_id = result.insertId;
        if (temp.length > 0 || weight.length > 0) {
          const objective_data = {
            temp: temp,
            weight: weight,
            patient_id: patient_id
          };
          let query = db.query(objective, [objective_data], (err, result) => {
            if (err) throw err;
            let objective_id = result.insertId;
            if (notes.length > 0 && notes !== null) {
              const planning_data = {
                practice_id: null,
                user_id: null,
                patient_id: patient_id,
                plan: notes
              };
              let query = db.query(planning, [planning_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                const record_data = {
                  subject_id: subjective_id,
                  objective_id: objective_id,
                  plan_id: plan_id,
                  event_id: event_id,
                  event_type: event_type,
                  patient_id: patient_id,
                  practice_id: null,
                  user_id: null,
                  timestamp: date + ' ' + time
                };
                let query = db.query(record, [record_data], (err, result) => {
                  if (err) throw err;
                  let plan_id = result.insertId;
                  res_arr = { status: true, message: "Please enter the cleanic details" };
                  res.send(res_arr);
                });
              });
            } else {
              let plan_id = null;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            }
          });
        } else {
          let objective_id = null;
          if (notes.length > 0 && notes !== null) {
            const planning_data = {
              practice_id: null,
              user_id: null,
              patient_id: patient_id,
              plan: notes
            };
            let query = db.query(planning, [planning_data], (err, result) => {
              if (err) throw err;
              let plan_id = result.insertId;
              const record_data = {
                subject_id: subjective_id,
                objective_id: objective_id,
                plan_id: plan_id,
                event_id: event_id,
                event_type: event_type,
                patient_id: patient_id,
                practice_id: null,
                user_id: null,
                timestamp: date + ' ' + time
              };
              let query = db.query(record, [record_data], (err, result) => {
                if (err) throw err;
                let plan_id = result.insertId;
                res_arr = { status: true, message: "Please enter the cleanic details" };
                res.send(res_arr);
              });
            });
          } else {
            let plan_id = null;
            const record_data = {
              subject_id: subjective_id,
              objective_id: objective_id,
              plan_id: plan_id,
              event_id: event_id,
              event_type: event_type,
              patient_id: patient_id,
              practice_id: null,
              user_id: null,
              timestamp: date + ' ' + time
            };
            let query = db.query(record, [record_data], (err, result) => {
              if (err) throw err;
              let plan_id = result.insertId;
              res_arr = { status: true, message: "Please enter the cleanic details" };
              res.send(res_arr);
            });
          }
        }
      }
    });
  }
  //preventive care
  if (event_type === 'preventive_care') {
    let query3 = db.query(patient_details, patient_id, (err, result) => {
      if (err) throw err;
      if (result.length) {
        const preventive_care_data = {
          date: date,
          veterinarian: doctor_name,
          user_id: null,
          practice_id: null,
          patient_id: patient_id,
          age: result[0].age_dob
        }
        let query = db.query(preventive_care, [preventive_care_data], (err, result) => {
          if (err) throw err;
          let preventive_id = result.insertId;
          const preventive_reminder_data = {
            preventive_type: preventive_type,
            date: date,
            time: time,
            user_id: null,
            practice_id: null,
            patient_id: patient_id,
            preventive_id: preventive_id
          }
          let query = db.query(preventive_reminder, [preventive_reminder_data], (err, result) => {
            if (err) throw err;
            let event_id = preventive_id;
            if (reason.length > 0 && reason !== null) {
              const subjective_data = {
                cheifcom: reason,
                patient_id: patient_id
              };
              let query = db.query(subjective, [subjective_data], (err, result) => {
                if (err) throw err;
                let subjective_id = result.insertId;
                if (temp.length > 0 || weight.length > 0) {
                  const objective_data = {
                    temp: temp,
                    weight: weight,
                    patient_id: patient_id
                  };
                  let query = db.query(objective, [objective_data], (err, result) => {
                    if (err) throw err;
                    let objective_id = result.insertId;
                    if (notes.length > 0 && notes !== null) {
                      const planning_data = {
                        practice_id: null,
                        user_id: null,
                        patient_id: patient_id,
                        plan: notes
                      };
                      let query = db.query(planning, [planning_data], (err, result) => {
                        if (err) throw err;
                        let plan_id = result.insertId;
                        const record_data = {
                          subject_id: subjective_id,
                          objective_id: objective_id,
                          plan_id: plan_id,
                          event_id: event_id,
                          event_type: event_type,
                          patient_id: patient_id,
                          practice_id: null,
                          user_id: null,
                          timestamp: date + ' ' + time
                        };
                        let query = db.query(record, [record_data], (err, result) => {
                          if (err) throw err;
                          let plan_id = result.insertId;
                          res_arr = { status: true, message: "Please enter the cleanic details" };
                          res.send(res_arr);
                        });
                      });
                    } else {
                      let plan_id = null;
                      const record_data = {
                        subject_id: subjective_id,
                        objective_id: objective_id,
                        plan_id: plan_id,
                        event_id: event_id,
                        event_type: event_type,
                        patient_id: patient_id,
                        practice_id: null,
                        user_id: null,
                        timestamp: date + ' ' + time
                      };
                      let query = db.query(record, [record_data], (err, result) => {
                        if (err) throw err;
                        let plan_id = result.insertId;
                        res_arr = { status: true, message: "Please enter the cleanic details" };
                        res.send(res_arr);
                      });
                    }
                  });
                } else {
                  let objective_id = null;
                  if (notes.length > 0 && notes !== null) {
                    const planning_data = {
                      practice_id: null,
                      user_id: null,
                      patient_id: patient_id,
                      plan: notes
                    };
                    let query = db.query(planning, [planning_data], (err, result) => {
                      if (err) throw err;
                      let plan_id = result.insertId;
                      const record_data = {
                        subject_id: subjective_id,
                        objective_id: objective_id,
                        plan_id: plan_id,
                        event_id: event_id,
                        event_type: event_type,
                        patient_id: patient_id,
                        practice_id: null,
                        user_id: null,
                        timestamp: date + ' ' + time
                      };
                      let query = db.query(record, [record_data], (err, result) => {
                        if (err) throw err;
                        let plan_id = result.insertId;
                        res_arr = { status: true, message: "Please enter the cleanic details" };
                        res.send(res_arr);
                      });
                    });
                  } else {
                    let plan_id = null;
                    const record_data = {
                      subject_id: subjective_id,
                      objective_id: objective_id,
                      plan_id: plan_id,
                      event_id: event_id,
                      event_type: event_type,
                      patient_id: patient_id,
                      practice_id: null,
                      user_id: null,
                      timestamp: date + ' ' + time
                    };
                    let query = db.query(record, [record_data], (err, result) => {
                      if (err) throw err;
                      let plan_id = result.insertId;
                      res_arr = { status: true, message: "Please enter the cleanic details" };
                      res.send(res_arr);
                    });
                  }
                }
              });
            } else {
              let subjective_id = result.insertId;
              if (temp.length > 0 || weight.length > 0) {
                const objective_data = {
                  temp: temp,
                  weight: weight,
                  patient_id: patient_id
                };
                let query = db.query(objective, [objective_data], (err, result) => {
                  if (err) throw err;
                  let objective_id = result.insertId;
                  if (notes.length > 0 && notes !== null) {
                    const planning_data = {
                      practice_id: null,
                      user_id: null,
                      patient_id: patient_id,
                      plan: notes
                    };
                    let query = db.query(planning, [planning_data], (err, result) => {
                      if (err) throw err;
                      let plan_id = result.insertId;
                      const record_data = {
                        subject_id: subjective_id,
                        objective_id: objective_id,
                        plan_id: plan_id,
                        event_id: event_id,
                        event_type: event_type,
                        patient_id: patient_id,
                        practice_id: null,
                        user_id: null,
                        timestamp: date + ' ' + time
                      };
                      let query = db.query(record, [record_data], (err, result) => {
                        if (err) throw err;
                        // let plan_id = result.insertId;
                        res_arr = { status: true, message: "Please enter the cleanic details" };
                        res.send(res_arr);
                      });
                    });
                  } else {
                    let plan_id = null;
                    const record_data = {
                      subject_id: subjective_id,
                      objective_id: objective_id,
                      plan_id: plan_id,
                      event_id: event_id,
                      event_type: event_type,
                      patient_id: patient_id,
                      practice_id: null,
                      user_id: null,
                      timestamp: date + ' ' + time
                    };
                    let query = db.query(record, [record_data], (err, result) => {
                      if (err) throw err;
                      // let plan_id = result.insertId;
                      res_arr = { status: true, message: "Please enter the cleanic details" };
                      res.send(res_arr);
                    });
                  }
                });
              } else {
                let objective_id = null;
                if (notes.length > 0 && notes !== null) {
                  const planning_data = {
                    practice_id: null,
                    user_id: null,
                    patient_id: patient_id,
                    plan: notes
                  };
                  let query = db.query(planning, [planning_data], (err, result) => {
                    if (err) throw err;
                    let plan_id = result.insertId;
                    const record_data = {
                      subject_id: subjective_id,
                      objective_id: objective_id,
                      plan_id: plan_id,
                      event_id: event_id,
                      event_type: event_type,
                      patient_id: patient_id,
                      practice_id: null,
                      user_id: null,
                      timestamp: date + ' ' + time
                    };
                    let query = db.query(record, [record_data], (err, result) => {
                      if (err) throw err;
                      // let plan_id = result.insertId;
                      res_arr = { status: true, message: "Please enter the cleanic details" };
                      res.send(res_arr);
                    });
                  });
                } else {
                  let plan_id = null;
                  const record_data = {
                    subject_id: subjective_id,
                    objective_id: objective_id,
                    plan_id: plan_id,
                    event_id: event_id,
                    patient_id: patient_id,
                    event_type: event_type,
                    practice_id: null,
                    user_id: null,
                    timestamp: date + ' ' + time
                  };
                  let query = db.query(record, [record_data], (err, result) => {
                    if (err) throw err;
                    let plan_id = result.insertId;
                    res_arr = { status: true, message: "Please enter the cleanic details" };
                    res.send(res_arr);
                  });
                }
              }
            }
          });
        });
      }
    });
  }
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
        success: false,
        msg: "error no record found"
      });
    } else {
      var prior_id = result[0].prior_id;
      var timestamp = result[0].timestamp;
      var priorhistory = {
        obtained: result[0].obtained,
        resides: result[0].resides,
        diet: result[0].diet,
        name: result[0].name,
        litter_box: result[0].litter_box,
        flea_prevent: result[0].flea_prevent,
        dewormed: result[0].dewormed,
        phy_exam: result[0].phy_exam,
        dent_exam: result[0].dent_exam,
        surgeries: result[0].surgeries,
        diag_test: result[0].diag_test,
        add_notes: result[0].add_notes,
        microchip: result[0].microchip,
        microchip_no: result[0].microchip_no,
        mated_before: result[0].mated_before,
        mated_litter: result[0].mated_litter,
        mated_lngbck: result[0].mated_lngbck
      };

      let sql2 = "SELECT * FROM prior_medhistory WHERE prior_id=?";
      db.query(sql2, prior_id, (err, result2) => {
        console.log(result2);
        if (err) throw err;
        if (checkcat == "true") {
          let sql = `SELECT * FROM prior_catvacc WHERE prior_id=?`;
          let query = db.query(sql, prior_id, (err, resultcat) => {
            if (err) throw err;
            var cat_vacc = {
              rabies: resultcat[0].rabies,
              panleuvirus: resultcat[0].panleuvirus,
              rhinotrac: resultcat[0].rhinotrac,
              calcivirus: resultcat[0].calcivirus,
              feline: resultcat[0].feline,
              other: resultcat[0].other
            };
            res.json({
              success: true,
              priorhistory: priorhistory,
              priormeds: result2,
              catvacc: cat_vacc,
              timestamp: timestamp,
              prior_id: prior_id
            });
          });
        }
        if (checkcat == "false") {
          let sql = `SELECT * FROM prior_dogvacc WHERE prior_id=?`;
          let query = db.query(sql, prior_id, (err, resultdog) => {
            if (err) throw err;
            var dog_vacc = {
              rabies: resultdog[0].rabies,
              parvovirus: resultdog[0].parvovirus,
              hepatitis: resultdog[0].hepatitis,
              canine: resultdog[0].canine,
              other: resultdog[0].other
            };
            res.json({
              success: true,
              priorhistory: priorhistory,
              priormeds: result2,
              dogvacc: dog_vacc,
              timestamp: timestamp,
              prior_id: prior_id
            });
          });
        }
      });
    }
  });
});


router.get('/timeline/records/:patient_id', (req, res) => {

  let patient_id = req.params.patient_id;
  let sql1 = "select patient.name,patient.sex,patient.species,patient.breed,patient.age_dob,patient.color,pet_parent.pet_parent_id,pet_parent.mobile_no from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where patient.patient_id=" + patient_id;
  let query = db.query(sql1, (err, result) => {
    var mobile_no = result[0].mobile_no;
    let sql2 = "select patient.patient_id from patient left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id where pet_parent.mobile_no= '" + mobile_no + "' and patient.name ='" + result[0].name + "' and patient.sex= '" + result[0].sex + "' and patient.species= '" + result[0].species + "' and patient.breed= '" + result[0].breed + "' and patient.age_dob= '" + result[0].age_dob + "' and patient.color= '" + result[0].color + "' and patient.status is NULL";
    let query1 = db.query(sql2, (err, result3) => {
      if (err) throw err;
      if (result3.length) {
        const joinArray = [];
        result3.forEach(element => {
          joinArray.push(element.patient_id);
        });

        let all_patient_id = joinArray.join(",");
        console.log(all_patient_id);
        // Promise.all(all_patient_id).then(demo => {
        sql = "(select appointment.appointment_id,appointment.date,appointment.time,appointment.patient_id, appointment.walkin,record.record_id,record.subject_id, record.objective_id,record.assess_id,record.plan_id,record.user_id,record.practice_id, record.preventive_id,concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice.name as clinicName, subjective.cheifcom,concat('appointment') as event_type,concat('doctor') as record_type,user.name as vet, concat('0') as isreminder, record.prescription_id from appointment left join record on appointment.appointment_id = record.event_id and record.event_type in ('appointment','walkin') left join patient on appointment.patient_id = patient.patient_id left join practice on appointment.practice_id = practice.practice_id left join user on appointment.user_id = user.user_id left join subjective on record.subject_id = subjective.subject_id where appointment.patient_id in (" + all_patient_id + ")) union (select surgery.surgery_id as appointment_id,surgery.date,surgery.time, surgery.patient_id,concat('') as walkin,record.record_id,record.subject_id, record.objective_id,record.assess_id,record.plan_id,record.user_id,record.practice_id, record.preventive_id,concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice.name as clinicName, subjective.cheifcom,concat('surgery') as event_type,concat('doctor') as record_type,user.name as vet, concat('0') as isreminder, record.prescription_id from surgery left join record on surgery.surgery_id = record.event_id and record.event_type = 'surgery' left join patient on surgery.patient_id = patient.patient_id left join practice on surgery.practice_id = practice.practice_id left join user on surgery.user_id = user.user_id left join subjective on record.subject_id = subjective.subject_id where surgery.patient_id in (" + all_patient_id + ")) union (select follow_up.follow_up_id as appointment_id,follow_up.date,follow_up.time, follow_up.patient_id,concat('') as walkin,record.record_id,record.subject_id,record.objective_id,record.assess_id,record.plan_id,record.user_id,record.practice_id, record.preventive_id,concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id, practice.name as clinicName, subjective.cheifcom,concat('follow_up') as event_type,concat('doctor') as record_type, user.name as vet, concat('0') as isreminder, record.prescription_id from follow_up left join record on follow_up.follow_up_id = record.event_id and record.event_type = 'follow_up' left join patient on follow_up.patient_id = patient.patient_id left join practice on follow_up.practice_id = practice.practice_id left join user on follow_up.user_id = user.user_id left join subjective on record.subject_id = subjective.subject_id where follow_up.patient_id in (" + all_patient_id + ")) union (select preventive_reminder.reminder_id as appointment_id,preventive_reminder.date,preventive_reminder.time,preventive_reminder.patient_id,concat('') as walkin,record.record_id,record.subject_id,record.objective_id,record.assess_id,record.plan_id,record.user_id,record.practice_id, record.preventive_id,concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id,practice.name as clinicName, subjective.cheifcom,concat('Preventive Care') as event_type,concat('doctor') as record_type, user.name as vet, concat('0') as isreminder, record.prescription_id from preventive_reminder left join record on record.event_id = preventive_reminder.reminder_id and record.event_type = 'preventive_care' left join practice on practice.practice_id = preventive_reminder.practice_id left join practice_address on practice.practice_id = practice_address.practice_id left join patient on patient.patient_id = preventive_reminder.patient_id left join user on user.user_id = preventive_reminder.user_id left join subjective on record.subject_id = subjective.subject_id where preventive_reminder.patient_id in (" + all_patient_id + ")) union (select concat('') as appointment_id,patient_record.date,patient_record.time, patient_record.patient_id, concat('') as walkin,patient_record.patient_rec_id as record_id,patient_record.subject_id,patient_record.objective_id,concat('') as assess_id,patient_record.plan_id,concat('') as user_id,concat('') as practice_id, concat('') as preventive_id,concat('') as patient_clinic_id, patient_record.practice_name as clinicName, subjective.cheifcom,patient_record.event_type,concat('patient') as record_type,patient_record.user_name as vet,patient_record.isreminder, concat('') as prescription_id from patient_record left join subjective on patient_record.subject_id = subjective.subject_id where patient_record.patient_id in (" + all_patient_id + ")) order by date DESC, time DESC;"
        let query = db.query(sql, (err, data) => {
          res.json({
            success: true,
            data: data
          });
        });
        // });
      }
    });
  });
});

//Add Patient Records without image
router.post('/patient_records', (req, res) => {
  console.log('records:', req.body);
  const patient_id = req.body.patient_id;
  const pet_parent_id = req.body.pet_parent_id;
  const event_type = req.body.event_type;
  const reason = req.body.reason;
  const visit_type = req.body.visit_type;
  const practice_name = req.body.clinic_name;
  const user_name = req.body.doctor_name;
  const weight = req.body.weight;
  const notes = req.body.notes;
  const reminder_date = req.body.reminder_date;
  const appointment_date = req.body.event_date;
  const image_path = req.body.image_path;
  const image_type = req.body.image_type;
  const timestamp = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

  console.log('records:', appointment_date, event_type, reason, visit_type, practice_name, user_name, weight, notes, reminder_date);
  if (reason) {
    let subjective = "INSERT INTO subjective (patient_id,cheifcom,timestamp) values(?,?,?)";
    let query2 = db.query(subjective, [patient_id, reason, timestamp], function (err, result) {
      if (err) throw err;
      const subject_id = result.insertId;
      if (weight) {
        let objective = "INSERT INTO objective (patient_id,weight,timestamp) values(?,?,?)";
        let query2 = db.query(objective, [patient_id, weight, timestamp], function (err, result1) {
          if (err) throw err;
          const objective_id = result1.insertId;
          if (notes) {
            let planning = "INSERT INTO planning (patient_id,plan,timestamp) values(?,?,?)";
            let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
              if (err) throw err;
              const plan_id = result2.insertId;
              let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
              let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                if (err) throw err;
                if (reminder_date && reminder_date !== "null") {
                  console.log('data1');
                  let patient_record_reminder = "INSERT INTO patient_record (patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
                  let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                    if (err) throw err;
                    socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                    res.send({ success: true, msg: "Record Added" });
                  });
                } else {
                  socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                  res.send({ success: true, msg: "Record Added" });
                }
              });
            });
          } else {
            const plan_id = null;
            let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
              if (err) throw err;
              if (reminder_date) {
                let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
                let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                  if (err) throw err;
                  socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                  res.send({ success: true, msg: "Record Added" });
                });
              } else {
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Added" });
              }
            });
          }
        });
      } else {
        const objective_id = null;
        if (notes) {
          let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
          let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
            if (err) throw err;
            const plan_id = result2.insertId;
            let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
              if (err) throw err;
              if (reminder_date) {
                let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
                let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                  if (err) throw err;
                  socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                  res.send({ success: true, msg: "Record Added" });
                });
              } else {
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Added" });
              }
            });
          });
        } else {
          const plan_id = null;
          let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
          let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(appointment_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
            if (err) throw err;
            if (reminder_date) {
              let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
              let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), moment(reminder_date, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                if (err) throw err;
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Added" });
              });
            } else {
              socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
              res.send({ success: true, msg: "Record Added" });
            }
          });
        }
      }
    });
  } else {
    res.send({ success: false, msg: "Record Not Added" });
  }
});

//Add Patient Records with image
router.post('/with_image/patient_records', uploadpetimage.any(), (req, res) => {
  console.log('records:', req.body);
  const imagelocation = req.files[0].location;
  const patient_id = req.body.patient_id;
  const pet_parent_id = req.body.pet_parent_id;
  const event_type = req.body.event_type;
  const reason = req.body.reason;
  const visit_type = req.body.visit_type;
  let practice_name = req.body.clinic_name;
  let user_name = req.body.doctor_name;
  const weight = req.body.weight;
  const notes = req.body.notes;
  const reminder_date = req.body.reminder_date;
  const appointment_date = req.body.event_date;
  const image_path = imagelocation;
  const image_type = req.body.image_type;
  const timestamp = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

  console.log('records:', appointment_date, event_type, reason, visit_type, practice_name, user_name, weight, notes, reminder_date);
  if (reason && reason !== "null") {
    if (user_name !== "null") {
      user_name = user_name;
    } else {
      user_name = null;
    }
    if (practice_name !== "null") {
      practice_name = practice_name;
    } else {
      practice_name = null;
    }
    let subjective = "INSERT INTO subjective(patient_id,cheifcom,timestamp) values(?,?,?)";
    let query2 = db.query(subjective, [patient_id, reason, timestamp], function (err, result) {
      if (err) throw err;
      const subject_id = result.insertId;
      if (weight && weight !== "null") {
        let objective = "INSERT INTO objective(patient_id,weight,timestamp) values(?,?,?)";
        let query2 = db.query(objective, [patient_id, weight, timestamp], function (err, result1) {
          if (err) throw err;
          const objective_id = result1.insertId;
          if (notes && notes !== "null") {
            let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
            let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
              if (err) throw err;
              const plan_id = result2.insertId;
              let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
              let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                if (err) throw err;
                if (reminder_date && reminder_date !== "null") {
                  console.log('data1');
                  let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
                  let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                    if (err) throw err;
                    socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                    res.send({ success: true, msg: "Record Added" });
                  });
                } else {
                  console.log('data11');
                  socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                  res.send({ success: true, msg: "Record Added" });
                }
              });
            });
          } else {
            const plan_id = null;
            let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
              if (err) throw err;
              if (reminder_date && reminder_date !== "null") {
                console.log('data2');
                let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
                let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                  if (err) throw err;
                  socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                  res.send({ success: true, msg: "Record Added" });
                });
              } else {
                console.log('data111');
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Added" });
              }
            });
          }
        });
      } else {
        const objective_id = null;
        if (notes && notes !== "null") {
          let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
          let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
            if (err) throw err;
            const plan_id = result2.insertId;
            let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
              if (err) throw err;
              if (reminder_date && reminder_date !== "null") {
                console.log('data3');
                let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
                let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                  if (err) throw err;
                  socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                  res.send({ success: true, msg: "Record Added" });
                });
              } else {
                console.log('data1111');
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Added" });
              }
            });
          });
        } else {
          const plan_id = null;
          let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
          let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
            if (err) throw err;
            if (reminder_date && reminder_date !== "null") {
              console.log('data4');
              let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
              let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type], function (err, result3) {
                if (err) throw err;
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Added" });
              });
            } else {
              console.log('data11111');
              socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
              res.send({ success: true, msg: "Record Added" });
            }
          });
        }
      }
    });
  } else {
    res.send({ success: false, msg: "Record Not Added" });
  }
});

//Add Patient Records with image
// router.post('/with_image/patient_records', uploadpetimage.any(), (req, res) => {
//   const imagelocation = req.files[0].location;
//   console.log('imagelocation', imagelocation);
//   console.log('records:', req.body);
//   const patient_id = req.body.patient_id;
//   const pet_parent_id = req.body.pet_parent_id;
//   const event_type = req.body.event_type;
//   const reason = req.body.reason;
//   const visit_type = req.body.visit_type;
//   const practice_name = req.body.clinic_name;
//   const user_name = req.body.doctor_name;
//   const weight = req.body.weight;
//   const notes = req.body.notes;
//   const reminder_date = req.body.reminder_date;
//   const appointment_date = req.body.event_date;
//   const image_path = imagelocation;
//   const image_type = req.body.image_type;
//   const timestamp = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

//   console.log('records:', appointment_date, event_type, reason, visit_type, practice_name, user_name, weight, notes, reminder_date);
//   if (reason) {
//     let subjective = "INSERT INTO subjective(patient_id,cheifcom,timestamp) values(?,?,?)";
//     let query2 = db.query(subjective, [patient_id, reason, timestamp], function (err, result) {
//       if (err) throw err;
//       const subject_id = result.insertId;
//       if (weight) {
//         let objective = "INSERT INTO objective(patient_id,weight,timestamp) values(?,?,?)";
//         let query2 = db.query(objective, [patient_id, weight, timestamp], function (err, result1) {
//           if (err) throw err;
//           const objective_id = result1.insertId;
//           if (notes) {
//             let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
//             let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
//               if (err) throw err;
//               const plan_id = result2.insertId;
//               let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
//               let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//                 if (err) throw err;
//                 if (reminder_date) {
//                   image_path = null;
//                   image_type = null;
//                   let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
//                   let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//                     if (err) throw err;
//                     res.send({ success: true, msg: "Record Added" });
//                   });
//                 } else {
//                   res.send({ success: true, msg: "Record Added" });
//                 }
//               });
//             });
//           } else {
//             const plan_id = null;
//             let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
//             let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//               if (err) throw err;
//               if (reminder_date) {
//                 image_path = null;
//                 image_type = null;
//                 let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
//                 let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//                   if (err) throw err;
//                   res.send({ success: true, msg: "Record Added" });
//                 });
//               } else {
//                 res.send({ success: true, msg: "Record Added" });
//               }
//             });
//           }
//         });
//       } else {
//         const objective_id = null;
//         if (notes) {
//           let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
//           let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
//             if (err) throw err;
//             const plan_id = result2.insertId;
//             let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
//             let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//               if (err) throw err;
//               if (reminder_date) {
//                 image_path = null;
//                 image_type = null;
//                 let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
//                 let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//                   if (err) throw err;
//                   res.send({ success: true, msg: "Record Added" });
//                 });
//               } else {
//                 res.send({ success: true, msg: "Record Added" });
//               }
//             });
//           });
//         } else {
//           const plan_id = null;
//           let patient_record = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'0')";
//           let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//             if (err) throw err;
//             if (reminder_date) {
//               image_path = null;
//               image_type = null;
//               let patient_record_reminder = "INSERT INTO patient_record(patient_id,pet_parent_id,practice_name,user_name,timestamp,subject_id,objective_id,plan_id,date,time,event_type,image_path,image_type,visit_type,isreminder) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'1')";
//               let query2 = db.query(patient_record_reminder, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(reminder_date).format('YYYY-MM-DD'), moment(reminder_date).format('HH:ss:mm'), event_type, image_path, image_type, visit_type], function (err, result3) {
//                 if (err) throw err;
//                 res.send({ success: true, msg: "Record Added" });
//               });
//             } else {
//               res.send({ success: true, msg: "Record Added" });
//             }
//           });
//         }
//       }
//     });
//   } else {
//     res.send({ success: false, msg: "Record Not Added" });
//   }
// });

//Update Patient Records with image
router.put('/with_image/patient_records/:patient_rec_id', uploadpetimage.any(), (req, res) => {
  const patient_rec_id = req.params.patient_rec_id;
  const imagelocation = req.files[0].location;
  console.log('imagelocation', imagelocation);
  console.log('records:', req.body);
  const patient_id = req.body.patient_id;
  const pet_parent_id = req.body.pet_parent_id;
  const event_type = req.body.event_type;
  const reason = req.body.reason;
  const visit_type = req.body.visit_type;
  const practice_name = req.body.clinic_name;
  const user_name = req.body.doctor_name;
  const weight = req.body.weight;
  const notes = req.body.notes;
  const reminder_date = req.body.reminder_date;
  const appointment_date = req.body.event_date;
  const image_path = imagelocation;
  const image_type = req.body.image_type;
  const timestamp = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
  if (reason && reason !== "null") {
    if (user_name !== "null") {
      // user_name = user_name;
    } else {
      user_name = null;
    }
    if (practice_name !== "null") {
      // practice_name = practice_name;
    } else {
      practice_name = null;
    }
    let subjective = "INSERT INTO subjective(patient_id,cheifcom,timestamp) values(?,?,?)";
    let query2 = db.query(subjective, [patient_id, reason, timestamp], function (err, result) {
      if (err) throw err;
      const subject_id = result.insertId;
      if (weight && weight !== "null") {
        let objective = "INSERT INTO objective(patient_id,weight,timestamp) values(?,?,?)";
        let query2 = db.query(objective, [patient_id, weight, timestamp], function (err, result1) {
          if (err) throw err;
          const objective_id = result1.insertId;
          if (notes && notes !== "null") {
            let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
            let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
              if (err) throw err;
              const plan_id = result2.insertId;
              let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_path = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
              let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type, patient_rec_id], function (err, result3) {
                if (err) throw err;
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Updated" });
              });
            });
          } else {
            const plan_id = null;
            let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_path = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type, patient_rec_id], function (err, result3) {
              if (err) throw err;
              socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
              res.send({ success: true, msg: "Record Updated" });
            });
          }
        });
      } else {
        const objective_id = null;
        if (notes && notes !== "null") {
          let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
          let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
            if (err) throw err;
            const plan_id = result2.insertId;
            let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_path = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type, patient_rec_id], function (err, result3) {
              if (err) throw err;
              socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
              res.send({ success: true, msg: "Record Updated" });
            });
          });
        } else {
          const plan_id = null;
          let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_path = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
          let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_path, image_type, visit_type, patient_rec_id], function (err, result3) {
            if (err) throw err;
            socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
            res.send({ success: true, msg: "Record Updated" });
          });
        }
      }
    });
  } else {
    res.send({ success: false, msg: "Record Not Updated" });
  }
});

//Update Patient Records without image
router.put('/patient_records/:patient_rec_id', (req, res) => {
  const patient_rec_id = req.params.patient_rec_id;
  console.log('records:', req.body);
  const patient_id = req.body.patient_id;
  const pet_parent_id = req.body.pet_parent_id;
  const event_type = req.body.event_type;
  const reason = req.body.reason;
  const visit_type = req.body.visit_type;
  const practice_name = req.body.clinic_name;
  const user_name = req.body.doctor_name;
  const weight = req.body.weight;
  const notes = req.body.notes;
  const reminder_date = req.body.reminder_date;
  const appointment_date = req.body.event_date;
  const image_path = req.body.image_path;
  const image_type = req.body.image_type;
  const timestamp = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
  if (reason) {
    let subjective = "INSERT INTO subjective(patient_id,cheifcom,timestamp) values(?,?,?)";
    let query2 = db.query(subjective, [patient_id, reason, timestamp], function (err, result) {
      if (err) throw err;
      const subject_id = result.insertId;
      if (weight) {
        let objective = "INSERT INTO objective(patient_id,weight,timestamp) values(?,?,?)";
        let query2 = db.query(objective, [patient_id, weight, timestamp], function (err, result1) {
          if (err) throw err;
          const objective_id = result1.insertId;
          if (notes) {
            let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
            let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
              if (err) throw err;
              const plan_id = result2.insertId;
              let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
              let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_type, visit_type, patient_rec_id], function (err, result3) {
                if (err) throw err;
                socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
                res.send({ success: true, msg: "Record Updated" });
              });
            });
          } else {
            const plan_id = null;
            let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_type, visit_type, patient_rec_id], function (err, result3) {
              if (err) throw err;
              socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
              res.send({ success: true, msg: "Record Updated" });
            });
          }
        });
      } else {
        const objective_id = null;
        if (notes) {
          let planning = "INSERT INTO planning(patient_id,plan,timestamp) values(?,?,?)";
          let query2 = db.query(planning, [patient_id, notes, timestamp], function (err, result2) {
            if (err) throw err;
            const plan_id = result2.insertId;
            let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
            let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_type, visit_type, patient_rec_id], function (err, result3) {
              if (err) throw err;
              socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
              res.send({ success: true, msg: "Record Updated" });
            });
          });
        } else {
          const plan_id = null;
          let patient_record = "UPDATE patient_record SET patient_id = ?,pet_parent_id = ?,practice_name = ?,user_name = ?,timestamp = ?,subject_id = ?,objective_id = ?,plan_id = ?,date = ?,time = ?,event_type = ?,image_type = ?,visit_type = ?,isreminder= '0' where patient_rec_id = ?";
          let query2 = db.query(patient_record, [patient_id, pet_parent_id, practice_name, user_name, timestamp, subject_id, objective_id, plan_id, moment(appointment_date).format('YYYY-MM-DD'), moment(appointment_date).format('HH:mm:ss'), event_type, image_type, visit_type, patient_rec_id], function (err, result3) {
            if (err) throw err;
            socketIO.emit('patient_records', { pet_parent_id: pet_parent_id });
            res.send({ success: true, msg: "Record Updated" });
          });
        }
      }
    });
  } else {
    res.send({ success: false, msg: "Record Not Updated" });
  }
});

//Get Wagged Pet's
router.get('/merge_pets/:mobile_no/:practice_id', (req, res) => {
  const mobile_no = req.params.mobile_no;
  const practice_id = req.params.practice_id;
  sql = `select * from pet_parent where mobile_no=? and practice_id=?`;
  let query = db.query(sql, [mobile_no, practice_id], (err, result) => {
    if (result.length) {
      sql1 = `select * from patient where pet_parent_id=? and status IS NULL`;
      let query = db.query(sql1, result[0].pet_parent_id, (err, result1) => {
        if (result1.length) {
          res.send({ success: true, data: result1 });
        } else {
          res.send({ success: true, data: result1 });
        }
      });
    } else {
      res.send({ success: false, data: result });
    }
  });
});

//Wag Pet's
router.post('/merge_pets', (req, res) => {
  const mobile_no = req.body.mobile_no;
  const practice_id = req.body.practice_id;
  const user_id = req.body.user_id;
  const patient_id = req.body.patient_id; //multiple id in array
  console.log('patient_id', patient_id)
  sql = `select * from pet_parent where mobile_no=? and practice_id=?`;
  let query = db.query(sql, [mobile_no, practice_id], (err, result) => {
    if (result.length) {
      let pet_parent_id = result[0].pet_parent_id;
      sql4 = `select * from patient where clinic_id and practice_id=?`;
      let query = db.query(sql4, practice_id, (err, result4) => {
        let clinic_id = result4.length;
        //foreach Patient-id
        patient_id.forEach(element => {
          if (element) {
            sql2 = `select * from patient where patient_id=?`;
            let query = db.query(sql2, element, (err, result2) => {
              if (result2.length) {
                sql3 = `select * from patient where name=? and sex=? and species=? and breed=? and age_dob=? and color=? and image=? and status=? and practice_id=? and pet_parent_id=?`;
                let query = db.query(sql3, [result2[0].name, result2[0].sex, result2[0].species, result2[0].breed, result2[0].age_dob, result2[0].color, result2[0].image, result2[0].status, practice_id, pet_parent_id], (err, result3) => {
                  // if (!result3.length || result3.length <= 0) {
                  // console.log('result3.length', result3.length);
                  if (result3.length == 0) {
                    // sql4 = `select * from patient where practice_id=?`;
                    // let query = db.query(sql4, practice_id, (err, result4) => {
                    clinic_id = clinic_id + 1;
                    // console.log(clinic_id);
                    let patient_data = {
                      name: result2[0].name,
                      sex: result2[0].sex,
                      species: result2[0].species,
                      breed: result2[0].breed,
                      age_dob: result2[0].age_dob,
                      color: result2[0].color,
                      image: result2[0].image,
                      pet_parent_id: pet_parent_id,
                      status: result2[0].status,
                      // clinic_id: clinic_id,
                      practice_id: practice_id,
                      wag_status: 'Requested'
                    };
                    sql5 = `INSERT INTO patient SET ?`;
                    let query = db.query(sql5, patient_data, (err, result5) => {
                      if (err) throw (err);
                      socketIO.emit('merge_request', { practice_id: practice_id });
                    });
                    // });

                  } else {
                    console.log('Pet already waged');
                  }
                });
              } else { }
            });
          }
        });
      });

      Promise.all(patient_id).then(record => {
        console.log('record details found and resolved', record);
        res.send({
          success: true,
          msg: `Pet's are successfully waged with this clinic`
        });
      });


    } else {
      sql1 = `select * from pet_parent where mobile_no=?`;
      let query = db.query(sql1, mobile_no, (err, result1) => {
        // console.log(result1);
        if (result1.length) {
          let parent_data = {
            name: result1[0].name,
            mobile_no: result1[0].mobile_no,
            email_id: result1[0].email_id,
            password: result1[0].password,
            practice_id: practice_id,
            user_id: user_id,
            player_id: result1[0].player_id
          };
          sql2 = `INSERT INTO pet_parent SET ?`;
          let query = db.query(sql2, parent_data, (err, result2) => {
            let pet_parent_id = result2.insertId;
            sql4 = `select * from patient where clinic_id and practice_id=?`;
            let query = db.query(sql4, practice_id, (err, result4) => {
              let clinic_id = result4.length;
              //foreach Patient-id
              patient_id.forEach(element => {
                if (element) {
                  sql3 = `select * from patient where patient_id=?`;
                  let query = db.query(sql3, element, (err, result3) => {
                    if (result3.length) {
                      // sql4 = `select * from patient where practice_id=?`;
                      // let query = db.query(sql4, practice_id, (err, result4) => {
                      clinic_id = clinic_id + 1;
                      console.log(clinic_id);
                      let patient_data = {
                        name: result3[0].name,
                        sex: result3[0].sex,
                        species: result3[0].species,
                        breed: result3[0].breed,
                        age_dob: result3[0].age_dob,
                        color: result3[0].color,
                        image: result3[0].image,
                        pet_parent_id: pet_parent_id,
                        status: result3[0].status,
                        // clinic_id: clinic_id,
                        practice_id: practice_id,
                        wag_status: 'Requested'
                      };
                      sql5 = `INSERT INTO patient SET ?`;
                      let query = db.query(sql5, patient_data, (err, result5) => {
                        if (err) throw (err);
                        // clinic_id=clinic_id;
                      });
                      // });
                    } else {

                    }
                  });
                }
              });
              // const patientInsertedData = new Promise.all(patient_id).then(record => {
              Promise.all(patient_id).then(record => {
                // console.log('record details found and resolved', record);
                res.send({
                  success: true,
                  msg: `Pet's are successfully waged with this clinic`
                });
              });

            });
          });
        } else { }
      });
    }
  });
});

//Select Patient Records
router.get('/patient_records/:patient_rec_id', (req, res) => {
  let patient_rec_id = req.params.patient_rec_id;
  sql = `select patient_record.*,
  subjective.cheifcom,objective.weight,planning.plan as notes
  from patient_record
  left join subjective on patient_record.subject_id = subjective.subject_id 
  left join objective on patient_record.objective_id = objective.objective_id
  left join planning on patient_record.plan_id = planning.plan_id
  where patient_record.patient_rec_id = ?;`;
  let query = db.query(sql, patient_rec_id, (err, result) => {
    console.log(result);
    if (result.length) {
      res.json({ success: true, data: result[0] });
    } else {
      res.json({ success: true, data: null });
    }
  });
});

router.delete('/patient_records/:patient_rec_id', (req, res) => {
  let patient_rec_id = req.params.patient_rec_id;
  console.log('data:', patient_rec_id)
  sql = `delete from patient_record where patient_rec_id = ?`;
  let query = db.query(sql, patient_rec_id, (err, result) => {
    if (err) throw err;
    res.json({ success: true, msg: 'Record Deleted' });
    socketIO.emit('patient_records');
  });
});

//Mail Support Pet's
router.post('/support_mail', (req, res) => {
  const from = req.body.from;
  const pet_parent_id = req.body.pet_parent_id;
  const subject = req.body.subject;
  const content = req.body.content;
  if (pet_parent_id) {
    sql = `select * from pet_parent where pet_parent_id=?`;
    let query = db.query(sql, pet_parent_id, (err, result) => {
      if (err) {
        res.json({ success: false, msg: 'Something went worng. Kindly try after sometime.' });
      } else if (result.length) {
        const mail_data = [{
          subject: subject,
          content: {
            from: from,
            text: content
          },
          parentName: result[0].name,
          mobile_no: result[0].mobile_no
        }];
        loadTemplate('tailmailsupport', mail_data).then((results) => {
          return Promise.all(results.map((result) => {
            sendEmail({
              to: 'mercy@animapp.in',
              from: '"AnimApp" <care@animapp.in>',
              subject: result.email.subject,
              html: result.email.html,
              text: result.email.text,
            })
          }));
        }).then(() => {
          res.json({ success: true, msg: 'Your request has been posted to our support team. We will reach you shortly.' });
        });
      } else {
        res.json({ success: false, msg: 'Something went worng. Kindly try after sometime.' });
      }
    });
  }
});

router.post('/breed_post', (req, res) => {

  if (req.body.species == "Cat") {
    const new_breed = {
      breed: req.body.breed,
      species_id: 2
    }
    let post_breed = `INSERT INTO breeds SET ?`;
    let query = db.query(post_breed, new_breed, (err, result) => {
      if (err) throw (err);
      res.json({ success: true, msg: 'New Breed Added Successfully.' });
    });
  } else if (req.body.species == "Dog") {
    const new_breed = {
      breed: req.body.breed,
      species_id: 1
    }
    let post_breed = `INSERT INTO breeds SET ?`;
    let query = db.query(post_breed, new_breed, (err, result) => {
      if (err) throw (err);
      res.json({ success: true, msg: 'New Breed Added Successfully.' });
    });
  } else {
    const new_breed = {
      breed: req.body.breed,
      species_id: 0
    }
    let post_breed = `INSERT INTO breeds SET ?`;
    let query = db.query(post_breed, new_breed, (err, result) => {
      if (err) throw (err);
      res.json({ success: true, msg: 'New Breed Added Successfully.' });
    });
  }

});

router.post('/reason_post', (req, res) => {
  const new_reason = {
    symptoms: req.body.reason,
    symptom_id: 0
  };
  let subjective = `INSERT INTO symptoms_subjective SET ?`;
  let query = db.query(subjective, new_reason, (err, result) => {
    if (err) throw (err);
    res.json({ success: true, msg: 'New Reasons Added Successfully.' });
  });
});

router.get('/getreason', (req, res) => {

  let subjective = `select symptoms from symptoms_subjective`;
  let query = db.query(subjective, (err, result) => {
    if (err) throw (err);
    console.log(result);
    res.json({ success: true, data: result });
  });

});

router.put('/logout/playerid', (req, res) => {
  let mobile_no = req.body.mobile_no;
  sql = `select * from pet_parent where mobile_no=?`;
  let query = db.query(sql, mobile_no, (err, result) => {
    if (err) throw (err);
    if (result.length) {
      result.forEach(element => {
        updateQuery = `UPDATE pet_parent SET player_id = NULL where pet_parent_id = ?`;
        let query = db.query(updateQuery, element.pet_parent_id, (err, result) => {
          if (err) throw (err);
        });
      });
      Promise.all(result).then(res.send({ success: true }));
    }
  });
});

router.get('/location/city', (req, res) => {
  sql = `select * from practice_address`;
  let query = db.query(sql, (err, result) => {
    if (err) throw (err);
    if (result.length) {
      var newarr = [];
      var unique = {};
      result.forEach(item => {
        if (!unique[item.city]) {
          newarr.push(item.city);
          unique[item.city] = item;
        }
      });
      res.send({ success: true, city: newarr })
    } else {
      res.send({ success: false });
    }
  });
});

router.get('/location/area/:city', (req, res) => {
  let city = req.params.city;
  sql = `select * from practice_address where city = ?`;
  let query = db.query(sql, city, (err, result) => {
    if (err) throw (err);
    if (result.length) {
      var newarr = [];
      var unique = {};

      result.forEach(item => {
        if (!unique[item.locality]) {
          newarr.push(item.locality);
          unique[item.locality] = item;
        }
      });
      res.send({ success: true, area: newarr })
    } else {
      res.send({ success: false });
    }
  });
});

router.get('/clinic/speciality', (req, res) => {
  // let speciality = req.params.speciality;
  sql = `SELECT * FROM practice`;
  let query = db.query(sql, (err, result) => {
    if (err) throw (err);
    if (result.length) {
      var newarr = [];
      var unique = {};
      result.forEach(item => {
        if (!unique[item.speciality]) {
          newarr.push(item.speciality);
          unique[item.speciality] = item;
        }
      });
      res.send({ success: true, speciality: newarr })
    } else {
      res.send({ success: false });
    }
  });
});

router.get('/get/newtail/booking/:mobile_no', (req, res) => {
  let mobileNo = req.params.mobile_no;
  let sql = `(select appointment.date,appointment.time,
    CASE WHEN appointment.walkin = '1' THEN 'Walk-In' ELSE 'Appointment' END as 'appointment_type', 
    invoice.invoice_id, invoice.ref, invoice.date as 'invoiceDate',
    invoice.final_discount,invoice.total,invoice.status as 'invoiceStatus',invoice.payment_type as 'invoicePaymentType',
    record.*, patient.*, pet_parent.name as 'parentName', practice.name as 'clinicName', practice.mobile_no as 'clinicMobile',
    subjective.cheifcom as 'reason', objective.temp, objective.weight
    from appointment
    left join patient on appointment.patient_id = patient.patient_id
    left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id
    left join practice on appointment.practice_id = practice.practice_id
    left join record on appointment.appointment_id = record.event_id and record.event_type in ('appointment','walkin')
    left join invoice on invoice.preventive_id = record.preventive_id or invoice.plan_id = record.plan_id 
    left join subjective on subjective.subject_id = record.subject_id
    left join objective on objective.objective_id = record.objective_id
    where pet_parent.mobile_no = ? and pet_parent.practice_id <> '0' and appointment.appointment_id)
    union
    (select follow_up.date,follow_up.time,'Follow Up' as 'appointment_type' , 
    invoice.invoice_id, invoice.ref, invoice.date as 'invoiceDate',
    invoice.final_discount,invoice.total,invoice.status as 'invoiceStatus',invoice.payment_type as 'invoicePaymentType',
    record.* , patient.*,pet_parent.name as 'parentName', practice.name as 'clinicName', practice.mobile_no as 'clinicMobile',
    subjective.cheifcom as 'reason', objective.temp, objective.weight
    from follow_up
    left join patient on follow_up.patient_id = patient.patient_id
    left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id
    left join practice on follow_up.practice_id = practice.practice_id
    left join record on follow_up.follow_up_id = record.event_id and record.event_type = 'follow_up'
    left join invoice on invoice.preventive_id = record.preventive_id or invoice.plan_id = record.plan_id 
    left join subjective on subjective.subject_id = record.subject_id
    left join objective on objective.objective_id = record.objective_id
    where pet_parent.mobile_no = ? and pet_parent.practice_id <> '0' and follow_up.follow_up_id)
    union
    (select surgery.date,surgery.time,'Surgery' as 'appointment_type' , 
    invoice.invoice_id, invoice.ref, invoice.date as 'invoiceDate',
    invoice.final_discount,invoice.total,invoice.status as 'invoiceStatus',invoice.payment_type as 'invoicePaymentType',
    record.* , patient.*,pet_parent.name as 'parentName', practice.name as 'clinicName', practice.mobile_no as 'clinicMobile',
    subjective.cheifcom as 'reason', objective.temp, objective.weight
    from surgery
    left join patient on surgery.patient_id = patient.patient_id
    left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id
    left join practice on surgery.practice_id = practice.practice_id
    left join record on surgery.surgery_id = record.event_id and record.event_type = 'surgery'
    left join invoice on invoice.preventive_id = record.preventive_id or invoice.plan_id = record.plan_id 
    left join subjective on subjective.subject_id = record.subject_id
    left join objective on objective.objective_id = record.objective_id
    where pet_parent.mobile_no = ? and pet_parent.practice_id <> '0' and surgery.surgery_id)
    union
    (select preventive_reminder.date,preventive_reminder.time,'Preventive Care' as 'appointment_type' , 
    invoice.invoice_id, invoice.ref, invoice.date as 'invoiceDate',
    invoice.final_discount,invoice.total,invoice.status as 'invoiceStatus',
    invoice.payment_type as 'invoicePaymentType', record.* , patient.*,
    pet_parent.name as 'parentName', practice.name as 'clinicName', practice.mobile_no as 'clinicMobile',
    subjective.cheifcom as 'reason', objective.temp, objective.weight
    from preventive_reminder
    left join patient on preventive_reminder.patient_id = patient.patient_id
    left join pet_parent on pet_parent.pet_parent_id = patient.pet_parent_id
    left join practice on preventive_reminder.practice_id = practice.practice_id
    left join record on preventive_reminder.reminder_id = record.event_id and record.event_type = 'preventive_care'
    left join invoice on invoice.preventive_id = record.preventive_id or invoice.plan_id = record.plan_id 
    left join subjective on subjective.subject_id = record.subject_id
    left join objective on objective.objective_id = record.objective_id
    where pet_parent.mobile_no = ? and pet_parent.practice_id <> '0' and preventive_reminder.reminder_id)
    ORDER BY date DESC, time DESC`;
  let query = db.query(sql, [mobileNo, mobileNo, mobileNo, mobileNo], (err, result) => {
    if (err) {
      res.send({ success: false });
    } else {
      res.send({ success: true, bookingDetails: result })
    }
  });
});

router.get('/get/newtail/preventiveList/:preventiveId', (req, res) => {
  let preventiveId = req.params.preventiveId;
  let sql = `SELECT * FROM pc_vaccination where preventive_id = ?`;
  let query = db.query(sql, preventiveId, (err, result) => {
    if (err) {
      res.send({ success: false });
    } else {
      res.send({ success: true, preventiveList: result })
    }
  });
});

router.get('/get/newtail/prescriptionList/:prescriptionId', (req, res) => {
  let prescriptionId = req.params.prescriptionId;
  let sql = `SELECT * FROM pres_meds where prescription_id = ?`;
  let query = db.query(sql, prescriptionId, (err, result) => {
    if (err) {
      res.send({ success: false });
    } else {
      res.send({ success: true, prescriptionList: result })
    }
  });
});

router.get('/get/newtail/invoiceItems/:invoiceId', (req, res) => {
  let invoiceId = req.params.invoiceId;
  let sql = `SELECT * FROM invoice_items where invoice_id = ?`;
  let query = db.query(sql, invoiceId, (err, result) => {
    if (err) {
      res.send({ success: false });
    } else {
      res.send({ success: true, invoiceItems: result })
    }
  });
});

router.get('/get/newtail/paymentReceipts/:invoiceId', (req, res) => {
  let invoiceId = req.params.invoiceId;
  let sql = `SELECT * FROM payment where invoice_id = ? order by payment_id desc;`;
  let query = db.query(sql, invoiceId, (err, result) => {
    if (err) {
      res.send({ success: false });
    } else {
      res.send({ success: true, paymentReceipts: result })
    }
  });
});

// router.get('/amenities/:practice_id', (req, res) => {
//   let practice_id = req.params.practice_id;
//   sql = `SELECT * FROM practice_amenity where practice_id = ?`;
//   let query = db.query(sql,practice_id,(err, result) => {
//     if (err) throw (err);
//     if (result.length) {
//       res.send({ success: true, amenities: result })
//     } else {
//       res.send({ success: false });
//     }
//   });
// });

router.get('/test', (req, res) => {
  res.json({
    success: true,
    date: moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss')
  });
});

router.post('/open/registration/:ref_type/:reffered_name', (req, res) => {
  let mobile_no = req.body.mobile_no;
  let ref_type = req.params.ref_type;
  let reffered_name = req.params.reffered_name;
  sql = `select * from open_registration where mobile_no = ?`;
  let query = db.query(sql, mobile_no, (err, result) => {
    if (err) throw (err);
    if (!result.length) {
      let open_registration = `INSERT INTO open_registration SET ?`;
      let query = db.query(open_registration, req.body, (err, result) => {
        if (err) throw (err);
        if (ref_type !== null && ref_type !== "null" && ref_type) {
          var refferedUrl = "http://api.msg91.com/api/v2/sendsms?message=Hey " + req.body.name + ",you've been nominated by your " + ref_type + " " + reffered_name + " to download the tail app for your pet. Find veterinary clinics, manage your pets, add vaccination reminders and upload their health records. https://goo.gl/z98dPe&authkey=247735AbnQRuVrmSuO5befbdb7&mobiles=" + mobile_no + "&route=4&sender=TAILAP&country=91";
          http.get(refferedUrl);
          res.json({ success: true, msg: 'Registered Successfully!!!' });
        }
        if (ref_type == null || ref_type == "null" || !ref_type) {
          var registerUrl = "http://api.msg91.com/api/v2/sendsms?message=Hey " + req.body.name + ", download the tail app now to view veterinary clinics around you, manage your pets, add vaccination reminders and upload their health records. https://goo.gl/z98dPe&authkey=247735AbnQRuVrmSuO5befbdb7&mobiles=" + mobile_no + "&route=4&sender=TAILAP&country=91";
          http.get(registerUrl);
          res.json({ success: true, msg: 'Registered Successfully!!!' });
        }
      });
    } else {
      res.send({ success: false, msg: 'Already Registered!!!' });
    }
  });
});

module.exports = router;
