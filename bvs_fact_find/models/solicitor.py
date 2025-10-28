from odoo import models, fields


class FirmDetails(models.Model):
    _inherit = 'fact.find'

    solicitor_id = fields.Many2one('bvs.solicitor', string="Solicitor")
    name = fields.Char('Firm Name')
    house_number_solicitor =  fields.Float('House Number')
    post_code_solicitor = fields.Integer('Post Code')
    firm_name = fields.Char('Firm Name')
    email = fields.Char('Email')
    contactable_person = fields.Char('Contactable Person')
    mobile = fields.Char('Contact Number')

# New Fileds are below those are the working ones
    solicitor_firm_name = fields.Char('Firm Name')
    solicitor_house_number = fields.Char('House Number')
    solicitor_post_code = fields.Char('Post Code')
    solicitor_email = fields.Char('Email')
    solicitor_contact_person = fields.Char('Solicitor Name')
    solicitor_contact_number = fields.Char('Contact Number')
    solicitor_address = fields.Char('Solicitor address')

