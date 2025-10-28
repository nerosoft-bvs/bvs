from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime, timedelta
from odoo.tools import email_normalize


class FactFind(models.Model):
    _inherit = 'fact.find'

    financial_depend_ids = fields.One2many('financial.dependent', 'fact_find_id', string='Financial Depends')


class FinancialDependants(models.Model):
    _name = 'financial.dependent'
    _description = 'Financial Dependent Details'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    has_dependents = fields.Boolean('Do you have any financial dependents?')
    number_of_dependents = fields.Integer('How many dependents?')
    full_name = fields.Char('Full Name')
    relationship = fields.Selection([
        ('spouse', 'Spouse'),
        ('son', 'Son'),
        ('daughter', 'Daughter'),
        ('child_relative', 'Child Relative'),
        ('elderly_relative', 'Elderly Relative')
    ], 'Relationship')
    date_of_birth = fields.Date('Date of Birth')
    date_of_birth_fd = fields.Date('Date of Birth')
    dependency_type = fields.Selection([
        ('adult', 'Adult'),
        ('child', 'Child')
    ], 'Dependency Type', compute='_compute_dependency_type', store=True)

    dependency_period = fields.Selection([
        ('up-to', 'Up to Age 21'),
        ('whole-life', 'Whole of Life')
    ], string='Dependency Period')

    monthly_childcare_cost = fields.Float('Monthly Childcare Cost')
    childcare_cost_reason = fields.Text('Reason for Childcare Cost')
    additional_cost = fields.Float('Additional Cost for Adults')
    additional_reason = fields.Char('Additional reason for Adults')
    has_additional_cost = fields.Boolean('Additional Cost for Adults')


    @api.depends('date_of_birth')
    def _compute_dependency_type(self):
        for dependent in self:
            if dependent.date_of_birth:
                dob = fields.Date.from_string(dependent.date_of_birth)
                dob_datetime = datetime.combine(dob, datetime.min.time())  # Convert dob to datetime
                age = (datetime.now() - dob_datetime) // timedelta(days=365.25)
                dependent.dependency_type = 'adult' if age >= 18 else 'child'
