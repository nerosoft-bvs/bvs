from odoo import models, fields, _


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    fma_tl_allocation = fields.Many2one('res.users', string='Team Member')
    fma_tm_acknowledgement = fields.Boolean(string='Team Member Acknowledgement')
    esis_record_ids = fields.Many2one('esis.record.details', string='Esis Record')
    solicitor_quotation_ids = fields.Many2many('ir.attachment', 'solicitor_attachment', string='Solicitor Quotation')
    solicitor_type = fields.Selection([
        ('type_1', 'Direct'),
        ('type_2', 'OpenWork Convencing'),
        ('type_3', 'Client selected'),
    ], string='Solicitor Type')
    referral_fee_amount = fields.Integer(string='Referral Fee Amount')
    change_solicitor = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Change Solicitor')
    solicitor_name_list = fields.Many2one('bvs.solicitor', string='Select New Solicitor')
    fa_ill = fields.Selection([
        ('requested', 'Requested'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('hold', 'Hold'),
        ('terminate', 'Terminate '),
    ], string='Illustration Decision')
    status_update_fma_tm = fields.Boolean(string='Status Update by FMA TM')
    illustration_note = fields.Text(string="Illustration Note")
    property_request_form = fields.Text(string="property Request Form")
    team_leader_illustration = fields.Many2one('res.users', string="Team Leader")
    state_agent_id = fields.Many2one('estate.agent', string="Estate Agent")
    upload_dc = fields.Binary(string="Upload Document")
    client_acknowledgment_ill = fields.Boolean(string='Client Acknowledgment of ILL')
    illustration_record_details = fields.Boolean(string='ESIS Record Details')
    illustration_checklist = fields.Boolean(string='Mortgage Checklist')
    solicitor_request_checklist = fields.Boolean(string='Solicitor Request Checklist')
    solicitor_record_details = fields.Boolean(string='Solicitor Record Details')
    multiple_docs_upload = fields.Many2many(
        'ir.attachment', 'custom_lead_attachment_rel', 'lead_id', 'attachment_id',
        string='Further Documents',
        help="Upload Further Documents here."
    )

    def action_add_esis_record(self):
        return {
            'name': _('ESIS Record'),
            'res_model': 'esis.record.details',
            'view_mode': 'form',
            'context': {'default_lead_id': self.id},
            'target': 'new',
            'type': 'ir.actions.act_window',
        }
