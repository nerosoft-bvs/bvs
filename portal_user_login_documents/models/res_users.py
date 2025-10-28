# -*- coding: utf-8 -*-

from odoo import models, fields, api, _


class ResUsers(models.Model):
    _inherit = 'res.users'

    check_portal_user_documents = fields.Boolean('Enable Portal User Document Checking')
    portal_user_documents_approved = fields.Boolean('Portal User Documents Approved')
    is_portal_user = fields.Boolean('Is Portal User', compute='_check_is_portal_user')

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if 'check_portal_user_documents' not in vals:
                vals['check_portal_user_documents'] = True
        return super(ResUsers, self).create(vals_list)

    @api.onchange('check_portal_user_documents')
    def _onchange_portal_user_documents(self):
        """
        @private - reset the field portal_user_documents_approved
        """
        if not self.check_portal_user_documents:
            self.update({
                'portal_user_documents_approved': False
            })

    def _check_is_portal_user(self):
        """
        @private - check current user is portal or not
        """
        for rec in self:
            rec.update({
                'is_portal_user': rec.has_group('base.group_portal')
            })

    def add_or_modify_documents(self):
        """
        @public - open portal user documents tree view for configure portal user documents
        """
        return self.env['res.config.settings'].open_portal_user_documents()
