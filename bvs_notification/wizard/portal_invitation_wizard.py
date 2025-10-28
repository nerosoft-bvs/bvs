from odoo import models, fields, api

class PortalInvitationWizard(models.TransientModel):
    _name = "portal.invitation.wizard"
    _description = "Choose Applicants for Portal Invitation / Reset Password"

    partner_ids = fields.Many2many(
        "res.partner",
        string="Applicants",
        domain=lambda self: [("id", "in", self.env.context.get("applicant_ids", []))],
    )

    def action_process(self):
        for partner in self.partner_ids:
            user = partner.user_ids[:1]
            if user:
                user.action_reset_password()
            else:
                self._create_portal_user(partner)
        return {"type": "ir.actions.act_window_close"}
