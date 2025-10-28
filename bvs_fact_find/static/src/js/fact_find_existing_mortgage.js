odoo.define('bvs_fact_find.fact_find_existing_mortgage_multiple', function(require) {
    "use strict";

var publicWidget = require('web.public.widget');
var core = require('web.core');
var ajax = require('web.ajax');
var rpc = require('web.rpc');
var core = require('web.core');
var QWeb = core.qweb;
var _t = core._t;

    publicWidget.registry.generic_form_data_existing_mortgage = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_existing_mortgage': '_onClickExistingMortgage',
            'click .remove_line': '_onClickRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

        _onClickRemoveLine: function(ev) {
            $(ev.currentTarget).closest('tr.relationship').remove();
        },

         _onClickExistingMortgage: function(ev) {
      ev.preventDefault();

      const $div = $('.existing_mortgage_multiple');
      const $row = $div.find('.existing_mortgage');
      const $newRow = $row.clone(true);

      $div.append($newRow);
    },

            _onFactFindSubmit: function(ev) {

           var self = this;

  let mortgageData = [];

  $('.existing_mortgage_multiple').each(function() {
    const propertyAddress = $('textarea[name="property_address"]', this).val();
    const usage = $('select[name="usage"]', this).val();
    const ownershipOfDeed = $('select[name="ownership_of_deed"]', this).val();
    const currentPropertyValuation = $('input[name="current_property_valuation"]', this).val();
    const outstandingMortgageAmount = $('input[name="outstanding_mortgage_amount"]', this).val();
    const monthlyPayment = $('input[name="monthly_payment"]', this).val();
    const lender = $('input[name="lender"]', this).val();
    const accountNo = $('input[name="account_no"]', this).val();
    const rateType = $('select[name="rate_type"]', this).val();
    const currentRate = $('input[name="current_rate"]', this).val();
    const remainingTerm = $('input[name="remaining_term"]', this).val();
    const repaymentMethod = $('select[name="repayment_method"]', this).val();
    const remortgageDate = $('input[name="remortgage_date"]', this).val();
    const mortgageCaseNumber = $('input[name="mortgage_case_number"]', this).val();
    const propertyPurchasedDate = $('input[name="property_purchased_date"]', this).val();
    const propertyPurchasedPrice = $('input[name="property_purchased_price"]', this).val();


    if (propertyAddress || usage || ownershipOfDeed || currentPropertyValuation || outstandingMortgageAmount || monthlyPayment || lender || accountNo || rateType || currentRate || remainingTerm || repaymentMethod || remortgageDate || mortgageCaseNumber || propertyPurchasedDate || propertyPurchasedPrice) {

      mortgageData.push({

        property_address: propertyAddress,

        usage: usage,

        ownership_of_deed: ownershipOfDeed,

        current_property_valuation: currentPropertyValuation,

        outstanding_mortgage_amount: outstandingMortgageAmount,

        monthly_payment: monthlyPayment,

        lender: lender,

        account_no: accountNo,

        rate_type: rateType,

        current_rate: currentRate,

        remaining_term: remainingTerm,

        repayment_method: repaymentMethod,

        remortgage_date: remortgageDate,

        mortgage_case_number: mortgageCaseNumber,

        property_purchased_date: propertyPurchasedDate,

        property_purchased_price: propertyPurchasedPrice,

      });

    }

  });
    if (mortgageData.length > 0) {
      document.querySelector('textarea[name="existing_mortgages_ids"]').value = JSON.stringify(mortgageData);
    }
}


    });
});
