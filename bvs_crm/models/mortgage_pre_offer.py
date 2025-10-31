from odoo import models, fields


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    team_leader_pre = fields.Many2one('res.users', string="Team Leader")
    fma_submission = fields.Boolean(string='FMA Submitted')
    pre_offer_checklist = fields.Boolean(string='Pre Offer Checklist')
    submission_docs_upload = fields.Binary(string='Submission Docs Upload')
    fma_report_upload = fields.Binary(string='FMA Report')
    further_docs_requested = fields.Boolean(string='Further Docs Requested')
    document_status = fields.Selection([
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ], string='Document Status')
    update_valuation_instruction = fields.Boolean(string='Valuation Instruction')
    update_valuation_appointment_check = fields.Boolean(string='Valuation Appointment')
    update_valuation_appointment = fields.Date(string='Valuation Appointment')
    update_valuation_done = fields.Boolean(string='Valuation Done')
    valuation_feedback = fields.Selection([
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ], string='Valuation Feedback')
    valuation_status = fields.Selection([
        ('negative', 'Negative'),
        ('positive', 'Positive'),
    ], string='Valuation Status')
    lender_offer_dropdown = fields.Selection([
        ('responsible_party_1', 'Responsible Party 1'),
        ('responsible_party_2', 'Responsible Party 2'),
    ], string='Select Responsible Party')
    lender_offer_date_picker = fields.Date(string='SLA Date')
    lender_offer_f_docs_dropdown = fields.Selection([
        ('f_docs_1', 'F Docs 1'),
        ('f_docs_2', 'F Docs 2'),
        # Add more options as needed
    ], string=' F. Docs with   Attachment')
    lender_offer_request_button = fields.Boolean(string='Lender Offer')
    lender_offer_approve_decline_checkbox = fields.Selection([
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ], string='Valuation feedback')
    lender_offer_approve_decline_date_picker = fields.Date(string='Update valuation appoinment Date Picker')
    lender_offer_negative_positive_checkbox = fields.Selection([
        ('positive', 'Positive'),
        ('negative', 'Negative'),
    ], string='Valuation state')
    solicitor_cl_note = fields.Text(string="Solicitor Checkist Note")
    moill_cl_note = fields.Text(string="Mortgage Illustration Checklist Note")
    lender_offer_upload = fields.Binary(string='Lender offer')
    # document_submision_ids = fields.One2many('doc.submission', 'lead_id', string='Underwriting Status')
    pre_note = fields.Text(string='Note')
    fma_Submitted = fields.Text(string="FMA Note")
    negative_evaluation_acknowledgement = fields.Boolean(string='Negative Evaluation Acknowledgement')
    negative_evaluation_documents = fields.Many2many(
        'ir.attachment', 'bvs_lead_negative_evaluation_docs_rel', 'lead_id', 'attachment_id',
        string='Negative Evaluation Documents',
        help="Multiple Docs Upload for negative evaluation."
    )




