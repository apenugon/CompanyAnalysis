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

function collectCosts(amazon_costs, employees) {
  var costs = 0;
  costs += 66; // For intercom.io basic
  costs += 5; // 1and1 email/hosting
  costs += amazon_costs; // Amazon costs
  costs += 149; // New Relic
  costs += 130000/12 * employees; //Employees salary
  costs += 4; // Keen.io
  costs += 75 * 150 * employees; // Employees real estate
  return costs;
}

function createModel(array) {
  return regression.exponential(array.map((v, i) => [i, v]))
}

function aggregateData(callback) {
  var months_since_2017 = (new Date()).getMonth() + ((new Date()).getFullYear()-2017)*12;
  var shift = 3 //Since we are starting in March 2017

  webarchive.get_monthly_revenue(shift, months_since_2017, function(monthly_revenue) {
    // Use a past month to estimate this
    var revenue_to_employee_factor = monthly_revenue[6]/14.0;

    amazon.get_monthly_visits(shift, months_since_2017, function(monthly_visits) {
      var cash_on_hand = 4000000; //From previous funding round
      n_months = months_since_2017 - shift + 1

      costs = new Array(n_months)
      coh = new Array(n_months)

      // Get employees from revenue
      monthly_employees = monthly_revenue.map(r => r/revenue_to_employee_factor)

      // Get amazon costs scaled to monthly visits
      monthly_amazon_costs = monthly_visits.map(v => v/40)

      for (var i = 0; i < n_months; i++) {
        costs[i] = collectCosts(monthly_amazon_costs[i], monthly_employees[i])
        cash_on_hand = cash_on_hand - costs[i];
        coh[i] = cash_on_hand
      }

      // Create models for revenue/visits
      var revenue_model = createModel(monthly_revenue)
      var employee_model = createModel(monthly_employees);
      var amazon_costs_model = createModel(monthly_amazon_costs);
     
      // Model the future, until Amper is out of cash
      var month = n_months + 1;
      while (cash_on_hand > 0) {
        cost = collectCosts(amazon_costs_model.predict(month)[1], employee_model.predict(month)[1])
        costs.push(cost)

        cash_on_hand = cash_on_hand - cost
        coh.push(cash_on_hand)

        monthly_revenue.push(revenue_model.predict(month)[1])

        month+=1
      }

      // For UX: Need to provide:
      callback({
        coh_over_time: coh,
        revenue_over_time: monthly_revenue,
        costs_over_time: costs,
        months_since_2017: months_since_2017,
        current_month: months_since_2017,
      })
    });
  });
}
