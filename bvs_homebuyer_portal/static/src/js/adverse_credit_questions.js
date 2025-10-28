odoo.define('bvs_homebuyer_portal.adverse_credit_questions', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.AdverseCreditQuestions = publicWidget.Widget.extend({
        selector: '#ff_yf_credit_history',
        events: {
            // Monitor Yes/No selections for each question
            'change input[name="missed_payment_last_3_years"]': '_onCreditQuestionChange',
            'change input[name="arrears_with_mortgage_or_loans"]': '_onCreditQuestionChange',
            'change input[name="arrears_with_credit_card_or_store_cards"]': '_onCreditQuestionChange',
            'change input[name="ccj_against_you"]': '_onCreditQuestionChange',
            'change input[name="debt_management_plan"]': '_onCreditQuestionChange',
            'change input[name="default_registered"]': '_onCreditQuestionChange',
            'change input[name="failed_to_keep_up_repayments"]': '_onCreditQuestionChange',
            'change input[name="bankruptcy"]': '_onCreditQuestionChange',

            // Form actions
            'click .btn-adverse-credit-save-inline': '_onSaveInlineForm',
            'click .btn-adverse-credit-save-and-new-inline': '_onSaveAndNewInlineForm',
            'click .btn-adverse-credit-cancel-inline': '_onCancelInlineForm',
            'click .btn-next[data-id="banking"]': '_onSubmitSection',
        },

        /**
         * Mapping of question names to credit types
         */
        creditTypeMapping: {
            'missed_payment_last_3_years': {
                value: 'type4',
                label: 'Missed Payment / Arrears'
            },
            'arrears_with_mortgage_or_loans': {
                value: 'ccj',
                label: 'CCJ'
            },
            'arrears_with_credit_card_or_store_cards': {
                value: 'type4',
                label: 'Missed Payment / Arrears'
            },
            'ccj_against_you': {
                value: 'iva',
                label: 'Individual Voluntary Arrangement'
            },
            'debt_management_plan': {
                value: 'dmp',
                label: 'Debt Management Plan'
            },
            'default_registered': {
                value: 'default',
                label: 'Default'
            },
            'failed_to_keep_up_repayments': {
                value: 'arrangements_to_pay',
                label: 'Arrangements to Pay'
            },
            'bankruptcy': {
                value: 'bankrupt',
                label: 'Bankrupt'
            }
        },

        start: function () {
            this.unsavedForms = new Set(); // Track unsaved forms
            return this._super.apply(this, arguments);
        },

        /**
         * Handle Yes/No selection for credit questions
         */
        _onCreditQuestionChange: function (ev) {
            const $input = $(ev.currentTarget);
            const questionName = $input.attr('name');
            const selectedValue = $input.val();
            const $formGroup = $input.closest('.form-group');

            // Find or create form container
            let $formContainer = $formGroup.find(`.inline-adverse-credit-form[data-question="${questionName}"]`);

            if (selectedValue === 'yes') {
                // Create form if it doesn't exist
                if ($formContainer.length === 0) {
                    $formContainer = this._createInlineForm(questionName);
                    $formGroup.append($formContainer);
                }

                // Show the form and pre-select credit type
                const creditTypeInfo = this.creditTypeMapping[questionName];
                $formContainer.find('select[name="adverse_credit_type"]').val(creditTypeInfo.value).prop('readonly', true);
                $formContainer.removeClass('d-none').slideDown(300);

                // Mark as unsaved
                this.unsavedForms.add(questionName);
            } else {
                // Hide form when "No" is selected
                if ($formContainer.length > 0) {
                    $formContainer.slideUp(300, function() {
                        $(this).addClass('d-none');
                    });
                    this.unsavedForms.delete(questionName);
                }
            }
        },

        /**
         * Create an inline adverse credit form for a specific question
         */
        _createInlineForm: function (questionName) {
            const creditTypeInfo = this.creditTypeMapping[questionName];

            const formHtml = `
                <div class="inline-adverse-credit-form mt-3 d-none" data-question="${questionName}">
                    <div class="profile-container">
                        <h5 class="mb-3">${creditTypeInfo.label} Details</h5>
                        <form class="row g-3 adverse-credit-inline-form" data-question="${questionName}">
                            <input type="hidden" name="question_name" value="${questionName}"/>

                            <div class="form-group col-md-12">
                                <label for="adverse_credit_type_${questionName}">Credit Type *</label>
                                <select class="form-control" name="adverse_credit_type" id="adverse_credit_type_${questionName}" disabled>
                                    <option value="">Select Credit Type</option>
                                    <option value="type4">Missed Payment / Arrears</option>
                                    <option value="ccj">CCJ</option>
                                    <option value="default">Default</option>
                                    <option value="iva">Individual Voluntary Arrangement</option>
                                    <option value="dmp">Debt Management Plan</option>
                                    <option value="arrangements_to_pay">Arrangements to Pay</option>
                                    <option value="bankrupt">Bankrupt</option>
                                </select>
                            </div>

                            <div class="form-group col-md-6">
                                <label for="loan_type_${questionName}">Loan Type *</label>
                                <input type="text" class="form-control" name="loan_type" id="loan_type_${questionName}" required/>
                            </div>

                            <div class="form-group col-md-6">
                                <label for="lender_${questionName}">Lender *</label>
                                <input type="text" class="form-control" name="lender" id="lender_${questionName}" required/>
                            </div>

                            <div class="form-group col-md-4">
                                <label for="amount_${questionName}">Amount *</label>
                                <input type="number" class="form-control" name="amount" id="amount_${questionName}" required/>
                            </div>

                            <div class="form-group col-md-4">
                                <label for="reported_on_${questionName}">Reported On *</label>
                                <input type="date" class="form-control" name="reported_on" id="reported_on_${questionName}" required/>
                            </div>

                            <div class="form-group col-md-4">
                                <label for="settled_on_${questionName}">Settled On *</label>
                                <input type="date" class="form-control" name="settled_on" id="settled_on_${questionName}" required/>
                            </div>

                            <div class="row mt-2">
                                <div class="col-md-4 text-center">
                                    <button type="button" class="btn btn-outline-warning btn-adverse-credit-cancel-inline" data-question="${questionName}">
                                        Cancel
                                    </button>
                                </div>
                                <div class="col-md-4 text-center">
                                    <button type="button" class="btn btn-outline-warning btn-adverse-credit-save-inline" data-question="${questionName}">
                                        Save
                                    </button>
                                </div>
                                <div class="col-md-4 text-center">
                                    <button type="button" class="btn btn-adverse-credit-save-and-new-inline" data-question="${questionName}">
                                        Save & New
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            return $(formHtml);
        },

        /**
         * Save inline form data
         */
        _onSaveInlineForm: function (ev) {
            ev.preventDefault();
            const $button = $(ev.currentTarget);
            const questionName = $button.data('question');
            this._saveForm(questionName, false);
        },

        /**
         * Save inline form and open a new one
         */
        _onSaveAndNewInlineForm: function (ev) {
            ev.preventDefault();
            const $button = $(ev.currentTarget);
            const questionName = $button.data('question');
            this._saveForm(questionName, true);
        },

        /**
         * Shared save logic for both Save and Save & New
         */
        _saveForm: function (questionName, openNewForm) {
            const $form = $(`.adverse-credit-inline-form[data-question="${questionName}"]`);

            // Validate form
            if (!this._validateForm($form)) {
                this._showNotification('Please fill in all required fields.', 'danger');
                return;
            }

            // Get fact find ID from localStorage
            const factFindId = localStorage.getItem("bvs_ff_id");

            // Collect form data
            const formData = {
                adverse_credit_id: 'new-credit',
                adverse_credit_type: $form.find('select[name="adverse_credit_type"]').val(),
                total_count: '',
                loan_type: $form.find('input[name="loan_type"]').val(),
                lender: $form.find('input[name="lender"]').val(),
                amount: $form.find('input[name="amount"]').val(),
                reported_on: $form.find('input[name="reported_on"]').val(),
                settled_on: $form.find('input[name="settled_on"]').val(),
                belongs_to_ac: false,
            };

            // Save via AJAX using the existing route
            this._rpc({
                route: '/update/fact-find/adverse-credit',
                params: {
                    fact_find_id: factFindId,
                    data: formData
                }
            }).then((response) => {
                if (response.success) {
                    // Define mapping of technical values to display strings
                    const creditTypeMapping = {
                        'type4': 'Missed Payment / Arrears',
                        'ccj': 'CCJ',
                        'default': 'Default',
                        'iva': 'Individual Voluntary Arrangement',
                        'dmp': 'Debt Management Plan',
                        'arrangements_to_pay': 'Arrangements to Pay',
                        'bankrupt': 'Bankrupt'
                    };

                    const adverseCreditTypeLabel = creditTypeMapping[formData.adverse_credit_type] || 'Unknown';

                    // Add new card before the button group
                    $('.adverse-credit > div.button-group').before(`
                        <div class="adverse-credit-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg adverse-credit-actions" data-type="edit" data-adverse-credit-id="${response.adverse_credit_id}"></i>
                                <i class="fa fa-trash fa-lg adverse-credit-actions" data-type="delete" data-adverse-credit-id="${response.adverse_credit_id}"></i>
                            </div>
                            <p>Credit Type:
                                <span class="adverse-credit-info">${adverseCreditTypeLabel}</span>
                            </p>
                            <p>Lender:
                                <span class="adverse-credit-info">${formData.lender}</span>
                            </p>
                        </div>
                    `);

                    if (openNewForm) {
                        // Clear the form fields for new entry (keep credit type)
                        $form.find('input[name="loan_type"]').val('');
                        $form.find('input[name="lender"]').val('');
                        $form.find('input[name="amount"]').val('');
                        $form.find('input[name="reported_on"]').val('');
                        $form.find('input[name="settled_on"]').val('');
                        $form.find('.is-invalid').removeClass('is-invalid');

                        // Show success message
                        this._showNotification('Adverse credit saved! Add another of the same type.', 'success');

                        // Scroll to the form to make it obvious it's ready for new entry
                        const $formContainer = $form.closest('.inline-adverse-credit-form');
                        $('html, body').animate({
                            scrollTop: $formContainer.offset().top - 100
                        }, 300);
                    } else {
                        // Remove from unsaved list
                        this.unsavedForms.delete(questionName);

                        // Hide the form
                        const $formContainer = $form.closest('.inline-adverse-credit-form');
                        $formContainer.slideUp(300, function() {
                            $(this).addClass('d-none');
                        });

                        // Show success message
                        this._showNotification('Adverse credit details saved successfully!', 'success');
                    }
                } else {
                    this._showNotification('Failed to save: ' + (response.error || 'Unknown error'), 'danger');
                }
            }).catch((error) => {
                console.error('Error saving adverse credit:', error);
                this._showNotification('An error occurred while saving. Please try again.', 'danger');
            });
        },

        /**
         * Cancel inline form
         */
        _onCancelInlineForm: function (ev) {
            const $button = $(ev.currentTarget);
            const questionName = $button.data('question');
            const $formContainer = $button.closest('.inline-adverse-credit-form');

            // Reset the Yes/No selection
            $(`input[name="${questionName}"][value="no"]`).prop('checked', true);

            // Hide form
            $formContainer.slideUp(300, function() {
                $(this).addClass('d-none');
            });

            // Remove from unsaved list
            this.unsavedForms.delete(questionName);
        },

        /**
         * Validate form before submission
         */
        _validateForm: function ($form) {
            let isValid = true;
            $form.find('[required]').each(function() {
                if (!$(this).val()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            return isValid;
        },

        /**
         * Prevent submission if there are unsaved forms
         */
        _onSubmitSection: function (ev) {
            if (this.unsavedForms.size > 0) {
                ev.preventDefault();
                ev.stopPropagation();

                // Find the first unsaved form and scroll to it
                const firstUnsaved = Array.from(this.unsavedForms)[0];
                const $unsavedForm = $(`.inline-adverse-credit-form[data-question="${firstUnsaved}"]`);

                if ($unsavedForm.length) {
                    $('html, body').animate({
                        scrollTop: $unsavedForm.offset().top - 100
                    }, 500);

                    // Highlight the form
                    $unsavedForm.addClass('highlight-unsaved');
                    setTimeout(() => {
                        $unsavedForm.removeClass('highlight-unsaved');
                    }, 2000);
                }

                this._showNotification('Please save or cancel all open adverse credit forms before continuing.', 'warning');
                return false;
            }
        },

        /**
         * Show notification message - Odoo-style sliding from right
         */
        _showNotification: function (message, type) {
            console.log('Showing notification:', message, type);

            const alertClass = type === 'success' ? 'alert-success' : type === 'warning' ? 'alert-warning' : 'alert-danger';
            const iconClass = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle';

            // Gold theme professional colors
            let bgColor, borderColor, textColor, iconColor;
            if (type === 'success') {
                bgColor = 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)';
                borderColor = '#86efac';
                textColor = '#166534';
                iconColor = '#22c55e';
            } else if (type === 'warning') {
                bgColor = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
                borderColor = '#fbbf24';
                textColor = '#92400e';
                iconColor = '#f59e0b';
            } else {
                bgColor = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                borderColor = '#fca5a5';
                textColor = '#991b1b';
                iconColor = '#ef4444';
            }

            const $alert = $(`
                <div class="alert ${alertClass} alert-dismissible odoo-notification-slide" role="alert" style="position: fixed; top: 20px; right: -400px; width: 360px; z-index: 10000; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; padding: 16px 20px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08); font-size: 0.9rem; font-weight: 500; background: ${bgColor}; border: 2px solid ${borderColor}; color: ${textColor}; backdrop-filter: blur(10px);">
                    <i class="fa ${iconClass}" style="font-size: 1.4rem; margin-right: 14px; flex-shrink: 0; color: ${iconColor};"></i>
                    <span style="flex: 1; line-height: 1.5; color: ${textColor};">${message}</span>
                    <button type="button" class="close" aria-label="Close" style="background: transparent; border: none; font-size: 1.8rem; line-height: 1; color: ${textColor}; opacity: 0.6; cursor: pointer; padding: 0; margin-left: 14px; transition: all 0.2s ease; font-weight: 300;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            console.log('Alert element created:', $alert);

            // Append to body instead of specific container for fixed positioning
            $('body').append($alert);

            console.log('Element position:', $alert.css('position'), 'Right:', $alert.css('right'), 'Z-index:', $alert.css('z-index'));

            console.log('Alert appended to body');

            // Trigger slide-in animation
            setTimeout(() => {
                $alert.addClass('show');
                $alert.css('right', '20px');
                console.log('Show class added, right position updated to:', $alert.css('right'));
            }, 10);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                $alert.removeClass('show');
                $alert.css('right', '-400px');
                setTimeout(() => {
                    $alert.remove();
                }, 300);
            }, 5000);

            // Manual close button with hover effect
            $alert.find('.close')
                .on('mouseenter', function() {
                    $(this).css('opacity', '1');
                    $(this).css('transform', 'scale(1.1)');
                })
                .on('mouseleave', function() {
                    $(this).css('opacity', '0.6');
                    $(this).css('transform', 'scale(1)');
                })
                .on('click', function() {
                    $alert.removeClass('show');
                    $alert.css('right', '-400px');
                    setTimeout(() => {
                        $alert.remove();
                    }, 300);
                });
        },
    });

    return publicWidget.registry.AdverseCreditQuestions;
});
