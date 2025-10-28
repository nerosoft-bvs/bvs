from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime


AVAILABLE_PRIORITIES = [
    ('0', 'None'),
    ('1', 'Low'),
    ('2', 'Medium'),
    ('3', 'High'),
]


class BvsStage(models.Model):
    _name = "bvs.stage"
    _description = "Stage"
    _order = 'sequence'

    name = fields.Char('Stage Name', required=True, translate=True)
    sequence = fields.Integer('Sequence', default=1, help="Used to order stages. Lower is better.")
    is_won = fields.Boolean('Is Won Stage?')
    is_new = fields.Boolean('Is New Lead?')
    is_affordability_assessment = fields.Boolean('Is Affordability Assessment?')
    is_client_onboarding = fields.Boolean('Is Client Onboarding?')
    is_dip = fields.Boolean('Is DIP?')
    is_illustration = fields.Boolean('Is Illustration?')
    affordability_kyc = fields.Boolean('Affordability KYC')
    dip_kyc = fields.Boolean('DIP KYC')
    illustration_kyc = fields.Boolean('Illustration KYC')
    read_only_kyc = fields.Boolean('Read Only Fact Find')
    is_pre_offer = fields.Boolean('Is Pre Offer?')
    is_post_offer = fields.Boolean('Is Post Offer?')
    is_completion = fields.Boolean('Is Completion?')
    is_protection_new = fields.Boolean('Is Protection New?')
    is_protection = fields.Boolean('Is Protection Quote?')
    is_protection_application = fields.Boolean('Is Protection Application?')
    is_protection_completion = fields.Boolean('Is Protection Completion')
    add_esis_record = fields.Boolean('Add Esis record Button Visible')
    add_prot_quote_record = fields.Boolean('Add Protection Quote  record Button Visible')
    stage_visibility = fields.Selection([
        ('mortgage', 'Mortgage'),
        ('protection', 'Protection')],
        default='mortgage', string='Visibility')
    team_id = fields.Many2one('bvs.team', string='Sales Team', ondelete="set null",
                             help='Specific team that uses this stage. Other teams will not be able to see or use this stage.')
    fold = fields.Boolean('Folded in Pipeline',
                          help='This stage is folded in the kanban view when there are no records in that stage to display.')