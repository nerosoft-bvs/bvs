from odoo import models, fields, api


class FactFindDepositDetails(models.Model):
    _inherit = 'fact.find'

    deposit_from_savings = fields.Float('Deposit Amount from Savings')
    gifted_deposit_from_friend = fields.Float('Gifted Deposit Amount from a Friend')
    gifted_deposit_from_family = fields.Float('Gifted Deposit Amount from Family')
    deposit_from_another_loan = fields.Float('Deposit Amount from Another Loan')
    deposit_from_equity_of_property = fields.Float('Deposit Amount from Equity of Another Property')
    loan_amount_from_director = fields.Float('Loan Amount from Director')
    gifted_deposit_amount_from_director = fields.Float('Gifted Deposit Amount from Director')

    total_deposit_amount = fields.Float('Total Deposit Amount', compute='_compute_total_deposit')

    gifted_family_details = fields.One2many('gifted.family', 'deposit_id', 'Gifted Family Details')

    @api.depends('deposit_from_savings', 'gifted_deposit_from_friend', 'gifted_deposit_from_family',
                 'deposit_from_another_loan', 'deposit_from_equity_of_property', 'loan_amount_from_director',
                 'gifted_deposit_amount_from_director')
    def _compute_total_deposit(self):
        for record in self:
            total_deposit = record.deposit_from_savings + record.gifted_deposit_from_friend + \
                            record.gifted_deposit_from_family + record.deposit_from_another_loan + \
                            record.deposit_from_equity_of_property + record.loan_amount_from_director + \
                            record.gifted_deposit_amount_from_director
            record.total_deposit_amount = total_deposit


class GiftedFamily(models.Model):
    _name = 'gifted.family'
    _description = 'Gifted Family Details'

    deposit_id = fields.Many2one('fact.find', 'Deposit')
    relationship = fields.Selection([
        ('mom', 'Mom'),
        ('dad', 'Dad'),
        ('son', 'Son'),
        ('daughter', 'Daughter'),
        ('niece', 'Niece'),
        ('nephew', 'Nephew'),
        ('step-father', 'Step-Father'),
        ('step-mother', 'Step-Mother'),
        ('uncle', 'Uncle'),
        ('aunty', 'Aunty'),
        ('other', 'Other')
    ], 'Relationship')
    name = fields.Char('Name')
    date_of_birth = fields.Date('Date of Birth')
    gifted_amount = fields.Float('Gifted Amount')

