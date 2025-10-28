from odoo import api, models, fields, _


class PortalUser(models.Model):

    _inherit = 'portal.user.documents'

    data_capture_form = fields.Boolean(string="Is Data Capture Form")




