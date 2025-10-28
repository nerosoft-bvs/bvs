from odoo import models, fields


class FactFindCreditCommitment(models.Model):
    _inherit = 'fact.find'

    credit_comment_ids = fields.One2many('credit.comment', 'fact_find_id', string='Credit Commitments')


class CreditComment(models.Model):

    _name = 'credit.comment'

    fact_find_id = fields.Many2one('fact.find', string="Fact Find")
    has_credit_commitments = fields.Boolean('Do you have credit commitments?')
    commitment_type = fields.Selection([
        ('credit_card', 'Credit Card'),
        ('store_card', 'Store Card'),
        ('hire_purchase', 'Hire Purchase'),
        ('personal_loan', 'Personal Loan'),
        ('secured_loan', 'Secured Loan'),
        ('overdraft', 'Overdraft'),
        ('mail_orders', 'Mail Orders'),
        ('buy_now_pay_later', 'Buy Now Pay Later'),
        ('student_loan', 'Student Loan'),
        ('child_care', 'Child Care'),
    ], 'Commitment Type')
    lender = fields.Char('Lender')
    outstanding_amount = fields.Char('Outstanding Amount')
    monthly_payment = fields.Float('Monthly Payment')
    credit_limit = fields.Float('Credit Limit')
    remaining_months = fields.Integer('Remaining Months')
    intend_to_repay = fields.Boolean('Intend to repay on or before completion of new mortgage?')

