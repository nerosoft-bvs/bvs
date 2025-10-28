from odoo import models, fields


class EsisRecord(models.Model):
    _name = 'protection.quote.record.details'
    _description = 'Protection Quote Record Details'

    quote_number = fields.Selection([
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
    ], string='Quote Number')
    survey_level = fields.Selection([
        ('basic', 'Basic'),
        ('intermediate', 'Intermediate'),
        ('comprehensive', 'Comprehensive'),
    ], string='Survey Level')
    survey_firm = fields.Text('Survey Firm')
    lives_assured = fields.Selection([
        ('joint', 'Joint'),
        ('applicant1', 'Applicant 1'),
        ('applicant2', 'Applicant 2'),
    ], string='Lives Assured')
    insurance_provider_list = fields.Many2one('res.partner', string="Insurance Provider List")
    benefit_amount = fields.Integer('Benefit Amount')
    benefit_frequency = fields.Selection([
        ('monthly', 'Monthly'),
        ('one_off', 'One-off'),
    ], string='Benefit Frequency')
    monthly_premium = fields.Integer('Monthly Premium')
    term = fields.Integer('Term')
    proposed_start_date = fields.Date('Proposed Start Date')
    commission = fields.Integer('Commission')
    offer_exceptant_deadline = fields.Date(string="Quote Expiry Date")
    cover = fields.Selection([
        ('DTA Life', 'DTA Life'),
        ('DTA CIC', 'DTA CIC'),
        ('DTA Life + CIC', 'DTA Life + CIC'),
        ('LTA Life', 'LTA Life'),
        ('LTA CIC', 'LTA CIC'),
        ('LTA Life + CIC', 'LTA Life + CIC'),
        ('Income Protection', 'Income Protection'),
        ('Family Income Benefit', 'Family Income Benefit')
    ], string='Cover')
    income_protection = fields.Char(string="Income Protection")
    family_protection = fields.Char(string="Family Income Benefit")
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ], string='Status', default='draft', readonly=True, copy=False, track_visibility='onchange')
    lead_id = fields.Many2one('bvs.lead', string='Related Lead')
    is_button_visible = fields.Boolean(string="IS Button Invisble")
    quote_date = fields.Date('Quote Date')
    kfd_ids = fields.Many2many('ir.attachment', 'application_attachment_kfd', string='KFD')
    upload_quote_ids = fields.Many2many('ir.attachment', 'application_attachment_quote', string='Quotes')

    def action_confirm(self):
        for record in self:
            if record.lead_id:
                values = {
                    'quote_date': record.quote_date,
                    'quote_number': record.quote_number,
                    'survey_level': record.survey_level,
                    'survey_firm': record.survey_firm,
                    'proposed_start_date': record.proposed_start_date,
                    'cover': record.cover,
                    'benefit_amount': record.benefit_amount,
                    'offer_exceptant_deadline': record.offer_exceptant_deadline,
                    'commission': record.commission,
                    'lives_assured': record.lives_assured,
                    'benefit_frequency': record.benefit_frequency,
                    'dta_life': record.dta_life,
                    'dta_cic': record.dta_cic,
                    'dta_cic_life': record.dta_cic_life,
                    'lta_life': record.lta_life,
                    'lta_cic': record.lta_cic,
                    'lta_cic_life': record.lta_cic_life,
                    'income_protection': record.income_protection,
                    'family_protection': record.family_protection,
                }
                record.lead_id.write(values)
                referring_leads = self.env['protection.quote.record.details'].search([('lead_id', '=', record.id), ('state', '!=', 'confirmed')])
                referring_leads.write({'state': 'cancelled'})
                record.write({'state': 'confirmed'})

                record.write({'state': 'confirmed', 'is_button_visible': False})
