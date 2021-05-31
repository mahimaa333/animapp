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

router.get('/', (req, res) => {
  res.send('email works');
});

router.post('/web_site/contact', (req, res) => {
  console.log(req.body);
  let contact = [{
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    message: req.body.message
  }];
  console.log(contact);
  loadTemplate('contact_webpage', contact).then((results) => {
    return Promise.all(results.map((result) => {
      sendEmail({
        to: 'sagar@animapp.in',
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

router.post('/web_site/sign_up', (req, res) => {
  console.log(req.body);
  let contact = [{
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    clinic: req.body.clinic,
    doctor_no: req.body.doctor
  }];
  console.log(contact);
  loadTemplate('signup_webpage', contact).then((results) => {
    return Promise.all(results.map((result) => {
      sendEmail({
        to: 'sagar@animapp.in',
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


module.exports = router;