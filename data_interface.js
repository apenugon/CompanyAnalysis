// data_interface.js
// =================
//
// This file aggregates data from our data sources, and creates a single JSON to send back

module.exports = {
  get_data: function(callback) {
    aggregateData(callback);
  }
};

const regression = require('regression');
const webarchive = require('./webarchive');
const amazon = require('./amazon');

function aggregateData(callback) {
var current_month = (new Date()).getMonth();

webarchive.get_monthly_revenue(current_month, function(monthly_revenue) {

var revenue_to_employee_factor = monthly_revenue[6].revenue/14.0;
console.log(revenue_to_employee_factor);

  amazon.get_monthly_visits(current_month, function(monthly_visits) {
    var cash_on_hand = 4000000;
    var consolidated_data = monthly_visits.map(function(month_visits, i) {
      // Here we will aggregate all other costs as well
      var n_employees = monthly_revenue[i].revenue / revenue_to_employee_factor;
      
      var costs = 0;
      costs += 66; // For intercom.io basic
      costs += 5; // 1and1 email/hosting
      costs += month_visits.visits/40; // Amazon costs
      costs += 149; // New Relic
      costs += 130000/12 * n_employees; //Employees salary
      costs += 4; // Keen.io
      costs += 75 * 150 * n_employees; // Employees real estate
      cash_on_hand = cash_on_hand - costs;
      return {month: month_visits.month, visits: month_visits.visits, revenue: monthly_revenue[i].revenue, costs: costs, coh: cash_on_hand};
    });
    console.log(cash_on_hand);

    var revenue_model = regression.exponential(monthly_revenue.map(mr => [mr.month, mr.revenue]));
    var visits_model = regression.exponential(monthly_visits.map(mv => [mv.month, mv.visits]));
   
    var current_cash_on_hand = cash_on_hand;
    // Model the future, until Amper is out of cash
    var month = current_month + 1;
    while (cash_on_hand > 0) {
   // Here we will aggregate all other costs as well
      var visits = visits_model.predict(month)[1];
      var revenue = revenue_model.predict(month)[1];
      var n_employees = revenue / revenue_to_employee_factor;
      
      var costs = 0;
      costs += 66; // For intercom.io basic
      costs += 5; // 1and1 email/hosting
      costs += visits/40; // Amazon costs
      costs += 149; // New Relic
      costs += 130000/12 * n_employees; //Employees salary
      costs += 4; // Keen.io
      costs += 75 * 150 * n_employees; // Employees real estate
      cash_on_hand = cash_on_hand - costs;
      consolidated_data.push({month: month, visits: visits, revenue: revenue, costs: costs, coh: cash_on_hand});
      month = month + 1;
      console.log(month);
    }
    console.log(consolidated_data);

    // For UX: Need to provide:
    callback({
      current_coh: current_cash_on_hand,
      coh_over_time: consolidated_data.map(cd => cd.coh),
      revenue_over_time: consolidated_data.map(cd => cd.revenue),
      costs_over_time: consolidated_data.map(cd => cd.costs),
      loss_over_time: consolidated_data.map(cd => cd.revenue - cd.costs),
      current_month: current_month,
    })
  });
});
}
