from odoo import api, models, fields, _



class BVSDocuments(models.Model):
    _name = 'bvs.document'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = "Document"
    _rec_name = "document_list_id"

    lead_id = fields.Many2one('bvs.lead', string="Lead")
    document_list_id = fields.Many2one('bvs.document.list', string="Document Type")
    partner_id = fields.Many2one('res.partner', string="Customer", related='lead_id.partner_id', store=True)
    fact_find_id = fields.Many2one('fact.find', string='Fact Find')
    attachment_ids = fields.Many2many('ir.attachment', string='Attachment')
    state = fields.Selection([
        ('requested', 'Requested'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
    ], string='Status', default='requested', readonly=True, copy=False, track_visibility='onchange')

    def send_further_document_email(self):
        for document in self:
            lead = document.lead_id
            advisor = lead.mortgage_advisor
            if advisor and advisor.email:
                subject = "Further Document Uploaded"
                body = (
                    f"Dear {advisor.name},<br/><br/>"
                    f"The customer <strong>{document.partner_id.name}</strong> has uploaded a further document.<br/>"
                    f"<strong>Document:</strong> {document.document_list_id.display_name or 'Unknown'}<br/>"
                    f"<strong>Lead:</strong> {lead.display_name}<br/><br/>"
                    f"Please log into the system to review the uploaded file.<br/><br/>"
                    f"Best regards,<br/>{self.env.user.name}"
                )
                self.env['mail.mail'].create({
                    'email_from': self.env.user.email or 'noreply@example.com',
                    'email_to': advisor.email,
                    'subject': subject,
                    'body_html': body,
                }).send()






