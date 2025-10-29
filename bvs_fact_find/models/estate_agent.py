from odoo import api, models, fields, _


class FactFindEstateAgent(models.Model):
    _inherit = 'fact.find'

    firm_name = fields.Char('Firm Name')
    firm_email = fields.Char('Email')
    contactable_person = fields.Char('Contactable Person')
    contactable_person_mobile = fields.Char('Contact Number')
    firm_address = fields.Char('Address')
   