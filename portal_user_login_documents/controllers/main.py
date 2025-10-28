# -*- coding: utf-8 -*-
from datetime import datetime
import logging


from werkzeug.urls import url_join

from odoo import http, _, SUPERUSER_ID
from odoo.http import Controller, route, request

_logger = logging.getLogger(__name__)


class PortalUserLoginDocuments(Controller):

    @http.route('/get/user/documents', type='json', auth='public')
    def get_user_documents(self, **kw):
        """
        @public - get check user documents and return user documents values
        """
        base_url = request.env['ir.config_parameter'].with_user(SUPERUSER_ID).get_param('web.base.url')
        partner_id = request.env.user.partner_id
        lead_ids = request.env['bvs.lead'].search([
            ('partner_id', '=', partner_id.id)
        ])
        show_advisor_fee_documents = any(lead_ids.mapped('advisor_fee'))
        customer_types = lead_ids.mapped('customer_type') + ['all']
        document_obj = request.env['portal.user.documents'].with_user(SUPERUSER_ID)
        documents = document_obj.search([
            ('check_in_portal', '=', True),
            ('customer_type', 'in', customer_types),
            ('advisor_fee', '=', False)
        ])
        # FIXME: Does customer type filtration needed?
        if show_advisor_fee_documents:
            advisor_fee_documents = document_obj.search([
                ('check_in_portal', '=', True),
                ('customer_type', 'in', customer_types),
                ('advisor_fee', '=', True)
            ])
            documents += advisor_fee_documents
        return {
            'documents': {
                x.id: [x.name, url_join(base_url, f'/web/content/{x.attachment_ids.id}')]
                for x in
                documents
            },
            'description': request.env.company.portal_user_documents_description,
        }

    @http.route('/get/portal/document/status', type='json', auth='public')
    def get_portal_user_document_status(self, **kw):
        """
        @public - get portal user document enabled, disabled or approved
        """
        user = request.env.user.with_user(SUPERUSER_ID)
        if request.env.company.check_portal_user_documents and user.has_group('base.group_portal') and user.check_portal_user_documents and not user.portal_user_documents_approved:
            enabled_portal_user_documents = request.env['portal.user.documents'].with_user(SUPERUSER_ID).search([('check_in_portal', '=', True)])
            return bool(enabled_portal_user_documents)
        return False

    @http.route('/update/portal/document/status', type='json', auth='public')
    def update_portal_user_document_status(self, **kw):
        """
        @public - mark the user as documents read and approved
        """
        user = request.env.user.with_user(SUPERUSER_ID)
        user.update({
            'portal_user_documents_approved': True,
            'fee_agreement_date': datetime.now(),
            'insurance_proposition_summary_date': datetime.now(),
            'joint_client_data_protection_date': datetime.now(),
            'mortgage_provider_list_date': datetime.now(),
            'our_mortgage_protection_brochure_date': datetime.now(),
            'support_for_when_date': datetime.now(),
        })
        redirect_url = '/my/bvs/home'
        return redirect_url
