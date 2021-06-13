const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql  = require('mysql');
const crypto = require('crypto');
const passport = require('passport');
const cors =  require('cors');
const colors = require('colors');
const jwt = require('jsonwebtoken');
const db = require('./server/config/connections');
const moment = require('moment');

const config = require('./server/config/database');
const api = require('./server/routes/api');

const app = express();
var compression = require('compression');
var helmet = require('helmet');

const socket = require('socket.io');
var inlineCss = require('inline-css');

const SENDGRID_API_KEY = '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';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


app.use(cors());
app.use(compression());
app.use(helmet());


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.set('port', (process.env.PORT || 5000));

// app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname, '/public')));

// var bodyParser = require('body-parser');
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({extended:true,limit: '50mb'}));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.raw({limit: '50mb'}));
// app.use(bodyParser.text({limit: '50mb'}));

// app.use(bodyParser.json({limit: '10mb', extended: true}))
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

app.use(passport.initialize());
app.use(passport.session());
require('./server/config/passport')(passport);


// for subscription email send
const nodemailer = require('nodemailer');
EmailTemplate = require('email-templates').EmailTemplate;



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
  tsl:{
    rejectUnauthorized:false
  }
});


function sendEmail(obj){
  // return transporter.sendMail(obj);
  return sgMail.send(obj);
}

function loadTemplate (templateName , contexts) {
  let template = new EmailTemplate(path.join(__dirname, '/server/routes/templates', templateName));
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
// for subscription email send end

// before subscripton
// app.use('/api', api);

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });


// app.listen(app.get('port'), function() {
//   console.log('Server is running on port', app.get('port'));
// });
//before ends



// after subscripton starts
// add subscription middleware here

var subscriptionChecker = function (req, res, next) {
  passport.authenticate('jwt', function(err, payload, info) {
    if (err) return next(err);
    if (payload) {
      let sql = 'SELECT state, current_start, current_end FROM subscription WHERE subscription_id = ? AND user_id = ? AND practice_id = ?';
      let updateSql = `UPDATE subscription SET state = 'pending' WHERE subscription_id = ? AND user_id = ? AND practice_id = ?`;
      const subscription_id = payload.subscription_id;
      const user_id = payload.user_id;
      const practice_id = payload.practice_id;
          if (subscription_id && user_id && practice_id) {
            db.query(sql, [subscription_id, user_id, practice_id], (err, result) => {
              if (err) throw err;
              if (result.length && (result[0].state === 'halted' || result[0].state === 'completed' || result[0].state === 'created')) {
                if (result[0].state === 'completed' && moment().isBetween(result[0].current_start, result[0].current_end)) {
                  next();
                } else {
                  // response end with subscription_id is above state follow the instructions to continue using the software
                  console.log('state: halted or cancelled or completed or created'.red);
                  res.status(402).send({error: `The subscription ${subscription_id} is in ${result[0].state} state.`, state: result[0].state}); 
                }
              } else if (result.length && (result[0].state === 'active' || result[0].state === 'pending')) {
                if (result[0].state === 'active' && !(moment().isBetween(result[0].current_start, result[0].current_end))) {
                  console.log('active if: '.yellow);
                  // notify superadmin
                  let sql = `SELECT * FROM practice WHERE practice_id=?`;
                  let query = db.query(sql,practice_id, (err, resultpractice) => {
                    let users = [
                      {
                        sub_id:subscription_id,
                        user_id: user_id,
                        practice_id: practice_id,
                        practice_details: resultpractice[0],
                        email: 'sagar@animapp.in'
                      }
                    ];
                    loadTemplate('subendnotifyadmin', users).then((results) => {
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
                      db.query(updateSql, [subscription_id, user_id, practice_id], (err, result) => {
                        if (err) throw err;
                      });
                      next();
                    });
                  });
                } else if (result[0].state === 'active' || result[0].state === 'pending') {
                  console.log('active or pending'.yellow);
                  next();
                }
                console.log('state is active or pending'.green);
              } else {
                console.log('subscription id not present in database'.blue);
                // response end with subscription_id not present in the database
                res.status(402).send({error: `The subscription_id is not present in the database.`, subscription_id: subscription_id});
              }
            });
          } else {
            console.log('subscription id not present in token'.yellow);
            // response end with subscription_id not present in the token
            res.status(402).send({error: `The subscription_id is not present in the token.`});
          }
    }
  })(req, res, next);
};

app.use('/api/soap', subscriptionChecker);
app.use('/api/patient', subscriptionChecker);
app.use('/api/billing', subscriptionChecker);
app.use('/api/settings', subscriptionChecker);
app.use('/api/inventory', subscriptionChecker);

app.use('/api', api);

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });
app.get('/', (req, res) => {
  res.status(200).send('HELLO WORLD');
});


const server = app.listen(app.get('port'), function() {
  console.log('Server is running on port', app.get('port'));
});

// const server = app.listen(5001, ()=>{
//   console.log('Server is running on port ',server.address().port);
// })

//after ends


const io = global.socketIO = socket(server);

const users = global.users = {};

io.on('connection', function (socket) {
  // console.log('ws connection established with client: ', socket.id);

  // Initial handshake to get the client info
  socket.emit('hello');
  // socket.on('register', function (data) {
  //   // console.log('all users currently connected are: '.green, users);
  // });

  socket.on('disconnect', function(data) {
    // console.log('one socket connection disconnected: ', socket.id);
    // analyze and remove the disconnected socket connenction from the user object
  });
});