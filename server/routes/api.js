const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');
const config = require('../config/database');
const db = require('../config/connections');
const colors = require('colors');
const cors = require('cors')
router.use(cors())
router.all('*', cors());

let aws = require("@aws-sdk/client-ses");
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');


const BUCKET_NAME = 'prescriptionpdf-072325946506';
const IAM_USER_KEY = 'AKIARBVXWLSFCDRA6XCV';
const IAM_USER_SECRET = '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';
var options = {
    phantomPath: "./node_modules/phantomjs-prebuilt/bin/phantomjs",
}
process.env.AWS_ACCESS_KEY_ID = 'AKIARBVXWLSFCDRA6XCV'
process.env.AWS_SECRET_ACCESS_KEY = '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'

// var sesTransport = require('nodemailer-ses-transport');
// var smtpPassword = require('aws-smtp-credentials');

const nodemailer = require('nodemailer'),
    path = require('path');
EmailTemplate = require('email-templates').EmailTemplate,
    Promise = require('bluebird');

const http = require('http');
const https = require('https');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// const cron = require("node-cron");
let pdf = require('html-pdf');

const soap = require('./soap');
const tailapp = require('./tailapp');
const careapp = require('./careapp');
const email = require('./email');
const initial = require('./initial');
const settings = require('./settings');
const patient = require('./patient');
const inventory = require('./inventory');
const billing = require('./billing');
const resultupload = require('./resultupload');
const subscription = require('./subscription');

var CronJob = require('cron').CronJob;

var s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
});

var job = new CronJob({
    cronTime: '00 55 08 * * 0-6',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/sms_remainder';
        // var reminderUrl = 'https://staging.animapp.care/api/sms_remainder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();

var careTodayNotification = new CronJob({
    cronTime: '00 00 09 * * 0-6',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/today/care_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/care_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
careTodayNotification.start();
/////////////////////////////TEST RUN CHECK FOR 3 MONTHS...... /////////////////////////////////////////////////////////
var carebeforestock3Notification = new CronJob({
    // cronTime: '0 */5 * * * *',
    cronTime: '20 9 * * *',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/before90/expiry_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/care_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
carebeforestock3Notification.start();

////////////////////////////////////*********TEST RUN CHECK FOR 2 MONTHS ************//////////////////////////////////////////
var carebeforestock2Notification = new CronJob({
    // cronTime: '0 */5 * * * *',
    cronTime: '30 9 * * *',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/before60/expiry_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/care_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
carebeforestock2Notification.start()

////////////////////////////////////******TEST RUN CHECK FOR 1 MONTH*********/////////////////////////////////////
var carebeforestock1Notification = new CronJob({
    // cronTime: '0 */5 * * * *',
    cronTime: '35 9 * * *',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/before30/expiry_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/care_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
carebeforestock1Notification.start()

/////////////////////////////////////*************TEST RUN CHECK FOR 15 DAYS*****************//////////////////////////////////////////////////

var carebeforestock15Notification = new CronJob({
    // cronTime: '0 */5 * * * *',
    cronTime: '40 9 * * *',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/before15/expiry_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/care_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
carebeforestock15Notification.start()

/////////////////////////////////////////////************TEST RUN CHECK FOR 7 DAYS**************//////////////////////////////////////////////////
var carebeforestock7Notification = new CronJob({
    // cronTime: '0 */5 * * * *',
    cronTime: '45 9 * * *',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/before7/expiry_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/care_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
carebeforestock7Notification.start()


///////////////////////////////////////////////////////////////////////////////////////////////////////////


var tailappBeforeNotification = new CronJob({
    cronTime: '00 05 09 * * 0-6',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/before/tail_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/before/tail_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
tailappBeforeNotification.start();

var tailappTodayNotification = new CronJob({
    cronTime: '00 10 09 * * 0-6',
    onTick: function () {
        console.log('data is in');
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
        var reminderUrl = config.apihost + '/api/notification/today/tail_reminder';
        // var reminderUrl = 'https://staging.animapp.care/api/notification/today/tail_reminder';
        https.get(reminderUrl);
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
tailappTodayNotification.start();


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

router.get('/sms_remainder', (req, res) => {
    let current_date = moment().add(1, 'd').format('YYYY-MM-DD');
    console.log(current_date);
    let sql = `(select appointment.date,appointment.time,practice.name as clinic_name,
        user.name as doctor_name,patient.name as patient_name,pet_parent.name as parent_name,
        pet_parent.mobile_no,concat('appointment') as event_type ,pet_parent.player_id
        from appointment 
        left join practice on appointment.practice_id=practice.practice_id 
        left join user on appointment.user_id=user.user_id 
        left join patient on appointment.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id 
        where appointment.date = ?) 
        union 
        (select surgery.date,surgery.time,practice.name as clinic_name,user.name as doctor_name,
        patient.name as patient_name,pet_parent.name as parent_name,pet_parent.mobile_no,
        concat('surgery') as event_type,pet_parent.player_id
        from surgery 
        left join practice on surgery.practice_id=practice.practice_id 
        left join user on surgery.user_id=user.user_id 
        left join patient on surgery.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id 
        where surgery.date = ?) 
        union 
        (select follow_up.date,follow_up.time,practice.name as clinic_name,user.name as doctor_name,
        patient.name as patient_name,pet_parent.name as parent_name,pet_parent.mobile_no,
        concat('follow_up') as event_type ,pet_parent.player_id
        from follow_up
        left join practice on follow_up.practice_id=practice.practice_id 
        left join user on follow_up.user_id=user.user_id 
        left join patient on follow_up.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id 
        where follow_up.date = ?) 
        union 
        (select preventive_reminder.date,preventive_reminder.time,practice.name as clinic_name,
        user.name as doctor_name,patient.name as patient_name,pet_parent.name as parent_name,
        pet_parent.mobile_no,concat('preventive_care') as event_type,pet_parent.player_id
        from preventive_reminder 
        left join practice on preventive_reminder.practice_id=practice.practice_id 
        left join user on preventive_reminder.user_id=user.user_id 
        left join patient on preventive_reminder.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id
        where preventive_reminder.date = ?)`;
    let query = db.query(sql, [current_date, current_date, current_date, current_date], (err, result) => {
        if (result.length > 0) {
            result.forEach(element => {
                console.log(element);
                if (element.clinic_name) {
                    if (element.event_type == 'preventive_care') {
                        var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + element.mobile_no + '&tempid=70924&F1=' + element.parent_name + '&F2=' + element.patient_name + '&F3=' + (element.clinic_name).slice(0, 30) + '&F4=' + (element.clinic_name).slice(30, (element.clinic_name).length) + '&response=Y';
                        http.get(reminderUrl);
                    } else {
                        //////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
                        // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + element.mobile_no + '&tempid=70015&F1=' + element.parent_name + '&F2=' + element.patient_name + '&F3=' + moment(element.time, 'HH:mm:ss').format('hh:mm A') + '&F4=' + (element.clinic_name).slice(0, 30) + '&F5=' + (element.clinic_name).slice(30, (element.clinic_name).length) + '&response=Y';
                        var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + element.mobile_no +
                            '&message=Hello ' + element.parent_name + ', this is a reminder for your pet ' + element.patient_name + ' appointment for tomorrow at ' + (element.clinic_name).slice(0, 30) + ' at ' + moment(element.time, 'HH:mm:ss').format('hh:mm A') + '. Thank you! - AnimApp'
                        '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161493061842009&response=Y'
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        http.get(reminderUrl);
                    }
                }
            });
            res.send('Welcome to AnimApp API Message');
        }
    });
});

router.get('/notification/today/care_reminder', (req, res) => {
    let current_date = moment().format('YYYY-MM-DD');
    let date = current_date;
    console.log(current_date);
    let sql = `(select appointment.date,appointment.time,practice.name as clinic_name,
        user.name as doctor_name,patient.name as patient_name,pet_parent.name as parent_name,
        pet_parent.mobile_no,concat('appointment') as event_type ,pet_parent.player_id
        from appointment 
        left join practice on appointment.practice_id=practice.practice_id 
        left join user on appointment.user_id=user.user_id 
        left join patient on appointment.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id 
        where appointment.date = ?) 
        union 
        (select surgery.date,surgery.time,practice.name as clinic_name,user.name as doctor_name,
        patient.name as patient_name,pet_parent.name as parent_name,pet_parent.mobile_no,
        concat('surgery') as event_type,pet_parent.player_id
        from surgery 
        left join practice on surgery.practice_id=practice.practice_id 
        left join user on surgery.user_id=user.user_id 
        left join patient on surgery.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id 
        where surgery.date = ?) 
        union 
        (select follow_up.date,follow_up.time,practice.name as clinic_name,user.name as doctor_name,
        patient.name as patient_name,pet_parent.name as parent_name,pet_parent.mobile_no,
        concat('follow_up') as event_type ,pet_parent.player_id
        from follow_up
        left join practice on follow_up.practice_id=practice.practice_id 
        left join user on follow_up.user_id=user.user_id 
        left join patient on follow_up.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id 
        where follow_up.date = ?) 
        union 
        (select preventive_reminder.date,preventive_reminder.time,practice.name as clinic_name,
        user.name as doctor_name,patient.name as patient_name,pet_parent.name as parent_name,
        pet_parent.mobile_no,concat('preventive_care') as event_type,pet_parent.player_id
        from preventive_reminder 
        left join practice on preventive_reminder.practice_id=practice.practice_id 
        left join user on preventive_reminder.user_id=user.user_id 
        left join patient on preventive_reminder.patient_id=patient.patient_id 
        left join pet_parent on patient.pet_parent_id=pet_parent.pet_parent_id
        where preventive_reminder.date = ?)`;
    let query = db.query(sql, [current_date, current_date, current_date, current_date], (err, result) => {
        if (result.length > 0) {
            result.forEach(element => {
                console.log(element);
                if (element.clinic_name) {
                    if (element.event_type == 'preventive_care') {

                        // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=ANMAPP&dest_mobileno=' + element.mobile_no + 
                        // '&tempid=70924&F1=' + element.parent_name + '&F2=' + element.patient_name + '&F3=' + (element.clinic_name).slice(0, 30) + '&F4=' + (element.clinic_name).slice(30, (element.clinic_name).length) + '&response=Y';
                        // http.get(reminderUrl);

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
                                    // console.log("Response:");
                                    // console.log(JSON.parse(data));
                                });
                            });
                            req.on("error", function (e) {
                                // console.log("ERROR:");
                                // console.log(e);
                            });
                            req.write(JSON.stringify(data));
                            req.end();
                        };
                        var message = {
                            app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                            contents: {
                                en: "Hello " + element.parent_name + ", this is a vaccination reminder of your pet " + element.patient_name + "'s appointment for today at " + element.clinic_name + ". Note: Prevention is better than Cure.Thank you!"
                            },
                            include_player_ids: [element.player_id]
                        };
                        sendNotification(message);
                    } else {
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
                                    // console.log("Response:");
                                    // console.log(JSON.parse(data));
                                });
                            });
                            req.on("error", function (e) {
                                // console.log("ERROR:");
                                // console.log(e);
                            });
                            req.write(JSON.stringify(data));
                            req.end();
                        };
                        var message = {
                            app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                            contents: {
                                en: "Hello " + element.parent_name + ", here's a reminder of your pet " + element.patient_name + "'s appointment for today by " + moment(element.time, 'HH:mm:ss').format('hh:mm A') + " at " + element.clinic_name + ".Thank you!"
                            },
                            include_player_ids: [element.player_id]
                        };
                        sendNotification(message);
                    }
                }
            });
            Promise.all(result).then(record => {
                res.send({
                    success: true,
                    msg: `Welcome to AnimApp API Message`
                });
            });
        }
    });
});

router.get('/notification/billing/:pet_parent_id/:patientName/:practice_id/:invoiceNumber/:totalAmount', (req, res) => {
    let pet_parent_id = req.params.pet_parent_id;
    let practice_id = req.params.practice_id;
    let patientName = req.params.patientName;
    let invoiceNumber = req.params.invoiceNumber;
    let totalAmount = req.params.totalAmount;

    let billingNotification = `select * from pet_parent where pet_parent_id = ?`;
    let query = db.query(billingNotification, pet_parent_id, (err, result) => {
        if (err) throw (err);
        let player_id = result[0].player_id;
        let mobile_no = result[0].mobile_no;
        let parentName = result[0].name;

        let practiceselect = `select * from practice where practice_id = ?`;
        let query = db.query(practiceselect, practice_id, (err, result1) => {
            if (err) throw (err);

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
                        // console.log("Response:");
                        // console.log(JSON.parse(data));
                    });
                });
                req.on("error", function (e) {
                    // console.log("ERROR:");
                    // console.log(e);
                });
                req.write(JSON.stringify(data));
                req.end();
            };
            var message = {
                app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                contents: {
                    // en: "Hello " + result[0].name + ", your pet " + patientName + "'s invoice " + invoiceNumber + " has been generated with the amount of Rs." + totalAmount + ".Thank you!"
                    en: "An invoice of Rs." + totalAmount + " has been generated for " + patientName + " by " + result1[0].name + ". View it in the Timeline page. Thank you!"
                },
                include_player_ids: [player_id]
            };
            sendNotification(message);
            if (practice_id == '2' || practice_id == '107' || practice_id == '106') {
                var billingUrl = "http://api.msg91.com/api/v2/sendsms?message=Hey " + parentName + ", thank you for visiting us! Your pet " + patientName + "'s medical record is available on the free tail app. Download now to view. https://goo.gl/z98dPe&authkey=247735AbnQRuVrmSuO5befbdb7&mobiles=" + mobile_no + "&route=4&sender=TAILAP&country=91";
                http.get(billingUrl);
                res.json({ success: true, data: result });
            } else {
                res.json({ success: true, data: result });
            }
        });
    });
});

router.get('/notification/before/tail_reminder', (req, res) => {
    let current_date = moment().add(1, 'd').format('YYYY-MM-DD');
    let date = current_date;
    console.log(current_date);
    let sql = `SELECT patient_record.date, patient_record.time as appointment_time, patient_record.event_type, 
    patient.name as patientName, pet_parent.name as parentName,
    pet_parent.player_id, pet_parent.practice_name
    FROM patient_record
    left join pet_parent on patient_record.pet_parent_id = pet_parent.pet_parent_id
    left join patient on patient_record.patient_id = patient.patient_id
    where patient_record.date = ?`;
    let query = db.query(sql, current_date, (err, result) => {
        console.log(result);
        if (result.length > 0) {
            result.forEach(element => {
                console.log(element);

                // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=ANMAPP&dest_mobileno=' + element.mobile_no + 
                // '&tempid=70924&F1=' + element.parent_name + '&F2=' + element.patient_name + '&F3=' + (element.clinic_name).slice(0, 30) + '&F4=' + (element.clinic_name).slice(30, (element.clinic_name).length) + '&response=Y';
                // http.get(reminderUrl);

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
                            // console.log("Response:");
                            // console.log(JSON.parse(data));
                        });
                    });
                    req.on("error", function (e) {
                        // console.log("ERROR:");
                        // console.log(e);
                    });
                    req.write(JSON.stringify(data));
                    req.end();
                };
                // var message = {
                //     app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                //     contents: {
                //         en: "Hello " + element.parentName + ", this is to reminder for your pet " + element.patientName + "'s appointment is on tomorrow for " + element.event_type + ".Thank you!"
                //     },
                //     include_player_ids: [element.player_id]
                // };
                // sendNotification(message);
                if (element.event_type == 'Vaccination') {
                    var message = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", this is a vaccination reminder of your pet " + element.patientName + "'s appointment for tomorrow at " + element.practice_name + ".Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    var message1 = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", this is a vaccination reminder of your pet " + element.patientName + "'s appointment for tomorrow.Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    if (element.practice_name) {
                        sendNotification(message);
                    } else {
                        sendNotification(message1);
                    }
                } else {
                    var message = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", here's a reminder of your pet " + element.patientName + "'s appointment tomorrow at " + element.appointment_time + " at " + element.practice_name + ".Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    var message1 = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", here's a reminder of your pet " + element.patientName + "'s appointment tomorrow at " + element.appointment_time + ".Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    if (element.practice_name) {
                        sendNotification(message);
                    } else {
                        sendNotification(message1);
                    }
                }
            });
            Promise.all(result).then(record => {
                res.send({
                    success: true,
                    msg: `Welcome to AnimApp API Message`
                });
            });
        } else {
            res.send({
                success: false,
                msg: `Welcome to AnimApp API Message`
            });
        }
    });
});

router.get('/notification/today/tail_reminder', (req, res) => {
    let current_date = moment().format('YYYY-MM-DD');
    let date = current_date;
    console.log(current_date);
    let sql = `SELECT patient_record.date, patient_record.time as appointment_time, patient_record.event_type, 
    patient.name as patientName, pet_parent.name as parentName,
    pet_parent.player_id, pet_parent.practice_name
    FROM patient_record
    left join pet_parent on patient_record.pet_parent_id = pet_parent.pet_parent_id
    left join patient on patient_record.patient_id = patient.patient_id
    where patient_record.date = ?`;
    let query = db.query(sql, current_date, (err, result) => {
        if (result.length > 0) {
            result.forEach(element => {
                console.log(element);

                // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=ANMAPP&dest_mobileno=' + element.mobile_no + 
                // '&tempid=70924&F1=' + element.parent_name + '&F2=' + element.patient_name + '&F3=' + (element.clinic_name).slice(0, 30) + '&F4=' + (element.clinic_name).slice(30, (element.clinic_name).length) + '&response=Y';
                // http.get(reminderUrl);

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
                            // console.log("Response:");
                            // console.log(JSON.parse(data));
                        });
                    });
                    req.on("error", function (e) {
                        // console.log("ERROR:");
                        // console.log(e);
                    });
                    req.write(JSON.stringify(data));
                    req.end();
                };
                if (element.event_type == 'Vaccination') {
                    var message = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", this is a vaccination reminder of your pet " + element.patientName + "'s appointment for today at " + element.practice_name + ".Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    var message1 = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", this is a vaccination reminder of your pet " + element.patientName + "'s appointment for today.Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    if (element.practice_name) {
                        sendNotification(message);
                    } else {
                        sendNotification(message1);
                    }
                } else {
                    var message = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", here's a reminder of your pet " + element.patientName + "'s appointment for today by " + element.appointment_time + " at " + element.practice_name + ".Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    var message1 = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + element.parentName + ", here's a reminder of your pet " + element.patientName + "'s appointment for today by " + element.appointment_time + ".Thank you!"
                        },
                        include_player_ids: [element.player_id]
                    };
                    if (element.practice_name) {
                        sendNotification(message);
                    } else {
                        sendNotification(message1);
                    }
                }
            });
            Promise.all(result).then(record => {
                res.send({
                    success: true,
                    msg: `Welcome to AnimApp API Message`
                });
            });
        }
    });
});

router.get('/', (req, res) => {
    res.send('Welcome to AnimApp API.');
});
router.use('/soap', soap);
router.use('/email', email);
router.use('/initial', initial);
router.use('/settings', settings);
router.use('/patient', patient);
router.use('/inventory', inventory);
router.use('/billing1', billing);
router.use('/result', resultupload);
router.use('/subscription', subscription);
router.use('/tailapp', tailapp);
router.use('/careapp', careapp);


router.post('/login', (req, res) => {
    var token = null;
    var data = req.body;
    data.password = crypto.pbkdf2Sync(data.password, 'this-is-a-text', 100000, 60, 'sha512');
    let sql = 'SELECT * FROM user WHERE email_id=? AND password=?';
    let query = db.query(sql, [data.email_id, data.password], (err, result, fields) => {
        if (err) throw err;
        console.log(result.length);
        if (!result.length) {
            res.json({ msg: 'error' });
        }
        else if (result.length === 1) {
            console.log(result[0].email_verified);
            if (result[0].email_verified == 0) {
                res.json({ success: false, msg: 'Email Not Verified' });
            } else {
                let sqlsub = `SELECT * FROM subscription WHERE user_id=? AND practice_id=? AND state != 'halted' AND state != 'created' ORDER BY id DESC`;
                let query2 = db.query(sqlsub, [result[0].user_id, result[0].practice_id], (err, resultnew, fields) => {
                    if (resultnew.length === 1) {
                        var payload = { user_id: result[0].user_id, role: result[0].role, practice_id: result[0].practice_id, subscription_id: resultnew[0].subscription_id };
                        token = jwt.sign(payload, config.secret, {
                            expiresIn: 604800 //1 week in second
                        });
                        res.json({ success: true, token: token, role: result[0].role, user: { user_id: result[0].user_id, practice_id: result[0].practice_id } });
                    } else {
                        var payload = { user_id: result[0].user_id, role: result[0].role, practice_id: result[0].practice_id };
                        token = jwt.sign(payload, config.secret, {
                            expiresIn: 604800 //1 week in second
                        });
                        let response = null;
                        // checkExistingUser(result[0].user_id, result[0].practice_id).then(existingUser => {
                        //   if (existingUser) {
                        //     res.send({success:true, token: token, user:{user_id:result[0].user_id, practice_id: result[0].practice_id}})
                        //   } else {
                        res.send({ success: false, msg: 'Subscription not done or not active' });
                        //   }
                        // });
                    }
                });
            }
        } else {
            res.json({ msg: 'error' });
        }
    });
});




// before sub starts
// router.post('/login', (req,res) => {
//   var data=req.body;
//   data.password= crypto.pbkdf2Sync(data.password,'this-is-a-text', 100000,60, 'sha512');
//   let sql = 'SELECT * FROM user WHERE email_id=? AND password=?';
//   let query = db.query(sql,[data.email_id,data.password],(err,result, fields) =>{
//     if(err) throw err;
//     console.log(result.length);
//     if(!result.length){
//       res.json({msg:'error'});
//     }
//     else if (result.length === 1){
//       console.log(result[0].email_verified);
//       if(result[0].email_verified == 0){
//         res.json({success:false, msg:'Email Not Verified'});
//       } else {
//         var payload = {user_id: result[0].user_id,role: result[0].role,practice_id: result[0].practice_id};
//         var token = jwt.sign(payload, config.secret, {
//           expiresIn: 604800 //1 week in second
//         });
//         res.json({
//           success:true,
//           token: token,
//         user:{
//           user_id:result[0].user_id,
//           practice_id: result[0].practice_id
//         }});
//       }
// 		} else {
//       res.json({msg:'error'});
//     }
//   });
// });
// before sub starts

router.post('/forgotpassword', (req, res) => {
    var data = req.body;
    console.log(data.email_id.email_id);
    console.log(req.body.link);
    let sql = 'SELECT * FROM user WHERE email_id=?';
    let query = db.query(sql, data.email_id.email_id, (err, result, fields) => {
        if (err) throw err;
        console.log(result.length);
        if (!result.length) {
            res.json({
                msg: 'error'
            });
        }
        else if (result.length === 1) {
            var payload = { user_id: result[0].user_id, role: result[0].role, practice_id: result[0].practice_id, forgotpassword: true };
            var token = jwt.sign(payload, config.secret, {
                expiresIn: 86400 //1 day in second
            });
            let users = [
                {
                    link: req.body.link,
                    username: result[0].name,
                    token: token,
                    email: result[0].email_id
                }
            ];
            console.log(users);
            loadTemplate('forgotpassword', users).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });
        } else {
            res.json({ msg: 'error' });
        }
    });
});


router.post("/logintable", (req, res) => {
    var data = req.body;
    let sql3 = "INSERT INTO login_details set ?";
    let query3 = db.query(sql3, data, function (err, result) {
        if (err) throw err;
        res.json({
            success: true
        });
    });
});

router.post("/logouttable", (req, res) => {
    var data = req.body;
    let sql3 = "INSERT INTO logout_details set ?";
    let query3 = db.query(sql3, data, function (err, result) {
        if (err) throw err;
        res.json({
            success: true
        });
    });
});

router.post("/sessionintable", (req, res) => {
    var data = req.body;
    let sql3 = "INSERT INTO session_in set ?";
    let query3 = db.query(sql3, data, function (err, result) {
        if (err) throw err;
        res.json({
            success: true
        });
    });
});

router.get('/allcliniclist', (req, res) => {
    let fulldetails = [];
    let sql = `SELECT * FROM practice as a left JOIN practice_address as b ON a.practice_id = b.practice_id`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            details: result
        });
    });
});

router.get('/divisioncount/:practice_id/:startDate/:endDate', (req, res) => {
    let practice_id = req.params.practice_id;
    let startDate = req.params.startDate;
    let endDate = req.params.endDate;
    let patient = `select count(*) as count from patient where practice_id = ? and timestamp >= ? and timestamp <= ?`;
    let record = `select count(*) as count from record where practice_id = ? and timestamp >= ? and timestamp <= ?`;
    let invoice = `select count(*) as count from invoice where practice_id = ? and timestamp >= ? and timestamp <= ?`;
    let add_itemstock = `select count(*) as count from add_item left join add_itemstock on add_item.item_id=add_itemstock.item_id where add_item.practice_id = ? and add_itemstock.timestamp >= ? and add_itemstock.timestamp <= ?`;
    let appointment = `select count(*) as count from appointment where practice_id = ? and timestamp >= ? and timestamp <= ?`;
    let query = db.query(patient, [practice_id, startDate, endDate], (err, result) => {
        let patient_count = result[0].count;
        if (err) throw err;
        let query = db.query(record, [practice_id, startDate, endDate], (err, result) => {
            let record_count = result[0].count;
            if (err) throw err;
            let query = db.query(invoice, [practice_id, startDate, endDate], (err, result) => {
                let invoice_count = result[0].count;
                if (err) throw err;
                let query = db.query(add_itemstock, [practice_id, startDate, endDate], (err, result) => {
                    let add_itemstock_count = result[0].count;
                    if (err) throw err;
                    let query = db.query(appointment, [practice_id, startDate, endDate], (err, result) => {
                        let appointment_count = result[0].count;
                        if (err) throw err;
                        res.send({
                            success: true,
                            patient_count: patient_count,
                            record_count: record_count,
                            invoice_count: invoice_count,
                            add_itemstock_count: add_itemstock_count,
                            appointment_count: appointment_count
                        });
                    });
                });
            });
        });
    });
});

router.post("/patient", (req, res) => {
    var data = req.body;
    data.user_id = req.body.user_id;
    data.practice_id = req.body.practice_id;
    let sql = 'SELECT * FROM pet_parent WHERE mobile_no=? AND practice_id = ?';
    let query = db.query(sql, [data.mobile_no, data.practice_id], (err, resultcheck, fields) => {
        if (err) throw err;
        if (!resultcheck.length) {
            data.password = null;
            let sql2 =
                "INSERT INTO pet_parent(name,mobile_no,email_id,password,practice_id,user_id) values(?,?,?,?,?,?)";
            let query2 = db.query(
                sql2,
                [
                    data.name,
                    data.mobile_no,
                    data.email_id,
                    data.password,
                    data.practice_id,
                    data.user_id
                ],
                function (err, result) {
                    if (err) throw err;
                    let sql4 = "SELECT * FROM patient WHERE clinic_id and practice_id = " + data.practice_id;
                    let query4 = db.query(sql4, function (err, result1) {
                        if (result1.length >= 0) {
                            var clinic_id = parseInt(result1.length) + 1;
                            var pet_parent_id = result.insertId;
                            let patientdetails = {
                                name: data.patient.pet_name,
                                sex: data.patient.sex ? data.patient.sex : null,
                                species: data.patient.species ? data.patient.species : null,
                                breed: data.patient.breed ? data.patient.breed : null,
                                age_dob: data.patient.age_dob ? data.patient.age_dob : null,
                                color: data.patient.color ? data.patient.color : null,
                                image: null,
                                microchip_no: null,
                                identify_mark: null,
                                pet_parent_id: pet_parent_id,
                                practice_id: data.practice_id,
                                clinic_id: clinic_id
                            };
                            let sql3 = "INSERT INTO patient set ?";
                            let query3 = db.query(sql3, patientdetails, function (err, result) {
                                res.json({
                                    success: true,
                                    pet_parent_id: pet_parent_id,
                                    patient_id: result.insertId
                                });
                            });
                        }
                    });
                });
        } else {
            res.json({ success: false });
        }
    });
});

router.post("/patientadd/:pet_parent_id", (req, res) => {
    var data = req.body;
    var pet_parent_id = req.params.pet_parent_id;

    let sql2 = "select practice_id from pet_parent where pet_parent_id=" + pet_parent_id;
    let query2 = db.query(sql2, function (err, result2) {
        let sql1 = "select * from patient where clinic_id and practice_id=" + result2[0].practice_id;
        let query1 = db.query(sql1, function (err, result1) {
            if (result1.length >= 0) {
                var clinic_id = parseInt(result1.length) + 1;
                let patientdetails = {
                    name: data.patient.pet_name,
                    sex: data.patient.sex,
                    species: data.patient.species,
                    breed: data.patient.breed,
                    age_dob: data.patient.age_dob,
                    color: data.patient.color,
                    image: null,
                    microchip_no: null,
                    identify_mark: null,
                    pet_parent_id: pet_parent_id,
                    practice_id: result2[0].practice_id,
                    clinic_id: clinic_id
                };
                let sql3 = "INSERT INTO patient set ?";
                let query3 = db.query(sql3, patientdetails, function (err, result) {
                    res.send({
                        pet_parent_id: pet_parent_id,
                        patient_id: result.insertId
                    });
                });
            }
        });
    });
});


router.put("/patient/:pet_parent_id/:patient_id", (req, res) => {

    var pet_parent_id = req.params.pet_parent_id;
    var patient_id = req.params.patient_id;
    var data = req.body;
    let petparentdetails = {
        name: data.name,
        mobile_no: data.mobile_no,
        email_id: data.email_id,
        password: data.password,
    }
    let patientdetails = {
        name: data.patient.pet_name,
        sex: data.patient.sex,
        species: data.patient.species,
        breed: data.patient.breed,
        age_dob: data.patient.age_dob,
        color: data.patient.color
    };
    console.log(data.practice_id);
    console.log(data.mobile_no);
    // let sql = 'SELECT * FROM pet_parent WHERE mobile_no=? AND practice_id = ? AND pet_parent_id=?';
    // let query = db.query(sql,[data.mobile_no,data.practice_id,pet_parent_id],(err,resultcheck, fields) =>{
    let sqlcheck = 'SELECT * FROM pet_parent WHERE pet_parent_id=?';
    let query = db.query(sqlcheck, pet_parent_id, (err, resultmaincheck, fields) => {
        if (err) throw err;
        if (resultmaincheck[0].mobile_no != data.mobile_no) {
            let sqlmobile = 'SELECT * FROM pet_parent WHERE mobile_no=? AND practice_id = ?';
            let query = db.query(sqlmobile, [data.mobile_no, data.practice_id], (err, resultcheck, fields) => {
                if (err) throw err;
                console.log('Checking Mobile Number');
                console.log(resultcheck.length);
                if (!resultcheck.length) {
                    let sql2 = "UPDATE pet_parent SET ? WHERE pet_parent_id=?";
                    let query2 = db.query(sql2, [petparentdetails, pet_parent_id], (err, result, fields) => {
                        if (err) throw err;

                        let sql3 = "UPDATE patient set ? where patient_id=?";
                        let query3 = db.query(sql3, [patientdetails, patient_id], (err, data, fields) => {
                            res.send({
                                success: true,
                                pet_parent_id: pet_parent_id,
                                patient_id: patient_id
                            });
                        });
                    });
                } else {
                    res.json({
                        success: false,
                        msg: 'Mobile Number already exists'
                    });
                }
            });
        } else {
            console.log('Mobile Number Not changed');
            let sql2 = "UPDATE pet_parent SET ? WHERE pet_parent_id=?";
            let query2 = db.query(sql2, [petparentdetails, pet_parent_id], (err, result, fields) => {
                if (err) throw err;
                let sql3 = "UPDATE patient set ? where patient_id=?";
                let query3 = db.query(sql3, [patientdetails, patient_id], (err, data, fields) => {
                    res.send({
                        success: true,
                        pet_parent_id: pet_parent_id,
                        patient_id: patient_id
                    });
                });
            });
        }
    });
});



router.get('/patientlist/:practice_id/:first/:rows', (req, res) => {
    var sql1 = "select * from practice where practice_id=" + req.params.practice_id;
    var query1 = db.query(sql1, (err, total1) => {

        var first = parseInt(req.params.first, 10);
        var rows = parseInt(req.params.rows, 10);
        console.log('first', first, 'row', rows);
        var practice_id = req.params.practice_id;
        var total = 0;
        var start = null;
        var end = null;
        var totalSql = "SELECT count(inside.pet_parent_id) AS total FROM ((SELECT pet_parent_id FROM pet_parent WHERE practice_id=?) UNION (SELECT pet_parent_id FROM pet_parent_practice WHERE practice_id=? AND active=1)) as inside";

        var preSql = `SELECT inside.pet_parent_id FROM ((SELECT pet_parent_id FROM pet_parent WHERE practice_id = ?) UNION (SELECT pet_parent_id FROM pet_parent_practice WHERE practice_id = ? AND active=1)) as inside ORDER BY inside.pet_parent_id DESC LIMIT ?, ?`;

        var sql = `SELECT un.pet_parent_id,un.name,un.practice_id,un.user_id,un.mobile_no,un.email_id,un.patient_id,un.pet_name,un.age_dob,un.clinic_id,un.species,un.breed,un.sex,un.color,un.status,un.wag_status FROM
    ((select a.pet_parent_id,a.name,a.practice_id,a.user_id,a.mobile_no,a.email_id,b.patient_id,b.name as pet_name,b.age_dob,b.clinic_id,b.species,b.breed,b.sex,b.color,b.status,b.wag_status FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id WHERE a.practice_id= ?  AND a.pet_parent_id >= ? AND a.pet_parent_id <= ? AND b.status IS NULL AND (b.wag_status IS NULL or b.wag_status='Accepted'))
    UNION
    (select a.pet_parent_id,a.name,a.practice_id,a.user_id,a.mobile_no,a.email_id,b.patient_id,b.name as pet_name,b.age_dob,b.clinic_id,b.species,b.breed,b.sex,b.color,b.status,b.wag_status FROM pet_parent_practice d INNER JOIN pet_parent a ON d.pet_parent_id = a.pet_parent_id INNER JOIN patient b ON d.pet_parent_id = b.pet_parent_id WHERE d.practice_id = ? AND d.pet_parent_id >= ? AND d.pet_parent_id <= ? AND d.active = 1 AND (b.wag_status IS NULL or b.wag_status='Accepted'))) as un
    ORDER BY un.pet_parent_id DESC`;


        var result = [];
        var query = db.query(totalSql, [practice_id, practice_id], (err, total) => {
            if (err) throw err;
            total = total[0].total;
            console.log(total);
            db.query(preSql, [practice_id, practice_id, first, rows], (err, preSqlResult) => {
                if (err) throw err;
                console.log('***: ', preSqlResult);
                if (preSqlResult[0]) {
                    if (preSqlResult[0].pet_parent_id != preSqlResult[preSqlResult.length - 1].pet_parent_id) {
                        end = preSqlResult[0].pet_parent_id;
                        start = preSqlResult[preSqlResult.length - 1].pet_parent_id
                    } else {
                        end = start = preSqlResult[0].pet_parent_id;
                    }
                }
                console.log('###: ', start, end);
                db.query(sql, [practice_id, start, end, practice_id, start, end], (err, data) => {
                    if (err) throw err;
                    if (data.length == 0) {
                        res.json({ msg: 'null' });
                    } else {
                        result.push({
                            pet_parent_id: data[0].pet_parent_id,
                            practice_id: data[0].practice_id,
                            user_id: data[0].user_id,
                            name: data[0].name,
                            // mobile_no: "+"+total1[0].country_code+" "+data[0].mobile_no,
                            mobile_no: data[0].mobile_no,
                            country_code: total1[0].country_code,
                            email_id: data[0].email_id,
                            pets: [
                                {
                                    patient_id: data[0].patient_id,
                                    pet_name: data[0].pet_name,
                                    age_dob: data[0].age_dob,
                                    species: data[0].species,
                                    breed: data[0].breed,
                                    sex: data[0].sex,
                                    color: data[0].color,
                                    clinic_id: total1[0].clinic_id_name + '-' + data[0].clinic_id
                                }
                            ]
                        });

                        for (var i = 1; i < data.length; i++) {
                            if (data[i].pet_parent_id == data[i - 1].pet_parent_id) {
                                for (var j = 0; j < result.length; j++) {
                                    if (result[j].pet_parent_id == data[i].pet_parent_id) {
                                        result[j].pets.push({
                                            patient_id: data[i].patient_id,
                                            pet_name: data[i].pet_name,
                                            age_dob: data[i].age_dob,
                                            species: data[i].species,
                                            breed: data[i].breed,
                                            sex: data[i].sex,
                                            color: data[i].color,
                                            clinic_id: total1[0].clinic_id_name + '-' + data[i].clinic_id
                                        });
                                    }
                                }
                            } else {
                                var pet_parent_id = data[i].pet_parent_id;
                                var practice_id = data[i].practice_id;
                                var user_id = data[i].user_id;
                                var name = data[i].name;
                                // var mobile_no = "+"+total1[0].country_code+" "+data[i].mobile_no;
                                var mobile_no = data[i].mobile_no;
                                var country_code = total1[0].country_code;
                                var email_id = data[i].email_id;
                                var temp = {
                                    patient_id: data[i].patient_id,
                                    pet_name: data[i].pet_name,
                                    age_dob: data[i].age_dob,
                                    species: data[i].species,
                                    breed: data[i].breed,
                                    sex: data[i].sex,
                                    color: data[i].color,
                                    clinic_id: total1[0].clinic_id_name + '-' + data[i].clinic_id
                                };
                                var pets = [];
                                pets.push(temp);
                                result.push({ pet_parent_id: pet_parent_id, practice_id: practice_id, user_id: user_id, name: name, mobile_no: mobile_no, country_code: country_code, email_id: email_id, pets: pets });
                            }
                        }
                        console.log("result+++++++++++++++++++++++++++++++++++++++++++++++++++++++", result.length);
                        // console.log("pets+++++++++++++++++++++++++++++++++++++++++++++++++++++++", pets.length);
                        // console.log("data+++++++++++++++++++++++++++++++++++++++++++++++++++++++", data.length);
                        // console.log("total++++++++++++++++++++++++++++++++++++++++", total1);
                        // console.log("total++++++++++++++++++++++++++++++++++++++++", total);
                        res.json({ data: result, total: total });
                    }
                });
            });
        });
    });
});

// router.get('/patientlist/:practice_id/:first/:rows', (req, res) => {
//   var sql1 = "select * from practice where practice_id=" + req.params.practice_id;
//   var query1 = db.query(sql1, (err, total1) => {

//     var first = parseInt(req.params.first, 10);
//     var rows = parseInt(req.params.rows, 10);
//     var practice_id = req.params.practice_id;
//     var total = 0;
//     var start = null;
//     var end = null;
//     var totalSql = "SELECT count(inside.pet_parent_id) AS total FROM ((SELECT pet_parent_id FROM pet_parent WHERE practice_id=?) UNION (SELECT pet_parent_id FROM pet_parent_practice WHERE practice_id=? AND active=1)) as inside";

//     var preSql = `SELECT inside.pet_parent_id FROM ((SELECT pet_parent_id FROM pet_parent WHERE practice_id = ?) UNION (SELECT pet_parent_id FROM pet_parent_practice WHERE practice_id = ? AND active=1)) as inside ORDER BY inside.pet_parent_id DESC LIMIT ?, ?`;

//     var sql = `SELECT un.pet_parent_id,un.name,un.practice_id,un.user_id,un.mobile_no,un.email_id,un.patient_id,un.pet_name,un.age_dob,un.clinic_id,un.species,un.breed,un.sex,un.color FROM
//     ((select a.pet_parent_id,a.name,a.practice_id,a.user_id,a.mobile_no,a.email_id,b.patient_id,b.name as pet_name,b.age_dob,b.clinic_id,b.species,b.breed,b.sex,b.color FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id WHERE a.practice_id= ?  AND a.pet_parent_id >= ? AND a.pet_parent_id <= ? AND b.status IS NULL)
//     UNION
//     (select a.pet_parent_id,a.name,a.practice_id,a.user_id,a.mobile_no,a.email_id,b.patient_id,b.name as pet_name,b.age_dob,b.clinic_id,b.species,b.breed,b.sex,b.color FROM pet_parent_practice d INNER JOIN pet_parent a ON d.pet_parent_id = a.pet_parent_id INNER JOIN patient b ON d.pet_parent_id = b.pet_parent_id WHERE d.practice_id = ? AND d.pet_parent_id >= ? AND d.pet_parent_id <= ? AND d.active = 1)) as un
//     ORDER BY un.pet_parent_id DESC`;


//     var result = [];
//     var query = db.query(totalSql, [practice_id, practice_id], (err, total) => {
//       if (err) throw err;
//       total = total[0].total;
//       console.log(total);
//       db.query(preSql, [practice_id, practice_id, first, rows], (err, preSqlResult) => {
//         if (err) throw err;
//         console.log('***: ', preSqlResult);
//         if (preSqlResult[0]) {
//           if (preSqlResult[0].pet_parent_id != preSqlResult[preSqlResult.length - 1].pet_parent_id) {
//             end = preSqlResult[0].pet_parent_id;
//             start = preSqlResult[preSqlResult.length - 1].pet_parent_id
//           } else {
//             end = start = preSqlResult[0].pet_parent_id;
//           }
//         }
//         console.log('###: ', start, end);
//         db.query(sql, [practice_id, start, end, practice_id, start, end], (err, data) => {
//           if (err) throw err;
//           if (data.length == 0) {
//             res.json({
//               msg: 'null'
//             });
//           } else {
//             result.push({
//               pet_parent_id: data[0].pet_parent_id,
//               practice_id: data[0].practice_id,
//               user_id: data[0].user_id,
//               name: data[0].name,
//               mobile_no: data[0].mobile_no,
//               email_id: data[0].email_id,
//               pets: [{
//                 patient_id: data[0].patient_id,
//                 pet_name: data[0].pet_name,
//                 age_dob: data[0].age_dob,
//                 species: data[0].species,
//                 breed: data[0].breed,
//                 sex: data[0].sex,
//                 color: data[0].color,
//                 clinic_id: total1[0].clinic_id_name + '-' + data[0].clinic_id
//               }]
//             });

//             for (var i = 1; i < data.length; i++) {
//               if (data[i].pet_parent_id == data[i - 1].pet_parent_id) {
//                 for (var j = 0; j < result.length; j++) {
//                   if (result[j].pet_parent_id == data[i].pet_parent_id) {
//                     result[j].pets.push({
//                       patient_id: data[i].patient_id,
//                       pet_name: data[i].pet_name,
//                       age_dob: data[i].age_dob,
//                       species: data[i].species,
//                       breed: data[i].breed,
//                       sex: data[i].sex,
//                       color: data[i].color,
//                       clinic_id: total1[0].clinic_id_name + '-' + data[i].clinic_id
//                     });
//                   }
//                 }
//               } else {
//                 var pet_parent_id = data[i].pet_parent_id;
//                 var practice_id = data[i].practice_id;
//                 var user_id = data[i].user_id;
//                 var name = data[i].name;
//                 var mobile_no = data[i].mobile_no;
//                 var email_id = data[i].email_id;
//                 var temp = {
//                   patient_id: data[i].patient_id,
//                   pet_name: data[i].pet_name,
//                   age_dob: data[i].age_dob,
//                   species: data[i].species,
//                   breed: data[i].breed,
//                   sex: data[i].sex,
//                   color: data[i].color,
//                   clinic_id: total1[0].clinic_id_name + '-' + data[i].clinic_id
//                 };
//                 var pets = [];
//                 pets.push(temp);
//                 result.push({
//                   pet_parent_id: pet_parent_id,
//                   practice_id: practice_id,
//                   user_id: user_id,
//                   name: name,
//                   mobile_no: mobile_no,
//                   email_id: email_id,
//                   pets: pets
//                 });
//               }
//             }
//             console.log("result+++++++++++++++++++++++++++++++++++++++++++++++++++++++", result.length);
//             console.log("pets+++++++++++++++++++++++++++++++++++++++++++++++++++++++", pets.length);
//             console.log("data+++++++++++++++++++++++++++++++++++++++++++++++++++++++", data.length);
//             console.log("total++++++++++++++++++++++++++++++++++++++++", total1);
//             res.json({
//               data: result,
//               total: total
//             });
//           }
//         });
//       });
//     });
//   });
// });


// router.get('/patientlist/:practice_id/:first/:rows',(req,res)=>{
//     var first = parseInt(req.params.first, 10);
//     var rows = parseInt(req.params.rows, 10);
//     var practice_id = req.params.practice_id;
//     var total = 0;
//     var start = null;
//     var end = null;
//     var totalSql="SELECT COUNT(pet_parent_id) AS total FROM pet_parent WHERE practice_id=?";
//     var preSql=`SELECT pet_parent_id FROM pet_parent WHERE practice_id = ? ORDER BY pet_parent_id DESC LIMIT ?, ?`;
//     var sql="select a.pet_parent_id,a.name,a.practice_id,a.user_id,a.mobile_no,a.email_id,b.patient_id,b.name as pet_name,b.age_dob,b.species,b.breed,b.sex,b.color FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id WHERE a.practice_id=? AND a.pet_parent_id >= ? AND a.pet_parent_id <= ? AND b.status IS NULL ORDER BY b.pet_parent_id DESC";

//     var result = [];
//     var query=db.query(totalSql, practice_id, (err, total) => {
//       if (err) throw err;
//       total = total[0].total;
//       db.query(preSql, [practice_id, first, rows], (err, preSqlResult) => {
//         if (err) throw err;
//         console.log('***: ', preSqlResult);
//         if (preSqlResult[0]) {
//           if (preSqlResult[0].pet_parent_id != preSqlResult[preSqlResult.length - 1].pet_parent_id) {
//             end = preSqlResult[0].pet_parent_id;
//             start =  preSqlResult[preSqlResult.length - 1].pet_parent_id
//           } else {
//             end = start = preSqlResult[0].pet_parent_id;
//           }
//         }
//         console.log('###: ', start, end);
//         db.query(sql, [practice_id, start, end], (err, data) => {
//           if (err) throw err;
//           if(data.length == 0){
//             res.json({msg:'null'});
//           }else{
//           result.push({
//             pet_parent_id:data[0].pet_parent_id,
//             practice_id:data[0].practice_id,
//             user_id:data[0].user_id,
//             name: data[0].name,
//             mobile_no: data[0].mobile_no,
//             email_id: data[0].email_id,
//             pets: [
//               {
//                 patient_id:data[0].patient_id,
//                 pet_name: data[0].pet_name,
//                 age_dob: data[0].age_dob,
//                 species: data[0].species,
//                 breed: data[0].breed,
//                 sex: data[0].sex,
//                 color: data[0].color
//               }
//           ]});

//           for(var i = 1; i < data.length; i++){
//             if(data[i].pet_parent_id == data[i-1].pet_parent_id){
//               for(var j = 0; j < result.length; j++){
//                 if(result[j].pet_parent_id == data[i].pet_parent_id){
//                   result[j].pets.push({
//                     patient_id:data[i].patient_id,
//                     pet_name: data[i].pet_name,
//                     age_dob: data[i].age_dob,
//                     species: data[i].species,
//                     breed: data[i].breed,
//                     sex: data[i].sex,
//                     color: data[i].color
//                   });
//                 }
//               }
//             } else {
//               var pet_parent_id=data[i].pet_parent_id;
//               var practice_id=data[i].practice_id;
//               var user_id=data[i].user_id;
//               var name = data[i].name;
//               var mobile_no = data[i].mobile_no;
//               var email_id = data[i].email_id;
//               var temp = {
//                 patient_id: data[i].patient_id,
//                 pet_name: data[i].pet_name,
//                 age_dob: data[i].age_dob,
//                 species: data[i].species,
//                 breed: data[i].breed,
//                 sex: data[i].sex,
//                 color: data[i].color
//               };
//               var pets = [];
//               pets.push(temp);
//               result.push({pet_parent_id: pet_parent_id, practice_id: practice_id, user_id: user_id, name: name, mobile_no: mobile_no, email_id: email_id, pets: pets});
//             }
//           }
//           res.json({data: result, total: total});
//         }
//         });
//       });
//     });
// });


router.delete("/patientlist/:patient_id", (req, res) => {
    var patient_id = req.params.patient_id;
    let sql = "UPDATE patient SET status = ? WHERE patient_id = ?";
    let deleteAppointment = 'DELETE FROM appointment WHERE patient_id = ?';
    let deleteSurgery = 'DELETE FROM surgery WHERE patient_id = ?';
    let deleteRemainder = 'DELETE FROM preventive_reminder WHERE patient_id = ?';
    let deleteFollowUp = 'DELETE FROM follow_up WHERE patient_id = ?';
    let query = db.query(sql, ['deleted', patient_id], (err, result) => {
        if (err) throw err;
        let query = db.query(deleteAppointment, patient_id, (err, result) => {
            if (err) throw err;
            let query = db.query(deleteSurgery, patient_id, (err, result) => {
                if (err) throw err;
                let query = db.query(deleteRemainder, patient_id, (err, result) => {
                    if (err) throw err;
                    let query = db.query(deleteFollowUp, patient_id, (err, result) => {
                        if (err) throw err;
                        res.sendStatus(200);
                    });
                });
            });
        });
    });
});


router.get("/patientdetails/:id", (req, res) => {
    var patient_id = req.params.id;
    let sql = "SELECT * FROM patient WHERE patient_id=? AND STATUS IS NULL";
    db.query(sql, patient_id, (err, result) => {
        if (err) throw err;
        var patient = {
            patient_id: result[0].patient_id,
            pet_name: result[0].name,
            age_dob: result[0].age_dob,
            species: result[0].species,
            breed: result[0].breed,
            sex: result[0].sex,
            color: result[0].color
        };
        var pet_parent_id = result[0].pet_parent_id;
        // let sql = "SELECT * FROM pet_parent WHERE pet_parent_id=?";
        let sql = "SELECT a.*,b.country_code FROM pet_parent as a left join practice as b on a.practice_id=b.practice_id   WHERE pet_parent_id=?";
        db.query(sql, pet_parent_id, (err, result2) => {
            if (err) throw err;

            // to set mobile_no with country code to display in sidebar in practice dashboard
            // result2[0].mobile_no = "+"+result2[0].country_code+" "+result2[0].mobile_no;

            let sql = "SELECT name as pet_name, age_dob, breed, color, patient_id, sex, species FROM patient WHERE pet_parent_id=? AND STATUS IS NULL";
            db.query(sql, pet_parent_id, (err, result3) => {
                if (err) throw err;
                var pet_parent = result2[0];
                pet_parent['pets'] = result3;
                res.send({
                    success: true,
                    patient: patient,
                    pet_parent: pet_parent
                });
            });
        });
    });
});



router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send("authorized");
});



router.get('/symptomslist/:symptom', (req, res) => {
    var array = [];
    temp = req.params.symptom;
    let sql = 'SELECT symptoms FROM symptoms_subjective WHERE symptoms LIKE ?';
    let query = db.query(sql, '%' + temp + '%', (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json({ msg: 'No Symptoms Matched' });
        }
        else {
            for (var i = 0; i < data.length; i++) {
                array.push(data[i].symptoms);
            }
            res.json(array);
        };
    });
});

router.get('/patient_clinic_id/:patient_id', (req, res) => {
    patient_id = req.params.patient_id;
    let sql = "select concat(practice.clinic_id_name,'-',patient.clinic_id) as patient_clinic_id from patient left join practice on practice.practice_id =patient.practice_id where patient.patient_id=" + patient_id;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length) {
            res.json(result);
        }
        else {
            res.json(result);
        };
    });
});

router.get('/prescription/medname/:practice_id/:user_id/:text', (req, res) => {
    var practice_id = req.params.practice_id;
    var user_id = req.params.user_id;
    var text = req.params.text;
    console.log('medname api called for text: ', text);
    let sql = `SELECT DISTINCT(b.med_name), b.prefix
            FROM prescription AS a INNER JOIN pres_meds AS b ON a.prescription_id = b.prescription_id
            WHERE a.practice_id = ? AND a.user_id = ? AND b.med_name LIKE ?`;
    let query = db.query(sql, [practice_id, user_id, '%' + text + '%'], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});


router.post('/symptomslist/:practice_id', (req, res) => {
    var array = [];
    var practice_id = req.params.practice_id;
    temp = req.body.symptom;
    let sql = '(SELECT symptoms FROM symptoms_subjective WHERE symptoms LIKE ? AND practice_id IS NULL) UNION (SELECT symptoms FROM symptoms_subjective WHERE symptoms LIKE ? AND practice_id = ?)';
    let query = db.query(sql, ['%' + temp + '%', '%' + temp + '%', practice_id], (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            array.push('NoMessageAdded');
            res.json(array);
        }
        else {
            for (var i = 0; i < data.length; i++) {
                array.push(data[i].symptoms);
            }
            res.json(array);
        };
    });
});


router.post('/specieslist', (req, res) => {
    console.log(res);
    var array = [];
    temp = req.body.symptom;
    let sql = 'SELECT species FROM species WHERE species LIKE ?';
    let query = db.query(sql, '%' + temp + '%', (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json({ msg: 'No Symptoms Matched' });
        }
        else {
            for (var i = 0; i < data.length; i++) {
                array.push(data[i].symptoms);
            }
            res.json(array);
        };
    });
});

router.get("/specieslist", (req, res, next) => {
    // passport.authenticate('jwt', function(err, user, info) {
    var sql = "SELECT * FROM species";
    var query = db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    });
    // })(req, res, next);
});

router.get("/breedslist/:species_id/:practice_id", (req, res) => {
    console.log('breedslist api called:'.red);
    var query = req.query.query;
    var species_id = req.params.species_id;
    var practice_id = req.params.practice_id;
    var exactMatch = req.query.exactMatch;
    var insertSql = "INSERT INTO breeds SET ?";
    console.log('exactMatch'.red, colors.green(exactMatch), colors.blue(query));
    let sql;
    let paramArray;
    if (query) {
        sql = `(SELECT breed FROM breeds WHERE species_id=? AND breed LIKE ? AND practice_id IS NULL)
              UNION
              (SELECT breed FROM breeds WHERE species_id=? AND breed LIKE ? AND practice_id=?)`;
        paramArray = [species_id, '%' + query + '%', species_id, '%' + query + '%', practice_id];
    } else if (exactMatch) {
        sql = `(SELECT breed FROM breeds WHERE species_id=? AND breed=? AND practice_id IS NULL)
              UNION
              (SELECT breed FROM breeds WHERE species_id=? AND breed=? AND practice_id=?)`;
        paramArray = [species_id, query, species_id, query, practice_id];
    } else {
        sql = `SELECT breed FROM breeds WHERE species_id=? AND practice_id IS NULL
              UNION
              (SELECT breed FROM breeds WHERE species_id=? AND practice_id=?)`;
        paramArray = [species_id, species_id, practice_id];
    }
    db.query(sql, paramArray, (err, data, fields) => {
        if (err) throw err;
        if (exactMatch) {
            data.length ? res.json({ success: true }) :
                db.query(insertSql, { breed: query, species_id: species_id, practice_id: practice_id }, (err, data, fields) => {
                    if (err) throw err;
                    res.status(200).send({ success: true });
                });
        } else {
            res.json(data.map(item => item = item.breed));
        }
    });
});

router.post("/breedslist", (req, res) => {
    console.log(req.body);
    var sql = "INSERT INTO breeds SET ?";
    db.query(sql, req.body, (err, data, fields) => {
        if (err) throw err;
        res.status(200).send({ success: true });
    });
});

router.post('/assessmentlistadd', (req, res) => {
    var assessment = req.body;
    let sql = "INSERT INTO assessment_dropdown SET ?";
    let query = db.query(sql, assessment, (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.post('/assessmentlist/:practice_id', (req, res) => {
    var array = [];
    var practice_id = req.params.practice_id;
    temp = req.body.assessment;
    let sql = `(SELECT assessment FROM assessment_dropdown WHERE assessment LIKE ? AND practice_id IS NULL)
  UNION (SELECT assessment FROM assessment_dropdown WHERE assessment LIKE ? AND practice_id = ?)`;
    let query = db.query(sql, ['%' + temp + '%', '%' + temp + '%', practice_id], (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            array.push('NoMessageAdded');
            res.json(array);
        }
        else {
            for (var i = 0; i < data.length; i++) {
                array.push(data[i].assessment);
            }
            res.json(array);
        };
    });
});

router.get('/assessmentlist/:assess', (req, res) => {
    var array = [];
    temp = req.params.assess;
    let sql = 'SELECT assessment FROM assessment_dropdown WHERE assessment LIKE ?';
    let query = db.query(sql, '%' + temp + '%', (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json({ msg: 'No Assessment Matched' });
        } else {
            for (var i = 0; i < data.length; i++) {
                array.push(data[i].assessment);
            }
            res.json(array);
        };
    });
});


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


router.delete('/records/deleteduplicates/:practice_id/:user_id', (req, res) => {
    console.log('deleteduplicates called'.red);
    var practice_id = req.params.practice_id;
    var user_id = req.params.user_id;
    let selectSql = `SELECT record_id
                  FROM record
                  WHERE subject_id IS NULL AND objective_id IS NULL
                  AND assess_id IS NULL AND plan_id IS NULL AND
                  prescription_id IS NULL AND preventive_id IS NULL
                  AND practice_id = ? AND user_id = ?`;
    let deleteSql = `DELETE FROM record WHERE record_id = ?`;
    let query = db.query(selectSql, [practice_id, user_id], (err, records) => {
        if (err) throw err;
        console.log(records);
        if (records.length) {
            records.map((item, index) => {
                db.query(deleteSql, [item.record_id], (err, result) => {
                    if (err) throw err;
                    console.log(item.record_id, index);
                    if (index === (records.length - 1)) {
                        console.log('sending status'.green);
                        res.sendStatus(200);
                    }
                });
            });
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/nextschedule', (req, res) => {
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
        });
    });
    var data = req.body;
    var scheduleDetails = {
        preventive_type: data.preventive_type,
        date: data.date,
        time: null,
        user_id: data.user_id,
        practice_id: data.practice_id,
        patient_id: data.patient_id,
        preventive_id: data.preventive_id
    }
    let insertSQL = 'INSERT INTO preventive_reminder set ?';
    let insertQuery = db.query(insertSQL, scheduleDetails, (err, result) => {
        if (err) throw err;
        res.json({
            success: true
        })
    });
});


router.get("/bypassreminder/:preventive_id", (req, res) => {
    var preventive_id = req.params.preventive_id;
    var allRemindersSql = `SELECT DATE(date) as date, reminder_id FROM preventive_reminder WHERE preventive_id = ? AND status IS NULL`;
    var sql = `SELECT COUNT(reminder_id) as count, date, reminder_id FROM preventive_reminder WHERE preventive_id = ? AND status IS NULL`;
    let query = db.query(allRemindersSql, preventive_id, (err, result) => {
        if (err) throw err;
        var allReminders = result.map((reminder, index) => {
            return 'Reminder ' + (index + 1) + moment(reminder.date, 'YYYY-MM-DDTHH:mm:ss.000Z').format(': DD MMM YYYY');
        });
        var allReminderIDs = result.map((reminder) => {
            return { reminder_id: reminder.reminder_id };
        });
        db.query(sql, preventive_id, (err, result) => {
            if (err) throw err;
            console.log('date'.green, result[0].date);
            res.send({
                bypassReminder: result[0].count,
                date: result[0].date,
                reminderId: result[0].reminder_id,
                allReminders: allReminders,
                allReminderIDs: allReminderIDs
            });
        });
    });
});

router.get("/productcatalog/:prodcat", (req, res) => {
    var name = req.params.prodcat;
    var array = [];
    let sql = 'SELECT name FROM procedure_catalog WHERE name LIKE ?';
    let query = db.query(sql, '%' + name + '%', (err, data, fields) => {
        if (err) throw err;
        if (!data.length) {
            res.json({ msg: 'No Catalog Matched' });
        }
        else {
            for (var i = 0; i < data.length; i++) {
                array.push(data[i].name);
            }
            res.json(array);
        };
    });
});


router.post("/nextfollowup", (req, res) => {
    let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
    let clinicSql = `SELECT name as clinic_name FROM practice WHERE practice_id = ?`;
    db.query(selectSql, req.body.patient_id, (err, result) => {
        if (err) throw err;
        var mobileNo = result[0].mobile_no;
        var parentName = result[0].name;
        var petName = result[0].pet_name;
        db.query(clinicSql, req.body.practice_id, (err, result) => {
            if (err) throw err;
            var clinicName = result[0].clinic_name;
            var date = moment(req.body.date).format('DD-MM-YY');
            var time = moment(req.body.time, 'HH:mm:ss').format('hh:mm A');

            ///////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
            // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67942&F1=' + parentName + '&F2=' + petName + '&F3=' + clinicName.slice(0, 30) + '&F4=' + clinicName.slice(30, clinicName.length) + '&F5=' + date + '&F6=' + time + '&response=Y';
            var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                '&message=Hello ' + parentName + ', this is a reminder for your pet ' + petName + ' follow-up appointment at ' + clinicName.slice(0, 30) + ' on ' + date + ' at ' + time + '. Thank you! - AnimApp'
            '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161492996747129&response=Y'
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            http.get(reminderUrl);
        });
    });
    var data = req.body;
    let insertSQL = "INSERT INTO follow_up set ?";
    let insertQuery = db.query(insertSQL, data, (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.post("/appointment", (req, res) => {
    var blockSMS = false;
    req.body.blockSMS ? blockSMS = delete req.body.blockSMS : blockSMS = false;
    if (!blockSMS) {
        let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name,b.player_id FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
        let clinicSql = `SELECT name as clinic_name FROM practice WHERE practice_id = ?`;
        db.query(selectSql, req.body.patient_id, (err, result) => {
            if (err) throw err;
            var mobileNo = result[0].mobile_no;
            var parentName = result[0].name;
            var petName = result[0].pet_name;
            var player_id = result[0].player_id;
            db.query(clinicSql, req.body.practice_id, (err, result) => {
                if (err) throw err;
                var clinicName = result[0].clinic_name;
                var date = moment(req.body.date).format('DD-MM-YY');
                var time = moment(req.body.time, 'HH:mm:ss').format('hh:mm A');
                // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67874&F1=' + parentName + '&F2=' + petName + '&F3=' + clinicName.slice(0, 30) + '&F4=' + clinicName.slice(30, clinicName.length) + '&F5=' + date + '&F6=' + time + '&response=Y';
                var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                    '&message=Hello ' + parentName + ', this is a reminder for your pet ' + petName + ' appointment at ' + clinicName.slice(0, 30) + ' on ' + date + ' at ' + time + '. Thank you! - AnimApp'
                '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161493052762307&response=Y'
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                http.get(reminderUrl);
                if (player_id) {
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
                            en: "Hello " + parentName + ", your pet " + petName + "'s appointment has booked at " + clinicName + " on " + date + " at " + time + ". Thank you! "
                        },
                        include_player_ids: [player_id]
                    };

                    sendNotification(message);
                }

            });
        });
    }
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

router.delete("/appointment/:id/:patient_id/:practice_id", (req, res) => {
    let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
    let clinicSql = `SELECT name as clinic_name, mobile_no as clinic_number FROM practice WHERE practice_id = ?`;
    let eventDetailSql = `SELECT date, time, walkin FROM appointment WHERE appointment_id = ?`;
    db.query(selectSql, req.params.patient_id, (err, result) => {
        if (err) throw err;
        var mobileNo = result[0].mobile_no;
        var parentName = result[0].name;
        var petName = result[0].pet_name;
        db.query(clinicSql, req.params.practice_id, (err, result) => {
            if (err) throw err;
            var clinicName = result[0].clinic_name;
            var clinicNumber = result[0].clinic_number
            db.query(eventDetailSql, req.params.id, (err, result) => {
                if (err) throw err;
                console.log('ssssdthiss', result[0].walkin);
                if (result[0].walkin !== 1) {
                    console.log('inside smmssss chkiiinggg');
                    var date = moment(result[0].date).format('DD-MM-YY');
                    var time = moment(result[0].time, 'HH:mm:ss').format('hh:mm A');
                    ///////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
                    // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67943&F1=' + parentName + '&F2=' + petName + '&F3=' + clinicName.slice(0, 30) + '&F4=' + clinicName.slice(30, clinicName.length) + '&F5=' + date + '&F6=' + time + '&F7=' + clinicNumber + '&response=Y';
                    var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                        '&message=Hello ' + parentName + ', your pet ' + petName + ' appointment at ' + clinicName.slice(0, 30) + ' on ' + date + ' at ' + time + ' has been cancelled. If you would like to reschedule, please contact us at ' + clinicNumber + '. Thank you! AnimApp'
                    '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161492991738779&response=Y'
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    http.get(reminderUrl);
                } else {
                    console.log('outside smmssss chkiiinggg');
                }
                console.log('delete operation: ', result, req.params.id);
                var item_id = req.params.id;
                let sqldelete = `UPDATE appointment SET status = 'deleted' WHERE appointment_id=?`;
                let query = db.query(sqldelete, item_id, (err, result) => {
                    if (err) throw err;
                    res.json({
                        success: true
                    });
                });
            });
        });
    });
});

router.delete("/surgery/:id/:patient_id/:practice_id", (req, res) => {
    let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
    let clinicSql = `SELECT name as clinic_name, mobile_no as clinic_number FROM practice WHERE practice_id = ?`;
    let eventDetailSql = `SELECT date, time FROM surgery WHERE surgery_id = ?`;
    db.query(selectSql, req.params.patient_id, (err, result) => {
        if (err) throw err;
        var mobileNo = result[0].mobile_no;
        var parentName = result[0].name;
        var petName = result[0].pet_name;
        db.query(clinicSql, req.params.practice_id, (err, result) => {
            if (err) throw err;
            var clinicName = result[0].clinic_name;
            var clinicNumber = result[0].clinic_number
            db.query(eventDetailSql, req.params.id, (err, result) => {
                if (err) throw err;
                var date = moment(result[0].date).format('DD-MM-YY');
                var time = moment(result[0].time, 'HH:mm:ss').format('hh:mm A');
                ///////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
                // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67943&F1=' + parentName + '&F2=' + petName + '&F3=' + clinicName.slice(0, 30) + '&F4=' + clinicName.slice(30, clinicName.length) + '&F5=' + date + '&F6=' + time + '&F7=' + clinicNumber + '&response=Y';
                var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                    '&message=Hello ' + parentName + ', your pet ' + petName + ' appointment at ' + clinicName.slice(0, 30) + ' on ' + date + ' at ' + time + ' has been cancelled. If you would like to reschedule, please contact us at ' + clinicNumber + '. Thank you! AnimApp'
                '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161492991738779&response=Y'
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                http.get(reminderUrl);
                var item_id = req.params.id;
                let sqldelete = `UPDATE surgery SET status = 'deleted' WHERE surgery_id=?`;
                let query = db.query(sqldelete, item_id, (err, result) => {
                    if (err) throw err;
                    res.json({
                        success: true
                    });
                });
            });
        });
    });

});

router.delete("/nextfollowup/:id/:patient_id/:practice_id", (req, res) => {
    let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
    let clinicSql = `SELECT name as clinic_name, mobile_no as clinic_number FROM practice WHERE practice_id = ?`;
    let eventDetailSql = `SELECT date, time FROM follow_up WHERE follow_up_id = ?`;
    db.query(selectSql, req.params.patient_id, (err, result) => {
        if (err) throw err;
        var mobileNo = result[0].mobile_no;
        var parentName = result[0].name;
        var petName = result[0].pet_name;
        db.query(clinicSql, req.params.practice_id, (err, result) => {
            if (err) throw err;
            var clinicName = result[0].clinic_name;
            var clinicNumber = result[0].clinic_number
            db.query(eventDetailSql, req.params.id, (err, result) => {
                if (err) throw err;
                var date = moment(result[0].date).format('DD-MM-YY');
                var time = moment(result[0].time, 'HH:mm:ss').format('hh:mm A');
                ///////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
                // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67943&F1=' + parentName + '&F2=' + petName + '&F3=' + clinicName.slice(0, 30) + '&F4=' + clinicName.slice(30, clinicName.length) + '&F5=' + date + '&F6=' + time + '&F7=' + clinicNumber + '&response=Y';
                var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                    '&message=Hello ' + parentName + ', your pet' + petName + ' appointment at ' + clinicName.slice(0, 30) + ' on ' + date + ' at ' + time + ' has been cancelled. If you would like to reschedule, please contact us at ' + clinicNumber + '. Thank you! AnimApp'
                '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161492991738779&response=Y'
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                http.get(reminderUrl);
                var item_id = req.params.id;
                let sqldelete = `UPDATE follow_up SET status = 'deleted' WHERE follow_up_id=?`;
                let query = db.query(sqldelete, item_id, (err, result) => {
                    if (err) throw err;
                    res.json({
                        success: true
                    });
                });
            });
        });
    });

});

router.delete("/nextschedule/:id/:patient_id/:practice_id", (req, res) => {
    let selectSql = `SELECT b.mobile_no, b.name, a.name as pet_name FROM patient as a LEFT OUTER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id WHERE patient_id = ?`;
    let clinicSql = `SELECT name as clinic_name, mobile_no as clinic_number FROM practice WHERE practice_id = ?`;
    let eventDetailSql = `SELECT date FROM preventive_reminder WHERE reminder_id = ?`;
    db.query(selectSql, req.params.patient_id, (err, result) => {
        if (err) throw err;
        var mobileNo = result[0].mobile_no;
        var parentName = result[0].name;
        var petName = result[0].pet_name;
        db.query(clinicSql, req.params.practice_id, (err, result) => {
            if (err) throw err;
            var clinicName = result[0].clinic_name;
            var clinicNumber = result[0].clinic_number;
            db.query(eventDetailSql, req.params.id, (err, result) => {
                if (err) throw err;
                var date = moment(result[0].date).format('DD-MM-YY');
                var time = 'NA';
                ///////////////////////////SMS TEMPLATE CHANGES/////////////////////////////////////////////////////////
                // var reminderUrl = 'http://123.63.33.43/blank/sms/user/urlsmstemp.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo + '&tempid=67943&F1=' + parentName + '&F2=' + petName + '&F3=' + clinicName.slice(0, 30) + '&F4=' + clinicName.slice(30, clinicName.length) + '&F5=' + date + '&F6=' + time + '&F7=' + clinicNumber + '&response=Y';
                var reminderUrl = 'http://www.smsjust.com/blank/sms/user/urlsms.php?username=fuchsia&pass=fuchsia@@321&senderid=AnimAp&dest_mobileno=' + mobileNo +
                    '&message=Hello ' + parentName + ', your pet ' + petName + ' appointment at ' + clinicName.slice(0, 30) + ' on ' + date + ' at ' + time + ' has been cancelled. If you would like to reschedule, please contact us at ' + clinicNumber + '. Thank you! AnimApp'
                '&dltentityid=1201159472839835654&tmid=1602100000000004471&dltheaderid=1205159704163141862&dlttempid=1207161492991738779&response=Y'
                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                http.get(reminderUrl);
                var item_id = req.params.id;
                let sqldelete = `UPDATE preventive_reminder SET status = 'deleted' WHERE reminder_id=?`;
                let query = db.query(sqldelete, item_id, (err, result) => {
                    if (err) throw err;
                    res.json({
                        success: true
                    });
                });
            });
        });
    });

});

router.post("/surgery", (req, res) => {
    var data = req.body;
    let insertSQL = "INSERT INTO surgery SET ?";
    let insertQuery = db.query(insertSQL, data, (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.get("/record/:event_id", (req, res) => {
    const event_id = req.params.event_id;
    console.log('associated record for appointment api called', event_id);
    let sql = 'SELECT * FROM record WHERE event_id = ?';
    let query = db.query(sql, event_id, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.get("/record/timing/:record_id", (req, res) => {
    const record_id = req.params.record_id;
    console.log('timing for appointment api called', record_id);
    let sql = 'SELECT event_id, event_type FROM record WHERE record_id = ?';
    let query = db.query(sql, record_id, (err, result) => {
        if (err) throw err;
        if (result.length) {
            const event = result[0];
            if (event.event_type === 'appointment' || event.event_type === 'walkin' || event.event_type === 'new_patient') {
                sql = `SELECT time as starttime, duration FROM appointment WHERE appointment_id = ?`;
            } else if (event.event_type === 'follow_up') {
                sql = `SELECT time as starttime, duration FROM follow_up WHERE follow_up_id = ?`;
            } else if (event.event_type === 'surgery') {
                sql = `SELECT time as starttime, duration FROM surgery WHERE surgery_id = ?`;
            } else if (event.event_type === 'preventive_care') {
                sql = `SELECT time as starttime, '30 minutes' as duration FROM preventive_reminder WHERE reminder_id = ?`;
            } else {
                sql = null;
            }
            console.log('sql = ', sql, event);
            if (sql !== null) {
                db.query(sql, event.event_id, (err, result) => {
                    if (err) throw err;
                    if (result.length) {
                        console.log('duration of event: ', result);
                        res.send({ success: true, startTime: moment(result[0].starttime, 'HH:mm:ss').format('hh:mm A'), endTime: moment(result[0].starttime, 'HH:mm:ss').add(result[0].duration.split(' ')[1], result[0].duration.split(' ')[0]).format('hh:mm A') });
                    } else {
                        console.log('inner false');
                        res.send({ success: false });
                    }
                });
            } else {
                console.log('middle false');
                res.send({ success: false });
            }
        } else {
            console.log('outer false');
            res.send({ success: false });
        }
    });
});

router.post("/event/update/:event_type/:event_id", (req, res) => {
    const event_id = req.params.event_id;
    const event_type = req.params.event_type;
    const data = req.body;
    console.log('associated record for appointment api called', event_id);
    let sql = '';
    if (event_type === 'appointment' || event_type === 'walkin' || event_type === 'new_patient') {
        sql = 'UPDATE appointment SET ? WHERE appointment_id = ?';
    } else if (event_type === 'follow_up') {
        sql = 'UPDATE follow_up SET ? WHERE follow_up_id = ?';
    } else if (event_type === 'surgery') {
        sql = 'UPDATE surgery SET ? WHERE surgery_id = ?';
    } else if (event_type === 'preventive_care') {
        sql = 'UPDATE preventive_reminder SET ? WHERE reminder_id = ?';
    }
    let query = db.query(sql, [data, event_id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.get("/events/:practice_id/:user_id/:startOfWeek/:endOfWeek", (req, res) => {
    var final = {};
    let follow_up_sql;
    let appointment_sql;
    let surgery_sql;
    let follow_up_append = [];
    let appointment_append = [];
    let surgery_append = [];
    let practice_id = req.params.practice_id;
    let user_id = req.params.user_id;
    let startOfWeek = req.params.startOfWeek;
    let endOfWeek = req.params.endOfWeek;
    if (startOfWeek === 'null' && endOfWeek === 'null') {
        startOfWeek = null;
        endOfWeek = null;
    }
    if (startOfWeek && endOfWeek) {
        follow_up_sql = ` SELECT date FROM follow_up WHERE practice_id=? AND user_id=? AND DATE BETWEEN ? AND ? `;
        appointment_sql = ` SELECT date, new_patient, walkin FROM appointment WHERE practice_id=? AND user_id=? AND DATE BETWEEN ? AND ? `;
        surgery_sql = ` SELECT date FROM surgery WHERE practice_id=? AND user_id=? AND DATE BETWEEN ? AND ?`;
        preventive_sql = ` SELECT date FROM preventive_reminder WHERE practice_id=? AND user_id=? AND DATE BETWEEN ? AND ?`;
        follow_up_append = [practice_id, user_id, startOfWeek, endOfWeek];
        appointment_append = [practice_id, user_id, startOfWeek, endOfWeek];
        surgery_append = [practice_id, user_id, startOfWeek, endOfWeek];
        preventive_append = [practice_id, user_id, startOfWeek, endOfWeek];
    } else {
        follow_up_sql = ` SELECT date FROM follow_up WHERE practice_id=? AND user_id=?`;
        appointment_sql = ` SELECT date, new_patient, walkin FROM appointment WHERE practice_id=? AND user_id=?`;
        surgery_sql = ` SELECT date FROM surgery WHERE practice_id=? AND user_id=?`;
        preventive_sql = ` SELECT date FROM preventive_reminder WHERE practice_id=? AND user_id=? `;
        follow_up_append = [practice_id, user_id];
        appointment_append = [practice_id, user_id];
        surgery_append = [practice_id, user_id];
        preventive_append = [practice_id, user_id];
    }

    db.query(follow_up_sql, follow_up_append, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            let key = moment(result[i].date).format("DD-MM-YYYY");
            final[key] = { appointments: 0, walkins: 0, new_patients: 0, follow_ups: 1, surgerys: 0, preventive_cares: 0, total: 1 };
        }
        db.query(appointment_sql, appointment_append, (err, result) => {
            if (err) throw err;
            let walkins = [];
            let new_patients = [];
            let appointments = [];
            result.forEach(data => {
                if (data.new_patient) {
                    new_patients.push(data);
                } else if (data.walkin) {
                    walkins.push(data);
                } else {
                    appointments.push(data);
                }
            });
            for (let i = 0; i < appointments.length; i++) {
                let key = moment(appointments[i].date).format("DD-MM-YYYY");
                if (final[key]) {
                    final[key].appointments += 1;
                    final[key].total += 1;
                } else {
                    final[key] = {
                        appointments: 1,
                        walkins: 0,
                        new_patients: 0,
                        follow_ups: 0,
                        surgerys: 0,
                        preventive_cares: 0,
                        total: 1
                    };
                }
            }
            for (let i = 0; i < walkins.length; i++) {
                let key = moment(walkins[i].date).format("DD-MM-YYYY");
                if (final[key]) {
                    final[key].walkins += 1;
                    final[key].total += 1;
                } else {
                    final[key] = {
                        appointments: 0,
                        walkins: 1,
                        new_patients: 0,
                        follow_ups: 0,
                        surgerys: 0,
                        preventive_cares: 0,
                        total: 1
                    };
                }
            }
            for (let i = 0; i < new_patients.length; i++) {
                let key = moment(new_patients[i].date).format("DD-MM-YYYY");
                if (final[key]) {
                    final[key].new_patients += 1;
                    final[key].total += 1;
                } else {
                    final[key] = {
                        appointments: 0,
                        walkins: 0,
                        new_patients: 1,
                        follow_ups: 0,
                        surgerys: 0,
                        preventive_cares: 0,
                        total: 1
                    };
                }
            }
            db.query(surgery_sql, surgery_append, (err, result) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++) {
                    let key = moment(result[i].date).format("DD-MM-YYYY");
                    if (final[key]) {
                        final[key].surgerys += 1;
                        final[key].total += 1;
                    } else {
                        final[key] = {
                            appointments: 0,
                            walkins: 0,
                            new_patients: 0,
                            follow_ups: 0,
                            surgerys: 1,
                            preventive_cares: 0,
                            total: 1
                        };
                    }
                }
                db.query(preventive_sql, preventive_append, (err, result) => {
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        let key = moment(result[i].date).format("DD-MM-YYYY");
                        if (final[key]) {
                            final[key].preventive_cares += 1;
                            final[key].total += 1;
                        } else {
                            final[key] = {
                                appointments: 0,
                                walkins: 0,
                                new_patients: 0,
                                follow_ups: 0,
                                surgerys: 0,
                                preventive_cares: 1,
                                total: 1
                            };
                        }
                    }
                    res.send(final);
                });
            });
        });
    });
});
/** srikanth */
router.get("/alleventsreception/:practice_id/:startOfWeek/:endOfWeek", (req, res) => {
    var final = {};
    let follow_up_sql;
    let appointment_sql;
    let surgery_sql;
    let follow_up_append = [];
    let appointment_append = [];
    let surgery_append = [];
    let practice_id = req.params.practice_id;
    let startOfWeek = req.params.startOfWeek;
    let endOfWeek = req.params.endOfWeek;
    if (startOfWeek === 'null' && endOfWeek === 'null') {
        startOfWeek = null;
        endOfWeek = null;
    }
    if (startOfWeek && endOfWeek) {
        follow_up_sql = ` SELECT date FROM follow_up WHERE practice_id=? AND DATE BETWEEN ? AND ?`;
        appointment_sql = ` SELECT date, new_patient, walkin FROM appointment WHERE practice_id=? AND DATE BETWEEN ? AND ? `;
        surgery_sql = ` SELECT date FROM surgery WHERE practice_id=? AND DATE BETWEEN ? AND ?`;
        preventive_sql = ` SELECT date FROM preventive_reminder WHERE practice_id=? AND DATE BETWEEN ? AND ?`;
        follow_up_append = [practice_id, startOfWeek, endOfWeek];
        appointment_append = [practice_id, startOfWeek, endOfWeek];
        surgery_append = [practice_id, startOfWeek, endOfWeek];
        preventive_append = [practice_id, startOfWeek, endOfWeek];
    } else {
        follow_up_sql = ` SELECT date FROM follow_up WHERE practice_id=?`;
        appointment_sql = ` SELECT date, new_patient, walkin FROM appointment WHERE practice_id=?`;
        surgery_sql = ` SELECT date FROM surgery WHERE practice_id=? `;
        preventive_sql = ` SELECT date FROM preventive_reminder WHERE practice_id=?`;
        follow_up_append = [practice_id];
        appointment_append = [practice_id];
        surgery_append = [practice_id];
        preventive_append = [practice_id];
    }

    db.query(follow_up_sql, follow_up_append, (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            let key = moment(result[i].date).format("DD-MM-YYYY");
            final[key] = { appointments: 0, walkins: 0, new_patients: 0, follow_ups: 1, surgerys: 0, preventive_cares: 0, total: 1 };
        }
        db.query(appointment_sql, appointment_append, (err, result) => {
            if (err) throw err;
            let walkins = [];
            let new_patients = [];
            let appointments = [];
            result.forEach(data => {
                if (data.new_patient) {
                    new_patients.push(data);
                } else if (data.walkin) {
                    walkins.push(data);
                } else {
                    appointments.push(data);
                }
            });
            for (let i = 0; i < appointments.length; i++) {
                let key = moment(appointments[i].date).format("DD-MM-YYYY");
                if (final[key]) {
                    final[key].appointments += 1;
                    final[key].total += 1;
                } else {
                    final[key] = {
                        appointments: 1,
                        walkins: 0,
                        new_patients: 0,
                        follow_ups: 0,
                        surgerys: 0,
                        preventive_cares: 0,
                        total: 1
                    };
                }
            }
            for (let i = 0; i < walkins.length; i++) {
                let key = moment(walkins[i].date).format("DD-MM-YYYY");
                if (final[key]) {
                    final[key].walkins += 1;
                    final[key].total += 1;
                } else {
                    final[key] = {
                        appointments: 0,
                        walkins: 1,
                        new_patients: 0,
                        follow_ups: 0,
                        surgerys: 0,
                        preventive_cares: 0,
                        total: 1
                    };
                }
            }
            for (let i = 0; i < new_patients.length; i++) {
                let key = moment(new_patients[i].date).format("DD-MM-YYYY");
                if (final[key]) {
                    final[key].new_patients += 1;
                    final[key].total += 1;
                } else {
                    final[key] = {
                        appointments: 0,
                        walkins: 0,
                        new_patients: 1,
                        follow_ups: 0,
                        surgerys: 0,
                        preventive_cares: 0,
                        total: 1
                    };
                }
            }
            db.query(surgery_sql, surgery_append, (err, result) => {
                if (err) throw err;
                for (let i = 0; i < result.length; i++) {
                    let key = moment(result[i].date).format("DD-MM-YYYY");
                    if (final[key]) {
                        final[key].surgerys += 1;
                        final[key].total += 1;
                    } else {
                        final[key] = {
                            appointments: 0,
                            walkins: 0,
                            new_patients: 0,
                            follow_ups: 0,
                            surgerys: 1,
                            preventive_cares: 0,
                            total: 1
                        };
                    }
                }
                db.query(preventive_sql, preventive_append, (err, result) => {
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        let key = moment(result[i].date).format("DD-MM-YYYY");
                        if (final[key]) {
                            final[key].preventive_cares += 1;
                            final[key].total += 1;
                        } else {
                            final[key] = {
                                appointments: 0,
                                walkins: 0,
                                new_patients: 0,
                                follow_ups: 0,
                                surgerys: 0,
                                preventive_cares: 1,
                                total: 1
                            };
                        }
                    }
                    res.send(final);
                });
            });
        });
    });
});



router.get("/bookedslots/:date/:user_id/:practice_id", (req, res) => {
    var user_id = req.params.user_id;
    var practice_id = req.params.practice_id;
    var date = req.params.date;
    var final = {};
    let settings_sql = `
    SELECT
      timeinterval
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
      date=? AND practice_id = ? AND user_id = ? AND (status IS NULL OR status = 'rescheduled')
  `;
    let appointment_sql = `
    SELECT
      time,
      new_patient
    FROM
      appointment
    WHERE
      date=? AND practice_id = ? AND user_id = ? AND (status IS NULL OR status = 'rescheduled')
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
        let timeinterval = parseInt((result[0].timeinterval.split(' ')[0]), 10);
        let duration = timeinterval + ' minutes';
        db.query(follow_sql, [date, practice_id, user_id], (err, result) => {
            if (err) throw err;
            result.forEach(element => {
                final[moment(element.time, 'HH:mm:ss').format('hh:mm a')] = 'follow_up';
            }, this);
            db.query(appointment_sql, [date, practice_id, user_id], (err, result) => {
                if (err) throw err;
                result.forEach(element => {
                    if (element.new_patient) {
                        final[moment(element.time, 'HH:mm:ss').format('hh:mm a')] = 'new_patient';
                    } else {
                        final[moment(element.time, 'HH:mm:ss').format('hh:mm a')] = 'appointment';
                    }
                }, this);
                db.query(surgery_sql, [date, practice_id, user_id], (err, result) => {
                    if (err) throw err;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].changed_time) {
                            for (let j = 0; j <= result[i].changed_duration.split(' ')[0]; j = j + timeinterval) {
                                final[moment(result[i].changed_time, 'HH:mm:ss').add({ minutes: j }).format('hh:mm a')] = 'surgery';
                            }
                        } else {
                            for (let j = 0; j <= result[i].duration.split(' ')[0]; j = j + timeinterval) {
                                final[moment(result[i].time, 'HH:mm:ss').add({ minutes: j }).format('hh:mm a')] = 'surgery';
                            }
                        }
                    }
                    res.send(final);
                });
            });
        });
    });
});

router.get("/users/:user_id/:practice_id", (req, res) => {
    var user_id = parseInt((req.params.user_id), 10);
    var practice_id = parseInt((req.params.practice_id), 10);
    console.log(user_id);
    console.log(practice_id);
    var response = { users: [] = [], user: null };
    let sql = `
    SELECT
      name,
      user_id
    FROM
      user
    WHERE
      practice_id=? AND (role = 'Admin' OR role = 'Doctor')
  `;
    let query = db.query(sql, practice_id, (err, result) => {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            if (result[i].user_id === user_id) {
                response.users.push(result[i]);
                response.user = result[i];
            } else {
                response.users.push(result[i]);
            }
        }
        res.send(response);
    });
});

router.get("/pet_parent/:query/:practice_id", (req, res) => {
    var practice_id = req.params.practice_id;
    console.log("practice_id:", practice_id);

    var query = (req.params.query);
    var raw = req.query.raw;
    console.log(typeof raw, raw);
    let sql3;
    if (practice_id == '9' || practice_id == '111') {
        sql3 = "SELECT * FROM practice where practice_id in ('9','111')";
    } else {
        sql3 = "SELECT * FROM practice where practice_id=" + practice_id;
    }
    let dbquery1 = db.query(sql3, (err, data1) => {
        let sql2 = "SELECT a.pet_parent_id, a.mobile_no, a.email_id, a.name, b.patient_id, b.name as pet_name, b.breed, b.age_dob, b.sex FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id WHERE (a.mobile_no LIKE ? OR a.name LIKE ? OR b.name LIKE ?) AND practice_id = ? AND b.status IS NULL";
        //var sql = "(select a.pet_parent_id, a.mobile_no, a.email_id, a.name, b.patient_id, b.name as pet_name, b.breed, b.age_dob, b.sex FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id WHERE (a.mobile_no LIKE '%"+query+"%' OR a.name LIKE '%"+query+"%' OR b.name LIKE '%"+query+"%') AND a.practice_id = "+practice_id+" AND b.status IS NULL) UNION (select a.pet_parent_id, a.mobile_no, a.email_id, a.name, b.patient_id, b.name as pet_name, b.breed, b.age_dob, b.sex FROM pet_parent_practice d INNER JOIN pet_parent a ON d.pet_parent_id = a.pet_parent_id INNER JOIN patient b ON d.pet_parent_id = b.pet_parent_id WHERE (a.mobile_no LIKE '%"+query+"%' OR a.name LIKE '%"+query+"%' OR b.name LIKE '%"+query+"%') AND d.practice_id = "+practice_id+" AND b.status IS NULL AND d.active = 1)";
        var sql;
        if (practice_id == '9' || practice_id == '111') {
            sql = "select a.pet_parent_id, a.mobile_no, c.country_code, a.email_id, a.name, b.patient_id, b.name as pet_name, b.breed, b.age_dob, b.sex, concat (c.clinic_id_name,'-',b.clinic_id) as clinic_id FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id left join practice c on a.practice_id = c.practice_id WHERE (a.mobile_no LIKE '%" + query + "%' OR a.name LIKE '%" + query + "%' OR b.name LIKE '%" + query + "%' OR b.clinic_id LIKE '%" + query + "%' OR c.clinic_id_name LIKE '%" + query + "%') AND a.practice_id  in ('9','111') AND b.status IS NULL order by b.clinic_id DESC";
        } else {
            sql = "select a.pet_parent_id, a.mobile_no, c.country_code, a.email_id, a.name, b.patient_id, b.name as pet_name, b.breed, b.age_dob, b.sex, concat (c.clinic_id_name,'-',b.clinic_id) as clinic_id FROM pet_parent a INNER JOIN patient b ON a.pet_parent_id=b.pet_parent_id left join practice c on a.practice_id = c.practice_id WHERE (a.mobile_no LIKE '%" + query + "%' OR a.name LIKE '%" + query + "%' OR b.name LIKE '%" + query + "%' OR b.clinic_id LIKE '%" + query + "%' OR c.clinic_id_name LIKE '%" + query + "%') AND a.practice_id = " + practice_id + " AND b.status IS NULL order by b.clinic_id DESC";
        }
        if (query) {
            var result = [];
            let dbquery = db.query(sql, (err, data) => {
                console.log("sql:", sql);
                if (err) throw err;

                if (data.length === 0) {
                    console.log("sql:", sql);
                    res.json([]);
                } else {
                    if (raw) {
                        result = data;
                        console.log("result:", result);
                    } else {
                        console.log('inside else: ', raw);
                        result.push({
                            pet_parent_id: data[0].pet_parent_id,
                            name: data[0].name,
                            email_id: data[0].email_id,
                            mobile_no: data[0].mobile_no,
                            pet_name: data[0].pet_name,
                            pets: [{ patient_id: data[0].patient_id, pet_name: data[0].pet_name }]
                        });
                        for (var i = 1; i < data.length; i++) {
                            if (data[i].pet_parent_id === data[i - 1].pet_parent_id) {
                                for (var j = 0; j < result.length; j++) {
                                    if (result[j].pet_parent_id === data[i].pet_parent_id) {
                                        result[j].pets.push({
                                            patient_id: data[i].patient_id,
                                            pet_name: data[i].pet_name
                                        });
                                    }
                                }
                            } else {
                                var temp = {
                                    patient_id: data[i].patient_id,
                                    pet_name: data[i].pet_name
                                };
                                var pets = [];
                                pets.push(temp);
                                result.push({
                                    pet_parent_id: data[i].pet_parent_id,
                                    name: data[i].name,
                                    email_id: data[i].email_id,
                                    mobile_no: data[i].mobile_no,
                                    pet_name: data[i].pet_name,
                                    pets: pets
                                });
                            }
                        }
                    }
                    res.json(result);
                }
            });
        }
    });
});

router.post("/preventive_care/update/:id", (req, res) => {
    console.log('preventive update called: ', req.body, req.params.id);
    let id = req.params.id;
    let time = req.body.time;
    let sql = `UPDATE preventive_reminder SET time = ? WHERE reminder_id = ?`;
    let query = db.query(sql, [time, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.get("/upcoming_events/:date/:user_id/:practice_id", (req, res) => {
    console.log('insideallinfosadfasdfasdfasdfasdfasdfasdfasdfas');
    let sql;
    console.log(req.params.user_id);
    var query = req.query.query;
    var date = req.params.date;
    var user_id = req.params.user_id;
    var practice_id = req.params.practice_id;
    if (query === 'allinfo') {
        console.log('insideallinfo');
        sql = `
          (SELECT
            c.mobile_no,NULL as preventive_type, a.appointment_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob,b.sex,
            (CASE WHEN a.new_patient = true THEN 'new_patient' ELSE CASE WHEN a.walkin = true THEN 'walkin' ELSE 'appointment' END END) AS event_type,
            d.record_id,c.name as pet_parent_name,concat(e.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            a.mobile_reason,f.cheifcom
          FROM appointment as a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          LEFT JOIN record as d ON a.appointment_id = d.event_id AND d.event_type in ('appointment','walkin')
          LEFT JOIN practice as e ON e.practice_id = a.practice_id
          LEFT JOIN subjective as f ON d.subject_id = f.subject_id AND d.practice_id = f.practice_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          UNION
          (SELECT
            c.mobile_no,NULL as preventive_type, a.follow_up_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob,b.sex, 'follow_up' as event_type,
            d.record_id,c.name as pet_parent_name,concat(e.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            concat(null) as mobile_reason,f.cheifcom
          FROM follow_up a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          LEFT JOIN record as d ON a.follow_up_id = d.event_id AND d.event_type = 'follow_up'
          LEFT JOIN practice as e ON e.practice_id = a.practice_id
          LEFT JOIN subjective as f ON d.subject_id = f.subject_id AND d.practice_id = f.practice_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          UNION
          (SELECT
            c.mobile_no,NULL as preventive_type, a.surgery_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob,b.sex, 'surgery' as event_type,
            d.record_id,c.name as pet_parent_name,concat(e.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            concat(null) as mobile_reason,f.cheifcom
          FROM surgery a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          LEFT JOIN record as d ON a.surgery_id = d.event_id AND d.event_type = 'surgery'
          LEFT JOIN practice as e ON e.practice_id = a.practice_id
          LEFT JOIN subjective as f ON d.subject_id = f.subject_id AND d.practice_id = f.practice_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          UNION
          (SELECT
            c.mobile_no, a.preventive_type, a.reminder_id as id, b.patient_id, a.time, a.date, '30 minutes' as duration, a.status, a.comment, b.name, b.breed, b.species, b.color, b.age_dob,b.sex, 'preventive_care' as event_type,
            d.record_id,c.name as pet_parent_name,concat(e.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            concat(null) as mobile_reason,f.cheifcom
          FROM preventive_reminder a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          LEFT JOIN record as d ON a.reminder_id = d.event_id AND d.event_type = 'preventive_care'
          LEFT JOIN practice as e ON e.practice_id = a.practice_id
          LEFT JOIN subjective as f ON d.subject_id = f.subject_id AND d.practice_id = f.practice_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          ORDER BY time ASC
        `;
    } else {
        console.log('outsideallinfo');
        sql = `
          (SELECT
            c.mobile_no, NULL as preventive_type, a.appointment_id as id, b.patient_id, a.time, a.duration, b.name, b.breed, b.age_dob,
            (CASE WHEN a.new_patient = true THEN 'new_patient' ELSE CASE WHEN a.walkin = true THEN 'walkin' ELSE 'appointment' END END) AS event_type
          FROM appointment a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          UNION
          (SELECT
            c.mobile_no, NULL as preventive_type, a.follow_up_id as id, b.patient_id, a.time, a.duration, b.name, b.breed, b.age_dob, 'follow_up' as event_type
          FROM follow_up a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          UNION
          (SELECT
            c.mobile_no, NULL as preventive_type, a.surgery_id as id, b.patient_id, a.time, a.duration, b.name, b.breed, b.age_dob, 'surgery' as event_type
          FROM surgery a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          UNION
          (SELECT
            c.mobile_no, a.preventive_type, a.reminder_id as id, b.patient_id, a.time, '30 minutes' as duration, b.name, b.breed, b.age_dob, 'preventive_care' as event_type
          FROM preventive_reminder a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          WHERE a.date=? AND a.practice_id=? AND a.user_id=?)
          ORDER BY time ASC
        `;
    }
    console.log(date + ' ' + practice_id + ' ' + user_id);
    let sql_params = [
        //follow_up
        date,
        practice_id,
        user_id,
        //appointment
        date,
        practice_id,
        user_id,
        //surgery
        date,
        practice_id,
        user_id,
        //PREVENTIVE
        date,
        practice_id,
        user_id
    ];
    db.query(sql, sql_params, (err, result) => {
        if (err) throw err;
        res.send({ success: true, result: result });
    });
});


/** srikanth */
router.get("/upcoming_receptionistevents/:date/:practice_id", (req, res) => {
    let sql;
    var date = req.params.date;
    var practice_id = req.params.practice_id;
    sql = `
          (SELECT
            c.mobile_no, NULL as preventive_type, a.appointment_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, e.name as doctorname, b.age_dob,
            (CASE WHEN a.new_patient = true THEN 'new_patient' ELSE CASE WHEN a.walkin = true THEN 'walkin' ELSE 'appointment' END END) AS event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            a.mobile_reason,c.name as pet_parent_name,g.cheifcom
          FROM appointment a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.appointment_id = d.event_id AND d.event_type in ('appointment','walkin')
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          UNION
          (SELECT
            c.mobile_no, NULL as preventive_type, a.follow_up_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, e.name as doctorname, b.age_dob, 'follow_up' as event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            concat(null) as mobile_reason,c.name as pet_parent_name,g.cheifcom
          FROM follow_up a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.follow_up_id = d.event_id AND d.event_type = 'follow_up'
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          UNION
          (SELECT
            c.mobile_no, a.preventive_type, a.reminder_id as id, b.patient_id, a.time, a.date, '30 minutes' as duration, a.status, a.comment, b.name, b.breed, b.species, b.color,  e.name as doctorname, b.age_dob, 'preventive_care' as event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            concat(null) as mobile_reason,c.name as pet_parent_name,g.cheifcom
          FROM preventive_reminder a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN practice as f ON a.practice_id = f.practice_id
          LEFT JOIN record as d ON a.reminder_id = d.event_id AND d.event_type = 'preventive_care'
          LEFT JOIN subjective as g ON d.subject_id = g.subject_id AND d.practice_id = g.practice_id
          WHERE a.date=? AND a.practice_id=?)
          UNION
          (SELECT
            c.mobile_no, NULL as preventive_type, a.surgery_id as id, b.patient_id, a.time, a.date, a.duration, a.status, a.comment, b.name, b.breed, b.species, b.color, e.name as doctorname,  b.age_dob, 'surgery' as event_type,
            d.record_id, concat(f.clinic_id_name,'-',b.clinic_id) as clinic_patient_id,
            concat(null) as mobile_reason,c.name as pet_parent_name,g.cheifcom
          FROM surgery a INNER JOIN patient b ON a.patient_id=b.patient_id
          INNER JOIN pet_parent as c ON b.pet_parent_id = c.pet_parent_id
          INNER JOIN user as e ON a.user_id = e.user_id
          LEFT JOIN record as d ON a.surgery_id = d.event_id AND d.event_type = 'surgery'
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

router.post('/appointment/:id/:status', (req, res) => {
    let status = req.params.status;
    if (status == 'true') {
        status = true;
    } else {
        status = false;
    }
    let id = parseInt(req.params.id, 10);
    let sql = "UPDATE appointment SET status=? WHERE appointment_id=?";
    let query = db.query(sql, [status, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.post('/follow_up/:id/:status', (req, res) => {
    let status = req.params.status;
    if (status == 'true') {
        status = true;
    } else {
        status = false;
    }
    let id = parseInt(req.params.id, 10);
    let sql = "UPDATE follow_up SET status=? WHERE follow_up_id=?";
    let query = db.query(sql, [status, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.post('/surgery/:id/:status', (req, res) => {
    let status = req.params.status;
    if (status == 'true') {
        status = true;
    } else {
        status = false;
    }
    let id = parseInt(req.params.id, 10);
    let sql = "UPDATE surgery SET status=? WHERE surgery_id=?";
    let query = db.query(sql, [status, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.post('/preventive_reminder/:id/:status', (req, res) => {
    let status = req.params.status;
    if (status == 'true') {
        status = true;
    } else {
        status = false;
    }
    let id = parseInt(req.params.id, 10);
    let sql = "UPDATE preventive_reminder SET status=? WHERE reminder_id=?";
    let query = db.query(sql, [status, id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});



router.post('/symptomslistadd', (req, res) => {
    var symptom = req.body;
    let sql = "INSERT INTO symptoms_subjective SET ?";
    let query = db.query(sql, symptom, (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

router.get('/dashboard/patients/:practice_id', (req, res) => {
    var practice_id = req.params.practice_id;
    let sql = `(SELECT r_table.patient_id, r_table.records, p_table.preventives FROM (SELECT a.patient_id as patient_id, COUNT(e.record_id) as records FROM (SELECT d.patient_id AS patient_id, d.name AS name FROM pet_parent AS c INNER JOIN patient AS d ON c.pet_parent_id = d.pet_parent_id WHERE c.practice_id = ?) AS a INNER JOIN record AS e ON a.patient_id = e.patient_id WHERE e.subject_id IS NOT NULL GROUP BY a.patient_id) AS r_table LEFT JOIN (SELECT a.patient_id as patient_id, COUNT(b.preventive_id) as preventives FROM (SELECT d.patient_id AS patient_id, d.name AS name FROM pet_parent AS c INNER JOIN patient AS d ON c.pet_parent_id = d.pet_parent_id WHERE c.practice_id = 3) AS a INNER JOIN preventive_care AS b ON a.patient_id = b.patient_id GROUP BY a.patient_id) AS p_table ON r_table.patient_id = p_table.patient_id WHERE r_table.records > 1 OR p_table.preventives > 1) UNION (SELECT r_table.patient_id, r_table.records, p_table.preventives FROM (SELECT a.patient_id as patient_id, COUNT(e.record_id) as records FROM (SELECT d.patient_id AS patient_id, d.name AS name FROM pet_parent AS c INNER JOIN patient AS d ON c.pet_parent_id = d.pet_parent_id WHERE c.practice_id = 3) AS a INNER JOIN record AS e ON a.patient_id = e.patient_id WHERE e.subject_id IS NOT NULL GROUP BY a.patient_id) AS r_table RIGHT JOIN (SELECT a.patient_id as patient_id, COUNT(b.preventive_id) as preventives FROM (SELECT d.patient_id AS patient_id, d.name AS name FROM pet_parent AS c INNER JOIN patient AS d ON c.pet_parent_id = d.pet_parent_id WHERE c.practice_id = ?) AS a INNER JOIN preventive_care AS b ON a.patient_id = b.patient_id GROUP BY a.patient_id) AS p_table ON r_table.patient_id = p_table.patient_id WHERE r_table.records > 1 OR p_table.preventives > 1)`;
    let total = `SELECT COUNT(b.patient_id) as total FROM pet_parent as a INNER JOIN patient as b ON a.pet_parent_id = b.pet_parent_id WHERE a.practice_id = ?`;
    let query = db.query(total, practice_id, (err, result) => {
        if (err) throw err;
        var total_patients = result[0].total;
        db.query(sql, [practice_id, practice_id], (err, result) => {
            if (err) throw err;
            res.send({
                recurring: result.length,
                new: total_patients - result.length,
                total: total_patients
            });
        });
    });
});


router.get("/practice/:practice_id", (req, res) => {
    var practice_id = req.params.practice_id;
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, practice_id, (err, result) => {
        if (err) throw err;
        let sql2 = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sql2, practice_id, (err, result2) => {
            if (err) throw err;
            const practice = {
                practice_id: result[0].practice_id,
                name: result[0].name,
                mobile_no: result[0].mobile_no,
                country_code_country: result[0].country_code + " " + result2[0].country,
                currency_code: result[0].currency_code,
                currency_symbol: result[0].currency_symbol,
                speciality: result[0].speciality,
                logo: result[0].logo,
                salesagent_number: result[0].salesagent_number,
                card_no: result[0].card_no,
                website: result[0].website,
                email_id: result[0].email_id,
                tax: result[0].tax,
                clinic_id_name: result[0].clinic_id_name,
                address: {
                    address: result2[0].address,
                    city: result2[0].city,
                    pincode: result2[0].pincode,
                    locality: result2[0].locality,
                    country: result2[0].country
                }
            }
            res.json({
                success: true,
                practice_details: practice
            });
        });
    });
});


router.post("/mailnotify", (req, res) => {

    var prescription_meds = req.body.meds;
    // create reusable transporter object using the default SMTP transport

    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpatient = `SELECT * FROM patient WHERE patient_id=?`;
        let query = db.query(sqlpatient, req.body.patient_id, (err, resultpatient) => {
            let sqlDocReg = `SELECT * FROM user WHERE name=?`
            const doc = req.body.doctorname.substring(4)
            let query = db.query(sqlDocReg, doc, (err, doctornInfo) => {
                console.log(doctornInfo)
                let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;

                let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
                    let users = [
                        {
                            petname: req.body.petname,
                            petparentname: req.body.petparentname,
                            practicename: req.body.practicename,
                            doctorname: req.body.doctorname,
                            weight:req.body.weight,
                            date: req.body.date,
                            meds: prescription_meds,
                            email: req.body.email,
                            patientage: req.body.patientage,
                            practice_details: result[0],
                            patient_details: resultpatient[0],
                            practice_address: resultpracadd[0],
                            breed: req.body.breed,
                            species: req.body.species,
                            complaints: req.body.complaints,
                            duration: req.body.duration,
                            diagnosis: req.body.diagnosis ? req.body.diagnosis[0] : null,
                            plan: req.body.treatmentPlan,
                            procedure: req.body.procedure ? req.body.procedure[0] : null,
                            labOrders: req.body.labOrders ? req.body.labOrders[0] : null,
                            imagingOrder: req.body.imagingOrder ? req.body.imagingOrder[0] : null,
                            inventoryOrders: req.body.inventoryOrders ? req.body.inventoryOrders[0] : null,
                            color: 'white',
                            regNumber: doctornInfo[0].registration_no,
                            additionalNotes:req.body.additionalNotes
                        }
                    ];
                    console.log('Prescription print sent');

                    loadTemplate('prescription_pdf_new', users).then((results) => {
                        console.log('creating pdf')
                        results.map((result) => {
                            pdf.create(result.email.html, options).toBuffer((err, buffer) => {
                                // upload to s3
                                console.log(users[0].petparentname)
                                s3.putObject({
                                    Bucket: BUCKET_NAME,
                                    Key: 'prescription/' + users[0].petparentname + '-' + 'prescription.pdf',
                                    Body: buffer,
                                    ACL: 'public-read',
                                }, function (err, data) {
                                    if (err) {
                                        console.log('error uploading file ' + err)
                                    } else {
                                        console.log('file uploaded successfully')
                                        loadTemplate('prescription_new', users).then((results) => {
                                            console.log('sending email')
                                            return Promise.all(results.map((result) => {
                                                sendEmail({
                                                    to: result.context.email,
                                                    from: 'alerts@supertails.com',
                                                    subject: result.email.subject,
                                                    html: result.email.html,
                                                    text: result.email.text,
                                                    attachments: [
                                                        {
                                                            filename: 'Prescription.pdf',
                                                            path: `https://prescriptionpdf-072325946506.s3.ap-south-1.amazonaws.com/prescription/${users[0].petparentname}-prescription.pdf`,
                                                            contentType: 'application/pdf'
                                                        },
                                                    ]
                                                })
                                            }));
                                        }).then(() => {
                                            res.json({
                                                success: true
                                            });
                                        });
                                    }
                                })
                            })
                        })
                    })
                });
            })
        });
    });
});

router.post("/mailinvoice", (req, res) => {

    console.log(req.body.practice_id);
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
            var paid = (req.body.price.total - req.body.outstanding);
            let invoice = [
                {
                    price: req.body.price,
                    total: req.body.total,
                    items: req.body.items,
                    details: req.body.details,
                    discounttype: req.body.discounttype,
                    practicename: req.body.practicename,
                    date: req.body.date,
                    email: req.body.email,
                    patientage: req.body.patientage,
                    practice_details: result[0],
                    practice_address: resultpracadd[0],
                    outstanding: req.body.outstanding,
                    outstandingexist: req.body.outstandingexist,
                    paid: paid,
                    taxexist: req.body.taxexist,
                    discountexist: req.body.discountexist
                }
            ];
            console.log(req.body.discounttype);
            console.log(invoice);
            loadTemplate('invoice', invoice).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });

        });
    });
});


router.get("/openemr/:patient_id", (req, res) => {
    let patient_id = req.params.patient_id;
    let sql = `SELECT URL FROM vetport_EMR WHERE patient_id=?`;
    let query = db.query(sql, patient_id, (err, result) => {
        if (err) throw err;
        res.send({ URL: result[0].URL });
    });
});


router.post("/mailreturninvoice", (req, res) => {

    console.log(req.body.practice_id);
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
            let invoice = [
                {
                    price: req.body.price,
                    items: req.body.items,
                    details: req.body.details,
                    discounttype: req.body.discounttype,
                    practicename: req.body.practicename,
                    date: req.body.date,
                    email: req.body.email,
                    patientage: req.body.patientage,
                    practice_details: result[0],
                    practice_address: resultpracadd[0],
                    outstanding: req.body.outstanding,
                    outstandingexist: req.body.outstandingexist,
                    taxexist: req.body.taxexist,
                    discountexist: req.body.discountexist,
                    payableexist: req.body.payableexist,
                    payableamount: req.body.payableamount
                }
            ];
            console.log(req.body.discounttype);
            loadTemplate('return-invoice', invoice).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });

        });
    });
});


router.post("/mailcreditnote", (req, res) => {

    var creditnotedetails = req.body.creditnote;
    console.log(req.body.practice_id);
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
            let creditnote = [
                {
                    creditnotedetails: creditnotedetails,
                    email: req.body.email,
                    practice_details: result[0],
                    practice_address: resultpracadd[0]
                }
            ];
            console.log(req.body.discounttype);
            loadTemplate('creditnote', creditnote).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });

        });
    });
});



/////////////////////////////////*************TEST RUN FUN FOR EXPIRY EMAIL*************************///////////////////////////////////////////////////////////
/////////////////////////////////////***************3 MONTHS*************//////////////////////////////////////////////////
router.get('/notification/before90/expiry_reminder', (req, res) => {

    let current_date = moment().add(3, 'M').format('YYYY-MM-DD');
    console.log(current_date, "test for date of future....");
    let sql = ` SELECT
    a.name as stock_name,
    a.stock_unit,
    b.base,
    b.base_unit,
    b.batch_no,
    b.current_stocklevel,
    b.itemstock_id,
    b.item_id,
    b.retail_price,
    b.tax,
    b.expiry_date,
    b.initial_stocklevel,
    b.timestamp,
    a.practice_id,
    c.name as user_name,
    c.email_id
    
  FROM add_item AS a
  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  INNER JOIN user AS c ON a.practice_id=c.practice_id
  WHERE  b.expiry_date = ? AND c.role = 'Admin' AND b.current_stocklevel <> '0'`;
    // let sql = `SELECT 
    // a.*,
    // b.*,
    // c.*
    // FROM add_itemstock as b
    // INNER JOIN add_item AS a ON b.item_id=a.item_id
    // INNER JOIN user as c ON a.practice_id = c.practice_id
    // WHERE  b.expiry_date = ? AND b.current_stocklevel <> '0'`;'
    db.query(sql, current_date, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            result.forEach(element => {
                let timestamp = moment(element.timestamp).format('DD-MM-YYYY');
                let expiry_date = moment(element.expiry_date).format('DD-MM-YYYY');
                let expiry_notification = [
                    {
                        current_stocklevel: element.current_stocklevel,
                        stock_name: element.stock_name,
                        admin_name: element.user_name,
                        batch_number: element.batch_no,
                        email: element.email_id,
                        date: timestamp,
                        expiry_date: expiry_date,
                        initial_stocklevel: element.initial_stocklevel,
                        month: "3 months"
                    }
                ]
                console.log(expiry_notification, "expiry data.....");
                loadTemplate('expiry_notification', expiry_notification).then((results) => {
                    return Promise.all(results.map((result) => {

                        sendEmail({
                            to: result.context.email,
                            from: '"AnimApp" <care@animapp.in>',
                            subject: result.email.subject,
                            html: result.email.html,
                            // text: result.email.te
                            text: result.email.text,
                        })
                    }));
                }).then(() => {
                    // res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify("success"));
                    console.log("data success");
                });
            });

        }
        else {
            console.log("no data found........");
            res.send(JSON.stringify("No data Found"));
        }

    });
})
///////////////////////////////////////***********2 MONTHS**************/////////////////////////////////////////////////////
router.get('/notification/before60/expiry_reminder', (req, res) => {

    let current_date = moment().add(2, 'M').format('YYYY-MM-DD');
    console.log(current_date, "test for date of future....");
    let sql = ` SELECT
    a.name as stock_name,
    a.stock_unit,
    b.base,
    b.base_unit,
    b.batch_no,
    b.current_stocklevel,
    b.itemstock_id,
    b.item_id,
    b.retail_price,
    b.timestamp,
    b.expiry_date,
    b.tax,
    b.initial_stocklevel,
    a.practice_id,
    c.name as user_name,
    c.email_id
    
  FROM add_item AS a
  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  INNER JOIN user AS c ON a.practice_id=c.practice_id
  WHERE  b.expiry_date = ? AND c.role = 'Admin' AND b.current_stocklevel <> '0'`;
    // let sql = `SELECT 
    // a.*,
    // b.*,
    // c.*
    // FROM add_itemstock as b
    // INNER JOIN add_item AS a ON b.item_id=a.item_id
    // INNER JOIN user as c ON a.practice_id = c.practice_id
    // WHERE  b.expiry_date = ? AND b.current_stocklevel <> '0'`;'
    db.query(sql, current_date, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            result.forEach(element => {
                let timestamp = moment(element.timestamp).format('DD-MM-YYYY');
                let expiry_date = moment(element.expiry_date).format('DD-MM-YYYY');
                let expiry_notification = [
                    {
                        current_stocklevel: element.current_stocklevel,
                        stock_name: element.stock_name,
                        admin_name: element.user_name,
                        batch_number: element.batch_no,
                        email: element.email_id,
                        month: "2 months",
                        expiry_date: expiry_date,
                        date: timestamp,
                        initial_stocklevel: element.initial_stocklevel,
                    }
                ]
                console.log(expiry_notification, "expiry data.....");
                loadTemplate('expiry_notification', expiry_notification).then((results) => {
                    return Promise.all(results.map((result) => {

                        sendEmail({
                            to: result.context.email,
                            from: '"AnimApp" <care@animapp.in>',
                            subject: result.email.subject,
                            html: result.email.html,
                            // text: result.email.te
                            text: result.email.text,
                        })
                    }));
                }).then(() => {
                    // res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify("success"));
                    console.log("data success");
                });
            });

        }
        else {
            console.log("no data found........");
            res.send(JSON.stringify("No data Found"));
        }

    });
})
///////////////////////////////////////***********1 MONTHS**************/////////////////////////////////////////////////////
router.get('/notification/before30/expiry_reminder', (req, res) => {

    let current_date = moment().add(1, 'M').format('YYYY-MM-DD');
    console.log(current_date, "test for date of future....");
    let sql = ` SELECT
    a.name as stock_name,
    a.stock_unit,
    b.base,
    b.base_unit,
    b.batch_no,
    b.current_stocklevel,
    b.itemstock_id,
    b.item_id,
    b.retail_price,
    b.timestamp,
    b.initial_stocklevel,
    b.expiry_date,
    b.tax,
    a.practice_id,
    c.name as user_name,
    c.email_id
    
  FROM add_item AS a
  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  INNER JOIN user AS c ON a.practice_id=c.practice_id
  WHERE  b.expiry_date = ? AND c.role = 'Admin' AND b.current_stocklevel <> '0'`;
    // let sql = `SELECT 
    // a.*,
    // b.*,
    // c.*
    // FROM add_itemstock as b
    // INNER JOIN add_item AS a ON b.item_id=a.item_id
    // INNER JOIN user as c ON a.practice_id = c.practice_id
    // WHERE  b.expiry_date = ? AND b.current_stocklevel <> '0'`;'
    db.query(sql, current_date, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            result.forEach(element => {
                let timestamp = moment(element.timestamp).format('DD-MM-YYYY');
                let expiry_date = moment(element.expiry_date).format('DD-MM-YYYY');
                let expiry_notification = [
                    {
                        current_stocklevel: element.current_stocklevel,
                        stock_name: element.stock_name,
                        admin_name: element.user_name,
                        batch_number: element.batch_no,
                        email: element.email_id,
                        month: "1 month",
                        date: timestamp,
                        initial_stocklevel: element.initial_stocklevel,
                        expiry_date: expiry_date,
                    }
                ]
                console.log(expiry_notification, "expiry data.....");
                loadTemplate('expiry_notification', expiry_notification).then((results) => {
                    return Promise.all(results.map((result) => {

                        sendEmail({
                            to: result.context.email,
                            from: '"AnimApp" <care@animapp.in>',
                            subject: result.email.subject,
                            html: result.email.html,
                            // text: result.email.te
                            text: result.email.text,
                        })
                    }));
                }).then(() => {
                    // res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify("success"));
                    console.log("data success");
                });
            });

        }
        else {
            console.log("no data found........");
            res.send(JSON.stringify("No data Found"));
        }

    });
})
///////////////////////////////////////***********15 Days**************/////////////////////////////////////////////////////
router.get('/notification/before15/expiry_reminder', (req, res) => {

    let current_date = moment().add(15, 'd').format('YYYY-MM-DD');
    console.log(current_date, "test for date of future....");
    let sql = ` SELECT
    a.name as stock_name,
    a.stock_unit,
    b.base,
    b.base_unit,
    b.batch_no,
    b.current_stocklevel,
    b.itemstock_id,
    b.item_id,
    b.retail_price,
    b.tax,
    b.timestamp,
    b.expiry_date,
    a.practice_id,
    b.initial_stocklevel,
    c.name as user_name,
    c.email_id
    
  FROM add_item AS a
  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  INNER JOIN user AS c ON a.practice_id=c.practice_id
  WHERE  b.expiry_date = ? AND c.role = 'Admin' AND b.current_stocklevel <> '0'`;
    // let sql = `SELECT 
    // a.*,
    // b.*,
    // c.*
    // FROM add_itemstock as b
    // INNER JOIN add_item AS a ON b.item_id=a.item_id
    // INNER JOIN user as c ON a.practice_id = c.practice_id
    // WHERE  b.expiry_date = ? AND b.current_stocklevel <> '0'`;'
    db.query(sql, current_date, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            result.forEach(element => {
                let timestamp = moment(element.timestamp).format('DD-MM-YYYY');
                let expiry_date = moment(element.expiry_date).format('DD-MM-YYYY');
                let expiry_notification = [
                    {
                        current_stocklevel: element.current_stocklevel,
                        stock_name: element.stock_name,
                        admin_name: element.user_name,
                        batch_number: element.batch_no,
                        email: element.email_id,
                        month: "15 days",
                        date: timestamp,
                        initial_stocklevel: element.initial_stocklevel,
                        expiry_date: expiry_date,
                    }
                ]
                console.log(expiry_notification, "expiry data.....");
                loadTemplate('expiry_notification', expiry_notification).then((results) => {
                    return Promise.all(results.map((result) => {

                        sendEmail({
                            to: result.context.email,
                            from: '"AnimApp" <care@animapp.in>',
                            subject: result.email.subject,
                            html: result.email.html,
                            // text: result.email.te
                            text: result.email.text,
                        })
                    }));
                }).then(() => {
                    // res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify("success"));
                    console.log("data success");
                });
            });

        }
        else {
            console.log("no data found........");
            res.send(JSON.stringify("No data Found"));

        }

    });
})

///////////////////////////////////////***********7 days**************/////////////////////////////////////////////////////
router.get('/notification/before7/expiry_reminder', (req, res) => {

    let current_date = moment().add(7, 'd').format('YYYY-MM-DD');
    console.log(current_date, "test for date of future....");
    let sql = ` SELECT
    a.name as stock_name,
    a.stock_unit,
    b.base,
    b.base_unit,
    b.batch_no,
    b.current_stocklevel,
    b.itemstock_id,
    b.item_id,
    b.retail_price,
    b.tax,
    b.timestamp,
    b.initial_stocklevel,
    b.expiry_date,
    a.practice_id,
    c.name as user_name,
    c.email_id
    
  FROM add_item AS a
  INNER JOIN add_itemstock AS b ON a.item_id=b.item_id
  INNER JOIN user AS c ON a.practice_id=c.practice_id
  WHERE  b.expiry_date = ? AND c.role = 'Admin' AND b.current_stocklevel <> '0'`;
    // let sql = `SELECT 
    // a.*,
    // b.*,
    // c.*
    // FROM add_itemstock as b
    // INNER JOIN add_item AS a ON b.item_id=a.item_id
    // INNER JOIN user as c ON a.practice_id = c.practice_id
    // WHERE  b.expiry_date = ? AND b.current_stocklevel <> '0'`;'
    db.query(sql, current_date, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            result.forEach(element => {
                let timestamp = moment(element.timestamp).format('DD-MM-YYYY');
                let expiry_date = moment(element.expiry_date).format('DD-MM-YYYY');
                let expiry_notification = [
                    {
                        current_stocklevel: element.current_stocklevel,
                        stock_name: element.stock_name,
                        admin_name: element.user_name,
                        batch_number: element.batch_no,
                        email: element.email_id,
                        month: "7 days",
                        initial_stocklevel: element.initial_stocklevel,
                        date: timestamp,
                        expiry_date: expiry_date,
                    }
                ]
                console.log(expiry_notification, "expiry data.....");
                loadTemplate('expiry_notification', expiry_notification).then((results) => {
                    return Promise.all(results.map((result) => {

                        sendEmail({
                            to: result.context.email,
                            from: '"AnimApp" <care@animapp.in>',
                            subject: result.email.subject,
                            html: result.email.html,
                            // text: result.email.te
                            text: result.email.text,
                        })
                    }));
                }).then(() => {
                    // res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify("success"));
                    console.log("data success");
                });
            });

        }
        else {
            console.log("no data found........");
            res.send(JSON.stringify("No data Found"));
        }

    });
})


///////////////////////////////////////////////////////////////////////////////////////


router.post("/mailpaymenthistory", (req, res) => {

    var payment_history = req.body.payment_history;
    console.log(req.body.practice_id);
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
            let creditnote = [
                {
                    payment_history: payment_history,
                    email: req.body.email,
                    practice_details: result[0],
                    practice_address: resultpracadd[0]
                }
            ];
            console.log(req.body.discounttype);
            loadTemplate('paymenthistory', creditnote).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });

        });
    });
});

router.put("/changeemailparent", (req, res) => {
    let sql2 = "UPDATE pet_parent SET email_id=? WHERE pet_parent_id=?";
    let query2 = db.query(sql2, [req.body.email, req.body.pet_parent_id], (err, result, fields) => {
        if (err) throw err;
        res.json({
            success: true
        })
    });

})


router.get("/getemailparent/:id", (req, res) => {
    let sql2 = "SELECT email_id FROM pet_parent WHERE pet_parent_id=?";
    let query2 = db.query(sql2, req.params.id, (err, result, fields) => {
        if (err) throw err;
        res.json({
            success: true,
            email: result.length ? result[0].email_id : ''
        })
    });
})



router.post('/changepassword', (req, res) => {
    var data = req.body;
    data.oldpassword = crypto.pbkdf2Sync(data.oldpassword, 'this-is-a-text', 100000, 60, 'sha512');
    let sql = 'SELECT * FROM user WHERE email_id=? AND password=?';
    let query = db.query(sql, [data.email_id, data.oldpassword], (err, result, fields) => {
        if (err) throw err;
        if (!result.length) {
            res.json({ success: false });
        }
        else {
            data.newpassword = crypto.pbkdf2Sync(data.newpassword, 'this-is-a-text', 100000, 60, 'sha512');
            let updatesql = 'UPDATE user SET password= ? WHERE email_id=? AND password=?';
            let query = db.query(updatesql, [data.newpassword, data.email_id, data.oldpassword], (err, result, fields) => {
                if (err) throw err;
                res.json({ success: true });
            });
        }
    });
});

router.post('/resetforgotpassword', (req, res) => {
    var data = req.body;
    data.newpassword = crypto.pbkdf2Sync(data.newpassword, 'this-is-a-text', 100000, 60, 'sha512');
    let updatesql = 'UPDATE user SET password= ? WHERE user_id = ?';
    console.log(data.user_id);
    let query = db.query(updatesql, [data.newpassword, data.user_id], (err, result, fields) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

router.get('/resetforgotpassword', (req, res) => {
    var data = {
        user_id: 5,
        newpassword: crypto.pbkdf2Sync('1234', 'this-is-a-text', 100000, 60, 'sha512')
    };
    // data.newpassword = crypto.pbkdf2Sync('1234', 'this-is-a-text', 100000, 60, 'sha512');
    let updatesql = 'UPDATE user SET password= ? WHERE user_id = ?';
    console.log(data.user_id);
    let query = db.query(updatesql, [data.newpassword, data.user_id], (err, result, fields) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

router.post('/emailimaging', (req, res) => {
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
            // create reusable transporter object using the default SMTP transport
            let users = [
                {
                    testname: req.body.testname,
                    petname: req.body.petname,
                    petparentname: req.body.petparentname,
                    practicename: req.body.practicename,
                    doctorname: req.body.doctorname,
                    date: req.body.date,
                    attachment: req.body.attachment,
                    caption: req.body.caption,
                    email: req.body.email,
                    age: req.body.age,
                    breed: req.body.breed,
                    species: req.body.species,
                    practice_details: result[0],
                    practice_address: resultpracadd[0],
                    patient_details: req.body.patient_details
                }
            ];
            console.log(users);

            loadTemplate('imaging', users).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });

        });
    });
});




router.post('/emaillaborders', (req, res) => {
    let sql = `SELECT * FROM practice WHERE practice_id=?`;
    let query = db.query(sql, req.body.practice_id, (err, result) => {
        let sqlpracadd = `SELECT * FROM practice_address WHERE practice_id=?`;
        let query = db.query(sqlpracadd, req.body.practice_id, (err, resultpracadd) => {
            // create reusable transporter object using the default SMTP transport
            let users = [
                {
                    testname: req.body.testname,
                    age: req.body.age,
                    breed: req.body.breed,
                    species: req.body.species,
                    testlist: req.body.testlist,
                    petname: req.body.petname,
                    petparentname: req.body.petparentname,
                    practicename: req.body.practicename,
                    doctorname: req.body.doctorname,
                    date: req.body.date,
                    email: req.body.email,
                    practice_details: result[0],
                    practice_address: resultpracadd[0],
                    patient_details: req.body.patient_details
                }
            ];
            console.log(users);

            loadTemplate('laborders', users).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: result.context.email,
                        from: '"AnimApp" <care@animapp.in>',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    })
                }));
            }).then(() => {
                res.json({
                    success: true
                });
            });
        });
    });
});

// router.get('/dashboard/invoice/:practice_id/:startDate/:endDate', (req, res) => {
//   console.log('dashboard invoice get api called'.green);
//   const practice_id = req.params.practice_id;
//   const startDate = req.params.startDate;
//   const endDate = req.params.endDate;
//   let sql = `SELECT
//             a.ref,
//             a.date,
//             b.name as pet_parent_name,
//             ROUND(a.total - a.final_discount) as total,
//             a.status
//             FROM invoice as a
//             INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
//             WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ?
//             ORDER BY a.invoice_id DESC`;
//   let query = db.query(sql, [startDate, endDate, practice_id], (err, result) => {
//     if (err) throw err;
//     res.send({success: true, invoices: result.map(invoice => {
//         invoice.date = moment(invoice.date, 'YYYY-MM-DDTHH:mm:ss.000Z').format('YYYY-MM-DD');
//         return invoice;
//       })
//     });
//   });
// });

// router.get('/dashboard/inventory/:practice_id/:startDate/:endDate', (req, res) => {
//   console.log('dashboard invoice get api called'.green);
//   const practice_id = req.params.practice_id;
//   const startDate = req.params.startDate;
//   const endDate = req.params.endDate;
//   let sql = `
//   SELECT
//   c.name,
//   a.consumed_stocklevel as qty,
//   DATE(a.timestamp) as date,
//   b.batch_no
//   FROM consumed_stock as a
//   LEFT JOIN add_itemstock as b ON a.itemstock_id = b.itemstock_id
//   LEFT JOIN add_item as c ON a.item_id = c.item_id
//   WHERE (a.timestamp BETWEEN ? AND ?) AND a.practice_id = ?
//   ORDER BY a.consumed_id DESC
//   `;
//   let query = db.query(sql, [startDate, endDate, practice_id], (err, result) => {
//     if (err) throw err;
//     res.send({success: true, inventories: result.map(inventory => {
//         inventory.date = moment(inventory.date, 'YYYY-MM-DDTHH:mm:ss.000Z').format('YYYY-MM-DD');
//         inventory.qty = parseFloat((inventory.qty).toFixed(2));
//         return inventory;
//       })
//     });
//   });
// });

// router.get('/dashboard/visited/patients/:practice_id', (req, res) => {
//   console.log('dashboard visited patients get api called'.green);
//   const practice_id = req.params.practice_id;
//   const startDate = moment().format('YYYY-MM-DD');
//   // const endDate = moment().format('YYYY-MM-DD');
//   // const startDate = '2017-10-01';
//   // const endDate = '2018-02-09';
//   let sql = `
//   SELECT
//   a.patient_id,
//   a.name,
//   a.reason,
//   (CASE WHEN b.invoice_id THEN b.invoice_id WHEN c.invoice_id THEN c.invoice_id ELSE NULL END) as invoice_id,
//   ROUND(
//   CASE
//   WHEN b.invoice_id THEN ((CASE WHEN b.total THEN b.total ELSE 0 END) - b.final_discount)
//   WHEN c.invoice_id THEN ((CASE WHEN c.total THEN c.total ELSE 0 END) - c.final_discount)
//   ELSE 0
//   END
//   ) as amount
//   FROM (SELECT
//   b.patient_id as patient_id,
//   b.name as name,
//   c.cheifcom as reason,
//   a.preventive_id as preventive_id,
//   a.plan_id as plan_id
//   FROM record as a
//   LEFT JOIN patient as b ON a.patient_id = b.patient_id
//   LEFT JOIN subjective as c ON a.subject_id = c.subject_id
//   WHERE DATE(a.timestamp) = ? AND a.practice_id = ?
//   ORDER BY a.record_id DESC) as a
//   LEFT JOIN invoice as b ON a.preventive_id = b.preventive_id
//   LEFT JOIN invoice as c ON a.plan_id = c.plan_id
//   `;
//   let query = db.query(sql, [startDate, practice_id], (err, result) => {
//     if (err) throw err;
//     const promiseArray = result.map(item => {
//       return getBalance({patient:item});
//     });
//     Promise.all(promiseArray).then(values => {
//       console.log('values: ', values);
//       res.send({success: true, patients: values});
//     });
//   });
// });

// function getBalance(params = {
//   patient: null
// }) {
//   const promise = new Promise((resolve, reject) => {
//     let outstandingSql = 'SELECT payment_amount as outstanding FROM payment WHERE invoice_id = ? ORDER BY payment_id DESC LIMIT 1';
//     db.query(outstandingSql, [params.patient.invoice_id], (err, result) => {
//       if (err) throw err;
//       if (result.length && result[0].outstanding) {
//         params.patient['balance'] = params.patient.amount - result[0].outstanding;
//         resolve(params.patient);
//       } else if (result.length && !result[0].outstanding) {
//         params.patient['balance'] = 0;
//         resolve(params.patient);
//       } else if (!result.length) {
//         params.patient['balance'] = params.patient.amount;
//         resolve(params.patient);
//       }
//     });
//   });
//   return promise;
// }


router.get('/dashboard/visited/patients/:practice_id/:user_id/:startDate/:endDate', (req, res) => {
    console.log('insidedashboard');

    const practice_id = req.params.practice_id;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const user_id = req.params.user_id;
    if (req.params.user_id !== 'null') {
        let sql = `
  SELECT
  a.patient_id,
  a.name,
  a.record_id,
  a.event_type,
  a.reason,
  a.timestamp,
  a.client_name,
  (CASE WHEN b.invoice_id THEN b.invoice_id WHEN c.invoice_id THEN c.invoice_id ELSE NULL END) as invoice_id,
  ROUND(
  CASE
  WHEN b.invoice_id THEN ((CASE WHEN b.total THEN b.total ELSE 0 END) - b.final_discount)
  WHEN c.invoice_id THEN ((CASE WHEN c.total THEN c.total ELSE 0 END) - c.final_discount)
  ELSE 0
  END
  ) as amount
  FROM (SELECT
  b.patient_id as patient_id,
  b.name as name,
  a.record_id,
  a.event_type,
  c.cheifcom as reason,
  a.preventive_id as preventive_id,
  a.plan_id as plan_id,
  a.timestamp,
  e.name as client_name
  FROM record as a
  LEFT JOIN patient as b ON a.patient_id = b.patient_id
  LEFT JOIN pet_parent as e ON b.pet_parent_id = e.pet_parent_id
  LEFT JOIN subjective as c ON a.subject_id = c.subject_id
  WHERE (a.timestamp BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ?
  ORDER BY a.record_id ASC) as a
  LEFT JOIN invoice as b ON a.preventive_id = b.preventive_id
  LEFT JOIN invoice as c ON a.plan_id = c.plan_id
  ORDER BY a.timestamp DESC
  `;
        let query = db.query(sql, [startDate, endDate, practice_id, user_id], (err, result) => {
            if (err) throw err;
            console.log('this', result);
            const promiseArray = result.map(item => {
                return getBalance({ patient: item });
            });
            Promise.all(promiseArray).then(values => {
                console.log('values: ', values);
                res.send({ success: true, patients: values });
            });
        });
    } else {
        let sql = `
  SELECT
  a.patient_id,
  a.record_id,
  a.event_type,
  a.name,
  a.reason,
  a.timestamp,
  a.client_name,
  (CASE WHEN b.invoice_id THEN b.invoice_id WHEN c.invoice_id THEN c.invoice_id ELSE NULL END) as invoice_id,
  ROUND(
  CASE
  WHEN b.invoice_id THEN ((CASE WHEN b.total THEN b.total ELSE 0 END) - b.final_discount)
  WHEN c.invoice_id THEN ((CASE WHEN c.total THEN c.total ELSE 0 END) - c.final_discount)
  ELSE 0
  END
  ) as amount
  FROM (SELECT
  a.record_id,
  a.event_type,
  b.patient_id as patient_id,
  b.name as name,
  c.cheifcom as reason,
  a.preventive_id as preventive_id,
  a.plan_id as plan_id,
  a.timestamp,
  e.name as client_name
  FROM record as a
  LEFT JOIN patient as b ON a.patient_id = b.patient_id
  LEFT JOIN pet_parent as e ON b.pet_parent_id = e.pet_parent_id
  LEFT JOIN subjective as c ON a.subject_id = c.subject_id
  WHERE (a.timestamp BETWEEN ? AND ?) AND a.practice_id = ?
  ORDER BY a.record_id ASC) as a
  LEFT JOIN invoice as b ON a.preventive_id = b.preventive_id
  LEFT JOIN invoice as c ON a.plan_id = c.plan_id
  ORDER BY a.timestamp DESC
  `;
        let query = db.query(sql, [startDate, endDate, practice_id], (err, result) => {
            if (err) throw err;
            console.log('this', result);
            const promiseArray = result.map(item => {
                return getBalance({ patient: item });
            });
            Promise.all(promiseArray).then(values => {
                console.log('values: ', values);
                res.send({ success: true, patients: values });
            });
        });
    }
});







function getBalance(params = {
    patient: null
}) {
    const promise = new Promise((resolve, reject) => {
        let outstandingSql = 'SELECT payment_amount as outstanding FROM payment WHERE invoice_id = ? ORDER BY payment_id DESC LIMIT 1';
        db.query(outstandingSql, [params.patient.invoice_id], (err, result) => {
            if (err) throw err;
            if (result.length && result[0].outstanding) {
                params.patient['balance'] = params.patient.amount - result[0].outstanding;
                resolve(params.patient);
            } else if (result.length && !result[0].outstanding) {
                params.patient['balance'] = 0;
                resolve(params.patient);
            } else if (!result.length) {
                params.patient['balance'] = params.patient.amount;
                resolve(params.patient);
            }
        });
    });
    return promise;
}




router.get('/dashboard/inventory/:practice_id/:user_id/:startDate/:endDate', (req, res) => {
    console.log('dashboard invoice get api called'.green);
    const practice_id = req.params.practice_id;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const user_id = req.params.user_id;
    if (user_id !== 'null') {
        console.log('sdfaksdjfkalsjj klafj kaj ', startDate, endDate);
        let sql = `
  SELECT
  CONCAT(c.name, ' ', (CASE WHEN c.strength THEN c.strength ELSE '' END)) as name,
  a.consumed_stocklevel as qty,
  DATE(a.timestamp) as date,
  d.name as patient_name,
  b.batch_no,
  c.stock_unit
  FROM consumed_stock as a
  LEFT JOIN add_itemstock as b ON a.itemstock_id = b.itemstock_id
  LEFT JOIN add_item as c ON a.item_id = c.item_id
  LEFT JOIN patient as d ON a.patient_id = d.patient_id
  WHERE (a.timestamp BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ?
  ORDER BY a.consumed_id DESC
  `;
        let query = db.query(sql, [startDate, endDate, practice_id, user_id], (err, result) => {
            if (err) throw err;
            res.send({
                success: true, inventories: result.map(inventory => {
                    inventory.date = moment(inventory.date, 'YYYY-MM-DDTHH:mm:ss.000Z').format('YYYY-MM-DD');
                    // inventory.qty = parseFloat((inventory.qty).toFixed(2));
                    if (inventory.qty) {
                        inventory.qty = parseFloat((inventory.qty).toFixed(2));
                    } else {
                        inventory.qty = 0;
                    }
                    return inventory;
                })
            });
        });
    } else {
        let sql = `
  SELECT
  CONCAT(c.name, ' ', (CASE WHEN c.strength THEN c.strength ELSE '' END)) as name,
  a.consumed_stocklevel as qty,
  DATE(a.timestamp) as date,
  d.name as patient_name,
  b.batch_no,
  c.stock_unit
  FROM consumed_stock as a
  LEFT JOIN add_itemstock as b ON a.itemstock_id = b.itemstock_id
  LEFT JOIN add_item as c ON a.item_id = c.item_id
  LEFT JOIN patient as d ON a.patient_id = d.patient_id
  WHERE (a.timestamp BETWEEN ? AND ?) AND a.practice_id = ?
  ORDER BY a.consumed_id DESC
  `;
        let query = db.query(sql, [startDate, endDate, practice_id], (err, result) => {
            if (err) throw err;
            res.send({
                success: true, inventories: result.map(inventory => {
                    inventory.date = moment(inventory.date, 'YYYY-MM-DDTHH:mm:ss.000Z').format('YYYY-MM-DD');
                    if (inventory.qty) {
                        inventory.qty = parseFloat((inventory.qty).toFixed(2));
                    } else {
                        inventory.qty = 0;
                    }
                    return inventory;
                })
            });
        });
    }
});



router.get("/dashboard/invoice/:practice_id/:user_id/:startDate/:endDate/:payment_type", (req, res) => {
    console.log("dashboard invoice get api called".green);
    const practice_id = req.params.practice_id;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const user_id = req.params.user_id;
    const payment_type = req.params.payment_type;
    console.log("payment_type".red, payment_type);
    if (payment_type && payment_type !== "null") {
        console.log("payment_type".green, payment_type);
        if (user_id !== "null") {
            let sql = `SELECT
  a.final_discount,
  SUM(f.payment_amount) as paid,
  a.credits,
  a.ref,
  a.invoice_id,
  a.date,
  b.name as pet_parent_name,
  c.name as patient_name,
  a.total,
  a.status,
  j.total as returntotal,
  f.payment_amount
  FROM invoice as a
  INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN patient as c ON a.patient_id = c.patient_id
  LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
  LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
  WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ?
  AND a.payment_type = ?
  GROUP BY a.invoice_id 
  ORDER BY a.invoice_id DESC`;
            let query = db.query(
                sql,
                [startDate, endDate, practice_id, user_id, payment_type],
                (err, result) => {
                    if (err) throw err;
                    res.send({
                        success: true,
                        invoices: result.map(invoice => {
                            invoice.date = moment(
                                invoice.date,
                                "YYYY-MM-DDTHH:mm:ss.000Z"
                            ).format("YYYY-MM-DD");
                            return invoice;
                        })
                    });
                }
            );
        } else {
            let sql = `SELECT
  a.final_discount,
  SUM(f.payment_amount) as paid,
  a.credits,
  a.ref,
  a.invoice_id,
  a.date,
  b.name as pet_parent_name,
  c.name as patient_name,
  a.total,
  a.status,
  j.total as returntotal,
  f.payment_amount
  FROM invoice as a
  INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN patient as c ON a.patient_id = c.patient_id
  LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
  LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
  WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.payment_type = ?
  GROUP BY a.invoice_id 
  ORDER BY a.invoice_id DESC`;
            let query = db.query(
                sql,
                [startDate, endDate, practice_id, payment_type],
                (err, result) => {
                    if (err) throw err;
                    res.send({
                        success: true,
                        invoices: result.map(invoice => {
                            invoice.date = moment(
                                invoice.date,
                                "YYYY-MM-DDTHH:mm:ss.000Z"
                            ).format("YYYY-MM-DD");
                            return invoice;
                        })
                    });
                }
            );
        }
    } else {
        if (user_id !== "null") {
            let sql = `SELECT
    a.final_discount,
    SUM(f.payment_amount) as paid,
    a.credits,
    a.ref,
    a.invoice_id,
    a.date,
    b.name as pet_parent_name,
    c.name as patient_name,
    a.total,
    a.status,
    j.total as returntotal,
    f.payment_amount
    FROM invoice as a
    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
    LEFT JOIN patient as c ON a.patient_id = c.patient_id
    LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
    LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
    WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ?
    GROUP BY a.invoice_id 
    ORDER BY a.invoice_id DESC`;
            let query = db.query(
                sql,
                [startDate, endDate, practice_id, user_id],
                (err, result) => {
                    if (err) throw err;
                    res.send({
                        success: true,
                        invoices: result.map(invoice => {
                            invoice.date = moment(
                                invoice.date,
                                "YYYY-MM-DDTHH:mm:ss.000Z"
                            ).format("YYYY-MM-DD");
                            return invoice;
                        })
                    });
                }
            );
        } else {
            let sql = `SELECT
    a.final_discount,
    SUM(f.payment_amount) as paid,
    a.credits,
    a.ref,
    a.invoice_id,
    a.date,
    b.name as pet_parent_name,
    c.name as patient_name,
    a.total,
    a.status,
    j.total as returntotal,
    f.payment_amount
    FROM invoice as a
    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
    LEFT JOIN patient as c ON a.patient_id = c.patient_id
    LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
    LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
    WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ?
    GROUP BY a.invoice_id
    ORDER BY a.invoice_id DESC`;
            let query = db.query(
                sql,
                [startDate, endDate, practice_id],
                (err, result) => {
                    if (err) throw err;
                    res.send({
                        success: true,
                        invoices: result.map(invoice => {
                            invoice.date = moment(
                                invoice.date,
                                "YYYY-MM-DDTHH:mm:ss.000Z"
                            ).format("YYYY-MM-DD");
                            return invoice;
                        })
                    });
                }
            );
        }
    }
});


router.get("/rdashboard/invoice/:practice_id/:user_id/:startDate/:endDate/:payment_type/:payment_status", (req, res) => {
    console.log("dashboard invoice get api called".green);
    const practice_id = req.params.practice_id;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const user_id = req.params.user_id;
    const payment_type = req.params.payment_type;
    console.log("payment_type".red, payment_type.length);
    const payment_status = req.params.payment_status;
    console.log("payment_status".red, payment_status);
    if (payment_status && payment_status !== "null") {
        if (payment_type && payment_type !== "null") {
            console.log("payment_type".green, payment_type);
            if (user_id !== "null") {
                let sql = `SELECT
    a.final_discount,
    SUM(f.payment_amount) as paid,
    a.credits,
    a.ref,
    a.invoice_id,
    a.date,
    b.name as pet_parent_name,
    c.name as patient_name,
    a.total,
    a.status,
    j.total as returntotal,
    f.payment_amount
    FROM invoice as a
    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
    LEFT JOIN patient as c ON a.patient_id = c.patient_id
    LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
    LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
    WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ? AND a.status = ?
    AND a.payment_type = ?
    GROUP BY a.invoice_id
    ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, user_id, payment_type, payment_status],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            } else {
                let sql = `SELECT
    a.final_discount,
    SUM(f.payment_amount) as paid,
    a.credits,
    a.ref,
    a.invoice_id,
    a.date,
    b.name as pet_parent_name,
    c.name as patient_name,
    a.total,
    a.status,
    j.total as returntotal
    FROM invoice as a
    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
    LEFT JOIN patient as c ON a.patient_id = c.patient_id
    LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
    LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
    WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.payment_type = ? AND a.status = ?
    GROUP BY a.invoice_id 
    ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, payment_type, payment_status],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            }
        } else {
            if (user_id !== "null") {
                let sql = `SELECT
      a.final_discount,
      SUM(f.payment_amount) as paid,
      a.credits,
      a.ref,
      a.invoice_id,
      a.date,
      b.name as pet_parent_name,
      c.name as patient_name,
      a.total,
      a.status,
      j.total as returntotal
      FROM invoice as a
      INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
      LEFT JOIN patient as c ON a.patient_id = c.patient_id
      LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
      LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
      WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ? AND a.status = ?
    GROUP BY a.invoice_id 
    ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, user_id, payment_status],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            } else {
                let sql = `SELECT
      a.final_discount,
      SUM(f.payment_amount) as paid,
      a.credits,
      a.ref,
      a.invoice_id,
      a.date,
      b.name as pet_parent_name,
      c.name as patient_name,
      a.total,
      a.status,
      j.total as returntotal
      FROM invoice as a
      INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
      LEFT JOIN patient as c ON a.patient_id = c.patient_id
      LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
      LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
      WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.status = ?
      GROUP BY a.invoice_id 
      ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, payment_status],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            }
        }
    } else {
        if (payment_type && payment_type !== "null") {
            console.log("payment_type".green, payment_type);
            if (user_id !== "null") {
                let sql = `SELECT
    a.final_discount,
    SUM(f.payment_amount) as paid,
    a.credits,
    a.ref,
    a.invoice_id,
    a.date,
    b.name as pet_parent_name,
    c.name as patient_name,
    a.total,
    a.status,
    j.total as returntotal,
    f.payment_amount
    FROM invoice as a
    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
    LEFT JOIN patient as c ON a.patient_id = c.patient_id
    LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
    LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
    WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ?
    AND a.payment_type = ?
    GROUP BY a.invoice_id 
    ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, user_id, payment_type],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            } else {
                let sql = `SELECT
    a.final_discount,
    SUM(f.payment_amount) as paid,
    a.credits,
    a.ref,
    a.invoice_id,
    a.date,
    b.name as pet_parent_name,
    c.name as patient_name,
    a.total,
    a.status,
    j.total as returntotal
    FROM invoice as a
    INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
    LEFT JOIN patient as c ON a.patient_id = c.patient_id
    LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
    LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
    WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.payment_type = ?
    GROUP BY a.invoice_id 
    ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, payment_type],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            }
        } else {
            if (user_id !== "null") {
                let sql = `SELECT
      a.final_discount,
      SUM(f.payment_amount) as paid,
      a.credits,
      a.ref,
      a.invoice_id,
      a.date,
      b.name as pet_parent_name,
      c.name as patient_name,
      a.total,
      a.status,
      j.total as returntotal
      FROM invoice as a
      INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
      LEFT JOIN patient as c ON a.patient_id = c.patient_id
      LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
      LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
      WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? AND a.user_id = ?
     GROUP BY a.invoice_id 
     ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id, user_id],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            } else {
                let sql = `SELECT
      a.final_discount,
      SUM(f.payment_amount) as paid,
      a.credits,
      a.ref,
      a.invoice_id,
      a.date,
      b.name as pet_parent_name,
      c.name as patient_name,
      a.total,
      a.status,
      j.total as returntotal
      FROM invoice as a
      INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
      LEFT JOIN patient as c ON a.patient_id = c.patient_id
      LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
      LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
      WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ?
      GROUP BY a.invoice_id 
      ORDER BY a.invoice_id DESC`;
                let query = db.query(
                    sql,
                    [startDate, endDate, practice_id],
                    (err, result) => {
                        if (err) throw err;
                        res.send({
                            success: true,
                            invoices: result.map(invoice => {
                                invoice.date = moment(
                                    invoice.date,
                                    "YYYY-MM-DDTHH:mm:ss.000Z"
                                ).format("YYYY-MM-DD");
                                return invoice;
                            })
                        });
                    }
                );
            }
        }
    }
});

router.get('/wag_requests/:practice_id', (req, res) => {
    var practice_id = req.params.practice_id;
    let sql = `SELECT patient.*,pet_parent.name as parent_name,pet_parent.mobile_no FROM patient 
  left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id 
  where patient.practice_id = ? and wag_status = 'Requested'`;
    let query = db.query(sql, practice_id, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            data: result
        });
    });
});

router.post('/wag_accept', (req, response_send) => {
    var practice_id = req.body.practice_id;
    var patient_id = req.body.patient_id;
    let client_count = `select * from patient where clinic_id and practice_id = ?`;
    let query = db.query(client_count, practice_id, (err, result) => {
        if (err) throw err;
        let clinic_id = result.length + 1;
        let sql = `UPDATE patient SET wag_status = 'Accepted', clinic_id = ? WHERE patient_id = ?`;
        let query = db.query(sql, [clinic_id, patient_id], (err, result1) => {
            if (err) throw err;
            let patient_details = `SELECT patient.name as patientName,pet_parent.name as parentName,
            pet_parent.player_id FROM patient 
            left join pet_parent on patient.pet_parent_id = pet_parent.pet_parent_id
            where patient.patient_id =?`;
            let query = db.query(patient_details, patient_id, (err, result2) => {
                if (err) throw err;
                const data_notification = result2[0];
                let practice_details = `SELECT * from practice where practice_id =?`;
                let query = db.query(practice_details, practice_id, (err, result3) => {
                    if (err) throw err;

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
                                // console.log("Response:");
                                // console.log(JSON.parse(data));
                            });
                        });
                        req.on("error", function (e) {
                            // console.log("ERROR:");
                            // console.log(e);
                        });
                        req.write(JSON.stringify(data));
                        req.end();
                    };
                    var message = {
                        app_id: "8d77233c-e58b-4dea-9be6-08cfaaa7e913",
                        contents: {
                            en: "Hello " + data_notification.parentName + ", your pet " + data_notification.patientName + "'s Wag request has been accepted by " + result3[0].name + ".Thank you!"
                        },
                        include_player_ids: [data_notification.player_id]
                    };

                    sendNotification(message);

                    response_send.send({
                        success: true,
                        data: 'Pet Successfully Waged with this clinic.'
                    });

                });
            });
        });
    });
});

router.delete('/wag_reject/:patient_id', (req, res) => {
    var patient_id = req.params.patient_id;
    let sql = `DELETE FROM patient WHERE patient_id = ?`;
    let query = db.query(sql, patient_id, (err, result1) => {
        if (err) throw err;
        res.send({
            success: true,
            data: 'Pet Successfully De-Waged from this clinic.'
        });
    });
});

router.get('/gettutorialvideos', (req, res) => {
    let sql = 'SELECT * FROM tutorial_videos';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            videos: result
        });
    });
});

//step 1
router.get('/temp/parentlist', (req, res) => {
    let sql = 'SELECT Mobile,Email,DOB FROM mocdoc_allpatients';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        var newarr = [];
        var unique = {};
        let count = 0;
        result.forEach(item => {
            if (!unique[item.Mobile]) {
                count = count + 1;
                item.DOB_new = moment(item.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
                item.name = 'Parent-' + count;
                item.pet_parent_id = count;
                newarr.push(item);
                unique[item.Mobile] = item;
            }
        });
        res.send({
            success: true,
            data: newarr
        });
    });
});

// step 2
router.get('/temp/patientlist', (req, res) => {
    let sql = `SELECT mocdoc_allpatients.*,mocdoc_parenttable.pet_parent_id FROM mocdoc_allpatients
    left join mocdoc_parenttable on mocdoc_allpatients.Mobile = mocdoc_parenttable.Mobile`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        var newarr = [];
        var unique = {};
        let count = 0;
        result.forEach(item => {
            count = count + 1;
            item.DOB_new = moment(item.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
            item.patient_id = count;
            newarr.push(item);
        });
        res.send({
            success: true,
            data: newarr
        });
    });
});

// step 3
router.get('/temp/planlist', (req, res) => {
    let sql = `select mocdoc_allrecords.record_id,mocdoc_allrecords.Date,mocdoc_allrecords.Treatment,mocdoc_patienttable.patient_id
    from mocdoc_allrecords
    left join mocdoc_patienttable on mocdoc_allrecords.PhId = mocdoc_patienttable.PhId
    where mocdoc_allrecords.Treatment <> '' order by mocdoc_allrecords.record_id;`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        var newarr = [];
        var unique = {};
        let count = 0;
        result.forEach(item => {
            item.Date_new = moment(item.Date, 'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD HH:mm:ss');
            newarr.push(item);
        });
        res.send({
            success: true,
            data: newarr
        });
    });
});


router.get('/temp/recordlist', (req, res) => {
    let sql = `SELECT mocdoc_allrecords.record_id,mocdoc_allrecords.Date,mocdoc_patienttable.patient_id,mocdoc_plan.plan_id FROM mocdoc_allrecords
    left join mocdoc_patienttable on mocdoc_allrecords.PhId = mocdoc_patienttable.PhId
    left join mocdoc_plan on mocdoc_allrecords.record_id = mocdoc_plan.record_id 
    order by mocdoc_allrecords.record_id`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        var newarr = [];
        result.forEach(item => {
            item.Date_new = moment(item.Date, 'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD HH:mm:ss');
            newarr.push(item);
        });
        res.send({
            success: true,
            data: result
        });
    });
});

router.get('/temp/pass', (req, res) => {
    let sql = `select * from user where practice_id = 28`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            data: result
        });
    });
});

/**
 * VIJAY CODE
 */

var csv = require('csv-express');

/**
 * This API is for downloading the revenue report in csv format from the dashboard
 */
router.get('/download/invoice/:practice_id/:user_id/:start_date/:end_date/:payment_type/:payment_status', (req, res) => {
    let practice_id = req.params.practice_id;
    let user_id = req.params.user_id;
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;
    let payment_type = req.params.payment_type;
    let payment_status = req.params.payment_status;

    // preparing an array for sql parameter
    let sql_parameter = [];
    sql_parameter.push(start_date);
    sql_parameter.push(end_date);
    sql_parameter.push(practice_id);

    let user_sql = '', payment_status_sql = '', payment_type_sql = '';

    // download file name
    let file_name = "Revenue Report(" + start_date + "  " + end_date + ")";

    // !IMPORTANT 
    // DO NOT CHANGE THE ORDER OF IF CONDITION (depends on parameter array push) CHECKS UNTIL YOU CHANGE THE SQL QUERY ORDER

    // if user_id is null we dont want to add those sql statement 
    if (user_id !== "null") {
        user_sql = "AND a.user_id = ?";
        sql_parameter.push(user_id);
    }

    if (payment_status !== "null") {
        payment_status_sql = "AND a.status = ?";
        sql_parameter.push(payment_status);
    }

    if (payment_type !== "null") {
        payment_type_sql = "AND a.payment_type = ?";
        sql_parameter.push(payment_type);
    }

    let sql = `
    SELECT
  a.final_discount,
  SUM(f.payment_amount) as paid,
  a.credits,
  a.ref,
  a.invoice_id,
  a.date,
  b.name as pet_parent_name,
  c.name as patient_name,
  a.total,
  a.status,
  j.total as returntotal,
  f.payment_amount
  FROM invoice as a
  INNER JOIN pet_parent as b ON a.pet_parent_id = b.pet_parent_id
  LEFT JOIN patient as c ON a.patient_id = c.patient_id
  LEFT JOIN payment as f ON a.invoice_id = f.invoice_id
  LEFT JOIN return_invoice as j ON a.invoice_id = j.linked_invoice
  WHERE (a.date BETWEEN ? AND ?) AND a.practice_id = ? ${user_sql} ${payment_status_sql}
  ${payment_type_sql}
  GROUP BY a.invoice_id ORDER BY a.invoice_id DESC `;
    db.query(sql, sql_parameter, (err, result) => {
        if (err) console.log(err);
        let final_result = [];

        result.forEach((row) => {
            let data = {};

            // to calculate total amt = total - final_discount
            let total = parseInt(row.total) - parseInt(row.final_discount);

            // to calculate balance 
            // DRAFT | same as total ,  OUTSTANDING | total-paid  , PAID | 0
            let balance = 0;
            if (row.status == "Draft") {
                balance = total;
            } else if (row.status === "Outstanding") {
                balance = total - parseInt(row.paid);
            }

            data.DATE = moment(row.date).format(" MMM Do, YYYY");
            data.REF = row.ref;
            data.CLIENT = row.pet_parent_name;
            data.PATIENT = row.patient_name;
            data.TOTAL = total;
            data.BALANCE = balance;
            data.STATUS = row.status;

            final_result.push(data);
        });
        let header = {
            "Content-disposition": "attachment; filename=" + file_name + ".csv",
            "Content-Type": "text/csv"
        };
        res.csv(final_result, true, header);
    });
});

/**
 * This API is for downloading the Payment Repor in csv format from the dashboard Analytics
 */
router.get('/download/paymentreceipts/:start_date/:end_date/:practice_id/:payment_type', (req, res) => {
    let practice_id = req.params.practice_id;
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;
    let payment_type = req.params.payment_type;

    // preparing an array for sql parameter
    let sql_params = [];
    let payment_type_addon = "";

    sql_params.push(start_date);
    sql_params.push(end_date);
    sql_params.push(practice_id);

    if (payment_type == "null") {
        payment_type_addon = "";
    } else {
        payment_type_addon = "and payment.type = ?";
        sql_params.push(payment_type);
    }

    // download file name
    let file_name = "Payment Receipt(" + start_date + "  " + end_date + ")";

    let sql = `SELECT patient.name as patient_name, pet_parent.name as pet_parent_name,
    payment.pn_ref, payment.date, payment.type, payment.payment_amount,
    invoice.ref, invoice.invoice_id
    FROM payment
    left join invoice on payment.invoice_id = invoice.invoice_id
    left join patient on invoice.patient_id = patient.patient_id
    left join pet_parent on invoice.pet_parent_id = pet_parent.pet_parent_id
    where ( payment.date BETWEEN ? AND ?) and invoice.practice_id = ? ${payment_type_addon} `;
    db.query(sql, sql_params, (err, result) => {
        if (err) console.log(err);
        let final_result = [];

        result.forEach((row) => {
            let data = {};

            data.DATE = moment(row.date).format(" MMM Do, YYYY");
            data.PAYMENT_REF = row.pn_ref;
            data.INVOICE_REF = row.ref;
            data.CLIENT = row.pet_parent_name;
            data.PATIENT = row.patient_name;
            data.PAID = row.payment_amount;
            data.PAYMENT_TYPE = row.type;

            final_result.push(data);
        });
        let header = {
            "Content-disposition": "attachment; filename=" + file_name + ".csv",
            "Content-Type": "text/csv"
        };
        res.csv(final_result, true, header);
    });
});

/**
 * This API is for downloading the sales by services in csv format from detailed revenue analytics
 */
router.get('/download/services/:start_date/:end_date/:practice_id/:service_id', (req, res) => {
    let practice_id = req.params.practice_id;
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;
    let service_id = req.params.service_id;
    let service_id_proc_sql = "";
    let service_id_prev_sql = "";
    let service_id_lab_sql = "";
    let service_id_imag_sql = "";

    if (service_id != 'null') {
        service_id_proc_sql = ` and cp.proc_id = ${service_id}`;
        service_id_prev_sql = ` and cp.prev_id = ${service_id}`;
        service_id_lab_sql = ` and cdl.diaglab_id= ${service_id}`;
        service_id_imag_sql = ` and cdi.diagimag_id= ${service_id}`;
    }

    // download file name
    let file_name = "Sales By Services(" + start_date + "  " + end_date + ")";

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
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        let final_result = [];

        result.forEach((row) => {
            let data = {};

            data.SERVICE_NAME = row.name;
            data.TOTAL = row.total;

            final_result.push(data);
        });
        let header = {
            "Content-disposition": "attachment; filename=" + file_name + ".csv",
            "Content-Type": "text/csv"
        };
        res.csv(final_result, true, header);
    });
});

/**
 * This API is for downloading the inventory consumption report in csv format from the dashboard
 */
router.get('/download/inventory/:practice_id/:user_id/:start_date/:end_date', (req, res) => {
    let practice_id = req.params.practice_id;
    let user_id = req.params.user_id;
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;

    let user_id_sql = '';

    // download file name
    let file_name = "Inventory Consumption Report ( " + start_date + "  " + end_date + " )";

    // sql parameters array 
    let sql_parameters = [];

    sql_parameters.push(start_date);
    sql_parameters.push(end_date);
    sql_parameters.push(practice_id);

    if (user_id !== "null") {
        user_id_sql = ' AND a.user_id = ? ';
        sql_parameters.push(user_id);
    }

    let sql = `
        SELECT
        CONCAT(c.name, ' ', (CASE WHEN c.strength THEN c.strength ELSE '' END)) as name,
        a.consumed_stocklevel as qty,
        DATE(a.timestamp) as date,
        d.name as patient_name,
        b.batch_no,
        c.stock_unit
        FROM consumed_stock as a
        LEFT JOIN add_itemstock as b ON a.itemstock_id = b.itemstock_id
        LEFT JOIN add_item as c ON a.item_id = c.item_id
        LEFT JOIN patient as d ON a.patient_id = d.patient_id
        WHERE (a.timestamp BETWEEN ? AND ?) AND a.practice_id = ? ${user_id_sql}
        ORDER BY a.consumed_id DESC
    `;

    db.query(sql, sql_parameters, (err, result) => {
        if (err) {
            console.log("Error on api/download/inventory  Error is  : " + err);
        } else {
            let final_result = [];
            result.forEach((row) => {
                let data = {};

                data.DATE = moment(row.date).format(" MMM Do, YYYY");
                data.PATIENT = row.patient_name;
                data.NAME = row.name;
                // when both qty and stock_unit is null it comes as null null in csv to avoid that this condition is used
                if (row.qty == null) {
                    data.QTY = 0;
                } else {
                    data.QTY = row.qty + " " + row.stock_unit;
                }
                data.BATCH = row.batch_no;

                final_result.push(data);
            });
            let header = {
                "Content-disposition": "attachment; filename=" + file_name + ".csv",
                "Content-Type": "text/csv"
            };
            res.csv(final_result, true, header);
        }
    });
});

module.exports = router;









  // http.get('http://localhost:5000/api/soap/prescription/2', (res) => {
  //   const { statusCode } = res;
  //   const contentType = res.headers['content-type'];

  //   let error;
  //   if (statusCode !== 200) {
  //     error = new Error('Request Failed.\n' +
  //                       `Status Code: ${statusCode}`);
  //   } else if (!/^application\/json/.test(contentType)) {
  //     error = new Error('Invalid content-type.\n' +
  //                       `Expected application/json but received ${contentType}`);
  //   }
  //   if (error) {
  //     console.error(error.message);
  //     // consume response data to free up memory
  //     res.resume();
  //     return;
  //   }
  //   res.setEncoding('utf8');
  //   let rawData = '';
  //   res.on('data', (chunk) => { rawData += chunk; });
  //   res.on('end', () => {
  //     try {
  //       const parsedData = JSON.parse(rawData);
  //       console.log(parsedData);
  //     } catch (e) {
  //       console.error(e.message);
  //     }
  //   });
  // }).on('error', (e) => {
  //   console.error(`Got error: ${e.message}`);
  // });
