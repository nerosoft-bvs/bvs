odoo.define('bvs_fact_find.fact_find_adverse_credit_multiple', function(require) {
    "use strict";

var publicWidget = require('web.public.widget');
var core = require('web.core');
var ajax = require('web.ajax');
var rpc = require('web.rpc');
var core = require('web.core');
var QWeb = core.qweb;
var _t = core._t;


    publicWidget.registry.generic_form_data_adverse_credit = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_adverse_credits': '_onClickAdverseCredit',
            'click .remove_line': '_onClickRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

        _onClickRemoveLine: function(ev) {
            $(ev.currentTarget).closest('tr.adverse_credit').remove();
        },

        _onClickAdverseCredit: function(ev) {
          ev.preventDefault();

          const $table = $('.adverse_credit_table');
          const $row = $table.find('.adverse_credit_multiple');
          const $newRow = $row.clone(true);

          $table.append($newRow);
        },


        _onFactFindSubmit: function(ev) {

           var self = this;

     let adverseCreditData = [];
       $('.adverse_credit_table > tbody > tr').each(function() {
    let adverseCreditType = $(this).find('input[name="adverse_credit_type"]').val();
    let totalCount = $(this).find('input[name="total_count"]').val();
    let loanType = $(this).find('input[name="loan_type"]').val();
    let lenderName = $(this).find('input[name="lender"]').val();
    let amountTotal = $(this).find('input[name="amount"]').val();
    let reportedOnCalendar = $(this).find('input[name="reported_on"]').val();
    let settledOnCalendar = $(this).find('input[name="settled_on"]').val();
    console.log (adverseCreditType, totalCount, loanType, lenderName , amountTotal, reportedOnCalendar,settledOnCalendar)


    if (adverseCreditType, totalCount, loanType, lenderName , amountTotal, reportedOnCalendar,settledOnCalendar) {
      adverseCreditData.push({
        adverse_credit_type: adverseCreditType,
        total_count: totalCount,
        loan_type: loanType,
        lender: lenderName,
        amount: amountTotal,
        reported_on: reportedOnCalendar,
        settled_on: settledOnCalendar,

      });
     }
     })

        if (adverseCreditData.length > 0) {
        document.querySelector('textarea[name="adverse_credit_ids"]').value = JSON.stringify(adverseCreditData) ;
    }

    },

    });
});
