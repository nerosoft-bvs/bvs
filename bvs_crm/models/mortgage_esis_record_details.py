from odoo import api, models, fields


class EsisRecord(models.Model):
    _name = 'esis.record.details'
    _inherit = ['mail.thread']
    _description = 'Esis Record Details'

    name = fields.Char(string="Name")
    property_value = fields.Integer('Property Value')
    single_joint_application = fields.Selection([
        ('joint', 'Joint'),
    ], string='Applicants')
    loan_amount = fields.Integer('Loan Amount')
    deposit = fields.Integer('Deposit')
    ltv = fields.Integer('LTV')
    mortgage_term = fields.Integer('Mortgage Term')
    illustration_date = fields.Date('Illustration Date', default=fields.Date.today)
    procuration_fee = fields.Integer('Procuration Fee')
    repayment_method = fields.Selection([
        ('repayment', 'Repayment'),
        ('interest_only', 'Interest Only'),
        ('part_and_part', 'Part & Part'),
    ], string='Repayment Method')
    rate_type = fields.Selection([
        ('fixed', 'Fixed'),
        ('tracker', 'Tracker'),
        ('discount', 'Discount'),
        ('variable', 'Variable'),
    ], string='Rate Type')
    initial_rate = fields.Integer('Initial Rate')
    monthly_payment = fields.Integer('Monthly Payment')
    product_fee = fields.Integer('Product Fee')
    valuation_fee_amount = fields.Integer('Valuation Fee Amount')
    application_fee_amount = fields.Integer('Application Fee Amount')
    cashback = fields.Integer('Cashback')
    remarks = fields.Text('Remarks')
    upload_esis = fields.Binary('Upload ESIS')
    upload_filters = fields.Binary('Upload Filters')
    dta_life_cover_included = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='DTA Life Cover Included')
    cover_term = fields.Integer('Cover Term')
    monthly_premium = fields.Integer('Monthly Premium')
    cover_expiry_date = fields.Date('Cover Expiry Date')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('waiting_approval', 'Waiting for Approval'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='draft', readonly=True, copy=False, track_visibility='onchange')
    active = fields.Boolean(default=True)
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
        ('zephyr_homeloans', 'Zephyr Homeloans'), ], string='Lender')

    lead_id = fields.Many2one('bvs.lead', string='Related Lead')
    is_button_visible = fields.Boolean(string="IS Button Invisble")
    product_term = fields.Selection([
        ('two', '2'),
        ('three', '3'),
        ('five', '5'),
        ('seven', '7'),
        ('ten', '10'),
        ('life', 'Life Time'),
    ], string='Product Term')

    is_current_user_advisor = fields.Boolean(compute='_compute_is_current_user_advisor')

    @api.depends('lead_id.mortgage_advisor')
    def _compute_is_current_user_advisor(self):
        for record in self:
            record.is_current_user_advisor = (
                record.lead_id and
                record.lead_id.mortgage_advisor and
                record.lead_id.mortgage_advisor.id == self.env.user.id
            )

    def action_confirm(self):
        for record in self:
            if record.lead_id:
                values = {
                    'property_value': record.property_value,
                    'loan_amount': record.loan_amount,
                    'deposit': record.deposit,
                    'ltv': record.ltv,
                    'mortgage_term': record.mortgage_term,
                    'illustration_date': record.illustration_date,
                    'procuration_fee': record.procuration_fee,
                    'repayment_method': record.repayment_method,
                    'rate_type': record.rate_type,
                    'initial_rate': record.initial_rate,
                    'monthly_payment': record.monthly_payment,
                    'product_fee': record.product_fee,
                    'cashback': record.cashback,
                    'remarks': record.remarks,
                    'upload_esis': record.upload_esis,
                    'upload_filters': record.upload_filters,
                    'dta_life_cover_included': record.dta_life_cover_included,
                    'cover_term': record.cover_term,
                    'monthly_premium': record.monthly_premium,
                    'cover_expiry_date': record.cover_expiry_date,
                    'esis_single_joint_application': record.single_joint_application,
                    'esis_lender': record.lender,
                    'esis_product_term': record.product_term,
                    'esis_upload_esis': record.upload_esis,
                    'esis_application_fee_amount': record.application_fee_amount,
                    'esis_valuation_fee_amount': record.valuation_fee_amount,
                }
                record.lead_id.write(values)
                # Archive other ESIS records for the same lead
                other_esis_records = self.env['esis.record.details'].search([
                    ('lead_id', '=', record.lead_id.id),
                    ('id', '!=', record.id),  # Exclude the current record
                    ('active', '=', True)      # Only archive active records
                ])
                other_esis_records.write({'active': False})

                # Set the current record to waiting for approval
                record.write({'state': 'waiting_approval', 'is_button_visible': False})

                # Create an activity for the mortgage advisor
                if record.lead_id and record.lead_id.mortgage_advisor:
                    self.env['mail.activity'].create({
                        'res_id': record.id,
                        'res_model_id': self.env.ref('bvs_crm.model_esis_record_details').id,
                        'activity_type_id': self.env.ref('mail.mail_activity_data_todo').id,
                        'summary': 'ESIS Record requires approval',
                        'user_id': record.lead_id.mortgage_advisor.id,
                        'note': f'ESIS Record {record.name} for Lead {record.lead_id.display_name} requires your approval.',
                    })

    def action_approve(self):
        for record in self:
            if record.state == 'waiting_approval':
                record.write({'state': 'confirmed'})
                # Mark related activities as done
                activities = self.env['mail.activity'].search([
                    ('res_id', '=', record.id),
                    ('res_model_id', '=', self.env.ref('bvs_crm.model_esis_record_details').id),
                    ('user_id', '=', self.env.user.id), # Only mark activities for the current user
                    ('state', '!=', 'done') # Only mark pending activities
                ])
                activities.action_feedback(feedback='Approved by Advisor')
