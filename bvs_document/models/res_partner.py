from odoo import api, models, fields, _


class ResPartner(models.Model):
    _inherit = 'res.partner'

    free_arrangement_submission = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Fee Agreement')

    insurance_proposition_submission = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Insurance Proposition Summary')

    joint_client_data_submission = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Joint Client Data Protection')

    mortgage_provider_submission = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Mortgage Provider List')

    our_morgages_and_protections_submission = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Our Mortgage & Protection Brochure')

    support_for_when = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Support For When You Need Support Most')

    fee_agreement_date = fields.Datetime(string='Fee Agreement Date')
    insurance_proposition_summary_date = fields.Datetime(string='Insurance Proposition Summary Date')
    joint_client_data_protection_date = fields.Datetime(string='Joint Client Data Protection Date')
    mortgage_provider_list_date = fields.Datetime(string='Mortgage Provider List Date')
    our_mortgage_protection_brochure_date = fields.Datetime(string='Our Mortgage & Protection Brochure Date')
    support_for_when_date = fields.Datetime(string='Support For When You Need Support Most Date')


