odoo.define('bvs_homebuyer_portal.bvs_homebuyer_portal', function(require) {
    'use strict';

    let publicWidget = require('web.public.widget');
    const StepState = {
        setStep({ main, parentEl = null, nextEl = null, ffId = null }) {
            // Save to localStorage
            if (main) localStorage.setItem("bvs_active_main", main);
            if (parentEl) localStorage.setItem("bvs_parent_el", parentEl);
            if (nextEl) localStorage.setItem("bvs_next_el", nextEl);
            if (ffId) localStorage.setItem("bvs_ff_id", ffId);

            // Update URL in required format
            const url = new URL(window.location);
            if (main) url.searchParams.set("step", main);
            if (parentEl) url.searchParams.set("parentEl", parentEl);
            if (nextEl) url.searchParams.set("nextEl", nextEl);
            if (ffId) url.searchParams.set("ffId", ffId);

            window.history.replaceState({}, "", url);
        },

        getStep() {
            return {
                main: localStorage.getItem("bvs_active_main"),
                parentEl: localStorage.getItem("bvs_parent_el"),
                nextEl: localStorage.getItem("bvs_next_el"),
                ffId: localStorage.getItem("bvs_ff_id"),
            };
        }
    };


    publicWidget.registry.bvsHomebuyerPortal = publicWidget.Widget.extend({
        selector: '.homebuyer-portal, .addressnow_form',
        events: {
            'click #toggler': '_onclickToggler',
            'click .sidebar-item': '_onclickSidebarItem',
            'click .home-continue': '_onclickHomeContinue',
            'click .sidebar-item .sidebar-link': '_onClickSidebarFactFind',

            // address history
            'click .address-details-add': '_onclickAHAddAddress',
            'click .btn-address-save,.btn-address-cancel': '_onclickAHSaveCancelAddressDetails',
            'click .btn-save-landlord-authority': '_onclickSaveLandlordAuthority',
            'click .btn-sync-data': '_onclickBtnSync',
            'click .btn-yes-address': '_onClickYes',
            'click .btn-no-address': '_onClickNo',
            'click .btn-sync-address': '_onClickSync',

            // dependants
            'click .add-dependant-details': '_onclickDependantAdd',
            'click .btn-dependant-save': '_onclickDependantSaveCancel',
            'click .btn-dependant-cancel': '_onclickDependantCancel',
            'click .no-dependants': '_onclickNoDependants',
            'click .have-dependants': '_onclickHaveDependants',
            'click .li_main_step': '_onclickMainStep',
            'click .li_sub_step': '_onclickSubStep',
            'click .btn-submit': '_onSubmitFfForms',
            'click .ff-sidebar-sub': '_onclickFFSubItem',
            'click .ff-sidebar-sub-dependant': '_onclickFFSubItemDependant',
            'click .btn-next': '_onclickNext',
            'click .folder': '_onclickDocumentFolderDropDown',
            'click .doc-action': '_onclickDocAction',
            'click .delete-confirm': '_onClickDocumentDelete',
            'click .btn-upload-confirm': '_onClickBtnUploadConfirm',
            'change .upload-document-file': '_onChangeDocumentFile',
            'click .upload-further-document,.upload-request-document': '_onClickUploadFurtherDocument',
            'click .btn-upload-further-doc': '_onUploadFurtherDocument',
            'change .further-doc-upload': '_onchangeFurtherDocUpload',
            'click .btn-save-single-data': '_onClickSaveSingleData',
            'click .residential-address-actions': '_onclickUpdateResidentialAddressActions',
            'click .financial-dependants-actions': '_onclickUpdateDependantActions',
            'click .btn-save-all-questions': '_saveAllAdverseCreditQuestions',
            'click #btnConfirm': '_onClickConfirm',

            // Adverse Credit
            'click .add-adverse-credit-details': '_onclickAdverseCreditAdd',
            'click .btn-adverse-credit-save,.btn-adverse-credit-cancel': '_onclickAdverseCreditSaveCancel',
            'click .adverse-credit-actions': '_onclickUpdateAdverseCreditActions',
            'click .ff-sidebar-sub-credit': '_onclickFFSubItemAdverseCredit',

            // Bank Details
            'click .add-banking-details-details': '_onclickBankingDetailsAdd',
            'click .btn-banking-save,.btn-banking-cansel': '_onclickBankingDetailsSaveCancel',
            'click .banking-details-actions': '_onclickUpdateBankingDetailsActions',
            'click .ff-sidebar-sub-banking': '_onclickFFSubItemBankingDetails',

            // Credit Commitment
            'click .no-credit-c': '_onclickNoCreditCommit',
            'click .have-credit-c': '_onclickHaveCreditCommit',
            'click .add-credit-commitment-details': '_onclickCreditCommitmentAdd',
            'click .btn-cancel-cc,.btn-save-cc': '_onclickCreditCommitmentSaveCancel',
            'click .credit-commitment-actions': '_onclickUpdateCreditCommitmentActions',
            'click .ff-sidebar-sub-cc': '_onclickFFSubItemBankingDetails',

            // Your Properties
            'click .properties-details-add': '_onclickYourPropertiesAdd',
            'click .btn-cansel-your-properties,.btn-save-your-properties': '_onclickYourPropertiesSaveCancel',
            'click .your-properties-actions': '_onclickUpdateYourPropertiesActions',
            'click .ff-sidebar-sub-yp': '_onclickYourPropertiesSubItem',

            // Your Mortgages
            'click .add-existing-mortgage-details': '_onclickExistingMortgagesAdd',
            'click .btn-cancel-existing-mortgages,.btn-save-existing-mortgages': '_onclickExistingMortgagesSaveCancel',
            'click .existing-mortgages-actions': '_onclickUpdateExistingMortgagesActions',
            'click .ff-sidebar-sub-ym': '_onclickExistingMortgagesSubItem',

            // Employment
            'click .add-employment-details-details': '_onclickEmploymentDetailsAdd',
            'click .btn-employment-save': '_onclickEmploymentDetailsSaveCancel',
            'click .btn-employment-cansel': '_onclickEmpDetailCancel',
            'click .employment-details-actions': '_onclickUpdateEmploymentDetailsActions',
            'click .ff-sidebar-sub-employment': '_onclickEmploymentDetailsSubItem',

            // Insurance Provider
            'click .add-protection-details-details': '_onclickProtectionDetailsAdd',
            'click .btn-protection-details-cancel,.btn-protection-details-save': '_onclickProtectionDetailsSaveCancel',
            'click .protection-details-actions': '_onclickUpdateProtectionDetailsActions',
            'click .ff-sidebar-sub-insurance': '_onclickProtectionDetailsSubItem',

            'click .add-health-conditions-details': '_onclickHealthConditionsAdd',
            'click .btn-health-conditions-cancel,.btn-health-conditions-save': '_onclickHealthConditionsSaveCancel',
            'click .health-condition-actions': '_onclickUpdateHealthConditionActions',
            'click .ff-sidebar-sub-health-conditions': '_onclickHealthConditionsSubItem',

            'click .add-past-travels-details': '_onclickPastTravelsAdd',
            'click .btn-past-travels-cancel,.btn-past-travels-save': '_onclickPastTravelsSaveCancel',
            'click .past-travel-actions': '_onclickUpdatePastTravelActions',
            'click .ff-sidebar-sub-past-travels': '_onclickPastTravelsSubItem',
            'change select[name="past_travels_reported"]': '_onchangePastTravelsReported',

            'click .add-future-travels-details': '_onclickFutureTravelsAdd',
            'click .btn-future-travels-cancel,.btn-future-travels-save': '_onclickFutureTravelsSaveCancel',
            'click .future-travel-actions': '_onclickUpdateFutureTravelActions',
            'click .ff-sidebar-sub-future-travels': '_onclickFutureTravelsSubItem',

            'click .add-critical-illness-details': '_onclickCriticalIllnessesAdd',
            'click .btn-critical-illnesses-save,.btn-critical-illnesses-cancel': '_onclickCriticalIllnessesSaveCancel',
            'click .critical-illness-actions': '_onclickUpdateCriticalIllnessActions',
            'click .ff-sidebar-sub-critical-illness': '_onclickCriticalIllnessesSubItem',

            'click .add-self-employment-details': '_onclickSelfEmploymentDetailsAdd',
            'click .btn-self-employment-save,.btn-self-employment-cancel': '_onclickSelfEmploymentDetailsSaveCancel',
            'click .self-employment-details-actions': '_onclickUpdateSelfEmploymentDetailsActions',
            'click .ff-sidebar-sub-self-employment': '_onclickSelfEmploymentDetailsSubItem',

            'change input[name="missed_payment_last_3_years"]': '_onChangeAdverseCreditQuestion',
            'change input[name="arrears_with_mortgage_or_loans"]': '_onChangeAdverseCreditQuestion',
            'change input[name="arrears_with_credit_card_or_store_cards"]': '_onChangeAdverseCreditQuestion',
            'change input[name="ccj_against_you"]': '_onChangeAdverseCreditQuestion',
            'change input[name="debt_management_plan"]': '_onChangeAdverseCreditQuestion',
            'change input[name="default_registered"]': '_onChangeAdverseCreditQuestion',
            'change input[name="failed_to_keep_up_repayments"]': '_onChangeAdverseCreditQuestion',
            'change input[name="bankruptcy"]': '_onChangeAdverseCreditQuestion',
            'change select[name="employment-status"]': '_onchangeEmploymentStatus',
            'change input[name="gross_monthly_retirement_income"], keyup input[name="gross_monthly_retirement_income"]': '_onchangeGrossMonthlyRetirementIncome',
            'click .btn-save-retirement-income': '_onclickSaveRetirementIncome',
            'click .btn-save-retirement-data': '_onclickSaveRetirementData', // Alternative button class
            'click .btn-cancel-retirement': '_onclickCancelRetirement',
            'click .btn-employment': '_onclickSaveAndContinueEmployment',

        },

         _onClickSidebarFactFind: function(ev) {
            ev.preventDefault();

            const $link = $(ev.currentTarget);
            const factFindId = parseInt($link.attr("href").replace("#", ""));

            if (factFindId && !isNaN(factFindId)) {
                console.log("Switching to fact find ID:", factFindId);
                this.factFindId = parseInt(factFindId);

                // Update form fact_find id
                const $form = $(".ff-personal-details-submit.ff-form");
                $form.attr("data-fact-find-id", factFindId);

                // Fetch fresh details via RPC
                this._rpc({
                    route: "/fact_find/get_details",
                    params: { fact_find_id: factFindId },
                }).then(function(data) {
                    if (data) {
                        // Personal Details Section
                        $form.find("select[name='title']").val(data.title_customer || "");
                        $form.find("input[name='first-name']").val(data.first_name || "");
                        $form.find("input[name='middle-name']").val(data.middle_names || "");
                        $form.find("input[name='surname']").val(data.surname || "");
                        $form.find("input[name='previous_surname']").val(data.previous_surname || "");
                        $form.find("input[name='date_of_name_change']").val(data.date_of_name_change || "");
                        $form.find("select[name='gender']").val(data.gender || "");
                        $form.find("input[name='personal-details-dob']").val(data.date_of_birth || "");

                        // Nationality & Immigration
                        $form.find("select[name='cob']").val(data.country_of_birth || "");
                        $form.find("select[name='nationality']").val(data.nationality || "");
                        $form.find("select[name='eu_country_list']").val(data.eu_country_list || "");
                        $form.find("select[name='other_nationality']").val(data.other_nationality || "");
                        $form.find("input[name='passport_expiry_date']").val(data.passport_expiry_date || "");
                        $form.find("select[name='start_continue_living_in_uk_month']").val(data.start_continue_living_in_uk_month || "");
                        $form.find("select[name='start_continue_living_in_uk_year']").val(data.start_continue_living_in_uk_year || "");
                        $form.find("select[name='indefinite_leave_to_remain']").val(data.indefinite_leave_to_remain || "");
                        $form.find("select[name='settled_status']").val(data.settled_status || "");
                        $form.find("select[name='visa_category']").val(data.visa_category || "");

                        // Contact Information
                        $form.find("select[name='marital_status']").val(data.marital_status || "");
                        $form.find("input[name='email']").val(data.email_address || "");
                        $form.find("input[name='telephone']").val(data.mobile_number || "");
                        $form.find("input[name='home-telephone']").val(data.home_telephone_number || "");

                        // Address Information
                        $form.find("select[name='residential_status_ah']").val(data.residential_status || "");
                        $form.find("input[name='flat-number']").val(data.house_flat_no || "");
                        $form.find("input[name='house-number']").val(data.house_number || "");
                        $form.find("input[name='building-name']").val(data.building_name || "");
                        $form.find("input[name='street-address']").val(data.street_address || "");
                        $form.find("input[name='town']").val(data.town || "");
                        $form.find("input[name='postcode']").val(data.post_code || "");
                        $form.find("input[name='county_ah']").val(data.county || "");

                        // Landlord & Authority Details
                        $("#current_landlord_name").val(data.current_landlord_name || "");
                        $("#current_landlord_address").val(data.current_landlord_address || "");
                        $("#current_landlord_postcode").val(data.current_landlord_postcode || "");
                        $("#current_landlord_contact_no").val(data.current_landlord_contact_no || "");
                        $("#local_authority_name").val(data.local_authority_name || "");
                        $("#local_authority_postcode").val(data.local_authority_postcode || "");
                        $("#local_authority_address").val(data.local_authority_address || "");

                        // Employment Information
                        $form.find("input[name='ni_number']").val(data.ni_number || "");
                        $form.find("input[name='anticipated_retirement_age']").val(data.anticipated_retirement_age || "");
                        $form.find("select[name='employment_basis']").val(data.employment_basis || "");
                        $form.find("input[name='occupation']").val(data.occupation || "");
                        $form.find("select[name='occupation_sector']").val(data.occupation_sector || "");
                        $form.find("select[name='employment_type']").val(data.employment_type || "");
                        $form.find("input[name='employer_name']").val(data.employer_name || "");
                        $form.find("textarea[name='address_of_working_place']").val(data.address_of_working_place || "");
                        $form.find("input[name='work_telephone']").val(data.work_telephone || "");
                        $form.find("input[name='start_date']").val(data.start_date || "");
                        $form.find("input[name='end_date']").val(data.end_date || "");
                        $form.find("input[name='current_contract_start_date']").val(data.current_contract_start_date || "");
                        $form.find("input[name='current_contract_end_date']").val(data.current_contract_end_date || "");
                        $form.find("input[name='years_of_experience_contract_basis']").val(data.years_of_experience_contract_basis || "");

                        // Salary Information
                        $form.find("input[name='monthly_gross_salary']").val(data.monthly_gross_salary || "");
                        $form.find("input[name='annual_bonus']").val(data.annual_bonus || "");
                        $form.find("input[name='annual_salary']").val(data.annual_salary || "");
                        $form.find("input[name='gross_monthly_retirement_income']").val(data.gross_monthly_retirement_income || "");
                        $form.find("input[name='annual_retirement_income']").val(data.annual_retirement_income || "");

                        // Deductions
                        $form.find("input[name='student_loans']").val(data.student_loans || "");
                        $form.find("input[name='post_graduate_loan']").val(data.post_graduate_loan || "");
                        $form.find("input[name='gym_membership']").val(data.gym_membership || "");
                        $form.find("input[name='childcare']").val(data.childcare || "");
                        $form.find("input[name='other']").val(data.other || "");

                        // Self Employment
                        $form.find("select[name='self_employment_type']").val(data.self_employment_type || "");
                        $form.find("input[name='business_name']").val(data.business_name || "");
                        $form.find("input[name='self_employed_occupation']").val(data.self_employed_occupation || "");
                        $form.find("input[name='self_employment_start_date']").val(data.self_employment_start_date || "");
                        $form.find("input[name='tax_year_1']").val(data.tax_year_1 || "");
                        $form.find("input[name='year_1_tax_income']").val(data.year_1_tax_income || "");
                        $form.find("input[name='tax_year_2']").val(data.tax_year_2 || "");
                        $form.find("input[name='year_2_tax_income']").val(data.year_2_tax_income || "");
                        $form.find("textarea[name='business_address']").val(data.business_address || "");
                        $form.find("input[name='business_contact']").val(data.business_contact || "");
                        $form.find("input[name='self_firm_name']").val(data.self_firm_name || "");
                        $form.find("input[name='self_accountant_address']").val(data.self_accountant_address || "");
                        $form.find("input[name='self_contact_number']").val(data.self_contact_number || "");
                        $form.find("input[name='self_qualification']").val(data.self_qualification || "");
                        $form.find("input[name='self_let_properties_count_new']").val(data.self_let_properties_count_new || "");

                        // Income Information
                        $form.find("select[name='income_type']").val(data.income_type || "");
                        $form.find("input[name='monthly_income']").val(data.monthly_income || "");
                        $form.find("input[name='annual_income']").val(data.annual_income || "");



                        // Credit History - Radio buttons require special handling
                        if (data.missed_payment_last_3_years) {
                            $form.find("input[name='missed_payment_last_3_years'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='missed_payment_last_3_years'][value='no']").prop('checked', true);
                        }

                        if (data.arrears_with_mortgage_or_loans) {
                            $form.find("input[name='arrears_with_mortgage_or_loans'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='arrears_with_mortgage_or_loans'][value='no']").prop('checked', true);
                        }

                        if (data.arrears_with_credit_card_or_store_cards) {
                            $form.find("input[name='arrears_with_credit_card_or_store_cards'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='arrears_with_credit_card_or_store_cards'][value='no']").prop('checked', true);
                        }

                        if (data.ccj_against_you) {
                            $form.find("input[name='ccj_against_you'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='ccj_against_you'][value='no']").prop('checked', true);
                        }

                        if (data.debt_management_plan) {
                            $form.find("input[name='debt_management_plan'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='debt_management_plan'][value='no']").prop('checked', true);
                        }

                        if (data.default_registered) {
                            $form.find("input[name='default_registered'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='default_registered'][value='no']").prop('checked', true);
                        }

                        if (data.failed_to_keep_up_repayments) {
                            $form.find("input[name='failed_to_keep_up_repayments'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='failed_to_keep_up_repayments'][value='no']").prop('checked', true);
                        }

                        if (data.bankruptcy) {
                            $form.find("input[name='bankruptcy'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='bankruptcy'][value='no']").prop('checked', true);
                        }

                        if (data.arrangements_with_creditors) {
                            $form.find("input[name='arrangements_with_creditors'][value='yes']").prop('checked', true);
                        } else {
                            $form.find("input[name='arrangements_with_creditors'][value='no']").prop('checked', true);
                        }

                        // Checkboxes require special handling
                        $form.find("input[name='another_name_checkbox']").prop('checked', data.known_by_another_name || false);
                        $form.find("input[name='current_address_name_checkbox']").prop('checked', data.current_address_name_checkbox || false);
                        $form.find("input[name='is_current_employment']").prop('checked', data.is_current_employment || false);
                        $form.find("input[name='has_deductions']").prop('checked', data.has_deductions || false);
                        $form.find("input[name='has_accountant']").prop('checked', data.has_accountant || false);

                        // Dependant Information
                        $form.find("input[name='dependant-name']").val(data.dependant_name || "");
                        $form.find("select[name='dependant-relation']").val(data.dependant_relation || "");
                        $form.find("input[name='dependant-date-of-birth']").val(data.dependant_date_of_birth || "");
                        $form.find("select[name='dependency_type']").val(data.dependency_type || "");
                        $form.find("select[name='dependency_period']").val(data.dependency_period || "");
                        $form.find("input[name='monthly_childcare_cost']").val(data.monthly_childcare_cost || "");
                        $form.find("textarea[name='childcare_cost_reason']").val(data.childcare_cost_reason || "");
                        $form.find("input[name='additional_cost']").val(data.additional_cost || "");

                        console.log("Successfully mapped fact find data:", data);
                    }
                }).catch(function(error) {
                    console.error("Error fetching fact find details:", error);
                });
            }
        },

        _onclickBtnSync: function(ev) {
            this._rpc({
                route: '/ff/update/applicant/addresses',
                params: {
                    fact_find_id: parseInt(this.factFindId)
                }
            }).then((res) => {
                location.reload();
                // Store a flag to indicate a reload
                localStorage.setItem('synced', $(ev.currentTarget).attr('data-page'));
                localStorage.setItem('synced_ff_id', this.factFindId);
            });

        },

        _onClickYes: function(ev) {
            // Build selection dropdown
            let $select = $('<select class="form-select form-select-sm fact-select"/>');
            this._rpc({
                route: '/applicant/address',
                params: { fact_find_id: this.factFindId }
            }).then((res) => {
                res.forEach(f => $select.append(`<option value="${f.id}">${f.name}</option>`));

                let $container = $('.address-sync-fact .customer_selection');
                $container.html($select);

                // Remove previous Sync button if exists
                $('.btn-sync-address').remove();

                // Create Sync button and bind click once
                let $syncBtn = $(`
                    <button type="button"
                            class="btn btn-success btn-sm btn-sync-address px-2 btn-outline-gold">
                        <i class="fa fa-copy me-1"></i> Copy
                    </button>
                `);
                $container.after($syncBtn);

                // Bind click handler ONCE
                $syncBtn.off('click').on('click', this._onClickSync.bind(this));

                // Hide Yes/No buttons
                $('.btn-yes-address, .btn-no-address').hide();
            });
        },

        _onClickNo: function(ev) {
            $('.address-sync-fact').hide();
        },

        _onClickSync: function(ev) {
            ev.preventDefault();

            // get selected fact_find id from dropdown
            let fromCopyId = $('.fact-select').val();
            let userFfId = this.factFindId;

            if (!fromCopyId) {
                alert("Please select an applicant to copy the address from.");
                return;
            }

            // 🔹 Disable the button to prevent double click
            const $btn = $(ev.currentTarget);
            $btn.prop('disabled', true).text('Syncing...');

            this._rpc({
                route: '/copy/address',
                params: {
                    user_ff_id: parseInt(userFfId),
                    from_copy_ff_id: parseInt(fromCopyId)
                }
            }).then((result) => {
                if (result && result.status === "success") {
                    location.reload();  // refresh to show new addresses
                } else if (result && result.error) {
                    alert("⚠️ " + result.error);
                    $btn.prop('disabled', false).text('Sync');  // re-enable
                } else {
                    alert("⚠️ Something went wrong while copying.");
                    $btn.prop('disabled', false).text('Sync');
                }
            }).catch((err) => {
                console.error("Sync error:", err);
                $btn.prop('disabled', false).text('Sync');
            });
        },

        _onclickSaveLandlordAuthority: function(ev) {
            ev.preventDefault();
            ev.stopPropagation();

            // Prevent double-clicks by disabling the button temporarily
            const $button = $(ev.currentTarget);
            if ($button.prop('disabled')) {
                return; // Exit if button is already disabled (request in progress)
            }
            $button.prop('disabled', true);

            // Extract field values from the form
            const $form = $('#landlord-authority-form');
            const currentLandlordName = $form.find('input[name="current_landlord_name"]').val();
            const currentLandlordAddress = $form.find('textarea[name="current_landlord_address"]').val();
            const currentLandlordPostcode = $form.find('input[name="current_landlord_postcode"]').val();
            const currentLandlordContactNo = $form.find('input[name="current_landlord_contact_no"]').val();
            const localAuthorityName = $form.find('input[name="local_authority_name"]').val();
            const localAuthorityPostcode = $form.find('input[name="local_authority_postcode"]').val();
            const localAuthorityAddress = $form.find('textarea[name="local_authority_address"]').val();

            // Show loading state
            const originalText = $button.html();
            $button.html('<i class="fa fa-spinner fa-spin me-1"></i> Saving...');

            this._rpc({
                route: '/save/landlord-authority',
                params: {
                    fact_find_id: this.factFindId,
                    data: {
                        current_landlord_name: currentLandlordName,
                        current_landlord_address: currentLandlordAddress,
                        current_landlord_postcode: currentLandlordPostcode,
                        current_landlord_contact_no: currentLandlordContactNo,
                        local_authority_name: localAuthorityName,
                        local_authority_postcode: localAuthorityPostcode,
                        local_authority_address: localAuthorityAddress,
                    }
                }
            }).then((result) => {
                if (result && result.success) {
                    // Show success message
                    $button.html('<i class="fa fa-check me-1"></i> Saved!');
                    $button.removeClass('btn-outline-warning').addClass('btn-success');

                    // Reset button after 2 seconds
                    setTimeout(() => {
                        $button.html(originalText);
                        $button.removeClass('btn-success').addClass('btn-outline-warning');
                        $button.prop('disabled', false);
                    }, 2000);
                } else {
                    // Show error message
                    alert('Error: ' + (result.error || 'Failed to save landlord and authority details'));
                    $button.html(originalText);
                    $button.prop('disabled', false);
                }
            }).catch((error) => {
                console.error('Error saving landlord and authority details:', error);
                alert('An error occurred while saving. Please try again.');
                $button.html(originalText);
                $button.prop('disabled', false);
            });
        },

        _onclickUpdateResidentialAddressActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let addressId = parseFloat($(el.currentTarget).attr('data-address-id'));
            let $addressHistoryForm = $('.address-history-form');

            if (actionType === 'edit') {
                $addressHistoryForm.find('#address_id').val(addressId);

                this._rpc({
                    route: '/ff/get/address-details',
                    params: {
                        address_id: addressId
                    }
                }).then((addressData) => {
                    // Iterate over the returned selectors and values
                    $.each(addressData, function(selector, value) {
                        const $field = $addressHistoryForm.find(selector);
                        if ($field.length) {
                            if ($field.is(':checkbox')) {
                                // Handle different boolean representations
                                const isChecked = value === true || value === 1 || value === "true" || value === "1";
                                $field.prop('checked', isChecked);
                            } else {
                                $field.val(value || '');
                            }
                        }
                    });

                    // Check if there's another current address (not this one being edited)
                    const $currentAddressCards = $('.address-card.current');
                    const hasOtherCurrentAddress = $currentAddressCards.length > 0 &&
                        $currentAddressCards.find(`i[data-address-id="${addressId}"]`).length === 0;

                    // Handle checkbox visibility based on whether this is the current address or another one exists
                    const $currentAddressCheckbox = $addressHistoryForm.find('#current_address_name_checkbox');
                    const isThisAddressCurrent = $currentAddressCheckbox.is(':checked');

                    if (isThisAddressCurrent) {
                        // This address is current - SHOW the checkbox so user can edit/uncheck it
                        $('.current-address-checkbox-container').removeClass('d-none').show();
                        console.log('Current address checkbox shown - editing current address');
                    } else if (hasOtherCurrentAddress) {
                        // Another address is current - hide the checkbox
                        $('.current-address-checkbox-container').addClass('d-none').hide();
                        console.log('Current address checkbox hidden - another address is current');
                    } else {
                        // No current address exists - show the checkbox
                        $('.current-address-checkbox-container').removeClass('d-none').show();
                        console.log('Current address checkbox shown - no current address exists');
                    }

                    // Trigger the residential status change event to handle landlord/authority fields visibility
                    const $residentialStatusSelect = $addressHistoryForm.find('#residential_status_ah');
                    if ($residentialStatusSelect.length) {
                        $residentialStatusSelect.trigger('change');
                    }

                    // Ensure the form is shown and the details section is hidden
                    $addressHistoryForm.removeClass('d-none').fadeIn(400);
                    $('.address-history-details').addClass('d-none').fadeOut(400);
                });
            }

            if (actionType === 'delete') {
                this._rpc({
                    route: '/ff/delete/address',
                    params: {
                        address_id: addressId
                    }
                }).then(() => {
                    $(el.currentTarget).closest('.address-card').fadeOut(300, function() {
                        $(this).remove();
                    });
                });
            }
        },

        start: function() {
            this._super.apply(this, arguments);

            // Bind events for adverse credit questions
            this.$el.on('change', 'input[name="missed_payment_last_3_years"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="arrears_with_mortgage_or_loans"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="arrears_with_credit_card_or_store_cards"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="ccj_against_you"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="debt_management_plan"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="default_registered"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="failed_to_keep_up_repayments"]', this._onChangeAdverseCreditQuestion.bind(this));
            this.$el.on('change', 'input[name="bankruptcy"]', this._onChangeAdverseCreditQuestion.bind(this));

            // Bind events for address history
            this.$el.on('change', '#current_address_name_checkbox', this._onChangeCurrentAddressName.bind(this));
            this.$el.on('change', '#residential_status_ah', this._onchangeResidentialStatus.bind(this));

            // Bind events for dependants
            this.$el.on('change', 'input[name="date_of_birth"]', this._onchangeDateOfBirth.bind(this));

            // Bind events for self-employment form - use event delegation for dynamic content
            this.$el.on('change', '.self-employment-details-form select[name="self_employment_type"]', this._onchangeSelfEmploymentType.bind(this));
            this.$el.on('change', '.self-employment-details-form input[name="has_accountant"]', this._onchangeAccountantDetails.bind(this));

            // Conditional initialization for address history
            const currentAddressCheckbox = this.$('#current_address_name_checkbox')[0];
            if (currentAddressCheckbox && currentAddressCheckbox.checked) {
                this._onChangeCurrentAddressName({
                    target: currentAddressCheckbox
                });
            }

            const residentialStatusSelect = this.$('#residential_status_ah')[0];
            if (residentialStatusSelect && residentialStatusSelect.value &&
                (residentialStatusSelect.value === 'renting_private' || residentialStatusSelect.value === 'renting_local_authority')) {
                this._onchangeResidentialStatus({
                    target: residentialStatusSelect
                });
            }

            // Conditional initialization for dependants
            const dobInput = this.$('input[name="date_of_birth"]')[0];
            if (dobInput && dobInput.value) {
                this._onchangeDateOfBirth({
                    target: dobInput
                });
            }

            // Initialize dependant field visibility
            this._initializeDependantFieldVisibility();

            // DO NOT initialize self-employment fields here
            // They will be initialized when the form is actually shown
        },

        _initializeDependantFieldVisibility: function() {
            var self = this;
            const dobInputs = [
                this.$('input[name="date_of_birth"]')[0],
                this.$('.dependants-form input[name="date_of_birth"]')[0]
            ].filter(Boolean);

            console.debug('Initializing dependant field visibility for DOB inputs:', dobInputs.length);

            dobInputs.forEach(function(dobInput) {
                if (dobInput && dobInput.value) {
                    console.debug('Found DOB input with value:', dobInput.value);
                    var syntheticEvent = {
                        target: dobInput
                    };
                    self._onchangeDateOfBirth(syntheticEvent);
                } else {
                    console.warn('DOB input empty or not found:', dobInput);
                }
            });

            const $visibleDependantsForm = this.$('.dependants-form:not(.d-none)');
            if ($visibleDependantsForm.length) {
                var dobInput = $visibleDependantsForm.find('input[name="date_of_birth"]')[0];
                if (dobInput && dobInput.value) {
                    console.debug('Found visible dependants form with DOB:', dobInput.value);
                    var syntheticEvent = {
                        target: dobInput
                    };
                    self._onchangeDateOfBirth(syntheticEvent);
                } else {
                    console.warn('No DOB input or empty in visible dependants form');
                }
            }
        },

        _onclickUpdateDependantActions: function(el) {
            var actionType = $(el.currentTarget).attr('data-type');
            var dependantId = parseInt($(el.currentTarget).attr('data-dependant-id'));
            var $dependantsForm = $('.dependants-form');
            var self = this;

            if (actionType === 'edit') {
                $dependantsForm.find('#financial_dependants_id').val(dependantId);

                this._rpc({
                    route: '/ff/get/financial-dependants',
                    params: {
                        financial_dependants_id: dependantId
                    }
                }).then(function(dependantData) {
                    // Log the fetched data for debugging
                    console.log('Fetched dependant data:', dependantData);

                    // Clear form fields before setting new values
                    $dependantsForm[0].reset();

                    // Iterate over the mapping and set the default values
                    $.each(dependantData, function(selector, value) {
                        var $element = $dependantsForm.find(selector);
                        if ($element.length) {
                            if (value !== null && value !== undefined) {
                                $element.val(value);
                                console.log(`Set value for ${selector}: ${value}`);
                            }
                        } else {
                            console.warn(`Selector ${selector} not found in dependants form`);
                        }
                    });

                    // Show the form and the dependant details section
                    $('.question-group.q-dependants').addClass('d-none').fadeOut(400);
                    $dependantsForm.removeClass('d-none').fadeIn(400, function() {
                        // Callback ensures form is visible
                        $dependantsForm.find('.dependant-details').removeClass('d-none').fadeIn(400);
                        $('.dependants-history-details').addClass('d-none').fadeOut(400);

                        // Trigger DOB change event after form is fully visible
                        var $dobInput = $dependantsForm.find('input[name="dependant-date-of-birth"]'); // Fixed: Correct name
                        if ($dobInput.length && $dobInput.val()) {
                            console.debug('Triggering DOB change for value:', $dobInput.val());
                            var syntheticEvent = {
                                target: $dobInput[0]
                            };
                            self._onchangeDateOfBirth(syntheticEvent);
                        } else {
                            console.warn('DOB input not found or empty:', {
                                found: $dobInput.length,
                                value: $dobInput.val()
                            });
                            // Fallback: Initialize field visibility based on dependency type
                            var $dependencyTypeSelect = $dependantsForm.find('select[name="dependency_type"]');
                            if ($dependencyTypeSelect.length && $dependencyTypeSelect.val()) {
                                self._updateFieldVisibilityBasedOnDependencyType($dependencyTypeSelect.val(), $dependantsForm);
                            }
                        }
                    });
                }).catch(function(error) {
                    console.error('Error fetching dependant data:', error);
                    alert('Failed to load dependant data.');
                });
            }

            if (actionType === "delete") {
                const dependantId = $(el.currentTarget).data("dependant-id");
                const $card = $(el.currentTarget).closest(".dependant-card");

                // Show popup
                $("#delete-dependant-popup").removeClass("d-none");

                // Handle Yes
                $("#btnDeleteConfirm").off("click").on("click", () => {
                    this._rpc({
                        route: "/ff/delete/financial-dependants",
                        params: { financial_dependants_id: dependantId }
                    }).then((data) => {
                        if (data.success) {
                            $card.fadeOut(400, function () {
                                $(this).remove();
                            });
                        } else {
                            alert("Failed to delete dependant: " + data.error);
                        }
                    });

                    $("#delete-dependant-popup").addClass("d-none");
                });

                // Handle No
                $("#btnDeleteCancel").off("click").on("click", () => {
                    $("#delete-dependant-popup").addClass("d-none");
                });
            }

        },

        _onChangeCurrentAddressName: function(ev) {
            const checkbox = ev.target;
            const $container = $('.current-address-checkbox-container');
            const $addressForm = $('.address-history-form');
            const isFormVisible = $addressForm.is(':visible') && !$addressForm.hasClass('d-none');

            if (checkbox.checked) {
                // Only hide if form is not currently being edited
                // When editing, keep checkbox visible so user can uncheck it
                if (!isFormVisible) {
                    $container.fadeOut(300);
                    console.log('Current address checkbox hidden (marked as current)');
                }
            } else {
                // Show the checkbox container when unchecked
                $container.fadeIn(300);
                console.log('Current address checkbox shown');
            }
        },

        _onchangeResidentialStatus: function(ev) {
            // Placeholder for residential status change handling if needed
            const status = ev.target.value;
            console.log('Residential status changed to:', status);
        },

        _onchangeDateOfBirth: function(ev) {
            const dobInput = ev.target;
            const dobValue = dobInput.value;
            console.debug('Processing DOB change for input:', dobValue);

            // Validate DOB input
            if (!dobValue) {
                console.warn('DOB input is empty');
                return;
            }

            const dob = new Date(dobValue);
            if (!dob.getTime() || isNaN(dob.getTime())) {
                console.warn('Invalid date of birth entered:', dobValue);
                return;
            }

            // Find the parent form context
            const $parentForm = $(dobInput).closest('.dependants-form, form');
            if (!$parentForm.length) {
                console.error('Parent form not found for DOB input:', dobInput);
                return;
            }

            // Find fields within the parent form
            const monthlyChildcareCostField = $parentForm.find('.monthly_childcare_cost')[0];
            const childcareCostReasonField = $parentForm.find('.childcare_cost_reason')[0];
            const dependencyPeriodField = $parentForm.find('.dependency_period')[0];
            const additionalCostField = $parentForm.find('.additional_cost')[0];

            // Log field existence
            console.debug('Field existence:', {
                monthlyChildcareCost: !!monthlyChildcareCostField,
                childcareCostReason: !!childcareCostReasonField,
                dependencyPeriod: !!dependencyPeriodField,
                additionalCost: !!additionalCostField
            });

            const today = new Date();
            const ageInYears = Math.floor(Math.abs(today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365));
            console.debug('Calculated age:', ageInYears);

            // Update dependency type
            const dependencyTypeSelect = $parentForm.find('select[name="dependency_type"]');
            if (dependencyTypeSelect.length) {
                const dependencyType = ageInYears >= 18 ? 'adult' : 'child';
                dependencyTypeSelect.val(dependencyType);
                dependencyTypeSelect.trigger('change');
                console.debug('Set dependency type:', dependencyType);

                // Update field visibility based on dependency type
                this._updateFieldVisibilityBasedOnDependencyType(dependencyType, $parentForm);
            } else {
                console.warn('Dependency type select element not found');
            }
        },

        _updateFieldVisibilityBasedOnDependencyType: function(dependencyType, $parentForm) {
            const monthlyChildcareCostField = $parentForm.find('.monthly_childcare_cost')[0];
            const childcareCostReasonField = $parentForm.find('.childcare_cost_reason')[0];
            const dependencyPeriodField = $parentForm.find('.dependency_period')[0];
            const additionalCostField = $parentForm.find('.additional_cost')[0];

            if (dependencyType === 'adult') {
                if (additionalCostField) {
                    additionalCostField.classList.remove('d-none');
                    console.debug('Showing additional_cost field');
                }
                if (monthlyChildcareCostField) monthlyChildcareCostField.classList.add('d-none');
                if (childcareCostReasonField) childcareCostReasonField.classList.add('d-none');
                if (dependencyPeriodField) dependencyPeriodField.classList.add('d-none');
                console.debug('Hiding childcare fields for adult');
            } else {
                if (additionalCostField) {
                    additionalCostField.classList.add('d-none');
                    console.debug('Hiding additional_cost field');
                }
                if (monthlyChildcareCostField) monthlyChildcareCostField.classList.remove('d-none');
                if (childcareCostReasonField) childcareCostReasonField.classList.remove('d-none');
                if (dependencyPeriodField) dependencyPeriodField.classList.remove('d-none');
                console.debug('Showing childcare fields for child');
            }
        },

        _onclickUpdateBankingDetailsActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let bankingDetailsId = parseFloat($(el.currentTarget).attr('data-banking-details-id'));
            let $bankingDetailsForm = $('.banking-details-form');

            if (actionType === 'edit') {
                $bankingDetailsForm.find('#banking_details_id').val(bankingDetailsId);
                this._rpc({
                    route: '/get/fact-find/banking-details',
                    params: {
                        banking_details_id: bankingDetailsId
                    }
                }).then((bankingDetailsData) => {
                    // Populate form with retrieved data using selectors as keys
                    $.each(bankingDetailsData, function(selector, value) {
                        let $element = $bankingDetailsForm.find(selector);
                        if ($element.is('input[type="checkbox"]')) {
                            $element.prop('checked', value);
                        } else {
                            $element.val(value);
                        }
                    });
                    // Trigger the togglePreferredDDDate function to set visibility based on checkbox state
                    const directDebitCheckbox = $bankingDetailsForm.find('input[name="direct_debit_for_mortgage"]')[0];
                    this._togglePreferredDDDate({
                        target: directDebitCheckbox
                    });
                    $bankingDetailsForm.removeClass('d-none').fadeIn(400);
                    $('.banking-details-dp').addClass('d-none').fadeOut(400);
                });
            }

            if (actionType === 'delete') {
                this._rpc({
                    route: '/delete/fact-find/banking-details',
                    params: {
                        banking_details_id: bankingDetailsId
                    }
                });
                $(el.currentTarget).closest('.banking-details-card').hide();
            }
        },

        _onclickUpdateYourPropertiesActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let yourPropertiesId = parseInt($(el.currentTarget).attr('data-your-properties-id'));
            let $yourPropertiesForm = $('.your-properties-form');

            if (actionType === 'edit') {
                // Set the property ID in the form
                $yourPropertiesForm.find('#your_properties_id').val(yourPropertiesId);

                this._rpc({
                    route: '/get/fact-find/your-properties',
                    params: {
                        your_properties_id: yourPropertiesId
                    }
                }).then((yourPropertiesData) => {
                    console.log('Retrieved data:', yourPropertiesData);

                    // Clear form first
                    $yourPropertiesForm.find('input[type="text"], input[type="number"], select, textarea').val('');
                    $yourPropertiesForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);

                    // Populate form with retrieved data
                    if (yourPropertiesData.property_usage_yep) {
                        $yourPropertiesForm.find('select[name="property_usage_yep"]').val(yourPropertiesData.property_usage_yep);
                    }
                    if (yourPropertiesData.house_number_yep) {
                        $yourPropertiesForm.find('input[name="house_number_yep"]').val(yourPropertiesData.house_number_yep);
                    }
                    if (yourPropertiesData.post_code_yep) {
                        $yourPropertiesForm.find('input[name="post_code_yep"]').val(yourPropertiesData.post_code_yep);
                    }
                    if (yourPropertiesData.street_address_existing_properties) {
                        $yourPropertiesForm.find('textarea[name="street_address_existing_properties"]').val(yourPropertiesData.street_address_existing_properties);
                    }
                    if (yourPropertiesData.county_yep) {
                        $yourPropertiesForm.find('input[name="county_yep"]').val(yourPropertiesData.county_yep);
                    }
                    if (yourPropertiesData.property_type) {
                        $yourPropertiesForm.find('select[id="property_type"]').val(yourPropertiesData.property_type);
                    }
                    if (yourPropertiesData.bedrooms) {
                        $yourPropertiesForm.find('input[id="bedrooms"]').val(yourPropertiesData.bedrooms);
                    }
                    if (yourPropertiesData.current_property_valuation_yep) {
                        $yourPropertiesForm.find('input[name="current_property_valuation_yep"]').val(yourPropertiesData.current_property_valuation_yep);
                    }
                    if (yourPropertiesData.tenure_yep) {
                        $yourPropertiesForm.find('select[name="tenure_yep"]').val(yourPropertiesData.tenure_yep);
                    }
                    if (yourPropertiesData.has_mortgage !== undefined) {
                        $yourPropertiesForm.find('input[name="has_mortgage"]').prop('checked', yourPropertiesData.has_mortgage);
                    }
                    if (yourPropertiesData.is_hmo !== undefined) {
                        $yourPropertiesForm.find('input[name="is_hmo_yep"]').prop('checked', yourPropertiesData.is_hmo);
                    }
                    if (yourPropertiesData.ground_rent) {
                        $yourPropertiesForm.find('input[id="ground_rent"]').val(yourPropertiesData.ground_rent);
                    }
                    if (yourPropertiesData.service_charge) {
                        $yourPropertiesForm.find('input[name="service_charge"]').val(yourPropertiesData.service_charge);
                    }
                    if (yourPropertiesData.monthly_rental_income) {
                        $yourPropertiesForm.find('input[name="monthly_rental_income"]').val(yourPropertiesData.monthly_rental_income);
                    }
                    if (yourPropertiesData.ownership_percentage_yep) {
                        $yourPropertiesForm.find('input[name="ownership_percentage_yep"]').val(yourPropertiesData.ownership_percentage_yep);
                    }

                    // HTB fields (corrected)
                    if (yourPropertiesData.second_charge_property) {
                        $yourPropertiesForm.find('select[name="second_charge_property"]').val(yourPropertiesData.second_charge_property);
                    }
                    if (yourPropertiesData.second_charge_details) {
                        $yourPropertiesForm.find('textarea[name="second_charge_details"]').val(yourPropertiesData.second_charge_details);
                    }
                    if (yourPropertiesData.htb_scheme_available) {
                        $yourPropertiesForm.find('select[name="htb_scheme_available_yep"]').val(yourPropertiesData.htb_scheme_available);
                    }
                    if (yourPropertiesData.htb_scheme_location) {
                        $yourPropertiesForm.find('select[name="htb_scheme_location"]').val(yourPropertiesData.htb_scheme_location);
                    }
                    if (yourPropertiesData.redeem_htb_loan) {
                        $yourPropertiesForm.find('select[name="redeem_htb_loan"]').val(yourPropertiesData.redeem_htb_loan);
                    }
                    if (yourPropertiesData.shared_ownership_available) {
                        $yourPropertiesForm.find('select[name="shared_ownership_available_yep"]').val(yourPropertiesData.shared_ownership_available);
                    }
                    if (yourPropertiesData.ownership_percentage) {
                        $yourPropertiesForm.find('select[name="ownership_percentage"]').val(yourPropertiesData.ownership_percentage);
                    }

                    // TRIGGER PROPERTY USAGE FUNCTION AFTER POPULATING DATA
                    if (yourPropertiesData.property_usage_yep) {
                        const mockEvent = {
                            target: { value: yourPropertiesData.property_usage_yep }
                        };
                        this._onchangePropertyUsageYep(mockEvent);
                    }

                    $yourPropertiesForm.removeClass('d-none').fadeIn(400);
                    $('html, body').animate({
                        scrollTop: $yourPropertiesForm.offset().top
                    }, 500);
                }).catch((error) => {
                    console.error('Error fetching property data:', error);
                });
            } else if (actionType === 'delete') {
                this._rpc({
                    route: '/delete/fact-find/your-properties',
                    params: {
                        your_properties_id: yourPropertiesId
                    }
                }).then(() => {
                    $(el.currentTarget).closest('.your-properties-card').remove();
                });
            }
        },

        _triggerPropertyUsageChange: function(propertyUsage) {
            if (propertyUsage) {
                const mockEvent = {
                    target: { value: propertyUsage }
                };
                this._onchangePropertyUsageYep(mockEvent);
            }
        },

        _onclickUpdateExistingMortgagesActions: function(el) {
            // Define mappings for property_usage and ownership_of_deed
            const propertyUsageMap = {
                'residential': 'Residential',
                'commercial': 'Commercial',
                'second_residential': 'Second Residential',
                'btl': 'BTL',
                'company_btl': 'Company BTL'
            };

            const ownershipOfDeedMap = {
                'sole_owner': 'Sole Owner',
                'joint_owners': 'Jointly',
                'client_or_someone_else': 'Only by client or with someone else',
                'partner_or_someone_else': 'Only by Partner or with someone else'
            };

            let actionType = $(el.currentTarget).attr('data-type');
            let existingMortgagesId = parseInt($(el.currentTarget).attr('data-existing-mortgages-id'));
            let $existingMortgagesForm = $('.existing_mortgages_form');
            let $existingMortgagesContainer = $('.existing-mortgages-container');

            if (actionType === 'edit') {
                $existingMortgagesForm.find('#existing_mortgages_id').val(existingMortgagesId);

                this._rpc({
                    route: '/get/ff/existing-mortgages',
                    params: {
                        existing_mortgages_id: existingMortgagesId
                    }
                }).then((existingMortgagesData) => {
                    if (existingMortgagesData.error) {
                        console.error('Error:', existingMortgagesData.error);
                        alert('Error loading existing mortgage data: ' + existingMortgagesData.error);
                        return;
                    }

                    // Populate form fields with the retrieved data
                    $existingMortgagesForm.find('textarea[id="your-properties-address"]').val(existingMortgagesData.property_address || '');
                    $existingMortgagesForm.find('select[name="property_usage_yep"]').val(existingMortgagesData.property_usage || '');
                    $existingMortgagesForm.find('select[name="ownership_of_deed"]').val(existingMortgagesData.ownership_of_deed || '');
                    $existingMortgagesForm.find('input[name="current_property_valuation"]').val(existingMortgagesData.current_property_valuation || '');
                    $existingMortgagesForm.find('input[name="outstanding_mortgage_amount"]').val(existingMortgagesData.outstanding_mortgage_amount || '');
                    $existingMortgagesForm.find('input[name="monthly_payment"]').val(existingMortgagesData.monthly_payment || '');
                    $existingMortgagesForm.find('select[name="lender_name"]').val(existingMortgagesData.lender_name || '');
                    $existingMortgagesForm.find('input[name="account_no"]').val(existingMortgagesData.account_no || '');
                    $existingMortgagesForm.find('select[name="rate_type"]').val(existingMortgagesData.rate_type || '');
                    $existingMortgagesForm.find('input[name="current_rate"]').val(existingMortgagesData.current_rate || '');
                    $existingMortgagesForm.find('input[name="remaining_term"]').val(existingMortgagesData.remaining_term || '');
                    $existingMortgagesForm.find('select[name="repayment_method"]').val(existingMortgagesData.repayment_method || '');
                    $existingMortgagesForm.find('input[name="remortgage_date"]').val(existingMortgagesData.remortgage_date || '');
                    $existingMortgagesForm.find('input[name="mortgage_case_number"]').val(existingMortgagesData.mortgage_case_number || '');
                    $existingMortgagesForm.find('input[name="property_purchased_date"]').val(existingMortgagesData.property_purchased_date || '');
                    $existingMortgagesForm.find('input[name="property_purchased_price"]').val(existingMortgagesData.property_purchased_price || '');

                    $existingMortgagesForm.removeClass('d-none').fadeIn(400);
                    $existingMortgagesContainer.addClass('d-none').fadeOut(400);
                    $('html, body').animate({
                        scrollTop: $existingMortgagesForm.offset().top
                    }, 500);
                }).catch((error) => {
                    console.error('Error loading existing mortgage data:', error);
                    alert('Error loading existing mortgage data');
                });
            } else if (actionType === 'delete') {
                if (confirm('Are you sure you want to delete this existing mortgage?')) {
                    this._rpc({
                        route: '/delete/ff/existing-mortgages',
                        params: {
                            existing_mortgages_id: existingMortgagesId
                        }
                    }).then((response) => {
                        if (response.status === 'success') {
                            $(el.currentTarget).closest('.existing-mortgages-card').remove();
                        } else {
                            console.error('Error deleting existing mortgage:', response.message);
                            alert('Error deleting existing mortgage: ' + response.message);
                        }
                    }).catch((error) => {
                        console.error('Error deleting existing mortgage:', error);
                        alert('Error deleting existing mortgage');
                    });
                }
            }
        },

        _onclickUpdateEmploymentDetailsActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let employmentDetailsId = parseFloat($(el.currentTarget).attr('data-employment-details-id'));
            let $employmentDetailsForm = $('.employment-details-form');
            const self = this;

            if (actionType === 'edit') {
                // Set the employment details ID for update
                $employmentDetailsForm.find('#employment_details_id').val(employmentDetailsId);

                this._rpc({
                    route: '/get/fact-find/employment-details',
                    params: {
                        employment_details_id: employmentDetailsId
                    }
                }).then((employmentDetailsData) => {
                    if (employmentDetailsData.length > 0) {
                        const employmentDetail = employmentDetailsData[0];

                        // Populate text inputs and textareas
                        $employmentDetailsForm.find('input[name="ni_number"]').val(employmentDetail.ni_number || '');
                        $employmentDetailsForm.find('input[name="anticipated_retirement_age"]').val(employmentDetail.anticipated_retirement_age || '');
                        $employmentDetailsForm.find('input[name="occupation"]').val(employmentDetail.occupation || '');
                        $employmentDetailsForm.find('input[name="employer_name"]').val(employmentDetail.employer_name || '');
                        $employmentDetailsForm.find('textarea[name="address_of_working_place"]').val(employmentDetail.address_of_working_place || '');
                        $employmentDetailsForm.find('input[name="work_telephone"]').val(employmentDetail.work_telephone || '');
                        $employmentDetailsForm.find('input[name="start_date"]').val(employmentDetail.start_date || '');
                        $employmentDetailsForm.find('input[name="end_date"]').val(employmentDetail.end_date || '');
                        $employmentDetailsForm.find('input[name="current_contract_start_date"]').val(employmentDetail.current_contract_start_date || '');
                        $employmentDetailsForm.find('input[name="current_contract_end_date"]').val(employmentDetail.current_contract_end_date || '');
                        $employmentDetailsForm.find('input[name="years_of_experience_contract_basis"]').val(employmentDetail.years_of_experience_contract_basis || '');
                        $employmentDetailsForm.find('input[name="monthly_gross_salary"]').val(employmentDetail.monthly_gross_salary || '');
                        $employmentDetailsForm.find('input[name="annual_bonus"]').val(employmentDetail.annual_bonus || '');
                        $employmentDetailsForm.find('input[name="annual_salary"]').val(employmentDetail.annual_salary || '');
                        $employmentDetailsForm.find('input[name="student_loans"]').val(employmentDetail.student_loans || '');
                        $employmentDetailsForm.find('input[name="post_graduate_loan"]').val(employmentDetail.post_graduate_loan || '');
                        $employmentDetailsForm.find('input[name="gym_membership"]').val(employmentDetail.gym_membership || '');
                        $employmentDetailsForm.find('input[name="childcare"]').val(employmentDetail.childcare || '');
                        $employmentDetailsForm.find('input[name="other"]').val(employmentDetail.other || '');

                        // Populate select dropdowns
                        $employmentDetailsForm.find('select[name="employment_basis"]').val(employmentDetail.employment_basis || '');
                        $employmentDetailsForm.find('select[name="employment-status"]').val(employmentDetail.employment_status || '');
                        $employmentDetailsForm.find('select[name="occupation_sector_type"]').val(employmentDetail.occupation_sector || '');
                        $employmentDetailsForm.find('select[name="occupation_sector"]').val(employmentDetail.occupation_type || '');
                        $employmentDetailsForm.find('select[name="employment_type"]').val(employmentDetail.employment_type || '');

                        // Handle checkboxes/radio buttons
                        $employmentDetailsForm.find('input[name="is_current_employment"]').prop('checked', employmentDetail.is_current_employment || false);
                        $employmentDetailsForm.find('input[name="has_deductions"]').prop('checked', employmentDetail.has_deductions || false);

                        // Trigger the deductions visibility logic after setting checkbox value
                        const hasDeductionsCheckbox = $employmentDetailsForm.find('input[name="has_deductions"]')[0];
                        if (hasDeductionsCheckbox) {
                            // Create a synthetic event object and call the function
                            const syntheticEvent = {
                                target: hasDeductionsCheckbox
                            };
                            self._onchangeHasDeductions(syntheticEvent);
                        }

                        // Show the form
                        $employmentDetailsForm.removeClass('d-none').fadeIn(400);
                    }
                });

            } else if (actionType === 'delete') {
                if (confirm('Are you sure you want to delete this employment detail?')) {
                    this._rpc({
                        route: '/delete/fact-find/employment-details',
                        params: {
                            employment_details_id: employmentDetailsId
                        }
                    }).then(() => {
                        // Remove the card from DOM
                        $(el.currentTarget).closest('.employment-details-card').remove();
                    });
                }
            }
        },

        _onchangeHasDeductions: function(ev) {
            const hasDeductionsCheckbox = ev.target;
            const postGraduateLoanField = document.querySelector('.post_graduate_loan');
            const gymMembershipField = document.querySelector('.gym_membership');
            const childcareField = document.querySelector('.childcare');
            const studentLoansField = document.querySelector('.student_loans');
            const otherField = document.querySelector('.other');

            if (hasDeductionsCheckbox.checked) {
                postGraduateLoanField.classList.remove('d-none');
                gymMembershipField.classList.remove('d-none');
                childcareField.classList.remove('d-none');
                studentLoansField.classList.remove('d-none');
                otherField.classList.remove('d-none');
            } else {
                postGraduateLoanField.classList.add('d-none');
                gymMembershipField.classList.add('d-none');
                childcareField.classList.add('d-none');
                studentLoansField.classList.add('d-none');
                otherField.classList.add('d-none');
            }
        },

        _onclickUpdateProtectionDetailsActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let protectionDetailsId = parseInt($(el.currentTarget).attr('data-protection-details-id')); // Use parseInt instead of parseFloat
            let $protectionDetailsForm = $('.protection-details-form');

            if (actionType === 'edit') {
                $protectionDetailsForm.find('#protection_details_id').val(protectionDetailsId);
                this._rpc({
                    route: '/get/fact-find/protection-details',
                    params: {
                        protection_details_id: protectionDetailsId
                    }
                }).then((protectionDetailsData) => {
                    // Populate form with retrieved data
                    if (protectionDetailsData && protectionDetailsData.length > 0) {
                        const data = protectionDetailsData[0]; // Get the first record
                        $.each(data, function(selector, value) {
                            if (selector === 'insurance_provider' || selector === 'protection_type') {
                                $protectionDetailsForm.find(`select[name="${selector}"] option[value="${value}"]`).prop('selected', true);
                            } else if (selector !== 'protection_details_id') { // Skip the ID field
                                $protectionDetailsForm.find(`input[name="${selector}"]`).val(value);
                            }
                        });
                    }
                    $protectionDetailsForm.removeClass('d-none').fadeIn(400);
                });
            } else if (actionType === 'delete') {
                this._rpc({
                    route: '/delete/fact-find/protection-details',
                    params: {
                        protection_details_id: protectionDetailsId
                    }
                }).then(() => {
                    $(el.currentTarget).closest('.protection-details-card').remove();
                });
            }
        },

        _onClickSaveSingleData: function(el) {
            $(el.currentTarget).html('<i class="fa fa-circle-o-notch fa-spin"/>')
            let inputField = $(el.currentTarget).siblings('input');
            let inputValue = inputField.val();
            let factFindId = $(el.currentTarget).attr('data-fact-find-id');
            let fieldName = $(el.currentTarget).attr('data-field-name');
            this._rpc({
                route: '/ff/update/single/data',
                params: {
                    value: inputValue,
                    fact_find_id: factFindId,
                    field_name: fieldName,
                }
            }).then((data) => {
                $(el.currentTarget).html('Save')
            })
        },

        _onchangeFurtherDocUpload: function(el) {
            let file = el.currentTarget.files[0];
            let reader = new FileReader();
            const self = this;

            reader.onload = function(e) {
                // Store the content of the file
                self.uploadFurtherFileContent = e.target.result;
            };

            // Read the file as text (change to readAsBinaryString or readAsDataURL if needed)
            reader.readAsDataURL(file);
        },

        _onUploadFurtherDocument: function(el) {
            let fileContent = this.uploadFurtherFileContent
            if (fileContent) {
                let fileInput = $('.further-doc-upload');
                let alert = $(el.currentTarget).closest('.doc-alerts').hide();
                let docRequestId = $(el.currentTarget).attr('data-doc-request-id');
                let files = fileInput[0].files;
                let filename = fileInput[0].files[0].name
                let leadId = false; // TODO: Get leads for frontend
                let leadName = 'Test Lead'; // TODO: Get leads for frontend
                let documentType = 'Test'; // TODO: Get leads for frontend

                if (files.length > 0) {
                    this._rpc({
                        route: '/upload/further/documents',
                        params: {
                            data: this.uploadFileContent,
                            doc_request_id: docRequestId,
                            doc_name: filename,
                        }
                    }).then((data) => {
                        $('.further-documents-upload-container').html('')
                        $(`.rd-${docRequestId}`).before(`
                            <a href="/web/content/${data.doc_id}?download=true"
                                class="btn btn-warning btn-sm">
                                <i class="fa fa-arrow-circle-o-down me-1"/>
                                ${data.name}
                            </a>
                        `);
                    })
                } else {
                    alert("No file selected");
                }
            }
        },

        _onClickUploadFurtherDocument: function(el) {
            let dataType = $(el.currentTarget).attr('data-type');
            let docRequestId = $(el.currentTarget).attr('data-doc-request-id');
            let docName = $(el.currentTarget).attr('data-doc-name');
            if (dataType === 'further') {
                let htmlContent = `
                <div class="alert alert-dark alert-dismissible fade show text-center mt-2 doc-alerts" role="alert">
                  Get ready! You're about to launch a file into the system for <strong>${docName}</strong><br/>
                  <div class="mt-1">
                    <input class="form-control upload-document-file further-doc-upload" type="file">
                    <div class="d-grid gap-2 d-md-block mt-2">
                        <button class="btn btn-light rounded-pill btn-upload-further-doc" type="button" data-doc-request-id="${docRequestId}"><i class="fa fa-cloud-upload me-2"/>Upload</button>
                    </div>
                  </div>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
                </div>
                `
                $('.further-documents-upload-container').html(htmlContent);
            }
        },

        _onChangeDocumentFile: function(el) {
            let file = el.currentTarget.files[0];
            let reader = new FileReader();
            const self = this;

            reader.onload = function(e) {
                // Store the content of the file
                self.uploadFileContent = e.target.result;
            };

            // Read the file as text (change to readAsBinaryString or readAsDataURL if needed)
            reader.readAsDataURL(file);
        },

        _onclickDocumentFolderDropDown: function(el) {
            let $content = $('#' + $(el.currentTarget).attr('data-id'));
            let $folder = $content.prev('.folder');
            let $arrow = $folder.find('.fa'); // Find the <i> tag inside the folder

            if ($content.is(':visible')) {
                // If content is visible, slide it up and rotate arrow back
                $content.slideUp('fast');
                $arrow.removeClass('rotate');
                $folder.removeClass('open');
            } else {
                // If content is hidden, slide it down and rotate arrow
                $content.slideDown('fast');
                $arrow.addClass('rotate');
                $folder.addClass('open');
            }
        },

        _onclickNext: function(el) {
            let data = $(el.currentTarget).attr('data-id');
            data = data.split('-');
            $('.li_' + data[0]).click();
            $('.li_' + data[1]).click();
        },

        _loadDocuments: function() {
            this._rpc({
                route: '/get/fact-find-documents',
                params: {
                    fact_find_id: parseInt(this.factFindId)
                }
            }).then((data) => {
                $.each(data, function(index, item) {
                    let documentContent = ``;
                    $.each(item, function(doc_index, document) {
                        const fieldKey = document.field_key || '';
                        const documents = document.documents || [];
                        documentContent += `<div class='document-header ${fieldKey} w-100 p-2 d-none' style='background: white; color: var(--primary-gold, #9b872b); border-radius: 8px 8px 0 0; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                ${doc_index}
                                <i class="fa fa-cloud-upload edit-docs doc-action float-end" data-type='upload' data-doc-heading="${doc_index}" title="Upload File" style="color: var(--primary-gold, #9b872b); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"/>
                            </div>`
                        $.each(documents, function(grouped_doc_index, grouped_doc) {
                            documentContent += `
                            <div class='document-content ${fieldKey} mb-2 w-100 pe-2 p-2 d-id-${grouped_doc.id} d-none' style='background: #ffffff; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.3s ease;' onmouseover="this.style.borderColor='var(--primary-gold, #9b872b)'; this.style.boxShadow='0 4px 8px rgba(155,135,43,0.15)'" onmouseout="this.style.borderColor='#e0e0e0'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
                                <i class="fa fa-file-text me-2" style="color: var(--primary-gold, #9b872b);"/>
                                <span style="font-weight: 400; color: #333;">${grouped_doc.name}</span>
                                <div class="document-edit f-right">
                                    <a href="/web/content/${grouped_doc.id}?download=true" download="">
                                        <i class="fa fa-download download-docs" style="color: var(--primary-gold, #9b872b); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='var(--primary-gold-dark, #87791f)'; this.style.transform='scale(1.2)'" onmouseout="this.style.color='var(--primary-gold, #9b872b)'; this.style.transform='scale(1)'"/>
                                    </a>
                                    <i class="fa fa-cloud-upload edit-docs doc-action ms-2" data-type='upload' data-doc-id="${grouped_doc.id}" data-doc-heading="${doc_index}" title="Upload File" data-doc-name="${grouped_doc.name}" style="color: var(--primary-gold, #9b872b); cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='var(--primary-gold-dark, #87791f)'; this.style.transform='scale(1.2)'" onmouseout="this.style.color='var(--primary-gold, #9b872b)'; this.style.transform='scale(1)'"/>
                                    <i class="fa fa-trash-o delete-docs doc-action ms-2" data-type='delete' data-doc-id="${grouped_doc.id}" data-doc-name="${grouped_doc.name}" style="color: #dc3545; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='#c82333'; this.style.transform='scale(1.2)'" onmouseout="this.style.color='#dc3545'; this.style.transform='scale(1)'"/>
                                </div>

                            </div>
                            `
                        })
                    })
                    $(`.${index}-document-content`).html(documentContent)
                })

                // Personal Details
                if ($('[name="another_name_checkbox"]').is(':checked')) $('.alteration_passport').removeClass('d-none');
                if ($('[name="nationality"]').val()) $('.passport_pages').removeClass('d-none');
                if ($('[name="indefinite_leave_to_remain"]').val() === 'no') $('.sharecode_immigration_status').removeClass('d-none');
                if ($('[name="settled_status"]').val()) $('.sharecode_immigration_status').removeClass('d-none');

                // Employment Details
                if ($('[name="start_date"]').val()) {
                    const startDate = new Date($('[name="start_date"]').val());
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    if (startDate >= sixMonthsAgo) {
                        $('.employment_appointment_letter').removeClass('d-none');
                    }
                }
                if ($('[name="years_of_experience_contract_basis"]').val()) $('.employment_contract').removeClass('d-none');
                if ($('[name="annual_bonus"]').val()) $('.last_2_years_bonus_payslips').removeClass('d-none');
                if ($('[name="annual_salary"]').val()) {
                    $('.last_3_months_payslips').removeClass('d-none');
                    $('.last_2_years_p60').removeClass('d-none');
                    $('.last_3_months_bank_statements_salary').removeClass('d-none');
                    $('.salary_increment_letter').removeClass('d-none');
                    $('.name_confirmation_letter').removeClass('d-none');
                }
                if ($('[name="gross_monthly_retirement_income"]').val()) {
                    $('.last_3_months_bank_statements_pension').removeClass('d-none');
                    $('.pension_forecast_statement').removeClass('d-none');
                }
                if ($('[name="self_employment_start_date"]').val()) {
                    $('.last_2_years_tax_calculations').removeClass('d-none');
                    $('.last_2_years_tax_year_overview').removeClass('d-none');
                    $('.last_2_years_tax_returns').removeClass('d-none');
                }
                if ($('[name="business_bank_account"]:checked').val() === 'true') $('.latest_3_months_company_bank_statements').removeClass('d-none');
                if ($('[name="has_accountant"]:checked').val() === 'true') $('.signed_finalized_latest_2_years_company_accounts').removeClass('d-none');
                if ($('[name="self_let_properties_count_new"]').val()) {
                    $('.last_2_years_tax_calculations').removeClass('d-none');
                    $('.last_2_years_tax_year_overview').removeClass('d-none');
                    $('.last_2_years_tax_returns').removeClass('d-none');
                }

                // Other Income
                if ($('[name="income_type"]').val()) {
                    $('.other_income_bank_statements').removeClass('d-none');
                    $('.tax_credit_statement').removeClass('d-none');
                    $('.universal_tax_credit_statements').removeClass('d-none');
                    $('.child_tax_credit_award_letter').removeClass('d-none');
                    $('.pip_dla_letter').removeClass('d-none');
                }

                // Credit Commitments
                if ($('[name="arrears_with_credit_card_or_store_cards"]:checked').val() === 'yes') $('.latest_multi_agency_credit_report').removeClass('d-none');
                if ($('[name="commitment_type"]').val()) $('.latest_multi_agency_credit_report').removeClass('d-none');
                if ($('[name="intend_to_repay"]').is(':checked')) $('.latest_clearance_statement').removeClass('d-none');

                // Monthly Budget
                if ($('[name="total_expenses"]').val()) $('.monthly_expenses_bank_statements').removeClass('d-none');

                // Deposit
                if ($('[name="deposit_from_savings"]').val()) $('.gifted_deposit_bank_statements').removeClass('d-none');
                if ($('[name="gifted_deposit_from_friend"]').val()) $('.gifted_deposit_format').removeClass('d-none');
                if ($('[name="gifted_deposit_from_family"]').val()) $('.gifted_deposit_format').removeClass('d-none');

                // Bank Accounts
                if ($('[name="ynm-account-holder-name"]').val()) $('.bank_statement_name_confirmation').removeClass('d-none');
                if ($('[name="direct_debit_for_mortgage"]').is(':checked')) $('.requested_direct_debit_bank_statement').removeClass('d-none');

                // New Property Details
                if ($('[name="is_new_build"]').is(':checked')) {
                    $('.reservation_form').removeClass('d-none');
                    $('.cml_form').removeClass('d-none');
                }
                if ($('[name="house_flat_no"]').val()) $('.memorandum_of_sale').removeClass('d-none');
                if ($('[name="epc_predicted_epc_rate"]').val()) $('.epc').removeClass('d-none');
                if ($('[name="pea_rate"]').val()) $('.pea').removeClass('d-none');
                if ($('[name="help_to_buy_loan"]').is(':checked')) $('.annual_payment_information_letter').removeClass('d-none');
                if ($('[name="estimated_monthly_rental_income"]').val()) {
                    $('.arla_letter').removeClass('d-none');
                    $('.sales_particular').removeClass('d-none');
                }
                if ($('[name="current_monthly_rental_income"]').val()) {
                    $('.tenancy_agreement').removeClass('d-none');
                    $('.latest_3_months_bank_statements_rental').removeClass('d-none');
                    $('.latest_3_months_bank_statements_mortgage').removeClass('d-none');
                    $('.mortgage_statement').removeClass('d-none');
                }
                if ($('[name="hmo"]').is(':checked')) $('.tenancy_agreements_multiple_occupants').removeClass('d-none');
                if ($('[name="company_name"]').val()) $('.spv_bank_statements').removeClass('d-none');

                // Existing Properties
                if ($('[name="monthly_rental_income"]').val()) {
                    $('.tenancy_agreement').removeClass('d-none');
                    $('.latest_3_months_bank_statements_rental').removeClass('d-none');
                    $('.latest_3_months_bank_statements_mortgage').removeClass('d-none');
                }

                // Existing Mortgages
                if ($('[name="monthly_payment"]').val()) $('.mortgage_statement').removeClass('d-none');
            })


        },

        _onClickBtnUploadConfirm: function(el) {
            const attachmentId = $(el.currentTarget).attr('data-doc-id');
            let fileInput = $('#document-file-' + attachmentId);
            let alert = $(el.currentTarget).closest('.doc-alerts').hide();
            let files = fileInput[0].files;
            let filename = fileInput[0].files[0].name
            let section, withLabel;
            let headerContent;
            if (attachmentId === 'new-attachment') {
                headerContent = $(el.currentTarget).closest('.alert').prevAll('.document-header').first()
                withLabel = true;
                section = headerContent.first().children('i').attr('data-doc-heading')
            } else {
                withLabel = true;
                section = $(el.currentTarget).closest('.document-content').prevAll('.document-header').first().children('i').attr('data-doc-heading')
            }

            if (files.length > 0) {
                // Read the file content for this specific upload
                let reader = new FileReader();
                reader.onload = (e) => {
                    let fileContent = e.target.result;

                    this._rpc({
                        route: '/ff/upload/documents',
                        params: {
                            data: fileContent, // Use the content from this specific file
                            section: section,
                            with_label: withLabel,
                            doc_name: filename,
                            fact_find_id: this.factFindId
                        }
                    }).then((data) => {
                        let htmlContent = `
                            <div class='document-content mb-1 w-100 pe-1 bg-light p-1 d-id-${data.id}'>
                                <i class="fa fa-file-text me-1"/>
                                <span>${filename}</span>
                                <div class="document-edit f-right">
                                    <a href="/web/content/${data.id}?download=true" download="">
                                        <i class="fa fa-download download-docs"/>
                                    </a>
                                    <i class="fa fa-cloud-upload edit-docs doc-action" data-type='upload' data-doc-id="${data.id}" data-doc-heading="${section}" title="Upload File" data-doc-name="${filename}"/>
                                    <i class="fa fa-trash-o delete-docs doc-action" data-type='delete' data-doc-id="${data.id}" data-doc-name="${filename}"/>
                                </div>

                            </div>
                        `
                        if (headerContent) {
                            headerContent.after(htmlContent)
                        } else {
                            $('.d-id-' + attachmentId).after(htmlContent)
                        }

                        // Clean up the alert after successful upload
                        alert.remove();
                    });
                };
                reader.readAsDataURL(files[0]);
            } else {
                alert("No file selected");
            }
        },

        _onclickDocAction: function(el) {
            let dataType = $(el.currentTarget).attr('data-type');
            let attachmentId = $(el.currentTarget).attr('data-doc-id');
            let docName = $(el.currentTarget).attr('data-doc-name');
            let docHeading = $(el.currentTarget).attr('data-doc-heading');
            attachmentId = attachmentId ? attachmentId : 'new-attachment';

            // Check if alert already exists for this item
            let existingAlert;
            if (attachmentId === 'new-attachment') {
                existingAlert = $(el.currentTarget).parent().next('.doc-alerts');
            } else {
                existingAlert = $(el.currentTarget).closest('[class*="document-content"]').find('.doc-alerts');
            }

            // If alert exists, remove it (toggle functionality)
            if (existingAlert.length > 0) {
                existingAlert.remove();
                return;
            }

            let documentContent = dataType === 'upload' ? `
                <div class="alert alert-dark alert-dismissible fade show text-center mt-2 doc-alerts" role="alert">
                  Get ready! You're about to launch a file into the system for <strong>${docHeading}</strong><br/>
                  <div class="mt-1">
                        <input class="form-control upload-document-file" type="file" id="document-file-${attachmentId}">
                        <div class="d-grid gap-2 d-md-block mt-2">
                            <button class="btn btn-light rounded-pill btn-upload-confirm" data-doc-id='${attachmentId}' type="button"><i class="fa fa-cloud-upload me-2"/>Upload</button>
                        </div>
                  </div>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            ` : `
                <div class="alert alert-danger alert-dismissible fade show text-center mt-2 doc-alerts" role="alert">
                  Whoa there! Are you really sure you want to send <strong>${docName}</strong> to the great recycle bin in the sky?
                  <i class="fa fa-check delete-confirm" data-doc-id="${attachmentId}"/>
                  <button type="button" class="btn-close btn-close-${attachmentId}" data-bs-dismiss="alert" aria-label="Close"/>
                </div>
            `
            if (attachmentId === 'new-attachment') {
                let headerArea = $(el.currentTarget).parent();
                headerArea.after(documentContent);
            } else {
                let contentArea = $(el.currentTarget).closest('[class*="document-content"]');
                contentArea.append(documentContent);
            }
        },

        _onClickDocumentDelete: function(el) {
            let attachmentId = $(el.currentTarget).attr('data-doc-id');
            $(`.btn-close-${attachmentId}`).click()
            this._rpc({
                route: '/delete/document',
                params: {
                    attachment_id: attachmentId
                }
            })
            $(el.currentTarget).closest('.document-content').addClass('d-none')
        },

        _onclickFFSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progresBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progresBar.hasClass('d-none')) {
                $progresBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500)

            this._loadDocuments();

            // Add Addresses
            const self = this;
            this._rpc({
                route: '/get/fact-find/address-history',
                params: {
                    'fact_find_id': this.factFindId
                }
            }).then((addressData) => {
                let addressHistoryDetailsContent = '';
                $.each(addressData, function(index, address) {
                    // Build full address string
                    let fullAddress = '';
                    const addressParts = [
                        address.flat_number,
                        address.house_number,
                        address.building_name,
                        address.street_address,
                        address.town,
                        address.county,
                        address.post_code
                    ].filter(part => part && part.trim() !== '');

                    fullAddress = addressParts.join(', ');

                    // Get the date moved out value
                    const dateMovedOut = address.date_moved_out || address.date_moved_out_this_address || address.date_moved_from_this_address || '';

                    // Determine if this is current address
                    const isCurrentAddress = address.current_address_name_checkbox === true ||
                                           address.current_address_name_checkbox === 1 ||
                                           address.current_address_name_checkbox === "true" ||
                                           address.current_address_name_checkbox === "1" ||
                                           address.is_current_address === true ||
                                           address.is_current_address === 1;

                    const currentAddressText = isCurrentAddress ? 'Yes' : 'No';
                    const currentAddressClass = isCurrentAddress ? 'current' : '';

                    addressHistoryDetailsContent += `
                        <div class="address-card ${currentAddressClass}">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg residential-address-actions" data-type="edit" data-address-id="${address.address_id}"/>
                                <i class="fa fa-trash fa-lg residential-address-actions" data-type="delete" data-address-id="${address.address_id}"/>
                            </div>
                            <p>Date Moved In:
                                <span class="address-info">${address.date_moved_in || address.date_moved_to_address || ''}</span>
                            </p>
                            <p>Date Moved Out:
                                <span class="address-info">${dateMovedOut}</span>
                            </p>
                            <p>Residential Status:
                                <span class="address-info">${self._getResidentialStatusDisplay(address.residential_status)}</span>
                            </p>
                            <p>Address:
                                <span class="address-info">${fullAddress}</span>
                            </p>
                            <p>Current Address:
                                <span class="address-info">${currentAddressText}</span>
                            </p>
                        </div>
                    `;
                });
                $('.address-container').html(addressHistoryDetailsContent);
            });
        },

        _getResidentialStatusDisplay: function(technicalValue) {
            const statusMapping = {
                'renting_private': 'Renting Private',
                'living_with_family': 'Living with Family',
                'living_with_friends': 'Living with Friends',
                'owner_with_mortgage': 'Owner with Mortgage',
                'owner_without_mortgage': 'Owner without Mortgage',
                'renting_local_authority': 'Renting from Local Authority'
            };
            return statusMapping[technicalValue] || technicalValue;
        },

        _getRelationshipDisplay: function(technicalValue) {
            const relationshipLabels = {
                'spouse': 'Spouse',
                'son': 'Son',
                'daughter': 'Daughter',
                'child_relative': 'Child Relative',
                'elderly_relative': 'Elderly Relative',
            };
            return relationshipLabels[technicalValue] || technicalValue;
        },

//        _onSubmitFfForms: function(el) {
//            el.preventDefault();
//            let submitForm = $(el.currentTarget).closest('.ff-form');
//            let action = submitForm.attr('action') + `${this.factFindId}`
//            submitForm.attr('action', action)
//            submitForm.submit();
//        },

        _onSubmitFfForms: function (ev) {
            ev.preventDefault();

            const $form = $(ev.currentTarget).closest(".ff-form");
            let isValid = true;
            let firstInvalidField = null;

            //  Check required fields
            $form.find("[data-required='true']").each(function () {
                const $field = $(this);
                const value = $field.val().trim();

                let $feedback = $field.siblings(".invalid-feedback");
                if (!$feedback.length) {
                    $feedback = $('<div class="invalid-feedback"></div>');
                    $field.after($feedback);
                }

                if (!value) {
                    $field.addClass("is-invalid");
                    $feedback.text("* This field is required.").show();
                    isValid = false;

                    if (!firstInvalidField) {
                        firstInvalidField = $field;
                    }
                } else {
                    $field.removeClass("is-invalid");
                    // Only hide if no custom error is being shown
                    if (!$feedback.data("custom-error")) {
                        $feedback.hide();
                    }
                }
            });

            //  Extra check: if any .invalid-feedback is visible → block submit
            const $visibleErrors = $form.find(".invalid-feedback:visible");
            if ($visibleErrors.length > 0) {
                isValid = false;

                if (!firstInvalidField) {
                    // focus the field that triggered first visible error
                    firstInvalidField = $visibleErrors.first().prev("input, select, textarea");
                }
            }

            if (!isValid) {
                if (firstInvalidField && firstInvalidField.length) {
                    firstInvalidField.focus();
                    firstInvalidField[0].scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            // proceed with submit
            const action = $form.attr("action") + `${this.factFindId}`;
            $form.attr("action", action);
            $form.submit();

            // Navigate to next step after successful submission
            this._navigateToNextStep();
        },

        _navigateToNextStep: function() {
            // Get the menu structure from _onclickMainStep
            const menuItems = {
                "overview": [
                    ["welcome", "Welcome"]
                ],
                "about": [
                    ["personal", "Personal"],
                    ["address", "Address"],
                    ["dependants", "Dependants"]
                ],
                "finances": [
                    ["current", "Employment"],
                    ["self", "Self Employment"],
                    ["income", "Other Income"],
                    ["credit_f", "Advers Credit"],
                    ["banking", "Banking"]
                ],
                "outgoings": [
                    ["expenditure", "Expenditure"],
                    ["credit_out", "Credit Commitments"]
                ],
                "properties_mortgages": [
                    ["properties", "Properties"],
                    ["mortgages", "Mortgages"]
                ],
                "new_mortgage": [
                    ["insurance", "Property Details"],
                    ["deposit", "Deposit"],
                    ["estate_agent", "Estate Agent"],
                    ["solicitor", "Solicitor"]
                ],
                "advocate": [],
                "safeguards": [
                    ["cover", "Existing Cover"],
                    ["health", "Protection"],
                    ["protection", "Health"],
                    ["travels", "Travels"],
                    ["future", "Future"],
                    ["critical", "Critical"]
                ],
                "documents": [
                    ["further", "Documents"]
                ]
            };

            // Get current active main and sub step
            const currentMainStep = $(".li_main_step.active").attr("data-id");
            const currentSubStep = $(".li_sub_step.active").attr("data-id");

            if (!currentMainStep || !currentSubStep) return;

            const currentMainSteps = Object.keys(menuItems);
            const currentSubSteps = menuItems[currentMainStep] || [];

            // Find current substep index
            let currentSubIndex = currentSubSteps.findIndex(sub => sub[0] === currentSubStep);

            // Check if there's a next substep in current main step
            if (currentSubIndex < currentSubSteps.length - 1) {
                // Navigate to next substep
                const nextSubStep = currentSubSteps[currentSubIndex + 1][0];
                const $nextSubStepEl = $(`.li_sub_step[data-id='${nextSubStep}']`);
                if ($nextSubStepEl.length) {
                    $nextSubStepEl.click();
                }
            } else {
                // No more substeps, navigate to next main step
                let currentMainIndex = currentMainSteps.indexOf(currentMainStep);
                if (currentMainIndex < currentMainSteps.length - 1) {
                    const nextMainStep = currentMainSteps[currentMainIndex + 1];
                    const $nextMainStepEl = $(`.li_main_step[data-id='${nextMainStep}']`);
                    if ($nextMainStepEl.length) {
                        $nextMainStepEl.click();
                    }
                }
            }
        },

        _onclickSubStep: function(el) {
            $(el.currentTarget).addClass('active').siblings().removeClass('active');
            const activeSubMenu = $(el.currentTarget).attr('data-id');
            // Map of menu items to element identifiers
            const menuMap = {
                'personal': '#ff_ay_personal_details',
                'address': '#ff_ay_address_history',
                'dependants': '#ff_ay_dependants',
                //                'employment': '#ff_yf_general_employment',
                'current': '#ff_yf_current_employment',
                'self': '#ff_yf_employment_history',
                'income': '#ff_yf_other_monthly_income',
                'credit_f': '#ff_yf_credit_history',
                'deposit': '#ff_yf_saving_arrangements',
                //                'pensions': '#ff_yf_pensions',
                //                'investments': '#ff_yf_investments',
                'expenditure': '#ff_yo_expenditure',
                'credit_out': '#ff_yo_credit_commitments',
                'properties': '#ff_yep_your_properties',
                'mortgages': '#ff_yep_your_mortgages',
                //                'mortgage': '#ff_ynm_mortgage',
                'banking': '#ff_ynm_banking',
                'insurance': '#ff_ynm_building_n_contents_insurance',
                'estate_agent': '#ff_gv_estate_agent',
                'solicitor': '#ff_gv_solicitor',
                'health': '#ff_ypp_your_health_information',
                'cover': '#ff_ypp_existing_cover',
                'protection': '#ff_ypp_protection_policies',
                'travels': '#ff_ypp_protection_foreign_travels',
                'future': '#ff_ypp_protection_future_foreign_travels',
                'critical': '#ff_ypp_protection_critical_illness',
                'further': '#ff_further_documents'
            };

            if (activeSubMenu === 'address' ){
                // Ensure factFindId is available, get from localStorage if needed
                const factFindId = this.factFindId || localStorage.getItem("bvs_ff_id");

                if (factFindId) {
                    //hide address sync when its not there and show dropdown
                    this._rpc({
                        route: '/applicant/address',
                        params: {
                            fact_find_id: parseInt(factFindId),   // pass current fact_find_id
                        }
                    }).then((res) => {
                        if (!res || res.length === 0) {
                            $('.address-sync-fact').hide();  // hide if empty or private
                        }

                    });
                }
            }

            // Load and populate form data for specific submenus
            const formsToPopulate = ['personal', 'insurance', 'deposit', 'estate_agent', 'solicitor', 'expenditure','dependants'];
            if (formsToPopulate.includes(activeSubMenu)) {
                const factFindId = this.factFindId || localStorage.getItem("bvs_ff_id");

                if (factFindId) {
                    const self = this;
                    let $targetForm;

                    // Determine which form to populate based on activeSubMenu
                    if (activeSubMenu === 'personal') {
                        $targetForm = $("#ff_ay_personal_details .ff-personal-details-submit.ff-form");
                    } else if (activeSubMenu === 'insurance') {
                        $targetForm = $("#ff_ynm_building_n_contents_insurance .ff-expenditure-submit.ff-form");
                    } else if (activeSubMenu === 'deposit') {
                        $targetForm = $("#ff_yf_saving_arrangements .ff-personal-details-submit.ff-form");
                    } else if (activeSubMenu === 'estate_agent') {
                        $targetForm = $("#ff_gv_estate_agent .ff-estate-agent-submit.ff-form");
                    } else if (activeSubMenu === 'solicitor') {
                        $targetForm = $("#ff_gv_solicitor .ff-solicitor-submit.ff-form");
                    } else if (activeSubMenu === 'expenditure') {
                        $targetForm = $("#ff_yo_expenditure .ff-expenditure-submit.ff-form");
                    } else if (activeSubMenu === 'dependants') {
                        $targetForm = $("#ff_ay_dependants");
                    }

                    // Only proceed if we have a target form
                    if ($targetForm && $targetForm.length > 0) {
                        // Show loading indicator
                        self._showInsuranceLoader($targetForm);

                        this._rpc({
                            route: "/fact_find/get_details",
                            params: { fact_find_id: parseInt(factFindId) },
                        }).then(function(data) {
                            // Hide loading indicator
                            self._hideInsuranceLoader($targetForm);

                            if (data) {
                                // Populate based on active submenu
                                if (activeSubMenu === 'personal') {
                                    self._populatePersonalDetailsForm($targetForm, data);
                                } else if (activeSubMenu === 'insurance') {
                                    self._populateInsuranceForm($targetForm, data);
                                } else if (activeSubMenu === 'deposit') {
                                    self._populateDepositForm($targetForm, data);
                                } else if (activeSubMenu === 'estate_agent') {
                                    self._populateEstateAgentForm($targetForm, data);
                                } else if (activeSubMenu === 'solicitor') {
                                    self._populateSolicitorForm($targetForm, data);
                                } else if (activeSubMenu === 'expenditure') {
                                    self._populateExpenditureForm($targetForm, data);
                                } else if (activeSubMenu === 'dependants'){
                                    self._highlightButton($targetForm, data);
                                }
                            }
                        }).catch(function(error) {
                            // Hide loading indicator on error
                            self._hideInsuranceLoader($targetForm);
                            console.error('Failed to fetch fact find data:', error);
                        });
                    }
                }
            }

//            if (activeSubMenu === 'insurance') {
//                // Ensure factFindId is available, get from localStorage if needed
//                const factFindId = this.factFindId || localStorage.getItem("bvs_ff_id");
//
//                if (factFindId) {
//                    const $form = $(".ff-expenditure-submit.ff-form");
//                    const self = this;
//
//                    // Show loading indicator
//                    self._showInsuranceLoader($form);
//
//                    this._rpc({
//                        route: "/fact_find/get_details",
//                        params: { fact_find_id: parseInt(factFindId) },
//                    }).then(function(data) {
//                        // Hide loading indicator
//                        self._hideInsuranceLoader($form);
//
//                        if (data) {
//                            // Populate insurance form fields
//                            $form.find("select[name='property_usage']").val(data.property_usage || "");
//                            $form.find("input[name='house_flat_no']").val(data.house_flat_no || "");
//                            $form.find("input[name='post_code3']").val(data.post_code || "");
//                            $form.find("textarea[name='address3']").val(data.address || "");
//                            $form.find("input[name='building_name3']").val(data.building_name || "");
//                            $form.find("input[name='street_address3']").val(data.street_address || "");
//                            $form.find("input[name='county3']").val(data.county || "");
//                            $form.find("input[name='market_price']").val(data.market_price || "");
//                            $form.find("select[name='property_type']").val(data.property_type || "");
//                            $form.find("select[name='tenure']").val(data.tenure || "");
//                            $form.find("input[name='no_bedrooms']").val(data.no_bedrooms || "");
//                            $form.find("input[name='no_bathrooms']").val(data.no_bathrooms || "");
//                            $form.find("input[name='kitchen']").val(data.kitchen || "");
//                            $form.find("input[name='living_rooms']").val(data.living_rooms || "");
//                            $form.find("input[name='garage_space']").val(data.garage_space || "");
//                            $form.find("select[name='parking']").val(data.parking || "");
//                            $form.find("input[name='no_stories_in_building']").val(data.no_stories_in_building || "");
//                            $form.find("select[name='estimated_built_year']").val(data.estimated_built_year || "");
//                            $form.find("input[name='warranty_providers_name']").val(data.warranty_providers_name || "");
//                            $form.find("select[name='epc_predicted_epc_rate']").val(data.epc_predicted_epc_rate || "");
//                            $form.find("select[name='pea_rate']").val(data.pea_rate || "");
//                            $form.find("input[name='annual_service_charge']").val(data.annual_service_charge || "");
//                            $form.find("select[name='wall_construction_type']").val(data.wall_construction_type || "");
//                            $form.find("select[name='roof_construction_type']").val(data.roof_construction_type || "");
//                            $form.find("input[name='remaining_lease_term_in_years']").val(data.remaining_lease_term_in_years || "");
//                            $form.find("input[name='flat_in_floor']").val(data.flats_in_floor || "");
//                            $form.find("input[name='flats_same_floor_count']").val(data.flats_same_floor_count || "");
//                            $form.find("select[name='above_commercial_property']").val(data.above_commercial_property || "");
//                            $form.find("input[name='ground_rent']").val(data.ground_rent || "");
//                            $form.find("select[name='ownership_percentage_existing']").val(data.ownership_percentage || "");
//                            $form.find("input[name='estimated_monthly_rental_income']").val(data.estimated_monthly_rental_income || "");
//                            $form.find("input[name='current_monthly_rental_income']").val(data.current_monthly_rental_income || "");
//                            $form.find("input[name='occupants_count']").val(data.occupants_count || "");
//                            $form.find("input[name='company_name']").val(data.company_name || "");
//                            $form.find("select[name='company_director']").val(data.company_director || "");
//                            $form.find("select[name='additional_borrowing_reason']").val(data.additional_borrowing_reason || "");
//                            $form.find("input[name='additional_borrowing_amount']").val(data.additional_borrowing_amount || "");
//                            $form.find("input[name='monthly_commute_cost']").val(data.monthly_commute_cost || "");
//                            $form.find("select[name='help_to_buy_loan_type']").val(data.help_to_buy_loan_type || "");
//
//                            // Checkboxes
//                            if (data.is_new_build) {
//                                $form.find("input[name='is_new_build']").prop('checked', true);
//                            }
//                            if (data.ex_council) {
//                                $form.find("input[name='ex_council']").prop('checked', true);
//                            }
//                            if (data.shared_ownership) {
//                                $form.find("input[name='shared_ownership_existing']").prop('checked', true);
//                            }
//                            if (data.help_to_buy_loan) {
//                                $form.find("input[name='help_to_buy_loan']").prop('checked', true);
//                            }
//                            if (data.hmo) {
//                                $form.find("input[name='hmo']").prop('checked', true);
//                            }
//                            if (data.additional_borrowing) {
//                                $form.find("input[name='additional_borrowing']").prop('checked', true);
//                            }
//                            if (data.commute_over_one_hour) {
//                                $form.find("input[name='commute_over_one_hour']").prop('checked', true);
//                            }
//                        }
//                    }).catch(function(error) {
//                        // Hide loading indicator on error
//                        self._hideInsuranceLoader($form);
//                        console.error('Failed to fetch insurance data:', error);
//                    });
//                }
//            }

            // 🔹 Collect data for StepState
            const parentEl = $(".li_main_step.active").attr("data-id");  // current main
            const ffId = this.factFindId || null;

            StepState.setStep({
                main: parentEl,
                parentEl: parentEl,
                nextEl: activeSubMenu,
                ffId: ffId
            });

            // Function call based on the active menu
            if (menuMap[activeSubMenu]) {
                this._hideSiblings(menuMap[activeSubMenu], '#ff_progress_bar');
            }
        },

        _onclickMainStep: function(el, savedSubstep = null) {
            $(el.currentTarget).addClass('active').siblings().removeClass('active');
            const menuItems = {
                "overview": [
                    ["welcome", "Welcome"]
                ],
                "about": [
                    ["personal", "Personal"],
                    ["address", "Address"],
                    ["dependants", "Dependants"]
                ],
                "finances": [
                    //                    ["employment", "General"],
                    ["current", "Employment"],
                    ["self", "Self Employment"],
                    ["income", "Other Income"],
                    ["credit_f", "Advers Credit"],
                    ["banking", "Banking"],
                    //                    ["pensions", "Pensions"],
                    //                    ["investments", "Investments"]
                ],
                "outgoings": [
                    ["expenditure", "Expenditure"],
                    ["credit_out", "Credit Commitments"]
                ],
                "properties_mortgages": [
                    ["properties", "Properties"],
                    ["mortgages", "Mortgages"]
                ],
                "new_mortgage": [
                    ["insurance", "Property Details"],
                    ["deposit", "Deposit"],
                    ["estate_agent", "Estate Agent"],
                    ["solicitor", "Solicitor"]

                ],
                "advocate": [

                ],
                "safeguards": [
                    ["cover", "Existing Cover"],
                    ["health", "Protection"],
                    ["protection", "Health"],
                    ["travels", "Travels"],
                    ["future", "Future"],
                    ["critical", "Critical"]
                ],
                "documents": [
                    ["further", "Documents"]
                ],
            }
            const activeMainMenu = $(el.currentTarget).attr('data-id');
            let submenuItem = menuItems[activeMainMenu];
            let subStepHtmlContent = '';
            $.each(submenuItem, function(index, value) {
                let active = (savedSubstep && value[0] === savedSubstep) || (!savedSubstep && index === 0) ? 'active' : ''
                let listContent = `
                <li class='li_sub_step ${active} li_${value[0]}' data-id="${value[0]}">
                    <div>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span/>
                        <span>${value[1]}</span>
                    </div>
                </li>
                `;
                subStepHtmlContent += listContent
            });
            $('.sub-step-container').html(
                '<ul class="steps">' + subStepHtmlContent + '</ul>'
            )
            // Map of menu items to element identifiers
            const menuMap = {
                'overview': '#ff_gs_welcome',
                'about': '#ff_ay_personal_details',
                'finances': '#ff_yf_current_employment',
                'outgoings': '#ff_yo_expenditure',
                'properties_mortgages': '#ff_yep_your_properties',
                'new_mortgage': '#ff_ynm_building_n_contents_insurance',
                'advocate': '#ff_gv_estate_agent',
                'safeguards': '#ff_ypp_your_health_information',
                'documents': '#ff_further_documents'
            };


            //  Collect data for StepState
            const firstSub = submenuItem.length ? submenuItem[0][0] : null;
            const ffId = this.factFindId || null;

            StepState.setStep({
                main: activeMainMenu,
                parentEl: activeMainMenu,
                nextEl: firstSub,
                ffId: ffId
            });


            // Function call based on the active menu
            if (menuMap[activeMainMenu]) {
                this._hideSiblings(menuMap[activeMainMenu], '#ff_progress_bar');
            }

            // If we have a saved substep, trigger its click to restore the correct content
            if (savedSubstep) {
                const $savedSubstepEl = this.$(`.li_sub_step[data-id='${savedSubstep}']`);
                if ($savedSubstepEl.length) {
                    this._onclickSubStep({ currentTarget: $savedSubstepEl[0] });
                }
            }

        },



        start: function() {
            let def = this._super.apply(this, arguments);
            let queryParams, params = {};
            try {
                queryParams = new URLSearchParams(window.location.search);
                params = Object.fromEntries(queryParams.entries());
            } catch (e) {
                console.warn('Cannot access window.location (CORS):', e);
            }
            this.factFindId;

            // 🔹 Initialize hash-based routing system
            this._initializeHashRouting();

            // Fetch fact-finds data from server
            this._rpc({
                route: '/get/fact-finds',
                params: {}
            }).then((data) => {
                let htmlContent = '';
                $.each(data, function(index, item) {
                    // Debug log to see what data we're getting
                    console.log('Fact Find Item:', item);

                    // Get values with fallbacks
                    const partnerName = item.partner_name || item.name || 'Unknown Partner';
                    const leadRegistration = item.lead_registration_no || item.lead_name || 'No Lead';
                    const factFindName = item.fact_find_name || `Fact Find #${item.id}`;

                    htmlContent += `
                    <li class="sidebar-item fact-find-item-${item.id}">
                        <a href="#${item.id}" class="sidebar-link sidebar-sub-item-1 sub_item_${item.id} ff-sidebar-sub ff-sidebar-sub-dependant ff-sidebar-sub-credit ff-sidebar-sub-banking ff-sidebar-sub-cc ff-sidebar-sub-yp ff-sidebar-sub-ym ff-sidebar-sub-employment ff-sidebar-sub-insurance ff-sidebar-sub-health-conditions ff-sidebar-sub-future-travels ff-sidebar-sub-critical-illness ff-sidebar-sub-self-employment"
                           data-id="${item.id}"
                           data-partner-name="${partnerName}"
                           data-lead-registration="${leadRegistration}"
                           data-fact-find-name="${factFindName}"
                           title="${partnerName} - ${leadRegistration} - ${factFindName}">
                            <div class="fact-find-display">
                                <div class="partner-name">${partnerName}</div>
                                <div class="lead-info">${leadRegistration}</div>
                                <div class="fact-find-name">${factFindName}</div>
                            </div>
                        </a>
                    </li>
                    `;
                });
                $('.fact-find-expand').html(htmlContent);

               this._rpc({
                    route: '/bvs/is_admin',
                    params: {},
                }).then((isAdmin) => {
                    if (!isAdmin) {
                        const checkOverlay = setInterval(() => {
                            const overlay = document.querySelector('.pcasetup');
                            if (overlay) {
                                overlay.style.display = "none";
                                clearInterval(checkOverlay);

                                 // 🔔 Tell backend about the issue
                                this._rpc({
                                    route: '/bvs/notify_admin',
                                    params: {
                                        message: "There is a problem in Royal Mail. Please take an action."
                                    },
                                });
                            }
                        }, 300); // check every 300ms until found
                    }
                });


                // 🔹 Handle initial page load routing
                let currentHash = '';
                try {
                    currentHash = window.location.hash.replace('#', '');
                } catch (e) {
                    console.warn('Cannot access window.location.hash (CORS):', e);
                }


                if (currentHash && $(`#${currentHash}`).length > 0) {
                    // Navigate to hash section if it exists
                    this._handleHashChange();
                } else if (!$.isEmptyObject(params)) {
                    // Legacy URL parameter support
                    this.factFindId = parseInt(params.ffId);
                    $(`.sub_item_${this.factFindId}`).click();
                    $('.li_' + params.parentEl).click();
                    $('.li_' + params.nextEl).click();
                } else {
                    // Default to home
                    this._hideSiblings('#home');
                    this._updateSidebarActiveState('#home');
                }

                // Check if the page was synced
                if (localStorage.getItem('synced')) {
                    const syncedPage = localStorage.getItem('synced');
                    const ffId = localStorage.getItem('synced_ff_id');
                    this.factFindId = parseInt(ffId);
                    if (syncedPage === 'address') {
                        $(`.sub_item_${this.factFindId}`).click();
                        $('.li_about').click();
                        $('.li_address').click();
                    }
                    // Remove the flag
                    localStorage.removeItem('synced');
                    localStorage.removeItem('ff_id');
                }

                // Add read-only logic based on lead stage

            });

            const { main, nextEl } = StepState.getStep();  // 👈 get both main and substep

            if (main) {
                const $main = this.$(`.li_main_step[data-id='${main}']`);
                if ($main.length) {
                    // Simulate main menu click → rebuild submenu + highlight it
                    this._onclickMainStep({ currentTarget: $main[0] }, nextEl);
                }
            }

            var $container = $('.dependants-history-details .dependants-container');

            if ($container.children().length > 0 || $.trim($container.text()).length > 0) {
                $('.dependants-history-details').removeClass('d-none');
                // Highlight "have dependants" button if dependants exist
                $('.have-dependants').addClass('btn-selected');
                $('.no-dependants').removeClass('btn-selected');
                console.log('Dependants found - highlighting "have dependants" button');
            } else {
                // Highlight "no dependants" button if no dependants exist
                $('.no-dependants').addClass('btn-selected');
                $('.have-dependants').removeClass('btn-selected');
                console.log('No dependants found - highlighting "no dependants" button');
            }

            this._applyCssStyle();
            this._initAddressNowInput();

            // Conditional initialization for address history - Current Address Checkbox
            const currentAddressCheckbox = this.$('#current_address_name_checkbox')[0];
            if (currentAddressCheckbox && currentAddressCheckbox.checked) {
                this._onChangeCurrentAddressName({
                    target: currentAddressCheckbox
                });
            }

            const residentialStatusSelect = this.$('#residential_status_ah')[0];
            if (residentialStatusSelect && residentialStatusSelect.value &&
                (residentialStatusSelect.value === 'renting_private' || residentialStatusSelect.value === 'renting_local_authority')) {
                this._onchangeResidentialStatus({
                    target: residentialStatusSelect
                });
            }

            // Handle cancel button in no-dependants popup
            this.$('#no-dependants-popup .btn-cancel').on('click', function(ev) {
                ev.preventDefault();
                $('#no-dependants-popup').addClass('d-none');
                console.log('No dependants popup cancelled - popup closed');
            });

            return def;
        },

        _applyCssStyle: function () {
            // Apply responsive CSS classes instead of inline styles for better mobile compatibility
            $("input[type='date']").each(function () {
                $(this).parent("div").addClass('form-field-container');
            });
            $("select").each(function () {
                $(this).parent("div").addClass('form-field-container');
            });
        },

        _initAddressNowInput: function() {
            const inputs = [
                document.querySelector('input#address-search'),
                document.querySelector('input#work-address-search'),
                document.querySelector('input#business-address-search'),
                document.querySelector('input#property-address-search'),
                document.querySelector('input#mortgage-address-search'),
                document.querySelector('input#insurance-address-search'),
                document.querySelector('input#solicitor-address-search'),
                document.querySelector('input#landlord-address-search'),
                document.querySelector('input#authority-address-search')
            ].filter(Boolean); // Remove null values

            if (inputs.length === 0) {
                return console.warn("No AddressNow inputs found!");
            }

            // Poll until AddressNow library is loaded (max 10 seconds)
            let attempts = 0;
            const maxAttempts = 100; // 100 * 100ms = 10 seconds
            const interval = setInterval(() => {
                attempts++;
                if (window.pca) {
                    clearInterval(interval);
                    inputs.forEach(input => this._bindAddressNow(input));
                    console.log(`✅ AddressNow initialized successfully for ${inputs.length} input(s)`);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.warn("⚠️ AddressNow library failed to load after 10 seconds");
                }
            }, 100);
        },

        _bindAddressNow: function(input) {
            if (!input.name) {
                console.warn("AddressNow input must have a 'name' attribute!", input);
                return;
            }
            if (input.dataset.addressnowInstance) return;
            input.dataset.addressnowInstance = true;

            const inputId = input.id;

            const initOnType = () => {
                if (input.dataset.addressnowControl) return;

                const control = new pca.Address([
                    { element: inputId, field: "", mode: pca.fieldMode.SEARCH }
                ], {
                    key: "dc41-rg84-pn42-rp92",
//                    key: "yg97-yz29-ky74-wf98",
                    countries: {
                        codesList: "GBR"  // Restrict to UK only to avoid CORS issues
                    },
                    setCountryByIP: false,
                    suppressAutocomplete: false,
                    bar: {
                        visible: true,
                        showCountry: false  // Hide country selector in dropdown
                    }
                });

                control.listen("populate", function(address) {
                    const mapField = (fieldId, value) => {
                        const el = document.getElementById(fieldId);
                        if (el) el.value = value || "";
                    };

                    // Map fields based on which search input is being used
                    if (inputId === "address-search") {
                        // Map AddressNow fields to home address form fields
                        mapField("flat-number",    address.SubBuilding);
                        mapField("house-number",   address.BuildingNumber);
                        mapField("building-name",  address.BuildingName);
                        mapField("street-address", address.Street);
                        mapField("town",           address.City);
                        mapField("postcode",       address.PostalCode);
                        mapField("county_ah",      address.Province);

                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');
                        $('[id=address-search]').val(fullAddress);

                        // Set country to UK by default
                        const countrySelect = document.getElementById("country_ah");
                        if (countrySelect) {
                            Array.from(countrySelect.options).forEach(option => {
                                if (option.text.includes('United Kingdom')) {
                                    countrySelect.value = option.value;
                                }
                            });
                        }
                    } else if (inputId === "work-address-search") {
                        // Map AddressNow fields to work address
                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("work-address-search", fullAddress);
                        mapField("address_of_working_place", fullAddress);
                    } else if (inputId === "business-address-search") {
                        // Map AddressNow fields to business address
                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("business-address-search", fullAddress);
                        mapField("business_address", fullAddress);
                    } else if (inputId === "property-address-search") {
                        // Map AddressNow fields to property address
                        mapField("house_number_yep", address.BuildingNumber);
                        mapField("post_code_yep", address.PostalCode);
                        mapField("street_address_yep", address.Street);
                        mapField("county_yep", address.Province);

                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("property-address-search", fullAddress);
                        mapField("property_address_full", fullAddress);
                    } else if (inputId === "mortgage-address-search") {
                        // Map AddressNow fields to mortgage address
                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("mortgage-address-search", fullAddress);
                        mapField("your-properties-address", fullAddress);
                    } else if (inputId === "insurance-address-search") {
                        // Map AddressNow fields to insurance address
                        mapField("house_flat_no", address.BuildingNumber);
                        mapField("post_code3", address.PostalCode);
                        mapField("building_name3", address.BuildingName);
                        mapField("street_address3", address.Street);
                        mapField("county3", address.Province);

                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("insurance-address-search", fullAddress);
                        mapField("address3", fullAddress);
                    } else if (inputId === "solicitor-address-search") {
                        // Map AddressNow fields to solicitor address
                        mapField("solicitor_house_number", address.BuildingNumber);
                        mapField("solicitor_post_code", address.PostalCode);

                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("solicitor-address-search", fullAddress);
                        mapField("solicitor_address", fullAddress);
                    } else if (inputId === "landlord-address-search") {
                        // Map AddressNow fields to landlord address
                        mapField("current_landlord_postcode", address.PostalCode);

                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("landlord-address-search", fullAddress);
                        mapField("current_landlord_address", fullAddress);
                    } else if (inputId === "authority-address-search") {
                        // Map AddressNow fields to local authority address
                        mapField("local_authority_postcode", address.PostalCode);

                        const parts = [
                            address.SubBuilding,
                            address.BuildingNumber,
                            address.BuildingName,
                            address.Street,
                            address.City,
                            address.Province,
                            address.PostalCode,
                        ].filter(Boolean);

                        const fullAddress = parts.join(', ');

                        // Set the full address to both fields
                        mapField("authority-address-search", fullAddress);
                        mapField("local_authority_address", fullAddress);
                    }
                });

                input.dataset.addressnowControl = true;
            };

            input.addEventListener("input", initOnType, { once: true });
        },



        //--------------------------------------------------------------------------
        // Fact Find
        //--------------------------------------------------------------------------

        // address history
        _showAddressHistoryStatus: function() {
            var self = this;

            this._validateAddressHistory()
                .then(function(result) {
                    // Show success indicator
                    var statusHtml = '<div class="alert alert-success mt-2">' +
                        '<i class="fa fa-check-circle"></i>' +
                        '<strong>Address History Complete!</strong><br>' +
                        'You have ' + result.totalCoverage + ' months of address history across ' + result.addressCount + ' addresses.' +
                        '</div>';
                    $('.address-validation-status').html(statusHtml);
                })
                .catch(function(error) {
                    // Show warning indicator
                    var statusHtml = '';
                    if (error.type === 'insufficient_coverage') {
                        statusHtml = '<div class="alert alert-warning mt-2">' +
                            '<i class="fa fa-exclamation-triangle"></i>' +
                            '<strong>Address History Incomplete</strong><br>' +
                            error.current + '/' + error.required + ' months completed' +
                            '<div class="progress mt-2">' +
                            '<div class="progress-bar bg-warning" role="progressbar" style="width: ' + ((error.current / error.required) * 100) + '%">' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    } else {
                        statusHtml = '<div class="alert alert-danger mt-2">' +
                            '<i class="fa fa-times-circle"></i>' +
                            '<strong>Address History Issues</strong><br>' +
                            error.message +
                            '</div>';
                    }
                    $('.address-validation-status').html(statusHtml);
                });
        },

        _onclickAHAddAddress(ev) {
            const $addressHistoryForm = $('.address-history-form');
            const $addressShare = $('.address_share_sync');
            // Target the form and reset all input fields
            $addressHistoryForm.find('input, select, textarea').each(function() {
                $(this).val('');
            });
            // Alternatively, you can reset the form itself, which clears all values and resets to default (if any)
            $addressHistoryForm[0].reset();
            $addressHistoryForm.find('#address_id').val('new-address');

            // Check if there's already a current address saved
            const hasCurrentAddress = $('.address-card.current').length > 0;

            if (hasCurrentAddress) {
                // Hide the checkbox if a current address already exists
                $('.current-address-checkbox-container').addClass('d-none').hide();
                console.log('Current address checkbox hidden - a current address already exists');
            } else {
                // Show the checkbox container for new addresses if no current address exists
                $('.current-address-checkbox-container').removeClass('d-none').show();
                console.log('Current address checkbox shown - no current address exists');
            }

            $addressHistoryForm.removeClass('d-none').fadeIn(400)
            $('.address-history-details').addClass('d-none').fadeOut(400);
            $addressShare.addClass('d-none').fadeOut(400);
        },

        _onclickAHSaveCancelAddressDetails: function(el) {
            el.preventDefault();
            el.stopPropagation();

            // Prevent double-clicks by disabling the button temporarily
            const $button = $(el.currentTarget);
            if ($button.prop('disabled')) {
                return; // Exit if button is already disabled (request in progress)
            }
            $button.prop('disabled', true);

            const $addressHistoryForm = $('.address-history-form');
            const addressId = $addressHistoryForm.find('#address_id').val();
            const isNewAddress = addressId === 'new-address';

            // Get the action type from the button
            let actionType = $(el.currentTarget).hasClass('btn-address-cancel') ? 'cancel' : 'save';

            if (actionType === 'cancel') {
                // Handle cancel action - do NOT save anything
                console.log('Cancel clicked - no data will be saved');

                // Reset the form to clear any entered data
                $addressHistoryForm[0].reset();

                // Hide the form
                $addressHistoryForm.addClass('d-none').fadeOut(400);

                // Show the details section
                const $addressHistoryDetails = $('.address-history-details');
                const $addressShare = $('.address_share_sync');
                $addressHistoryDetails.removeClass('d-none').fadeIn(400);
                $addressShare.removeClass('d-none').fadeIn(400);

                // If it's a new address, remove the card completely
                if (isNewAddress) {
                    const $addressCard = $(`.address-card:has(i[data-address-id="${addressId}"])`);
                    if ($addressCard.length) {
                        $addressCard.fadeOut(400, function() {
                            $(this).remove();
                        });
                    }
                }

                // Re-enable the button
                $button.prop('disabled', false);
                return;

            } else if (actionType === 'save') {
                // Handle save action
                $addressHistoryForm.addClass('d-none').fadeOut(400);
                const $addressHistoryDetails = $('.address-history-details');
                const $addressShare = $('.address_share_sync');
                $addressHistoryDetails.removeClass('d-none').fadeIn(400);
                $addressShare.removeClass('d-none').fadeIn(400);

                // Extract field values from the form
                const residentialStatus = $addressHistoryForm.find('select[name="residential_status_ah"]').val();
                const flatNumber = $addressHistoryForm.find('input[name="flat-number"]').val();
                const houseNumber = $addressHistoryForm.find('input[name="house-number"]').val();
                const buildingName = $addressHistoryForm.find('input[name="building-name"]').val();
                const streetAddress = $addressHistoryForm.find('input[name="street-address"]').val();
                const postcode = $addressHistoryForm.find('input[name="postcode"]').val();
                const country = $addressHistoryForm.find('select[id="country_ah"]').val();
                const town = $addressHistoryForm.find('input[name="town"]').val();
                const county = $addressHistoryForm.find('input[id="county_ah"]').val();
                const dateMovedIn = $addressHistoryForm.find('input[name="date-moved-to-this-address"]').val();
                const dateMovedOut = $addressHistoryForm.find('input[name="date-moved-out-this-address"]').val();
                const isCurrentAddress = $addressHistoryForm.find('input[name="current_address_name_checkbox"]').is(':checked');
                const currentLandlordName = $addressHistoryForm.find('input[name="current_landlord_name"]').val();
                const currentLandlordAddress = $addressHistoryForm.find('textarea[name="current_landlord_address"]').val();
                const currentLandlordPostcode = $addressHistoryForm.find('input[name="current_landlord_postcode"]').val();
                const currentLandlordContactNo = $addressHistoryForm.find('input[name="current_landlord_contact_no"]').val();
                const localAuthorityName = $addressHistoryForm.find('input[name="local_authority_name"]').val();
                const localAuthorityPostcode = $addressHistoryForm.find('input[name="local_authority_postcode"]').val();
                const localAuthorityAddress = $addressHistoryForm.find('textarea[name="local_authority_address"]').val();

                // Build full address string (same logic as in _onclickFFSubItem)
                const addressParts = [
                    flatNumber,
                    houseNumber,
                    buildingName,
                    streetAddress,
                    town,
                    county,
                    postcode
                ].filter(part => part && part.trim() !== '');

                const fullAddress = addressParts.join(', ');

                const currentAddressText = isCurrentAddress ? 'Yes' : 'No';
                const currentAddressClass = isCurrentAddress ? 'current' : '';
                const self = this;

                this._rpc({
                    route: '/update/fact-find/address',
                    params: {
                        fact_find_id: this.factFindId,
                        data: {
                            address_id: addressId,
                            residential_status: residentialStatus,
                            flat_number: flatNumber,
                            house_number: houseNumber,
                            building_name: buildingName,
                            street_address: streetAddress,
                            post_code: postcode,
                            town: town,
                            county: county,
                            date_moved_in: dateMovedIn,
                            date_moved_out: dateMovedOut,
                            current_address_name_checkbox: isCurrentAddress,
                            country: country,
                            current_landlord_name: currentLandlordName,
                            current_landlord_address: currentLandlordAddress,
                            current_landlord_postcode: currentLandlordPostcode,
                            current_landlord_contact_no: currentLandlordContactNo,
                            local_authority_name: localAuthorityName,
                            local_authority_postcode: localAuthorityPostcode,
                            local_authority_address: localAuthorityAddress,
                        }
                    }
                }).then((data) => {
                    if (data.success) {
                        if (isNewAddress) {
                            $addressHistoryForm.find('#address_id').val(data.address_id);
                            $('.address-history-details > div.button-group').before(`
                                <div class="address-card ${currentAddressClass}">
                                    <div class="edit-delete">
                                        <i class="fa fa-pencil fa-lg residential-address-actions" data-type="edit" data-address-id="${data.address_id}"/>
                                        <i class="fa fa-trash fa-lg residential-address-actions" data-type="delete" data-address-id="${data.address_id}"/>
                                    </div>
                                    <p>Date Moved In:
                                        <span class="address-info">${dateMovedIn}</span>
                                    </p>
                                    <p>Date Moved Out:
                                        <span class="address-info">${dateMovedOut}</span>
                                    </p>
                                    <p>Residential Status:
                                        <span class="address-info">${self._getResidentialStatusDisplay(residentialStatus)}</span>
                                    </p>
                                    <p>Address:
                                        <span class="address-info">${fullAddress}</span>
                                    </p>
                                    <p>Current Address:
                                        <span class="address-info">${currentAddressText}</span>
                                    </p>
                                </div>
                            `);
                        } else {
                            // Update existing card with consistent structure
                            const $existingCard = $(`.address-card:has(i[data-address-id="${addressId}"])`);
                            if ($existingCard.length) {
                                // Update the class for current address
                                $existingCard.removeClass('current');
                                if (isCurrentAddress) {
                                    $existingCard.addClass('current');
                                }

                                // Update all the address info spans in the correct order
                                $existingCard.find('.address-info').eq(0).text(dateMovedIn);
                                $existingCard.find('.address-info').eq(1).text(dateMovedOut);
                                $existingCard.find('.address-info').eq(2).text(self._getResidentialStatusDisplay(residentialStatus));
                                $existingCard.find('.address-info').eq(3).text(fullAddress);
                                $existingCard.find('.address-info').eq(4).text(currentAddressText);
                            }
                        }

                        // Re-enable the button after successful save
                        $button.prop('disabled', false);
                    } else {
                        console.error('Error saving address:', data.error);
                        alert('Failed to save address: ' + data.error);

                        // Re-enable the button after error
                        $button.prop('disabled', false);
                    }
                }).catch((error) => {
                    console.error('RPC Error:', error);
                    alert('Network error occurred while saving address.');

                    // Re-enable the button after network error
                    $button.prop('disabled', false);
                });
            }
        },

        // Dependants
        _onclickNoDependants(ev) {
            // Show the confirmation popup instead of immediately hiding the section
            $('#no-dependants-popup').removeClass('d-none');
            console.log('No dependants clicked - showing confirmation popup');
        },

        _onclickHaveDependants(ev) {
            $('.dependants-history-details').removeClass('d-none');

            // Remove highlight from "no dependants" button and add to "have dependants"
            $('.no-dependants').removeClass('btn-selected');
            $('.have-dependants').addClass('btn-selected');

            console.log('Have dependants selected - button highlighted');
        },

        // Credit Commitment
        _onclickNoCreditCommit(ev) {
            $('.credit-commitment-form').addClass('d-none');
            $('.credit-commitment').addClass('d-none');
            $('.add-credit-commitment-details').addClass('d-none');
            $('.q-credit-comment').addClass('d-none');
        },

        _onclickHaveCreditCommit(ev) {
            $('.credit-commitment').removeClass('d-none');
            $('.add-credit-commitment-details').removeClass('d-none');
            $('.q-credit-comment').addClass('d-none');

            // Load existing credit commitments to display saved cards
            this._reloadCreditCommitments();
        },

        // --------------------------------------------------------------------------

        _onclickHomeContinue(ev) {
            // Use hash-based routing to navigate to fact find welcome section
            const welcomeSection = document.querySelector('#ff_gs_welcome');
            try {
                if (welcomeSection) {
                    window.location.hash = 'ff_gs_welcome';
                } else {
                    // Fallback to trigger click on sidebar element
                    $('.sidebar-ff-gs-welcome').trigger('click');
                }
            } catch (e) {
                console.warn('Cannot access window.location (CORS):', e);
                // Fallback to trigger click on sidebar element
                $('.sidebar-ff-gs-welcome').trigger('click');
            }
        },

        _onclickToggler(ev) {
            $("#sidebar").toggleClass("collapsed");
        },

        _hideSiblings(elementIdentifier, customVisibleElements) {
            const $element = $(elementIdentifier);

            // Check if element exists
            if (!$element.length) {
                console.warn("⚠️ _hideSiblings: Element not found:", elementIdentifier);
                console.warn("⚠️ Available sections:", $('.main > .content').map(function() { return this.id; }).get());
                return;
            }

            const $siblings = $element.siblings();

            $element.removeClass('d-none');

            // Determine which siblings to hide
            const $toHide = customVisibleElements ? $siblings.not(customVisibleElements) : $siblings;

            $toHide.addClass('d-none');

            console.log("✅ Navigated to:", elementIdentifier);
        },

//        _hideSiblings(elementIdentifier, customVisibleElements) {
//            const $element = $(elementIdentifier);
//            const $siblings = $element.siblings();
//
//            if (!$element.length) {
//                console.warn("⚠️ No element found for:", elementIdentifier);
//                return;
//            }
//
//            // Show the current element
//            $element.removeClass('d-none');
//
//            // Hide siblings
//            const $toHide = customVisibleElements ? $siblings.not(customVisibleElements) : $siblings;
//            $toHide.addClass('d-none');
//
//            // 🔹 Save route/state to localStorage
//            localStorage.setItem("bvs_active_section", elementIdentifier);
//
//            // 🔹 Update URL (without reload)
//            const url = new URL(window.location);
//            url.searchParams.set("section", elementIdentifier.replace("#", "")); // e.g. "#portfolio" → "portfolio"
//            window.history.replaceState({}, "", url);
//        },



        _onclickSidebarItem(ev) {

            const elementIdentifier = $(ev.currentTarget).data('element');
            if (elementIdentifier !== undefined) {
                this._hideSiblings(elementIdentifier);

                // 🔹 Collect state
                const activeMainMenu = elementIdentifier.replace('#', '');
                const $subMenu = $(`${elementIdentifier} .li_sub_step`).first();
                const firstSub = $subMenu.length ? $subMenu.data('id') : null;
                const ffId = this.factFindId || null;

                StepState.setStep({
                    main: activeMainMenu,
                    parentEl: activeMainMenu,
                    nextEl: firstSub,
                    ffId: ffId,
                });

                // 🔹 Update browser URL with hash for proper routing
                try {
                    window.location.hash = activeMainMenu;
                } catch (e) {
                    console.warn('Cannot access window.location (CORS):', e);
                }

                // 🔹 Update active sidebar state
                this._updateSidebarActiveState(elementIdentifier);
            }
        },

        // 🔹 Update active state in sidebar
        _updateSidebarActiveState(elementIdentifier) {
            // Remove active class from all sidebar items
            $('.sidebar-item').removeClass('active');

            // Add active class to current item
            const targetSection = elementIdentifier.replace('#', '');
            $(`.sidebar-item[data-element="#${targetSection}"]`).addClass('active');

            // Also handle mobile navigation
            $('.mobile-nav-item').removeClass('active');
            $(`.mobile-nav-item .mobile-nav-link[data-element="#${targetSection}"]`).parent().addClass('active');
        },

        // 🔹 Initialize hash-based routing
        _initializeHashRouting() {
            // Listen for hash changes
            $(window).on('hashchange', () => {
                this._handleHashChange();
            });

            // Handle initial hash on page load
            this._handleHashChange();
        },

        // 🔹 Handle hash changes for navigation
        _handleHashChange() {
            let hash = '';
            try {
                hash = window.location.hash.replace('#', '');
            } catch (e) {
                console.warn('Cannot access window.location.hash (CORS):', e);
                return;
            }

            if (hash) {
                // Ignore hash if it contains URL parameters (not a valid section ID)
                if (hash.includes('=') || hash.includes('&') || hash.includes('?')) {
                    console.log('Ignoring hash with URL parameters:', hash);
                    return;
                }

                const elementIdentifier = `#${hash}`;

                // Check if the section exists (with try-catch for invalid selectors)
                let sectionExists = false;
                try {
                    sectionExists = $(elementIdentifier).length > 0;
                } catch (e) {
                    console.warn('Invalid selector for hash:', hash, e);
                    return;
                }

                if (sectionExists) {
                    this._hideSiblings(elementIdentifier);
                    this._updateSidebarActiveState(elementIdentifier);

                    // Update step state
                    const $subMenu = $(`${elementIdentifier} .li_sub_step`).first();
                    const firstSub = $subMenu.length ? $subMenu.data('id') : null;
                    const ffId = this.factFindId || null;

                    StepState.setStep({
                        main: hash,
                        parentEl: hash,
                        nextEl: firstSub,
                        ffId: ffId,
                    });
                }
            } else {
                // Default to home if no hash
                this._hideSiblings('#home');
                this._updateSidebarActiveState('#home');
            }
        },

        //Dependants Multiple-------------------------------------------------

        _onclickFFSubItemDependant: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progresBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progresBar.hasClass('d-none')) {
                $progresBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none'); // Ensure loader is shown
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500)

            this._loadDocuments();
            // Add Dependants
            const self = this;
            this._rpc({
                route: '/get/fact-find/financial-dependants',
                params: {
                    'fact_find_id': this.factFindId
                }
            }).then((dependantsData) => {
                let dependantsHistoryDetailsContent = '';
                $.each(dependantsData, function(index, dependant) {
                    dependantsHistoryDetailsContent += `
                        <div class="dependant-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg financial-dependants-actions"
                                   data-type="edit" data-dependant-id="${dependant.financial_dependants_id}"></i>
                                <i class="fa fa-trash fa-lg financial-dependants-actions"
                                   data-type="delete" data-dependant-id="${dependant.financial_dependants_id}"></i>
                            </div>
                            <div class="dependant-details">
                                <div class="detail-row">
                                    <span class="label">👤 Name:</span>
                                    <span class="value">${dependant.full_name}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">🤝 Relationship:</span>
                                    <span class="value">${self._getRelationshipDisplay(dependant.relationship)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">🎂 Date of Birth:</span>
                                    <span class="value">${dependant.dob}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                $('.dependants-container').html(dependantsHistoryDetailsContent);
            })

        },

        _onclickDependantAdd: function(ev) {
            const $dependantsForm = $('.dependants-form');
            const $dependantsDetails = $('.dependant-details');
            const $questionDependantsDetails = $('.q-dependants');
            // Target the form and reset all input fields
            $dependantsForm.find('input, select, textarea').each(function() {
                $(this).val('');
            });
            // Alternatively, you can reset the form itself, which clears all values and resets to default (if any)
            $dependantsForm[0].reset();
            $dependantsForm.find('#financial_dependants_id').val('new-dependant');

            $dependantsForm.removeClass('d-none').fadeIn(400)
            $dependantsDetails.removeClass('d-none').fadeIn(400)
            $('.dependants-history-details').addClass('d-none').fadeOut(400);
            $questionDependantsDetails.addClass('d-none').fadeOut(400);
        },

        _onclickDependantCancel: function(ev){
            const $dependantsForm = $('.dependants-form');
            const $dependantsDetails = $('.dependant-details');
            const $questionDependantsDetails = $('.q-dependants');
            // Target the form and reset all input fields
            $dependantsForm.find('input, select, textarea').each(function() {
                $(this).val('');
            });
            $dependantsForm[0].reset();


            $dependantsForm.addClass('d-none').fadeOut(400)
//            $dependantsDetails.addClass('d-none').fadeIn(400)
            $('.dependants-history-details').removeClass('d-none').fadeIn(400);
            $questionDependantsDetails.addClass('d-none').fadeOut(400);
        },

        _onclickDependantSaveCancel: function(el) {
            const self = this; // ✅ Add this line to preserve context
            const $dependantsForm = $('.dependants-form');
            const dependantId = $dependantsForm.find('#financial_dependants_id').val();
            const isNewDependant = dependantId === 'new-dependant';

            $dependantsForm.addClass('d-none').fadeOut(400);
            const $dependantsHistoryDetails = $('.dependants-history-details');
            $dependantsHistoryDetails.removeClass('d-none').fadeIn(400);

            // Extract form values - Fixed: Added missing fields
            const hasDependents = $dependantsForm.find('input[name="has_dependents"]').is(':checked');
            const numberOfDependents = $dependantsForm.find('input[name="number_of_dependents"]').val();
            const fullName = $dependantsForm.find('input[name="dependant-name"]').val();
            const relationship = $dependantsForm.find('select[name="dependant-relation"]').val();
            const dateOfBirth = $dependantsForm.find('input[name="dependant-date-of-birth"]').val();
            const dependencyType = $dependantsForm.find('select[name="dependency_type"]').val();
            const dependencyPeriod = $dependantsForm.find('select[name="dependency_period"]').val(); // Fixed: Added
            const monthlyChildcareCost = $dependantsForm.find('input[name="monthly_childcare_cost"]').val();
            const childcareCostReason = $dependantsForm.find('textarea[name="childcare_cost_reason"]').val(); // Fixed: Added
            const additionalCost = $dependantsForm.find('input[name="additional_cost"]').val(); // Fixed: Added
            const belongsTo = $dependantsForm.find('input[name="belongs-to"]:checked').val() === 'user-one'; // Fixed: Updated logic

            this._rpc({
                route: '/update/fact-find/dependant',
                params: {
                    fact_find_id: this.factFindId,
                    data: {
                        dependant_id: dependantId,
                        has_dependents: hasDependents,
                        number_of_dependents: numberOfDependents,
                        full_name: fullName,
                        relationship: relationship,
                        date_of_birth: dateOfBirth,
                        dependency_type: dependencyType,
                        dependency_period: dependencyPeriod, // Fixed: Added
                        monthly_childcare_cost: monthlyChildcareCost,
                        childcare_cost_reason: childcareCostReason, // Fixed: Added
                        additional_cost: additionalCost, // Fixed: Added
                        belongs_to: belongsTo,
                    }
                }
            }).then((data) => {
                if (data.success) {
                    const relationshipLabel = self._getRelationshipDisplay(relationship);
                    if (isNewDependant) {
                         $('.dependants-history-details > div.button-group').before(`
                            <div class="dependant-card">
                                <div class="edit-delete">
                                    <i class="fa fa-pencil fa-lg financial-dependants-actions"
                                       data-type="edit" data-dependant-id="${data.dependant_id}"></i>
                                    <i class="fa fa-trash fa-lg financial-dependants-actions"
                                       data-type="delete" data-dependant-id="${data.dependant_id}"></i>
                                </div>
                                <div class="dependant-details">
                                    <div class="detail-row">
                                        <span class="label">👤 Name:</span>
                                        <span class="value">${fullName}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">🤝 Relationship:</span>
                                        <span class="value">${relationshipLabel}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">🎂 Date of Birth:</span>
                                        <span class="value">${dateOfBirth}</span>
                                    </div>
                                </div>
                            </div>
                        `);

                        $('.dependants-history-details').removeClass('d-none');
                    } else {
                        const $existingCard = $(`.dependant-card:has(i[data-dependant-id="${dependantId}"])`);
                        if ($existingCard.length) {
                            $existingCard.find('.dependant-info').eq(0).text(fullName);
                            $existingCard.find('.dependant-info').eq(1).text(relationshipLabel);
                            $existingCard.find('.dependant-info').eq(2).text(dateOfBirth);
                        }
                    }
                }
            });
        },


        //Adverse Credit---------------------------------------

        _onclickFFSubItemAdverseCredit: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Add Adverse Credit
            const self = this;
            this._rpc({
                route: '/get/fact-find/adverse-credit',
                params: {
                    'fact_find_id': this.factFindId // Fixed parameter name
                }
            }).then((adverseCreditData) => {
                // Define mapping of technical values to display strings
                const creditTypeMapping = {
                    'type4': 'Missed Payment / Arrears',
                    'ccj': 'CCJ',
                    'iva': 'Individual Voluntary Arrangement',
                    'dmp': 'Debt Management Plan',
                    'arrangements_to_pay': 'Arrangements to Pay',
                    'bankrupt': 'Bankrupt'
                };

                let adverseCreditHistoryDetailsContent = '';
                $.each(adverseCreditData, function(index, credit) {
                    const creditTypeString = creditTypeMapping[credit.adverse_credit_type] || 'Unknown';

                    adverseCreditHistoryDetailsContent += `
                    <div class="adverse-credit-card">
                        <div class="edit-delete">
                            <i class="fa fa-pencil fa-lg adverse-credit-actions" data-type="edit" data-adverse-credit-id="${credit.adverse_credit_id}"></i>
                            <i class="fa fa-trash fa-lg adverse-credit-actions" data-type="delete" data-adverse-credit-id="${credit.adverse_credit_id}"></i>
                        </div>
                        <p>Credit Type:
                            <span class="adverse-credit-info">${creditTypeString}</span>
                        </p>
                        <p>Lender:
                            <span class="adverse-credit-info">${credit.lender}</span>
                        </p>
                    </div>
                `;
                });
                $('.adverse-credit-container').html(adverseCreditHistoryDetailsContent);
            });
        },

        _onclickAdverseCreditAdd: function(ev) {
            const $adverseCreditForm = $('.adverse_credit_form');
            // Target the form and reset all input fields
            $adverseCreditForm.find('input[type="text"], input[type="number"], input[type="date"], textarea').val('');
            $adverseCreditForm.find('select').val(''); // Reset select fields
            $adverseCreditForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new credit record
            $adverseCreditForm.find('#adverse_credit_id').val('new-credit');
            $adverseCreditForm.removeClass('d-none').fadeIn(400);
        },

        _onclickAdverseCreditSaveCancel: function(el) {


            const $adverseCreditForm = $('.adverse_credit_form');
            const adverseCreditId = $adverseCreditForm.find('#adverse_credit_id').val();
            const isNewCredit = adverseCreditId === 'new-credit';

            $adverseCreditForm.addClass('d-none').fadeOut(400);
            const $adverseCreditHistoryDetails = $('.adverse-credit');
            $adverseCreditHistoryDetails.removeClass('d-none').fadeIn(400);

            // Extract field values from the form
            const adverseCreditType = $adverseCreditForm.find('select[name="adverse_credit_type"]').val();
            const totalCount = $adverseCreditForm.find('input[name="total_count"]').val();
            const loanType = $adverseCreditForm.find('input[name="loan_type"]').val();
            const lender = $adverseCreditForm.find('input[name="lender"]').val();
            const amount = $adverseCreditForm.find('input[name="amount"]').val();
            const reportedOn = $adverseCreditForm.find('input[name="reported_on"]').val();
            const settledOn = $adverseCreditForm.find('input[name="settled_on"]').val();
            const belongsTo = $adverseCreditForm.find('input[name="belongs-to-ac"]').is(':checked');


            // Define mapping of technical values to display strings
            const creditTypeMapping = {
                'type4': 'Missed Payment / Arrears',
                'ccj': 'CCJ',
                'iva': 'Individual Voluntary Arrangement',
                'dmp': 'Debt Management Plan',
                'arrangements_to_pay': 'Arrangements to Pay',
                'bankrupt': 'Bankrupt'
            };

            // Get the user-friendly label for the adverse credit type
            const adverseCreditTypeLabel = creditTypeMapping[adverseCreditType] || 'Unknown';

            this._rpc({
                route: '/update/fact-find/adverse-credit',
                params: {
                    fact_find_id: this.factFindId,
                    data: {
                        adverse_credit_id: adverseCreditId,
                        adverse_credit_type: adverseCreditType,
                        total_count: totalCount,
                        loan_type: loanType,
                        lender: lender,
                        amount: amount,
                        reported_on: reportedOn,
                        settled_on: settledOn,
                        belongs_to_ac: belongsTo,
                    }
                }
            }).then((data) => {
                if (data.success) {
                    if (isNewCredit) {
                        // If it's a new adverse credit, add a new card
                        $('.adverse-credit > div.button-group').before(`
                            <div class="adverse-credit-card">
                                <div class="edit-delete">
                                    <i class="fa fa-pencil fa-lg adverse-credit-actions" data-type="edit" data-adverse-credit-id="${data.adverse_credit_id}"></i>
                                    <i class="fa fa-trash fa-lg adverse-credit-actions" data-type="delete" data-adverse-credit-id="${data.adverse_credit_id}"></i>
                                </div>
                                <p>Credit Type:
                                    <span class="adverse-credit-info">${adverseCreditTypeLabel}</span>
                                </p>
                                <p>Lender:
                                    <span class="adverse-credit-info">${lender}</span>
                                </p>
                            </div>
                        `);
                    } else {
                        // If it's an existing adverse credit, update the corresponding card
                        const $existingCard = $(`.adverse-credit-card:has(i[data-adverse-credit-id="${adverseCreditId}"])`);
                        if ($existingCard.length) {
                            $existingCard.find('.adverse-credit-info').eq(0).text(adverseCreditTypeLabel);
                            $existingCard.find('.adverse-credit-info').eq(1).text(lender);
                        }
                    }
                } else {
                    // Handle error response
                    console.error('Error saving adverse credit:', data.error);
                    alert('Failed to save adverse credit: ' + data.error);
                }
            });
        },

        _onclickUpdateAdverseCreditActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let adverseCreditId = parseInt($(el.currentTarget).attr('data-adverse-credit-id')); // Use parseInt instead of parseFloat
            let $adverseCreditForm = $('.adverse_credit_form');

            if (actionType === 'edit') {
                $adverseCreditForm.find('#adverse_credit_id').val(adverseCreditId);
                this._rpc({
                    route: '/ff/get/adverse-credit-details',
                    params: {
                        adverse_credit_id: adverseCreditId
                    }
                }).then((creditData) => {
                    // Populate form with retrieved data
                    if (creditData.error) {
                        console.error('Error retrieving credit data:', creditData.error);
                        alert('Failed to retrieve credit data: ' + creditData.error);
                        return;
                    }

                    // Map the returned data to form fields
                    $adverseCreditForm.find('select[name="adverse_credit_type"]').val(creditData.adverse_credit_type);
                    $adverseCreditForm.find('input[name="total_count"]').val(creditData.total_count);
                    $adverseCreditForm.find('input[name="loan_type"]').val(creditData.loan_type);
                    $adverseCreditForm.find('input[name="lender"]').val(creditData.lender);
                    $adverseCreditForm.find('input[name="amount"]').val(creditData.amount);
                    $adverseCreditForm.find('input[name="reported_on"]').val(creditData.reported_on);
                    $adverseCreditForm.find('input[name="settled_on"]').val(creditData.settled_on);

                    $adverseCreditForm.removeClass('d-none').fadeIn(400);
                    $('.adverse-credit').addClass('d-none').fadeOut(400);
                });
            }

            if (actionType === 'delete') {
                if (confirm('Are you sure you want to delete this adverse credit record?')) {
                    this._rpc({
                        route: '/ff/delete/adverse-credit',
                        params: {
                            adverse_credit_id: adverseCreditId
                        }
                    }).then((data) => {
                        if (data.success) {
                            $(el.currentTarget).closest('.adverse-credit-card').fadeOut(400, function() {
                                $(this).remove();
                            });
                        } else {
                            console.error('Error deleting adverse credit:', data.error);
                            alert('Failed to delete adverse credit: ' + data.error);
                        }
                    });
                }
            }
        },

        _onChangeAdverseCreditQuestion: function(ev) {
            const fieldName = $(ev.currentTarget).attr('name');
            const fieldValue = $(ev.currentTarget).val();

            // Save the question immediately when radio button is selected
            this._saveAdverseCreditQuestion(fieldName, fieldValue);
        },

        // Function to save individual adverse credit question
        _saveAdverseCreditQuestion: function(fieldName, value) {
            const data = {};
            data[fieldName] = value;

            this._rpc({
                route: '/update/fact-find/adverse-credit-questions',
                params: {
                    fact_find_id: this.factFindId,
                    data: data
                }
            }).then((result) => {
                if (result.error) {
                    console.error('Error saving adverse credit question:', result.error);
                    // Optionally show user notification
                    alert('Failed to save: ' + result.error);
                } else {
                    console.log('Adverse credit question saved successfully');
                    // Optionally show success message
                }
            }).catch((error) => {
                console.error('RPC Error:', error);
                alert('Failed to save adverse credit question');
            });
        },

        // Function to load existing adverse credit question answers
        _loadAdverseCreditQuestions: function() {
            if (!this.factFindId) {
                console.warn('No fact find ID available');
                return;
            }

            this._rpc({
                route: '/get/fact-find/adverse-credit-questions',
                params: {
                    fact_find_id: this.factFindId
                }
            }).then((data) => {
                if (data.error) {
                    console.error('Error loading adverse credit questions:', data.error);
                    return;
                }

                // Set radio button values based on returned data
                if (data.missed_payment_last_3_years) {
                    $('input[name="missed_payment_last_3_years"][value="' + data.missed_payment_last_3_years + '"]').prop('checked', true);
                }

                if (data.arrears_with_mortgage_or_loans) {
                    $('input[name="arrears_with_mortgage_or_loans"][value="' + data.arrears_with_mortgage_or_loans + '"]').prop('checked', true);
                }

                // Note: This maps to the same field as missed_payment_last_3_years in your backend
                if (data.missed_payment_last_3_years) {
                    $('input[name="arrears_with_credit_card_or_store_cards"][value="' + data.missed_payment_last_3_years + '"]').prop('checked', true);
                }

                if (data.ccj_against_you) {
                    $('input[name="ccj_against_you"][value="' + data.ccj_against_you + '"]').prop('checked', true);
                }

                if (data.debt_management_plan) {
                    $('input[name="debt_management_plan"][value="' + data.debt_management_plan + '"]').prop('checked', true);
                }

                if (data.default_registered) {
                    $('input[name="default_registered"][value="' + data.default_registered + '"]').prop('checked', true);
                }

                if (data.failed_to_keep_up_repayments) {
                    $('input[name="failed_to_keep_up_repayments"][value="' + data.failed_to_keep_up_repayments + '"]').prop('checked', true);
                }

                if (data.bankruptcy) {
                    $('input[name="bankruptcy"][value="' + data.bankruptcy + '"]').prop('checked', true);
                }

                if (data.arrangements_with_creditors) {
                    // You'll need to map this to the correct HTML field name when you add it
                    $('input[name="arrangements_with_creditors"][value="' + data.arrangements_with_creditors + '"]').prop('checked', true);
                }

            }).catch((error) => {
                console.error('RPC Error loading questions:', error);
            });
        },

        // Update your existing _onclickFFSubItemAdverseCredit function
        _onclickFFSubItemAdverseCredit: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Load adverse credit questions FIRST
            this._loadAdverseCreditQuestions();

            // Then load adverse credit details
            const self = this;
            this._rpc({
                route: '/get/fact-find/adverse-credit',
                params: {
                    'fact_find_id': this.factFindId
                }
            }).then((adverseCreditData) => {
                // Define mapping of technical values to display strings
                const creditTypeMapping = {
                    'type4': 'Missed Payment / Arrears',
                    'ccj': 'CCJ',
                    'iva': 'Individual Voluntary Arrangement',
                    'dmp': 'Debt Management Plan',
                    'arrangements_to_pay': 'Arrangements to Pay',
                    'bankrupt': 'Bankrupt'
                };

                let adverseCreditHistoryDetailsContent = '';
                $.each(adverseCreditData, function(index, credit) {
                    const creditTypeString = creditTypeMapping[credit.adverse_credit_type] || 'Unknown';

                    adverseCreditHistoryDetailsContent += `
                <div class="adverse-credit-card">
                    <div class="edit-delete">
                        <i class="fa fa-pencil fa-lg adverse-credit-actions" data-type="edit" data-adverse-credit-id="${credit.adverse_credit_id}"></i>
                        <i class="fa fa-trash fa-lg adverse-credit-actions" data-type="delete" data-adverse-credit-id="${credit.adverse_credit_id}"></i>
                    </div>
                    <p>Credit Type:
                        <span class="adverse-credit-info">${creditTypeString}</span>
                    </p>
                    <p>Lender:
                        <span class="adverse-credit-info">${credit.lender}</span>
                    </p>
                </div>
            `;
                });
                $('.adverse-credit-container').html(adverseCreditHistoryDetailsContent);
            });
        },

        _saveAllAdverseCreditQuestions: function() {
            const questionsData = {};

            // Get values from all radio buttons
            const fields = [
                'missed_payment_last_3_years',
                'arrears_with_mortgage_or_loans',
                'arrears_with_credit_card_or_store_cards',
                'ccj_against_you',
                'debt_management_plan',
                'default_registered',
                'failed_to_keep_up_repayments',
                'bankruptcy'
            ];

            fields.forEach(function(fieldName) {
                const checkedRadio = $('input[name="' + fieldName + '"]:checked');
                if (checkedRadio.length > 0) {
                    questionsData[fieldName] = checkedRadio.val();
                }
            });

            if (Object.keys(questionsData).length > 0) {
                this._rpc({
                    route: '/update/fact-find/adverse-credit-questions',
                    params: {
                        fact_find_id: this.factFindId,
                        data: questionsData
                    }
                }).then((result) => {
                    if (result.error) {
                        console.error('Error saving adverse credit questions:', result.error);
                        alert('Failed to save questions: ' + result.error);
                    } else {
                        console.log('All adverse credit questions saved successfully');
                        alert('Questions saved successfully!');
                    }
                }).catch((error) => {
                    console.error('RPC Error:', error);
                    alert('Failed to save adverse credit questions');
                });
            } else {
                alert('No questions answered yet');
            }
        },

        _validateAdverseCreditQuestions: function() {
            const requiredFields = [
                'missed_payment_last_3_years',
                'arrears_with_mortgage_or_loans',
                'arrears_with_credit_card_or_store_cards',
                'ccj_against_you',
                'debt_management_plan',
                'default_registered',
                'failed_to_keep_up_repayments',
                'bankruptcy'
            ];

            const missingFields = [];

            requiredFields.forEach(function(fieldName) {
                const checkedRadio = $('input[name="' + fieldName + '"]:checked');
                if (checkedRadio.length === 0) {
                    missingFields.push(fieldName);
                }
            });

            if (missingFields.length > 0) {
                console.warn('Missing required fields:', missingFields);
                return false;
            }

            return true;
        },


        // Banking-----------------------------------------------

        _getBankNameDisplay: function(technicalName) {
            const BANK_NAME_MAPPING = {
                'barclays': 'Barclays',
                'santander': 'Santander',
                'halifax': 'Halifax',
                'lloyds': 'Lloyds',
                'natwest': 'NatWest',
                'nationwide': 'Nationwide',
                'hsbc': 'HSBC',
                'tsb': 'TSB',
                'royal-bank-of-scotland': 'Royal Bank Of Scotland',
                'the-co-operative': 'The Co-operative',
                'monzo': 'Monzo',
                'other': 'Other'
            };
            return BANK_NAME_MAPPING[technicalName] || technicalName;
        },

        _togglePreferredDDDate: function(ev) {
            const checkbox = ev.target;
            const preferredDDDateDiv = document.querySelector('.preferred_dd_date');

            if (checkbox.checked) {
                // Remove 'd-none' class to show the dropdown
                preferredDDDateDiv.classList.remove('d-none');
            } else {
                // Add 'd-none' class to hide the dropdown
                preferredDDDateDiv.classList.add('d-none');
            }
        },

        _onclickFFSubItemBankingDetails: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none'); // Ensure loader is shown
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Add Banking Details
            const self = this;
            this._rpc({
                route: '/get/ff/banking-details',
                params: {
                    'banking_details_id': this.factFindId
                }
            }).then((bankingDetailsData) => {
                let bankingDetailsHistoryDetailsContent = '';
                $.each(bankingDetailsData, function(index, bankingDetail) {
                    // Use the _getBankNameDisplay function to get proper display name
                    const bankNameDisplay = self._getBankNameDisplay(bankingDetail.bank_name);
                    bankingDetailsHistoryDetailsContent += `
                        <div class="banking-details-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg banking-details-actions" data-type="edit" data-banking-details-id="${bankingDetail.banking_details_id}"/>
                                <i class="fa fa-trash fa-lg banking-details-actions" data-type="delete" data-banking-details-id="${bankingDetail.banking_details_id}"/>
                            </div>
                            <p>Bank Name:
                                <span class="banking-details-info">${bankNameDisplay}</span>
                            </p>
                            <p>Account Holder Name:
                                <span class="banking-details-info">${bankingDetail.account_holder_name}</span>
                            </p>
                            <p>Sort Code:
                                <span class="banking-details-info">${bankingDetail.sort_code}</span>
                            </p>
                            <p>Account Open Date:
                                <span class="banking-details-info">${bankingDetail.account_open_date || 'N/A'}</span>
                            </p>
                            <p>Direct Debit for Mortgage:
                                <span class="banking-details-info">${bankingDetail.direct_debit_for_mortgage ? 'Yes' : 'No'}</span>
                            </p>
                            <p>Preferred DD Date:
                                <span class="banking-details-info">${bankingDetail.preferred_dd_date || 'N/A'}</span>
                            </p>
                        </div>
                    `;
                });
                $('.banking-details-container').html(bankingDetailsHistoryDetailsContent);
            });
        },

        _onclickBankingDetailsAdd: function(ev) {
            const $bankingDetailsForm = $('.banking-details-form');
            // Target the form and reset all input fields
            $bankingDetailsForm.find('input[type="text"], input[type="number"], input[type="date"], textarea').val('');
            $bankingDetailsForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new banking details record
            $bankingDetailsForm.find('#banking_details_id').val('new-banking-details');
            $bankingDetailsForm.removeClass('d-none').fadeIn(400)
        },

        _onclickBankingDetailsSaveCancel: function(el) {
            const $bankingDetailsForm = $('.banking-details-form');
            const $bankingDetailsHistoryDetails = $('.banking-details-dp');
            $bankingDetailsForm.addClass('d-none').fadeOut(400);
            $bankingDetailsHistoryDetails.removeClass('d-none').fadeIn(400);

            if ($(el.currentTarget).hasClass('btn-banking-save')) {
                // Extract field values from the form
                const belongsTo = $bankingDetailsForm.find('input[name="belongs-to-banking"][value="user-one"]').is(':checked');
                const bankName = $bankingDetailsForm.find('select[name="ynm-banking-bank-name"]').val();
                const accountType = $bankingDetailsForm.find('select[name="account_type"]').val();
                const accountHolderName = $bankingDetailsForm.find('input[name="ynm-account-holder-name"]').val();
                const accountNumber = $bankingDetailsForm.find('input[name="ynm-account-number"]').val();
                const sortCode = $bankingDetailsForm.find('input[name="ynm-sort-code"]').val();
                const yearsHeld = $bankingDetailsForm.find('input[name="ynm-years-held"]').val();
                const directDebitForMortgage = $bankingDetailsForm.find('input[name="direct_debit_for_mortgage"]').is(':checked');
                const preferredDdDate = $bankingDetailsForm.find('select[name="preferred_dd_date"]').val();
                const additionalInformation = $bankingDetailsForm.find('textarea[name="ynm-bnk-additional-information"]').val();
                const bankingDetailsId = $bankingDetailsForm.find('#banking_details_id').val();

                const self = this;
                this._rpc({
                    route: '/update/fact-find/banking-details',
                    params: {
                        fact_find_id: this.factFindId,
                        data: {
                            belongs_to: belongsTo,
                            bank_name: bankName,
                            account_type: accountType,
                            account_holder_name: accountHolderName,
                            account_number: accountNumber,
                            sort_code: sortCode,
                            years_held: yearsHeld,
                            direct_debit_for_mortgage: directDebitForMortgage,
                            preferred_dd_date: preferredDdDate,
                            additional_information: additionalInformation,
                            banking_details_id: bankingDetailsId === 'new-banking-details' ? false : bankingDetailsId
                        }
                    }
                }).then((data) => {
                    // Refresh banking details list
                    this._rpc({
                        route: '/get/ff/banking-details',
                        params: {
                            'banking_details_id': this.factFindId
                        }
                    }).then((bankingDetailsData) => {
                        let bankingDetailsHistoryDetailsContent = '';
                        $.each(bankingDetailsData, function(index, bankingDetail) {
                            bankingDetailsHistoryDetailsContent += `
                                <div class="banking-details-card">
                                    <div class="edit-delete">
                                        <i class="fa fa-pencil fa-lg banking-details-actions" data-type="edit" data-banking-details-id="${bankingDetail.banking_details_id}"/>
                                        <i class="fa fa-trash fa-lg banking-details-actions" data-type="delete" data-banking-details-id="${bankingDetail.banking_details_id}"/>
                                    </div>
                                    <p>Bank Name:
                                        <span class="banking-details-info">${self._getBankNameDisplay(bankingDetail.bank_name)}</span>
                                    </p>
                                    <p>Account Holder Name:
                                        <span class="banking-details-info">${bankingDetail.account_holder_name}</span>
                                    </p>
                                    <p>Sort Code:
                                        <span class="banking-details-info">${bankingDetail.sort_code}</span>
                                    </p>
                                    <p>Account Open Date:
                                        <span class="banking-details-info">${bankingDetail.account_open_date || 'N/A'}</span>
                                    </p>
                                    <p>Direct Debit for Mortgage:
                                        <span class="banking-details-info">${bankingDetail.direct_debit_for_mortgage ? 'Yes' : 'No'}</span>
                                    </p>
                                    <p>Preferred DD Date:
                                        <span class="banking-details-info">${bankingDetail.preferred_dd_date || 'N/A'}</span>
                                    </p>
                                </div>
                            `;
                        });
                        $('.banking-details-container').html(bankingDetailsHistoryDetailsContent);
                    });
                });
            }
        },


        //credit commitment------------------------------------------
        _onclickUpdateCreditCommitmentActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let creditCommitmentId = parseFloat($(el.currentTarget).attr('data-credit-commitment-id'));
            let $creditCommitmentForm = $('.credit-commitment-form');

            if (actionType === 'edit') {
                $creditCommitmentForm.find('#credit_comment_id').val(creditCommitmentId);
                this._rpc({
                    route: '/get/fact-find/credit-commitments',
                    params: {
                        credit_comment_id: creditCommitmentId
                    }
                }).then((creditCommitmentData) => {
                    $.each(creditCommitmentData, function(selector, value) {
                        if (selector === 'commitment_type' || selector === 'lender') {
                            $creditCommitmentForm.find(`select[name="${selector}"] option[value="${value}"]`).prop('selected', true);
                        } else if (selector === 'intend_to_repay') {
                            $creditCommitmentForm.find(`input[name="${selector}"]`).prop('checked', value);
                        } else {
                            $creditCommitmentForm.find(`input[name="${selector}"]`).val(value);
                        }
                    });
                    $creditCommitmentForm.removeClass('d-none').fadeIn(400);
                    $('.credit-commitment-container').addClass('d-none').fadeOut(400);
                });
            }

            if (actionType === 'delete') {
                this._rpc({
                    route: '/delete/fact-find/credit-commitments',
                    params: {
                        credit_comment_id: creditCommitmentId
                    }
                }).then((response) => {
                    if (response.status === 'success') {
                        this._reloadCreditCommitments();
                    }
                });
            }
        },

        _onclickCreditCommitmentSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            $('.fact-find-header').html($(el.currentTarget).text());
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();
            $('#loader').removeClass('d-none');
            setTimeout(() => {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();
            this._reloadCreditCommitments();
        },

        _reloadCreditCommitments: function() {
            const self = this;
            this._rpc({
                route: '/get/ff/credit-commitments',
                params: {
                    credit_comment_id: this.factFindId
                }
            }).then((creditCommitmentData) => {
                let content = '';
                $.each(creditCommitmentData, function(index, creditCommitment) {
                    const commitmentTypeDisplay = self._getCommitmentTypeDisplay(creditCommitment.commitment_type);
                    const creditCommitmentId = creditCommitment.id || creditCommitment.credit_comment_id;

                    content += `
                        <div class="credit-commitment-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg credit-commitment-actions" data-type="edit" data-credit-commitment-id="${creditCommitmentId}"></i>
                                <i class="fa fa-trash fa-lg credit-commitment-actions" data-type="delete" data-credit-commitment-id="${creditCommitmentId}"></i>
                            </div>
                            <p>Commitment Type: <span class="credit-commitment-info">${commitmentTypeDisplay}</span></p>
                            <p>Outstanding Amount: <span class="credit-commitment-info">${creditCommitment.outstanding_amount || ''}</span></p>
                            <p>Monthly Payment: <span class="credit-commitment-info">${creditCommitment.monthly_payment || ''}</span></p>
                        </div>
                    `;
                });
                $('.credit-commitment-container').html(content);
                $('.credit-commitment-container').removeClass('d-none').fadeIn(400);
                sessionStorage.setItem('currentFactFindId', self.factFindId);
            });
        },

        _onclickCreditCommitmentAdd: function() {
            const $creditCommitmentForm = $('.credit-commitment-form');
            $creditCommitmentForm.find('input[type="text"], input[type="number"], select').val('');
            $creditCommitmentForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            $creditCommitmentForm.find('#credit_comment_id').val('new-credit-commitment');
            $creditCommitmentForm.removeClass('d-none').fadeIn(400);
            $('.credit-commitment-container').addClass('d-none').fadeOut(400);
        },

        _getCommitmentTypeDisplay: function(technicalName) {
            const map = {
                'credit_card': 'Credit Card',
                'store_card': 'Store Card',
                'hire_purchase': 'Hire Purchase',
                'personal_loan': 'Personal Loan',
                'secured_loan': 'Secured Loan',
                'overdraft': 'Overdraft',
                'mail_orders': 'Mail Orders',
                'buy_now_pay_later': 'Buy Now Pay Later',
                'student_loan': 'Student Loan',
                'child_care': 'Child Care'
            };
            return map[technicalName] || technicalName;
        },

        _onclickCreditCommitmentSaveCancel: function(el) {
            const $creditCommitmentForm = $('.credit-commitment-form');
            const isSave = $(el.currentTarget).hasClass('btn-save-cc');
            const creditCommitmentId = $creditCommitmentForm.find('#credit_comment_id').val();
            const isNew = creditCommitmentId === 'new-credit-commitment';

            if (isSave) {
                const belongsTo = $creditCommitmentForm.find('input[name="belongs-to-cc"]').is(':checked');
                const commitmentType = $creditCommitmentForm.find('select[name="commitment_type"]').val();
                const lender = $creditCommitmentForm.find('input[name="lender"]').val() || $creditCommitmentForm.find('select[name="lender"]').val();
                const creditorCompany = $creditCommitmentForm.find('input[name="creditor-company"]').val();
                const outstandingAmount = $creditCommitmentForm.find('input[name="outstanding-amount"]').val();
                const monthlyPayment = $creditCommitmentForm.find('input[name="monthly-payment"]').val();
                const creditLimit = $creditCommitmentForm.find('input[name="credit_limit"]').val();
                const remainingMonths = $creditCommitmentForm.find('input[name="remaining_months"]').val();
                const intendToRepay = $creditCommitmentForm.find('input[name="intend_to_repay"]').is(':checked');

                const requestData = {
                    fact_find_id: this.factFindId,
                    data: {
                        belongs_to: belongsTo,
                        commitment_type: commitmentType,
                        lender: lender,
                        creditor_company: creditorCompany,
                        outstanding_amount: outstandingAmount,
                        monthly_payment: monthlyPayment,
                        credit_limit: creditLimit,
                        remaining_months: remainingMonths,
                        intend_to_repay: intendToRepay,
                    }
                };

                // Add credit_comment_id for edit operations
                if (!isNew) {
                    requestData.data.credit_comment_id = creditCommitmentId;
                }

                this._rpc({
                    route: '/update/fact-find/credit-commitment',
                    params: requestData
                }).then((response) => {
                    if (response.status === 'success') {
                        // Hide form and show container
                        $creditCommitmentForm.addClass('d-none').fadeOut(400);
                        $('.credit-commitment-container').removeClass('d-none').fadeIn(400);

                        // Reload the full list to reflect saved data
                        this._reloadCreditCommitments();
                    } else {
                        console.error('Error saving credit commitment:', response.message);
                    }
                }).catch((error) => {
                    console.error('RPC Error:', error);
                });
            } else {
                // Cancel operation - just hide form and show container
                $creditCommitmentForm.addClass('d-none').fadeOut(400);
                $('.credit-commitment-container').removeClass('d-none').fadeIn(400);
            }
        },


        //your properties-----------------------------------------------
        getPropertyUsageLabel: function(value) {
            const labels = {
                'residential': 'Residential',
                'second_residential': 'Second Residential',
                'btl': 'BTL',
                'company_btl': 'Company BTL'
            };
            return labels[value] || value || '';
        },

        getPropertyTypeLabel: function(value) {
            const labels = {
                'semi': 'Semi Detached',
                'detached': 'Detached',
                'terrace': 'Terrace',
                'end': 'End Terrace',
                'purpose': 'Purpose Built Flat',
                'maisonette': 'Maisonette',
                'bunglow': 'Bunglow',
                'other': 'Other'
            };
            return labels[value] || value || '';
        },

        getTenureLabel: function(value) {
            const labels = {
                'freehold': 'Freehold',
                'leasehold': 'Leasehold'
            };
            return labels[value] || value || '';
        },

        _onclickYourPropertiesSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Add Your Properties
            const self = this;
            this._rpc({
                route: '/get/ff/your-properties',
                params: {
                    'your_properties_id': this.factFindId
                }
            }).then((yourPropertiesData) => {
                let yourPropertiesHistoryDetailsContent = '';
                $.each(yourPropertiesData, function(index, yourProperty) {
                    yourPropertiesHistoryDetailsContent += `
                <div class="your-properties-card">
                    <div class="edit-delete">
                        <i class="fa fa-pencil fa-lg your-properties-actions" data-type="edit" data-your-properties-id="${yourProperty.your_properties_id}"/>
                        <i class="fa fa-trash fa-lg your-properties-actions" data-type="delete" data-your-properties-id="${yourProperty.your_properties_id}"/>
                    </div>
                    <p>Property Usage:
                        <span class="your-properties-info">${self.getPropertyUsageLabel(yourProperty.property_usage)}</span>
                    </p>
                    <p>House Number:
                        <span class="your-properties-info">${yourProperty.house_number || ''}</span>
                    </p>
                    <p>Postcode:
                        <span class="your-properties-info">${yourProperty.postcode || ''}</span>
                    </p>
                    <p>Street Address:
                        <span class="your-properties-info">${yourProperty.street_address || ''}</span>
                    </p>
                    <p>Property Type:
                        <span class="your-properties-info">${self.getPropertyTypeLabel(yourProperty.property_type)}</span>
                    </p>
                    <p>Tenure:
                        <span class="your-properties-info">${self.getTenureLabel(yourProperty.tenure)}</span>
                    </p>
                    <p>Current Valuation:
                        <span class="your-properties-info">${yourProperty.current_property_valuation ? '£' + parseFloat(yourProperty.current_property_valuation).toLocaleString() : ''}</span>
                    </p>

                </div>
            `;
                });
                $('.properties-container').html(yourPropertiesHistoryDetailsContent);
            });
        },

        _onclickYourPropertiesAdd: function(ev) {
            const $yourPropertiesForm = $('.your-properties-form');
            // Target the form and reset all input fields
            $yourPropertiesForm.find('input[type="text"], input[type="number"], select, textarea').val('');
            $yourPropertiesForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new your properties record
            $yourPropertiesForm.find('#your_properties_id').val('new-your-properties');
            $yourPropertiesForm.removeClass('d-none').fadeIn(400)
            $('html, body').animate({
                scrollTop: $yourPropertiesForm.offset().top
            }, 500);

        },

        _onclickYourPropertiesSaveCancel: function(el) {
            const $yourPropertiesForm = $('.your-properties-form');
            const $propertiesContainer = $('.properties-container');

            if ($(el.currentTarget).hasClass('btn-save-your-properties')) {
                const yourPropertiesId = $yourPropertiesForm.find('#your_properties_id').val();

                // Helper function to get display text from select options
                const getSelectDisplayText = (selector, value) => {
                    const option = $yourPropertiesForm.find(`${selector} option[value="${value}"]`);
                    return option.length ? option.text() : value;
                };

                // Extract field values from the form
                const propertyAddress = $yourPropertiesForm.find('input[aria-label="Address"]').val();
                const propertyUsage = $yourPropertiesForm.find('select[name="property_usage_yep"]').val();
                const propertyUsageDisplay = getSelectDisplayText('select[name="property_usage_yep"]', propertyUsage);
                const propertyType = $yourPropertiesForm.find('select[id="property_type"]').val();
                const propertyTypeDisplay = getSelectDisplayText('select[id="property_type"]', propertyType);
                const tenure = $yourPropertiesForm.find('select[name="tenure_yep"]').val();
                const tenureDisplay = getSelectDisplayText('select[name="tenure_yep"]', tenure);
                const houseNumber = $yourPropertiesForm.find('input[name="house_number_yep"]').val();
                const postcode = $yourPropertiesForm.find('input[name="post_code_yep"]').val();
                const streetAddress = $yourPropertiesForm.find('textarea[name="street_address_existing_properties"]').val();
                const county = $yourPropertiesForm.find('input[name="county_yep"]').val();
                const purchasePrice = $yourPropertiesForm.find('input[name="purchase_price_yep"]').val();
                const marketValue = $yourPropertiesForm.find('input[name="current_property_valuation_yep"]').val();
                const outstandingMortgage = $yourPropertiesForm.find('input[name="outstanding_mortgage_yep"]').val();
                const monthlyRent = $yourPropertiesForm.find('input[name="monthly_rental_income"]').val();
                const groundRent = $yourPropertiesForm.find('input[id="ground_rent"]').val();
                const serviceCharge = $yourPropertiesForm.find('input[name="service_charge"]').val();
                const bedRooms = $yourPropertiesForm.find('input[id="bedrooms"]').val();
                const propertyOwnership = $yourPropertiesForm.find('select[name="property_ownership_yep"]').val();
                const propertyOwnershipDisplay = getSelectDisplayText('select[name="property_ownership_yep"]', propertyOwnership);
                const ownershipPercentage = $yourPropertiesForm.find('input[name="ownership_percentage_yep"]').val();
                const hasMortgage = $yourPropertiesForm.find('input[name="has_mortgage"]').is(':checked');
                const isHMO = $yourPropertiesForm.find('input[name="is_hmo_yep"]').is(':checked');
                const firstLetDate = $yourPropertiesForm.find('input[name="first_let_date"]').val();
                const secondChargeProperty = $yourPropertiesForm.find('select[name="second_charge_property"]').val();
                const secondChargeDetails = $yourPropertiesForm.find('textarea[name="second_charge_details"]').val();
                const htbSchemeAvailable = $yourPropertiesForm.find('select[name="htb_scheme_available_yep"]').val();
                const htbSchemeLocation = $yourPropertiesForm.find('select[name="htb_scheme_location"]').val();
                const redeemHtbLoan = $yourPropertiesForm.find('select[name="redeem_htb_loan"]').val();
                const sharedOwnershipAvailable = $yourPropertiesForm.find('select[name="shared_ownership_available_yep"]').val();
                const ownershipPercentageSelect = $yourPropertiesForm.find('select[name="ownership_percentage"]').val();


                this._rpc({
                    route: '/update/fact-find/your-properties',
                    params: {
                        fact_find_id: this.factFindId,
                        data: {
                            your_properties_id: yourPropertiesId,
                            property_address: propertyAddress,
                            property_usage: propertyUsage,
                            property_type: propertyType,
                            house_number: houseNumber,
                            postcode: postcode,
                            street_address: streetAddress,
                            county: county,
                            tenure: tenure,
                            bedroom: bedRooms,
                            purchase_price: purchasePrice,
                            current_property_valuation: marketValue,
                            outstanding_mortgage: outstandingMortgage,
                            has_mortgage: hasMortgage,
                            monthly_rental_income: monthlyRent,
                            ground_rent: groundRent,
                            service_charge: serviceCharge,
                            property_ownership: propertyOwnership,
                            ownership_percentage: ownershipPercentage,
                            is_hmo: isHMO,
                            first_let_date: firstLetDate,
                            second_charge_property: secondChargeProperty,
                            second_charge_details: secondChargeDetails,
                            htb_scheme_available: htbSchemeAvailable,
                            htb_scheme_location: htbSchemeLocation,
                            redeem_htb_loan: redeemHtbLoan,
                            shared_ownership_available: sharedOwnershipAvailable,
                            ownership_percentage: ownershipPercentageSelect,

                        }
                    }
                }).then((response) => {
                    if (response.status === 'success') {
                        if (yourPropertiesId === 'new-your-properties') {
                            // Add new card for created record
                            $propertiesContainer.append(`
                                <div class="your-properties-card">
                                    <div class="edit-delete">
                                        <i class="fa fa-pencil fa-lg your-properties-actions" data-type="edit" data-your-properties-id="${response.property_id}"/>
                                        <i class="fa fa-trash fa-lg your-properties-actions" data-type="delete" data-your-properties-id="${response.property_id}"/>
                                    </div>
                                    <p>Property Usage:
                                        <span class="your-properties-info">${propertyUsageDisplay || ''}</span>
                                    </p>
                                    <p>House Number:
                                        <span class="your-properties-info">${houseNumber || ''}</span>
                                    </p>
                                    <p>Postcode:
                                        <span class="your-properties-info">${postcode || ''}</span>
                                    </p>
                                    <p>Street Address:
                                        <span class="your-properties-info">${streetAddress || ''}</span>
                                    </p>
                                    <p>Property Type:
                                        <span class="your-properties-info">${propertyTypeDisplay || ''}</span>
                                    </p>
                                    <p>Tenure:
                                        <span class="your-properties-info">${tenureDisplay || ''}</span>
                                    </p>
                                    <p>Current Valuation:
                                        <span class="your-properties-info">${marketValue ? '£' + parseFloat(marketValue).toLocaleString() : ''}</span>
                                    </p>

                                </div>
                            `);
                        } else {
                            // Update existing card
                            const $existingCard = $(`.your-properties-actions[data-your-properties-id="${yourPropertiesId}"]`).closest('.your-properties-card');
                            $existingCard.find('.your-properties-info').eq(0).text(propertyUsageDisplay || '');
                            $existingCard.find('.your-properties-info').eq(1).text(houseNumber || '');
                            $existingCard.find('.your-properties-info').eq(2).text(postcode || '');
                            $existingCard.find('.your-properties-info').eq(3).text(streetAddress || '');
                            $existingCard.find('.your-properties-info').eq(4).text(propertyTypeDisplay || '');
                            $existingCard.find('.your-properties-info').eq(5).text(tenureDisplay || '');
                            $existingCard.find('.your-properties-info').eq(6).text(marketValue ? '£' + parseFloat(marketValue).toLocaleString() : '');
                            $existingCard.find('.your-properties-info').eq(7).text(monthlyRent ? '£' + parseFloat(monthlyRent).toLocaleString() : '');
                        }
                    } else {
                        console.error('Error saving property:', response.message);
                        alert('Error saving property: ' + response.message);
                    }
                }).catch((error) => {
                    console.error('Error saving property:', error);
                    alert('Error saving property');
                });
            }

            // Hide form and show main content
            $yourPropertiesForm.addClass('d-none').fadeOut(400);
            const $yourPropertiesHistoryDetails = $('.your-properties-details');
            $yourPropertiesHistoryDetails.removeClass('d-none').fadeIn(400);
        },

        _onchangePropertyUsageYep: function (ev) {
            var selectedOption = ev.target.value;

            var firstLetDateField = this.$('.first_let_date_yep');
            var monthlyRentalIncomeField = this.$('.monthly_rental_income_yep');
            var isHmoField = this.$('.is_hmo_yep');
            var htbSchemeAvailableField = this.$('.htb_scheme_available_yep');
            var sharedOwnershipYep = this.$('.shared_ownership_available_yep');

            if (selectedOption === 'residential') {
                firstLetDateField.addClass('d-none');
                monthlyRentalIncomeField.addClass('d-none');
                isHmoField.addClass('d-none');
                htbSchemeAvailableField.removeClass('d-none');
                sharedOwnershipYep.removeClass('d-none');
            } else if (selectedOption === 'btl') {
                firstLetDateField.removeClass('d-none');
                monthlyRentalIncomeField.removeClass('d-none');
                isHmoField.removeClass('d-none');
                htbSchemeAvailableField.addClass('d-none');
                sharedOwnershipYep.addClass('d-none');
            } else if (selectedOption === 'company_btl') {
                firstLetDateField.removeClass('d-none');
                monthlyRentalIncomeField.removeClass('d-none');
                isHmoField.addClass('d-none');
                sharedOwnershipYep.addClass('d-none');
            } else {
                firstLetDateField.addClass('d-none');
                monthlyRentalIncomeField.addClass('d-none');
                isHmoField.addClass('d-none');
                htbSchemeAvailableField.addClass('d-none');
                sharedOwnershipYep.addClass('d-none');
            }

         },



        //Your Mortgages------------------------------------------------------

        _onclickExistingMortgagesSubItem: function(el) {
            // Define mappings for property_usage and ownership_of_deed
            const propertyUsageMap = {
                'residential': 'Residential',
                'commercial': 'Commercial',
                'second_residential': 'Second Residential',
                'btl': 'BTL',
                'company_btl': 'Company BTL'
            };

            const ownershipOfDeedMap = {
                'sole_owner': 'Sole Owner',
                'joint_owners': 'Jointly',
                'client_or_someone_else': 'Only by client or with someone else',
                'partner_or_someone_else': 'Only by Partner or with someone else'
            };

            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');
            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());
            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }
            $('.li_overview').click();
            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);
            this._loadDocuments();

            // Add Existing Mortgages
            const self = this;
            this._rpc({
                route: '/get/fact-find/existing-mortgages',
                params: {
                    'existing_mortgages_id': this.factFindId
                }
            }).then((existingMortgagesData) => {
                let existingMortgagesHistoryDetailsContent = '';
                $.each(existingMortgagesData, function(index, existingMortgage) {
                    // Map technical names to display names
                    const propertyUsageDisplay = propertyUsageMap[existingMortgage.property_usage] || existingMortgage.property_usage || '';
                    const ownershipOfDeedDisplay = ownershipOfDeedMap[existingMortgage.ownership_of_deed] || existingMortgage.ownership_of_deed || '';

                    existingMortgagesHistoryDetailsContent += `
                <div class="existing-mortgages-card">
                    <div class="edit-delete">
                        <i class="fa fa-pencil fa-lg existing-mortgages-actions" data-type="edit" data-existing-mortgages-id="${existingMortgage.existing_mortgages_id}"/>
                        <i class="fa fa-trash fa-lg existing-mortgages-actions" data-type="delete" data-existing-mortgages-id="${existingMortgage.existing_mortgages_id}"/>
                    </div>
                    <p>Property Usage:
                        <span class="existing-mortgages-info">${propertyUsageDisplay}</span>
                    </p>
                    <p>Ownership of the Deed:
                        <span class="existing-mortgages-info">${ownershipOfDeedDisplay}</span>
                    </p>
                    <p>Property Address:
                        <span class="existing-mortgages-info">${existingMortgage.address || ''}</span>
                    </p>
                </div>
            `;
                });
                $('.existing-mortgages-container').html(existingMortgagesHistoryDetailsContent);
            }).catch((error) => {
                console.error('Error loading existing mortgages:', error);
            });
        },

        _onclickExistingMortgagesAdd: function(ev) {
            const $existingMortgagesForm = $('.existing_mortgages_form');
            // Target the form and reset all input fields
            $existingMortgagesForm.find('input[type="text"], input[type="number"], select, textarea').val('');
            $existingMortgagesForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new existing mortgages record
            $existingMortgagesForm.find('#existing_mortgages_id').val('new-existing-mortgages');
            $existingMortgagesForm.removeClass('d-none').fadeIn(400);
            $('html, body').animate({
                scrollTop: $existingMortgagesForm.offset().top
            }, 500);
        },

        _onclickExistingMortgagesSaveCancel: function(el) {
            const $existingMortgagesForm = $('.existing_mortgages_form');
            const $existingMortgagesContainer = $('.existing-mortgages-container');

            if ($(el.currentTarget).hasClass('btn-save-existing-mortgages')) {
                const existingMortgagesId = $existingMortgagesForm.find('#existing_mortgages_id').val();

                // Helper function to get display text from select options
                const getSelectDisplayText = (selector, value) => {
                    const option = $existingMortgagesForm.find(`${selector} option[value="${value}"]`);
                    return option.length ? option.text() : value;
                };

                // Extract field values from the form
                const belongsTo = $existingMortgagesForm.find('input[name="belongs-to-em"]').is(':checked');
                const propertyAddress = $existingMortgagesForm.find('textarea[id="your-properties-address"]').val();
                const usage = $existingMortgagesForm.find('select[name="property_usage_yep"]').val();
                const usageDisplay = getSelectDisplayText('select[name="property_usage_yep"]', usage);
                const ownershipOfDeed = $existingMortgagesForm.find('select[name="ownership_of_deed"]').val();
                const ownershipOfDeedDisplay = getSelectDisplayText('select[name="ownership_of_deed"]', ownershipOfDeed);
                const currentPropertyValuation = $existingMortgagesForm.find('input[name="current_property_valuation"]').val();
                const outstandingMortgageAmount = $existingMortgagesForm.find('input[name="outstanding_mortgage_amount"]').val();
                const monthlyPayment = $existingMortgagesForm.find('input[name="monthly_payment"]').val();
                const lender = $existingMortgagesForm.find('select[name="lender_name"]').val();
                const accountNo = $existingMortgagesForm.find('input[name="account_no"]').val();
                const rateType = $existingMortgagesForm.find('select[name="rate_type"]').val();
                const currentRate = $existingMortgagesForm.find('input[name="current_rate"]').val();
                const remainingTerm = $existingMortgagesForm.find('input[name="remaining_term"]').val();
                const repaymentMethod = $existingMortgagesForm.find('select[name="repayment_method"]').val();
                const remortgageDate = $existingMortgagesForm.find('input[name="remortgage_date"]').val();
                const mortgageCaseNumber = $existingMortgagesForm.find('input[name="mortgage_case_number"]').val();
                const propertyPurchasedDate = $existingMortgagesForm.find('input[name="property_purchased_date"]').val();
                const propertyPurchasedPrice = $existingMortgagesForm.find('input[name="property_purchased_price"]').val();

                this._rpc({
                    route: '/update/fact-find/existing-mortgages',
                    params: {
                        fact_find_id: this.factFindId,
                        data: {
                            existing_mortgages_id: existingMortgagesId,
                            belongs_to: belongsTo,
                            property_address: propertyAddress,
                            usage: usage,
                            ownership_of_deed: ownershipOfDeed,
                            current_property_valuation: currentPropertyValuation,
                            outstanding_mortgage_amount: outstandingMortgageAmount,
                            monthly_payment: monthlyPayment,
                            lender: lender,
                            account_no: accountNo,
                            rate_type: rateType,
                            current_rate: currentRate,
                            remaining_term: remainingTerm,
                            repayment_method: repaymentMethod,
                            remortgage_date: remortgageDate,
                            mortgage_case_number: mortgageCaseNumber,
                            property_purchased_date: propertyPurchasedDate,
                            property_purchased_price: propertyPurchasedPrice,
                        }
                    }
                }).then((response) => {
                    if (response.status === 'success') {
                        if (existingMortgagesId === 'new-existing-mortgages') {
                            // Add new card for created record
                            $existingMortgagesContainer.append(`
                                <div class="existing-mortgages-card">
                                    <div class="edit-delete">
                                        <i class="fa fa-pencil fa-lg existing-mortgages-actions" data-type="edit" data-existing-mortgages-id="${response.mortgage_id}"/>
                                        <i class="fa fa-trash fa-lg existing-mortgages-actions" data-type="delete" data-existing-mortgages-id="${response.mortgage_id}"/>
                                    </div>
                                    <p>Property Usage:
                                        <span class="existing-mortgages-info">${usageDisplay || ''}</span>
                                    </p>
                                    <p>Ownership of the Deed:
                                        <span class="existing-mortgages-info">${ownershipOfDeedDisplay || ''}</span>
                                    </p>
                                    <p>Property Address:
                                        <span class="existing-mortgages-info">${propertyAddress || ''}</span>
                                    </p>
                                </div>
                            `);
                        } else {
                            // Update existing card
                            const $existingCard = $(`.existing-mortgages-actions[data-existing-mortgages-id="${existingMortgagesId}"]`).closest('.existing-mortgages-card');
                            $existingCard.find('.existing-mortgages-info').eq(0).text(usageDisplay || '');
                            $existingCard.find('.existing-mortgages-info').eq(1).text(ownershipOfDeedDisplay || '');
                            if ($existingCard.find('.existing-mortgages-info').length > 2) {
                                $existingCard.find('.existing-mortgages-info').eq(2).text(propertyAddress || '');
                            }
                        }
                    } else {
                        console.error('Error saving existing mortgage:', response.message);
                        alert('Error saving existing mortgage: ' + response.message);
                    }
                }).catch((error) => {
                    console.error('Error saving existing mortgage:', error);
                    alert('Error saving existing mortgage');
                });
            }

            // Hide form and show main content
            $existingMortgagesForm.addClass('d-none').fadeOut(400);
            $existingMortgagesContainer.removeClass('d-none').fadeIn(400);
        },


        //employment
        _onclickEmploymentDetailsSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Add Employment Details
            const self = this;
            this._rpc({
                route: '/get/ff/employment-details',
                params: {
                    'employment_details_id': this.factFindId
                }
            }).then((employmentDetailsData) => {
                let employmentDetailsHistoryDetailsContent = '';
                $.each(employmentDetailsData, function(index, employmentDetail) {
                    employmentDetailsHistoryDetailsContent += `
                        <div class="employment-details-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg employment-details-actions" data-type="edit" data-employment-details-id="${employmentDetail.employment_details_id}"/>
                                <i class="fa fa-trash fa-lg employment-details-actions" data-type="delete" data-employment-details-id="${employmentDetail.employment_details_id}"/>
                            </div>
                            <p>NI Number:
                                <span class="employment-details-info">${employmentDetail.ni_number || ''}</span>
                            </p>
                            <p>Occupation:
                                <span class="employment-details-info">${employmentDetail.occupation || ''}</span>
                            </p>
                            <p>Employer:
                                <span class="employment-details-info">${employmentDetail.employer_name || ''}</span>
                            </p>
                            <p>Start Date:
                                <span class="employment-details-info">${employmentDetail.start_date || ''}</span>
                            </p>
                            <p>End Date:
                                <span class="employment-details-info">${employmentDetail.end_date || ''}</span>
                            </p>
                        </div>
                    `;
                });
                $('.employment-details-container').html(employmentDetailsHistoryDetailsContent);

                // Note: Edit and delete actions should be bound to _onclickUpdateEmploymentDetailsActions
            });
        },

        _onclickEmploymentDetailsAdd: function(ev) {
            const $employmentDetailsForm = $('.employment-details-form');
            // Target the form and reset all input fields
            $employmentDetailsForm.find('input[type="text"], input[type="number"], select, textarea').val('');
            $employmentDetailsForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new employment details record
            $employmentDetailsForm.find('#employment_details_id').val('new-employment-details');
            $employmentDetailsForm.removeClass('d-none').fadeIn(400);
        },

        _onclickEmpDetailCancel: function(el){
            $('.employment-details-form').addClass('d-none').fadeOut(400);
        },


        _onclickEmploymentDetailsSaveCancel: function(el) {
            const self = this; // ✅ Preserve context
            const $employmentDetailsForm = $('.employment-details-form');

            // If Cancel button clicked
            if ($(el.currentTarget).hasClass('btn-employment-cancel')) {
                $employmentDetailsForm.addClass('d-none').fadeOut(400);
                return;
            }

            // If Save button clicked
            if ($(el.currentTarget).hasClass('btn-employment-save')) {
                const employmentDetailsId = $employmentDetailsForm.find('#employment_details_id').val();
                const isNewEmployment = employmentDetailsId === 'new-employment-details';

                // Hide form and show employment details container
                $employmentDetailsForm.addClass('d-none').fadeOut(400);
                const $employmentDetailsContainer = $('.employment-details-container');
                $employmentDetailsContainer.removeClass('d-none').fadeIn(400);

                // Extract form values
                const niNumber = $employmentDetailsForm.find('input[name="ni_number"]').val();
                const occupation = $employmentDetailsForm.find('input[name="occupation"]').val();
                const employerName = $employmentDetailsForm.find('input[name="employer_name"]').val();
                const employmentStatus = $employmentDetailsForm.find('select[name="employment-status"]').val();
                const employmentBasis = $employmentDetailsForm.find('select[name="employment_basis"]').val();
                const monthlySalary = $employmentDetailsForm.find('input[name="monthly_gross_salary"]').val();
                const annualSalary = $employmentDetailsForm.find('input[name="annual_salary"]').val();
                const startDate = $employmentDetailsForm.find('input[name="start_date"]').val();
                const endDate = $employmentDetailsForm.find('input[name="end_date"]').val();

                // Collect all form data
                const formData = {
                    employment_details_id: employmentDetailsId,
                    ni_number: niNumber,
                    anticipated_retirement_age: $employmentDetailsForm.find('input[name="anticipated_retirement_age"]').val(),
                    employment_basis: employmentBasis,
                    employment_status: employmentStatus,
                    occupation: occupation,
                    occupation_sector: $employmentDetailsForm.find('select[name="occupation_sector"]').val(),
                    occupation_type: $employmentDetailsForm.find('select[name="occupation_sector_type"]').val(),
                    employment_type: $employmentDetailsForm.find('select[name="employment_type"]').val(),
                    employer_name: employerName,
                    address_of_working_place: $employmentDetailsForm.find('textarea[name="address_of_working_place"]').val(),
                    work_telephone: $employmentDetailsForm.find('input[name="work_telephone"]').val(),
                    start_date: startDate,
                    end_date: endDate,
                    current_contract_start_date: $employmentDetailsForm.find('input[name="current_contract_start_date"]').val(),
                    current_contract_end_date: $employmentDetailsForm.find('input[name="current_contract_end_date"]').val(),
                    years_of_experience_contract_basis: $employmentDetailsForm.find('input[name="years_of_experience_contract_basis"]').val(),
                    monthly_gross_salary: monthlySalary,
                    annual_bonus: $employmentDetailsForm.find('input[name="annual_bonus"]').val(),
                    annual_salary: annualSalary,
                    is_current_employment: $employmentDetailsForm.find('input[name="is_current_employment"]').is(':checked'),
                    has_deductions: $employmentDetailsForm.find('input[name="has_deductions"]').is(':checked'),
                    student_loans: $employmentDetailsForm.find('input[name="student_loans"]').val(),
                    post_graduate_loan: $employmentDetailsForm.find('input[name="post_graduate_loan"]').val(),
                    gym_membership: $employmentDetailsForm.find('input[name="gym_membership"]').val(),
                    childcare: $employmentDetailsForm.find('input[name="childcare"]').val(),
                    other: $employmentDetailsForm.find('input[name="other"]').val(),
                };

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/employment-details',
                    params: {
                        fact_find_id: this.factFindId,
                        employment_details_id: employmentDetailsId,
                        data: formData
                    }
                }).then((response) => {
                    if (response.success) {
                        if (isNewEmployment) {
                            // Add new employment card
                            $employmentDetailsContainer.append(`
                        <div class="employment-details-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg employment-details-actions" data-type="edit" data-employment-details-id="${response.employment_details_id}"></i>
                                <i class="fa fa-trash fa-lg employment-details-actions" data-type="delete" data-employment-details-id="${response.employment_details_id}"></i>
                            </div>
                            <p>NI Number:
                                <span class="employment-details-info">${niNumber || ''}</span>
                            </p>
                            <p>Occupation:
                                <span class="employment-details-info">${occupation || ''}</span>
                            </p>
                            <p>Employer:
                                <span class="employment-details-info">${employerName || ''}</span>
                            </p>
                            <p>Start Date:
                                <span class="employment-details-info">${startDate || ''}</span>
                            </p>
                            <p>End Date:
                                <span class="employment-details-info">${endDate || ''}</span>
                            </p>
                        </div>
                    `);
                        } else {
                            // Update existing employment card
                            const $existingCard = $(`.employment-details-card:has(i[data-employment-details-id="${employmentDetailsId}"])`);
                            if ($existingCard.length) {
                                $existingCard.find('.employment-details-info').eq(0).text(niNumber || '');
                                $existingCard.find('.employment-details-info').eq(1).text(occupation || '');
                                $existingCard.find('.employment-details-info').eq(2).text(employerName || '');
                                $existingCard.find('.employment-details-info').eq(3).text(startDate);
                                $existingCard.find('.employment-details-info').eq(4).text(endDate);
                            }
                        }

                        // Optional: Show success message
                        // console.log('Employment details saved successfully!');

                    } else {
                        alert('Error saving employment details: ' + (response.error || 'Unknown error'));
                    }
                }).catch((error) => {
                    console.error('Error saving employment details:', error);
                    alert('Error saving employment details. Please try again.');
                });
            }
        },

        _onchangeEmploymentStatus: function(ev) {
            const employmentStatus = $(ev.target).val();
            const $employmentDetailsForm = $('.employment-details-form');
            const $retiredSection = $('.retired');
            const $employmentDetailsSection = $('.employment-details');
            const self = this;

            console.log('Employment status changed to:', employmentStatus);

            // Hide all sections first
            $employmentDetailsForm.addClass('d-none');
            $retiredSection.addClass('d-none');
            $employmentDetailsSection.addClass('d-none');

            // Show relevant section based on status
            if (employmentStatus === 'employed') {
//                $employmentDetailsForm.removeClass('d-none');
                $employmentDetailsSection.removeClass('d-none');
            } else if (employmentStatus === 'retired') {
                $retiredSection.removeClass('d-none');
                // Load existing retirement income data
                this._loadRetirementIncomeData();
            }
            // For other statuses (self_employed, house_person), keep sections hidden

            // Save employment status to backend if factFindId exists and status is selected
            if (this.factFindId && employmentStatus) {
                console.log('Saving employment status to backend:', employmentStatus);

                this._rpc({
                    route: '/update/fact-find/employment-status',
                    params: {
                        fact_find_id: this.factFindId,
                        data: {
                            employment_status: employmentStatus
                        }
                    }
                }).then((response) => {
                    if (response.success) {
                        console.log('Employment status saved successfully:', response.employment_status);
                    } else {
                        console.error('Error saving employment status:', response.error);
                        // Optionally show user notification
                        // alert('Error saving employment status: ' + response.error);
                    }
                }).catch((error) => {
                    console.error('RPC Error saving employment status:', error);
                    // Optionally show user notification
                    // alert('Error saving employment status. Please try again.');
                });
            }
        },

        _onchangeGrossMonthlyRetirementIncome: function(ev) {
            const monthlyIncomeValue = $(ev.target).val();
            const monthlyIncome = parseFloat(monthlyIncomeValue) || 0;

            // Validate input
            if (monthlyIncome < 0) {
                $(ev.target).val('');
                $('#annual_retirement_income').val('');
                this._showNotification('Monthly income cannot be negative', 'warning', 2500);
                return;
            }

            const annualIncome = monthlyIncome * 12;
            $('#annual_retirement_income').val(annualIncome.toFixed(2));

            console.log('Monthly income changed:', monthlyIncome, 'Annual:', annualIncome);
        },

        _showNotification: function(message, type = 'success', duration = 3000) {
            // Remove any existing notifications
            $('.themed-notification').remove();

            // Create notification with themed styling
            const iconMap = {
                success: '<i class="fa fa-check-circle me-2"></i>',
                error: '<i class="fa fa-exclamation-triangle me-2"></i>',
                warning: '<i class="fa fa-exclamation-circle me-2"></i>',
                info: '<i class="fa fa-info-circle me-2"></i>'
            };

            const colorMap = {
                success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
            };

            const $notification = $(`
                <div class="themed-notification" style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${colorMap[type] || colorMap.info};
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    font-weight: 500;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                ">
                    ${iconMap[type] || iconMap.info}
                    <span>${message}</span>
                </div>
            `);

            $('body').append($notification);

            // Auto-remove after duration
            setTimeout(() => {
                $notification.css({
                    animation: 'slideOutRight 0.3s ease-in',
                    opacity: '0',
                    transform: 'translateX(100%)'
                });
                setTimeout(() => $notification.remove(), 300);
            }, duration);
        },

        _onclickSaveRetirementIncome: function(ev) {
            ev.preventDefault();
            const self = this;

            console.log('Save retirement income clicked, factFindId:', this.factFindId);

            // Check if factFindId exists
            if (!this.factFindId) {
                this._showNotification('No fact find ID available. Please refresh the page and try again.', 'error', 4000);
                console.error('No factFindId available');
                return;
            }

            // Get and validate monthly income
            const monthlyIncomeValue = $('#gross_monthly_retirement_income').val();
            const monthlyIncome = parseFloat(monthlyIncomeValue);

            console.log('Monthly income value:', monthlyIncomeValue, 'Parsed:', monthlyIncome);

            // Validation
            if (!monthlyIncomeValue || monthlyIncomeValue.trim() === '') {
                this._showNotification('Please enter a gross monthly retirement income.', 'warning', 3000);
                $('#gross_monthly_retirement_income').focus();
                return;
            }

            if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
                this._showNotification('Please enter a valid positive number for gross monthly retirement income.', 'warning', 3000);
                $('#gross_monthly_retirement_income').focus();
                return;
            }

            // Prepare retirement data
            const retirementData = {
                gross_monthly_retirement_income: monthlyIncome
            };

            console.log('Retirement data to save:', retirementData);

            // Show loading state
            const $saveButton = $('.btn-save-retirement-income, .btn-save-retirement-data');
            const originalText = $saveButton.html();
            $saveButton.html('<i class="fa fa-spinner fa-spin me-2"></i>Saving...').prop('disabled', true);

            // Send data to backend
            this._rpc({
                route: '/update/fact-find/retirement-income',
                params: {
                    fact_find_id: this.factFindId,
                    data: retirementData
                }
            }).then((response) => {
                console.log('RPC Response:', response);

                // Reset button state
                $saveButton.html(originalText).prop('disabled', false);

                if (response.success) {
                    // Update the annual income field with computed value
                    const annualIncome = response.annual_retirement_income || (monthlyIncome * 12);
                    $('#annual_retirement_income').val(annualIncome.toFixed(2));

                    // Show success notification
                    self._showNotification('Retirement income saved successfully!', 'success', 3000);
                    console.log('Retirement income saved successfully');

                } else {
                    console.error('Backend error:', response.error);
                    self._showNotification('Error saving retirement income: ' + (response.error || 'Unknown error'), 'error', 4000);
                }
            }).catch((error) => {
                console.error('RPC Error:', error);

                // Reset button state
                $saveButton.html(originalText).prop('disabled', false);

                self._showNotification('Error saving retirement income. Please check your connection and try again.', 'error', 4000);
            });
        },

        _onclickSaveRetirementData: function(ev) {
            this._onclickSaveRetirementIncome(ev);
        },

        _loadRetirementIncomeData: function() {
            const self = this;

            console.log('Loading retirement income data for factFindId:', this.factFindId);

            if (!this.factFindId) {
                console.warn('No fact find ID available for loading retirement data');
                return;
            }

            // Show loading indicator
            $('.retired').addClass('loading');

            this._rpc({
                route: '/get/fact-find/retirement-income',
                params: {
                    fact_find_id: this.factFindId
                }
            }).then((data) => {
                console.log('Loaded retirement income data:', data);

                // Remove loading indicator
                $('.retired').removeClass('loading');

                if (data.success) {
                    const monthlyIncome = data.gross_monthly_retirement_income || '';
                    const annualIncome = data.annual_retirement_income || '';

                    $('#gross_monthly_retirement_income').val(monthlyIncome);
                    $('#annual_retirement_income').val(annualIncome);

                    console.log('Populated retirement form with:', {
                        monthly: monthlyIncome,
                        annual: annualIncome
                    });
                } else {
                    console.error('Error loading retirement income:', data.error);
                    // Don't show alert for loading errors, just log them
                }
            }).catch((error) => {
                console.error('RPC Error loading retirement income:', error);
                $('.retired').removeClass('loading');
            });
        },

        _validateRetirementForm: function() {
            const monthlyIncome = $('#gross_monthly_retirement_income').val();

            if (!monthlyIncome || monthlyIncome.trim() === '') {
                alert('Please enter a gross monthly retirement income.');
                $('#gross_monthly_retirement_income').focus();
                return false;
            }

            const parsedIncome = parseFloat(monthlyIncome);
            if (isNaN(parsedIncome) || parsedIncome <= 0) {
                alert('Please enter a valid positive number for gross monthly retirement income.');
                $('#gross_monthly_retirement_income').focus();
                return false;
            }

            return true;
        },

        _onclickCancelRetirement: function(ev) {
            ev.preventDefault();

            // Reset form fields
            $('#gross_monthly_retirement_income').val('');
            $('#annual_retirement_income').val('');

            // Hide success/error messages
            $('#retirement-success-message').addClass('d-none');
            $('#retirement-error-message').addClass('d-none');

            // Optionally hide the retired section
            // $('.retired').addClass('d-none');

            console.log('Retirement form cancelled and reset');
        },

        _onclickSaveAndContinueEmployment: function(ev) {
            ev.preventDefault();
            const self = this;

            // Get the current employment status value
            const employmentStatus = $('select[name="employment-status"]').val();

            console.log('Save and Continue clicked - Employment Status:', employmentStatus);

            // Validate that employment status is selected
            if (!employmentStatus || employmentStatus.trim() === '') {
                alert('Please select an employment status before continuing.');
                $('select[name="employment-status"]').focus();
                return;
            }

            // Check if factFindId exists
            if (!this.factFindId) {
                alert('Error: No fact find ID available. Please refresh the page and try again.');
                console.error('No factFindId available');
                return;
            }

            // Show loading state on button
            const $saveButton = $(ev.currentTarget);
            const originalText = $saveButton.html();
            $saveButton.html('Saving... <i class="fa fa-spinner fa-spin ms-1"></i>').prop('disabled', true);

            // Save employment status to backend
            this._rpc({
                route: '/update/fact-find/employment-status',
                params: {
                    fact_find_id: this.factFindId,
                    data: {
                        employment_status: employmentStatus
                    }
                }
            }).then((response) => {
                console.log('Employment status save response:', response);

                // Reset button state
                $saveButton.html(originalText).prop('disabled', false);

                if (response.success) {
                    console.log('Employment status saved successfully:', response.employment_status);

                    // Show success message (optional)
                    // alert('Employment status saved successfully!');

                    // You can add logic here to navigate to the next section
                    // For example, if you have a function to show the next section:
                    // this._showNextSection();

                    // Or trigger the employment status change to show relevant sections
                    this._onchangeEmploymentStatus({
                        target: $('select[name="employment-status"]')[0]
                    });

                } else {
                    console.error('Backend error:', response.error);
                    alert('Error saving employment status: ' + (response.error || 'Unknown error'));
                }
            }).catch((error) => {
                console.error('RPC Error:', error);

                // Reset button state
                $saveButton.html(originalText).prop('disabled', false);

                alert('Error saving employment status. Please check your connection and try again.');
            });
        },


        // Insurance Provider
        getDisplayName: function(field, value) {
            const displayMappings = {
                'insurance_provider': {
                    'zurich': 'Zurich',
                    'aviva': 'Aviva',
                    'lv': 'LV',
                    'legal_general': 'Legal & General',
                    'guardian': 'Guardian',
                    'vitality': 'Vitality',
                    'the_exeter': 'The Exeter',
                    'royal_london': 'Royal London',
                    'other': 'Other'
                },
                'protection_type': {
                    'life_cover': 'Life Cover Only',
                    'critical_illness': 'Critical Illness Cover Only',
                    'life_and_cic': 'Both Life & Critical Illness Cover',
                    'income_protection': 'Income Protection',
                    'family_income_benefit': 'Family Income Benefit',
                    'accident_cover': 'Accident Cover',
                    'other': 'Other'
                }
            };
            return displayMappings[field] && displayMappings[field][value] ? displayMappings[field][value] : value;
        },

        _onclickProtectionDetailsSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Add Protection Details
            const self = this;
            this._rpc({
                route: '/get/ff/protection-details',
                params: {
                    'protection_details_id': this.factFindId
                }
            }).then((protectionDetailsData) => {
                let protectionDetailsHistoryDetailsContent = '';
                $.each(protectionDetailsData, function(index, protectionDetail) {
                    protectionDetailsHistoryDetailsContent += `
                        <div class="protection-details-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg protection-details-actions" data-type="edit" data-protection-details-id="${protectionDetail.protection_details_id}"/>
                                <i class="fa fa-trash fa-lg protection-details-actions" data-type="delete" data-protection-details-id="${protectionDetail.protection_details_id}"/>
                            </div>
                            <p>Insurance Provider:
                                <span class="protection-details-info">${self.getDisplayName('insurance_provider', protectionDetail.insurance_provider)}</span>
                            </p>
                            <p>Monthly Premium:
                                <span class="protection-details-info">${protectionDetail.monthly_premium}</span>
                            </p>
                            <p>Protection Type:
                                <span class="protection-details-info">${self.getDisplayName('protection_type', protectionDetail.protection_type)}</span>
                            </p>
                        </div>
                    `;
                });
                $('.protection-details-container').html(protectionDetailsHistoryDetailsContent);
            });
        },

        _onclickProtectionDetailsAdd: function(ev) {
            const $protectionDetailsForm = $('.protection-details-form');
            // Target the form and reset all input fields
            $protectionDetailsForm.find('input[type="text"], input[type="number"], select').val('');
            $protectionDetailsForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new protection details record
            $protectionDetailsForm.find('#protection_details_id').val('new-protection-details');
            $protectionDetailsForm.removeClass('d-none').fadeIn(400);
        },

        _onclickProtectionDetailsSaveCancel: function(el) {
            const $protectionDetailsForm = $('.protection-details-form');
            const $protectionDetailsHistoryDetails = $('.protection-details');

            // If Save button clicked
            if ($(el.currentTarget).hasClass('btn-protection-details-save')) {
                // Validate that factFindId is set
                if (!this.factFindId) {
                    console.error('Fact Find ID is not set');
                    return;
                }

                // Gather protection details data
                const insuranceProvider = $protectionDetailsForm.find('select[name="insurance_provider"]').val();
                const monthlyPremium = $protectionDetailsForm.find('input[name="monthly_premium"]').val();
                const protectionType = $protectionDetailsForm.find('select[name="protection_type"]').val();
                const protectionDetailsId = $protectionDetailsForm.find('#protection_details_id').val();

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/protection-details',
                    params: {
                        fact_find_id: this.factFindId, // Make sure this is passed
                        protection_details_id: protectionDetailsId,
                        data: {
                            insurance_provider: insuranceProvider,
                            monthly_premium: monthlyPremium,
                            protection_type: protectionType,
                        }
                    }
                }).then((result) => {
                    if (result.success) {
                        // If creating a new record, add it to the UI
                        if (protectionDetailsId === 'new-protection-details') {
                            $('.protection-details > div.button-group').before(`
                                <div class="protection-details-card">
                                    <div class="edit-delete">
                                        <i class="fa fa-pencil fa-lg protection-details-actions" data-type="edit" data-protection-details-id="${result.protection_details_id}"/>
                                        <i class="fa fa-trash fa-lg protection-details-actions" data-type="delete" data-protection-details-id="${result.protection_details_id}"/>
                                    </div>
                                    <p>Insurance Provider:
                                        <span class="protection-details-info">${this.getDisplayName('insurance_provider', insuranceProvider)}</span>
                                    </p>
                                    <p>Monthly Premium:
                                        <span class="protection-details-info">${monthlyPremium}</span>
                                    </p>
                                    <p>Protection Type:
                                        <span class="protection-details-info">${this.getDisplayName('protection_type', protectionType)}</span>
                                    </p>
                                </div>
                            `);
                        } else {
                            // If updating, refresh the display by reloading the protection details
                            this._rpc({
                                route: '/get/ff/protection-details',
                                params: {
                                    'protection_details_id': this.factFindId
                                }
                            }).then((protectionDetailsData) => {
                                let protectionDetailsHistoryDetailsContent = '';
                                const self = this;
                                $.each(protectionDetailsData, function(index, protectionDetail) {
                                    protectionDetailsHistoryDetailsContent += `
                                        <div class="protection-details-card">
                                            <div class="edit-delete">
                                                <i class="fa fa-pencil fa-lg protection-details-actions" data-type="edit" data-protection-details-id="${protectionDetail.protection_details_id}"/>
                                                <i class="fa fa-trash fa-lg protection-details-actions" data-type="delete" data-protection-details-id="${protectionDetail.protection_details_id}"/>
                                            </div>
                                            <p>Insurance Provider:
                                                <span class="protection-details-info">${self.getDisplayName('insurance_provider', protectionDetail.insurance_provider)}</span>
                                            </p>
                                            <p>Monthly Premium:
                                                <span class="protection-details-info">${protectionDetail.monthly_premium}</span>
                                            </p>
                                            <p>Protection Type:
                                                <span class="protection-details-info">${self.getDisplayName('protection_type', protectionDetail.protection_type)}</span>
                                            </p>
                                        </div>
                                    `;
                                });
                                $('.protection-details-container').html(protectionDetailsHistoryDetailsContent);
                            });
                        }
                    } else if (result.error) {
                        console.error('Error saving protection details:', result.error);
                        // You can add user notification here
                    }
                }).catch((error) => {
                    console.error('RPC Error:', error);
                });
            }

            $protectionDetailsForm.addClass('d-none').fadeOut(400);
            $protectionDetailsHistoryDetails.removeClass('d-none').fadeIn(400);
        },


        //Health Conditions
        getHealthConditionDisplayName: function(field, value) {
            const displayMappings = {
                'reported': {
                    'yes': 'Yes',
                    'no': 'No'
                },
                'waiting_referral': {
                    'yes': 'Yes',
                    'no': 'No'
                },
                'currently_taking_medicine': {
                    true: 'Yes',
                    false: 'No'
                }
            };
            return displayMappings[field] && displayMappings[field][value] ? displayMappings[field][value] : value;
        },

        _onclickHealthConditionsSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Add Health Conditions
            const self = this;
            this._rpc({
                route: '/get/ff/health-conditions',
                params: {
                    'health_condition_id': this.factFindId
                }
            }).then((healthConditionsData) => {
                let healthConditionsHistoryDetailsContent = '';
                $.each(healthConditionsData, function(index, healthCondition) {
                    healthConditionsHistoryDetailsContent += `
                        <div class="health-condition-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg health-condition-actions" data-type="edit" data-health-condition-id="${healthCondition.health_condition_id}"/>
                                <i class="fa fa-trash fa-lg health-condition-actions" data-type="delete" data-health-condition-id="${healthCondition.health_condition_id}"/>
                            </div>
                            <p>Condition:
                                <span class="health-condition-info">${healthCondition.details || 'N/A'}</span>
                            </p>
                            <p>Diagnosed Date:
                                <span class="health-condition-info">${healthCondition.diagnosed_date || 'N/A'}</span>
                            </p>
                            <p>Last Review:
                                <span class="health-condition-info">${healthCondition.last_review_date || 'N/A'}</span>
                            </p>

                        </div>
                    `;
                });
                $('.health-conditions-container').html(healthConditionsHistoryDetailsContent);
            });
        },

        _onclickHealthConditionsAdd: function(ev) {
            const $healthConditionsForm = $('.form-health-conditions');
            $healthConditionsForm.find('input, select, textarea').each(function() {
                $(this).val('');
            });
            $healthConditionsForm.find('input[type="checkbox"]').prop('checked', false);
            // Reset hidden field for new health condition record
            $healthConditionsForm.find('#health_condition_id').val('new-health-condition');
            $healthConditionsForm.removeClass('d-none').fadeIn(400);
        },

        _onclickHealthConditionsSaveCancel: function(el) {
            const $healthConditionsForm = $('.form-health-conditions');
            const $healthConditionsHistoryDetails = $('.health-conditions');

            // If Save button clicked
            if ($(el.currentTarget).hasClass('btn-health-conditions-save')) {
                // Validate that factFindId is set
                if (!this.factFindId) {
                    console.error('Fact Find ID is not set');
                    return;
                }

                // Gather health condition data
                const reported = $healthConditionsForm.find('select[name="reported"]').val();
                const details = $healthConditionsForm.find('input[name="health_condition_details"]').val();
                const diagnosedDate = $healthConditionsForm.find('input[name="diagnosed_date"]').val();
                const lastReviewDate = $healthConditionsForm.find('input[name="last_review_date"]').val();
                const lastEpisodeDate = $healthConditionsForm.find('input[name="last_episode_date"]').val();
                const nextReviewDate = $healthConditionsForm.find('input[name="next_review_date"]').val();
                const waitingReferral = $healthConditionsForm.find('select[name="gp_hospital_referral"]').val();
                const medicineCount = $healthConditionsForm.find('input[name="medicine_count"]').val();
                const currentlyTakingMedicine = $healthConditionsForm.find('select[name="currently_taking_medicine"]').is(':checked');
                const healthConditionId = $healthConditionsForm.find('#health_condition_id').val();

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/health-conditions',
                    params: {
                        fact_find_id: this.factFindId,
                        health_condition_id: healthConditionId,
                        data: {
                            reported: reported,
                            details: details,
                            diagnosed_date: diagnosedDate,
                            last_review_date: lastReviewDate,
                            last_episode_date: lastEpisodeDate,
                            next_review_date: nextReviewDate,
                            waiting_referral: waitingReferral,
                            medicine_count: medicineCount,
                            currently_taking_medicine: currentlyTakingMedicine,
                        }
                    }
                }).then((result) => {
                    if (result.success) {
                        // If creating a new record, add it to the UI
                        if (healthConditionId === 'new-health-condition') {
                            $('.health-conditions > div.button-group').before(`
                                <div class="health-condition-card">
                                    <div class="edit-delete">
                                        <i class="fa fa-pencil fa-lg health-condition-actions" data-type="edit" data-health-condition-id="${result.health_condition_id}"/>
                                        <i class="fa fa-trash fa-lg health-condition-actions" data-type="delete" data-health-condition-id="${result.health_condition_id}"/>
                                    </div>
                                    <p>Condition:
                                        <span class="health-condition-info">${details || 'N/A'}</span>
                                    </p>
                                    <p>Diagnosed Date:
                                        <span class="health-condition-info">${diagnosedDate || 'N/A'}</span>
                                    </p>
                                    <p>Last Review:
                                        <span class="health-condition-info">${lastReviewDate || 'N/A'}</span>
                                    </p>

                                </div>
                            `);
                        } else {
                            // If updating, refresh the display
                            this._rpc({
                                route: '/get/ff/health-conditions',
                                params: {
                                    'health_condition_id': this.factFindId
                                }
                            }).then((healthConditionsData) => {
                                let healthConditionsHistoryDetailsContent = '';
                                const self = this;
                                $.each(healthConditionsData, function(index, healthCondition) {
                                    healthConditionsHistoryDetailsContent += `
                                        <div class="health-condition-card">
                                            <div class="edit-delete">
                                                <i class="fa fa-pencil fa-lg health-condition-actions" data-type="edit" data-health-condition-id="${healthCondition.health_condition_id}"/>
                                                <i class="fa fa-trash fa-lg health-condition-actions" data-type="delete" data-health-condition-id="${healthCondition.health_condition_id}"/>
                                            </div>
                                            <p>Condition:
                                                <span class="health-condition-info">${healthCondition.details || 'N/A'}</span>
                                            </p>
                                            <p>Diagnosed Date:
                                                <span class="health-condition-info">${healthCondition.diagnosed_date || 'N/A'}</span>
                                            </p>
                                            <p>Last Review:
                                                <span class="health-condition-info">${healthCondition.last_review_date || 'N/A'}</span>
                                            </p>
                                            <p>Reported:
                                                <span class="health-condition-info">${self.getHealthConditionDisplayName('reported', healthCondition.reported)}</span>
                                            </p>
                                        </div>
                                    `;
                                });
                                $('.health-conditions-container').html(healthConditionsHistoryDetailsContent);
                            });
                        }
                    } else if (result.error) {
                        console.error('Error saving health condition:', result.error);
                    }
                }).catch((error) => {
                    console.error('RPC Error:', error);
                });
            }

            $healthConditionsForm.addClass('d-none').fadeOut(400);
            $healthConditionsHistoryDetails.removeClass('d-none').fadeIn(400);
        },

        _onclickUpdateHealthConditionActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let healthConditionId = parseInt($(el.currentTarget).attr('data-health-condition-id'));
            let $healthConditionsForm = $('.form-health-conditions');

            if (actionType === 'edit') {
                // Set the health condition ID in the form
                $healthConditionsForm.find('#health_condition_id').val(healthConditionId);

                // Fetch the health condition data
                this._rpc({
                    route: '/get/fact-find/health-condition',
                    params: {
                        health_condition_id: healthConditionId
                    }
                }).then((healthConditionData) => {
                    // Populate form with retrieved data
                    if (healthConditionData && healthConditionData.length > 0) {
                        const data = healthConditionData[0]; // Get the first record

                        // Populate select fields
                        if (data.reported) {
                            $healthConditionsForm.find('select[name="reported"]').val(data.reported);
                        }
                        if (data.waiting_referral) {
                            $healthConditionsForm.find('select[name="waiting_referral"]').val(data.waiting_referral);
                        }

                        // Populate input fields
                        $healthConditionsForm.find('input[name="health_condition_details"]').val(data.details || '');
                        $healthConditionsForm.find('input[name="diagnosed_date"]').val(data.diagnosed_date || '');
                        $healthConditionsForm.find('input[name="last_review_date"]').val(data.last_review_date || '');
                        $healthConditionsForm.find('input[name="last_episode_date"]').val(data.last_episode_date || '');
                        $healthConditionsForm.find('input[name="next_review_date"]').val(data.next_review_date || '');
                        $healthConditionsForm.find('input[name="medicine_count"]').val(data.medicine_count || '');

                        // Populate checkbox
                        $healthConditionsForm.find('input[name="currently_taking_medicine"]').prop('checked', data.currently_taking_medicine || false);
                    }

                    // Show the form and hide other health condition elements
                    const $healthConditionsHistoryDetails = $('.health-conditions');
                    $healthConditionsHistoryDetails.addClass('d-none').fadeOut(400);
                    $healthConditionsForm.removeClass('d-none').fadeIn(400);
                }).catch((error) => {
                    console.error('Error loading health condition for edit:', error);
                });
            } else if (actionType === 'delete') {
                // Delete the health condition
                this._rpc({
                    route: '/delete/fact-find/health-condition',
                    params: {
                        health_condition_id: healthConditionId
                    }
                }).then((result) => {
                    if (result.success) {
                        // Remove the card after deletion
                        $(el.currentTarget).closest('.health-condition-card').remove();
                    } else if (result.error) {
                        console.error('Error deleting health condition:', result.error);
                    }
                }).catch((error) => {
                    console.error('RPC Error:', error);
                });
            }
        },


        //Past Travels
        _onchangePastTravelsReported: function(el) {
            const selectedValue = $(el.currentTarget).val();
            const $pastTravelsSection = $('.past-travels');

            if (selectedValue === 'yes') {
                // Show the past travels section and load existing data
                $pastTravelsSection.removeClass('d-none').fadeIn(400);

                // Load existing past travels data
                if (this.factFindId) {
                    this._loadPastTravelsData();
                }
            } else if (selectedValue === 'no') {
                // Hide the past travels section
                $pastTravelsSection.addClass('d-none').fadeOut(400);
            }
        },

        _loadPastTravelsData: function() {
            const self = this;
            this._rpc({
                route: '/get/ff/past-travels',
                params: {
                    fact_find_id: this.factFindId
                }
            }).then((pastTravelsData) => {
                if (pastTravelsData.error) {
                    console.error('Error fetching past travels:', pastTravelsData.error);
                    return;
                }

                let pastTravelsHistoryDetailsContent = '';
                $.each(pastTravelsData, function(index, pastTravel) {
                    pastTravelsHistoryDetailsContent += `
                        <div class="past-travel-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg past-travel-actions" data-type="edit" data-past-travel-id="${pastTravel.past_travel_id}"/>
                                <i class="fa fa-trash fa-lg past-travel-actions" data-type="delete" data-past-travel-id="${pastTravel.past_travel_id}"/>
                            </div>
                            <p>Country:
                                <span class="past-travel-info">${pastTravel.country_name}</span>
                            </p>
                            <p>From:
                                <span class="past-travel-info">${pastTravel.travel_from_date}</span>
                            </p>
                            <p>To:
                                <span class="past-travel-info">${pastTravel.travel_to_date}</span>
                            </p>
                        </div>
                    `;
                });
                $('.past-travels-container').html(pastTravelsHistoryDetailsContent);
            }).catch((error) => {
                console.error('Error fetching past travels:', error);
            });
        },

        _onclickPastTravelsSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            $('.fact-find-header').html($(el.currentTarget).text());

            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            // Load past travels data when the section is loaded
            this._loadPastTravelsData();
        },

        _onclickPastTravelsAdd: function(ev) {
            const $pastTravelsForm = $('.form-past-travels');
            $pastTravelsForm.find('input[type="text"], input[type="date"], select').val('');
            $pastTravelsForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            $pastTravelsForm.find('#past_travel_id').val('new-past-travel');
            $pastTravelsForm.removeClass('d-none').fadeIn(400);

            // Hide the past travels section when adding new
            $('.past-travels').addClass('d-none').fadeOut(400);
        },

        _onclickPastTravelsSaveCancel: function(el) {
            const $pastTravelsForm = $('.form-past-travels');
            $pastTravelsForm.addClass('d-none').fadeOut(400);
            const $pastTravelsHistoryDetails = $('.past-travels');
            $pastTravelsHistoryDetails.removeClass('d-none').fadeIn(400);

            if ($(el.currentTarget).hasClass('btn-past-travels-save')) {
                // Gather past travel data
                const pastTravelId = $pastTravelsForm.find('#past_travel_id').val();
                const country = $pastTravelsForm.find('select[name="country_pt"]').val();
                const travelFromDate = $pastTravelsForm.find('input[name="travel_from_date"]').val();
                const travelToDate = $pastTravelsForm.find('input[name="travel_to_date"]').val();

                // Validate required fields
                if (!country || !travelFromDate || !travelToDate) {
                    alert('Please fill in all required fields');
                    return;
                }

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/past-travel',
                    params: {
                        fact_find_id: this.factFindId,
                        data: {
                            past_travel_id: pastTravelId,
                            country: country,
                            travel_from_date: travelFromDate,
                            travel_to_date: travelToDate,
                        }
                    }
                }).then((result) => {
                    if (result.error) {
                        console.error('Error saving past travel:', result.error);
                        alert('Error saving past travel: ' + result.error);
                        return;
                    }

                    // Refresh the past travels list to ensure all data is up-to-date
                    this._loadPastTravelsData();

                }).catch((error) => {
                    console.error('Error saving past travel:', error);
                    alert('Error saving past travel');
                });
            }
        },

        _onclickUpdatePastTravelActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let pastTravelId = parseInt($(el.currentTarget).attr('data-past-travel-id'));
            let $pastTravelsForm = $('.form-past-travels');

            if (actionType === 'edit') {
                $pastTravelsForm.find('#past_travel_id').val(pastTravelId);

                this._rpc({
                    route: '/get/fact-find/past-travel',
                    params: {
                        past_travel_id: pastTravelId
                    }
                }).then((pastTravelData) => {
                    if (pastTravelData.error) {
                        console.error('Error fetching past travel data:', pastTravelData.error);
                        alert('Error fetching past travel data: ' + pastTravelData.error);
                        return;
                    }

                    // Populate form fields with the retrieved data
                    $pastTravelsForm.find('select[name="country_pt"]').val(pastTravelData.country);
                    $pastTravelsForm.find('input[name="travel_from_date"]').val(pastTravelData.travel_from_date);
                    $pastTravelsForm.find('input[name="travel_to_date"]').val(pastTravelData.travel_to_date);

                    // Show the form and hide the details
                    $pastTravelsForm.removeClass('d-none').fadeIn(400);
                    $('.past-travels').addClass('d-none').fadeOut(400);
                }).catch((error) => {
                    console.error('RPC error:', error);
                    alert('Error loading past travel data');
                });
            }

            if (actionType === 'delete') {
                if (!confirm('Are you sure you want to delete this past travel record?')) {
                    return;
                }

                this._rpc({
                    route: '/delete/fact-find/past-travel',
                    params: {
                        past_travel_id: pastTravelId
                    }
                }).then((result) => {
                    if (result.error) {
                        console.error('Error deleting past travel:', result.error);
                        alert('Error deleting past travel: ' + result.error);
                        return;
                    }

                    // Refresh the past travels list
                    this._loadPastTravelsData();

                }).catch((error) => {
                    console.error('Error deleting past travel:', error);
                    alert('Error deleting past travel');
                });
            }
        },


        //Future Travels
        _onclickFutureTravelsSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            $('.fact-find-header').html($(el.currentTarget).text());

            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            const self = this;
            this._rpc({
                route: '/get/ff/future-travels',
                params: {
                    'future_travel_id': this.factFindId
                }
            }).then((futureTravelsData) => {
                let futureTravelsHistoryDetailsContent = '';
                $.each(futureTravelsData, function(index, futureTravel) {
                    futureTravelsHistoryDetailsContent += `
                        <div class="future-travel-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg future-travel-actions" data-type="edit" data-future-travel-id="${futureTravel.future_travel_id}"/>
                                <i class="fa fa-trash fa-lg future-travel-actions" data-type="delete" data-future-travel-id="${futureTravel.future_travel_id}"/>
                            </div>
                            <p>Country:
                                <span class="future-travel-info">${futureTravel.country_name}</span>
                            </p>
                            <p>From:
                                <span class="future-travel-info">${futureTravel.travel_from_date}</span>
                            </p>
                            <p>To:
                                <span class="future-travel-info">${futureTravel.travel_to_date}</span>
                            </p>
                        </div>
                    `;
                });
                $('.future-travels-container').html(futureTravelsHistoryDetailsContent);
            });
        },

        _onclickFutureTravelsAdd: function(ev) {
            const $futureTravelsForm = $('.form-future-travels');
            $futureTravelsForm.find('input[type="text"], input[type="date"], select').val('');
            $futureTravelsForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            $futureTravelsForm.find('#future_travel_id').val('new-future-travel');
            $futureTravelsForm.removeClass('d-none').fadeIn(400);
        },

        _onclickFutureTravelsSaveCancel: function(el) {
            const $futureTravelsForm = $('.form-future-travels');
            const futureTravelId = $futureTravelsForm.find('#future_travel_id').val();
            const isNewRecord = futureTravelId === 'new-future-travel';

            if ($(el.currentTarget).hasClass('btn-future-travels-save')) {
                // Gather future travel data
                const country = $futureTravelsForm.find('select[name="country_future"]').val();
                const travelFromDate = $futureTravelsForm.find('input[name="travel_from_date_future"]').val();
                const travelToDate = $futureTravelsForm.find('input[name="travel_to_date_future"]').val();

                // Validate required fields
                if (!country || !travelFromDate || !travelToDate) {
                    alert('Please fill in all required fields');
                    return;
                }

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/future-travel',
                    params: {
                        fact_find_id: this.factFindId,
                        future_travel_id: isNewRecord ? null : futureTravelId,
                        data: {
                            country: country,
                            travel_from_date: travelFromDate,
                            travel_to_date: travelToDate,
                        }
                    }
                }).then((result) => {
                    if (result.success) {
                        // Hide form and show list
                        $futureTravelsForm.addClass('d-none').fadeOut(400);
                        $('.future-travels').removeClass('d-none').fadeIn(400);

                        // Refresh the list to show updated data
                        this._onclickFutureTravelsSubItem({
                            currentTarget: $(`[data-id="${this.factFindId}"]`)
                        });
                    } else {
                        alert('Error saving future travel: ' + (result.error || 'Unknown error'));
                    }
                }).catch((error) => {
                    console.error('Error saving future travel:', error);
                    alert('Error saving future travel details');
                });
            } else {
                // Cancel - just hide form and show list
                $futureTravelsForm.addClass('d-none').fadeOut(400);
                $('.future-travels').removeClass('d-none').fadeIn(400);
            }
        },

        _onclickUpdateFutureTravelActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let futureTravelId = parseInt($(el.currentTarget).attr('data-future-travel-id'));
            let $futureTravelsForm = $('.form-future-travels');

            if (actionType === 'edit') {
                $futureTravelsForm.find('#future_travel_id').val(futureTravelId);

                this._rpc({
                    route: '/get/fact-find/future-travel',
                    params: {
                        future_travel_id: futureTravelId
                    }
                }).then((futureTravelData) => {
                    if (futureTravelData.error) {
                        alert('Error loading future travel data: ' + futureTravelData.error);
                        return;
                    }

                    // Populate form fields with the returned data
                    $.each(futureTravelData, function(selector, value) {
                        $futureTravelsForm.find(selector).val(value);
                    });

                    // Show form and hide list
                    $futureTravelsForm.removeClass('d-none').fadeIn(400);
                    $('.future-travels').addClass('d-none').fadeOut(400);
                }).catch((error) => {
                    console.error('Error loading future travel data:', error);
                    alert('Error loading future travel data');
                });
            }

            if (actionType === 'delete') {
                if (confirm('Are you sure you want to delete this future travel record?')) {
                    this._rpc({
                        route: '/delete/fact-find/future-travel',
                        params: {
                            future_travel_id: futureTravelId
                        }
                    }).then((result) => {
                        if (result.success) {
                            $(el.currentTarget).closest('.future-travel-card').fadeOut(400, function() {
                                $(this).remove();
                            });
                        } else {
                            alert('Error deleting future travel: ' + (result.error || 'Unknown error'));
                        }
                    }).catch((error) => {
                        console.error('Error deleting future travel:', error);
                        alert('Error deleting future travel record');
                    });
                }
            }
        },


        // Critical Illnesses
        _onclickCriticalIllnessesSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            $('.fact-find-header').html($(el.currentTarget).text());

            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            const self = this;
            this._rpc({
                route: '/get/ff/critical-illnesses',
                params: {
                    'critical_illness_id': this.factFindId
                }
            }).then((criticalIllnessesData) => {
                let criticalIllnessesHistoryDetailsContent = '';
                $.each(criticalIllnessesData, function(index, criticalIllness) {
                    criticalIllnessesHistoryDetailsContent += `
                        <div class="critical-illness-card">
                            <div class="edit-delete">
                                <i class="fa fa-pencil fa-lg critical-illness-actions" data-type="edit" data-critical-illness-id="${criticalIllness.critical_illness_id}"/>
                                <i class="fa fa-trash fa-lg critical-illness-actions" data-type="delete" data-critical-illness-id="${criticalIllness.critical_illness_id}"/>
                            </div>
                            <p>Relationship:
                                <span class="critical-illness-info">${criticalIllness.relationship}</span>
                            </p>
                            <p>Critical Illness:
                                <span class="critical-illness-info">${criticalIllness.critical_illness}</span>
                            </p>
                            <p>Age of Diagnosed:
                                <span class="critical-illness-info">${criticalIllness.age_of_diagnosed}</span>
                            </p>
                        </div>
                    `;
                });
                $('.critical-illness-container').html(criticalIllnessesHistoryDetailsContent);
            });
        },

        _onclickCriticalIllnessesAdd: function(ev) {
            const $criticalIllnessesForm = $('.form-critical-illnesses');
            $criticalIllnessesForm.find('input[type="text"], input[type="number"], select').val('');
            $criticalIllnessesForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);
            $criticalIllnessesForm.find('#critical_illness_id').val('new-critical-illness');
            $criticalIllnessesForm.removeClass('d-none').fadeIn(400);
        },

        _onclickCriticalIllnessesSaveCancel: function(el) {
            el.preventDefault();
            el.stopPropagation();
            const $criticalIllnessesForm = $('.form-critical-illnesses');
            const $criticalIllnessesHistoryDetails = $('.critical-illnesses');

            if ($(el.currentTarget).hasClass('btn-critical-illnesses-save')) {
                // Gather critical illness data
                const relationship = $criticalIllnessesForm.find('input[name="relationship"]').val();
                const criticalIllness = $criticalIllnessesForm.find('input[name="critical_illness"]').val();
                const ageOfDiagnosed = $criticalIllnessesForm.find('input[name="age_of_diagnosed"]').val();
                const criticalIllnessId = $criticalIllnessesForm.find('#critical_illness_id').val();

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/critical-illness',
                    params: {
                        fact_find_id: this.factFindId,
                        critical_illness_id: criticalIllnessId !== 'new-critical-illness' ? criticalIllnessId : null,
                        data: {
                            relationship: relationship,
                            critical_illness: criticalIllness,
                            age_of_diagnosed: ageOfDiagnosed,
                        }
                    }
                }).then((result) => {
                    if (result.success) {
                        // Hide form and show details
                        $criticalIllnessesForm.addClass('d-none').fadeOut(400);
                        $criticalIllnessesHistoryDetails.removeClass('d-none').fadeIn(400);

                        // Reload the critical illnesses data to reflect changes
                        this._onclickCriticalIllnessesSubItem({
                            currentTarget: $(`[data-id="${this.factFindId}"]`)
                        });
                    } else {
                        console.error('Error saving critical illness:', result.error);
                    }
                });
            } else {
                // Cancel - just hide form and show details
                $criticalIllnessesForm.addClass('d-none').fadeOut(400);
                $criticalIllnessesHistoryDetails.removeClass('d-none').fadeIn(400);
            }
        },

        _onClickConfirm: function (ev) {
            ev.preventDefault();

            // Hide the popup
            $('#no-dependants-popup').addClass('d-none');

            // Hide the dependants section
            $('.dependants-history-details').addClass('d-none');

            // Add highlight to "no dependants" button
            $('.no-dependants').addClass('btn-selected');
            $('.have-dependants').removeClass('btn-selected');

            console.log('Confirmed no dependants - button highlighted and section hidden');

            // Update have_dependants field to false in the fact.find record
            this._rpc({
                route: '/update/fact-find/have-dependants',
                params: {
                    fact_find_id: parseInt(this.factFindId),
                    have_dependants: false
                }
            }).then((result) => {
                if (result.error) {
                    console.error('Error updating have_dependants field:', result.error);
                } else {
                    console.log('have_dependants field updated successfully to false');
                }
            });

            // Optionally trigger next section button if it exists
            const $nextBtn = this.$("#btnNextSection");
            if ($nextBtn.length) {
                $nextBtn.trigger("click");
            }
        },

        _onclickUpdateCriticalIllnessActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let criticalIllnessId = parseFloat($(el.currentTarget).attr('data-critical-illness-id'));
            let $criticalIllnessesForm = $('.form-critical-illnesses');

            if (actionType === 'edit') {
                $criticalIllnessesForm.find('#critical_illness_id').val(criticalIllnessId);

                this._rpc({
                    route: '/get/fact-find/critical-illness',
                    params: {
                        critical_illness_id: criticalIllnessId
                    }
                }).then((criticalIllnessData) => {
                    if (criticalIllnessData.error) {
                        console.error('Error fetching critical illness data:', criticalIllnessData.error);
                        return;
                    }

                    // Populate form fields using the selector keys
                    $.each(criticalIllnessData, function(selector, value) {
                        $criticalIllnessesForm.find(selector).val(value);
                    });

                    $criticalIllnessesForm.removeClass('d-none').fadeIn(400);
                    $('.critical-illnesses').addClass('d-none').fadeOut(400);
                });
            }

            if (actionType === 'delete') {
                this._rpc({
                    route: '/delete/fact-find/critical-illness',
                    params: {
                        critical_illness_id: criticalIllnessId
                    }
                }).then((result) => {
                    if (result.success) {
                        $(el.currentTarget).closest('.critical-illness-card').remove();
                    } else {
                        console.error('Error deleting critical illness:', result.error);
                    }
                });
            }
        },

        //self employment

        _onclickSelfEmploymentDetailsSubItem: function(el) {
            this.factFindId = parseInt($(el.currentTarget).attr('data-id'));
            let $progressBar = $('#ff_progress_bar');

            // Update the header text
            $('.fact-find-header').html($(el.currentTarget).text());

            // Show the progress bar if it is hidden
            if ($progressBar.hasClass('d-none')) {
                $progressBar.removeClass('d-none');
            }

            $('.li_overview').click();

            // Show the loader and then hide it after a delay
            $('#loader').removeClass('d-none');
            setTimeout(function() {
                $('#loader').addClass('d-none');
            }, 1500);

            this._loadDocuments();

            const self = this;
            this._rpc({
                route: '/get/ff/self-employment-details',
                params: {
                    'self_employment_details_id': this.factFindId
                }
            }).then((selfEmploymentDetailsData) => {
                let selfEmploymentDetailsHistoryDetailsContent = '';
                $.each(selfEmploymentDetailsData, function(index, selfEmploymentDetail) {
                    selfEmploymentDetailsHistoryDetailsContent += `
                        <div class="card mb-3 self-employment-details-card">
                            <div class="card-header">
                                <div class="edit-delete float-right">
                                    <i class="fa fa-pencil fa-lg self-employment-details-actions" data-type="edit" data-self-employment-details-id="${selfEmploymentDetail.self_employment_details_id}"></i>
                                    <i class="fa fa-trash fa-lg self-employment-details-actions" data-type="delete" data-self-employment-details-id="${selfEmploymentDetail.self_employment_details_id}"></i>
                                </div>
                                <h6 class="card-title mb-0">Self-Employment: ${selfEmploymentDetail.business_name || 'N/A'}</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Business Name:</strong> ${selfEmploymentDetail.business_name || 'N/A'}</p>
                                <p><strong>Occupation:</strong> ${selfEmploymentDetail.self_employed_occupation || 'N/A'}</p>
                                <p><strong>Self Employment Start Date:</strong> ${selfEmploymentDetail.self_employment_start_date || 'N/A'}</p>
                                <p><strong>Year 1 Tax Income:</strong> ${selfEmploymentDetail.year_1_tax_income || 'N/A'}</p>
                                <p><strong>Year 2 Tax Income:</strong> ${selfEmploymentDetail.year_2_tax_income || 'N/A'}</p>
                            </div>
                        </div>
                    `;
                });
                $('.self-employment-container').html(selfEmploymentDetailsHistoryDetailsContent);
            });
        },

        _onclickSelfEmploymentDetailsAdd: function(ev) {
            const $selfEmploymentDetailsForm = $('.self-employment-details-form');

            // Reset all input fields
            $selfEmploymentDetailsForm.find('input[type="text"], input[type="number"], input[type="date"], select, textarea, date').val('');
            $selfEmploymentDetailsForm.find('input[type="radio"], input[type="checkbox"]').prop('checked', false);

            // Set default values for radio buttons
            $selfEmploymentDetailsForm.find('input[name="business_bank_account"][value="false"]').prop('checked', true);
            $selfEmploymentDetailsForm.find('input[name="has_accountant"][value="false"]').prop('checked', true);

            // Reset hidden field for new self employment details record
            $selfEmploymentDetailsForm.find('#self_employment_details_id').val('new-self-employment-details');

            // Show the form
            $selfEmploymentDetailsForm.removeClass('d-none').fadeIn(400, () => {
                // Initialize field visibility AFTER form is visible
                const selfEmploymentTypeSelect = $selfEmploymentDetailsForm.find('select[name="self_employment_type"]')[0];
                this._onchangeSelfEmploymentType({
                    target: selfEmploymentTypeSelect
                });
                this._onchangeAccountantDetails();
            });

            $('html, body').animate({
                scrollTop: $selfEmploymentDetailsForm.offset().top
            }, 500);
        },

        _onclickSelfEmploymentDetailsSaveCancel: function(el) {
            const $selfEmploymentDetailsForm = $('.self-employment-details-form');
            const selfEmploymentDetailsId = $selfEmploymentDetailsForm.find('#self_employment_details_id').val();

            if ($(el.currentTarget).hasClass('btn-self-employment-save')) {
                const selfEmploymentType = $selfEmploymentDetailsForm.find('select[name="self_employment_type"]').val();
                const businessName = $selfEmploymentDetailsForm.find('input[name="business_name"]').val();
                const occupation = $selfEmploymentDetailsForm.find('input[name="self_employed_occupation"]').val();
                const startDate = $selfEmploymentDetailsForm.find('input[name="self_employment_start_date"]').val();
                const taxYear1 = $selfEmploymentDetailsForm.find('input[name="tax_year_1"]').val();
                const year1TaxIncome = $selfEmploymentDetailsForm.find('input[name="year_1_tax_income"]').val();
                const taxYear2 = $selfEmploymentDetailsForm.find('input[name="tax_year_2"]').val();
                const year2TaxIncome = $selfEmploymentDetailsForm.find('input[name="year_2_tax_income"]').val();
                const businessAddress = $selfEmploymentDetailsForm.find('textarea[name="business_address"]').val();
                const businessContact = $selfEmploymentDetailsForm.find('input[name="business_contact"]').val();
                const hasBusinessBankAccount = $selfEmploymentDetailsForm.find('input[name="business_bank_account"]:checked').val() === 'true';
                const hasAccountant = $selfEmploymentDetailsForm.find('input[name="has_accountant"]:checked').val() === 'true';
                const firmName = $selfEmploymentDetailsForm.find('input[name="self_firm_name"]').val();
                const accountantAddress = $selfEmploymentDetailsForm.find('input[name="self_accountant_address"]').val();
                const contactNumber = $selfEmploymentDetailsForm.find('input[name="self_contact_number"]').val();
                const qualification = $selfEmploymentDetailsForm.find('input[name="self_qualification"]').val();
                const letPropertiesCountNew = $selfEmploymentDetailsForm.find('input[name="self_let_properties_count_new"]').val();

                // Send data via RPC
                this._rpc({
                    route: '/update/fact-find/self-employment-details',
                    params: {
                        fact_find_id: this.factFindId,
                        self_employment_details_id: selfEmploymentDetailsId,
                        data: {
                            self_employment_type: selfEmploymentType,
                            business_name: businessName,
                            self_employed_occupation: occupation,
                            self_employment_start_date: startDate,
                            tax_year_1: taxYear1,
                            year_1_tax_income: year1TaxIncome,
                            tax_year_2: taxYear2,
                            year_2_tax_income: year2TaxIncome,
                            business_address: businessAddress,
                            business_contact: businessContact,
                            business_bank_account: hasBusinessBankAccount,
                            has_accountant: hasAccountant,
                            firm_name: firmName,
                            accountant_address: accountantAddress,
                            contact_number: contactNumber,
                            qualification: qualification,
                            let_properties_count_new: letPropertiesCountNew,
                        }
                    }
                }).then((result) => {
                    if (result.success) {
                        $selfEmploymentDetailsForm.addClass('d-none').fadeOut(400);
                        const $selfEmploymentDetailsHistoryDetails = $('.self-employments');
                        $selfEmploymentDetailsHistoryDetails.removeClass('d-none').fadeIn(400);

                        if (selfEmploymentDetailsId === 'new-self-employment-details') {
                            const newSelfEmploymentCard = `
                                <div class="card mb-3 self-employment-details-card">
                                    <div class="card-header">
                                        <div class="edit-delete float-right">
                                            <i class="fa fa-pencil fa-lg self-employment-details-actions" data-type="edit" data-self-employment-details-id="${result.id}"></i>
                                            <i class="fa fa-trash fa-lg self-employment-details-actions" data-type="delete" data-self-employment-details-id="${result.id}"></i>
                                        </div>
                                        <h6 class="card-title">Self-Employment: ${businessName}</h6>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Business Name:</strong> ${businessName}</p>
                                        <p><strong>Occupation:</strong> ${occupation}</p>
                                        <p><strong>Self Employment Start Date:</strong> ${startDate}</p>
                                        <p><strong>Year 1 Tax Income:</strong> ${year1TaxIncome}</p>
                                        <p><strong>Year 2 Tax Income:</strong> ${year2TaxIncome}</p>
                                        <p><strong>Number of Let Properties:</strong> ${letPropertiesCountNew}</p>
                                    </div>
                                </div>
                            `;
                            $('.self-employment-container').append(newSelfEmploymentCard);
                        } else {
                            location.reload();
                        }
                    } else {
                        console.error('Error saving self employment details:', result.error);
                    }
                });
            } else {
                $selfEmploymentDetailsForm.addClass('d-none').fadeOut(400);
                const $selfEmploymentDetailsHistoryDetails = $('.self-employments');
                $selfEmploymentDetailsHistoryDetails.removeClass('d-none').fadeIn(400);
            }
        },

        _onclickUpdateSelfEmploymentDetailsActions: function(el) {
            let actionType = $(el.currentTarget).attr('data-type');
            let selfEmploymentDetailsId = parseFloat($(el.currentTarget).attr('data-self-employment-details-id'));
            let $selfEmploymentDetailsForm = $('.self-employment-details-form');

            if (actionType === 'edit') {
                $selfEmploymentDetailsForm.find('#self_employment_details_id').val(selfEmploymentDetailsId);

                this._rpc({
                    route: '/get/fact-find/self-employment-details',
                    params: {
                        self_employment_details_id: selfEmploymentDetailsId
                    }
                }).then((selfEmploymentDetailsData) => {
                    if (selfEmploymentDetailsData && selfEmploymentDetailsData.length > 0) {
                        const data = selfEmploymentDetailsData[0];

                        // Populate form fields
                        $selfEmploymentDetailsForm.find('input[name="business_name"]').val(data.business_name || '');
                        $selfEmploymentDetailsForm.find('input[name="self_employed_occupation"]').val(data.self_employed_occupation || '');
                        $selfEmploymentDetailsForm.find('input[name="self_employment_start_date"]').val(data.self_employment_start_date || '');
                        $selfEmploymentDetailsForm.find('input[name="tax_year_1"]').val(data.tax_year_1 || '');
                        $selfEmploymentDetailsForm.find('input[name="year_1_tax_income"]').val(data.year_1_tax_income || '');
                        $selfEmploymentDetailsForm.find('input[name="tax_year_2"]').val(data.tax_year_2 || '');
                        $selfEmploymentDetailsForm.find('input[name="year_2_tax_income"]').val(data.year_2_tax_income || '');
                        $selfEmploymentDetailsForm.find('input[name="business_contact"]').val(data.business_contact_no || '');
                        $selfEmploymentDetailsForm.find('input[name="self_let_properties_count_new"]').val(data.let_properties_count_new || '');
                        $selfEmploymentDetailsForm.find('textarea[name="business_address"]').val(data.business_address || '');

                        // Set the employment type FIRST
                        $selfEmploymentDetailsForm.find('select[name="self_employment_type"]').val(data.self_employment_type || '');

                        // Handle boolean fields
                        if (data.has_business_bank_account !== undefined) {
                            $selfEmploymentDetailsForm.find('input[name="business_bank_account"][value="' + (data.has_business_bank_account ? 'true' : 'false') + '"]').prop('checked', true);
                        } else {
                            $selfEmploymentDetailsForm.find('input[name="business_bank_account"][value="false"]').prop('checked', true);
                        }

                        if (data.has_accountant !== undefined) {
                            $selfEmploymentDetailsForm.find('input[name="has_accountant"][value="' + (data.has_accountant ? 'true' : 'false') + '"]').prop('checked', true);
                        } else {
                            $selfEmploymentDetailsForm.find('input[name="has_accountant"][value="false"]').prop('checked', true);
                        }

                        // Accountant details
                        $selfEmploymentDetailsForm.find('input[name="self_firm_name"]').val(data.accountant_firm_name || data.firm_name || '');
                        $selfEmploymentDetailsForm.find('input[name="self_accountant_address"]').val(data.accountant_address || data.address || '');
                        $selfEmploymentDetailsForm.find('input[name="self_contact_number"]').val(data.accountant_contact_no || data.contact_number || '');
                        $selfEmploymentDetailsForm.find('input[name="self_qualification"]').val(data.accountant_qualification || data.qualification || '');

                        // Show the form first, then initialize field visibility
                        const self = this; // Preserve context
                        $selfEmploymentDetailsForm.removeClass('d-none').fadeIn(400, () => {
                            // CRITICAL: Call the change handler after form is visible to apply visibility rules
                            const selfEmploymentTypeSelect = $selfEmploymentDetailsForm.find('select[name="self_employment_type"]')[0];
                            if (selfEmploymentTypeSelect) {
                                // Create a synthetic event and call the handler with proper context
                                const syntheticEvent = {
                                    target: selfEmploymentTypeSelect
                                };
                                self._onchangeSelfEmploymentType(syntheticEvent);
                            }

                            // Also call accountant details handler to set accountant field visibility
                            self._onchangeAccountantDetails();
                        });

                        $('html, body').animate({
                            scrollTop: $selfEmploymentDetailsForm.offset().top
                        }, 500);
                    }
                });
            } else if (actionType === 'delete') {
                this._rpc({
                    route: '/delete/fact-find/self-employment-details',
                    params: {
                        self_employment_details_id: selfEmploymentDetailsId
                    }
                }).then(() => {
                    $(el.currentTarget).closest('.self-employment-details-card').remove();
                });
            }
        },

        _onchangeAccountantDetails: function() {
            // Use more specific selectors to avoid conflicts
            const $form = $('.self-employment-details-form');
            const accountantYesRadio = $form.find('input[name="has_accountant"][value="true"]');
            const accountantFirmName = $form.find('.accountant_firm_name');
            const accountantAddress = $form.find('.accountant_accountant_address');
            const accountantContactNumber = $form.find('.accountant_contact_number');
            const accountantQualification = $form.find('.accountant_qualification');

            // Ensure all elements exist before manipulating
            if (accountantYesRadio.length && accountantFirmName.length && accountantAddress.length &&
                accountantContactNumber.length && accountantQualification.length) {
                // Reset visibility to ensure consistent state
                accountantFirmName.addClass('d-none');
                accountantAddress.addClass('d-none');
                accountantContactNumber.addClass('d-none');
                accountantQualification.addClass('d-none');

                if (accountantYesRadio.is(':checked')) {
                    accountantFirmName.removeClass('d-none');
                    accountantAddress.removeClass('d-none');
                    accountantContactNumber.removeClass('d-none');
                    accountantQualification.removeClass('d-none');
                }
            } else {
                console.warn('Accountant details elements not found in DOM');
            }
        },

        _onchangeSelfEmploymentType: function (ev) {
            var selectedOption = ev.target.value;
            var businessNameField = this.$('.business_name_field');
            var occupationField = this.$('.occupation_field');
            var startDateField = this.$('.start_date_field');
            var businessAddressField = this.$('.business_address_field');
            var letPropertiesField = this.$('.self_let_properties_count_new');
            var accountantField    = this.$('.has_accountant');
            var businessBankAccountField = this.$('.business_bank_account_field');


            if (selectedOption === 'btl_income') {
                businessNameField.hide();
                occupationField.hide();
                startDateField.hide();
                businessAddressField.hide();
                letPropertiesField.show();
                businessBankAccountField.hide();
                accountantField.hide();
            } else if (selectedOption === 'company_director') {
                businessNameField.show();
                occupationField.show();
                startDateField.show();
                businessAddressField.show();
                letPropertiesField.hide();
                businessBankAccountField.show();
                accountantField.show();
            } else {
                businessNameField.show();
                occupationField.show();
                startDateField.show();
                businessAddressField.show();
                letPropertiesField.hide();
                businessBankAccountField.hide();
                accountantField.hide();
            }
         },

        // ============================================
        // FORM POPULATION HELPERS
        // ============================================

        /**
         * Populate insurance form fields with data
         * @param {jQuery} $form - The form element
         * @param {Object} data - Fact find data from server
         */
        _populateInsuranceForm: function($form, data) {
            // Populate insurance form fields
            $form.find("select[name='property_usage']").val(data.property_usage || "");
            $form.find("input[name='house_flat_no']").val(data.house_flat_no || "");
            $form.find("input[name='post_code3']").val(data.post_code || "");
            $form.find("textarea[name='address3']").val(data.address || "");
            $form.find("input[name='building_name3']").val(data.building_name || "");
            $form.find("input[name='street_address3']").val(data.street_address || "");
            $form.find("input[name='county3']").val(data.county || "");
            $form.find("input[name='market_price']").val(data.market_price || "");
            $form.find("select[name='property_type']").val(data.property_type || "");
            $form.find("select[name='tenure']").val(data.tenure || "");
            $form.find("input[name='no_bedrooms']").val(data.no_bedrooms || "");
            $form.find("input[name='no_bathrooms']").val(data.no_bathrooms || "");
            $form.find("input[name='kitchen']").val(data.kitchen || "");
            $form.find("input[name='living_rooms']").val(data.living_rooms || "");
            $form.find("input[name='garage_space']").val(data.garage_space || "");
            $form.find("select[name='parking']").val(data.parking || "");
            $form.find("input[name='no_stories_in_building']").val(data.no_stories_in_building || "");
            $form.find("select[name='estimated_built_year']").val(data.estimated_built_year || "");
            $form.find("input[name='warranty_providers_name']").val(data.warranty_providers_name || "");
            $form.find("select[name='epc_predicted_epc_rate']").val(data.epc_predicted_epc_rate || "");
            $form.find("select[name='pea_rate']").val(data.pea_rate || "");
            $form.find("input[name='annual_service_charge']").val(data.annual_service_charge || "");
            $form.find("select[name='wall_construction_type']").val(data.wall_construction_type || "");
            $form.find("select[name='roof_construction_type']").val(data.roof_construction_type || "");
            $form.find("input[name='remaining_lease_term_in_years']").val(data.remaining_lease_term_in_years || "");
            $form.find("input[name='flat_in_floor']").val(data.flats_in_floor || "");
            $form.find("input[name='flats_same_floor_count']").val(data.flats_same_floor_count || "");
            $form.find("select[name='above_commercial_property']").val(data.above_commercial_property || "");
            $form.find("input[name='ground_rent']").val(data.ground_rent || "");
            $form.find("select[name='ownership_percentage_existing']").val(data.ownership_percentage || "");
            $form.find("input[name='estimated_monthly_rental_income']").val(data.estimated_monthly_rental_income || "");
            $form.find("input[name='current_monthly_rental_income']").val(data.current_monthly_rental_income || "");
            $form.find("input[name='occupants_count']").val(data.occupants_count || "");
            $form.find("input[name='company_name']").val(data.company_name || "");
            $form.find("select[name='company_director']").val(data.company_director || "");
            $form.find("select[name='additional_borrowing_reason']").val(data.additional_borrowing_reason || "");
            $form.find("input[name='additional_borrowing_amount']").val(data.additional_borrowing_amount || "");
            $form.find("input[name='monthly_commute_cost']").val(data.monthly_commute_cost || "");
            $form.find("select[name='help_to_buy_loan_type']").val(data.help_to_buy_loan_type || "");

            // Checkboxes
            $form.find("input[name='is_new_build']").prop('checked', !!data.is_new_build);
            $form.find("input[name='ex_council']").prop('checked', !!data.ex_council);
            $form.find("input[name='shared_ownership_existing']").prop('checked', !!data.shared_ownership);
            $form.find("input[name='help_to_buy_loan']").prop('checked', !!data.help_to_buy_loan);
            $form.find("input[name='hmo']").prop('checked', !!data.hmo);
            $form.find("input[name='additional_borrowing']").prop('checked', !!data.additional_borrowing);
            $form.find("input[name='commute_over_one_hour']").prop('checked', !!data.commute_over_one_hour);
        },

        /**
         * Populate personal details form fields with data
         * @param {jQuery} $form - The form element
         * @param {Object} data - Fact find data from server
         */
        _populatePersonalDetailsForm: function($form, data) {
            // Basic personal information
            $form.find("select[name='title']").val(data.title_customer || "");
            $form.find("input[name='first-name']").val(data.first_name || "");
            $form.find("input[name='middle-name']").val(data.middle_names || "");
            $form.find("input[name='surname']").val(data.surname || "");

            // Known by another name checkbox and related fields
            $form.find("input[name='another_name_checkbox']").prop('checked', !!data.known_by_another_name);
            $form.find("input[name='previous_surname']").val(data.previous_surname || "");
            $form.find("input[name='date_of_name_change']").val(data.date_of_name_change || "");

            // Gender and DOB
            $form.find("select[name='gender']").val(data.gender || "");
            $form.find("input[name='personal-details-dob']").val(data.date_of_birth || "");

            // Country of birth and nationality
            $form.find("select[name='cob']").val(data.country_of_birth || "");
            $form.find("select[name='nationality']").val(data.nationality || "");
            $form.find("select[name='eu_country_list']").val(data.eu_country_list || "");
            $form.find("select[name='other_nationality']").val(data.other_nationality_id || "");

            // Passport details
            $form.find("input[name='passport_expiry_date']").val(data.passport_expiry_date || "");
            $form.find("select[name='second-nationality']").val(data.dual_nationality_id || "");

            // UK living details
            $form.find("select[name='start_continue_living_in_uk_month']").val(data.start_continue_living_in_uk_month || "");
            $form.find("select[name='start_continue_living_in_uk_year']").val(data.start_continue_living_in_uk_year || "");
            $form.find("select[name='indefinite_leave_to_remain']").val(data.indefinite_leave_to_remain || "");
            $form.find("select[name='settled_status']").val(data.settled_status || "");
            $form.find("select[name='visa_category']").val(data.visa_category || "");

            // Marital status and contact information
            $form.find("select[name='marital_status']").val(data.marital_status || "");
            $form.find("input[name='email']").val(data.email_address || "");
            $form.find("input[name='telephone']").val(data.mobile_number || "");
            $form.find("input[name='home-telephone']").val(data.home_telephone_number || "");
        },

        /**
         * Populate deposit form fields with data
         * @param {jQuery} $form - The form element
         * @param {Object} data - Fact find data from server
         */
        _populateDepositForm: function($form, data) {
            $form.find("input[name='deposit_from_savings']").val(data.deposit_from_savings || "");
            $form.find("input[name='gifted_deposit_from_friend']").val(data.gifted_deposit_from_friend || "");
            $form.find("input[name='gifted_deposit_from_family']").val(data.gifted_deposit_from_family || "");
            $form.find("input[name='deposit_from_another_loan']").val(data.deposit_from_another_loan || "");
            $form.find("input[name='deposit_from_equity_of_property']").val(data.deposit_from_equity_of_property || "");
            $form.find("input[name='loan_amount_from_director']").val(data.loan_amount_from_director || "");
            $form.find("input[name='gifted_deposit_amount_from_director']").val(data.gifted_deposit_amount_from_director || "");
        },

        /**
         * Populate estate agent form fields with data
         * @param {jQuery} $form - The form element
         * @param {Object} data - Fact find data from server
         */
        _populateEstateAgentForm: function($form, data) {
            $form.find("input[name='firm_name']").val(data.firm_name || "");
            $form.find("input[name='es_mobile']").val(data.contactable_person_mobile || "");
            $form.find("input[name='contactable_person']").val(data.contactable_person || "");
            $form.find("input[name='es_email']").val(data.firm_email || "");
        },

        /**
         * Populate solicitor form fields with data
         * @param {jQuery} $form - The form element
         * @param {Object} data - Fact find data from server
         */
        _populateSolicitorForm: function($form, data) {
            $form.find("input[name='solicitor_firm_name']").val(data.solicitor_firm_name || "");
            $form.find("textarea[name='solicitor_address']").val(data.solicitor_address || "");
            $form.find("input[name='solicitor_house_number']").val(data.solicitor_house_number || "");
            $form.find("input[name='solicitor_post_code']").val(data.solicitor_post_code || "");
            $form.find("input[name='solicitor_email']").val(data.solicitor_email || "");
            $form.find("input[name='solicitor_contact_person']").val(data.solicitor_contact_person || "");
            $form.find("input[name='solicitor_contact_number']").val(data.solicitor_contact_number || "");
        },

        _highlightButton: function ($form, data) {
            const no_button = $('.no-dependants');
            const yes_button = $('.have-dependants');

            // Reset both buttons first
            no_button.removeClass('active');
            yes_button.removeClass('active');
            no_button.find('.check-icon').remove();
            yes_button.find('.check-icon').remove();

            // If have_dependant is false
            if (data.have_dependants === false) {
                no_button.addClass('active');

                // Add check icon if not already added
                if (no_button.find('.check-icon').length === 0) {
                    no_button.append('<i class="fa fa-check check-icon ms-2"></i>');
                }
            }
        },

        /**
         * Populate expenditure form fields with data
         * @param {jQuery} $form - The form element
         * @param {Object} data - Fact find data from server
         */

        _populateExpenditureForm: function($form, data) {
            $form.find("input[name='rent']").val(data.rent || "");
            $form.find("input[name='food']").val(data.food || "");
            $form.find("input[name='utilities']").val(data.utilities || "");
            $form.find("input[name='phone_internet']").val(data.phone_internet || "");
            $form.find("input[name='transport']").val(data.transport || "");
            $form.find("input[name='clothing']").val(data.clothing || "");
            $form.find("input[name='medicine']").val(data.medicine || "");
            $form.find("input[name='personal_goods']").val(data.personal_goods || "");
            $form.find("input[name='household_goods']").val(data.household_goods || "");
            $form.find("input[name='entertainment']").val(data.entertainment || "");
//            $form.find("input[name='childcare']").val(data.service_charge || "");
            $form.find("input[name='annual_council_tax']").val(data.annual_council_tax || "");
            $form.find("input[name='home_insurance']").val(data.home_insurance || "");
            $form.find("input[name='life_insurance']").val(data.life_insurance || "");
            $form.find("input[name='car_insurance']").val(data.car_insurance || "");
            $form.find("input[name='education_fees']").val(data.education_fees || "");
            $form.find("input[name='ground_rent_1']").val(data.ground_rent || "");
            $form.find("input[name='services_charge']").val(data.services_charge || "");
            $form.find("input[name='service_charge']").val(data.service_charge || "");

            // Round total_expenses to 2 decimal places
            const totalExpenses = data.total_monthly_expenses ? parseFloat(data.total_monthly_expenses).toFixed(2) : "";
            $form.find("input[name='total_expenses']").val(totalExpenses);
        },

        // ============================================
        // INSURANCE FORM LOADER HELPERS
        // ============================================

        /**
         * Show loading indicator for insurance form
         * @param {jQuery} $form - The form element
         */
        _showInsuranceLoader: function($form) {
            // Check if loader already exists
            if ($form.find('.insurance-loader-overlay').length > 0) {
                return;
            }

            // Create loader overlay
            const loaderHtml = `
                <div class="insurance-loader-overlay" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    border-radius: 8px;
                ">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <div class="mt-3" style="font-size: 14px; color: #6c757d;">
                        <i class="fa fa-sync fa-spin mr-2"></i>Loading details...
                    </div>
                </div>
            `;

            // Make form container relative for absolute positioning
            $form.css('position', 'relative');

            // Add loader to form
            $form.append(loaderHtml);

            // Disable form inputs while loading
            $form.find('input, select, textarea, button').prop('disabled', true);
        },

        /**
         * Hide loading indicator for insurance form
         * @param {jQuery} $form - The form element
         */
        _hideInsuranceLoader: function($form) {
            // Remove loader overlay
            $form.find('.insurance-loader-overlay').fadeOut(300, function() {
                $(this).remove();
            });

            // Re-enable form inputs
            $form.find('input, select, textarea, button').prop('disabled', false);
        },


    })
})
