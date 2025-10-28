from odoo import api, models, fields, _


class EstateAgent(models.Model):
    _name = 'estate.agent'
    _description = "Estate Agent"

    name = fields.Char('Firm Name')
    email = fields.Char('Email')
    contactable_person = fields.Char('Contactable Person')
    mobile = fields.Char('Contact Number')
    lead_id = fields.Many2one('bvs.lead', string="Lead")