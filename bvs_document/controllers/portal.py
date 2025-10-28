from odoo import http, tools, _, SUPERUSER_ID
from odoo.exceptions import AccessDenied, AccessError, MissingError, UserError, ValidationError
from odoo.http import content_disposition, Controller, request, route
from odoo.addons.portal.controllers import portal
from odoo.tools import consteq


class ClientPortal(portal.CustomerPortal):

    def _prepare_portal_layout_values(self):
        values = super()._prepare_portal_layout_values()
        partners = request.env.user.partner_id.ids + request.env.user.partner_id.lead_ids.mapped('applicant_ids.id')
        partner_ids = request.env['bvs.document'].with_user(SUPERUSER_ID).search([
            ('state', '=', 'requested'), ('partner_id', 'in', partners)]).mapped('partner_id')

        values.update({
            'ff_partner_ids': partner_ids,
        })
        return values

    @route(['/my', '/my/home'], type='http', auth="user", website=True)
    def home(self, **kw):
        values = self._prepare_portal_layout_values()
        return request.render("bvs_portal.portal_my_account", values)
