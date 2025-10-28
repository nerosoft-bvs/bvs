from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import email_normalize


class FactFind(models.Model):
    _inherit = 'fact.find'

    self_employment_ids = fields.One2many('self.employed', 'fact_find_id', string='Self Employed')


class SelfEmployment(models.Model):
    _name = 'self.employed'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    is_self_employed = fields.Boolean(string='Is Self Employed')
    business_name = fields.Char(string='Business Name')
    self_employed_occupation = fields.Char(string='Occupation')
    self_employment_start_date = fields.Date(string='Self Employment Start Date')
    tax_year_1 = fields.Char(string='Tax Year 1')
    year_1_tax_income = fields.Float(string='Year 1 Tax Income')
    tax_year_2 = fields.Char(string='Tax Year 2')
    year_2_tax_income = fields.Float(string='Year 2 Tax Income')
    business_address = fields.Text(string='Business Address')
    business_contact_no = fields.Char(string='Business Contact No')
    has_business_bank_account = fields.Boolean(string='Do you have a business bank account?')
    has_accountant = fields.Boolean(string='Do you have an accountant for tax purposes?')
    accountant_firm_name = fields.Char(string='Accountant Firm Name')
    accountant_address = fields.Text(string='Accountant Address')
    accountant_contact_no = fields.Char(string='Accountant Contact No')
    accountant_qualification = fields.Char(string='Accountant Qualification')
    let_properties_count = fields.Integer(string='Number of Let Properties Currently Owned')
    let_properties_count_new = fields.Char(string='Number of Let Properties Currently Owned')
    self_employment_type = fields.Selection([
        ('sole_trader', 'Sole Trader'),
        ('company_director', 'Company Director >20% shares'),
        ('partnership', 'Partnership'),
        ('btl_income', 'BTL Income'),
        ('contractor', 'Contractor')
    ], string='Self Employment Type', default='sole_trader')
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
    firm_name = fields.Char(string='Accountant Firm Name')
    address = fields.Text(string='Accountant Address')
    contact_number = fields.Char(string='Accountant Contact No')
    qualification = fields.Char(string='Accountant Qualification')
