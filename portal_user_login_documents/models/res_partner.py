# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class ResUsers(models.Model):
    _inherit = 'res.partner'

    portal_user_documents_approved = fields.Boolean('Portal User Documents Approved')
