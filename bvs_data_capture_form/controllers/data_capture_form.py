import logging
from odoo import fields, http, SUPERUSER_ID, _
from odoo.http import request
import base64

_logger = logging.getLogger(__name__)


class ClientPortal(http.Controller):

    @http.route(['/data_capture/form/<int:lead_id>'], type='http', auth='user', website=True)
    def data_capture_form(self, lead_id=None, **kwargs):
        partner = request.env.user.partner_id
        lead = request.env['bvs.lead'].with_user(SUPERUSER_ID).browse(lead_id)
        if lead.exists():
            if partner == lead.partner_id or partner.id in lead.applicant_ids.ids:
                data_capture_form = request.env['portal.user.documents'].sudo().search([('data_capture_form', '=', True)], limit=1)
                values = {
                    'page_name': 'data_capture_form',
                    'lead_id': lead.id,
                    'dc_attachment': data_capture_form.attachment_ids if data_capture_form else False
                }

                return request.render("bvs_data_capture_form.data_capture_form", values)

        return request.redirect('/my')

    @http.route(['/data_capture_form/form/submit'], type='http', methods=['POST'], auth="user", website=True)
    def application_submit(self, **kw):
        if http.request.httprequest.method == 'POST':
            values = http.request.params.copy()
            partner = http.request.env.user.partner_id
            lead = http.request.env['bvs.lead'].with_user(SUPERUSER_ID).browse(int(values['lead_id']))
            if lead.exists():
                if partner == lead.partner_id or partner.id in lead.applicant_ids.ids:
                    data_capture_form_submissions = http.request.httprequest.files.getlist('data_capture_form_submission')
                    attachment_ids = []
                    for data_capture_form_submission in data_capture_form_submissions:
                        attachment_values = {
                            'name': data_capture_form_submission.filename,
                            'datas': base64.b64encode(data_capture_form_submission.read()),
                            'res_model': 'bvs.lead',
                            'res_id': lead.id,
                            'public': False,
                        }
                        attachment = http.request.env['ir.attachment'].sudo().create(attachment_values)
                        attachment_ids.append(attachment.id)
                    lead.sudo().write({'data_capture_form_submission': [(6, 0, attachment_ids)]})
                    return http.request.redirect('/application/form/done')

        return request.redirect('/my')

    @http.route('/application/form/done', type='http', auth='user', website=True)
    def application_form_submit(self, **kwargs):
        return request.render("bvs_portal.application_form_submit_success")
