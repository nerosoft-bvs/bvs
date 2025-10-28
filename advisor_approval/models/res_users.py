from odoo import models, fields


class BvsLead(models.Model):
    _inherit = 'bvs.lead'

    # document_ids = fields.One2many('bvs.document', 'lead_id', string='Document Items')


