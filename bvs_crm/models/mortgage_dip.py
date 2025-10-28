from odoo import models, fields


class BVSLead(models.Model):
    _inherit = 'bvs.lead'

    income_analysis_1 = fields.Binary(string="Income analysis", attachment=True)
    update_checklist_filename = fields.Char(string="Update Checklist Filename")
    schedule_meeting = fields.Datetime(string="Schedule Meeting")
    dip_request = fields.Boolean(string="DIP Requested")
    dip_decision = fields.Selection([
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ], string="DIP Decision")
    dip_decision_declined = fields.Selection([
        ('requested', 'Requested'),
        ('hold', 'Hold'),
        ('terminate', 'Terminate'),
    ], string="Pending DIP")
    dip_upload = fields.Binary(string="DIP", attachment=True)
    approve_decline = fields.Selection([
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    ], string="Approve/Decline", default='draft')
    lender = fields.Selection([
        ('hodge_lifetime', 'Hodge Lifetime'),
        ('hsbc', 'HSBC'),
        ('kensington_mortgages', 'Kensington Mortgages'),
        ('kent_reliance', 'Kent Reliance'),
        ('landbay', 'Landbay'),
        ('leeds_building_society', 'Leeds Building Society'),
        ('metro_bank', 'Metro Bank'),
        ('nationwide_building_society', 'Nationwide Building Society'),
        ('natwest', 'NatWest'),
        ('newcastle_building_society', 'Newcastle Building Society'),
        ('nottingham_building_society', 'Nottingham Building Society'),
        ('paragon_mortgages', 'Paragon Mortgages'),
        ('pepper_money', 'Pepper Money'),
        ('platform_mortgages', 'Platform Mortgages'),
        ('precise_mortgages', 'Precise Mortgages'),
        ('principality_building_society', 'Principality Building Society'),
        ('progressive_building_society', 'Progressive Building Society'),
        ('saffron_building_society', 'Saffron Building Society'),
        ('santander', 'Santander'),
        ('scottish_building_society', 'Scottish Building Society'),
        ('scottish_widows_bank', 'Scottish Widows Bank'),
        ('skipton_building_society', 'Skipton Building Society'),
        ('the_mortgage_works', 'The Mortgage Works'),
        ('tsb', 'TSB'),
        ('vida_homeloans', 'Vida Homeloans'),
        ('virgin_money', 'Virgin Money'),
        ('west_brom_for_intermediaries', 'West Brom for Intermediaries'),
        ('zephyr_homeloans', 'Zephyr Homeloans'),
    ], string='Lender')
    upload_checklist = fields.Many2many('ir.attachment', 'dip_attachment', string="DIP Certificate")
    status_update_mail_chimp = fields.Boolean(string="Mail Chimp Updated")
    status_update_ch = fields.Boolean(string="CH Updated")
    dip_checklist = fields.Boolean(string="Dip Checklist")
    upload_mos_reservation_form = fields.Binary(string="MOS/ Reservation Form", attachment=True)
    dip_note = fields.Text(string="Note")

    mos_reservation_form_submissions = fields.Many2many(
        'ir.attachment', 'bvs_lead_attachment_rel', 'lead_id', 'attachment_id',
        string='MOS/Reservation Form Submissions',
        help="Upload MOS/Reservation form submissions here."
    )
