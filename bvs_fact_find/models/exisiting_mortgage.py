from odoo import models, fields


class FactFindPropertyMortgage(models.Model):
    _inherit = 'fact.find'

    existing_mortgages_ids = fields.One2many('existing.mortgages', 'fact_find_id', string='Existing Mortgages')


class ExistingMortgages(models.Model):
    _name = 'existing.mortgages'

    property_details_id = fields.Many2one(
        'property.details',
        string='Property Details',
        help='Link to the property record that has this mortgage'
    )
    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    property_address = fields.Text('Property Address')
    usage = fields.Selection([
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('second_residential', 'Second Residential'),
        ('btl', 'BTL'),
        ('company_btl', 'Company BTL'),
    ], 'Usage')
    ownership_of_deed = fields.Selection([
        ('sole_owner', 'Sole Owner'),
        ('joint_owners', 'Jointly'),
        ('client_or_someone_else', 'Only by client or with someone else'),
        ('partner_or_someone_else', 'Only by Partner or with someone else'),
    ], 'Ownership of the Deed')
    current_property_valuation = fields.Float('Current Property Valuation')
    outstanding_mortgage_amount = fields.Float('Outstanding Mortgage Amount')
    monthly_payment = fields.Float('Monthly Payment')
    lender = fields.Selection([
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
    ], string='Lender')
    account_no = fields.Char('Account No')
    rate_type = fields.Selection([
        ('fixed', 'Fixed'),
        ('variable', 'Variable'),
    ], 'Rate Type')
    current_rate = fields.Float('Current Rate')
    remaining_term = fields.Integer('Remaining Term (Months)')
    repayment_method = fields.Selection([
        ('repayment', 'Repayment'),
        ('interest_only', 'Interest Only'),
        ('part_and_part', 'Part & Part'),
    ], 'Repayment Method')
    remortgage_date = fields.Date('Remortgage Date')
    mortgage_case_number = fields.Char('Mortgage Case Number')
    property_purchased_date = fields.Date('Property Purchased Date')
    property_purchased_price = fields.Float('Property Purchased Price')
