$(function () {
    var socket = io();
    socket.on('data', function(data) {
        console.log(data)
        $("#coh").text(data.coh_over_time.length-data.current_month+1)
        var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container_coh'
            },
            title: {
                text: 'Cash on Hand',
                x: -20 //center
            },
            subtitle: {
                text: '(Displayed by months from December 2016)',
                x: -20
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function() {
                       return this.value;
                    }
                }
            },
            yAxis: {
                title: {
                    text: '$ (USD)'
                },
            },
            plotOptions: {
                series: {
                    pointStart: 3
                }
            },
            series: [{
                name: 'Current',
                type: 'areaspline',
                color: '#4572A7',
                data: data.coh_over_time.slice(0,data.current_month-2)
            }, {
                name: 'Future',
                dashStyle: 'dot',
                color: '#4572A7',
                data: data.coh_over_time.map(function (e, i) { return [i+3, e]}).slice(data.current_month-3)
            }]
        });
        Highcharts.chart('container_rev_costs', {

            title: {
                text: 'Estimated Revenue and Costs'
            },

            subtitle: {
                text: '(Displayed by months from December 2016)'
            },

            yAxis: {
                title: {
                    text: '$(USD)'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 0
                }
            },

            series: [{
                name: 'Revenue',
                data: data.revenue_over_time.slice(0,data.current_month-3)
            }, {
                name: 'Costs',
                data: data.costs_over_time.slice(0,data.current_month-3)
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });

    });
    
    
});