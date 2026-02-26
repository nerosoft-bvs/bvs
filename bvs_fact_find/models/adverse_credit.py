from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import email_normalize


class FactFindAdverseCredit(models.Model):
    _inherit = 'fact.find'

    missed_payment_last_3_years = fields.Boolean('Missed any payment for credit card, store card, or loan in the last 3 years?')
    arrears_with_mortgage_or_loans = fields.Boolean('Been in arrears with your mortgage payment or other loans?')
    ccj_against_you = fields.Boolean('Had a county court judgement (CCJ) against you?')
    arrangements_with_creditors = fields.Boolean('Made arrangements with creditors (IVA)?')
    debt_management_plan = fields.Boolean('Been in a debt management plan?')
    default_registered = fields.Boolean('Had any default registered against you or your business?')
    failed_to_keep_up_repayments = fields.Boolean('Failed to keep up mortgage & second charge repayments?')
    bankruptcy = fields.Boolean('Been bankrupt?')
    adverse_credit_details = fields.One2many('adverse.credit.details', 'fact_find_id', 'Adverse Credit Details')


class AdverseCreditDetails(models.Model):
    _name = 'adverse.credit.details'
    _description = 'Adverse Credit Details'

    fact_find_id = fields.Many2one('fact.find', 'Fact Find')
    adverse_credit_type = fields.Selection([
        ('type1', 'Type 1'),
        ('type2', 'Type 2'),
        ('type3', 'Type 3'),
        ('type4', 'Missed Payment / Arrears'),
        ('ccj', 'CCJ'),
        ('default', 'Default'),
        ('iva', 'Individual Voluntary Arrangement'),
        ('dmp', 'Debt Management Plan'),
        ('arrangements_to_pay', 'Arrangements to Pay'),
        ('bankrupt', 'Bankrupt'),

    ], 'Adverse Credit Type')
    total_count = fields.Float('Total Count')
    loan_type = fields.Char('Loan Type')
    lender = fields.Char('Lender')
    amount = fields.Float('Amount')
    reported_on = fields.Date('Reported On')
    settled_on = fields.Date('Settled On')
