from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import email_normalize

from decorator import append


class CrmLead(models.Model):
    _inherit = 'bvs.lead'

    portal_invitation_sent = fields.Boolean("Portal Invitation Sent")

    def _create_portal_user(self, partner):
        if not partner or not partner.email:
            return

        if not partner.user_ids:
            portal_group = self.env.ref('base.group_portal')
            user_vals = {
                'name': partner.name,
                'login': partner.email,
                'partner_id': partner.id,
                'email': partner.email,
                'groups_id': [(6, 0, [portal_group.id])],
                'check_portal_user_documents': True,
            }
            self.env['res.users'].sudo().create(user_vals)

    def action_send_portal_invitation(self):
        self.ensure_one()

        if not self.partner_id:
            raise UserError("No customer (partner) linked to this lead.")

        # Invite main partner
        self._create_portal_user(self.partner_id)

        # Invite each applicant
        for applicant_form in self.applicant_ids:
            self._create_portal_user(applicant_form.partner_id)

        # Mark invitation sent
        self.write({'portal_invitation_sent': True})
        return True

    def action_resend_portal_invitation(self):
        """
        Re-send the portal-invitation e-mail to every portal user that was
        already created for this lead (main partner + all applicants).
        """

        self.ensure_one()
        eligible_ids = self.applicant_ids.ids + [self.partner_id.id] if self.partner_id else self.applicant_ids.ids
        return {
            "type": "ir.actions.act_window",
            "res_model": "portal.invitation.wizard",
            "view_mode": "form",
            "target": "new",
            "name": "Choose Applicants for Portal Invitation / Reset Password",
            "context": {
                "default_partner_ids": [(6, 0, self.applicant_ids.ids)],
                "applicant_ids": eligible_ids,
            },
        }

