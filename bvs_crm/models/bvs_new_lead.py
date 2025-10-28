from odoo import models, fields


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    advisor_note = fields.Text(string="Advisor Note")
    referral_customer = fields.Many2one('res.partner', string='Customer')
    referral_bvs_advisor = fields.Many2one('res.users', string='Advisor')
    team_leader = fields.Many2one('res.users', string='Team Leader', domain=[('is_team_leader', '=', True)])
    event_ids = fields.Many2many()
    social_medea = fields.Selection([
        ('fb', 'Facebook'),
        ('insta', 'Instagram'),
        ('tweet', 'Twitter '),
        ('yt', 'Youtube'),
        ('wa', 'WhatsApp')
    ], string='Social Media', tracking=True)


