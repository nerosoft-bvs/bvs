# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class ResCompany(models.Model):
    _inherit = 'res.company'

    check_portal_user_documents = fields.Boolean('Check Portal User Documents')
    portal_user_documents_description = fields.Text('Description')
