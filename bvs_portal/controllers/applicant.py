import logging
import datetime
import base64
from werkzeug.exceptions import Forbidden, NotFound
from odoo import fields, http, SUPERUSER_ID, _
from odoo.http import request

_logger = logging.getLogger(__name__)


class ApplicationForm(http.Controller):

    @http.route(['/applicant/form/<int:applicant_form_id>'], type='http', auth='user', website=True)
    def applicant_form(self, applicant_form_id=None, **kwargs):
        partner = request.env.user.partner_id
        form_id = request.env['bvs.applicants.form'].with_user(SUPERUSER_ID).browse(applicant_form_id)
        if form_id.exists():
            if partner == form_id.lead_id.partner_id or partner == form_id.partner_id:
                values = {
                    'page_name': 'applicant_form',
                    'applicant_form_id': form_id.id,
                    # 'lead_registration_no': form_id.registration_no,
                    'ips_attachment_ids': form_id.insurance_proposition_submission.attachment_ids,
                    'fas_attachment_ids': form_id.free_arrangement_submission.attachment_ids,
                    'jcd_attachment_ids': form_id.joint_client_data_submission.attachment_ids,
                    'mps_attachment_ids': form_id.mortgage_provider_submission.attachment_ids,
                    'dip_attachment_ids': form_id.dip_view_id.attachment_ids,
                    'mpas_attachment_ids': form_id.our_morgages_and_protections_submission.attachment_ids,
                    'lead_state': form_id.stage_id,
                }
                return request.render("bvs_portal.applicant_form", values)

        return request.redirect('/my')

    @http.route(['/applicant/form/submit'], type='http', methods=['GET', 'POST'], auth="user", website=True)
    def applicant_form_submit(self, **kw):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            applicant_forms = request.env['bvs.applicants.form'].with_user(SUPERUSER_ID).browse(int(values['applicant_form_id'])).exists()
            if applicant_forms:
                if request.env.user.partner_id == applicant_forms.lead_id.partner_id or request.env.user.partner_id == applicant_forms.partner_id:
                    applicant_forms.sudo().write({
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
                            'res_id': applicant_forms.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        applicant_forms.sudo().write({'fact_finding_documents': [(4, attachment.id)]})

                    data_capture_form_submissions = request.httprequest.files.getlist('data_capture_form_submission')
                    for data_capture_form_submission in data_capture_form_submissions:
                        attachment_values = {
                            'name': data_capture_form_submission.filename,
                            'datas': base64.b64encode(data_capture_form_submission.read()),
                            'res_model': 'bvs.lead',
                            'res_id': applicant_forms.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        applicant_forms.sudo().write({'data_capture_form_submission': [(4, attachment.id)]})

                    # Handle Initial Document Submission
                    initial_document_submissions = request.httprequest.files.getlist('initial_document_submission')
                    for initial_document_submission in initial_document_submissions:
                        attachment_values = {
                            'name': initial_document_submission.filename,
                            'datas': base64.b64encode(initial_document_submission.read()),
                            'res_model': 'bvs.lead',
                            'res_id': applicant_forms.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        applicant_forms.sudo().write({'initial_document_submission': [(4, attachment.id)]})

                    mos_reservation_form_submission = request.httprequest.files.getlist('mos_reservation_form_submissions')
                    for mos_reservation_form_submissions in mos_reservation_form_submission:
                        attachment_values = {
                            'name': mos_reservation_form_submissions.filename,
                            'datas': base64.b64encode(mos_reservation_form_submissions.read()),
                            'res_model': 'bvs.lead',
                            'res_id': applicant_forms.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        applicant_forms.sudo().write({'mos_reservation_form_submissions': [(4, attachment.id)]})

                    negative_evaluation_document = request.httprequest.files.getlist('negative_evaluation_documents')
                    for negative_evaluation_documents in negative_evaluation_document:
                        attachment_values = {
                            'name': negative_evaluation_documents.filename,
                            'datas': base64.b64encode(negative_evaluation_documents.read()),
                            'res_model': 'bvs.lead',
                            'res_id': applicant_forms.id,
                            'public': False,
                        }
                        attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                        applicant_forms.sudo().write({'negative_evaluation_documents': [(4, attachment.id)]})

                    return request.redirect('/applicant/form/done')
                else:
                    return request.redirect('/applicant/form')
            else:
                return request.redirect('/applicant/form')

    @http.route('/applicant/form/done', type='http', auth='user', website=True)
    def application_form_submit(self, **kwargs):
        return request.render("bvs_portal.application_form_submit_success")
