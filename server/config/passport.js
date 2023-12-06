const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('./connections');
const config = require('../config/database');

module.exports = function(passport) {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		console.log('checkingssss');
		if(jwt_payload.user_id){
			let sql = 'SELECT * FROM user WHERE user_id=?';
			let query = db.query(sql,[jwt_payload.user_id],(err,result, fields) =>{
			  console.log('changinggg');
			  if (err) {
				  console.log('error212');
				  return done(err, false);
			  }
			  if (query) {
				  console.log('error7777');
				  return done(null, jwt_payload);
			  } else {
				  console.log('error2222');
				  return done(null, false);
			  }
		  });
		} else if (jwt_payload.pet_parent_id){
			console.log('chekinngg pet parent')
			let sql = 'SELECT * FROM pet_parent WHERE pet_parent_id=?';
			  let query = db.query(sql,[jwt_payload.pet_parent_id],(err,result, fields) =>{
				if (err) {
					console.log('error212');
					return done(err, false);
				}
				if (result.length) {
					console.log('error7777');
					return done(null, jwt_payload);
				} else {
					console.log('error2222');
					return done(null, false);
				}
			});
		} else {
			return done(null, false);
		}
	}));
}
// after ends
