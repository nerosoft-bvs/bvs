from odoo import api, models, fields, _


class Solicitor(models.Model):
    _name = 'bvs.solicitor'
    _description = "Solicitor"

    name = fields.Char('Firm Name')
    firm_name = fields.Char('Firm Name')
    email = fields.Char('Email')
    contactable_person = fields.Char('Contactable Person')
    mobile = fields.Char('Contact Number')
    lead_id = fields.Many2one('bvs.lead', string="Lead")