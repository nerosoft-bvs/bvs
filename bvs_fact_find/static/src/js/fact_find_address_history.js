odoo.define('bvs_fact_find.fact_find_address_history_multiple', function(require) {
    "use strict";

    var publicWidget = require('web.public.widget');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;
    var rpc = require('web.rpc');

    publicWidget.registry.generic_form_data_address_history = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find_form',
        events: {
            'click .add_address_history': '_onAddressHistory',
            'click .edit_address_history': '_onEditAddressHistory',
            'click .submit_fact_find_btn': '_onSubmitAddressHistory',
        },

        _onAddressHistory: function () {
            var self = this;
            let addressHistory = [];
            let existingAddressHistory = [];

            // Get the existing address history from the textarea
            let textarea = document.querySelector('textarea[name="address_history_ids"]');
            if (textarea.value) {
                existingAddressHistory = JSON.parse(textarea.value);
            }

            let id = $('input[name="address_history_id"]').val();
            let houseNumber = $('input[name="house_number2"]').val();
            let postCode = $('input[name="post_code2"]').val();
            let address = $('textarea[name="address2"]').val();
            let buildingNumber = $('input[name="building_number2"]').val();
            let town = $('textarea[name="town2"]').val();
            let county = $('textarea[name="county2"]').val();
            let country = $('select[name="country2"]').val();
            let residentialStatues = $('select[name="residential_status"]').val();
            let isCurrentAddress = $('input[name="is_current_address2"]').is(':checked'); // Correctly get the checkbox value
            let isCurrentAddressDisplay = isCurrentAddress ? 'Yes' : 'No';
//            let dateMovedIn = $('input[name="date_moved_in"]').val();
//            let dateMovedOut = $('input[name="date_moved_out"]').val();

            addressHistory.push({
                house_number: houseNumber,
                post_code: postCode,
                address: address,
                building_number: buildingNumber,
                town: town,
                county: county,
                country: country,
                is_current_address: isCurrentAddressDisplay, // Use the display value
//                date_moved_in: dateMovedIn,
//                date_moved_out: dateMovedOut,
            });

            // Clear the input fields
            $('input[name="house_number2"]').val('');
            $('input[name="post_code2"]').val('');
            $('textarea[name="address2"]').val('');
            $('input[name="building_number2"]').val('');
            $('textarea[name="town2"]').val('');
            $('textarea[name="county2"]').val('');
            $('select[name="country2"]').val('');
            $('select[name="residential_status"]').val('');
//            $('input[name="date_moved_in"]').val('');
//            $('input[name="date_moved_out"]').val('');
            $('input[name="is_current_address2"]').prop('checked', false);

            // Append the values to the card body
            let cardBody = $('.address_multiple').closest('.card-body');
            let html = `
                <div class="card">
                    <div class="card-body">
                        <button type="button" class="btn btn-primary share-button">Share with Applicants</button>
                        <p><span class="field-name">House Number:</span> <span class="field-value">${houseNumber}</span></p>
                        <p><span class="field-name">Post Code:</span> <span class="field-value">${postCode}</span></p>
                        <p><span class="field-name">Address:</span> <span class="field-value">${address}</span></p>
                        <p><span class="field-name">Building Number:</span> <span class="field-value">${buildingNumber}</span></p>
                        <p><span class="field-name">Town:</span> <span class="field-value">${town}</span></p>
                        <p><span class="field-name">County:</span> <span class="field-value">${county}</span></p>
                        <p><span class="field-name">Country:</span> <span class="field-value">${country}</span></p>
                        <p><span class="field-name">Is Current Address:</span> <span class="field-value">${isCurrentAddressDisplay}</span></p>
                        <button type="button" class="btn btn-primary edit-button edit_address_history"
                            data-id="${id}"
                            data-house-number="${houseNumber}"
                            data-post-code="${postCode}"
                            data-address="${address}"
                            data-building-number="${buildingNumber}"
                            data-town="${town}"
                            data-county="${county}"
                            data-country="${country}"
                            data-is-current-address="${isCurrentAddress}">
                            Edit
                        </button>
                        <button type="button" class="btn btn-danger delete-button remove_line">Delete</button>
                    </div>
                </div>
            `;

            cardBody.append(html);

            // Event handler for deleting address history card
            $(document).on('click', '.remove_line', function() {
                $(this).closest('.card').remove();
            });

            // Event handler for sharing address history
            $(document).on('click', '.share-button', function() {
                self._shareAddressHistory();
            });

            // Merge the new address history with the existing one
            addressHistory = existingAddressHistory.concat(addressHistory);

            // Set the values in the textarea field
            textarea.value = JSON.stringify(addressHistory);

            // Scroll to the form fields
           if ($('input[name="house_number2"]').length > 0) {
            $('html, body').animate({
            scrollTop: $('input[name="house_number2"]').offset().top
           }, 500);
           }
        },

        _onEditAddressHistory: function(event) {
            event.preventDefault();
            const $editButton = $(event.currentTarget);
            const houseNumber = $editButton.data('houseNumber');
            const postCode = $editButton.data('postCode');
            const address = $editButton.data('address');
            const buildingNumber = $editButton.data('buildingNumber');
            const town = $editButton.data('town');
            const county = $editButton.data('county');
            const country = $editButton.data('country');
            const isCurrentAddress = $editButton.data('isCurrentAddress');
//            const dateMovedIn = $editButton.data('dateMovedIn');
//            const dateMovedOut = $editButton.data('dateMovedOut');

            // Load values into form fields
            $('input[name="house_number2"]').val(houseNumber);
            $('input[name="post_code2"]').val(postCode);
            $('textarea[name="address2"]').val(address);
            $('input[name="building_number2"]').val(buildingNumber);
            $('textarea[name="town2"]').val(town);
            $('textarea[name="county2"]').val(county);
            $('select[name="country2"]').val(country);
            $('input[name="is_current_address2"]').prop('checked', isCurrentAddress); // Set the checkbox state
//            $('input[name="date_moved_in"]').val(dateMovedIn);
//            $('input[name="date_moved_out"]').val(dateMovedOut);

            // Remove the record from the card
            $editButton.closest('.card').remove();

            // Scroll to the form fields
             if ($('input[name="house_number2"]').length > 0) {
             $('html, body').animate({
                scrollTop: $('input[name="house_number2"]').offset().top
             }, 500);
            }
        },

        _onSubmitAddressHistory: function(ev) {
            // Get the existing address history from the textarea
            let textarea = document.querySelector('textarea[name="address_history_ids"]');
            let addressHistoryData = textarea.value ? JSON.parse(textarea.value) : [];

            if (addressHistoryData.length > 0) {
                document.querySelector('textarea[name="address_history_ids"]').value = JSON.stringify(addressHistoryData);
            }
        },

        _shareAddressHistory: function() {
            const factFindId = parseInt(this.el.dataset.factFindId);
            const addressHistoryData = JSON.parse(document.querySelector('textarea[name="address_history_ids"]').value);

            // Call the RPC function to share the address history details with the lead
            rpc.query({
                model: 'fact.find',
                method: 'share_address_history',
                args: [factFindId, addressHistoryData],
            }).then(function(result) {
                console.log('Address history shared successfully!');
            }).catch(function(error) {
                console.error('Error sharing address history:', error);
            });
        },

    });
});
