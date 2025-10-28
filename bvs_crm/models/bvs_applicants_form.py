from odoo import api, models, SUPERUSER_ID, fields, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime


class BVSApplicantsForms(models.Model):
    _name = 'bvs.applicants.form'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = "Applicant Form"
    _rec_name = "partner_id"

    lead_id = fields.Many2one('bvs.lead', string="Lead")
    partner_id = fields.Many2one("res.partner", string="Customer", tracking=True)
    first_name = fields.Char('First Name', related='partner_id.first_name', tracking=True)
    last_name = fields.Char('Last Name', related='partner_id.last_name', tracking=True)
    email = fields.Char(string="Email", related='partner_id.email', readonly=False, tracking=True)
    client_acknowledgment = fields.Boolean(string='Client Acknowledgment of Affordability Assessment')
    contact_number = fields.Char(string="Contact Number", related='partner_id.mobile', readonly=False, tracking=True)
    client_acknowledgment_ill = fields.Boolean(string='Client Acknowledgment of ILL')
    initial_documents_acknowledgement = fields.Boolean(string='Initial Documents Acknowledgement')
    fact_finding_documents = fields.Many2many(
        'ir.attachment', 'bvs_applicants_fact_find_attachment_rel', 'lead_id', 'attachment_id',
        string='Fact Finding Documents')
    initial_document_submission = fields.Many2many(
        'ir.attachment', 'bvs_applicants_custom_lead_attachment_rel', 'lead_id', 'attachment_id',
        string='Initial Document Submission')
    affordability_acknowledgement = fields.Boolean(string='Affordability Assessment Acknowledgement')
    negative_evaluation_documents = fields.Many2many(
        'ir.attachment', 'bvs_applicants_negative_evaluation_docs_rel', 'lead_id', 'attachment_id',
        string='Negative Evaluation Documents',
        help="Multiple Docs Upload for negative evaluation."
    )
    negative_evaluation_acknowledgement = fields.Boolean(string='Negative Evaluation Acknowledgement')
    client_acknowledgement_of_new_offer = fields.Boolean(string='Client Acknowledgement of New Offer')
    mortgage_offer_details_acknowledgement = fields.Boolean(string='Mortgage Offer Details and Acknowledgement')
    survey_acknowledgement = fields.Boolean(string='Survey Acknowledgement')
    risk_calculator_acknowledgement = fields.Binary(
        string='Risk Calculator Quotes and KFD Quote Summary Acknowledgement')
    medical_underwriting_acknowledgement = fields.Binary(string='Protection Application Medical Underwriting')
    data_capture_form_submission = fields.Many2many(
        'ir.attachment', 'bvs_applicants_data_capture_attachment_rel', 'lead_id', 'attachment_id',
        string='Data capture form')
    home_insurance_quote_acknowledgement = fields.Binary(string='Home Insurance Quote')
    stage_id = fields.Many2one('bvs.stage', 'Stage', related='lead_id.stage_id')
    product_type = fields.Selection([
        ('mortgage', 'Mortgage'),
        ('protection', 'Protection')],
        default='mortgage', string='Service Type', related='lead_id.product_type')







