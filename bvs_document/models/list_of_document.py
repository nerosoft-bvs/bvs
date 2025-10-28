from odoo import models, fields


class DocumentRequirements(models.Model):
    _name = 'bvs.document.list'
    _description = 'Document Requirements'
    _rec_name = 'document_name'

    index_num = fields.Integer('Index')
    document_name = fields.Char('Document Name')

