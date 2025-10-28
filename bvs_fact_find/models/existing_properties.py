from odoo import models, fields


class FactFindPropertyDetails(models.Model):
    _inherit = 'fact.find'

    htb_scheme_available = fields.Boolean('HTB Scheme Available')
    htb_location = fields.Selection([
        ('london', 'London'),
        ('outside_london', 'Outside London'),
    ], 'HTB Location')
    redeem_htb_loan = fields.Boolean('Do you redeem the HTB loan?')
    shared_ownership_available = fields.Boolean('Shared Ownership Available')
    ownership_percentage = fields.Float('% of Ownership')
    second_charge_details = fields.Text('Second Charge Details')
    property_details_ids = fields.One2many('property.details', 'fact_find_id', string='Existing Property Details')


class PropertyDetails(models.Model):
    _name = 'property.details'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    house_number = fields.Char('House Number')
    postcode = fields.Char('Postcode')
    street_address = fields.Text('Street Address')
    county = fields.Char('County')
    property_type = fields.Selection([
        ('semi', 'Semi Detached'),
        ('detached', 'Detached'),
        ('terrace', 'Terrace'),
        ('end', 'End Terrace'),
        ('purpose', 'Purpose Built Flat'),
        ('maisonette', 'Maisonette '),
        ('bunglow', 'Bunglow'),
        ('other', 'Other'),
    ], 'Property Type')
    bedrooms = fields.Integer('Bedrooms')
    current_property_valuation = fields.Float('Current Property Valuation')
    tenure = fields.Selection([
        ('freehold', 'Freehold'),
        ('leasehold', 'Leasehold'),
    ], 'Tenure')
    has_mortgage = fields.Boolean('Does the property have a Mortgage?')
    ground_rent = fields.Float('Ground Rent')
    service_charge = fields.Float('Service Charge')
    first_let_date = fields.Date('First Let Date')
    monthly_rental_income = fields.Float('Monthly Rental Income')
    is_hmo = fields.Boolean('Is this HMO?')
    property_usage = fields.Selection([
        ('residential', 'Residential'),
        ('second_residential', 'Second Residential'),
        ('btl', 'BTL'),
        ('company_btl', 'Company BTL'),
    ], string='Property Usage')
    htb_scheme_available = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='HTB Schema Availble')

    redeem_htb_loan = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Redeem HTB Loan')

    shared_ownership_available = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Shared Ownership Available')

    htb_scheme_location = fields.Selection([
        ('london', 'London'),
        ('outside_london', 'Outside London'),
    ], string='Property Usage')

    ownership_percentage = fields.Selection(
        [('25', '25%'),
         ('30', '30%'),
         ('35', '35%'),
         ('40', '40%'),
         ('45', '45%'),
         ('50', '50%'),
         ('55', '55%'),
         ('60', '60%'),
         ('65', '65%'),
         ('70', '70%'),
         ('75', '75%'),
         ('80', '80%'),
         ('85', '85%'),
         ('90', '90%'),
         ], string='Ownership Percentage')

    second_charge_property = fields.Selection(
        [('yes', 'Yes'),
         ('no', 'No')], string='Do you have any second charge for the property?')

    second_charge_details = fields.Text(string='Second Charge Details')
    mortgage_ids = fields.One2many(
        'existing.mortgages',
        'property_details_id',
        string='Related Mortgages',
        help='Mortgages associated with this property'
    )
