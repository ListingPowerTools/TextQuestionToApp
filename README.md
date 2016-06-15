## Text Question To App
### Installation
 - Create Twilio Phone Number and point SMS webhook to the application input endpoint.
 - Enable Twilio WhitePage Caller ID Identification Lookup
 - Add database & Twilio environment variables to the server ~/.bash_profile
```
export TWILIO_SID=""
export TWILIO_AUTH=""
export MYSQL_DATABASE=""
export MYSQL_HOST=""
export MYSQL_USERNAME=""
export MYSQL_PASSWORD=""
export PORT=3000
```
 - NPM Install Process Manager (PM2)
 - Run Pm2 start

### Index Page
Index page pulls questions to the question page in Descending order.


`callerIdRaw` table column is base64 encoded so it can fit large amount of data that gets pulled from WhitePages CallerId.

### Database Table Schemes
#### Question Table
```sql
CREATE TABLE `question` (
  `qid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fromPhoneNumber` varchar(40) DEFAULT NULL,
  `text` text,
  `raw` text,
  `city` varchar(50) DEFAULT NULL,
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `callerIdRaw` text,
  `state` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`qid`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
```

#### Activation Table
```sql
CREATE TABLE `activation` (
  `aid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fromPhoneNumber` varchar(40) DEFAULT NULL,
  `text` text,
  `raw` text,
  `city` varchar(50) DEFAULT NULL,
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `callerIdRaw` text,
  `state` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
```