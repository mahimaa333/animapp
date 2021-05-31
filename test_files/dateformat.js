var moment = require('moment');

function calculateAge(dateOfBirth){
    if(dateOfBirth != null){
        let today = moment();
        let dob = moment(dateOfBirth);
        let diff = today.diff(dob, 'days'); // returns no of days
        let year = Math.floor(diff / 365); // to calculate year
        let month = Math.floor(Math.floor(diff % 365)/31);// to calculate month
        let day = Math.floor(Math.floor(Math.floor(diff % 365)%31)); // to calculate day
        console.log(today.diff(dob, 'days'), year, month, day);
        return `${year}Y ${month}M ${day}D`;
    }    
}

// console.log(calculateAge('2017-08-30'));

function formatDateToISO(dob){
    console.log(dob);
    if(dob == ""){
        dob = null;
    }else{
        let arr = dob.split('/');
        dob = "20"+arr[2]+"-"+arr[1]+"-"+arr[0];
        return dob;
    }    
}
console.log(calculateAge(formatDateToISO('')));