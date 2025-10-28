from odoo import models, fields, api


class FactFindOtherIncome(models.Model):
    _inherit = 'fact.find'

    income_type = fields.Selection([
        ('child_benefit', 'Child Benefit'),
        ('child_tax_credit', 'Child Tax Credit'),
        ('working_tax_credit', 'Working Tax Credit'),
        ('maintenance_fee', 'Maintenance Fee'),
        ('state_disability_benefit', 'Personal Independence Payment'),
    ], string='Income Type')

    monthly_income = fields.Float('Monthly Income')
    annual_income = fields.Float('Annual Income', compute='_compute_annual_income', store=True)

    @api.depends('monthly_income')
    def _compute_annual_income(self):
        for record in self:
            record.annual_income = record.monthly_income * 12
