import logging
from odoo import fields, http, SUPERUSER_ID, _
from odoo.http import request
import base64

_logger = logging.getLogger(__name__)


class FurtherDocumentForm(http.Controller):

    @http.route(['/partner/<int:partner_id>/documents'], type='http', auth='user', website=True)
    def further_document_request(self, partner_id=None, **kwargs):
        document_submissions = request.env['bvs.document'].with_user(SUPERUSER_ID).search([
            ('state', '=', 'requested'), ('partner_id', '=', partner_id)])

        if document_submissions:
            values = {
                'page_name': 'further_document_request',
                'document_submissions': document_submissions,
            }
            return request.render("bvs_document.further_document_request", values)

        return request.redirect('/my')

    @http.route(['/document_id/form/submit'], type='http', methods=['POST'], auth="user", website=True)
    def fact_find_form_submit(self, **kw):
        values = request.params.copy()
        document_id = request.env['bvs.document'].sudo().browse(int(values.get('document_id')))

        if document_id.exists():
            if request.env.user.partner_id == document_id.lead_id.partner_id or request.env.user.partner_id == document_id.partner_id:

                document_requests = request.httprequest.files.getlist('attachment_ids')
                for document_request in document_requests:
                    attachment_values = {
                        'name': document_request.filename,
                        'datas': base64.b64encode(document_request.read()),
                        'res_model': 'bvs.document',
                        'res_id': document_id.id,
                        'public': False,
                    }
                attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                document_id.sudo().write({
                    'attachment_ids': [(4, attachment.id)],
                    'state': 'submitted'
                })

                return request.redirect('/partner/%s/documents' % document_id.partner_id.id)

    @http.route('/further_document/form/done', type='http', auth='user', website=True)
    def application_form_submit(self, **kwargs):
        return request.render("bvs_portal.application_form_submit_success")
