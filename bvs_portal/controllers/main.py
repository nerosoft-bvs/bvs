import logging
import datetime
import base64
from werkzeug.exceptions import Forbidden, NotFound
from odoo import fields, http, SUPERUSER_ID, _
from odoo.http import request

_logger = logging.getLogger(__name__)


class ApplicationForm(http.Controller):

    @http.route(['/application/form/<int:application_id>'], type='http', auth='user', website=True)
    def application_form(self, application_id=None, **kwargs):
        partner = request.env.user.partner_id
        lead = request.env['bvs.lead'].with_user(SUPERUSER_ID).browse(application_id)
        if lead.exists():
            if partner == lead.partner_id or partner.id in lead.applicant_ids.ids:
                values = {
                    'page_name': 'application_form',
                    'lead_id': lead.id,
                    'lead_registration_no': lead.registration_no,
                    'lead_state': lead.stage_id,
                }
                return request.render("bvs_portal.application_form", values)

        return request.redirect('/my')

    @http.route(['/application/form/submit'], type='http', methods=['GET', 'POST'], auth="user", website=True)
    def application_submit(self, **kw):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            lead = request.env['bvs.lead'].with_user(SUPERUSER_ID).browse(int(values['lead_id']))
            if lead.exists():
                if partner == lead.partner_id or partner.id in lead.applicant_ids.ids:
                    lead.sudo().write({
                        'client_acknowledgment': values['client_acknowledgment'] if 'client_acknowledgment' in values else False,
                        'client_acknowledgment_ill': values['client_acknowledgment_ill'] if 'client_acknowledgment_ill' in values else False,
                        'initial_documents_acknowledgement': values['initial_documents_acknowledgement'] if 'initial_documents_acknowledgement' in values else False,
                        'affordability_acknowledgement': values.get('affordability_acknowledgement', False),
                        'negative_evaluation_acknowledgement': values.get('negative_evaluation_acknowledgement', False),
                        'risk_calculator_acknowledgement': values.get('risk_calculator_acknowledgement', False),
                        'medical_underwriting_acknowledgement': values.get('medical_underwriting_acknowledgement', False),
                        'home_insurance_quote_acknowledgement': values.get('home_insurance_quote_acknowledgement', False),
                        'survey_acknowledgement': values.get('survey_acknowledgement', False),
                        'mortgage_offer_details_acknowledgement': values.get('mortgage_offer_details_acknowledgement', False),
                        'client_acknowledgement_of_new_offer': values.get('client_acknowledgement_of_new_offer', False),
                    })

                    fact_finding_documents = request.httprequest.files.getlist('fact_finding_documents')
                    for fact_finding_document in fact_finding_documents:
                        attachment_values = {
                            'name': fact_finding_document.filename,
                            'datas': base64.b64encode(fact_finding_document.read()),
                            'res_model': 'bvs.lead',
                            'res_id': lead.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        lead.sudo().write({'fact_finding_documents': [(4, attachment.id)]})

                    data_capture_form_submissions = request.httprequest.files.getlist('data_capture_form_submission')
                    for data_capture_form_submission in data_capture_form_submissions:
                        attachment_values = {
                            'name': data_capture_form_submission.filename,
                            'datas': base64.b64encode(data_capture_form_submission.read()),
                            'res_model': 'bvs.lead',
                            'res_id': lead.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        lead.sudo().write({'data_capture_form_submission': [(4, attachment.id)]})

                    # Handle Initial Document Submission
                    initial_document_submissions = request.httprequest.files.getlist('initial_document_submission')
                    for initial_document_submission in initial_document_submissions:
                        attachment_values = {
                            'name': initial_document_submission.filename,
                            'datas': base64.b64encode(initial_document_submission.read()),
                            'res_model': 'bvs.lead',
                            'res_id': lead.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        lead.sudo().write({'initial_document_submission': [(4, attachment.id)]})

                    mos_reservation_form_submission = request.httprequest.files.getlist('mos_reservation_form_submissions')
                    for mos_reservation_form_submissions in mos_reservation_form_submission:
                        attachment_values = {
                            'name': mos_reservation_form_submissions.filename,
                            'datas': base64.b64encode(mos_reservation_form_submissions.read()),
                            'res_model': 'bvs.lead',
                            'res_id': lead.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        lead.sudo().write({'mos_reservation_form_submissions': [(4, attachment.id)]})

                    negative_evaluation_document = request.httprequest.files.getlist('negative_evaluation_documents')
                    for negative_evaluation_documents in negative_evaluation_document:
                        attachment_values = {
                            'name': negative_evaluation_documents.filename,
                            'datas': base64.b64encode(negative_evaluation_documents.read()),
                            'res_model': 'bvs.lead',
                            'res_id': lead.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        lead.sudo().write({'negative_evaluation_documents': [(4, attachment.id)]})

                    return request.redirect('/application/form/done')
                else:
                    return request.redirect('/application/form')
            else:
                return request.redirect('/application/form')

    @http.route('/application/form/done', type='http', auth='user', website=True)
    def application_form_submit(self, **kwargs):
        return request.render("bvs_portal.application_form_submit_success")
