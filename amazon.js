// amazon.js
// =========
//
// Include all of the files from Amazon, so that we don't need to do anything else

module.exports = {
  get_monthly_visits: function(current_month, callback) {
    module.monthly_visits = [];
    module.final_month = current_month
    getAmazonDataByMonth(3, callback);
  }
}

var awis = require('awis');

var client = awis({
    key: process.env.AWSACCESSKEYID,
    secret: process.env.AWSSECRETACCESSKEY
});

function getAmazonDataByMonth(month, callback) {
  monthString = month.toString();
  if (month < 10) {
    monthString = '0' + monthString;
  }
client({
    'Action': 'TrafficHistory',
    'Url': 'ampermusic.com',
    'ResponseGroup': 'History',
    'Start': '2017' + monthString + '01',
    'Range': '1'
}, function (err, data) {
    // Using equation from http://netberry.co.uk/alexa-rank-explained.htm,
    // convert Alexa rank to monthly visitors
    var rank = data.trafficHistory.historicalData.data.rank;
    var visitors = 104943144672 * Math.pow(rank, -1.008);

    module.monthly_visits.push({month: month, visits: visitors});
    if (month < module.final_month) {
      getAmazonDataByMonth(month+1, callback);
    } else {
      callback(module.monthly_visits);
    }
});

}
