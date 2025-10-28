from odoo import api, models, SUPERUSER_ID, fields, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime
from . import bvs_stage


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    create_case_assign_pro_advisor = fields.Many2one('res.users', string='Protection Advisor')
    create_case_assign_tl = fields.Many2one('res.users', string='Protection TL')
    create_case_assign_tm = fields.Many2one('res.users', string='Team Member')
    pro_advisor_acknowledge_yes = fields.Boolean(string='Pro. Advisor Acknowledge - Yes')
    pro_advisor_acknowledge_no = fields.Boolean(string='Pro. Advisor Acknowledge - No')
    pro_tl_acknowledge_yes = fields.Boolean(string='Pro. TL Acknowledge - Yes')
    pro_tl_acknowledge_no = fields.Boolean(string='Pro. TL Acknowledge - No')
    pro_tm_acknowledge_yes = fields.Boolean(string='Pro. TM Acknowledge - Yes')
    pro_tm_acknowledge_no = fields.Boolean(string='Pro. TM Acknowledge - No')
    accuracy_of_docs_submission = fields.Selection([
        ('approve', 'Correct '),
        ('decline', 'Incorrect'),
    ], string='Accuracy of Initial Documents Submission')
    risk_assessment_decision = fields.Selection([
        ('requested', 'Requested'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('Terminate', 'Terminate'),
    ], string='Criteria Decision')
    income_analysis = fields.Binary(string='Income analysis')
    update_ch_mailchimp = fields.Boolean(string='CH And Mail Chimp Updated')
    upload_risk_calculator = fields.Binary(string='Risk Calculator')
    upload_quote_ids = fields.Many2many('ir.attachment', 'application_attachment2', string='Quotes')
    kfd_ids = fields.Many2many('ir.attachment', 'application_attachment3', string='KFD')
    key_feature_document = fields.Binary(string='Protection Application')
    initial_docs_checklist = fields.Boolean(string='Protection Application Submitted')
    risk_assessment_checklist = fields.Boolean(string='Risk Assessment Checklist')
    advisor_approval = fields.Selection([
        ('requested', 'Requested'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('Terminate', 'Terminate'),
    ], string='Protection Quote Decision')
    upload_medical_ids = fields.Many2many('ir.attachment', 'application_attachment4', string='Medical Questionnaire')
    checkbox_for_upload = fields.Binary(string='Upload the Medical Questionnaire')
    decline_note = fields.Text(string='Decline Note')
    excel_attachment_in_case = fields.Binary(string='Excel Attachment in Case')
    upload_multiple_quotations = fields.Binary(string='Upload Multiple Quotations')
    risk_calculator = fields.Binary(string='Risk Calculator')
    quote_summary = fields.Text(string='Quote Summary')
    latest_quote = fields.Binary(string='Latest Quote')
    data_capture_completion_status = fields.Selection([
        ('completed', 'Completed'),
        ('incomplete', 'Incomplete'),
    ], string='Data Capture Form Completion Status')
    medical_questionnaire_uploaded = fields.Boolean(string='Medical Questionnaire Uploaded')
    document_attachment_option = fields.Boolean(string='Document Attachment Option')
    medical_questionnaire_decision = fields.Selection([
        ('approve', 'Approve'),
        ('decline', 'Decline'),
    ], string='Medical Questionnaire Decision')
    decline_type = fields.Selection([
        ('requested', 'Requested'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('terminate', 'Terminate'),
    ], string='Decline Decision')

    advisor_decision = fields.Selection([
        ('requested', 'Requested'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('terminate', 'Terminate'),
    ], string='Advisor Decision')

    upload_for_decline2 = fields.Binary(string='Upload the latest quote and submit')
    checkbox_for_decline = fields.Boolean(string='Medical Underwriting')
    upload_for_medical_questionnaire = fields.Binary(string='Upload for Medical Questionnaire')
    decision_for_medical_questionnaire = fields.Selection([
        ('accepted', 'Accepted'),
        ('fail', 'Fail'),
        ('required', 'Medical UnderWriting Required'),
    ], string='Medical questionnaire decision')
    terminate_restart_case = fields.Selection([
        ('terminate', 'Terminate'),
        ('restart', 'Restart'),
    ], string='Decline Type')
    submit_protection_application = fields.Selection([
        ('required', 'Required'),
        ('accepted', 'Accepted'),
    ], string='Submit Protection Application')
    protection_application_submitted = fields.Boolean(string='Protection Application Submitted')
    protection_application_requires_underwriting = fields.Selection([
        ('required', 'Required'),
        ('not_required', 'Not Required'),
    ], string='Protection Application Requires Medical Underwriting')
    medical_underwriting_decision_received = fields.Boolean(string='Medical Underwriting Decision Received')
    medical_underwriting_decision_status = fields.Selection([
        ('approved', 'Approved'),
        ('increase_premium', 'Increase Premium'),
        ('client_acknowledge', 'Client Acknowledge'),
    ], string='Medical Underwriting Decision Status')
    increase_premium = fields.Binary(string='Increase Premium')
    start_protection_cover = fields.Boolean(string='Start Protection Cover with Exchange Date')
    upload_home_insurance_quote = fields.Binary(string='Upload Home Insurance Quote / IPID Policy Booklet')
    approval_of_quote_1 = fields.Selection([
        ('approve', 'Approve'),
        ('decline', 'Decline'),
    ], string='Advisor Approval')
    doc_upload = fields.Binary(string='Protection Application')
    home_insurance_submission = fields.Boolean(string='Home Insurance Submission')
    live_date_based_on_exchange_date = fields.Date(string='Requested Live Date')
    document_upload = fields.Binary(string='Protection Application')
    if_medical_questionaries_accepted = fields.Selection([
        ('no', 'No'),
        ('yes', 'Yes'),
        ('medical_underwriting_required', 'Medical Underwriting Required'),
    ], string='Protection Application')
    if_medical_questionaries_accepted_upload_status = fields.Binary(
        string='If medical qustionnaire required or accepted; Submit protection application')
    exchange_date2 = fields.Date(string='Exchange Date')
    medical_underwriting_decision_status_received = fields.Boolean(
        string='Medical Underwriting Received')
    medical_underwriting_decision_status_received_decline_terminate = fields.Selection([
        ('approve', 'Approve'),
        ('decline', 'Decline'),
        ('terminate', 'Terminate'),
    ], string='Medical Underwriting Decision')
    if_approved_increace_premium = fields.Binary(string='Approval Of Quote')
    predefined_document_selection = fields.Selection([
        ('document_1', 'Document 1'),
        ('document_2', 'Document 2'),
    ], string='Pre-defined Document Selection Dropdown List')
    home_Insurance_ids = fields.Many2many('ir.attachment', 'application_attachment5', string='Home Insuarance Quote')
    offer_accept = fields.Many2many('ir.attachment', 'application_attachment6', string='Offer Acceptance Documents')
    home_insurance_quote = fields.Binary(string='IPID')
    policy_booklet = fields.Binary(string='Policy Booklet')
    home_insurance_upload = fields.Binary(string='Home Insuarance')
    set_live_date = fields.Date(string='HI Live Date')
    approval_of_quote = fields.Selection([
        ('requested', 'Requested'),
        ('approve', 'Approve'),
        ('reject', 'Rejected'),
        ('hold', 'Hold'),
        ('Terminate', 'Terminate'),
    ], string='HI Quotes Decision')
    status_update2 = fields.Boolean(string='Live Status')
    home_insurance_submited = fields.Boolean(string='Home Insuarance Submitted')
    protection_note = fields.Text(string="Note")
    risk_calculator_acknowledgement = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree'),
    ], string='Risk Calculator Quotes and KFD Quote Summary Acknowledgement')
    medical_underwriting_acknowledgement = fields.Selection([
        ('agree', 'Agree'),
        ('disagree', 'Disagree'),
    ], string='Protection Application Medical Underwriting')
    data_capture_form_submission = fields.Many2many(
        'ir.attachment', 'data_capture_attachment_rel', 'lead_id', 'attachment_id',
        string='Data capture form',
    )

    data_capture_form = fields.Boolean(string="Data Capture Form send")
    home_insurance_quote_acknowledgement = fields.Selection([
        ('approve', 'Approve'),
        ('decline', 'Decline'),
    ], string='Home Insurance Quote')

    medical_underwriting_submit = fields.Many2many(
        'ir.attachment', 'medical_underwriting_attachment_rel', 'lead_id', 'attachment_id',
        string='Medical Underwriting Decision',
    )

    protection_quote_record = fields.Boolean(string='Protection Record Details')
    hi_quote_record = fields.Boolean(string='HI Quote Record Details')
    hi_sub_record = fields.Boolean(string='HI Submission Record Details')
    prot_offer_record = fields.Boolean(string='Protection Offer Record Details')
    protection_application_record = fields.Boolean(string='Protection Application Details')
    protection_quote_checklist = fields.Boolean(string='Protection Checklist')
    protection_application_checklist = fields.Boolean(string='Protection Application Checklist')

    def action_add_prot_quote_record(self):
        return {
            'name': _('Protection Quote Record Details'),
            'res_model': 'protection.quote.record.details',
            'view_mode': 'form',
            'context': {'default_lead_id': self.id},
            'target': 'new',
            'type': 'ir.actions.act_window',
        }

    def view_protection_records(self):
        action = self.env['ir.actions.act_window']._for_xml_id('bvs_crm.protection_quote_record_details_action')
        records = self.env['protection.quote.record.details'].search([('lead_id', '=', self.id)])
        if len(records) == 1:
            action['view_mode'] = 'form'
            action['res_id'] = records.id
            action['views'] = []
        else:
            action['domain'] = [('id', 'in', records.ids)]

        action['context'] = {'create': False}
        return action
