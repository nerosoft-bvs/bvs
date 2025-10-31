from odoo import api, models, SUPERUSER_ID, fields, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime
from . import bvs_stage


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    solicitor_contact = fields.Integer(string="Solicitor Contact Number")
    estate_agent = fields.Char('Estate Agent', related='state_agent_id.name', tracking=True)
    estate_agent_no = fields.Char('Estate Agent No', related='state_agent_id.mobile', tracking=True)
    second_customer = fields.Boolean(string="If Second Customer ?", tracking=True)
    approval_status = fields.Selection([
        ('requested', 'Requested'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('terminate', 'Terminate '),
    ], string="Affordability Assessment Decision")
    approval_note = fields.Text(string="Decision Note")
    affordability_report_upload = fields.Many2many(
        'ir.attachment', 'affordability_report_upload_rel', 'lead_id', 'attachment_id',
        string='Affordability Report')
    affordability_report_filename = fields.Char(string="Affordability Report Filename")
    cl_note = fields.Text(string="Note")
    initial_documents_acknowledgement = fields.Boolean(string='Initial Documents Acknowledgement')
    fact_finding_documents = fields.Many2many(
        'ir.attachment', 'fact_find_attachment_rel', 'lead_id', 'attachment_id',
        string='Fact Finding Documents')
    initial_document_submission = fields.Many2many(
        'ir.attachment', 'custom_lead_attachment_rel', 'lead_id', 'attachment_id',
        string='Initial Document Submission')

    lender_note = fields.Char("Solicitor Selection Note")
    applicant_count = fields.Integer("No of Applicants", compute='_compute_applicant_count')
    applicant_ids = fields.Many2many('res.partner', 'lead_partner_rel', 'partner_id', 'lead_id', string='Applicants')
    # applicant_ids = fields.Many2many(
    #     'res.partner',
    #     'partner_lead_rel',
    #     'lead_id',
    #     'partner_id',
    #     string="Applicants"
    # )
    applicant_form_count = fields.Integer("No of Applicant Forms", compute='_compute_applicant_form_count')
    applicant_form_ids = fields.One2many('bvs.applicants.form', 'lead_id', string='Applicant Forms')
    esis_record_count = fields.Integer("Esis Records Count", compute='_compute_applicant_form_count')
    affordability_kyc = fields.Boolean(related='stage_id.affordability_kyc')
    dip_kyc = fields.Boolean(related='stage_id.dip_kyc')
    illustration_kyc = fields.Boolean(related='stage_id.illustration_kyc')
    esis_record_ids = fields.One2many('esis.record.details', 'lead_id', string='Esis Records')

    @api.depends('applicant_ids')
    def _compute_applicant_count(self):
        for lead in self:
            lead.applicant_count = len(lead.applicant_ids)

    def view_applicants(self):
        applicants = self.mapped('applicant_ids')
        action = self.env.ref('base.action_partner_form').read()[0]
        if len(applicants) > 1:
            action['domain'] = [('id', 'in', applicants.ids)]
        elif len(applicants) == 1:
            action['views'] = [(self.env.ref('base.view_partner_form').id, 'form')]
            action['res_id'] = applicants.ids[0]
        else:
            action = {'type': 'ir.actions.act_window_close'}
        action['context'] = {'create': False}
        return action

    @api.depends('applicant_form_ids')
    def _compute_applicant_form_count(self):
        for partner in self:
            partner.applicant_form_count = len(partner.applicant_form_ids)

    def view_applicant_forms(self):
        applicant_forms = self.mapped('applicant_form_ids')
        action = self.env.ref('bvs_crm.bvs_applicants_form_action').read()[0]
        if len(applicant_forms) > 1:
            action['domain'] = [('id', 'in', applicant_forms.ids)]
        elif len(applicant_forms) == 1:
            action['views'] = [(self.env.ref('bvs_crm.bvs_applicants_form_motgage').id, 'form')]
            action['res_id'] = applicant_forms.ids[0]
        else:
            action = {'type': 'ir.actions.act_window_close'}
        action['context'] = {'create': False}
        return action

    def view_esis_records(self):
        action = self.env['ir.actions.act_window']._for_xml_id('bvs_crm.esis_record_details_action')
        records = self.env['esis.record.details'].search([('lead_id', '=', self.id)])
        if len(records) == 1:
            action['view_mode'] = 'form'
            action['res_id'] = records.id
            action['views'] = []
        else:
            action['domain'] = [('id', 'in', records.ids)]

        action['context'] = {'create': False}
        return action

    def delete_applicant(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': 'Delete Applicant',
            'res_model': 'delete.applicant.wizard',
            'view_mode': 'form',
            'target': 'new',
            'context': {'default_lead_id': self.id},
        }





