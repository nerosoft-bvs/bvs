from odoo import models, fields, _
from odoo.exceptions import ValidationError, UserError


class BvsLead(models.Model):
    _inherit = 'bvs.lead'

    document_ids = fields.One2many('bvs.document', 'lead_id', string='Document Items')

    def action_send_missing_document_emails(self):
        Mail = self.env['mail.mail']

        for lead in self:
            for document in lead.document_ids:
                if document.document_list_id and not document.attachment_ids and document.partner_id.email:
                    subject = "Document Upload Request"
                    body = (
                        f"Dear {document.partner_id.name},<br/><br/>"
                        f"Please upload the requested document: <strong>{document.document_list_id.document_name}</strong>.<br/>"
                        f"Let us know if you need any assistance.<br/><br/>"
                        f"Best regards,<br/>{self.env.user.name}"
                    )
                    email_values = {
                        'email_from': self.env.user.email or 'noreply@example.com',
                        'email_to': document.partner_id.email,
                        'subject': subject,
                        'body_html': body,
                    }
                    Mail.create(email_values).send()



