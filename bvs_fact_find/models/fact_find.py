from odoo import api, models, fields, SUPERUSER_ID, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import email_normalize
import base64
from io import BytesIO


class FactFind(models.Model):
    _name = 'fact.find'
    _description = 'Personal Information'

    name = fields.Char("name")
    title_customer = fields.Selection([
        ('mr', 'Mr.'),
        ('mrs', 'Mrs.'),
        ('miss', 'Miss'),
        ('ms', 'Ms'),
        ('dr', 'Dr'),
        ('other', 'Other'),
    ], string='Title')

    first_name = fields.Char(string='First Name')
    middle_names = fields.Char(string='Middle Names')
    surname = fields.Char(string='Surname')
    partner_id = fields.Many2one('res.partner', string='Partner')
    known_by_another_name = fields.Boolean(string='Known By Another Name')
    credit_comment = fields.Boolean(string='Do you have credit commitments')
    previous_name = fields.Char(string='Previous Name')
    previous_surname = fields.Char(string='Previous Name')
    date_of_name_change = fields.Date(string='Date of Name Change')
    date_of_birth = fields.Date(string='Date of Birth')
    country_of_birth = fields.Many2one('res.country', string='Country of Birth')

    gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ], string='Gender')
    nationality = fields.Selection([
        ('british', 'British'),
        ('eu', 'European Union'),
        ('other', 'Other'),
    ], string='Nationality')
    other_nationality = fields.Char(string='If other Nationality')
    other_nationality_id = fields.Many2one('res.country', string='If other Nationality')
    eu_country_list = fields.Selection(
        [
            ('at', 'Austria'),
            ('be', 'Belgium'),
            ('bg', 'Bulgaria'),
            ('hr', 'Croatia'),
            ('cy', 'Republic of Cyprus'),
            ('cz', 'Czech Republic'),
            ('dk', 'Denmark'),
            ('ee', 'Estonia'),
            ('fi', 'Finland'),
            ('fr', 'France'),
            ('de', 'Germany'),
            ('gr', 'Greece'),
            ('hu', 'Hungary'),
            ('ie', 'Ireland'),
            ('it', 'Italy'),
            ('lv', 'Latvia'),
            ('lt', 'Lithuania'),
            ('lu', 'Luxembourg'),
            ('mt', 'Malta'),
            ('nl', 'Netherlands'),
            ('pl', 'Poland'),
            ('pt', 'Portugal'),
            ('ro', 'Romania'),
            ('sk', 'Slovakia'),
            ('si', 'Slovenia'),
            ('es', 'Spain'),
            ('se', 'Sweden'),
        ],
        string='European Union'
    )
    passport_expiry_date = fields.Date(string='Passport Expiry Date')
    dual_nationality = fields.Char(string='Second / Dual Nationality')
    dual_nationality_id = fields.Many2one('res.country', string='Second / Dual Nationality')
    start_continue_living_in_uk = fields.Date(string='When do you start continue living in UK', compute='_compute_start_continue_living_in_ukn', store=True)
    start_continue_living_in_ukn = fields.Char(string='When do you start continue living in UK')
    start_continue_living_in_uk_month = fields.Char(string='When do you start continue living in UK')
    start_continue_living_in_uk_year = fields.Char(string='When do you start continue living in UK')

    indefinite_leave_to_remain = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Do you hold Indefinite Leave to Remain (ILR)?')

    settled_status = fields.Selection([
        ('settled', 'Settled'),
        ('pre_settled', 'Pre-Settled'),
    ], string='Are you Settled or Pre-Settled?')

    visa_category = fields.Selection([
        ('work_visa', 'Work Visa (Tier 2)'),
        ('spouse_dependent_visa', 'Spouse or Dependent Visa'),
        ('refugee_visa', 'Refugee Visa'),
        ('student_visa', 'Student Visa (Tier 4)'),
    ], string='Visa Category')

    marital_status = fields.Selection([
        ('married', 'Married'),
        ('single', 'Single'),
        ('civil_partnership', 'Civil Partnership'),
        ('divorced', 'Divorced'),
        ('separated', 'Separated'),
        ('widowed', 'Widowed'),
    ], string='Marital Status')

    employment_status = fields.Selection([
        ('employed', 'Employed'),
        ('self_employed', 'Self Employed'),
        ('unemployed', 'Unemployed'),
        ('retired', 'Retired'),
    ], string='Employment Status')

    dependant_status = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Do You Have a Financial  Dependant')
    financial_dependants = fields.Boolean(string='Do you have Financial Dependants')
    email_address = fields.Char(string='Email Address')
    other_email_address = fields.Char(string='Other Email Address')
    mobile_number = fields.Char(string='Mobile Number')
    home_telephone_number = fields.Char(string='Home Telephone Number')
    lead_id = fields.Many2one('bvs.lead', string="Lead")
    customer_type = fields.Selection(related='lead_id.customer_type')
    stage_id = fields.Many2one(related='lead_id.stage_id')
    number_of_dependents = fields.Integer('How many dependents?')
    is_private_lead = fields.Boolean(related='lead_id.is_private', string="Is Private Lead?", store=True)
    have_dependants = fields.Boolean(string="Have Dependants", store=True, default=True)

    def generate_pdf_report(self):
        report_name = 'fact_find_report.pdf'
        pdf_content = self.env.ref('bvs_fact_find.report_fact_find_template').render({'record': self})
        pdf_data = base64.b64encode(pdf_content)
        self.write({'pdf_report': pdf_data, 'report_name': report_name})

    pdf_report = fields.Binary('PDF Report')
    report_name = fields.Char('Report Name')

    @api.model
    def share_address_history(self, fact_find_id, address_history_data):
        # Get the fact find form and its lead
        fact_find_form = self.with_user(SUPERUSER_ID).browse(fact_find_id)
        related_fact_finds = fact_find_form.lead_id.fact_find_ids
        # Share the address history details with the lead
        for ff in related_fact_finds:
            ff.write({
                'address_history_ids': [(0, 0, line) for line in address_history_data],
            })
        # Return success
        return True

    @api.model
    def share_financial_dependants(self, fact_find_id, financial_dependants_data):
        # Get the fact find form and its lead
        fact_find_form = self.with_user(SUPERUSER_ID).browse(fact_find_id)
        related_fact_finds = fact_find_form.lead_id.fact_find_ids
        # Share the financial dependants details with the lead
        for fd in related_fact_finds:
            fd.write({
                'financial_depend_ids': [(0, 0, line) for line in financial_dependants_data],
            })
        return True

    @api.depends('start_continue_living_in_uk_month', 'start_continue_living_in_uk_year')
    def _compute_start_continue_living_in_ukn(self):
        for rec in self:
            if rec.start_continue_living_in_uk_month and rec.start_continue_living_in_uk_year:
                rec.start_continue_living_in_ukn = f"{rec.start_continue_living_in_uk_month}/{rec.start_continue_living_in_uk_year}"
            else:
                rec.start_continue_living_in_ukn = ""


    def write(self, vals):
        res = super().write(vals)
        for rec in self:
            if rec.lead_id.partner_id != rec.partner_id:
                continue

            if rec.lead_id and rec.lead_id.partner_id:
                rec.lead_id.partner_id.write({
                    'name': f"{rec.first_name or ''} {rec.surname or ''}".strip()
                })
        return res