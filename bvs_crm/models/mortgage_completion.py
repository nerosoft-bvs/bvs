from odoo import models, fields


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    completion_team_leader = fields.Many2one('res.users', string='Team Leader')
    lender_offer_case_allocation = fields.Many2one('res.users', string='Team Member')
    verified_by = fields.Many2one('res.users', string='Verified by')
    is_verified = fields.Boolean(string='Verified')
    lender_offer_tm_acknowledgement = fields.Boolean(string='Ready To Submit')
    lender_offer_concert_hub_ready = fields.Boolean(string='Status Update')
    lender_offer_check_ch_submission = fields.Boolean(string='CH Submitted')
    lender_offer_check_risk_report = fields.Boolean(string='Suitability Report Uploaded')
    protection_case_allocation = fields.Many2one('res.users', string='Case Allocation To Protection Team Member')
    protection_tm_acknowledgement = fields.Boolean(string='Team Member Acknowledgement')
    protection_concert_hub_ready = fields.Boolean(string='Status Update')
    protection_check_risk_report = fields.Boolean(string='CH Submitted')
    protection_check_suitability_report = fields.Boolean(string='Suitability Report Uploaded')
    advisor_text = fields.Char(string='CH Case ID')
    personal_risk_report = fields.Binary(string='Personal Risk Report')
    building_risk_report = fields.Binary(string='Building And Content Risk Report')
    suitability_report = fields.Binary(string='Suitability Report')
    lender_offer_ch_tm_list_acknowledge_yes = fields.Boolean(string='Yes (Acknowledgement)')
    affordability_recodails = fields.Boolean(string='Affordability Record Details')
    dip_record_details = fields.Boolean(string='DIP Record Details')
    fma_record_details = fields.Boolean(string='FMA Record Details')
    post_offer_record = fields.Boolean(string='Offer and Survey Record Details')

