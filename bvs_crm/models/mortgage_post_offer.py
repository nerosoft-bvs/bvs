from odoo import models, fields


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    po_tl_allocation = fields.Many2one('res.users', string='Team Member')
    po_team_leader = fields.Many2one('res.users', string='Team Leader')
    po_tm_acknowledgement = fields.Boolean(string='PO Team Member Acknowledgement')
    offer_details = fields.Binary(string='Lender Offer')
    offer_documents = fields.Binary(string='Offer Documents')
    legal_process_milestone = fields.Char(string='Legal Process Milestone')
    exchange_date = fields.Date(string='Exchange Date')
    completion_date = fields.Date(string='Completion Date')
    product_end_date = fields.Date(string='Product End Date')
    complete_case = fields.Boolean(string='Complete the Case')
    status_update = fields.Text(string='Status Update')
    change_in_case = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Change in Case')
    survey_quote = fields.Binary(string='Survey Quote')
    survey_instructions = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Survey Instructions')
    post_offer_checklist = fields.Boolean(string='Post Offer Checklist')
    upload_checkbox = fields.Boolean(string='Upload Checkbox')
    legal_process_milestones_checklist = fields.Boolean(string='Legal Process Milestones Checklist')
    date_picker = fields.Date(string='Date Picker')
    resend_button = fields.Boolean(string='Resend Button')
    completion_date_picker = fields.Date(string='Completion Date Picker')
    case_duplicate = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Case Duplicate')
    change_type = fields.Selection([
        ('lender_change', 'Lender Change'),
        ('product_change', 'Product Change'),
        ('solicitor_change', 'Solicitor Change'),
        ('property_change', 'Property Change'),
    ], string='Change incase')
    solicitor_info = fields.Text(string='Solicitor Info')
    commission_fee_amount = fields.Float(string='Commission Fee Amount')
    po_note = fields.Text(string="Note")
    solicitor_change = fields.Many2one('res.users', string='New Solicitor')
    po_offer_checklist = fields.Boolean(string='Post Offer Check List')
    offer_rd = fields.Boolean(string='Offer Record Details')
    survey_rd = fields.Boolean(string='Survey Record Details')
    le_pro_mil_checklist = fields.Boolean(string='Legal Process Milestone Check List')
    client_acknowledgement_of_new_offer = fields.Boolean(string='Client Acknowledgement of New Offer')
    mortgage_offer_details_acknowledgement = fields.Boolean(string='Mortgage Offer Details and Acknowledgement')
    survey_acknowledgement = fields.Boolean(string='Survey Acknowledgement')