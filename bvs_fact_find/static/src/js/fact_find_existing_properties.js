odoo.define('bvs_fact_find.fact_find_existing_properties_multiple', function(require) {
    "use strict";

var publicWidget = require('web.public.widget');
var core = require('web.core');
var ajax = require('web.ajax');
var rpc = require('web.rpc');
var core = require('web.core');
var QWeb = core.qweb;
var _t = core._t;

    publicWidget.registry.generic_form_data_existing_properties = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_existing_properties': '_onClickExistingProperties',
            'click .remove_line': '_onClickRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

        _onClickRemoveLine: function(ev) {
            $(ev.currentTarget).closest('tr.relationship').remove();
        },

         _onClickExistingProperties: function(ev) {
      ev.preventDefault();

      const $div = $('.existing_properties_multiple');
      const $row = $div.find('.existing_properties_project');
      const $newRow = $row.clone(true);

      $div.append($newRow);
    },

     _onFactFindSubmit: function(ev) {
           var self = this;
    let existingPropertyData = [];
    $('.existing_properties_project').each(function() {
    const houseNumber = $('input[name="house_number"]', this).val();
    const postcode = $('input[name="postcode"]', this).val();
    const streetAddress = $('textarea[name="street_address"]', this).val();
    const county = $('input[name="county"]', this).val();
    const propertyUsage = $('select[name="property_usage"]', this).val();
    const propertyType = $('select[name="property_type"]', this).val();
    const bedrooms = $('input[name="bedrooms"]', this).val();
    const currentPropertyValuation = $('input[name="current_property_valuation"]', this).val();
    const tenure = $('select[name="tenure"]', this).val();
    const hasMortgage = $('input[name="has_mortgage"]', this).is(':checked') ? 1 : 0;
    const groundRent = $('input[name="ground_rent"]', this).val();
    const serviceCharge = $('input[name="service_charge"]', this).val();
//    const firstLetDate = $('input[name="first_let_date"]', this).val();
    const monthlyRentalIncome = $('input[name="monthly_rental_income"]', this).val();
    const isHmo = $('input[name="is_hmo"]', this).is(':checked') ? 1 : 0;
//    const htbSchemeAvailable = $('select[name="htb_scheme_available"]', this).val();
//    const htbSchemeLocation = $('select[name="htb_scheme_location"]', this).val();
//    const redeemHtbLoan = $('select[name="redeem_htb_loan"]', this).val();
//    const sharedOwnershipAvailable = $('select[name="shared_ownership_available"]', this).val();
//    const ownershipPercentage = $('select[name="ownership_percentage"]', this).val();
//    const secondChargeProperty = $('select[name="second_charge_property"]', this).val();
//    const secondChargeDetails = $('textarea[name="second_charge_details"]', this).val();

    if ( houseNumber || postcode ||streetAddress || county ||propertyUsage ||propertyType ||bedrooms ||currentPropertyValuation ||tenure ||hasMortgage ||groundRent ||serviceCharge || monthlyRentalIncome ||isHmo ) {

      existingPropertyData.push({
        house_number: houseNumber,
        postcode: postcode,
        street_address: streetAddress,
        county: county,
        property_usage: propertyUsage,
        property_type: propertyType,
        bedrooms: bedrooms,
        current_property_valuation: currentPropertyValuation,
        tenure: tenure,
        has_mortgage: hasMortgage,
        ground_rent: groundRent,
        service_charge: serviceCharge,
//        first_let_date: firstLetDate,
        monthly_rental_income: monthlyRentalIncome,
        is_hmo: isHmo,
//        htb_scheme_available: htbSchemeAvailable,
//        htb_scheme_location: htbSchemeLocation,
//        redeem_htb_loan: redeemHtbLoan,
//        shared_ownership_available: sharedOwnershipAvailable,
//        ownership_percentage: ownershipPercentage,
//        second_charge_property: secondChargeProperty,
//        second_charge_details: secondChargeDetails,

      });

    }

  });
    if (existingPropertyData.length > 0) {
      document.querySelector('textarea[name="existing_properties_ids"]').value = JSON.stringify(existingPropertyData);
    }
}


    });
});
