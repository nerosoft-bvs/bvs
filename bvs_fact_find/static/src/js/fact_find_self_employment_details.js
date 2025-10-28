odoo.define('bvs_fact_find.fact_find_self_employment_details', function(require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    var core = require('web.core');

    var _t = core._t;

    publicWidget.registry.generic_form_data_self_employment_details = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_self_employment_details_project': '_onClickAddSelfEmploymentDetails',
            'click .remove_line': '_onClickRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

        _onClickRemoveLine: function(ev) {
            $(ev.currentTarget).closest('.self_employment_details').remove();
        },

        _onClickAddSelfEmploymentDetails: function(ev) {
            ev.preventDefault();
            const $div = $('.self_employment_details_multiple');
            const $row = $div.find('.self_employment_details');
            const $newRow = $row.clone(true);
            $newRow.find('.employment_details').val('');
            $div.append($newRow);
        },

        _onFactFindSubmit: function(ev) {
            const one2manyFieldData = [];

            $('.self_employment_details').each(function() {
                const selfEmploymentType = $('#self_employment_type', this).val();
                const businessName = $('#business_name', this).val();
                const selfEmployedOccupation = $('#self_employed_occupation', this).val();
                const selfEmploymentStartDate = $('#self_employment_start_date', this).val();
                const taxYear1 = $('#tax_year_1', this).val();
                const year1TaxIncome = $('#year_1_tax_income', this).val();
                const taxYear2 = $('#tax_year_2', this).val();
                const year2TaxIncome = $('#year_2_tax_income', this).val();
                const businessAddress = $('#business_address', this).val();
                const hasBusinessBankAccount = $('input[name="business_bank_account"]:checked', this).val();
                const hasAccountant = $('input[name="has_accountant"]:checked', this).val();
                const firmName = $('#firm_name', this).val();
                const address = $('#address', this).val();
                const contactNumber = $('#contact_number', this).val();
                const qualification = $('#qualification', this).val();
                const letPropertiesCount = $('#let_properties_count', this).val();

                if (
                    selfEmploymentType || businessName || selfEmployedOccupation || selfEmploymentStartDate ||
                    taxYear1 || year1TaxIncome || taxYear2 || year2TaxIncome || businessAddress ||
                    hasBusinessBankAccount || hasAccountant || firmName || address || contactNumber ||
                    qualification || letPropertiesCount
                ) {
                    one2manyFieldData.push({
                        self_employment_type: selfEmploymentType,
                        business_name: businessName,
                        self_employed_occupation: selfEmployedOccupation,
                        self_employment_start_date: selfEmploymentStartDate,
                        tax_year_1: taxYear1,
                        year_1_tax_income: year1TaxIncome,
                        tax_year_2: taxYear2,
                        year_2_tax_income: year2TaxIncome,
                        business_address: businessAddress,
                        has_business_bank_account: hasBusinessBankAccount,
                        has_accountant: hasAccountant,
                        firm_name: firmName,
                        address: address,
                        contact_number: contactNumber,
                        qualification: qualification,
                        let_properties_count: letPropertiesCount,
                    });
                }
            });

            if (one2manyFieldData.length > 0) {
                document.querySelector('textarea[name="self_employment_ids"]').value = JSON.stringify(one2manyFieldData);
            }
        }
    });
});
