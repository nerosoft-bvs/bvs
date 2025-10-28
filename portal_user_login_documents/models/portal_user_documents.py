# -*- coding: utf-8 -*-

from odoo import models, fields, api, _, SUPERUSER_ID
from odoo.exceptions import ValidationError


class PortalUserDocuments(models.Model):
    _name = 'portal.user.documents'
    _inherit = [
        'mail.thread',
        'mail.activity.mixin',
    ]
    _description = 'Portal User Documents'
    attachment_ids = fields.Many2many('ir.attachment', 'portal_user_document_attachment_rel', 'portal_user_document_id',
                                      'attachment_id', 'Attachments', required=True,
                                      help="Attachment to be checked when portal user logged in")
    check_in_portal = fields.Boolean('Check In Portal', help='Activating this field will verify whether the current '
                                                             'attachment has been read and approved when a portal user '
                                                             'logs in.')
    name = fields.Char('Name', default=_('Document'))
    customer_type = fields.Selection(
        selection=[
            ('all', 'All'),
            ('ftb', 'FTB (First Time Buyer)'),
            ('hm', 'HM (Home Mover)'),
            ('btl', 'BTL (Buy to Let)'),
            ('rrm', 'RRM (Residential Mortgage)'),
            ('btl_purchase', 'BTL Purchase'),
            ('btl_remortgage', 'BTL Remortgage'),
            ('com_btl_purchase', 'Com BTL Purchase'),
            ('com_btl_remortgage', 'Com BTL Remortgage'),
            ('protection', 'Protection')
        ],
        string='Client Type',
        help="This feature lets you choose whether to display this document for a specific client type.",
        default='all',
        required=True,
        tracking=True
    )
    advisor_fee = fields.Boolean(
        string='Advisor Fee Document',
        help='Enabling this will display only documents related to advisor fee enabled leads for the logged-in partner.'
    )

    @api.model_create_multi
    def create(self, vals_list):
        """
        @override - update the attachments as public
        """
        res = super(PortalUserDocuments, self).create(vals_list)
        for rec in res:
            rec.attachment_ids.update({
                'public': True
            })
        return res

    def write(self, data):
        """
        @override - update the attachments as public
        """
        res = super(PortalUserDocuments, self).write(data)
        for rec in self:
            rec.attachment_ids.update({
                'public': True
            })
        return res

    @api.constrains('check_in_portal', 'attachment_ids')
    def _constrain_check_in_portal(self):
        """
        @private - Add validation if no attachments selected and check in portal option enabled
        """
        if len(self.attachment_ids) > 1:
            raise ValidationError(_('You can only add 1 attachment per record!'))
        if self.check_in_portal:
            if not bool(self.attachment_ids):
                raise ValidationError(_('Activation of the current document check in the portal is not possible due '
                                        'to the absence of a selected attachment.'))
