# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    check_portal_user_documents = fields.Boolean(
        'Check Portal User Documents',
        related='company_id.check_portal_user_documents',
        readonly=False
    )
    portal_user_documents_description = fields.Text(
        'Description',
        related='company_id.portal_user_documents_description',
        readonly=False
    )

    def open_portal_user_documents(self):
        """
        @public - portal available portal user documents
        """
        return {
            'name': _('Portal User Documents'),
            'view_mode': 'tree,form',
            'res_model': 'portal.user.documents',
            'type': 'ir.actions.act_window',
            'domain': [],
        }
