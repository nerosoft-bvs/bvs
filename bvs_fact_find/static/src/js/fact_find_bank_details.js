odoo.define('bvs_fact_find.bank_details_project', function(require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var _t = core._t;

    publicWidget.registry.generic_form_data_bank_details = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_bank_details': '_onClickAddBankDetails',
            'click .remove_line': '_onClickRemoveLine',
            'click .edit_bank_details': '_onClickEditBankDetails',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
        },

        _onClickAddBankDetails: function(ev) {
            ev.preventDefault();
            var self = this;
            var bankDetailsData = [];

            $('.bank_details_project').each(function() {
                var accountType = $(this).find('select[name="account_type"]').val();
                var sortCode = $(this).find('input[name="sort_code"]').val();
                var bankNameAddress = $(this).find('textarea[name="bank_name_address"]').val();
                var accountNo = $(this).find('input[name="account_no"]').val();
                var accountHolderName = $(this).find('input[name="account_holder_name"]').val();
                var accountOpenDate = $(this).find('input[name="account_open_date"]').val();
                var directDebitForMortgage = $(this).find('input[name="direct_debit_for_mortgage"]').prop('checked');
                var preferredDdDate = $(this).find('select[name="preferred_dd_date"]').val();

                bankDetailsData.push({
                    account_type: accountType,
                    sort_code: sortCode,
                    bank_name_address: bankNameAddress,
                    account_no: accountNo,
                    account_holder_name: accountHolderName,
                    account_open_date: accountOpenDate,
                    direct_debit_for_mortgage: directDebitForMortgage,
                    preferred_dd_date: preferredDdDate,
                });

                // Construct HTML for the card
                var html = `
                    <div class="card">
                        <div class="card-body">
                            <p><span class="field-name">Account Type:</span> <span class="field-value">${accountType}</span></p>
                            <p><span class="field-name">Sort Code:</span> <span class="field-value">${sortCode}</span></p>
                            <p><span class="field-name">Bank Name and Address:</span> <span class="field-value">${bankNameAddress}</span></p>
                            <p><span class="field-name">Account No:</span> <span class="field-value">${accountNo}</span></p>
                            <p><span class="field-name">Account Holder's Name:</span> <span class="field-value">${accountHolderName}</span></p>
                            <p><span class="field-name">Account Open Date:</span> <span class="field-value">${accountOpenDate}</span></p>
                            <p><span class="field-name">Direct Debit for Mortgage:</span> <span class="field-value">${directDebitForMortgage ? 'Yes' : 'No'}</span></p>
                            <p><span class="field-name">Preferred DD Date:</span> <span class="field-value">${preferredDdDate}</span></p>
                            <button type="button" class="btn btn-primary edit-button edit_bank_details" data-card-id="${$(this).attr('id')}">Edit</button>
                            <button type="button" class="btn btn-danger delete-button remove_line" data-card-id="${$(this).attr('id')}">Delete</button>
                        </div>
                    </div>
                `;

                // Append the HTML to the bank details container
                $('.bank_details_cards').append(html);
            });

            // Clear the form fields after adding bank details
            $('.bank_details_project input, .bank_details_project select, .bank_details_project textarea').val('');
        },

        _onClickEditBankDetails: function(ev) {
            ev.preventDefault();
            var $editButton = $(ev.currentTarget);
            var cardId = $editButton.data('card-id');
            var $card = $('#' + cardId);

            // Load values into form fields
            $('select[name="account_type"]').val($card.find('.field-value:eq(0)').text());
            $('input[name="sort_code"]').val($card.find('.field-value:eq(1)').text());
            $('textarea[name="bank_name_address"]').val($card.find('.field-value:eq(2)').text());
            $('input[name="account_no"]').val($card.find('.field-value:eq(3)').text());
            $('input[name="account_holder_name"]').val($card.find('.field-value:eq(4)').text());
            $('input[name="account_open_date"]').val($card.find('.field-value:eq(5)').text());
            $('input[name="direct_debit_for_mortgage"]').prop('checked', $card.find('.field-value:eq(6)').text() === 'Yes');
            $('select[name="preferred_dd_date"]').val($card.find('.field-value:eq(7)').text());

            // Remove the record from the card
            $card.remove();

            // Scroll to the form fields
            $('html, body').animate({
                scrollTop: $('select[name="account_type"]').offset().top
            }, 500);
        },

        _onClickRemoveLine: function(ev) {
            var $deleteButton = $(ev.currentTarget);
            var cardId = $deleteButton.data('card-id');
            $('#' + cardId).remove();
        },

        _onFactFindSubmit: function(ev) {
            var textarea = document.querySelector('textarea[name="data_line_ids"]');
            var bankDetailsData = [];

            $('.bank_details_project').each(function() {
                var accountType = $(this).find('select[name="account_type"]').val();
                var sortCode = $(this).find('input[name="sort_code"]').val();
                var bankNameAddress = $(this).find('textarea[name="bank_name_address"]').val();
                var accountNo = $(this).find('input[name="account_no"]').val();
                var accountHolderName = $(this).find('input[name="account_holder_name"]').val();
                var accountOpenDate = $(this).find('input[name="account_open_date"]').val();
                var directDebitForMortgage = $(this).find('input[name="direct_debit_for_mortgage"]').prop('checked');
                var preferredDdDate = $(this).find('select[name="preferred_dd_date"]').val();

                bankDetailsData.push({
                    account_type: accountType,
                    sort_code: sortCode,
                    bank_name_address: bankNameAddress,
                    account_no: accountNo,
                    account_holder_name: accountHolderName,
                    account_open_date: accountOpenDate,
                    direct_debit_for_mortgage: directDebitForMortgage,
                    preferred_dd_date: preferredDdDate,
                });
            });

            textarea.value = JSON.stringify(bankDetailsData);
        },
    });
});
