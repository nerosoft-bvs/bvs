from odoo import models, fields


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    case_allocation_nltl = fields.Many2one('res.users', string='Team Member')
    check_on_accuracy_on_initial_docs = fields.Selection([
        ('correct', 'Complete'),
        ('incorrect', 'Incomplete'),
    ], string="Documents Accuracy")
    user_id = fields.Many2one('res.users', string='User')
    risk_assessment_1 = fields.Selection([
        ('requested', 'Requested'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('terminate', 'Terminate '),
    ], string="Risk Assessment Decision")
    risk_assessment_note = fields.Char(string='Note')
    affordability_assessment_checklist = fields.Boolean(string="Affordability Assessment Checklist")
    affordability_note = fields.Text(string="Note")
    team_member_note = fields.Text(string="Note")
    affordability_acknowledgement = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree'),
    ], string='Affordability Assessment Acknowledgement')
    client_acknowledgment = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree')
    ], string='Client Acknowledgment of Affordability Assessment')