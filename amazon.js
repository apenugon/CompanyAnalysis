// amazon.js
// =========
//
// Include all of the files from Amazon, so that we don't need to do anything else

module.exports = {
  get_monthly_visits: function(shift, current_month, callback) {
    module.monthly_visits = [];
    module.final_month = current_month
    getAmazonDataByMonth(shift, callback);
  }
}

var awis = require('awis');

var client = awis({
    key: process.env.AWSACCESSKEYID,
    secret: process.env.AWSSECRETACCESSKEY
});

function getAmazonDataByMonth(month, callback) {
  years = Math.floor(month/12)
  yearString = (2017+years).toString()

  monthForRequest = month % 12 == 0 ? 12 : month % 12
  monthString = monthForRequest.toString();
  if (monthForRequest < 10) {
    monthString = '0' + monthString;
  }
client({
    'Action': 'TrafficHistory',
    'Url': 'ampermusic.com',
    'ResponseGroup': 'History',
    'Start': yearString + monthString + '01',
    'Range': '1'
}, function (err, data) {
    // Using equation from http://netberry.co.uk/alexa-rank-explained.htm,
    // convert Alexa rank to monthly visitors
    var rank = data.trafficHistory.historicalData.data.rank;
    var visitors = 104943144672 * Math.pow(rank, -1.008);

    module.monthly_visits.push(visitors);
    if (month < module.final_month) {
      getAmazonDataByMonth(month+1, callback);
    } else {
      callback(module.monthly_visits);
    }
});

}
