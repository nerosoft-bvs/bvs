odoo.define('bvs_fact_find.fact_find_multiple', function(require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;
    var rpc = require('web.rpc');

    publicWidget.registry.generic_form_data = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_total_project': '_onAddTotalProject',
            'click .remove_line': '_onRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
            'click .edit_total_project': '_onEditTotalProject',
        },

        _onAddTotalProject: function(ev) {
            ev.preventDefault();
            let self = this;
            let financialDependants = [];
            let existingFinancialDependants = [];

            // Get the existing financial dependants from the textarea
            let textarea = document.querySelector('textarea[name="financial_depend_ids"]');
            if (textarea.value) {
                existingFinancialDependants = JSON.parse(textarea.value);
            }
            let fullName = $('input[name="full_name"]').val();
            let relationship = $('select[name="relationship"]').val();
            let dependencyType = $('select[name="dependency_type"]').val();
            let monthlyChildcareCost = $('input[name="monthly_childcare_cost"]').val();
            let childcareCostReason = $('textarea[name="childcare_cost_reason"]').val();
            let additionalCost = $('input[name="additional_cost"]').val();

            financialDependants.push({
                relationship: relationship,
//                date_of_birth_fd: dateOfBirth,
                dependency_type: dependencyType,
                monthly_childcare_cost: monthlyChildcareCost,
                childcare_cost_reason: childcareCostReason,
                additional_cost: additionalCost,
            });

            // Clear the input fields
            $('input[name="full_name"]').val('');
            $('select[name="relationship"]').val('');
            $('input[name="date_of_birth_fd"]').val('');
            $('select[name="dependency_type"]').val('');
            $('input[name="monthly_childcare_cost"]').val('');
            $('textarea[name="childcare_cost_reason"]').val('');
            $('input[name="additional_cost"]').val('');

            // Append the values to the card body
            let cardBody = $('.financial_dependants_div').closest('.card-body');
            let html = `
                <div class="card">
                    <div class="card-body">
                        <button type="button" class="btn btn-primary share-button">Share with Applicants</button>
                        <p><span class="field-name">Full Name:</span> <span class="field-value">${fullName}</span></p>
                        <p><span class="field-name">Relationship:</span> <span class="field-value">${relationship}</span></p>
                        <p><span class="field-name">Dependency Type:</span> <span class="field-value">${dependencyType}</span></p>
                        <p><span class="field-name">Monthly Childcare Cost:</span> <span class="field-value">${monthlyChildcareCost}</span></p>
                        <p><span class="field-name">Childcare Cost Reason:</span> <span class="field-value">${childcareCostReason}</span></p>
                        <p><span class="field-name">Additional Cost:</span> <span class="field-value">${additionalCost}</span></p>
                        <button type="button" class="btn btn-primary edit-button edit_total_project"
                            data-full-name="${fullName}"
                            data-relationship="${relationship}"
                            data-dependency-type="${dependencyType}"
                            data-monthly-childcare-cost="${monthlyChildcareCost}"
                            data-childcare-cost-reason="${childcareCostReason}"
                            data-additional-cost="${additionalCost}">
                            Edit
                        </button>
                        <button type="button" class="btn btn-danger delete-button remove_line">Delete</button>
                    </div>
                </div>
            `;

            $(document).on('click', '.remove_line', function() {
                const $deleteButton = $(this);
                const $card = $deleteButton.closest('.card');
                $card.remove();
            });

            $(document).on('click', '.share-button', function() {
                self._shareFinancialDependants();
            });

            cardBody.append(html);

            // Merge the new financial dependants with the existing ones
            financialDependants = existingFinancialDependants.concat(financialDependants);

            // Set the values in the textarea field
            textarea.value = JSON.stringify(financialDependants);

            // Scroll to the form fields
            $('html, body').animate({
                scrollTop: $('select[name="relationship"]').offset().top
            }, 500);
        },

        _onEditTotalProject: function(ev) {
            ev.preventDefault();
            const $editButton = $(ev.currentTarget);
            const fullName = $editButton.data('fullName');
            const relationship = $editButton.data('relationship');
            const dependencyType = $editButton.data('dependencyType');
            const monthlyChildcareCost = $editButton.data('monthlyChildcareCost');
            const childcareCostReason = $editButton.data('childcareCostReason');
            const additionalCost = $editButton.data('additionalCost');

            // Load values into form fields
            $('input[name="full_name"]').val(fullName);
            $('select[name="relationship"]').val(relationship);
            $('select[name="dependency_type"]').val(dependencyType);
            $('input[name="monthly_childcare_cost"]').val(monthlyChildcareCost);
            $('textarea[name="childcare_cost_reason"]').val(childcareCostReason);
            $('input[name="additional_cost"]').val(additionalCost);

            // Remove the record from the card
            $editButton.closest('.card').remove();

            // Scroll to the form fields
            if ($('input[name="relationship"]').length > 0) {
            $('html, body').animate({
                scrollTop: $('select[name="relationship"]').offset().top
            }, 500);
            }
        },

        _onRemoveLine: function(ev) {
            $(ev.currentTarget).closest('div.card').remove();
        },

        _shareFinancialDependants: function() {
            const factFindId = parseInt(this.el.dataset.factFindId);
            const financialDependantsData = JSON.parse(document.querySelector('textarea[name="financial_depend_ids"]').value);

            // Call the RPC function to share the address history details with the lead
            rpc.query({
                model: 'fact.find',
                method: 'share_financial_dependants',
                args: [factFindId, financialDependantsData],
            }).then(function(result) {
                console.log(' shared successfully!');
            }).catch(function(error) {
                console.error('Error sharing:', error);
            });
        },

        _onFactFindSubmit: function(ev) {
            var self = this;

            // Get the existing financial dependants from the textarea
            let textarea = document.querySelector('textarea[name="financial_depend_ids"]');
            let financialDependantsData = textarea.value ? JSON.parse(textarea.value) : [];

            if (financialDependantsData.length > 0) {
                document.querySelector('textarea[name="financial_depend_ids"]').value = JSON.stringify(financialDependantsData);
            }
        },
    });
});
