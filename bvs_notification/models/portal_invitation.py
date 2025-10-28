from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import email_normalize
import logging

_logger = logging.getLogger(__name__)

from decorator import append


class CrmLead(models.Model):
    _inherit = 'bvs.lead'

    portal_invitation_sent = fields.Boolean("Portal Invitation Sent")

    # def _create_portal_user(self, partner):
    #     if not partner or not partner.email:
    #         return
    #
    #     if not partner.user_ids:
    #         portal_group = self.env.ref('base.group_portal')
    #         user_vals = {
    #             'name': partner.name,
    #             'login': partner.email,
    #             'partner_id': partner.id,
    #             'email': partner.email,
    #             'groups_id': [(6, 0, [portal_group.id])],
    #             'check_portal_user_documents': True,
    #         }
    #         self.env['res.users'].sudo().create(user_vals)
    #
    # def action_send_portal_invitation(self):
    #     self.ensure_one()
    #
    #     if not self.partner_id:
    #         raise UserError("No customer (partner) linked to this lead.")
    #
    #     # Invite main partner
    #     self._create_portal_user(self.partner_id)
    #
    #     # Invite each applicant
    #     for applicant_form in self.applicant_ids:
    #         self._create_portal_user(applicant_form.partner_id)
    #
    #     # Mark invitation sent
    #     self.write({'portal_invitation_sent': True})
    #     return True
    #
    # def action_resend_portal_invitation(self):
    #     """
    #     Re-send the portal-invitation e-mail to every portal user that was
    #     already created for this lead (main partner + all applicants).
    #     """
    #
    #     self.ensure_one()
    #     eligible_ids = self.applicant_ids.ids + [self.partner_id.id] if self.partner_id else self.applicant_ids.ids
    #     return {
    #         "type": "ir.actions.act_window",
    #         "res_model": "portal.invitation.wizard",
    #         "view_mode": "form",
    #         "target": "new",
    #         "name": "Choose Applicants for Portal Invitation / Reset Password",
    #         "context": {
    #             "default_partner_ids": [(6, 0, self.applicant_ids.ids)],
    #             "applicant_ids": eligible_ids,
    #         },
    #     }

    def _create_portal_user(self, partner):
        """Create a portal user for the given partner if they don't already have any user."""
        if not partner or not partner.email:
            return

        # Check if a user already exists for this partner (any type)
        existing_user = self.env['res.users'].sudo().search([('partner_id', '=', partner.id)], limit=1)
        if existing_user:
            _logger.info("Skipping user creation — existing user %s (%s) found for partner %s",
                         existing_user.name, existing_user.login, partner.name)
            return  # Skip creating a new one

        # Create new portal user
        portal_group = self.env.ref('base.group_portal')
        user_vals = {
            'name': partner.name,
            'login': partner.email,
            'partner_id': partner.id,
            'email': partner.email,
            'groups_id': [(6, 0, [portal_group.id])],
            'check_portal_user_documents': True,
        }
        new_user = self.env['res.users'].sudo().create(user_vals)
        _logger.info("Created new portal user %s (%s) for partner %s",
                     new_user.name, new_user.login, partner.name)

    def action_send_portal_invitation(self):
        """Invite the main partner and each applicant to the portal (only if not already users)."""
        self.ensure_one()

        if not self.partner_id:
            raise UserError("No customer (partner) linked to this lead.")

        # Invite main partner
        self._create_portal_user(self.partner_id)

        # Invite each applicant
        for applicant_form in self.applicant_ids:
            self._create_portal_user(applicant_form)

        # Mark invitation sent
        self.write({'portal_invitation_sent': True})
        return True

    def action_resend_portal_invitation(self):
        """Re-send the portal invitation to already created portal users."""
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
