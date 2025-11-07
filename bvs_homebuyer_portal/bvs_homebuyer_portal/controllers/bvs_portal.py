# -*- coding: utf-8 -*-
from odoo import fields, http, SUPERUSER_ID
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager
from odoo.http import request, route


class PortalBvsHomebuyer(CustomerPortal):

    def _prepare_bvs_portal_layout_values(self):
        """
        @private - prepare the values needed for the bvs portal
        """
        values = super()._prepare_portal_layout_values()
        partner = request.env.user.partner_id
        leads = partner.lead_ids + partner.reference_lead_ids
        fact_find = request.env["fact.find"].with_user(SUPERUSER_ID).search([("partner_id", "=", partner.id)], limit=1)
        portal_user_document_ids = request.env['portal.user.documents'].sudo().search([('check_in_portal', '=', True)])
        values.update({
            'fact_find': fact_find,
            'leads_count': len(leads),
            'leads': leads,
            'initial_documents': portal_user_document_ids.mapped('attachment_ids'),
            'countries': request.env['res.country'].with_user(SUPERUSER_ID).search([]) or False,
            'customer_type': fact_find.lead_id.customer_type,
            'lead_state': fact_find.lead_id.stage_id,

        })

        return values

    @route(['/my', '/my/home', '/my/bvs/home'], type='http', auth="user", website=True)
    def bvs_home(self, **kw):
        """
        @private - render the home page for bvs
        """
        values = self._prepare_bvs_portal_layout_values()
        return request.render("bvs_homebuyer_portal.bvs_portal_main_page", values)
