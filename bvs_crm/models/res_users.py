from odoo import api, models, fields, _


class ResPartner(models.Model):
    _inherit = 'res.users'

    short_code = fields.Char(string="Short Code")
    is_mortgage_advisor = fields.Boolean(string='Mortgage Advisor', default=False)
    is_team_leader = fields.Boolean(string='Team Leader', default=False)
    bvs_lead_ids = fields.Many2one('bvs.lead',string='BVS Leads')