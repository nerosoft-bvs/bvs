odoo.define('bvs_fact_find.fact_find_deposit_multiple', function(require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;

    publicWidget.registry.generic_form_data_deposit = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_deposit': '_onAddDeposit',
            'click .remove_line': '_onRemoveLine',
            'click .submit_fact_find_btn': '_onFactFindSubmit',
            'click .edit_deposit': '_onEditDeposit',
        },

        _onAddDeposit: function(ev) {
            ev.preventDefault();
            let self = this;

            let relationship = $('select[name="family_relationship"]').val();
            let name = $('input[name="name"]').val();
            let dateOfBirth = $('input[name="date_of_birth"]').val();

            let html = `
                <div class="card deposit_multiple">
                    <div class="card-body">
                        <p><span class="field-name">Relationship:</span> <span class="field-value">${relationship}</span></p>
                        <p><span class="field-name">Name:</span> <span class="field-value">${name}</span></p>
                        <p><span class="field-name">Date of Birth:</span> <span class="field-value">${dateOfBirth}</span></p>
                        <button type="button" class="btn btn-primary edit-button edit_deposit"
                            data-relationship="${relationship}"
                            data-name="${name}"
                            data-date-of-birth="${dateOfBirth}">
                            Edit
                        </button>
                        <button type="button" class="btn btn-danger delete-button remove_line">Delete</button>
                    </div>
                </div>
            `;

            // Append the new deposit card to the card body
            let cardBody = $('.fact_find_deposit_multiple').closest('.card-body');
            cardBody.append(html);

            // Clear the input fields after adding
            $('select[name="family_relationship"]').val('');
            $('input[name="name"]').val('');
            $('input[name="date_of_birth"]').val('');

            // Update the hidden textarea with all deposits
            this._updateTextarea();
        },

        _onEditDeposit: function(ev) {
            ev.preventDefault();
            const $editButton = $(ev.currentTarget);
            const relationship = $editButton.data('relationship');
            const name = $editButton.data('name');
            const dateOfBirth = $editButton.data('date-of-birth');

            // Load values into form fields for editing
            $('select[name="family_relationship"]').val(relationship);
            $('input[name="name"]').val(name);
            $('input[name="date_of_birth"]').val(dateOfBirth);

            // Remove the edited deposit card from UI
            $editButton.closest('.card').remove();

            // Update the hidden textarea with updated deposits
            this._updateTextarea();
        },

        _onRemoveLine: function(ev) {
            $(ev.currentTarget).closest('.card').remove();

            // Update the hidden textarea with remaining deposits
            this._updateTextarea();
        },

        _onFactFindSubmit: function(ev) {
            ev.preventDefault();
            // Perform any final actions before form submission
            // Update the hidden textarea with all deposits
            this._updateTextarea();
        },

        _updateTextarea: function() {
            let deposits = [];
            $('.deposit_multiple').each(function() {
                let relationship = $(this).find('.field-value:eq(0)').text().trim();
                let name = $(this).find('.field-value:eq(1)').text().trim();
                let dateOfBirth = $(this).find('.field-value:eq(2)').text().trim();

                deposits.push({
                    relationship: relationship,
                    name: name,
                    date_of_birth: dateOfBirth,
                });
            });

            // Update the hidden textarea with JSON stringified deposits
            let textarea = document.querySelector('textarea[name="gifted_family_details"]');
            textarea.value = JSON.stringify(deposits);
        },
    });
});
