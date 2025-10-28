from odoo import http, tools, _, SUPERUSER_ID
from odoo.exceptions import AccessDenied, AccessError, MissingError, UserError, ValidationError
from odoo.http import content_disposition, Controller, request, route
from odoo.addons.portal.controllers import portal
from odoo.tools import consteq
from odoo import http


class ClientPortal(portal.CustomerPortal):

    def _prepare_portal_layout_values(self):
        values = super()._prepare_portal_layout_values()
        partner = http.request.env.user.partner_id
        dc_leads = partner.lead_ids.filtered(lambda l: l.data_capture_form)
        values.update({
            'dc_leads': dc_leads,
        })
        return values
