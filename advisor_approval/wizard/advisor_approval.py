from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError


class BVSAdvisorApprovalWizard(models.TransientModel):
    _name = 'bvs.advisor.approval.wizard'
    _inherit = ['mail.thread']

    user_id = fields.Many2one('res.users', string="Advisor")
    advisor_note = fields.Char(string="Note")
    approval_decision = fields.Selection([
        ('risk_assessment', 'Risk Assessment Decision'),
        ('affordability_assessment', 'Affordability Assessment Decision'),
        ('pending_dip', 'Pending DIP'),
        ('illustration_decision', 'Illustration Decision'),
        ('criteria_decision', 'Criteria Decision'),
        ('protection_quote_decision', 'Protection Quote Decision'),
        ('hi_quotes_decision', 'HI Quotes Decision'),
        ('decline_decision', 'Decline Decision'),
        ('advisor_decision', 'Advisor Decision')
    ], string='Approval Decision')

    @api.model
    def default_get(self, fields_list):
        res = super(BVSAdvisorApprovalWizard, self).default_get(fields_list)
        lead = self.env['bvs.lead'].browse(self._context.get('active_id'))

        if lead.is_client_onboarding:
            res['approval_decision'] = 'risk_assessment'
        elif lead.is_affordability_assessment:
            res['approval_decision'] = 'affordability_assessment'
        elif lead.is_dip:
            res['approval_decision'] = 'pending_dip'
        elif lead.is_illustration:
            res['approval_decision'] = 'illustration_decision'
        elif lead.is_protection:
            res['approval_decision'] = 'criteria_decision'
        elif lead.is_protection:
            res['approval_decision'] = 'protection_quote_decision'
        elif lead.is_protection:
            res['approval_decision'] = 'hi_quotes_decision'
        elif lead.is_protection_application:
            res['approval_decision'] = 'decline_decision'
        else:
            res['approval_decision'] = 'advisor_decision'

        return res

    def action_request_approve(self):
        lead_id = self.env.context.get('active_id')
        lead = self.env['bvs.lead'].browse(lead_id)
        if lead:
            lead.write({
                'advisor_id': self.user_id.id,
                'advisor_note': self.advisor_note})

            lead.send_approval_notification(self.user_id.partner_id)

            if lead.is_client_onboarding:
                lead.write({'risk_assessment_1': 'requested'})

            if lead.is_affordability_assessment:
                lead.write({'approval_status': 'requested'})

            if lead.is_dip:
                lead.write({'dip_decision_declined': 'requested'})

            if lead.is_illustration:
                lead.write({'fa_ill': 'requested'})

            if lead.is_protection:
                lead.write({'risk_assessment_decision': 'requested'})

            if lead.is_protection:
                lead.write({'advisor_approval': 'requested'})

            if lead.is_protection:
                lead.write({'approval_of_quote': 'requested'})

            if lead.is_protection_application:
                lead.write({'decline_type': 'requested'})

            if lead.is_protection_application:
                lead.write({'advisor_decision': 'requested'})

        return {'type': 'ir.actions.act_window_close'}


