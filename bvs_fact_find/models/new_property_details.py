from odoo import models, fields

year = fields.Date.today().year
YEARS = [(str(year - i), str(year - i)) for i in range(100)]


class NewPropertyDetails(models.Model):
    _inherit = 'fact.find'

    property_usage = fields.Selection([
        ('residential', 'Residential'),
        ('second_residential', 'Second Residential'),
        ('btl', 'BTL'),
        ('company_btl', 'Company BTL'),
    ], string='Property Usage')

    is_new_build = fields.Boolean('Is this a new build property?')

    house_flat_no = fields.Char('House No / Flat No')
    post_code = fields.Char('Post code')
    address = fields.Text('Address')
    building_name = fields.Char('Building Name')
    street_address = fields.Char('Street Address')
    county = fields.Char('County')
    market_price = fields.Float('Market Price')

    commute_over_one_hour = fields.Boolean(
        'Do you spend more than one hour to travel from new property to current employment address?')
    monthly_commute_cost = fields.Float('Monthly Commute Cost')
    property_type = fields.Selection([
        ('semi_detached', 'Semi-detached'),
        ('detached', 'Detached'),
        ('terraced', 'Terraced'),
        ('end_terraced', 'End-Terraced'),
        ('purpose_built_flat', 'Purpose Built Flat'),
        ('maisonette', 'Maisonette'),
        ('converted_flat', 'Converted Flat'),
        ('bunglow', 'Bunglow'),
        ('other', 'Other'),
    ], string='Property type')
    tenure = fields.Selection([
        ('freehold', 'Freehold'),
        ('leasehold', 'Leasehold'),
    ], string='Tenure')
    no_bedrooms = fields.Integer('No of bedrooms')
    no_bathrooms = fields.Integer('No of bathrooms')
    kitchen = fields.Integer('Kitchen')
    living_rooms = fields.Integer('Living rooms')
    garage_space = fields.Integer('Garage Space')
    parking = fields.Selection([
        ('single', 'Single'),
        ('double', 'Double'),
        ('on_site', 'On-site'),
        ('road_side', 'Road Side'),
    ], string='Parking')
    no_stories_in_building = fields.Integer('No of stories in the building')
    estimated_built_year = fields.Selection(string="Estimated Built Year",
                                            selection=YEARS)
    warranty_providers_name = fields.Char('Warranty providers Name')
    epc_predicted_epc_rate = fields.Selection([
        ('a', 'A'),
        ('b', 'B'),
        ('c', 'C'),
        ('d', 'D'),
        ('e', 'E'),
        ('f', 'F'),
        ('na', 'NA'),
    ], string='EPC / predicted EPC rate')
    pea_rate = fields.Selection([
        ('a', 'A'),
        ('b', 'B'),
        ('c', 'C'),
        ('d', 'D'),
        ('e', 'E'),
        ('f', 'F'),
        ('na', 'NA'),
    ], string='PEA rate')
    ex_council = fields.Boolean('Ex-Council')
    annual_service_charge = fields.Float('Annual service charge')
    wall_construction_type = fields.Selection([
        ('brick', 'Brick'),
        ('brick_over_timber_frame', 'Brick over Timber Frame'),
        ('timber', 'Timber'),
        ('stone', 'Stone'),
        ('metal', 'Metal'),
    ], string='Wall Construction type')
    roof_construction_type = fields.Selection([
        ('tile', 'Tile'),
        ('slate', 'Slate'),
        ('timber', 'Timber'),
        ('asphalt', 'Asphalt'),
    ], string='Roof Construction type')
    shared_ownership_existing = fields.Boolean('Shared Ownership Available?')
    remaining_lease_term_in_years = fields.Integer('Remaining lease term in years')
    # Additional property details
    flat_in_floor = fields.Boolean('Flat in floor')
    flats_in_floor = fields.Integer('Flat in floor?')
    flats_same_floor_count = fields.Integer('How many flats are in the same floor?')
    above_commercial_property = fields.Selection([
        ('food_outlet', 'Flat above commercial food outlet'),
        ('offices', 'Flat above commercial offices'),
        ('pub', 'Flat above commercial pub'),
        ('shop', 'Flat above shop (not food outlet)'),
    ], string='Is the flat situated above a commercial property?')
    ground_rent = fields.Float('Ground rent')

    # Shared ownership details
    shared_ownership = fields.Boolean('Is this property in Shared Ownership Scheme?')
    ownership_percentage = fields.Selection([
        (20, '20%'),
        (25, '25%'),
        (30, '30%'),
        (35, '35%'),
        (40, '40%'),
        (45, '45%'),
        (50, '50%'),
        (55, '55%'),
        (60, '60%'),
        (65, '65%'),
        (70, '70%'),
        (75, '75%'),
        (80, '80%'),
        (85, '85%'),
        (90, '90%'),
    ], string='Ownership % of yours')

    # Help to buy loan details
    help_to_buy_loan = fields.Boolean('Do you have Help to Buy Loan for this property?')
    help_to_buy_loan_type = fields.Selection([
        ('outside_london', 'Outside London 20%'),
        ('london', 'London 40%'),
    ], string='Loan type')
    # Rental income details
    estimated_monthly_rental_income = fields.Float('Estimated monthly rental income')
    current_monthly_rental_income = fields.Float('Current Monthly rental income')
    hmo = fields.Boolean('HMO')
    occupants_count = fields.Integer('How many occupants in this property?')

    company_name = fields.Char('Company Name')
    company_director = fields.Selection([
        ('one_applicant_only', 'One applicant only'),
        ('joint', 'Joint'),
    ], string='Are you a company director?')
    additional_borrowing = fields.Boolean('Do you want to borrow any additional amount from this mortgage?')
    additional_borrowing_reason = fields.Selection([
        ('home_improvements_property', 'Home Improvements of this property'),
        ('home_improvements_other_property', 'Home improvemnets of another property'),
        ('deposit_additional_property', 'Deposit to buy an additional property'),
        ('debt_management', 'Debt Management'),
    ], string='The reason for additional borrowing')
    additional_borrowing_amount = fields.Float('The additional borrowing amount')

