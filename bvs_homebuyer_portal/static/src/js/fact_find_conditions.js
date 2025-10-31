odoo.define('bvs_homebuyer_portal.fact_find_conditions', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.bvsHomebuyerPortalConditions = publicWidget.Widget.extend({
        selector: '.homebuyer-portal',
        events: {
                  'change input.kbn_check': '_onchangeKnownByAnotherName',
                  'change select[name="nationality"].nationality': '_onchangeNationalityField',
                  'change input[id="passport_expiry_date"]': '_onchangePassportExpiryDate',
                  'change select[name="indefinite_leave_to_remain"]': '_onchangeIndefiniteLeaveToRemain',
                  'change select[id="residential_status_ah"]': '_onchangeResidentialStatus',
                  'change input[name="dependant-date-of-birth"]': '_onchangeDateOfBirth',
                  'change input[name="current_address_name_checkbox"]': '_onChangeCurrentAddressName',
                  'change select[id="employment-status"]': '_onchangeEmploymentStatusVisibility',
                  'change input#gross_monthly_retirement_income': '_calculateRetirementIncome',
                  'change input#annual_retirement_income': '_calculateRetirementIncome',
                  'change input#ni_number': '_validateNINumber',
                  'change input#anticipated_retirement_age': '_validateRetirementAge',
                  'change select[name="employment_type"]': '_onchangeEmploymentType',
                  'change input[name="is_current_employment"]': '_onchangeCurrentEmployment',
                  'change input[id="self_employment_start_date"]': '_validateSelfEmploymentStartDate',
                  'change input#monthly_gross_salary': '_calculateAnnualSalary',
                  'change input#annual_bonus': '_calculateAnnualSalary',
                  'change input#has_deductions': '_onchangeHasDeductions',
                  'change select[name="self_employment_type"]': '_onchangeSelfEmploymentType',
                  'change input[name="has_accountant"]': '_onchangeAccountantDetails',
                  'change input#monthly_income': '_calculateAnnualIncome',
                  'change input[name="gifted_deposit_from_family_checkbox"]': '_onChangeGiftedFromFamily',
                  'change select[name="commitment_type"]': '_onchangeCommitmentType',
                  'change select[name="property_usage"]': '_onchangePropertyUsage',
                  'change input[id="hmo"]': '_onchangeHMO',
                  'change input[id="additional_borrowing"]': '_onChangeAdditionalBurrow',
                  'change input[id="shared_ownership_existing"]': '_onchangeSharedOwnershipAvailable',
                  'change input[name="is_new_build"]': '_onchangeNewBuild',
                  'change select#tenure': '_onchangeTenure',
                  'change input[name="date_of_name_change"]': '_validateDateOfNameChange',
                  'change input[name="business_contact"]': '_validateBusinessContact',
                  'change select[name="property_usage_yep"]': '_onchangePropertyUsageYep',
                  'change select[name="htb_scheme_available_yep"]': '_onchangeHtbSchemeAvailable',
                  'change select[id="shared_ownership_available_yep"]': '_onchangeSharedOwnershipAvailableYep',
                  'change input[id="existing_protection_cover"]': '_onchangeEmployerSickPayBenefit',
                  'change select[name="smoking"]': '_onchangeSmokingStatus',
                  'change select[name="alcohol_consumption_comment"]': '_onchangeAlcoholStatus',
                  'change input[id="medical_conditions"]': '_onchangeMedicalCondition',
                  'change input[id="taking_medicines"]': '_onchangeTakingMeds',
                  'change select[name="health_conditions"]': '_onchangeHealthConditions',
                  'change input#rent': '_calculateTotalExpenses',
                  'change input#food': '_calculateTotalExpenses',
                  'change input#utilities': '_calculateTotalExpenses',
                  'change input#phone_internet': '_calculateTotalExpenses',
                  'change input#transport': '_calculateTotalExpenses',
                  'change input#clothing': '_calculateTotalExpenses',
                  'change input#medicine': '_calculateTotalExpenses',
                  'change input#personal_goods': '_calculateTotalExpenses',
                  'change input#household_goods': '_calculateTotalExpenses',
                  'change input#entertainment': '_calculateTotalExpenses',
                  'change input#childcare_cost': '_calculateTotalExpenses',
                  'change input#annual_council_tax': '_calculateTotalExpenses',
                  'change input#home_insurance': '_calculateTotalExpenses',
                  'change input#life_insurance': '_calculateTotalExpenses',
                  'change input#car_insurance': '_calculateTotalExpenses',
                  'change input#education_fees': '_calculateTotalExpenses',
                  'change input#ground_rent_1': '_calculateTotalExpenses',
                  'change input#service_charge': '_calculateTotalExpenses',
                  'change input#services_charge': '_calculateTotalExpenses',
                  'change input#total_expenses': '_calculateTotalExpenses',
                  'change input#gym_membership': '_calculateTotalExpenses',
                  'change input#monthly_income': '_calculateAnnualIncome',
                  'change input#deposit_from_savings': '_calculateTotalDeposit',
                  'change input#gifted_deposit_from_friend': '_calculateTotalDeposit',
                  'change input#gifted_deposit_from_family': '_calculateTotalDeposit',
                  'change input#deposit_from_another_loan': '_calculateTotalDeposit',
                  'change input#deposit_from_equity_of_property': '_calculateTotalDeposit',
                  'change input#loan_amount_from_director': '_calculateTotalDeposit',
                  'change input#gifted_deposit_amount_from_director': '_calculateTotalDeposit',
                  'change input[id="email"]' : '_validateEmailAddress',
                  'change input[id="telephone"]' : '_validateMobileNumber',
                  'change input[id="es_mobile"]' : '_validateMobileNumberEstateAgent',
                  'input #contact_no_solicitor': '_validateMobileNumberSolicitor',
                   'blur #contact_no_solicitor': '_validateMobileNumberSolicitor',
                  'change input[id="home-telephone"]' : '_validateHomeTelephone',
                  'change input[id="personal-details-dob"]' : '_validatePersonalDOB',
                  'change input[id="date-moved-to-this-address"]': '_validateDateMovedTo',
                  'change input[id="date-moved-out-this-address"]': '_validateDateMovedOut',
                  'change input[id="dependant-date-of-birth"]': '_validateDependantDateOfBirth',
                  'click .no-dependants': '_onClickNoDependants',
                  'change select[id="alcohol_consumption_comment"]': '_onAlcoholConsumptionChange',
                  'change input[id="employer_sick_pay_benefit"]': '_onchangeEmployerSickPayBenefit',
                  'change select[name="health_condition_reported"]': '_onHealthConditionReportedChange',
                  'change select[name="past_travels_reported"]': '_onPastTravelsReportedChange',
                  'change select[name="future_travels_reported"]': '_onFutureTravelsReportedChange',
                  'change select[name="critical_illness_reported"]': '_onCriticalIllnessReportedChange',
                  'change input[id="start_date"]' : '_validateStartDate',
                  'change input[id="emp_work_telephone"]' : '_validateWorkTelephone',
                  'change input[id="self_contact_number"]': '_validateSelfEmploymentContact',
                  'change input[id="direct_debit_for_mortgage"]': '_togglePreferredDDDate',
                  'change input[id="commute_over_one_hour"]': '_toggleMonthlyCommuteCost',
                  'change select[name="estimated_built_year"]': '_toggleWarrantyProvidersField',
                  'change input[id="ynm-years-held"]' : '_validateDateOfNameChange',

                  // document hidden fields when change

                  'change input[name="another_name_checkbox"]': '_onAnotherNameCheckboxChange',
                  'change select[name="settled_status"]': '_onChangeSettledStatusDoc',
                  'change input[name="start_date"]': '_onChangeStartDateDoc',
                  'change input[name="years_of_experience_contract_basis"]': '_onChangeYearsOfExperienceDoc',
                  'change input[name="annual_bonus"]': '_onChangeAnnualBonusDoc',
                  'change input[name="annual_salary"]': '_onChangeAnnualSalaryDoc',
                  'change input[name="gross_monthly_retirement_income"]': '_onChangeGrossMonthlyRetirementIncomeDoc',
                  'change input[name="self_employment_start_date"]': '_onChangeSelfEmploymentStartDateDoc',
                  'change input[name="business_bank_account"]': '_onChangeBusinessBankAccountDoc',
                  'change input[name="has_accountant"]': '_onChangeHasAccountantDoc',
                  'change input[name="self_let_properties_count_new"]': '_onChangeSelfLetPropertiesCountDoc',
                  'change select[name="income_type"]': '_onChangeIncomeTypeDoc',
                  'change input[name="arrears_with_credit_card_or_store_cards"]': '_onChangeArrearsWithCreditCardDoc',
                  'change select[name="commitment_type"]': '_onChangeCommitmentTypeDoc',
                  'change input[name="intend_to_repay"]': '_onChangeIntendToRepayDoc',
                  'change input[name="total_expenses"]': '_onChangeTotalExpensesDoc',
                  'change input[name="deposit_from_savings"]': '_onChangeDepositFromSavingsDoc',
                  'change input[name="gifted_deposit_from_friend"]': '_onChangeGiftedDepositFromFriendDoc',
                  'change input[name="gifted_deposit_from_family"]': '_onChangeGiftedDepositFromFamilyDoc',
                  'change input[name="ynm-account-holder-name"]': '_onChangeAccountHolderNameDoc',
                  'change input[name="direct_debit_for_mortgage"]': '_onChangeDirectDebitForMortgageDoc',
                  'change input[name="is_new_build"]': '_onChangeIsNewBuildDoc',
                  'change input[name="house_flat_no"]': '_onChangeHouseFlatNoDoc',
                  'change select[name="epc_predicted_epc_rate"]': '_onChangeEpcPredictedEpcRateDoc',
                  'change select[name="pea_rate"]': '_onChangePeaRateDoc',
                  'change input[name="help_to_buy_loan"]': '_onChangeHelpToBuyLoanDoc',
                  'change input[name="estimated_monthly_rental_income"]': '_onChangeEstimatedMonthlyRentalIncomeDoc',
                  'change input[name="current_monthly_rental_income"]': '_onChangeCurrentMonthlyRentalIncomeDoc',
                  'change input[name="hmo"]': '_onChangeHmoDoc',
                  'change input[name="company_name"]': '_onChangeCompanyNameDoc',
                  'change input[name="monthly_rental_income"]': '_onChangeMonthlyRentalIncomeDoc',
                  'change input[name="monthly_payment"]': '_onChangeMonthlyPaymentDoc',




        },

           start: function () {
            this._super.apply(this, arguments);

            // Note: Event bindings are handled by the 'events' object above
            // No need for manual bindings to avoid duplicates

            // Wait for complete page load, form data population, and backend data loading
            // Use both DOMContentLoaded and window.load events, plus additional delay for AJAX
            const initializeWhenReady = () => {
                // Check if jQuery is done with AJAX calls
                if (typeof $ !== 'undefined' && $.active === 0) {
                    console.log('All resources and data loaded, initializing field visibility...');
                    this._initializeFieldVisibility();
                } else {
                    // Still waiting for AJAX calls, check again in 300ms
                    const activeRequests = typeof $ !== 'undefined' ? $.active : 'unknown';
                    console.log('Waiting for data to load...', activeRequests, 'active AJAX requests');
                    setTimeout(initializeWhenReady, 3000);
                }
            };

            // Wait for window to fully load (including images, stylesheets, scripts)
            // then add additional delay for backend data population and form rendering
            if (document.readyState === 'complete') {
                // Page already loaded, wait for AJAX data
                setTimeout(initializeWhenReady, 2000);
            } else {
                // Wait for page to load completely
                window.addEventListener('load', () => {
                    setTimeout(initializeWhenReady, 2000);
                });
            }

        },

        _initializeFieldVisibility: function () {
            // Ensure correct state on page load - Initialize ALL conditional visibility fields
            console.log('Initializing field visibility...');

            // Personal Details
            this._onchangeKnownByAnotherName();

            const anotherNameCheckbox = this.$('input[name="another_name_checkbox"]')[0];
            if (anotherNameCheckbox) {
                this._onAnotherNameCheckboxChange({ currentTarget: anotherNameCheckbox });
            }

            // Nationality and Immigration
            const nationalitySelect = this.$('select[name="nationality"].nationality')[0];
            if (nationalitySelect) {
                this._onchangeNationalityField({ currentTarget: nationalitySelect });
            }

            const indefiniteLeaveSelect = this.$('select[name="indefinite_leave_to_remain"]')[0];
            if (indefiniteLeaveSelect) {
                this._onchangeIndefiniteLeaveToRemain({ currentTarget: indefiniteLeaveSelect });
            }

            const passportExpiryInput = this.$('input[id="passport_expiry_date"]')[0];
            if (passportExpiryInput && passportExpiryInput.value) {
                this._onchangePassportExpiryDate({ target: passportExpiryInput });
            }

            const settledStatusSelect = this.$('select[name="settled_status"]')[0];
            if (settledStatusSelect) {
                this._onChangeSettledStatusDoc({ currentTarget: settledStatusSelect });
            }

            // Residential Status
            const residentialStatusSelect = this.$('select[id="residential_status_ah"]')[0];
            if (residentialStatusSelect) {
                this._onchangeResidentialStatus({ target: residentialStatusSelect });
            }

            const currentAddressCheckbox = this.$('#current_address_name_checkbox')[0];
            if (currentAddressCheckbox) {
                this._onChangeCurrentAddressName({ target: currentAddressCheckbox });
            }

            // Employment
            const employmentStatusSelect = this.$('select[id="employment-status"]')[0];
            if (employmentStatusSelect) {
                this._onchangeEmploymentStatusVisibility({ target: employmentStatusSelect });
            }

            const employmentTypeSelect = this.$('select[name="employment_type"]')[0];
            if (employmentTypeSelect) {
                this._onchangeEmploymentType({ target: employmentTypeSelect });
            }

            const currentEmploymentCheckbox = this.$('input[name="is_current_employment"]')[0];
            if (currentEmploymentCheckbox) {
                this._onchangeCurrentEmployment({ target: currentEmploymentCheckbox });
            }

            const startDateInput = this.$('input[name="start_date"]')[0];
            if (startDateInput && startDateInput.value) {
                this._onChangeStartDateDoc({ currentTarget: startDateInput });
            }

            const yearsOfExperienceInput = this.$('input[name="years_of_experience_contract_basis"]')[0];
            if (yearsOfExperienceInput && yearsOfExperienceInput.value) {
                this._onChangeYearsOfExperienceDoc({ currentTarget: yearsOfExperienceInput });
            }

            const annualBonusInput = this.$('input[name="annual_bonus"]')[0];
            if (annualBonusInput && annualBonusInput.value) {
                this._onChangeAnnualBonusDoc({ currentTarget: annualBonusInput });
            }

            const annualSalaryInput = this.$('input[name="annual_salary"]')[0];
            if (annualSalaryInput && annualSalaryInput.value) {
                this._onChangeAnnualSalaryDoc({ currentTarget: annualSalaryInput });
            }

            const hasDeductionsInput = this.$('input[name="has_deductions"]')[0];
            if (hasDeductionsInput) {
                this._onchangeHasDeductions({ target: hasDeductionsInput });
            }

            // Retirement
            const grossMonthlyRetirementInput = this.$('input[name="gross_monthly_retirement_income"]')[0];
            if (grossMonthlyRetirementInput && grossMonthlyRetirementInput.value) {
                this._onChangeGrossMonthlyRetirementIncomeDoc({ currentTarget: grossMonthlyRetirementInput });
            }

            // Self Employment
            const selfEmploymentTypeSelect = this.$('select[name="self_employment_type"]')[0];
            if (selfEmploymentTypeSelect) {
                this._onchangeSelfEmploymentType({ target: selfEmploymentTypeSelect });
            }

            const selfEmploymentStartDateInput = this.$('input[name="self_employment_start_date"]')[0];
            if (selfEmploymentStartDateInput && selfEmploymentStartDateInput.value) {
                this._onChangeSelfEmploymentStartDateDoc({ currentTarget: selfEmploymentStartDateInput });
            }

            const businessBankAccountRadio = this.$('input[name="business_bank_account"]:checked')[0];
            if (businessBankAccountRadio) {
                this._onChangeBusinessBankAccountDoc({ currentTarget: businessBankAccountRadio });
            }

            const hasAccountantRadio = this.$('input[name="has_accountant"]:checked')[0];
            if (hasAccountantRadio) {
                this._onchangeAccountantDetails();
                this._onChangeHasAccountantDoc({ currentTarget: hasAccountantRadio });
            }

            const selfLetPropertiesInput = this.$('input[name="self_let_properties_count_new"]')[0];
            if (selfLetPropertiesInput && selfLetPropertiesInput.value) {
                this._onChangeSelfLetPropertiesCountDoc({ currentTarget: selfLetPropertiesInput });
            }

            // Income
            const incomeTypeSelect = this.$('select[name="income_type"]')[0];
            if (incomeTypeSelect) {
                this._onChangeIncomeTypeDoc({ currentTarget: incomeTypeSelect });
            }

            // Adverse Credit
            const arrearsWithCreditCardRadio = this.$('input[name="arrears_with_credit_card_or_store_cards"]:checked')[0];
            if (arrearsWithCreditCardRadio && arrearsWithCreditCardRadio.value === 'yes') {
                this._onChangeArrearsWithCreditCardDoc({ currentTarget: arrearsWithCreditCardRadio });
            }

            // Commitments
            const commitmentTypeSelect = this.$('select[name="commitment_type"]')[0];
            if (commitmentTypeSelect) {
                this._onchangeCommitmentType({ target: commitmentTypeSelect });
                this._onChangeCommitmentTypeDoc({ currentTarget: commitmentTypeSelect });
            }

            const intendToRepayCheckbox = this.$('input[name="intend_to_repay"]')[0];
            if (intendToRepayCheckbox) {
                this._onChangeIntendToRepayDoc({ currentTarget: intendToRepayCheckbox });
            }

            // Expenses
            const totalExpensesInput = this.$('input[name="total_expenses"]')[0];
            if (totalExpensesInput && totalExpensesInput.value) {
                this._onChangeTotalExpensesDoc({ currentTarget: totalExpensesInput });
            }

            // Deposit
            const depositFromSavingsInput = this.$('input[name="deposit_from_savings"]')[0];
            if (depositFromSavingsInput && depositFromSavingsInput.value) {
                this._onChangeDepositFromSavingsDoc({ currentTarget: depositFromSavingsInput });
            }

            const giftedDepositFromFriendInput = this.$('input[name="gifted_deposit_from_friend"]')[0];
            if (giftedDepositFromFriendInput && giftedDepositFromFriendInput.value) {
                this._onChangeGiftedDepositFromFriendDoc({ currentTarget: giftedDepositFromFriendInput });
            }

            const giftedDepositFromFamilyInput = this.$('input[name="gifted_deposit_from_family"]')[0];
            if (giftedDepositFromFamilyInput && giftedDepositFromFamilyInput.value) {
                this._onChangeGiftedDepositFromFamilyDoc({ currentTarget: giftedDepositFromFamilyInput });
            }

            const giftedFromFamilyCheckbox = this.$('input[name="gifted_deposit_from_family_checkbox"]')[0];
            if (giftedFromFamilyCheckbox) {
                this._onChangeGiftedFromFamily({ currentTarget: giftedFromFamilyCheckbox });
            }

            // Banking
            const accountHolderNameInput = this.$('input[name="ynm-account-holder-name"]')[0];
            if (accountHolderNameInput && accountHolderNameInput.value) {
                this._onChangeAccountHolderNameDoc({ currentTarget: accountHolderNameInput });
            }

            const directDebitCheckbox = this.$('input[id="direct_debit_for_mortgage"]')[0];
            if (directDebitCheckbox) {
                this._togglePreferredDDDate({ target: directDebitCheckbox });
                this._onChangeDirectDebitForMortgageDoc({ currentTarget: directDebitCheckbox });
            }

            // Property Details
            const propertyUsageSelect = this.$('select[name="property_usage"]')[0];
            if (propertyUsageSelect) {
                this._onchangePropertyUsage({ target: propertyUsageSelect });
            }

            const propertyUsageYepSelect = this.$('select[name="property_usage_yep"]')[0];
            if (propertyUsageYepSelect) {
                this._onchangePropertyUsageYep({ target: propertyUsageYepSelect });
            }

            const isNewBuildCheckbox = this.$('input[name="is_new_build"]')[0];
            if (isNewBuildCheckbox) {
                this._onchangeNewBuild();
                this._onChangeIsNewBuildDoc({ currentTarget: isNewBuildCheckbox });
            }

            const houseFlatNoInput = this.$('input[name="house_flat_no"]')[0];
            if (houseFlatNoInput && houseFlatNoInput.value) {
                this._onChangeHouseFlatNoDoc({ currentTarget: houseFlatNoInput });
            }

            const epcPredictedRateSelect = this.$('select[name="epc_predicted_epc_rate"]')[0];
            if (epcPredictedRateSelect) {
                this._onChangeEpcPredictedEpcRateDoc({ currentTarget: epcPredictedRateSelect });
            }

            const peaRateSelect = this.$('select[name="pea_rate"]')[0];
            if (peaRateSelect) {
                this._onChangePeaRateDoc({ currentTarget: peaRateSelect });
            }

            const helpToBuyCheckbox = this.$('input[name="help_to_buy_loan"]')[0];
            if (helpToBuyCheckbox) {
                this._onChangeHelpToBuyLoanDoc({ currentTarget: helpToBuyCheckbox });
            }

            const htbSchemeAvailableSelect = this.$('select[name="htb_scheme_available_yep"]')[0];
            if (htbSchemeAvailableSelect) {
                this._onchangeHtbSchemeAvailable({ target: htbSchemeAvailableSelect });
            }

            const estimatedMonthlyRentalInput = this.$('input[name="estimated_monthly_rental_income"]')[0];
            if (estimatedMonthlyRentalInput && estimatedMonthlyRentalInput.value) {
                this._onChangeEstimatedMonthlyRentalIncomeDoc({ currentTarget: estimatedMonthlyRentalInput });
            }

            const currentMonthlyRentalInput = this.$('input[name="current_monthly_rental_income"]')[0];
            if (currentMonthlyRentalInput && currentMonthlyRentalInput.value) {
                this._onChangeCurrentMonthlyRentalIncomeDoc({ currentTarget: currentMonthlyRentalInput });
            }

            const hmoCheckbox = this.$('input[id="hmo"]')[0];
            if (hmoCheckbox) {
                this._onchangeHMO({ target: hmoCheckbox });
                this._onChangeHmoDoc({ currentTarget: hmoCheckbox });
            }

            const companyNameInput = this.$('input[name="company_name"]')[0];
            if (companyNameInput && companyNameInput.value) {
                this._onChangeCompanyNameDoc({ currentTarget: companyNameInput });
            }

            const monthlyRentalIncomeInput = this.$('input[name="monthly_rental_income"]')[0];
            if (monthlyRentalIncomeInput && monthlyRentalIncomeInput.value) {
                this._onChangeMonthlyRentalIncomeDoc({ currentTarget: monthlyRentalIncomeInput });
            }

            const monthlyPaymentInput = this.$('input[name="monthly_payment"]')[0];
            if (monthlyPaymentInput && monthlyPaymentInput.value) {
                this._onChangeMonthlyPaymentDoc({ currentTarget: monthlyPaymentInput });
            }

            const additionalBorrowingCheckbox = this.$('input[name="additional_borrowing"]')[0];
            if (additionalBorrowingCheckbox) {
                this._onChangeAdditionalBurrow({ currentTarget: additionalBorrowingCheckbox });
            }

            const sharedOwnershipCheckbox = this.$('input[id="shared_ownership_existing"]')[0];
            if (sharedOwnershipCheckbox) {
                this._onchangeSharedOwnershipAvailable({ target: sharedOwnershipCheckbox });
            }

            const sharedOwnershipYepSelect = this.$('select[id="shared_ownership_available_yep"]')[0];
            if (sharedOwnershipYepSelect) {
                this._onchangeSharedOwnershipAvailableYep({ target: sharedOwnershipYepSelect });
            }

            const tenureSelect = this.$('select#tenure')[0];
            if (tenureSelect) {
                this._onchangeTenure({ target: tenureSelect });
            }

            const estimatedBuiltYearSelect = this.$('select[name="estimated_built_year"]')[0];
            if (estimatedBuiltYearSelect) {
                this._toggleWarrantyProvidersField({ target: estimatedBuiltYearSelect });
            }

            const commuteOverOneHourCheckbox = this.$('input[id="commute_over_one_hour"]')[0];
            if (commuteOverOneHourCheckbox) {
                this._toggleMonthlyCommuteCost({ target: commuteOverOneHourCheckbox });
            }

            // Insurance & Protection
            const existingProtectionCheckbox = this.$('input[id="existing_protection_cover"]')[0];
            if (existingProtectionCheckbox) {
                this._onchangeEmployerSickPayBenefit({ target: existingProtectionCheckbox });
            }

            const employerSickPayCheckbox = this.$('input[id="employer_sick_pay_benefit"]')[0];
            if (employerSickPayCheckbox) {
                this._onchangeEmployerSickPayBenefit({ target: employerSickPayCheckbox });
            }

            const smokingSelect = this.$('select[name="smoking"]')[0];
            if (smokingSelect) {
                this._onchangeSmokingStatus({ target: smokingSelect });
            }

            const alcoholConsumptionSelect = this.$('select[name="alcohol_consumption_comment"]')[0];
            if (alcoholConsumptionSelect) {
                this._onchangeAlcoholStatus({ target: alcoholConsumptionSelect });
                this._onAlcoholConsumptionChange({ target: alcoholConsumptionSelect });
            }

            const medicalConditionsCheckbox = this.$('input[id="medical_conditions"]')[0];
            if (medicalConditionsCheckbox) {
                this._onchangeMedicalCondition();
            }

            const takingMedicinesCheckbox = this.$('input[id="taking_medicines"]')[0];
            if (takingMedicinesCheckbox) {
                this._onchangeTakingMeds();
            }

            const healthConditionsSelect = this.$('select[name="health_conditions"]')[0];
            if (healthConditionsSelect) {
                this._onchangeHealthConditions({ target: healthConditionsSelect });
            }

            const healthConditionReportedSelect = this.$('select[name="health_condition_reported"]')[0];
            if (healthConditionReportedSelect) {
                this._onHealthConditionReportedChange({ target: healthConditionReportedSelect });
            }

            const pastTravelsReportedSelect = this.$('select[name="past_travels_reported"]')[0];
            if (pastTravelsReportedSelect) {
                this._onPastTravelsReportedChange({ target: pastTravelsReportedSelect });
            }

            const futureTravelsReportedSelect = this.$('select[name="future_travels_reported"]')[0];
            if (futureTravelsReportedSelect) {
                this._onFutureTravelsReportedChange({ target: futureTravelsReportedSelect });
            }

            const criticalIllnessReportedSelect = this.$('select[name="critical_illness_reported"]')[0];
            if (criticalIllnessReportedSelect) {
                this._onCriticalIllnessReportedChange({ target: criticalIllnessReportedSelect });
            }

        },

        _onAnotherNameCheckboxChange: function (ev) {
            const $checkbox = $(ev.currentTarget);
            if ($checkbox.is(':checked')) {
                $('.alteration_passport').removeClass('d-none')
            } else {
                $('.alteration_passport').addClass('d-none');
            }
        },




        _onChangeSettledStatusDoc: function (ev) {
            const $select = $(ev.currentTarget);
            const value = $select.val();
            if (value) {
                $('.sharecode_immigration_status').removeClass('d-none');
            } else {
                $('.sharecode_immigration_status').addClass('d-none');
            }
        },

        _onChangeStartDateDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                const startDate = new Date(value);
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                if (startDate >= sixMonthsAgo) {
                    $('.employment_appointment_letter').removeClass('d-none');
                } else {
                    $('.employment_appointment_letter').addClass('d-none');
                }
            } else {
                $('.employment_appointment_letter').addClass('d-none');
            }
        },

        _onChangeYearsOfExperienceDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.employment_contract').removeClass('d-none');
            } else {
                $('.employment_contract').addClass('d-none');
            }
        },

        _onChangeAnnualBonusDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.last_2_years_bonus_payslips').removeClass('d-none');
            } else {
                $('.last_2_years_bonus_payslips').addClass('d-none');
            }
        },

        _onChangeAnnualSalaryDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.last_3_months_payslips').removeClass('d-none');
                $('.last_2_years_p60').removeClass('d-none');
                $('.last_3_months_bank_statements_salary').removeClass('d-none');
                $('.salary_increment_letter').removeClass('d-none');
                $('.name_confirmation_letter').removeClass('d-none');
            } else {
                $('.last_3_months_payslips').addClass('d-none');
                $('.last_2_years_p60').addClass('d-none');
                $('.last_3_months_bank_statements_salary').addClass('d-none');
                $('.salary_increment_letter').addClass('d-none');
                $('.name_confirmation_letter').addClass('d-none');
            }
        },

        _onChangeGrossMonthlyRetirementIncomeDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.last_3_months_bank_statements_pension').removeClass('d-none');
                $('.pension_forecast_statement').removeClass('d-none');
            } else {
                $('.last_3_months_bank_statements_pension').addClass('d-none');
                $('.pension_forecast_statement').addClass('d-none');
            }
        },

        _onChangeSelfEmploymentStartDateDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.last_2_years_tax_calculations').removeClass('d-none');
                $('.last_2_years_tax_year_overview').removeClass('d-none');
                $('.last_2_years_tax_returns').removeClass('d-none');
            } else {
                $('.last_2_years_tax_calculations').addClass('d-none');
                $('.last_2_years_tax_year_overview').addClass('d-none');
                $('.last_2_years_tax_returns').addClass('d-none');
            }
        },

        _onChangeBusinessBankAccountDoc: function (ev) {
            const $radio = $(ev.currentTarget);
            const value = $radio.val();
            if (value === 'true') {
                $('.latest_3_months_company_bank_statements').removeClass('d-none');
            } else {
                $('.latest_3_months_company_bank_statements').addClass('d-none');
            }
        },

        _onChangeHasAccountantDoc: function (ev) {
            const $radio = $(ev.currentTarget);
            const value = $radio.val();
            if (value === 'true') {
                $('.signed_finalized_latest_2_years_company_accounts').removeClass('d-none');
            } else {
                $('.signed_finalized_latest_2_years_company_accounts').addClass('d-none');
            }
        },

        _onChangeSelfLetPropertiesCountDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.last_2_years_tax_calculations').removeClass('d-none');
                $('.last_2_years_tax_year_overview').removeClass('d-none');
                $('.last_2_years_tax_returns').removeClass('d-none');
            } else {
                $('.last_2_years_tax_calculations').addClass('d-none');
                $('.last_2_years_tax_year_overview').addClass('d-none');
                $('.last_2_years_tax_returns').addClass('d-none');
            }
        },

        _onChangeIncomeTypeDoc: function (ev) {
            const $select = $(ev.currentTarget);
            const value = $select.val();
            if (value) {
                $('.other_income_bank_statements').removeClass('d-none');
                $('.tax_credit_statement').removeClass('d-none');
                $('.universal_tax_credit_statements').removeClass('d-none');
                $('.child_tax_credit_award_letter').removeClass('d-none');
                $('.pip_dla_letter').removeClass('d-none');
            } else {
                $('.other_income_bank_statements').addClass('d-none');
                $('.tax_credit_statement').addClass('d-none');
                $('.universal_tax_credit_statements').addClass('d-none');
                $('.child_tax_credit_award_letter').addClass('d-none');
                $('.pip_dla_letter').addClass('d-none');
            }
        },

        _onChangeArrearsWithCreditCardDoc: function (ev) {
            const $radio = $(ev.currentTarget);
            const value = $radio.val();
            if (value === 'yes') {
                $('.latest_multi_agency_credit_report').removeClass('d-none');
            } else {
                $('.latest_multi_agency_credit_report').addClass('d-none');
            }
        },

        _onChangeCommitmentTypeDoc: function (ev) {
            const $select = $(ev.currentTarget);
            const value = $select.val();
            if (value) {
                $('.latest_multi_agency_credit_report').removeClass('d-none');
            } else {
                $('.latest_multi_agency_credit_report').addClass('d-none');
            }
        },

        _onChangeIntendToRepayDoc: function (ev) {
            const $checkbox = $(ev.currentTarget);
            if ($checkbox.is(':checked')) {
                $('.latest_clearance_statement').removeClass('d-none');
            } else {
                $('.latest_clearance_statement').addClass('d-none');
            }
        },

        _onChangeTotalExpensesDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.monthly_expenses_bank_statements').removeClass('d-none');
            } else {
                $('.monthly_expenses_bank_statements').addClass('d-none');
            }
        },

        _onChangeDepositFromSavingsDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.gifted_deposit_bank_statements').removeClass('d-none');
            } else {
                $('.gifted_deposit_bank_statements').addClass('d-none');
            }
        },

        _onChangeGiftedDepositFromFriendDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.gifted_deposit_format').removeClass('d-none');
            } else {
                $('.gifted_deposit_format').addClass('d-none');
            }
        },

        _onChangeGiftedDepositFromFamilyDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.gifted_deposit_format').removeClass('d-none');
            } else {
                $('.gifted_deposit_format').addClass('d-none');
            }
        },

        _onChangeAccountHolderNameDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.bank_statement_name_confirmation').removeClass('d-none');
            } else {
                $('.bank_statement_name_confirmation').addClass('d-none');
            }
        },

        _onChangeDirectDebitForMortgageDoc: function (ev) {
            const $checkbox = $(ev.currentTarget);
            if ($checkbox.is(':checked')) {
                $('.requested_direct_debit_bank_statement').removeClass('d-none');
            } else {
                $('.requested_direct_debit_bank_statement').addClass('d-none');
            }
        },

        _onChangeIsNewBuildDoc: function (ev) {
            const $checkbox = $(ev.currentTarget);
            if ($checkbox.is(':checked')) {
                $('.reservation_form').removeClass('d-none');
                $('.cml_form').removeClass('d-none');
            } else {
                $('.reservation_form').addClass('d-none');
                $('.cml_form').addClass('d-none');
            }
        },

        _onChangeHouseFlatNoDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.memorandum_of_sale').removeClass('d-none');
            } else {
                $('.memorandum_of_sale').addClass('d-none');
            }
        },

        _onChangeEpcPredictedEpcRateDoc: function (ev) {
            const $select = $(ev.currentTarget);
            const value = $select.val();
            if (value) {
                $('.epc').removeClass('d-none');
            } else {
                $('.epc').addClass('d-none');
            }
        },

        _onChangePeaRateDoc: function (ev) {
            const $select = $(ev.currentTarget);
            const value = $select.val();
            if (value) {
                $('.pea').removeClass('d-none');
            } else {
                $('.pea').addClass('d-none');
            }
        },

        _onChangeHelpToBuyLoanDoc: function (ev) {
            const $checkbox = $(ev.currentTarget);
            if ($checkbox.is(':checked')) {
                $('.annual_payment_information_letter').removeClass('d-none');
            } else {
                $('.annual_payment_information_letter').addClass('d-none');
            }
        },

        _onChangeEstimatedMonthlyRentalIncomeDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.arla_letter').removeClass('d-none');
                $('.sales_particular').removeClass('d-none');
            } else {
                $('.arla_letter').addClass('d-none');
                $('.sales_particular').addClass('d-none');
            }
        },

        _onChangeCurrentMonthlyRentalIncomeDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.tenancy_agreement').removeClass('d-none');
                $('.latest_3_months_bank_statements_rental').removeClass('d-none');
                $('.latest_3_months_bank_statements_mortgage').removeClass('d-none');
                $('.mortgage_statement').removeClass('d-none');
            } else {
                $('.tenancy_agreement').addClass('d-none');
                $('.latest_3_months_bank_statements_rental').addClass('d-none');
                $('.latest_3_months_bank_statements_mortgage').addClass('d-none');
                $('.mortgage_statement').addClass('d-none');
            }
        },

        _onChangeHmoDoc: function (ev) {
            const $checkbox = $(ev.currentTarget);
            if ($checkbox.is(':checked')) {
                $('.tenancy_agreements_multiple_occupants').removeClass('d-none');
            } else {
                $('.tenancy_agreements_multiple_occupants').addClass('d-none');
            }
        },

        _onChangeCompanyNameDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.spv_bank_statements').removeClass('d-none');
            } else {
                $('.spv_bank_statements').addClass('d-none');
            }
        },

        _onChangeMonthlyRentalIncomeDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.tenancy_agreement').removeClass('d-none');
                $('.latest_3_months_bank_statements_rental').removeClass('d-none');
                $('.latest_3_months_bank_statements_mortgage').removeClass('d-none');
            } else {
                $('.tenancy_agreement').addClass('d-none');
                $('.latest_3_months_bank_statements_rental').addClass('d-none');
                $('.latest_3_months_bank_statements_mortgage').addClass('d-none');
            }
        },

        _onChangeMonthlyPaymentDoc: function (ev) {
            const $input = $(ev.currentTarget);
            const value = $input.val();
            if (value) {
                $('.mortgage_statement').removeClass('d-none');
            } else {
                $('.mortgage_statement').addClass('d-none');
            }
        },

















           _onChangeCurrentAddressName: function (event) {
                const checkbox = event.target;
                const dateMovedOutContainer = this.$('.date-moved-out-container');

                if (checkbox.checked) {
                    // Hide the date moved out container if checked
                    dateMovedOutContainer.hide();
                } else {
                    // Show the container if not checked
                    dateMovedOutContainer.show();
                }
            },

          _validateEmailAddress: function (ev) {
            const emailAddressInput = ev.target;
            const inputValue = emailAddressInput.value.trim();
            const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

            if (!isValidFormat) {
                emailAddressInput.classList.add('is-invalid');
            } else {
                emailAddressInput.classList.remove('is-invalid');
            }
         },

          _validateMobileNumber: function (ev) {
            const mobileNumberInput = ev.target;
            const inputValue = mobileNumberInput.value.trim();
            const isValid = /^\d{11}$/.test(inputValue);

            const feedbackElement = mobileNumberInput.nextElementSibling;

            if (!isValid) {
                mobileNumberInput.classList.add('is-invalid');
                mobileNumberInput.classList.remove('is-valid');
                feedbackElement.style.display = 'block';
            } else {
                mobileNumberInput.classList.add('is-valid');
                mobileNumberInput.classList.remove('is-invalid');
                feedbackElement.style.display = 'none';
            }
         },

         _validateHomeTelephone: function (ev) {
            const mobileNumberInput = ev.target;
            const inputValue = mobileNumberInput.value.trim();
            const isValid = /^\d{11}$/.test(inputValue);
            const feedbackElement = mobileNumberInput.nextElementSibling;
            if (!inputValue){
                mobileNumberInput.classList.add('is-valid');
                mobileNumberInput.classList.remove('is-invalid');
                feedbackElement.style.display = 'none';
                return;
            }
            if (!isValid) {
                mobileNumberInput.classList.add('is-invalid');
                mobileNumberInput.classList.remove('is-valid');
                feedbackElement.style.display = 'block';
            } else {
                mobileNumberInput.classList.add('is-valid');
                mobileNumberInput.classList.remove('is-invalid');
                feedbackElement.style.display = 'none';
            }
         },

          _validateMobileNumberEstateAgent: function (ev) {
                const mobileNumberInput = ev.target;
                const inputValue = mobileNumberInput.value.trim();
                const isValid = /^\d{11}$/.test(inputValue);

                if (!isValid) {
                    mobileNumberInput.classList.add('is-invalid');
                } else {
                    mobileNumberInput.classList.remove('is-invalid');
                }
          },

//          _validateAccountOpenDate: function(ev){
//            const inputDate = ev.target;
//
//          }

          _validateMobileNumberSolicitor: function (ev) {
                const input = ev.target;
                const value = input.value.trim();
                const isValid = /^\d{11}$/.test(value);

                if (!isValid) {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            },

          _onClickNoDependants: function (ev) {
                const popup = document.getElementById('no-dependants-popup');
                if (!popup) return;

                popup.classList.remove('d-none');

                const confirmBtn = popup.querySelector('.btn-confirm');
                const cancelBtn = popup.querySelector('.btn-cancel');

                // Detach previous handlers if any
//                confirmBtn.onclick = null;
                cancelBtn.onclick = null;

                // Handle confirm
//                confirmBtn.onclick = () => {
//                    popup.classList.add('d-none');
//                    const nextSectionButton = document.querySelector('.btn-next');
//                    if (nextSectionButton) {
//                        nextSectionButton.classList.remove('d-none');
//                        nextSectionButton.click();
//                    }
//                };

                // Handle cancel
                cancelBtn.onclick = () => {
                    popup.classList.add('d-none');
                };
            },

          _validateWorkTelephone: function (ev) {
            const workTelephoneInput = ev.target;
            const inputValue = workTelephoneInput.value.trim();
            const isValid = /^\d{11}$/.test(inputValue);

            if (!isValid) {
                workTelephoneInput.classList.add('is-invalid');
            } else {
                workTelephoneInput.classList.remove('is-invalid');
            }
         },

          _validateBusinessContact: function (ev) {
               const businessContactInput = ev.target;
               const inputValue = businessContactInput.value.trim();
               const isValid = /^\d{11}$/.test(inputValue);

               if (!isValid) {
                   businessContactInput.classList.add('is-invalid');
               } else {
                   businessContactInput.classList.remove('is-invalid');
               }
            },

          _validateDateOfNameChange: function (ev) {
                   const dateInput = ev.target;
                   const inputValue = dateInput.value.trim();
                   const selectedDate = new Date(inputValue);
                   const today = new Date();

                   // Reset the invalid state first
                   dateInput.classList.remove('is-invalid');

                   // Check if the selected date is in the future
                   if (selectedDate > today) {
                       dateInput.classList.add('is-invalid')
                   }
               },

          _validateDateMovedTo: function (ev) {
            const dateMovedToInput = ev.target;
            const inputValue = dateMovedToInput.value.trim();
            const today = new Date();
            const selectedDate = new Date(inputValue);

            // Check if date is invalid (empty, invalid date, or future date)
            const isInvalid = !inputValue ||
                              isNaN(selectedDate.getTime()) ||
                              selectedDate > today;

            if (isInvalid) {
                // Add Bootstrap's invalid class to the input
                dateMovedToInput.classList.add('is-invalid');
                dateMovedToInput.classList.remove('is-valid');

                // Show the error message div
                const errorDiv = dateMovedToInput.parentElement.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                    // Update error message based on the type of error
                    if (!inputValue) {
                        errorDiv.textContent = 'Please enter a date';
                    } else if (isNaN(selectedDate.getTime())) {
                        errorDiv.textContent = 'Please enter a valid date';
                    } else if (selectedDate > today) {
                        errorDiv.textContent = 'Date cannot be in the future';
                    }
                }
            } else {
                // Remove invalid class and add valid class
                dateMovedToInput.classList.remove('is-invalid');
                dateMovedToInput.classList.add('is-valid');

                // Hide the error message div
                const errorDiv = dateMovedToInput.parentElement.querySelector('.invalid-feedback');
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
            }
        },

          _validateSelfEmploymentContact: function (ev) {
              const selfContactInput = ev.target;
              const inputValue = selfContactInput.value.trim();
              const isValid = /^\d{11}$/.test(inputValue);

              if (!isValid) {
                  selfContactInput.classList.add('is-invalid');
              } else {
                  selfContactInput.classList.remove('is-invalid');
              }
          },

          _validateDateMovedOut: function (ev) {
                const dateMovedOutInput = ev.target;
                const inputValue = dateMovedOutInput.value.trim();
                const today = new Date();
                const selectedDate = new Date(inputValue);

                // Get date moved in for comparison
                const dateMovedInInput = document.getElementById('date-moved-to-this-address');
                const dateMovedInValue = dateMovedInInput ? dateMovedInInput.value.trim() : '';
                const dateMovedIn = dateMovedInValue ? new Date(dateMovedInValue) : null;

                // Check if date is invalid
                let isInvalid = false;
                let errorMessage = '';

                if (!inputValue) {
                    // Date moved out can be empty (for current address)
                    isInvalid = false;
                } else if (isNaN(selectedDate.getTime())) {
                    isInvalid = true;
                    errorMessage = 'Please enter a valid date';
                } else if (selectedDate > today) {
                    isInvalid = true;
                    errorMessage = 'Date cannot be in the future';
                } else if (dateMovedIn && selectedDate <= dateMovedIn) {
                    isInvalid = true;
                    errorMessage = 'Date moved out must be after date moved in';
                }

                if (isInvalid) {
                    dateMovedOutInput.classList.add('is-invalid');
                    dateMovedOutInput.classList.remove('is-valid');

                    const errorDiv = dateMovedOutInput.parentElement.querySelector('.invalid-feedback');
                    if (errorDiv) {
                        errorDiv.style.display = 'block';
                        errorDiv.textContent = errorMessage;
                    }
                } else {
                    dateMovedOutInput.classList.remove('is-invalid');
                    if (inputValue) {
                        dateMovedOutInput.classList.add('is-valid');
                    }

                    const errorDiv = dateMovedOutInput.parentElement.querySelector('.invalid-feedback');
                    if (errorDiv) {
                        errorDiv.style.display = 'none';
                    }
                }
          },

          _togglePreferredDDDate: function (ev) {
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

          _onAlcoholConsumptionChange: function (ev) {
              const selectedValue = ev.target.value;

              const stopDrinkingDate = document.querySelector('.stop_drinking_date');
              const frequencyOfDrinking = document.querySelector('.frequency_of_drinking');
              const typeOfDrink = document.querySelector('.type_of_drink');
              const alcoholConsumptionAmount = document.querySelector('.alcohol_consumption_amount');

              if (selectedValue === 'currently_drinking') {
                  stopDrinkingDate.classList.add('d-none');
                  frequencyOfDrinking.classList.remove('d-none');
                  typeOfDrink.classList.remove('d-none');
                  alcoholConsumptionAmount.classList.remove('d-none');
              } else if (selectedValue === 'stopped_drinking') {
                  stopDrinkingDate.classList.remove('d-none');
                  frequencyOfDrinking.classList.add('d-none');
                  typeOfDrink.classList.add('d-none');
                  alcoholConsumptionAmount.classList.add('d-none');
              } else {
                  stopDrinkingDate.classList.add('d-none');
                  frequencyOfDrinking.classList.add('d-none');
                  typeOfDrink.classList.add('d-none');
                  alcoholConsumptionAmount.classList.add('d-none');
              }
          },

          _toggleWarrantyProvidersField: function (ev) {
            const selectedYear = parseInt(ev.target.value, 10);
            const currentYear = new Date().getFullYear();
            const warrantyFieldDiv = document.querySelector('.warranty_providers_name_field');

            if (selectedYear && selectedYear >= currentYear - 10) {
                warrantyFieldDiv.classList.remove('d-none');
            } else {
                warrantyFieldDiv.classList.add('d-none');
            }
        },

          _validatePersonalDOB: function (ev) {
            const dobInput = ev.target;
            const inputValue = dobInput.value.trim();
            const today = new Date();
            const selectedDate = new Date(inputValue);

            if (!inputValue || selectedDate > today) {
                dobInput.classList.add('is-invalid');
            } else {
                dobInput.classList.remove('is-invalid');
            }
         },

          _validateStartDate: function (ev) {
            const startDateInput = ev.target;
            const inputValue = startDateInput.value.trim();
            const today = new Date();
            const selectedDate = new Date(inputValue);

            const invalidFeedback = startDateInput.nextElementSibling;

            if (!inputValue || selectedDate > today) {
                startDateInput.classList.add('is-invalid');
                if (invalidFeedback) {
                    invalidFeedback.style.display = 'block';
                }
            } else {
                startDateInput.classList.remove('is-invalid');
                if (invalidFeedback) {
                    invalidFeedback.style.display = 'none';
                }
            }
         },

          _toggleMonthlyCommuteCost: function (ev) {
            const checkbox = ev.target;
            const monthlyCommuteCostDiv = document.querySelector('.monthly_commute_cost_field');

            if (checkbox.checked) {
                // Remove 'd-none' class to show the Monthly Commute Cost field
                monthlyCommuteCostDiv.classList.remove('d-none');
            } else {
                // Add 'd-none' class to hide the Monthly Commute Cost field
                monthlyCommuteCostDiv.classList.add('d-none');
            }
        },

         _validateDependantDateOfBirth: function (ev) {
            const depDobInput = ev.target;
            const inputValue = depDobInput.value.trim();
            const today = new Date();
            const selectedDate = new Date(inputValue);

            if (!inputValue || selectedDate > today) {
                depDobInput.classList.add('is-invalid');
            } else {
                depDobInput.classList.remove('is-invalid');
            }
         },

         _onchangeKnownByAnotherName: function () {
            const knownByAnotherNameCheckbox = this.$('.kbn_check');
            const previousSurnameField = this.$('.previous_surname');
            const dateOfNameChangeField = this.$('.date_of_name_change');

            // Show or hide the fields based on the checkbox state
            if (knownByAnotherNameCheckbox.is(':checked')) {
                previousSurnameField.show().find("input").attr("data-required", "true");
                dateOfNameChangeField.show().find("input").attr("data-required", "true");

            } else {
                previousSurnameField.hide().find("input").removeAttr("data-required").val("");
                dateOfNameChangeField.hide().find("input").removeAttr("data-required").val("");
            }
        },

         _onchangeIndefiniteLeaveToRemain: function (ev) {
            const $select = $(ev.currentTarget);
            const ilrValue = $select.val();

            // Field visibility logic
            const visaCategoryField = $('.visa_category');
            if (ilrValue === 'yes') {
                visaCategoryField.addClass('d-none');
            } else if (ilrValue === 'no') {
                visaCategoryField.removeClass('d-none');
            }

            // Document visibility logic (merged from _onChangeIndefiniteLeaveToRemainDoc)
            if (ilrValue === 'no') {
                $('.sharecode_immigration_status').removeClass('d-none');
            } else {
                $('.sharecode_immigration_status').addClass('d-none');
            }
        },

         _onchangeCurrentEmployment: function (event) {
            const isCurrentEmploymentChecked = event.target.checked;
            const endDateField = document.querySelector('.end_date');
            if (endDateField) {
                if (isCurrentEmploymentChecked) {
                    endDateField.classList.add('d-none');
                } else {
                    endDateField.classList.remove('d-none');
                }
            }
        },

         _onchangeNationalityField: function (ev) {
            const $select = $(ev.currentTarget);
            const nationalityValue = $select.val();

            // Field visibility logic
            const settledStatusField = $('.settled_status');
            const dualNationalityField = $('.dual_nationality');
            const indefiniteLeaveToRemainField = $('.indefinite_leave_to_remain');
            const otherNationalityField = $('.other_nationality');
            const euCountryListField = $('.eu_country_list');

            if (nationalityValue === 'british') {
                otherNationalityField.addClass('d-none');
                dualNationalityField.addClass('d-none');
                euCountryListField.addClass('d-none');
                settledStatusField.addClass('d-none');
                indefiniteLeaveToRemainField.addClass('d-none');
            } else if (nationalityValue === 'eu') {
                settledStatusField.removeClass('d-none');
                dualNationalityField.removeClass('d-none');
                otherNationalityField.addClass('d-none');
                euCountryListField.removeClass('d-none');
            } else if (nationalityValue === 'other') {
                indefiniteLeaveToRemainField.removeClass('d-none');
                settledStatusField.addClass('d-none');
                dualNationalityField.removeClass('d-none');
                otherNationalityField.removeClass('d-none');
                euCountryListField.addClass('d-none');
            }

            // Document visibility logic (merged from _onChangeNationalityDoc)
            if (nationalityValue) {
                $('.passport_pages').removeClass('d-none');
            } else {
                $('.passport_pages').addClass('d-none');
            }
        },

         _validateSelfEmploymentStartDate: function (event) {
            const startDateInput = event.target; // The input field
            const startDateValue = new Date(startDateInput.value); // Selected date
            const currentDate = new Date();

            // Calculate the date 6 months ago
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

            // Get the error feedback div
            const errorDiv = document.getElementById('start_date_error');

            if (startDateValue >= sixMonthsAgo) {
                // Invalid: Show error and mark input as invalid
                errorDiv.style.display = 'block';
                startDateInput.classList.add('is-invalid');
            } else {
                // Valid: Hide error and remove invalid class
                errorDiv.style.display = 'none';
                startDateInput.classList.remove('is-invalid');
            }
        },

         _onchangePassportExpiryDate: function(ev) {
          const passportExpiryDateInput = ev.target;
          const inputValue = passportExpiryDateInput.value.trim();
          const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(inputValue);

          // Find existing feedback or create new one (look for both classes)
          let $feedback = $(passportExpiryDateInput).siblings('.invalid-feedback, .text-warning');
          if (!$feedback.length) {
              $feedback = $('<div class="invalid-feedback"></div>');
              $(passportExpiryDateInput).after($feedback);
          }

          // Clear all previous states first
          passportExpiryDateInput.classList.remove('is-invalid', 'text-warning');
          $feedback.removeClass('invalid-feedback', 'text-warning').hide();

          // Validation and color change logic
          if (!inputValue) {
              // Empty input - just hide feedback
              $feedback.hide();
          } else if (!isValidFormat) {
              // Invalid format
              passportExpiryDateInput.classList.add('is-invalid');
              $feedback.addClass('invalid-feedback').text('Invalid date format').show();
          } else {
              // Valid format - check if expired
              const expiryDate = moment(inputValue, "YYYY-MM-DD");
              const today = moment();
              if (expiryDate.isBefore(today)) {
                  // Expired - show warning with color change
                  passportExpiryDateInput.classList.add('text-warning');
                  $feedback.addClass('text-warning').text('Expired').show();
              } else {
                  // Valid future date - remove all warnings
                  passportExpiryDateInput.classList.remove('is-invalid', 'text-warning');
                  $feedback.removeClass('invalid-feedback', 'text-warning').hide();
              }
          }

          // Document visibility logic (merged from _onchangePassportExpiryDateDoc)
          if (inputValue && isValidFormat) {
              const selectedDate = new Date(inputValue);
              const today = new Date();
              const expireElm = $('.expired_passport_driving_license');
              if (selectedDate < today) {
                  expireElm.removeClass('d-none');
              } else {
                  expireElm.addClass('d-none');
              }
          } else {
              // Hide document section if input is empty or invalid
              $('.expired_passport_driving_license').addClass('d-none');
          }
        },

         _onchangeResidentialStatus: function (ev) {
            var selectedOption = ev.target.value;

            // Current Landlord Fields
            var currentLandlordName = this.$('.current_landlord_name');
            var currentLandlordAddress = this.$('.current_landlord_address');
            var currentLandlordPostcode = this.$('.current_landlord_postcode');
            var currentLandlordContactNo = this.$('.current_landlord_contact_no');

            // Local Authority Fields
            var localAuthorityName = this.$('.local_authority_name');
            var localAuthorityPostcode = this.$('.local_authority_postcode');
            var localAuthorityAddress = this.$('.local_authority_address');

            // Only proceed if the lead state is 'illustration'

//                if (selectedOption === 'renting_private') {
                    // Show Current Landlord Fields
//                    currentLandlordName.removeClass('d-none');
//                    currentLandlordAddress.removeClass('d-none');
//                    currentLandlordPostcode.removeClass('d-none');
//                    currentLandlordContactNo.removeClass('d-none');
//
//                    // Hide Local Authority Fields
//                    localAuthorityName.addClass('d-none');
//                    localAuthorityPostcode.addClass('d-none');
//                    localAuthorityAddress.addClass('d-none');
//                } else if (selectedOption === 'renting_local_authority') {
//                    // Show Local Authority Fields
//                    localAuthorityName.removeClass('d-none');
//                    localAuthorityPostcode.removeClass('d-none');
//                    localAuthorityAddress.removeClass('d-none');
//
//                    // Hide Current Landlord Fields
//                    currentLandlordName.addClass('d-none');
//                    currentLandlordAddress.addClass('d-none');
//                    currentLandlordPostcode.addClass('d-none');
//                    currentLandlordContactNo.addClass('d-none');
//                } else {
//                    // Hide all fields if none of the options are selected
//                    currentLandlordName.addClass('d-none');
//                    currentLandlordAddress.addClass('d-none');
//                    currentLandlordPostcode.addClass('d-none');
//                    currentLandlordContactNo.addClass('d-none');
//                    localAuthorityName.addClass('d-none');
//                    localAuthorityPostcode.addClass('d-none');
//                    localAuthorityAddress.addClass('d-none');
//                }

        },

         _onchangeDateOfBirth: function (ev) {
            const dobInput = ev.target;
            const dob = new Date(dobInput.value);
            const monthlyChildcareCostField = document.querySelector('.monthly_childcare_cost');
            const childcareCostReasonField = document.querySelector('.childcare_cost_reason');
            const dependencyPeriodField = document.querySelector('.dependency_period');
            const additionalCostField = document.querySelector('.additional_cost');

            if (!dob.getTime()) {
                console.warn('Invalid date of birth entered.');
                return; // Handle invalid date gracefully
            }

            const today = new Date();
            const ageInYears = Math.floor(Math.abs(today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365));

            const dependencyTypeSelect = this.$('select[name="dependency_type"]');
            if (dependencyTypeSelect.length) {
                const dependencyType = ageInYears >= 18 ? 'adult' : 'child';
                dependencyTypeSelect.val(dependencyType);
                dependencyTypeSelect.trigger('change');

                // Update visibility of additional_cost based on dependency type
                if (dependencyType === 'adult') {
                    additionalCostField.classList.remove('d-none');
                } else {
                    additionalCostField.classList.add('d-none');
                }
            } else {
                console.warn('Dependency type select element not found.');
            }

            if (monthlyChildcareCostField && childcareCostReasonField) {
                if (ageInYears < 10) {
                    monthlyChildcareCostField.classList.remove('d-none');
                    childcareCostReasonField.classList.remove('d-none');
                    dependencyPeriodField.classList.remove('d-none');
                } else {
                    monthlyChildcareCostField.classList.add('d-none');
                    childcareCostReasonField.classList.add('d-none');
                    dependencyPeriodField.classList.add('d-none');
                }
            }
        },

         _onchangeEmploymentStatusVisibility: function (ev) {
            const employmentStatus = ev.target.value;
            const employmentDetails = document.querySelector('.employment-details');
            const retired = document.querySelector('.retired');

            if (employmentStatus === 'employed') {
                employmentDetails.classList.remove('d-none');
                retired.classList.add('d-none');
            }else if (employmentStatus === 'retired') {
                employmentDetails.classList.add('d-none');
                retired.classList.remove('d-none');
            } else {
                // Optionally hide both sections if neither condition is met
                employmentDetails.classList.add('d-none');
                retired.classList.add('d-none');
            }
        },

         _calculateRetirementIncome: function () {
            const grossMonthlyRetirementIncomeInput = document.getElementById("gross_monthly_retirement_income");
            const annualRetirementIncomeInput = document.getElementById("annual_retirement_income");

            if (grossMonthlyRetirementIncomeInput && annualRetirementIncomeInput) {
                const grossMonthlyRetirementIncome = parseFloat(grossMonthlyRetirementIncomeInput.value) || 0;
                const annualRetirementIncome = grossMonthlyRetirementIncome * 12;

                // Update the value of annual_retirement_income field
                annualRetirementIncomeInput.value = annualRetirementIncome.toFixed(2);
            }
        },

          _validateNINumber: function (ev) {
            const niNumberInput = ev.target;
            const niNumberValue = niNumberInput.value.trim();
            const niNumberRegex = /^[A-Za-z]{2}\d{6}[A-Za-z]$/; // Regular expression for NI Number format

            if (!niNumberRegex.test(niNumberValue)) {
                niNumberInput.classList.add('is-invalid');
                // Display error message or handle invalid NI Number input
            } else {
                niNumberInput.classList.remove('is-invalid');
                // NI Number is valid, continue with other actions if needed
            }
         },

         _validateRetirementAge: function (ev) {
            const ageInput = ev.target;
            const numberValue = parseInt(ageInput.value.trim(), 10);

            if (isNaN(numberValue) || numberValue < 50 || numberValue > 80) {
                ageInput.classList.add('is-invalid');
            } else {
                ageInput.classList.remove('is-invalid');
            }
        },


          _onchangeEmploymentType: function (ev) {
            const employmentType = ev.target.value;
            const currentContractStartDateField = this.$('.current_contract_start_date');
            const currentContractEndDateField = this.$('.current_contract_end_date');
            const yearsOfExperienceContractBasisField = this.$('.years_of_experience_contract_basis');

            if (['fixed_term_contract', 'short_term_contract', 'zero_hour_contract'].includes(employmentType)) {
                currentContractStartDateField.removeClass('d-none');
                currentContractEndDateField.removeClass('d-none');
                yearsOfExperienceContractBasisField.removeClass('d-none');
            } else {
                currentContractStartDateField.addClass('d-none');
                currentContractEndDateField.addClass('d-none');
                yearsOfExperienceContractBasisField.addClass('d-none');
            }
         },

          _calculateAnnualSalary: function (ev) {
            const monthlyGrossSalary = parseFloat(document.getElementById("monthly_gross_salary").value) || 0;
            const annualBonus = parseFloat(document.getElementById("annual_bonus").value) || 0;

            const annualSalary = (monthlyGrossSalary * 12) + annualBonus;
            document.getElementById("annual_salary").value = annualSalary.toFixed(2);
          },

         _onchangeHasDeductions: function (ev) {
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

         _onchangeAccountantDetails: function () {
            const accountantYesRadio = this.$('#accountant_yes');
            const accountantFirmName = this.$('.accountant_firm_name');
            const accountantAddress = this.$('.accountant_accountant_address');
            const accountantContactNumber = this.$('.accountant_contact_number');
            const accountantQualification = this.$('.accountant_qualification');

            if (accountantYesRadio.is(':checked')) {
                accountantFirmName.removeClass('d-none');
                accountantAddress.removeClass('d-none');
                accountantContactNumber.removeClass('d-none');
                accountantQualification.removeClass('d-none');
            } else {
                accountantFirmName.addClass('d-none');
                accountantAddress.addClass('d-none');
                accountantContactNumber.addClass('d-none');
                accountantQualification.addClass('d-none');
            }
         },

         _onHealthConditionReportedChange: function (ev) {
            const healthConditionSelect = ev.target;
            const selectedValue = healthConditionSelect.value;
            const targetDiv = document.querySelector('.health-conditions');

            if (selectedValue === 'yes') {
                if (targetDiv) {
                    targetDiv.classList.remove('d-none');
                }
            } else {
                if (targetDiv) {
                    targetDiv.classList.add('d-none'); // Optional: Add back the class if "No" is selected
                }
            }
        },

        _onPastTravelsReportedChange: function (ev) {
            const pastTravelSelect = ev.target;
            const selectedValue = pastTravelSelect.value;
            const pastTravels = document.querySelector('.past-travels');

            if (selectedValue === 'yes') {
                if (pastTravels) {
                    pastTravels.classList.remove('d-none');
                }
            } else {
                if (pastTravels) {
                    pastTravels.classList.add('d-none');
                }
            }
        },

        _onFutureTravelsReportedChange: function (ev) {
            const futureTravelSelect = ev.target;
            const selectedValue = futureTravelSelect.value;
            const futureTravels = document.querySelector('.future-travels');

            if (selectedValue === 'yes') {
                if (futureTravels) {
                    futureTravels.classList.remove('d-none');
                }
            } else {
                if (futureTravels) {
                    futureTravels.classList.add('d-none');
                }
            }
        },

        _onCriticalIllnessReportedChange: function (ev) {
            const criticalIllnessSelect = ev.target;
            const selectedValue = criticalIllnessSelect.value;
            const criticalIllness = document.querySelector('.critical-illness');

            if (selectedValue === 'yes') {
                if (criticalIllness) {
                    criticalIllness.classList.remove('d-none');
                }
            } else {
                if (criticalIllness) {
                    criticalIllness.classList.add('d-none');
                }
            }
        },

         _calculateAnnualIncome: function (ev) {
            const monthlyIncomeInput = ev.target;
            const annualIncomeField = document.getElementById("annual_income");

            // Calculate annual income as monthly income * 12
            const monthlyIncome = parseFloat(monthlyIncomeInput.value) || 0;
            const annualIncome = monthlyIncome * 12;

            // Set the calculated annual income in the annual income field
            annualIncomeField.value = annualIncome.toFixed(2);
         },

         _onChangeGiftedFromFamily: function (event) {
            const target = $(event.currentTarget);
            const depositGifted = this.$('.deposit_gifted');
            const giftedFromFamily = this.$('.gifted_deposit_from_family_checkbox');

             if (giftedFromFamily.is(':checked')) {
                depositGifted.removeClass('d-none');
            } else {
                depositGifted.addClass('d-none');
            }
         },

         _onchangeCommitmentType: function (ev) {
            const selectedOption = ev.target.value;
            this._updateCommitmentVisibility(selectedOption);
        },

        _updateCommitmentVisibility: function (selectedOption) {
            const monthlyPaymentInput = this.$('#monthly-payment');
            const creditLimitInput = this.$('#credit_limit');
            const remainingMonthsInput = this.$('#remaining_months');
            const relevantOptions = ['credit_card', 'store_card', 'mail_orders'];

            if (relevantOptions.includes(selectedOption)) {
                monthlyPaymentInput.closest('.form-group').addClass('d-none');
                creditLimitInput.closest('.form-group').removeClass('d-none');
                remainingMonthsInput.closest('.form-group').addClass('d-none');
            } else {
                monthlyPaymentInput.closest('.form-group').removeClass('d-none');
                creditLimitInput.closest('.form-group').addClass('d-none');
                remainingMonthsInput.closest('.form-group').removeClass('d-none');
            }
        },

        _onchangePropertyUsage: function (ev) {
            var selectedOption = ev.target.value;
            var isNewBuildField = this.$('.is_new_build');
            var commuteOverOneHourField = this.$('.commute_over_one_hour_field');
            var estimatedMonthlyRentalIncomeField = this.$('.estimated_monthly_rental_income_field');
            var currentMonthlyRentalIncomeField = this.$('.current_monthly_rental_income_field');
            var rentalDetailsSection = this.$('#rental_details_section');
            var firstLetDateField = rentalDetailsSection.find('.form-group #first_let_date');
            var monthlyRentalIncomeField = rentalDetailsSection.find('.form-group.monthly_rental_income');
            var isHmoField = this.$('.home_move_out');
            var companyDirector = this.$('.company_director');
            var companyName = this.$('.company_name');
            var htbSchemeAvailableField = this.$('.htb_scheme_available');
            var sharedOwnershipAvailableField = this.$('.shared_ownership_existing');

            if (selectedOption === 'residential') {
                isNewBuildField.removeClass('d-none');
                commuteOverOneHourField.removeClass('d-none');
                estimatedMonthlyRentalIncomeField.addClass('d-none');
                currentMonthlyRentalIncomeField.addClass('d-none');
                sharedOwnershipAvailableField.removeClass('d-none');

                rentalDetailsSection.addClass('d-none');
                firstLetDateField.addClass('d-none');
                monthlyRentalIncomeField.addClass('d-none');
                isHmoField.addClass('d-none');
                companyDirector.addClass('d-none');
                companyName.addClass('d-none');
                htbSchemeAvailableField.removeClass('d-none');

            } else if (selectedOption === 'second_residential') {
                isNewBuildField.removeClass('d-none');
                commuteOverOneHourField.removeClass('d-none');

            } else if (selectedOption === 'btl') {
                isNewBuildField.addClass('d-none');
                commuteOverOneHourField.addClass('d-none');
                estimatedMonthlyRentalIncomeField.removeClass('d-none');
                currentMonthlyRentalIncomeField.removeClass('d-none');
                companyDirector.addClass('d-none');
                companyName.addClass('d-none');
                rentalDetailsSection.removeClass('d-none');
                firstLetDateField.removeClass('d-none');
                monthlyRentalIncomeField.removeClass('d-none');
                isHmoField.removeClass('d-none');
                htbSchemeAvailableField.addClass('d-none');
                sharedOwnershipAvailableField.addClass('d-none');
            } else if (selectedOption === 'company_btl') {
                isNewBuildField.addClass('d-none');
                commuteOverOneHourField.addClass('d-none');
                estimatedMonthlyRentalIncomeField.removeClass('d-none');
                currentMonthlyRentalIncomeField.removeClass('d-none');
                companyDirector.removeClass('d-none');
                companyName.removeClass('d-none');
                rentalDetailsSection.removeClass('d-none');
                firstLetDateField.removeClass('d-none');
                monthlyRentalIncomeField.removeClass('d-none');
                isHmoField.addClass('d-none');
                htbSchemeAvailableField.addClass('d-none');
                sharedOwnershipAvailableField.addClass('d-none');
            } else {
                // Add d-none class to all fields if none of the options are selected
                isNewBuildField.addClass('d-none');
                commuteOverOneHourField.addClass('d-none');
                estimatedMonthlyRentalIncomeField.addClass('d-none');
                currentMonthlyRentalIncomeField.addClass('d-none');
                rentalDetailsSection.addClass('d-none');
                firstLetDateField.addClass('d-none');
                monthlyRentalIncomeField.addClass('d-none');
                isHmoField.addClass('d-none');
                companyDirector.addClass('d-none');
                companyName.addClass('d-none');
                htbSchemeAvailableField.addClass('d-none');
                sharedOwnershipAvailableField.addClass('d-none');
            }

        },

        _onChangeAdditionalBurrow: function (event) {
            const target = $(event.currentTarget);
            const additionalBorrowingAmount = this.$('.additional_borrowing_amount');
            const additionalBorrowingReason = this.$('.additional_borrowing_reason_fields');

             if (target.is(':checked')) {
                additionalBorrowingAmount.removeClass('d-none');
                additionalBorrowingReason.removeClass('d-none');
            } else {
                additionalBorrowingAmount.addClass('d-none');
                additionalBorrowingReason.addClass('d-none');
            }
         },

        _onchangeHMO: function (ev) {
            const hmoCheckbox = ev.target;
            const occupantsCountField = document.querySelector('.occupants_count');

            if (hmoCheckbox.checked) {
                occupantsCountField.classList.remove('d-none');
            } else {
                occupantsCountField.classList.add('d-none');
            }
        },

        _onchangeSharedOwnershipAvailable: function (ev) {
            var ownershipPercentageCheckBox = ev.target;
            var ownershipPercentageField = this.$('.ownership_percentage_existing');
            var ownershipPercentageChecked =this.$('.shared_ownership_existing_checked');

            if (ownershipPercentageCheckBox.checked) {
                ownershipPercentageField.removeClass('d-none');
            } else {
                ownershipPercentageField.addClass('d-none');
            }
        },

        _onchangeNewBuild: function () {
          const isNewBuildCheckbox = this.$('#is_new_build');
          const peaRateSection = this.$('.pea_rate');
          const epcPredictedEpcRateSection = this.$('.epc_predicted_epc_rate');
          const estimatedBuiltYearSelect = this.$('#estimated_built_year');

          epcPredictedEpcRateSection.toggleClass('d-none', isNewBuildCheckbox.is(':checked'));
          peaRateSection.toggleClass('d-none', !isNewBuildCheckbox.is(':checked'));

          if (isNewBuildCheckbox.is(':checked')) {
          estimatedBuiltYearSelect.val(2024);

          }

        },

        _onchangeTenure: function (ev) {
            const tenureSelect = ev.target;
            const remainingLeaseTermField = document.querySelector('.remaining_lease_term_in_years');
            const flatInFloorField = document.querySelector('[name="flat_in_floor"]');
            const flatsSameFloorCountField = document.querySelector('[name="flats_same_floor_count"]');
            const aboveCommercialPropertyField = document.querySelector('[name="above_commercial_property"]');
            const groundRentField = document.querySelector('[name="ground_rent"]');

            if (tenureSelect.value === 'leasehold') {
                remainingLeaseTermField.classList.remove('d-none');
                flatInFloorField.classList.remove('d-none');
                flatsSameFloorCountField.classList.remove('d-none');
                aboveCommercialPropertyField.classList.remove('d-none');
                groundRentField.classList.remove('d-none');
            } else {
                remainingLeaseTermField.classList.add('d-none');
                flatInFloorField.classList.add('d-none');
                flatsSameFloorCountField.classList.add('d-none');
                aboveCommercialPropertyField.classList.add('d-none');
                groundRentField.classList.add('d-none');
            }
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

        _onchangeHtbSchemeAvailable: function (ev) {
            const htbSchemeAvailableSelect = ev.target;
            const htbSchemeLocationField = document.querySelector('.htb_scheme_location_yep');
            const redeemHtbLoanField = document.querySelector('.redeem_htb_loan_yep');

            if (htbSchemeAvailableSelect.value === 'yes') {
                htbSchemeLocationField.classList.remove('d-none');
                redeemHtbLoanField.classList.remove('d-none');
            } else {
                htbSchemeLocationField.classList.add('d-none');
                redeemHtbLoanField.classList.add('d-none');
            }
         },

        _onchangeSharedOwnershipAvailableYep: function (ev) {
            var ownershipPercentageSelect = ev.target;
            var ownershipPercentageField = this.$('.ownership_percentage_yep');

             if (ownershipPercentageSelect.value === 'yes') {
                ownershipPercentageField.removeClass('d-none');
            } else {
                ownershipPercentageField.addClass('d-none');
            }
         },

        _onchangeEmployerSickPayBenefit: function (ev) {
            const employerSickPayBenefitSection = document.querySelector('.existing_protection_cover');
            const claimMonthsSection = document.querySelector('.claim_months');
            const employerSickPayBenefitCheckbox = document.getElementById("existing_protection_cover");

            if (employerSickPayBenefitCheckbox.checked) {
                claimMonthsSection.classList.remove('d-none');
            } else {
                claimMonthsSection.classList.add('d-none');
            }
         },

        _onchangeSmokingStatus: function (ev) {
           var selectedOption = ev.target.value;
           var cigarettesPerDayField = this.$('.cigarettes_per_day');
           var stopSmokingDateField = this.$('.stop_smoking_date');

           if (selectedOption === 'currently_smoking') {
               cigarettesPerDayField.removeClass('d-none');
               stopSmokingDateField.addClass('d-none');
           } else if (selectedOption === 'stopped_smoking') {
               cigarettesPerDayField.addClass('d-none');
               stopSmokingDateField.removeClass('d-none');
           } else {
               cigarettesPerDayField.addClass('d-none');
               stopSmokingDateField.addClass('d-none');
           }
         },

        _onchangeAlcoholStatus: function (ev) {
           var selectedOption = ev.target.value;
           var alcoholConsumptionAMountField = this.$('.alcohol_consumption_amount');
           var stopDrinkingDate = this.$('.stop_drinking_date');

           if (selectedOption === 'currently_drinking') {
               alcoholConsumptionAMountField.removeClass('d-none');
               stopDrinkingDate.addClass('d-none');
           } else if (selectedOption === 'stopped_drinking') {
               alcoholConsumptionAMountField.addClass('d-none');
               stopDrinkingDate.removeClass('d-none');
           } else {
               alcoholConsumptionAMountField.addClass('d-none');
               stopDrinkingDate.addClass('d-none');
           }
         },

        _onchangeMedicalCondition: function () {
            const medicalConditionCheckbox = this.$('.medical_conditions input[type="checkbox"]');
            const medicalConditionFields = this.$('.medical_conditions_details');

            medicalConditionFields.toggleClass('d-none', !medicalConditionCheckbox.is(':checked'));
         },

        _onchangeTakingMeds: function () {
            const takingMedsCheckbox = this.$('.taking_medicines input[type="checkbox"]');
            const takingMedsFields = this.$('.taking_medicines_details');

            takingMedsFields.toggleClass('d-none', !takingMedsCheckbox.is(':checked'));
         },

        _onchangeCriticalIllness: function (ev) {
            const illnessSelect = ev.target;
            const criticalIllness = document.querySelector('.critical_illness');

            if (illnessSelect.value === 'yes') {
                criticalIllness.classList.remove('d-none');
            } else {
                criticalIllness.classList.add('d-none');
            }
         },

        _onchangeFutureTravels: function (ev) {
            const futureTravelsSelect = ev.target;
            const futureTravels = document.querySelector('.future_travels_div');

            if (futureTravelsSelect.value === 'yes') {
                futureTravels.classList.remove('d-none');
            } else {
                futureTravels.classList.add('d-none');
            }
         },

        _onchangePastTravels: function (ev) {
            const pastTravelsSelect = ev.target;
            const pastTravels = document.querySelector('.past_travel_div');

            if (pastTravelsSelect.value === 'yes') {
                pastTravels.classList.remove('d-none');
            } else {
                pastTravels.classList.add('d-none');
            }
         },

        _onchangeHealthConditions: function (ev) {
            const healthConditionsSelect = ev.target;
            const healthConditions = document.querySelector('.health_conditions_div');

            if (healthConditionsSelect.value === 'yes') {
                healthConditions.classList.remove('d-none');
            } else {
                healthConditions.classList.add('d-none');
            }
         },

        _calculateTotalExpenses: function (ev) {
            const rent = parseFloat(document.getElementById("rent").value) || 0;
            const food = parseFloat(document.getElementById("food").value) || 0;
            const utilities = parseFloat(document.getElementById("utilities").value) || 0;
            const phoneInternet = parseFloat(document.getElementById("phone_internet").value) || 0;
            const transport = parseFloat(document.getElementById("transport").value) || 0;
            const clothing = parseFloat(document.getElementById("clothing").value) || 0;
            const medicine = parseFloat(document.getElementById("medicine").value) || 0;
            const personalGoods = parseFloat(document.getElementById("personal_goods").value) || 0;
            const householdGoods = parseFloat(document.getElementById("household_goods").value) || 0;
            const entertainment = parseFloat(document.getElementById("entertainment").value) || 0;

            // Get childcare safely
            const childcareElement = document.getElementById("childcare_cost");
            const childcare = childcareElement ? (parseFloat(childcareElement.value) || 0) : 0;

            const annualCouncilTax = parseFloat(document.getElementById("annual_council_tax").value) || 0;
            const homeInsurance = parseFloat(document.getElementById("home_insurance").value) || 0;
            const lifeInsurance = parseFloat(document.getElementById("life_insurance").value) || 0;
            const carInsurance = parseFloat(document.getElementById("car_insurance").value) || 0;
            const educationFees = parseFloat(document.getElementById("education_fees").value) || 0;

            // Get ground_rent safely
            const groundRentElement = document.getElementById("ground_rent_1");
            const groundRent = groundRentElement ? (parseFloat(groundRentElement.value) || 0) : 0;

            // Get service_charge safely
            const serviceChargeElement = document.getElementById("service_charge");
            const serviceCharge = serviceChargeElement ? (parseFloat(serviceChargeElement.value) || 0) : 0;

            const servicesCharge = parseFloat(document.getElementById("services_charge").value) || 0;

            const monthlyCouncilTax = annualCouncilTax / 12;

            const totalExpenses = rent + food + utilities + phoneInternet + transport + clothing + medicine + personalGoods + householdGoods + entertainment + childcare + homeInsurance + lifeInsurance + carInsurance + educationFees + groundRent + serviceCharge + servicesCharge + monthlyCouncilTax;

            // Ensure totalExpenses is a valid number before calling toFixed
            const totalExpensesElement = document.getElementById("total_expenses");
            if (totalExpensesElement) {
                totalExpensesElement.value = (isNaN(totalExpenses) ? 0 : totalExpenses).toFixed(2);
            }

         },

        _calculateAnnualIncome: function (ev) {
            const monthlyIncomeInput = ev.target;
            const annualIncomeField = document.getElementById("annual_income");

            // Calculate annual income as monthly income * 12
            const monthlyIncome = parseFloat(monthlyIncomeInput.value) || 0;
            const annualIncome = monthlyIncome * 12;

            // Set the calculated annual income in the annual income field
            annualIncomeField.value = annualIncome.toFixed(2);
        },

        _calculateTotalDeposit: function () {
            const depositFromSavings = parseFloat(document.getElementById("deposit_from_savings").value) || 0;
            const giftedDepositFromFriend = parseFloat(document.getElementById("gifted_deposit_from_friend").value) || 0;
            const giftedDepositFromFamily = parseFloat(document.getElementById("gifted_deposit_from_family").value) || 0;
            const depositFromAnotherLoan = parseFloat(document.getElementById("deposit_from_another_loan").value) || 0;
            const depositFromEquityOfProperty = parseFloat(document.getElementById("deposit_from_equity_of_property").value) || 0;
            const loanAmountFromDirector = parseFloat(document.getElementById("loan_amount_from_director").value) || 0;
            const giftedDepositAmountFromDirector = parseFloat(document.getElementById("gifted_deposit_amount_from_director").value) || 0;

            const totalDeposit = depositFromSavings + giftedDepositFromFriend + giftedDepositFromFamily + depositFromAnotherLoan + depositFromEquityOfProperty + loanAmountFromDirector + giftedDepositAmountFromDirector;


            document.getElementById("total_deposit_amount").value = totalDeposit.toFixed(2);
        },

        _onchangeEmployerSickPayBenefit: function (ev) {
            const employerSickPayBenefitSection = document.querySelector('.employer_sick_pay_benefit');
            const claimMonthsSection = document.querySelector('.form-group.claim_months');
            const employerSickPayBenefitCheckbox = document.getElementById("employer_sick_pay_benefit");

            if (employerSickPayBenefitCheckbox.checked) {
                claimMonthsSection.classList.remove('d-none');
            } else {
                claimMonthsSection.classList.add('d-none');
            }
        },

    });

});
