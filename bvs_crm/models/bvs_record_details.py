from odoo import api, models, fields, _


class Record(models.Model):
    _inherit = 'bvs.lead'

    affordability_assessment_number = fields.Integer('Report Index')
    property_value = fields.Integer('Property Price')
    loan_amount = fields.Integer('Loan Amount')
    deposit = fields.Integer('Deposit')
    ltv = fields.Integer('LTV')
    maximum_loan_affordable = fields.Integer('Maximum Loan Affordable')
    mortgage_term = fields.Integer('Mortgage Term')
    retirement_age = fields.Integer('Retirement Age')
    property_known = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Property Known')
    application_type = fields.Selection([
        ('single', 'Single'),
        ('joint', 'Joint'),
    ], string='Application', default='single')
    lender_calculator = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Lender Calculator')
    lender_name = fields.Selection([
        ('hodge_lifetime', 'Hodge Lifetime'),
        ('hsbc', 'HSBC'),
        ('kensington_mortgages', 'Kensington Mortgages'),
        ('kent_reliance', 'Kent Reliance'),
        ('landbay', 'Landbay'),
        ('leeds_building_society', 'Leeds Building Society'),
        ('metro_bank', 'Metro Bank'),
        ('nationwide_building_society', 'Nationwide Building Society'),
        ('natwest', 'NatWest'),
        ('newcastle_building_society', 'Newcastle Building Society'),
        ('nottingham_building_society', 'Nottingham Building Society'),
        ('paragon_mortgages', 'Paragon Mortgages'),
        ('pepper_money', 'Pepper Money'),
        ('platform_mortgages', 'Platform Mortgages'),
        ('precise_mortgages', 'Precise Mortgages'),
        ('principality_building_society', 'Principality Building Society'),
        ('progressive_building_society', 'Progressive Building Society'),
        ('saffron_building_society', 'Saffron Building Society'),
        ('santander', 'Santander'),
        ('scottish_building_society', 'Scottish Building Society'),
        ('scottish_widows_bank', 'Scottish Widows Bank'),
        ('skipton_building_society', 'Skipton Building Society'),
        ('the_mortgage_works', 'The Mortgage Works'),
        ('tsb', 'TSB'),
        ('vida_homeloans', 'Vida Homeloans'),
        ('virgin_money', 'Virgin Money'),
        ('west_brom_for_intermediaries', 'West Brom for Intermediaries'),
        ('zephyr_homeloans', 'Zephyr Homeloans'),
    ], string='Lender Name')
    assumption_1_visa_status = fields.Text(' 1: Visa Status and remaining visa')
    assumption_2_uk_address_history = fields.Text('2: UK Address History')
    assumption_3_financial_dependents = fields.Text('3: Financial dependents and cost')
    assumption_4_employment_commute_cost = fields.Text('4: Employment and commute cost')
    assumption_5_other_income_eligibility = fields.Text('5: Other income eligibility')
    assumption_6_credit_commitments = fields.Text('6: Credit commitments')
    assumption_7_adverse_credit_history = fields.Text('7: Adverse Credit history')
    assumption_8_house_or_flat = fields.Selection([
        ('house', 'House'),
        ('flat', 'Flat'),
    ], string='8: House or Flat')
    assumption_9_new_build = fields.Selection([
        ('new_build', 'New Build'),
        ('not_new_build', 'Not New Build'),
    ], string='9: New build or Not')
    date_of_afforedability = fields.Date(string="Report Date")

    # offer reference
    offer_reference_no = fields.Char('Offer Reference No')
    offer_issued_date = fields.Date('Offer Issued Date')
    offer_number_index = fields.Integer('Offer Number [Index]')
    property_valuation = fields.Integer('Property Valuation')
    # loan_amount = fields.Integer('Loan Amount')
    product_fee = fields.Integer('Product Fee')
    valuation_fee = fields.Integer('Valuation Fee')
    # mortgage_term = fields.Integer('Mortgage Term')
    procuration_fee = fields.Integer('Procuration Fee')
    initial_rate = fields.Integer('Initial Rate')
    monthly_payment = fields.Integer('Monthly Payment')
    offer_expiry = fields.Date('Offer Expiry')
    product_end_date = fields.Date('Product End Date')

    # DIP
    dip_number_index = fields.Integer('DIP Number')
    reference_number = fields.Char('Reference Number')
    single_joint_application = fields.Selection([
        ('joint', 'Joint'),
    ], string='Single / Joint Application')
    date_dip = fields.Date(string="Date of Dip", default=fields.Date.today)
    date_expiry = fields.Date(string="Date Expiry")
    rate_reserved = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Rate reserved')
    interest_rate = fields.Integer(string="Interest rate")
    product_term = fields.Selection([
        ('two', '2'),
        ('three', '3'),
        ('five', '5'),
        ('seven', '7'),
        ('ten', '10'),
        ('life', 'Life Time'),
    ], string='Product Term')
    reserved_expiry_date = fields.Date(string="Reserved Expiry Date")
    new_build_house_ltv = fields.Char(string="New Build House Max LTV")
    new_build_flat_ltv = fields.Char(string="New Build Flat Max LTV")
    assumption_10_source_of_deposit = fields.Char('10: Source of deposit')
    remarks = fields.Text('Remarks')
    date_of_dip = fields.Date('Date of DIP')
    date_of_expiry = fields.Date('Date of Expiry')
    reserved_date_expiry_date = fields.Date('Reserved Date Expiry Date')
    savings_gift = fields.Selection([
        ('savings_only', 'Savings Only'),
        ('savings_gift', 'Savings + Gift'),
    ], string='Savings only / Savings + Gift')
    auto_select = fields.Selection([
        ('option1', 'Option 1'),
        ('option2', 'Option 2'),
        ('option3', 'Option 3'),
    ], string='Auto Select')
    is_reserved = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Is Reserved')
    number_with_decimals = fields.Integer('Number with Decimals')
    number_2_3_5 = fields.Selection([
        ('2', '2'),
        ('3', '3'),
        ('5', '5'),
    ], string='Number 2 / 3 / 5')
    date_field = fields.Date('Date')

    # solicitor
    selection_by = fields.Selection([
        ('by_client', 'By Client'),
        ('direct', 'Direct'),
        ('owc', 'OWC'),
        ('by_lender', 'By Lender'),
    ], string='Selection By')

    quote_number_index = fields.Integer('Quote Number')
    solicitor_firm = fields.Many2one('res.partner', string='Solicitor Firm')
    address = fields.Text('Address')
    contact_no = fields.Char('Solicitor Contact Number')
    email = fields.Char('Email')
    quote_date = fields.Date('Quote Date')
    quote_ref = fields.Char('Quote Ref')
    property_address = fields.Text('Property Address')
    total_cost = fields.Integer('Total Cost')
    quote_expiry_date = fields.Date('Quote Expiry Date')
    commission = fields.Integer('Commission')
    case_handler = fields.Text('Cash Handler')
    instructed = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Instructed?')
    instructed_date = fields.Date('Instructed Date')
    instruction_ref_no = fields.Char('Instruction Ref No')
    invoice_received = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Invoice Received')
    by_client_field = fields.Integer('By Client Field')
    direct_field = fields.Selection([
        ('list_option1', 'List Option 1'),
        ('list_option2', 'List Option 2'),
    ], string='Direct Field')
    owc_field = fields.Char('OWC Field', size=11, help='Royal Mail: 11 digits')
    by_lender_field = fields.Integer('By Lender Field')
    only_if_instructed_field = fields.Text('Only if Instructed Field')
    property_poc = fields.Char(string='Property PostCode')
    instructed_sel = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Instrusted?')
    invo_res = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Invoice Received')

    # FMA
    fma_number_index = fields.Integer('FMA Number')
    lender_reference_no = fields.Char('Lender Reference No')
    fma_submission_date = fields.Date('FMA Submission Date')
    applicants = fields.Selection([
        ('joint', 'Joint'),
        ('applicant1', 'Applicant 1'),
        ('applicant2', 'Applicant 2'),
        ('applicant3', 'Applicant 3'),
    ], string='Applicants')
    selected_illustration_no = fields.Char('Selected Illustration No')
    repayment_strategy = fields.Selection([
        ('repayment', 'Repayment'),
        ('interest_only', 'Interest Only'),
        ('part_and_part', 'Part & Part'),
    ], string='Repayment Strategy')

    # prot quote
    quote_number = fields.Selection([
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
    ], string='Quote Number')
    survey_level = fields.Selection([
        ('basic', 'Basic'),
        ('intermediate', 'Intermediate'),
        ('comprehensive', 'Comprehensive'),
    ], string='Survey Level')
    survey_firm = fields.Text('Survey Firm')

    # prot app submission
    application_submitted_date = fields.Date('Application Submitted Date')
    application_ref_number = fields.Char('Application Ref Number')
    lives_assured = fields.Selection([
        ('joint', 'Joint'),
        ('applicant1', 'Applicant 1'),
        ('applicant2', 'Applicant 2'),
    ], string='Lives Assured')
    cover = fields.Selection([
        ('DTA Life', 'DTA Life'),
        ('DTA CIC', 'DTA CIC'),
        ('DTA Life + CIC', 'DTA Life + CIC'),
        ('LTA Life', 'LTA Life'),
        ('LTA CIC', 'LTA CIC'),
        ('LTA Life + CIC', 'LTA Life + CIC'),
        ('Income Protection', 'Income Protection'),
        ('Family Income Benefit', 'Family Income Benefit')
    ], string='Cover')

    benefit_amount = fields.Integer('Benefit Amount')
    benefit_frequency = fields.Selection([
        ('monthly', 'Monthly'),
        ('one_off', 'One-off'),
    ], string='Benefit Frequency')
    monthly_premium = fields.Integer('Monthly Premium')
    term = fields.Integer('Term')
    proposed_start_date = fields.Date('Proposed Start Date')

    # prot offer
    offer_ref_number = fields.Char('Offer Ref Number')
    insurance_provider_list = fields.Many2one('res.partner', string="Insurance Provider List")
    offer_exceptant_deadline = fields.Date(string="Quote Expiry Date")

    # cover list
    dta_life = fields.Char(string="DTA Life")
    dta_cic = fields.Char(string="DTA CIC")
    dta_cic_life = fields.Char(string="DTA CIC + DTA Life")
    lta_life = fields.Char(string="LTA Life")
    lta_cic = fields.Char(string="LTA CIC")
    lta_cic_life = fields.Char(string="LTA CIC + LTA Life")
    income_protection = fields.Char(string="Income Protection")
    family_protection = fields.Char(string="Family Income Benefit")

    # hi quotes
    insurance_type = fields.Selection([
        ('building_content', 'Building & Content'),
        ('building_only', 'Building Only'),
    ], string='Insurance Type')
    monthly_amount = fields.Integer('Monthly Amount')
    annual_amount = fields.Integer('Annual Amount')
    home_emergency = fields.Boolean('Home Emergency')
    legal_expenses = fields.Boolean('Legal Expenses')
    accidental_damage = fields.Boolean('Accidental Damage')

    # esis
    applicants_esis = fields.Selection([
        ('joint ', 'Joint'),
        ('applicant_1', 'Applicant 1'),
        ('applicant_2', 'Applicant 2'),
        ('applicant_3', 'Applicants 3'),
    ], string='Applicants')
    illustration_date = fields.Date('Illustration Date')
    repayment_method = fields.Selection([
        ('repayment', 'Repayment'),
        ('interest_only', 'Interest Only'),
        ('part_and_part', 'Part & Part'),
    ], string='Repayment Method')
    rate_type = fields.Selection([
        ('fixed', 'Fixed'),
        ('tracker', 'Tracker'),
        ('discount', 'Discount'),
        ('variable', 'Variable'),
    ], string='Rate Type')
    application_fee = fields.Integer('Application Fee')
    cashback = fields.Integer('Cashback')
    upload_esis = fields.Binary('Upload ESIS')
    upload_filters = fields.Binary('Upload Filters')
    dta_life_cover_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='DTA Life Cover Included')
    cover_term = fields.Integer('Cover Term')
    cover_expiry_date = fields.Date('Cover Expiry Date')

    # hi submission
    insurance_start_date = fields.Date('Insurance Start Date')
    policy_certificate = fields.Text('Policy Certificate')
    # policy_booklet = fields.Integer('Policy Booklet Number')
    rebuild_cost = fields.Char(string="Rebuild Cost")
