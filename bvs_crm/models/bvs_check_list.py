from odoo import api, models, fields, _


class Checklist(models.Model):
    _inherit = 'bvs.lead'

    risk_assessment = fields.Boolean(string='Risk Assessment Checklist')
    passport_not_expired = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Passport / Driving License is not expired')
    brp_not_expired = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='BRP not expired')
    duly_signed_passport = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Duly Signed Passport')
    sharecode_available = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Sharecode is available for next 3 months')
    travel_cost = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Travel Cost')
    child_care_cost = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Child Care Cost')
    employment_type = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Employment type is defined correctly')

    uk_working_duration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='How long has the client been working in the UK?')
    salary_credit_reference = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Salary Credit Reference in Bank Statements')
    employee_reference_payslip = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Employee Reference No. in the Payslip')
    company_house_details = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Company House Details in Gov Website')
    company_accounts = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Company Accounts in Company House')
    pay_slip_netpay = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Payslip Netpay is equal to the credited amount in Bank statement ')
    num_employees_company = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Number of Employees in the Company')
    commute_cost = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Commute Cost')
    student_loan = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Student Loan')
    share_save = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Sharesave')

    # Self Employment details
    sa302_verified_hmrc = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Is SA302 verified by HMRC?')
    sa302_utr_number = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='SA302 UTR Number')
    sa302_100_percent_complete = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='SA302 100% Complete')
    sa302_tax_equal_tyo = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='SA302 Tax is Equal to TYO')
    tyo_due_zero = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='TYO Due is Zero')
    manage_time_both_jobs = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='How does he manage time in both jobs?')
    distance_between_employments = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Distance between two employments')
    state_benefits = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='State Benefits')
    btl_income = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='BTL Income')
    recently_paid_off_commitments = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Any commitments recently paid off')
    commitments_paid_off_six_months = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Any commitments will be paid off in next 6 months')
    adverse_credits = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Adverse Credits')
    cash_in_transactions = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Cash-In transactions')
    cash_out_transactions = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Cash-Out transactions')
    direct_debit_transactions = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Direct Debit transactions')
    gifted_deposit_acceptable = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Gifted deposit is acceptable if applicable')
    portfolio_landlord = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Portfolio Landlord')
    property_expenses_affect_budget = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Other property expenses affect monthly budget')
    child_benefit = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Child benefit')
    pip = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string=' PIP')
    universal_tax = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string=' Universal tax credit for low income applicants')
    housing_benefits = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string=' Housing benefit not considered')
    ground_rent = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string=' Ground rent & service charges')
    fd_over_18 = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string=' Financial dependents >18 years old')

    fd_below_18 = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string=' Financial dependents <18 years old')


    # affordability Checklist

    acceptable_retirement_age = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Retirement Age According to Job Category')
    acceptable_visa_status = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Visa status and remaining months in visa')
    child_benefit_more_than = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Child benefit not considered for applicants more than 50K income')
    uk_address_history_enough = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='UK Address History is Enough for the Lender')
    employment_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Employment / Self Employment Details Criteria')
    acceptable_benefit_income = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Child benefit only for less than 13 years old')
    dla_pip_for_dependant = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='DLA / PIP for the dependents ')
    financial_dependents_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Financial Dependents Included for the Application')
    credit_commitments = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Credit Commitments')
    travel_costs = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Travel Cost')
    child_care_costs = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Child Care Cost')
    adverse_credit_history = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Adverse Credit History (Recorded and satisfied within 6 years)')
    house_or_flat = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='House or Flat (If flat, ground rent & service charge may apply)')
    new_build = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='New Built or Not New Build(If a New built LTV % and Service charge may vary)')
    source_of_deposit_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Source of Deposit Criteria (Deposit should be ready at the time of application)')
    deposit_ready_at_application = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Deposit Ready at the Time of Application (N/A for remortgage applications)')
    additional_borrowing_purpose = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Additional Borrowing Purpose when Remortgaging')
    existing_mortgages_or_property = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Existing Mortgages or Property Available')
    special_lender_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Special Lender Selection Criteria')
    final_stamp_duty_amount = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Final Stamp Duty Amount if applicable')

    # DIP

    acceptable_retirement_age = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Retirement Age According to Job Category')
    acceptable_visa_status = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Visa Status')
    remaining_months_in_visa = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Remaining Months in Visa')
    uk_address_history_enough = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='UK Address History is Enough for the Lender')
    employment_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Employment / Self Employment Details Criteria')
    acceptable_benefit_income = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Benefit Income (Child benefit only for less than 13 years)')
    financial_dependents_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Financial Dependents Included for the Application')
    credit_commitments = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Credit Commitments')
    travel_cost = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Travel Cost')
    child_care_cost = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Child Care Cost')
    adverse_credit_history = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Adverse Credit History (Recorded and satisfied within 6 years)')
    house_or_flat = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='House or Flat (If flat, ground rent & service charge may apply)')
    new_build = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='New Build (If a New built LTV % and Service charge may vary)')
    source_of_deposit_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ],
        string='Source of Deposit Criteria (If a gift from family or friend, check criteria)')
    deposit_ready_at_application = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Deposit Ready at the Time of Application (N/A for remortgage applications)')
    additional_borrowing_purpose = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Acceptable Additional Borrowing Purpose when Remortgaging')
    existing_mortgages_or_property = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Existing Mortgages or Property Available')
    special_lender_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Special Lender Selection Criteria')
    final_stamp_duty_amount = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Final Stamp Duty Amount (If applicable)')
    latest_affordability_assessment = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Latest Affordability Assessment')
    lender_calculator = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Lender Calculator')
    client_confirmation_hard_print_credit_check = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ],  string='Client Confirmation for Hard Print Credit Check')
    declined_dip_lender_names_reasons = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Declined DIP Lender(Please mention in notes')

    # Solicitor Request

    freehold_leasehold = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Freehold / Leasehold')

    first_time_buyer = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='First Time Buyer')
    btl = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Buy to Let (BTL)')
    limited_company_btl = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Limited Company Buy to Let (COM BTL)')
    new_build = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='New Build')
    second_property = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Second Property')
    rtb_htb_shared_ownership_second_charge = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='RTB / HTB / Shared Ownership / Second Charge')
    gifted_deposit = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Gifted Deposit')
    htb_isa_lifetime_isa = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='HTB ISA / Lifetime ISA')

    # Mortgage Illustrations

    advisor_correct = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Advisor is correct')
    proc_fee_correctly_mentioned = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Proc fee is correctly mentioned')
    advisor_fee_available = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Advisor fee available')
    mortgage_type_residential_btl = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Mortgage Type (Residential / BTL)')
    client_type_ftb_hm_remortgage = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client type (FTB / HM / Remortgage)')
    early_repayment_charges = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Early repayment charges')

    corrct_income_details = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Correct income details ')

    valuation_fee = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Valuation Fee')
    is_the_client = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Is the client agreed to add Product Fee to the loan?')
    application_fee = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Application Fee?')
    legal_fee = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Legal Fee?')


    source_of_deposit_criteria = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client names are correct with the passport')
    retirement_age_correct = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Retirement age is correct')
    rate_type_different_from_fixed = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Rate type is different from fixed?')
    repayment_strategy_1 = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Repayment Strategy')
    not_stepped_selected = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Not Stepped selected')
    why_pt_without_remortgage = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Why PT without remortgage?')
    correct_client_names_passport = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client names are correct with the passport')
    correct_income_details = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Correct income details')
    house_or_flat = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='House or Flat')
    correct_property_address = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Property address is correct')
    new_build_product = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='New Build Product')
    htb_shared_equity = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='HTB / Shared Equity')
    shared_ownership = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Shared Ownership')
    ex_council_house = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Ex-Council house')
    source_of_deposit = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Source of deposit')
    cheapest_lender = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Is this the cheapest lender?')
    lender_selection_reason = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Why Lender selection')
    reason_for_additional_borrowing = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Reason for additional borrowing')
    valuation_fee_paid = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Valuation Fee')
    add_product_fee_to_loan = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Is the client agreed to add Product Fee to the loan?')
    application_fee_paid = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Application Fee')
    legal_fee = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Legal Fee')
    ltb = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='LTB')
    portfolio_landlord = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Is the client a Portfolio Landlord?')
    joint_clients_same_tax_rate = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Joint client are in the same tax rate or not')
    hmo = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='House in Multiple Occupancy')
    company_let = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Company Let (Company BTL)')
    holiday_let = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Holiday Let')
    if_not_why = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If not, why Lender selection')


    # pre Offer

    client_acknowledgement_check = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client Acknowledgement')

    advisor_correct = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Advisor is correct')
    correct_client_names_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client names are correct with the illustration')
    correct_client_names_passport = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client names are correct with the passport')
    client_income_matches_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Client income matches with the illustration')
    retirement_age_correct_illustration_mortgage_term = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Retirement age is correct with the illustration & mortgage term')
    htb_shared_ownership_schemes_available = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='HTB / Shared Ownership schemes available')
    proof_of_deposit_saved_in_folder = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Proof of deposit is saved in the folder')
    lender_selection = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Lender selection')
    product_term_correct = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Product term is correct')
    advisor_approval_check = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Advisor Approval')

    # post Offer
    # Client Details
    spellings_correct_passport = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Spellings of the name with the passport are correct')
    property_address_correct = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Mortgage property address & postcode is correct')
    purchase_valuation_price_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Purchase price & Valuation price match with the illustration')
    loan_amount_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Loan amount against illustration matches (If property is down valued, mention so)')
    monthly_payment_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Monthly payment matches with illustration (If property is down valued, mention so)')
    mortgage_term_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Mortgage term')
    repayment_method_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Repayment method')
    product_code_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Product code')
    product_term_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Product term')
    interest_rate_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Interest rate ')
    product_fee_match_illustration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Product fee (Paid or added to the loan)')
    offer_expiry_new_build = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If new build, offer expires after the anticipated legal completion date otherwise, please request an extension')
    offer_expiry_remortgage = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If remortgage, offer expires after the maturity of the existing mortgage otherwise, please request an extension')
    broker_fee = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Broker Fee')
    special_conditions_adverse_conditions = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Supplementary/special conditions section for any adverse conditions')

    # Legal Process Milestones

    case_created = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Case Created')
    starter_pack_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Starter Pack Received from Customer')
    customer_id_verification_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Customer ID Verification Received')
    contract_requested = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Contract Requested from Seller\'s Solicitor')
    contract_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Contract Received from Seller\'s Solicitor')
    searches_instructed = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Searches Instructed')
    title_confirmed = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Title Confirmed')
    contract_approved = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Contract Approved')
    replies_to_enquiries_approved = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Replies to All Enquiries Approved')
    searches_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Searches Received')
    mortgage_offer_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Mortgage Offer Received')
    contract_sent_to_customer = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Contract Sent to Customer for Signature')
    signed_contract_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Signed Contract Received back from Customer')
    contracts_exchanged = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Contracts Exchanged')
    purchase_completed = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Purchase Completed')

    case_created_date = fields.Date(string='Case Created')
    starter_pack_received_date = fields.Date(string='Starter Pack Received from Customer')
    customer_id_verification_received_date = fields.Date(string='Customer ID Verification Received')
    contract_requested_date = fields.Date(string='Contract Requested from Seller\'s Solicitor')
    contract_received_date = fields.Date(string='Contract Received from Seller\'s Solicitor')
    searches_instructed_date = fields.Date(string='Searches Instructed')
    title_confirmed_date = fields.Date(string='Title Confirmed')
    contract_approved_date = fields.Date(string='Contract Approved')
    replies_to_enquiries_approved_date = fields.Date(string='Replies to All Enquiries Approved')
    searches_received_date = fields.Date(string='Searches Received')
    mortgage_offer_received_date = fields.Date(string='Mortgage Offer Received')
    contract_sent_to_customer_date = fields.Date(string='Contract Sent to Customer for Signature')
    signed_contract_received_date = fields.Date(string='Signed Contract Received back from Customer')
    contracts_exchanged_date = fields.Date(string='Contracts Exchanged')
    purchase_completed_date = fields.Date(string='Purchase Completed')

    # Protection Criteria Check
    occupation_correctly_selected = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Occupation correctly selected')
    income_details_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Income details matched with illustration')
    no_bonus_considered = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='No bonus considered')
    single_life_cover = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If Single, Life cover can be given only when partner / dependents are available')
    dta_term_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Term is similar to the mortgage term')
    dta_cover_amount_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Cover amount is similar to the mortgage amount')
    dta_additional_borrowing_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If remortgage, additional borrowing amount is included')
    dta_waiver_of_premium_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Waiver of Premium included')
    dta_ci_and_tpd_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If CI included, Total Permanent Disability included')
    lta_term_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Term is similar to the dependency age of youngest (21 - current age)')
    lta_cic_term_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='LTA CIC only, term is similar to the retirement age')
    amount_term_similar_btl = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Amount and Term is similar to the BTL mortgage amount and BTL mortgage term')
    fib_rent_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Family Income benefit is similar to the shared ownership ren')
    fib_btl_property_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Family Income benefit is similar to the BTL property ')
    ip_uk_address_history = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Minimum UK 2 years address history')
    ip_indexation_rpi_selected = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Indexation: RPI selected')
    gp_registration = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='GP registration 2 years')
    ip_employer_sick_benefit_matched = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Matches the Employer sick benefit with deferred period')
    exeter_address_history = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='The Exeter: 3 years address history required')
    guardian_address_history = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If Guardian, 2 years UK address history required')
    zurich_wop_not_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If the client age is >54 years, Zurich has not included Waiver of Premium')
    if_zurich_wop_not_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If the client is House Person, Zurich has not included Waiver of Premium')
    aviva_wop_not_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='If the client is not employed, Aviva has not included Waiver of Premium')
    vitality_optimized_cover_not_selected = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
        ('not', 'N/A'),
        ], string='Vitality Optimized cover is not selected')

