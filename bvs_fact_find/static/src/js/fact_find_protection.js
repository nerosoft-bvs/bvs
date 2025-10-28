odoo.define('bvs_fact_find.fact_find_protection_multiple', function(require) {
    "use strict";

var publicWidget = require('web.public.widget');
var core = require('web.core');
var ajax = require('web.ajax');
var rpc = require('web.rpc');
var core = require('web.core');
var QWeb = core.qweb;
var _t = core._t;

    publicWidget.registry.generic_form_data_protection = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_protection': '_onClickProtection',
            'click .remove_line': '_onClickRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

        _onClickRemoveLine: function(ev) {
            $(ev.currentTarget).closest('tr.protection_table').remove();
        },

        _onClickProtection: function(ev) {
          ev.preventDefault();

          const $table = $('.protection_multiple');
          const $row = $table.find('.protection_table');
          const $newRow = $row.clone(true);

          $table.append($newRow);
        },

         _onFactFindSubmit: function(ev) {

           var self = this;

     let propertyData = [];
       $('.protection_lines > tbody > tr').each(function() {
    let insuranceProvider = $(this).find('input[name="insurance_provider"]').val();
    let monthlyPremium = $(this).find('input[name="monthly_premium"]').val();
    let protectionType = $(this).find('select[name="protection_type"]').val();
    console.log (insuranceProvider, monthlyPremium, protectionType)


    if (insuranceProvider, monthlyPremium, protectionType) {
      propertyData.push({
        insurance_provider: insuranceProvider,
        monthly_premium: monthlyPremium,
        protection_type: protectionType,

      });
     }
     })

        if (propertyData.length > 0) {
        document.querySelector('textarea[name="protection_ids"]').value = JSON.stringify(propertyData) ;
    }

    },

    });
});
