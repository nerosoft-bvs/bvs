 odoo.define('bvs_fact_find.fact_find_employment_details', function(require) {
    "use strict";


var publicWidget = require('web.public.widget');
var core = require('web.core');
var ajax = require('web.ajax');
var rpc = require('web.rpc');
var core = require('web.core');
var QWeb = core.qweb;
var _t = core._t;


    publicWidget.registry.generic_form_data_employment_details = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_employment_details_project': '_onClickAddEmploymentDetails',
            'click .remove_line': '_onClickRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

         _onClickRemoveLine: function(ev) {
        $(ev.currentTarget).closest('employment_details').remove();
    },

        _onClickAddEmploymentDetails: function(ev) {
          ev.preventDefault();

          const $div = $('.employment_details_multiple');
          const $row = $div.find('.employment_details');
          const $newRow = $row.clone(true);

//          $newRow.find$('.employment_details').val('');
          $div.append($newRow);
        },

        _onFactFindSubmit: function(ev) {

           var self = this;


    const one2manyFieldData = [];

    $('.employment_details').each(function() {
      const niNumber = $('#ni_number', this).val();
      const anticipatedRetirementAge = $('#anticipated_retirement_age', this).val();
      const employmentBasis = $('#employment_basis', this).val();
      const occupation = $('#occupation', this).val();
      const occupationSector = $('#occupation_sector', this).val();
      const employmentType = $('#employment_type', this).val();
      const employerName = $('#employer_name', this).val();
      const addressOfWorkingPlace = $('#address_of_working_place', this).val();
      const workTelephone = $('#work_telephone', this).val();
//      const startDate = $('#start_date', this).val();
//      const endDate = $('#end_date', this).val();
//      const currentContractStartDate = $('#current_contract_start_date', this).val();
//      const currentContractEndDate = $('#current_contract_end_date', this).val();
      const yearsOfExperienceContractBasis = $('#years_of_experience_contract_basis', this).val();
      const monthlyGrossSalary = $('#monthly_gross_salary', this).val();
      const annualBonus = $('#annual_bonus', this).val();
      const annualSalary = $('#annual_salary', this).val();
//      const hasDeductions = $('#has_deductions', this).is(':checked') ? 1 : 0;
//      const studentLoans = $('#student_loans', this).val();
//      const postGraduateLoan = $('#post_graduate_loan', this).val();
//      const gymMembership = $('#gym_membership', this).val();
//      const childcare = $('#childcare', this).val();
      if (niNumber || anticipatedRetirementAge || employmentBasis || occupation || employmentType || employerName || addressOfWorkingPlace || workTelephone || yearsOfExperienceContractBasis || monthlyGrossSalary || annualBonus || annualSalary) {

        one2manyFieldData.push({
          ni_number: niNumber,
          anticipated_retirement_age: anticipatedRetirementAge,
          employment_basis: employmentBasis,
          occupation: occupation,
          occupation_sector: occupationSector,
          employment_type: employmentType,
          employer_name: employerName,
          address_of_working_place: addressOfWorkingPlace,
          work_telephone: workTelephone,
//          start_date: startDate,
//          end_date: endDate,
//          current_contract_start_date: currentContractStartDate,
//          current_contract_end_date: currentContractEndDate,
          years_of_experience_contract_basis: yearsOfExperienceContractBasis,
          monthly_gross_salary: monthlyGrossSalary,
          annual_bonus: annualBonus,
          annual_salary: annualSalary,
//          has_deductions: hasDeductions,
//          student_loans: studentLoans,
//          post_graduate_loan: postGraduateLoan,
//          gym_membership: gymMembership,
//          childcare: childcare,
        });
      }
    });
    if (one2manyFieldData.length > 0) {
      document.querySelector('textarea[name="employment_details_ids"]').value = JSON.stringify(one2manyFieldData);
    }
}
    });
});
