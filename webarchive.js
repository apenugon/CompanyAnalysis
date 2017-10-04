// webarchive.js
// =============
//
// This file allows us to get data back from WebArchive, about the number of clients in the showcase each month

module.exports = {
  // Calls callback with a tuple containing (month, number of clients)
  get_monthly_revenue: function(current_month, callback) {
    module.monthly_revenue = [];
    module.overall_customers = new Set();
    module.overall_customers.add("Grange Productions"); // Initial Customer, found manually
    getSnapshotResultsByMonth(3, current_month, callback);
  },
}

DEAL_SIZE_ESTIMATE=8000;

const axios = require('axios');
const cheerio = require('cheerio');

function getSnapshotResultsByMonth(month, final_month, callback) { 
  monthString = month.toString();
  if (month < 10) {
    monthString = '0' + monthString;
  }
  console.log("Month: " + month);
axios.get('http://archive.org/wayback/available?url=ampermusic.com&timestamp=2017'+monthString + "01")
  .then(response => {
    if (response.data.archived_snapshots.closest == undefined) {
      getSnapshotResultsByMonth(month, final_month, callback)
    } else {
      axios.get(response.data.archived_snapshots.closest.url)
        .then(response => {
          var $ = cheerio.load(response.data);

          var customers = []
          $('.oc-item').each(function() {
            customers.push($(this).not('.oc-item-press').children('a').find("img").attr('alt'));
          });
          customers = customers.filter(n => n);
          customers.map(n => module.overall_customers.add(n));

          // Here we will convert # clients to revenue - estimate of deal size is ~$8000
          module.monthly_revenue.push({month: month, revenue: module.overall_customers.size * DEAL_SIZE_ESTIMATE});

          // Call next iteration
          if (month < final_month) {
            getSnapshotResultsByMonth(month+1, final_month, callback);
          } else {
            callback(module.monthly_revenue);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  })
  .catch(error => {
    console.log(error);
  });
}

