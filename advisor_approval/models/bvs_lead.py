from odoo import api, models, fields, _
from odoo.exceptions import UserError
from odoo.tools import formataddr, mute_logger


class BVSLead(models.Model):
    _inherit = 'bvs.lead'
    _description = "Lead"

    approval_state = fields.Selection([
        ('draft', 'Draft'),
        ('request', 'Requested Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ], string='Approval Status', default='draft', readonly=True, copy=False, track_visibility='onchange')
    advisor_id = fields.Many2one('res.users', string="Advisor")
    hold = fields.Boolean(string='Hold', default=False)
    terminate = fields.Boolean(string='Terminate', default=False)
    active = fields.Boolean(string='Active', default=True)

    def action_hold(self):
        for lead in self:
            lead.write({'hold': True, 'active': False})

            if lead.is_client_onboarding:
                lead.write({'risk_assessment_1': 'hold'})

            if lead.is_affordability_assessment:
                lead.write({'approval_status': 'hold'})

            if lead.is_dip:
                lead.write({'dip_decision_declined': 'hold'})

            if lead.is_illustration:
                lead.write({'fa_ill': 'hold'})

            if lead.is_protection:
                lead.write({'risk_assessment_decision': 'hold'})

            if lead.is_protection:
                lead.write({'advisor_approval': 'hold'})

            if lead.is_protection:
                lead.write({'approval_of_quote': 'hold'})

            if lead.is_protection_application:
                lead.write({'decline_type': 'hold'})

            if lead.is_protection_application:
                lead.write({'advisor_decision': 'hold'})

    def action_terminate(self):
        for lead in self:
            lead.write({'terminate': True, 'active': False})

            if lead.is_client_onboarding:
                lead.write({'risk_assessment_1': 'terminate'})

            if lead.is_affordability_assessment:
                lead.write({'approval_status': 'terminate'})

            if lead.is_dip:
                lead.write({'dip_decision_declined': 'terminate'})

            if lead.is_illustration:
                lead.write({'fa_ill': 'terminate'})

            if lead.is_protection:
                lead.write({'risk_assessment_decision': 'terminate'})
                lead.write({'advisor_approval': 'terminate'})
                lead.write({'approval_of_quote': 'terminate'})

            if lead.is_protection_application:
                lead.write({'decline_type': 'terminate'})

            if lead.is_protection_application:
                lead.write({'advisor_decision': 'terminate'})

    def action_approve(self):
        for lead in self:
            if lead.is_client_onboarding:
                lead.write({'risk_assessment_1': 'approve'})

            if lead.is_affordability_assessment:
                lead.write({'approval_status': 'approved'})

            if lead.is_dip:
                lead.write({'dip_decision_declined': 'approved'})

            if lead.is_illustration:
                lead.write({'fa_ill': 'approve'})

        return {'type': 'ir.actions.act_window_close'}

    def action_reject(self):
        for lead in self:

            if lead.is_client_onboarding:
                lead.write({'risk_assessment_1': 'reject'})

            if lead.is_affordability_assessment:
                lead.write({'approval_status': 'reject'})

            if lead.is_dip:
                lead.write({'dip_decision_declined': 'reject'})

            if lead.is_illustration:
                lead.write({'fa_ill': 'reject'})

            if lead.is_protection:
                lead.write({'risk_assessment_decision': 'reject'})

            if lead.is_protection:
                lead.write({'advisor_approval': 'reject'})

            if lead.is_protection:
                lead.write({'approval_of_quote': 'reject'})

            if lead.is_protection_application:
                lead.write({'decline_type': 'reject'})

            if lead.is_protection_application:
                lead.write({'advisor_decision': 'reject'})

        return {'type': 'ir.actions.act_window_close'}

    def send_approval_notification(self, partner):
        for lead in self:
            # Initialize the message body based on conditions
            decision_msg = 'A lead requires your approval'
            if lead.is_client_onboarding:
                decision_msg = 'Risk Assessment Decision Is Pending'
            elif lead.is_affordability_assessment:
                decision_msg = 'Affordability Assessment Decision is Pending'
            elif lead.is_dip:
                decision_msg = 'Pending DIP Decision'
            elif lead.is_illustration:
                decision_msg = 'Illustration Decision is Pending'
            elif lead.is_protection:
                decision_msg = 'Protection Quote Decision is Pending'
            elif lead.is_protection_application:
                decision_msg = 'Advisor Decision is Pending'
            else:
                decision_msg = 'A lead requires your approval'

            # Post the message with the formatted body
            lead.message_post(
                body=f'\n{decision_msg}',
                message_type='notification',
                subtype_id=self.env['ir.model.data']._xmlid_to_res_id('mail.mt_comment'),
                author_id=self.env.user.partner_id.id,
                notification_ids=[(0, 0, {'res_partner_id': partner.id, 'notification_type': 'inbox'})]
            )

    def send_approval_notification_affordability(self):
        for lead in self:

            # Get base URL from Odoo environment
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')

            # Construct URL to view the lead (more concise)
            lead_url = f"{base_url}/web?#model=bvs.lead&id={lead.id}&view_type=form"

            # Create notification message
            self.env['mail.message'].sudo().create({
                'subject': 'Lead Approval Required - {lead.registration_no}',  # Use lead name in subject
                'body': '<f>A lead requires your approval. Please click the link below to view and take action: {lead_url}</p>'.format(
                    lead_url=lead_url),  # Use f-string for formatting
                'author_id': self.env.user.partner_id.id,
                'email_from': self.env.user.partner_id.email,
                'model': lead._name,
                'res_id': lead.id,
                'subtype_id': self.env['ir.model.data']._xmlid_to_res_id('mail.mt_comment'),
                'notification_ids': [(0, 0, {'res_partner_id': lead.advisor_id.partner_id.id})],
                # Simplified notification creation
            })

    def send_approval_notification_dip(self):

        for lead in self:

            # Get base URL from Odoo environment
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')

            # Construct URL to view the lead (more concise)
            lead_url = f"{base_url}/web?#model=bvs.lead&id={lead.id}&view_type=form"

            # Create notification message
            self.env['mail.message'].sudo().create({
                'subject': 'Lead Approval Required - {lead.case_number}',
                'body': '<f>A lead requires your approval. Please click the link below to view and take action: {lead_url}</p>'.format(
                    lead_url=lead_url),  # Use f-string for formatting
                'author_id': self.env.user.partner_id.id,
                'email_from': self.env.user.partner_id.email,
                'model': lead._name,
                'res_id': lead.id,
                'subtype_id': self.env['ir.model.data']._xmlid_to_res_id('mail.mt_comment'),
                'notification_ids': [(0, 0, {'res_partner_id': lead.advisor_id.partner_id.id})],
                # Simplified notification creation
            })

    def send_approval_notification_illustration(self):

        for lead in self:

            # Get base URL from Odoo environment
            base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')

            # Construct URL to view the lead (more concise)
            lead_url = f"{base_url}/web?#model=bvs.lead&id={lead.id}&view_type=form"

            # Create notification message
            self.env['mail.message'].sudo().create({
                'subject': f'Lead Approval Required - {lead.case_number}',
                'body': '''
                    <p>A lead requires your approval.</p>
                    <p>Approval Decision: {decision}</p>
                    <p>Status: Pending</p>
                    <p>Please click the link below to view and take action:</p>
                    <p><a href="{lead_url}">{lead_url}</a></p>
                '''.format(
                    decision=dict(self._fields['approval_decision'].selection).get(self.approval_decision, 'N/A'),
                    lead_url=lead_url
                ),  # Format the email body with decision and URL
                'author_id': self.env.user.partner_id.id,
                'email_from': self.env.user.partner_id.email,
                'model': lead._name,
                'res_id': lead.id,
                'subtype_id': self.env['ir.model.data']._xmlid_to_res_id('mail.mt_comment'),
                'notification_ids': [(0, 0, {'res_partner_id': lead.advisor_id.partner_id.id})],
                # Notification creation
            })


