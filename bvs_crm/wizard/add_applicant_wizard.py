from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError
import re


class BVSAddApplicantWizard(models.TransientModel):
    _name = 'bvs.add.applicant.wizard'
    _rec_name = 'partner_id'

    partner_id = fields.Many2one('res.partner', string="Applicant")
    first_name = fields.Char('First Name', related='partner_id.first_name', readonly=False)
    last_name = fields.Char('Last Name', related='partner_id.last_name', readonly=False)
    email = fields.Char(string="Email", related='partner_id.email', readonly=False)
    mobile = fields.Char(string="Contact Number", related='partner_id.mobile', readonly=False)

    @api.depends('name')
    def _compute_first_last_name(self):
        for record in self:
            record.first_name = False
            record.last_name = False
            if record.name and record.name.exists():
                if not record.partner_id.is_company:
                    full_name = record.partner_id.name.strip()
                    name_parts = full_name.split(' ', 1)

                    record.first_name = name_parts[0] if len(name_parts) >= 1 else ''
                    record.last_name = name_parts[-1] if len(name_parts) == 2 else ''

    def action_add_applicant(self):
        lead_id = self.env['bvs.lead'].browse(self.env.context.get('active_id'))
        if lead_id.exists() and len(lead_id.applicant_ids) < 4:
            lead_id.write({
                'applicant_ids': [(4, self.partner_id.id)]
            })
            self.env['bvs.applicants.form'].create({
                'lead_id': lead_id.id,
                'partner_id': self.partner_id.id,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'email': self.email,
                'contact_number': self.mobile,
            })

            lead_id.action_send_portal_invitation()
            lead_id.action_create_fact_find()
        else:

            raise UserError("Cannot add more than 4 applicants")

    @api.constrains('mobile')
    def _check_contact_number(self):
        for rec in self:
            if rec.mobile:
                # Example: only digits, 10 characters long
                if not re.match(r'^\d{11}$', rec.mobile):
                    raise ValidationError(
                        "Contact Number must be exactly 11 digits and cannot contain letters or special characters.")

    @api.onchange('mobile')
    def _onchange_contact_number(self):
        """Show a warning while editing if invalid."""
        if self.mobile and not re.match(r'^\d{11}$', self.mobile):
            return {
                'warning': {
                    'title': "Invalid Contact Number",
                    'message': "Contact Number must contain exactly 11 digits and cannot contain letters or special characters."
                }
            }

    @api.onchange('email')
    def _onchange_email(self):
        if self.email and not re.match(r'^[^@]+@[^@]+\.[^@]+$', self.email):
            return {
                'warning': {
                    'title': "Invalid Email",
                    'message': "Please enter a valid email address (e.g. user@example.com)."
                }
            }

    @api.constrains('email')
    def _check_email(self):
        for rec in self:
            if rec.email and not re.match(r'^[^@]+@[^@]+\.[^@]+$', rec.email):
                raise ValidationError("Invalid email address format.")


