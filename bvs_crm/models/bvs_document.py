from odoo import api, models, fields, _


class BVSDocuments(models.Model):
    _name = 'bvs.document'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = "Document"

    name = fields.Char(string="Name")
    attachment_ids = fields.Many2many('ir.attachment', string='Attachment')
    is_public = fields.Boolean(string='Is Public Document')

    @api.onchange('is_public')
    def _onchange_is_public(self):
        for attachment in self.attachment_ids:
            attachment.write({'public': self.is_public})



