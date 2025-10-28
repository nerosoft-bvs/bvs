odoo.define('bvs_fact_find.fact_find_credit_comment_multiple', function(require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;
    var rpc = require('web.rpc');

    publicWidget.registry.generic_form_data_credit_comment = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_credit_comment': '_onAddCreditComment',
            'click .remove_line': '_onRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
            'click .edit_credit_comment': '_onEditCreditComment',
        },

        _onAddCreditComment: function(ev) {
            ev.preventDefault();
            let self = this;
            let creditCommitments = [];
            let existingCreditCommitments = [];

            // Get the existing credit commitments from the textarea
            let textarea = document.querySelector('textarea[name="credit_comment_ids"]');
            if (textarea.value) {
                existingCreditCommitments = JSON.parse(textarea.value);
            }

            let commitmentType = $('select[name="commitment_type"]').val();
            let lenderName = $('input[name="lender"]').val();
            let outstandingAmount = $('input[name="outstanding_amount"]').val();
            let monthlyPayment = $('input[name="monthly_payment"]').val();
            let creditLimit = $('input[name="credit_limit"]').val();
            let remainingMonths = $('input[name="remaining_months"]').val();
            let intendToRepay = $('input[name="intend_to_repay"]').is(':checked') ? 1 : 0;

            creditCommitments.push({
                commitment_type: commitmentType,
                lender: lenderName,
                outstanding_amount: outstandingAmount,
                monthly_payment: monthlyPayment,
                credit_limit: creditLimit,
                remaining_months: remainingMonths,
                intend_to_repay: intendToRepay,
            });

            // Clear the input fields
            $('select[name="commitment_type"]').val('');
            $('input[name="lender"]').val('');
            $('input[name="outstanding_amount"]').val('');
            $('input[name="monthly_payment"]').val('');
            $('input[name="credit_limit"]').val('');
            $('input[name="remaining_months"]').val('');
            $('input[name="intend_to_repay"]').prop('checked', false);

            // Append the values to the card body
            let cardBody = $('.credit_comment').closest('.card-body');
            let html = `
                <div class="card credit_comment_section">
                    <div class="card-body">
                        <p><span class="field-name">Commitment Type:</span> <span class="field-value">${commitmentType}</span></p>
                        <p><span class="field-name">Lender:</span> <span class="field-value">${lenderName}</span></p>
                        <p><span class="field-name">Outstanding Amount:</span> <span class="field-value">${outstandingAmount}</span></p>
                        <p><span class="field-name">Monthly Payment:</span> <span class="field-value">${monthlyPayment}</span></p>
                        <p><span class="field-name">Credit Limit:</span> <span class="field-value">${creditLimit}</span></p>
                        <p><span class="field-name">Remaining Months:</span> <span class="field-value">${remainingMonths}</span></p>
                        <p><span class="field-name">Intend to Repay:</span> <span class="field-value">${intendToRepay ? 'Yes' : 'No'}</span></p>
                        <button type="button" class="btn btn-primary edit-button edit_credit_comment"
                            data-commitment-type="${commitmentType}"
                            data-lender-name="${lenderName}"
                            data-outstanding-amount="${outstandingAmount}"
                            data-monthly-payment="${monthlyPayment}"
                            data-credit-limit="${creditLimit}"
                            data-remaining-months="${remainingMonths}"
                            data-intend-to-repay="${intendToRepay}">
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

            cardBody.append(html);

            // Merge the new credit commitments with the existing ones
            creditCommitments = existingCreditCommitments.concat(creditCommitments);

            // Set the values in the textarea field
            textarea.value = JSON.stringify(creditCommitments);

            // Scroll to the form fields
            $('html, body').animate({
                scrollTop: $('select[name="commitment_type"]').offset().top
            }, 500);
        },

        _onEditCreditComment: function(ev) {
            ev.preventDefault();
            const $editButton = $(ev.currentTarget);
            const commitmentType = $editButton.data('commitmentType');
            const lenderName = $editButton.data('lenderName');
            const outstandingAmount = $editButton.data('outstandingAmount');
            const monthlyPayment = $editButton.data('monthlyPayment');
            const creditLimit = $editButton.data('creditLimit');
            const remainingMonths = $editButton.data('remainingMonths');
            const intendToRepay = $editButton.data('intendToRepay');

            // Load values into form fields
            $('select[name="commitment_type"]').val(commitmentType);
            $('input[name="lender"]').val(lenderName);
            $('input[name="outstanding_amount"]').val(outstandingAmount);
            $('input[name="monthly_payment"]').val(monthlyPayment);
            $('input[name="credit_limit"]').val(creditLimit);
            $('input[name="remaining_months"]').val(remainingMonths);
            $('input[name="intend_to_repay"]').prop('checked', intendToRepay);

            // Remove the record from the card
            $editButton.closest('.card').remove();

            // Scroll to the form fields
            $('html, body').animate({
                scrollTop: $('select[name="commitment_type"]').offset().top
            }, 500);
        },

        _onRemoveLine: function(ev) {
            $(ev.currentTarget).closest('div.card').remove();
        },

        _onFactFindSubmit: function(ev) {
            var self = this;

            // Get the existing credit commitments from the textarea
            let textarea = document.querySelector('textarea[name="credit_comment_ids"]');
            let creditCommitmentsData = textarea.value ? JSON.parse(textarea.value) : [];

            if (creditCommitmentsData.length > 0) {
                document.querySelector('textarea[name="credit_comment_ids"]').value = JSON.stringify(creditCommitmentsData);
            }
        },
    });
});
