var express = require('express');
var router = express.Router();
var LookupsClient = require('twilio').LookupsClient;
var RestClient = require('twilio').RestClient;

var twilioLookUpClient = new LookupsClient(process.env['TWILIO_SID'], process.env['TWILIO_AUTH']);
var twilioRestClient = new RestClient(process.env['TWILIO_SID'], process.env['TWILIO_AUTH']);


var base64 = {
  encode: function(unencoded) {
    return new Buffer(unencoded).toString('base64');
  },
  decode: function(encoded) {
    return new Buffer(encoded, 'base64').toString('utf8');
  }
};

/*
Uses white pages to get callers information
*/
var callerId = function(phoneNumber, callback) {
  twilioLookUpClient.phoneNumbers(phoneNumber).get({
    type: 'carrier',
    addOns: 'whitepages_pro_caller_id'
  }, function(error, number) {

    return callback(error,number);
  })
}



/*
Save All Questions into the database
*/
var saveQuestion = function(question, callback) {
  MYSQL_CONNECTION.query('INSERT INTO question SET ?', question, function(err, result) {
    callback(err, result);
  });
}


/*
Save All activations into the database
*/
var saveActivation = function(question, callback) {
  MYSQL_CONNECTION.query('INSERT INTO activation SET ?', question, function(err, result) {
    callback(err, result);
  });
}










router.get('/', function(req, res, next) {
  var limit = req.params.limit || 100; 
  MYSQL_CONNECTION.query('SELECT * FROM question ORDER BY qid DESC LIMIT '+limit, function(err, result) {
    if (err) return res.json(500).status({
      error: err
    });

    return res.status(200).json(result);
  });
});

router.post('/', function(req, res, next) {
  var text = req.body;
  var question = {
    fromPhoneNumber: text.From,
    text: text.Body,
    city: text.FromCity,
    state: text.FromState,
    raw: base64.encode(JSON.stringify(text)),
    callerIdRaw: ""
  };


  /*
   Basic filtering to prevent accidents.
  */
  if (question.text.length <= 2) {
    return res.status(500).json({
      error: "text too small"
    });
  }


  callerId(question.fromPhoneNumber, function(error, number) {
    if(error){
      console.log(error);
    }
    
      try {
        /*
        This needs to be in a trycatch so if it fails the system does not crash.
        */
        question.callerIdRaw = base64.encode(JSON.stringify(number.addOns.results['whitepages_pro_caller_id'].result.results));
      } catch (e) {
        console.error(e);
      }
    

    
    /*
    Text for people texting activations will only have numbers.
    */
    var CheckIfActivationNumber = parseInt(question.text);
    
    
    

    if (isNaN(CheckIfActivationNumber)) {
      saveQuestion(question, function(error, response) {
        if(error) return res.status(500).json({error:error});
        
        res.status(200).json({response:"Question Saved"});
      });
    } else {
      saveActivation(question, function(error, response) {
        if(error) return res.status(500).json({error:error});


        twilioRestClient.sms.messages.create({
          to:question.fromPhoneNumber,
          from:'+1386-267-6604',
          body:'Your ticket has been activated. Text your questions for the panelists to this phone number. Thank you.'
        }, function(error, message) {
          // The HTTP request to Twilio will run asynchronously. This callback
          // function will be called when a response is received from Twilio
          // The "error" variable will contain error information, if any.
          // If the request was successful, this value will be "falsy"
          if (!error) {
            // The second argument to the callback will contain the information
            // sent back by Twilio for the request. In this case, it is the
            // information about the text messsage you just sent:
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
          } else {
            console.log('Oops! There was an error.');
          }
          res.status(200).json({response:"Activation Saved"});

        });






      });
    }


  });
});
module.exports = router;