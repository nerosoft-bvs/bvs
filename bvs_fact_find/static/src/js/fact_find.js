odoo.define('bvs_fact_find.fact_find', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.portalFactFind = publicWidget.Widget.extend({
        selector: '.o_portal_fact_find',
        events: {
            'change input.fd_check': '_onchangeFinancialDependents',
            'change input.kbn_check': '_onchangeKnownByAnotherName',
            'change select[name="residential_status"].residential_status': '_onchangeResidentialStatus',
            'change select[name="self_employment_type"]': '_onchangeSelfEmploymentType',
            'change select[name="property_usage"]': '_onchangePropertyUsage',
            'change input[name="is_new_build"]': '_onchangeNewBuild',
            'change input[id="additional_borrowing"]': '_onchangeAdditionalBorrowing',
            'change input[id="existing_protection_cover"]': '_onchangeProtectionCover',
            'change select[name="smoking"]': '_onchangeSmokingStatus',
            'change select[name="alcohol_consumption_comment"]': '_onchangeAlcoholStatus',
            'change input[id="medical_conditions"]': '_onchangeMedicalCondition',
            'change input[id="taking_medicines"]': '_onchangeTakingMeds',
            'change select[name="customer_type"]': '_onchangeHideFieldsByCustomerType',
            'change input.adverse_credit': '_onchangeAdverseCreditCheck',
            'change input[name="date_of_birth_fd"]': '_onchangeDateOfBirth',
            'change select[name="commitment_type"]': '_onchangeCommitmentType',
            'change select[name="dependency_type"]': '_onchangeDependencyType',
            'input input[id="work_telephone"]': '_validateWorkTelephone',
            'change select[name="employment_type"]': '_onchangeEmploymentType',
            'change input#monthly_gross_salary': '_calculateAnnualSalary',
            'change input#annual_bonus': '_calculateAnnualSalary',
            'change input#gross_monthly_retirement_income': '_calculateRetirementIncome',
            'change input#annual_retirement_income': '_calculateRetirementIncome',
            'change input[name="has_accountant"]': '_onchangeHasAccountant',
            'change input#monthly_income': '_calculateAnnualIncome',
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
            'change input#ground_rent': '_calculateTotalExpenses',
            'change input#service_charge': '_calculateTotalExpenses',
            'change input#total_expenses': '_calculateTotalExpenses',
            'change input#gym_membership': '_calculateTotalExpenses',
            'change input#commute_over_one_hour': '_onchangeCommuteOverOneHour',
            'change select#tenure': '_onchangeTenure',
            'change select[name="nationality"].nationality': '_onchangeNationalityField',
            'change input[id="email_address"]' : '_validateEmailAddress',
            'change input[id="mobile_number"]' : '_validateMobileNumber',
            'change input[id="home_telephone_number"]': '_validateHomeTelephone',
            'change input#has_deductions': '_onchangeHasDeductions',
            'change input#ni_number': '_validateNINumber',
            'change select[name="employment_status"]': '_onchangeEmploymentStatusVisibility',
            'change input.deposit-checkbox': '_toggleDepositInputVisibility',
            'change select[name="credit_commitments"]': '_onchangeCreditCommitments',
            'change input[name="gifted_deposit_from_family_checkbox"]': '_toggleGiftedDepositDiv',
            'change input#deposit_from_savings': '_calculateTotalDeposit',
            'change input#gifted_deposit_from_friend': '_calculateTotalDeposit',
            'change input#gifted_deposit_from_family': '_calculateTotalDeposit',
            'change input#deposit_from_another_loan': '_calculateTotalDeposit',
            'change input#deposit_from_equity_of_property': '_calculateTotalDeposit',
            'change input#loan_amount_from_director': '_calculateTotalDeposit',
            'change input#gifted_deposit_amount_from_director': '_calculateTotalDeposit',
            'change input#shared_ownership_existing': '_onchangeSharedOwnershipExisting',
            'change input#help_to_buy_loan': '_onchangeHelpToBuyLoan',
            'change select[id="shared_ownership_available"]': '_onchangeSharedOwnershipAvailable',
            'change select[id="htb_scheme_available"]': '_onchangeHtbSchemeAvailable',
            'change input[id="existing_protection_cover"]': '_onchangeExistingProtectionCover',
            'change input[id="waiting_referral_report"]': '_onchangeWaitingReferralReport',
            'change input[name="financial_dependants"]': '_onchangeFinancialDependents',
            'change select[name="gender"]': '_onchangeGender',
            'change input[id="hmo"]': '_onchangeHMO',
            'change input[id="self_employment_start_date"]': '_onchangeSelfEmploymentStartDate',
            'change input[id="passport_expiry_date"]': '_onchangePassportExpiryDate',
            'change select[id="estimated_built_year"]': '_onchangeEstimatedBuiltYear',
            'change input[id="employer_sick_pay_benefit"]': '_onchangeEmployerSickPayBenefit',
            'change select[name="indefinite_leave_to_remain"]': '_onchangeIndefiniteLeaveToRemain',
            'keyup input[name="building_number3"]': '_onchangeBuildingDetails',
            'keyup input[name="building_name3"]': '_onchangeBuildingDetails',
            'keydown input[name="building_number3"]': '_onchangeBuildingDetails',
            'keydown input[name="building_name3"]': '_onchangeBuildingDetails',
            'change input[name="is_current_address"]': '_onchangeCurrentAddress',

        },


       start: function () {
          this._super.apply(this, arguments);
           var leadStageName = document.getElementById('lead_stage').innerText;
           addressNow.listen("load", this._onAddressPopulated());
            if (leadStageName === 'Pre Offer') {
                $('.financial_dependants_div').find('input, select, textarea').attr('readonly', true);
                $('.personal_details').find('input, select, textarea').attr('readonly', true);
                $('.address_history').find('input, select, textarea').attr('readonly', true);
                $('.employment_details_section').find('input, select, textarea').attr('readonly', true);
                $('.self_employed_section').find('input, select, textarea').attr('readonly', true);
                $('.adverse_credit_div').find('input, select, textarea').attr('readonly', true);
                $('.deposit').find('input, select, textarea').attr('readonly', true);
                $('.credit_comment').find('input, select, textarea').attr('readonly', true);
                $('.other_income').find('input, select, textarea').attr('readonly', true);
                $('.monthly_expenses').find('input, select, textarea').attr('readonly', true);
                $('.bank_details').find('input, select, textarea').attr('readonly', true);
                $('.new_property_details').find('input, select, textarea').attr('readonly', true);
                $('.estate_agent').find('input, select, textarea').attr('readonly', true);
                $('.solicitor').find('input, select, textarea').attr('readonly', true);
                $('.existing_properties').find('input, select, textarea').attr('readonly', true);
                $('.existing_mortgage_div').find('input, select, textarea').attr('readonly', true);
                $('.protection_div').find('input, select, textarea').attr('readonly', true);
            }
       },

       _onAddressPopulated: function (address) {
            addressNow.listen("populate", function(address, control) {
                const buildingNumberField = document.querySelector('input[name="building_number3"]');
                const buildingNameField = document.querySelector('input[name="building_name3"]');
                const buildingNumberAndNameField = document.querySelector('input[name="building_number2"]');
                const houseNumber = document.querySelector('input[name="house_number2"]');

                const regex = /\b(?:Flat|House)\s*(\d+)\b/i;
                const str = control.Line1;
                const match = str.match(regex);
                const result = match ? match[1] : null;

                if (buildingNumberField && buildingNameField && buildingNumberAndNameField) {
                    const buildingNumber = buildingNumberField.value.trim();
                    const buildingName = buildingNameField.value.trim();
                    buildingNumberAndNameField.value = `${buildingName} ${buildingNumber}`.trim();
                }

                if (result) {
                    houseNumber.value = result
                } else {
                    houseNumber.value = result
                }
            });
        },

        _onchangeFinancialDependents: function (ev) {
            const financialDependentsSection = document.getElementById("financial_dependants_div");
            const financialDependentsCheckbox = document.querySelector('input[name="financial_dependants"]');
            const numberOfDependantsField = document.querySelector('.number_of_dependants');

            if (financialDependentsSection && financialDependentsCheckbox && numberOfDependantsField) {
                financialDependentsSection.classList.toggle('d-none', !financialDependentsCheckbox.checked);
                numberOfDependantsField.style.display = financialDependentsCheckbox.checked ? 'block' : 'none';
            }
        },



    _onchangeIndefiniteLeaveToRemain: function (ev) {
        const ilrSelect = document.querySelector('select[name="indefinite_leave_to_remain"]');
        const visaCategorySection = document.querySelector(".visa_category");

    if (ilrSelect && visaCategorySection) {
        visaCategorySection.style.display = ilrSelect.value === 'no'? 'block' : 'none';
        }
    },

    _onchangeCurrentAddress: function (ev) {
        const currentDateAddressCheckbox = document.getElementById("is_current_address");
        const dateMovedOutSection = document.querySelector(".date_moved_out");

    if (currentDateAddressCheckbox && dateMovedOutSection) {
        dateMovedOutSection.style.display = currentDateAddressCheckbox.checked? 'none' : 'block';
        }
    },

    _onchangeBuildingDetails: function (ev) {
            const buildingNumberField = document.querySelector('input[name="building_number3"]');
            const buildingNameField = document.querySelector('input[name="building_name3"]');
            const buildingNumberAndNameField = document.querySelector('input[name="building_number2"]');

            if (buildingNumberField && buildingNameField && buildingNumberAndNameField) {
                const buildingNumber = buildingNumberField.value.trim();
                const buildingName = buildingNameField.value.trim();
                buildingNumberAndNameField.value = `${buildingNumber} ${buildingName}`.trim();
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
        const childcare = parseFloat(document.getElementById("childcare_cost").value) || 0;
        const annualCouncilTax = parseFloat(document.getElementById("annual_council_tax").value) || 0;
        const homeInsurance = parseFloat(document.getElementById("home_insurance").value) || 0;
        const lifeInsurance = parseFloat(document.getElementById("life_insurance").value) || 0;
        const carInsurance = parseFloat(document.getElementById("car_insurance").value) || 0;
        const educationFees = parseFloat(document.getElementById("education_fees").value) || 0;
        const groundRent = parseFloat(document.getElementById("ground_rent").value) || 0;
        const serviceCharge = parseFloat(document.getElementById("service_charge").value) || 0;
        const gymMembership = parseFloat(document.getElementById("gym_membership").value) || 0;

        const monthlyCouncilTax = annualCouncilTax / 12;

        const totalExpenses = rent + food + utilities + phoneInternet + transport + clothing + medicine + personalGoods + householdGoods + entertainment + childcare + homeInsurance + lifeInsurance + carInsurance + educationFees + groundRent + serviceCharge + gymMembership + monthlyCouncilTax;

        document.getElementById("total_expenses").value = totalExpenses.toFixed(2);
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

    _onchangeSharedOwnership: function (ev) {
        const sharedOwnershipCheckbox = ev.target;
        const ownershipPercentageField = document.querySelector('.ownership_percentage');

        if (sharedOwnershipCheckbox.checked) {
            ownershipPercentageField.classList.remove('d-none');
        } else {
            ownershipPercentageField.classList.add('d-none');
        }
    },

    _onchangeHtbSchemeAvailable: function (ev) {
        const htbSchemeAvailableSelect = ev.target;
        const htbSchemeLocationField = document.querySelector('#htb_scheme_location');
        const redeemHtbLoanField = document.querySelector('#redeem_htb_loan');

        if (htbSchemeAvailableSelect.value === 'yes') {
            htbSchemeLocationField.closest('.form-group').classList.remove('d-none');
            redeemHtbLoanField.closest('.form-group').classList.remove('d-none');
        } else {
            htbSchemeLocationField.closest('.form-group').classList.add('d-none');
            redeemHtbLoanField.closest('.form-group').classList.add('d-none');
        }
    },

    _onchangeExistingProtectionCover: function (ev) {
        const protectionCheckbox = ev.target;
        const protectionMultipleDiv = document.querySelector('.protection_multiple');

        if (protectionCheckbox.checked) {
            protectionMultipleDiv.classList.remove('d-none');
        } else {
            protectionMultipleDiv.classList.add('d-none');
        }
    },


    _onchangeSelfEmploymentStartDate: function (ev) {
        const startDateInput = ev.target;
        const startDate = new Date(startDateInput.value);
        const errorDiv = document.getElementById('start_date_error');

        if (!startDate.getTime()) {
            console.warn('Invalid date entered.');
            startDateInput.classList.add('is-invalid');
            errorDiv.style.display = 'block';
            return; // Handle invalid date gracefully
        }

        const today = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        if (startDate > twoYearsAgo) {
            startDateInput.classList.add('is-invalid');
            errorDiv.style.display = 'block';
        } else {
            startDateInput.classList.remove('is-invalid');
            errorDiv.style.display = 'none';
        }
    },

    _onchangeGender: function (ev) {
        const genderSelect = ev.target;
        const waistFields = document.querySelectorAll('.form-group.waist');
        const ukDressSizeField = document.querySelector('.form-group.uk_dress_size');

        if (genderSelect.value === 'female') {
            waistFields.forEach(field => field.style.display = 'none');
            ukDressSizeField.style.display = 'block';
        } else if (genderSelect.value === 'male') {
            waistFields.forEach(field => field.style.display = 'block');
            ukDressSizeField.style.display = 'none';
        } else {
            // Handle other gender options if needed
        }
    },


    _calculateAnnualSalary: function (ev) {
            const monthlyGrossSalary = parseFloat(document.getElementById("monthly_gross_salary").value) || 0;
            const annualBonus = parseFloat(document.getElementById("annual_bonus").value) || 0;

            const annualSalary = (monthlyGrossSalary * 12) + annualBonus;
            document.getElementById("annual_salary").value = annualSalary.toFixed(2); // Set the calculated annual salary in the input field
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

        _toggleDepositInputVisibility: function (ev) {
        const checkbox = ev.target;
        const inputField = checkbox.nextElementSibling;

        if (checkbox.checked) {
            inputField.style.display = 'block';
        } else {
            inputField.style.display = 'none';
        }
    },


    _onchangeCreditCommitments: function (ev) {
            const creditCommitments = ev.target.value;
            const commitmentTypeField = document.getElementById('commitment_type');
            const lenderField = document.getElementById('lender');
            const outstandingAmountField = document.getElementById('outstanding_amount');
            const monthlyPaymentField = document.getElementById('monthly_payment');
            const creditLimitField = document.getElementById('credit_limit');
            const remainingMonthsField = document.getElementById('remaining_months');
            const intendToRepayField = document.getElementById('intend_to_repay');

            if (creditCommitments === 'yes') {
                // Show relevant fields
                commitmentTypeField.style.display = 'block';
                lenderField.style.display = 'block';
                outstandingAmountField.style.display = 'block';
                monthlyPaymentField.style.display = 'block';
                creditLimitField.style.display = 'block';
                remainingMonthsField.style.display = 'block';
                intendToRepayField.style.display = 'block';
            } else {
                // Hide relevant fields
                commitmentTypeField.style.display = 'none';
                lenderField.style.display = 'none';
                outstandingAmountField.style.display = 'none';
                monthlyPaymentField.style.display = 'none';
                creditLimitField.style.display = 'none';
                remainingMonthsField.style.display = 'none';
                intendToRepayField.style.display = 'none';
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

    _onchangePassportExpiryDate: function(ev) {
      const passportExpiryDateInput = ev.target;
      const inputValue = passportExpiryDateInput.value.trim();
        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(inputValue);
      if (!isValidFormat) {
        passportExpiryDateInput.classList.add('is-invalid');
      } else {
        passportExpiryDateInput.classList.remove('is-invalid');
        const expiryDate = moment(inputValue, "YYYY-MM-DD");
        const today = moment();
        if (expiryDate.isBefore(today)) {
          // Expired
          passportExpiryDateInput.classList.add('is-invalid');
        } else {
          // Valid
          passportExpiryDateInput.classList.remove('is-invalid');
        }
        }
      },

    _onchangeEstimatedBuiltYear: function () {
      const estimatedBuiltYearSelect = this.$('#estimated_built_year');
      const warrantyProvidersNameField = this.$('.warranty_providers_name_field');

      const selectedYear = parseInt(estimatedBuiltYearSelect.val());
      const isLastTenYears = selectedYear >= 2014 && selectedYear <= 2024;

      warrantyProvidersNameField.toggleClass('d-none', !isLastTenYears);
    },


    _onchangeHasDeductions: function (ev) {
        const hasDeductionsCheckbox = ev.target;
        const postGraduateLoanField = document.querySelector('.post_graduate_loan');
        const gymMembershipField = document.querySelector('.gym_membership');
        const childcareField = document.querySelector('.childcare');
        const studentLoansField = document.querySelector('.student_loans');

        if (hasDeductionsCheckbox.checked) {
            postGraduateLoanField.classList.remove('d-none');
            gymMembershipField.classList.remove('d-none');
            childcareField.classList.remove('d-none');
            studentLoansField.classList.remove('d-none');
        } else {
            postGraduateLoanField.classList.add('d-none');
            gymMembershipField.classList.add('d-none');
            childcareField.classList.add('d-none');
            studentLoansField.classList.add('d-none');
        }
    },


    _validateMobileNumber: function (ev) {
        const mobileNumberInput = ev.target;
        const inputValue = mobileNumberInput.value.trim();
        const isValid = /^\d{11}$/.test(inputValue); // Regex to match exactly 11 digits
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
        const homeTelephoneInput = ev.target;
        const inputValue = homeTelephoneInput.value.trim();
        const isValid = /^\d{11}$/.test(inputValue);

        const feedbackElement = homeTelephoneInput.nextElementSibling;
        if (!isValid) {
            homeTelephoneInput.classList.add('is-invalid');
            feedbackElement.style.display = 'block';
        } else {
            homeTelephoneInput.classList.remove('is-invalid');
            feedbackElement.style.display = 'none';
        }
    },


     _onchangeEmploymentStatusVisibility: function (ev) {
        const employmentStatus = ev.target.value;
        const retirementInvisibleDiv = document.querySelector('.retirement_invisible');
        const retirementInvisibleDivNew = document.querySelector('.retirement_invisible2');
        const housePersonInvisibleDiv = document.querySelector('.house_person_invisible');

        if (employmentStatus === 'house_person' || employmentStatus === 'self_employed') {
            retirementInvisibleDiv.style.display = 'none';
            housePersonInvisibleDiv.style.display = 'none';
            retirementInvisibleDivNew.style.display = 'block';
        } else if (employmentStatus === 'retired') {
            retirementInvisibleDiv.style.display = 'none';
            retirementInvisibleDivNew.style.display = 'none';
            housePersonInvisibleDiv.style.display = 'block';
        } else {
            retirementInvisibleDiv.style.display = 'block';
            retirementInvisibleDivNew.style.display = 'block';
            housePersonInvisibleDiv.style.display = 'block';
        }
     },



    _validateWorkTelephone: function (ev) {
            const workTelephoneInput = ev.target;
            const inputValue = workTelephoneInput.value.trim();
            const isValid = /^\d{11}$/.test(inputValue); // Regex to match exactly 11 digits

            if (!isValid) {
                workTelephoneInput.classList.add('is-invalid');
            } else {
                workTelephoneInput.classList.remove('is-invalid');
            }
        },


     _onchangeNationalityField: function (ev) {
        const nationalityValue = $(ev.currentTarget).val();
        const settledStatusField = $('.settled_status');

        const dualNationalityField = $('.dual_nationality');
        const indefiniteLeaveToRemainField = $('.indefinite_leave_to_remain');
        const otherNationalityField = $('.other_nationality');
        const euCountryListField = $('.eu_country_list');
        const customerType = document.getElementById('customer_type').outerText;

        // Hide all relevant fields by default
        settledStatusField.addClass('d-none');
        dualNationalityField.addClass('d-none');
        indefiniteLeaveToRemainField.addClass('d-none');
        euCountryListField.addClass('d-none');
        otherNationalityField.addClass('d-none');

        if (nationalityValue === 'british') {
            otherNationalityField.addClass('d-none');
        } else if (nationalityValue === 'eu') {
            settledStatusField.removeClass('d-none');
            dualNationalityField.removeClass('d-none');
            euCountryListField.removeClass('d-none');
        } else if (nationalityValue === 'other') {
            indefiniteLeaveToRemainField.removeClass('d-none');
            dualNationalityField.removeClass('d-none');
            otherNationalityField.removeClass('d-none');
        }

        if (customerType === 'protection') {
            dualNationalityField.addClass('d-none');
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
            flatsSameFloorCountField.closest('.form-group').classList.remove('d-none');
            aboveCommercialPropertyField.closest('.form-group').classList.remove('d-none');
            groundRentField.closest('.form-group').classList.remove('d-none');
        } else {
            remainingLeaseTermField.classList.add('d-none');
            flatInFloorField.closest('.form-group').classList.add('d-none');
            flatsSameFloorCountField.closest('.form-group').classList.add('d-none');
            aboveCommercialPropertyField.closest('.form-group').classList.add('d-none');
            groundRentField.closest('.form-group').classList.add('d-none');
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

        _onchangeHelpToBuyLoan: function (ev) {
        const helpToBuyLoanCheckbox = ev.target;
        const helpToBuyLoanTypeField = document.querySelector('[name="help_to_buy_loan_type"]');

        if (helpToBuyLoanCheckbox.checked) {
            helpToBuyLoanTypeField.closest('.form-group').classList.remove('d-none');
        } else {
            helpToBuyLoanTypeField.closest('.form-group').classList.add('d-none');
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



    _onchangeHasAccountant: function (ev) {
        const hasAccountantValue = ev.target.value;
        const firmNameField = document.querySelector('.firm_name');
        const addressField = document.querySelector('.accountant_address');
        const contactNumberField = document.querySelector('.contact_number');
        const qualificationField = document.querySelector('.qualification');

        if (hasAccountantValue === 'yes') {
            firmNameField.style.display = 'block';
            addressField.style.display = 'block';
            contactNumberField.style.display = 'block';
            qualificationField.style.display = 'block';
        } else {
            firmNameField.style.display = 'none';
            addressField.style.display = 'none';
            contactNumberField.style.display = 'none';
            qualificationField.style.display = 'none';
        }
    },

    _onchangeEmployerSickPayBenefit: function (ev) {
        const employerSickPayBenefitSection = document.querySelector('.employer_sick_pay_benefit');
        const claimMonthsSection = document.querySelector('.form-group.claim_months');
        const employerSickPayBenefitCheckbox = document.getElementById("employer_sick_pay_benefit");

        if (employerSickPayBenefitCheckbox.checked) {
            employerSickPayBenefitSection.classList.remove('d-none');
            claimMonthsSection.classList.remove('d-none');
        } else {
            employerSickPayBenefitSection.classList.add('d-none');
            claimMonthsSection.classList.add('d-none');
        }
    },




    _onchangeKnownByAnotherName: function () {
        const knownByAnotherNameCheckbox = this.$('.kbn_check');
        const previousSurnameField = this.$('.previous_surname_field');
        const dateOfNameChangeField = this.$('#date_of_name_change_field');

        console.log('Checkbox:', knownByAnotherNameCheckbox); // Check if checkbox is selected
        console.log('Previous Surname Field:', previousSurnameField); // Check if field is selected
        console.log('Date of Name Change Field:', dateOfNameChangeField); // Check if field is selected

        // Initially hide/show the fields based on the checkbox state
        if (knownByAnotherNameCheckbox.is(':checked')) {
            previousSurnameField.show();
            dateOfNameChangeField.show();
        } else {
            previousSurnameField.hide();
            dateOfNameChangeField.hide();
    }


    // Bind change event directly to the checkbox
    knownByAnotherNameCheckbox.on('change', function() {
            console.log('Checkbox Changed'); // Check if change event is triggered
            if ($(this).is(':checked')) {
                previousSurnameField.show();
                dateOfNameChangeField.show();
            } else {
                previousSurnameField.hide();
                dateOfNameChangeField.hide();
            }
        });
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


     _onchangeResidentialStatus: function (ev) {
        var selectedOption = ev.target.value;

        var leadState = document.getElementById('lead_stage').innerText;
        var customerType = document.getElementById('customer_type').outerText;

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
        if (leadState === 'Illustration' && customerType === 'ftb') {
            if (selectedOption === 'renting_private') {
                // Show Current Landlord Fields
                currentLandlordName.removeClass('d-none');
                currentLandlordAddress.removeClass('d-none');
                currentLandlordPostcode.removeClass('d-none');
                currentLandlordContactNo.removeClass('d-none');

                // Hide Local Authority Fields
                localAuthorityName.addClass('d-none');
                localAuthorityPostcode.addClass('d-none');
                localAuthorityAddress.addClass('d-none');
            } else if (selectedOption === 'renting_local_authority') {
                // Show Local Authority Fields
                localAuthorityName.removeClass('d-none');
                localAuthorityPostcode.removeClass('d-none');
                localAuthorityAddress.removeClass('d-none');

                // Hide Current Landlord Fields
                currentLandlordName.addClass('d-none');
                currentLandlordAddress.addClass('d-none');
                currentLandlordPostcode.addClass('d-none');
                currentLandlordContactNo.addClass('d-none');
            } else {
                // Hide all fields if none of the options are selected
                currentLandlordName.addClass('d-none');
                currentLandlordAddress.addClass('d-none');
                currentLandlordPostcode.addClass('d-none');
                currentLandlordContactNo.addClass('d-none');
                localAuthorityName.addClass('d-none');
                localAuthorityPostcode.addClass('d-none');
                localAuthorityAddress.addClass('d-none');
            }
        } else {
            // Hide all fields if lead state is not 'illustration'
            currentLandlordName.addClass('d-none');
            currentLandlordAddress.addClass('d-none');
            currentLandlordPostcode.addClass('d-none');
            currentLandlordContactNo.addClass('d-none');
            localAuthorityName.addClass('d-none');
            localAuthorityPostcode.addClass('d-none');
            localAuthorityAddress.addClass('d-none');
        }
    },


    _onchangeCommuteOverOneHour: function (ev) {
        const commuteCheckbox = ev.target;
        const commuteCostField = document.querySelector('.monthly_commute_cost_field');

        if (commuteCheckbox.checked) {
             commuteCostField.style.display = 'block';
        } else {
              commuteCostField.style.display = 'none';
            }
    },


        _onchangeSelfEmploymentType: function (ev) {
            var selectedOption = ev.target.value;
            var businessNameField = this.$('.business_name_field');
            var occupationField = this.$('.occupation_field');
            var startDateField = this.$('.start_date_field');
            var businessAddressField = this.$('.business_address_field');
            var letPropertiesField = this.$('.let_properties');
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
        var sharedOwnershipAvailableField = this.$('.shared_ownership_available');

        if (selectedOption === 'residential') {
            isNewBuildField.show();
            commuteOverOneHourField.show();
            estimatedMonthlyRentalIncomeField.hide();
            currentMonthlyRentalIncomeField.hide();

            // Hide the rental details section and its fields
            rentalDetailsSection.hide();
            firstLetDateField.hide();
            monthlyRentalIncomeField.hide();
            isHmoField.hide();
            companyDirector.hide();
            companyName.hide();
            htbSchemeAvailableField.show();
            sharedOwnershipAvailableField.show();
        } else if (selectedOption === 'btl') {
            isNewBuildField.hide();
            commuteOverOneHourField.hide();
            estimatedMonthlyRentalIncomeField.show();
            currentMonthlyRentalIncomeField.show();
            companyDirector.hide();
            companyName.hide();
            rentalDetailsSection.show();
            firstLetDateField.show();
            monthlyRentalIncomeField.show();
            isHmoField.show();
            htbSchemeAvailableField.hide();
            sharedOwnershipAvailableField.hide();
        } else if (selectedOption === 'company_btl') {
            isNewBuildField.hide();
            commuteOverOneHourField.hide();
            estimatedMonthlyRentalIncomeField.show();
            currentMonthlyRentalIncomeField.show();
            companyDirector.show();
            companyName.show();
            rentalDetailsSection.show();
            firstLetDateField.show();
            monthlyRentalIncomeField.show();
            isHmoField.hide();
            htbSchemeAvailableField.hide();
            sharedOwnershipAvailableField.hide();
        } else {
            // Hide all fields if none of the options are selected
            isNewBuildField.hide();
            commuteOverOneHourField.hide();
            estimatedMonthlyRentalIncomeField.hide();
            currentMonthlyRentalIncomeField.hide();
            rentalDetailsSection.hide();
            firstLetDateField.hide();
            monthlyRentalIncomeField.hide();
            isHmoField.hide();
            companyDirector.hide();
            companyName.hide();
            htbSchemeAvailableField.hide();
            sharedOwnershipAvailableField.hide();
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
            var selectedOption = ev.target.value;
            var ownershipPercentageField = document.querySelector('.ownership_percentage');

            if (selectedOption === 'yes') {
                ownershipPercentageField.classList.remove('d-none');
            } else {
                ownershipPercentageField.classList.add('d-none');
            }
    },

        _onchangeSharedOwnershipExisting: function (ev) {
             var checkbox = ev.target;
            var ownershipPercentageField = document.querySelector('.ownership_percentage_existing');

            if (checkbox.checked) {
                ownershipPercentageField.classList.remove('d-none');
            } else {
                ownershipPercentageField.classList.add('d-none');
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

        _onchangeAdditionalBorrowing: function () {
            const additionalBorrowingCheckbox = this.$('.additional_borrowing_check input[type="checkbox"]');
            const additionalBorrowingFields = this.$('.additional_borrowing_reason_fields, .additional_borrowing_amount');

            additionalBorrowingFields.toggleClass('d-none', !additionalBorrowingCheckbox.is(':checked'));
        },

        _onchangeProtectionCover: function () {
            const protectionCoverCheckbox = this.$('.protection_checkbox input[type="checkbox"]');
            const protectionCoverFields = this.$('.insurance_provider, .monthly_premium, .protection_type, .employer_sick_pay_benefit');

            protectionCoverFields.toggleClass('d-none', !protectionCoverCheckbox .is(':checked'));
        },


        _onchangeSmokingStatus: function (ev) {
           var selectedOption = ev.target.value;
           var cigarettesPerDayField = this.$('.cigarettes_per_day');
           var stopSmokingDateField = this.$('.stop_smoking_date');

           if (selectedOption === 'currently_smoking') {
               cigarettesPerDayField.show();
               stopSmokingDateField.hide();
           } else if (selectedOption === 'stopped_smoking') {
               cigarettesPerDayField.hide();
               stopSmokingDateField.show();
           } else {
               cigarettesPerDayField.hide();
               stopSmokingDateField.hide();
           }
       },

        _onchangeAlcoholStatus: function (ev) {
           var selectedOption = ev.target.value;
           var alcoholConsumptionAMountField = this.$('.alcohol_consumption_amount');
           var stopDrinkingDate = this.$('.stop_drinking_date');

           if (selectedOption === 'currently_drinking') {
               alcoholConsumptionAMountField.show();
               stopDrinkingDate.hide();
           } else if (selectedOption === 'stopped_drinking') {
               alcoholConsumptionAMountField.hide();
               stopDrinkingDate.show();
           } else {
               alcoholConsumptionAMountField.hide();
               stopDrinkingDate.hide();
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

       _onchangeHideFieldsByCustomerType: function() {
            var customerType = $("select[name='customer_type']").val();
            if (customerType === "protection") {
                $("#kbn_check").closest(".col-12").hide();
            }
        },

        _onchangeWaitingReferralReport: function (ev) {
            const referralCheckbox = ev.target;
            const detailsField = document.querySelector('.details');

            if (referralCheckbox.checked) {
                detailsField.classList.remove('d-none');
            } else {
                detailsField.classList.add('d-none');
            }
        },

       _onchangeAdverseCreditCheck: function (ev) {
             var checkboxes = this.$('.adverse_credit input[type="checkbox"]');
             var tableContainer = this.$('.adverse_credit_table');
             var anyCheckboxChecked = checkboxes.is(':checked');
             tableContainer.toggleClass('d-none', !anyCheckboxChecked);
         },


     _onchangeDateOfBirth: function (ev) {
        const dobInput = ev.target;
        const dob = new Date(dobInput.value);
        const monthlyChildcareCostField = document.querySelector('.monthly_childcare_cost');
        const childcareCostReasonField = document.querySelector('.childcare_cost_reason');// Ensure valid date object

        if (!dob.getTime()) {
            console.warn('Invalid date of birth entered.');
            return; // Handle invalid date gracefully
        }

        const today = new Date();
        const ageInYears = Math.floor(Math.abs(today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365));

        const dependencyTypeSelect = this.$('select[name="dependency_type"]');
        if (dependencyTypeSelect.length) {
            dependencyTypeSelect.val(ageInYears >= 18 ? 'adult' : 'child');
            // Trigger the change event to call _onchangeDependencyType
            dependencyTypeSelect.trigger('change');
        } else {
            console.warn('Dependency type select element not found.');
        }

        if (monthlyChildcareCostField && childcareCostReasonField) {
            if (ageInYears < 10) {
                monthlyChildcareCostField.style.display = 'block';
                childcareCostReasonField.style.display = 'block';
            } else {
                monthlyChildcareCostField.style.display = 'none';
                childcareCostReasonField.style.display = 'none';
                }
        }
    },

    _onchangeDependencyType: function (ev) {
        var selectedOption = ev.target.value;
        var additionalCostField = document.querySelector('.additional_cost');

         if (selectedOption === 'adult') {
            additionalCostField.style.display = 'block';
        } else {
            additionalCostField.style.display = 'none';
        }
    },


         _onchangeCommitmentType: function (ev) {
            const selectedOption = ev.target.value;
            this._updateCommitmentVisibility(selectedOption);
        },

        _updateCommitmentVisibility: function (selectedOption) {
            const monthlyPaymentInput = this.$('#monthly_payment');
            const creditLimitInput = this.$('#credit_limit');
            const remainingMonthsInput = this.$('#remaining_months');
            const relevantOptions = ['credit_card', 'store_card', 'mail_orders'];

            if (relevantOptions.includes(selectedOption)) {
                monthlyPaymentInput.closest('.form-group').hide();
                creditLimitInput.closest('.form-group').hide();
                remainingMonthsInput.closest('.form-group').hide();
            } else {
                monthlyPaymentInput.closest('.form-group').show();
                creditLimitInput.closest('.form-group').show();
                remainingMonthsInput.closest('.form-group').show();
            }
        },


    });
});
