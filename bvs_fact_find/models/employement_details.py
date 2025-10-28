from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError


class FactFind(models.Model):
    _inherit = 'fact.find'

    employment_ids = fields.One2many('fact.find.employment', 'fact_find_id', string='Employment Details')
    gross_monthly_retirement_income = fields.Float(string='Gross Monthly Retirement Income')
    annual_retirement_income = fields.Float(string='Annual Retirement Income',
                                            compute='_compute_annual_retirement_income', store=True)

    @api.depends('gross_monthly_retirement_income')
    def _compute_annual_retirement_income(self):
        for record in self:
            record.annual_retirement_income = record.gross_monthly_retirement_income * 12 if record.gross_monthly_retirement_income else 0.0



class FactFindEmployment(models.Model):
    _name = 'fact.find.employment'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    employment_status = fields.Selection([
        ('employed', 'Employed'),
        ('self_employed', 'Self Employed'),
        ('house_person', 'House Person'),
        ('retired', 'Retired'),
    ], string='Employment Status')
    ni_number = fields.Char(string='NI Number')
    anticipated_retirement_age = fields.Integer(string='Anticipated Retirement Age')
    employment_basis = fields.Selection([
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
    ], string='Employment Basis')
    occupation = fields.Char(string='Occupation')
    occupation_sector = fields.Selection([
        ('manual', 'Manual Job'),
        ('no_manual', 'Non-Manual Job'),
    ], string='Occupation Type')
    employment_type = fields.Selection([
        ('permanent', 'Permanent'),
        ('fixed_term_contract', 'Fixed Term Contract'),
        ('short_term_contract', 'Short term Contract'),
        ('zero_hour_contract', 'Zero Hour Contract'),
        ('temporary', 'Temporary'),
        ('agency_work', 'Agency Work'),
    ], string='Employment Type')
    employer_name = fields.Char(string='Employer Name')
    address_of_working_place = fields.Text(string='Address of Working Place')
    work_telephone = fields.Char(string='Work Telephone')
    start_date = fields.Date(string='Start Date')
    end_date = fields.Date(string='End Date')
    current_contract_start_date = fields.Date(string='Current Contract Start Date')
    current_contract_end_date = fields.Date(string='Current Contract End Date')
    years_of_experience_contract_basis = fields.Integer(string='Years of Experience in Contract Basis')
    monthly_gross_salary = fields.Float(string='Monthly Gross Salary')
    annual_bonus = fields.Float(string='Annual Bonus')
    annual_salary = fields.Float(string='Annual Salary', compute='_compute_annual_salary', store=True)
    has_deductions = fields.Boolean(string='Do you have any deductions in your payslip?')
    student_loans = fields.Float(string='Student Loans')
    post_graduate_loan = fields.Float(string='Post Graduate Loan')
    gym_membership = fields.Float(string='Gym Membership')
    childcare = fields.Float(string='Childcare')
    other = fields.Float(string='Other')
    is_current_employment = fields.Boolean(string='Is This Current Employment?')
    occupation_type = fields.Selection([
        ('accounting', 'Accounting'),
        ('administration', 'Administration'),
        ('agriculture', 'Agriculture'),
        ('architecture', 'Architecture'),
        ('art_communications', 'Art and Communications'),
        ('catering', 'Catering'),
        ('customer_relations', 'Customer Relations'),
        ('education_training', 'Education and Training'),
        ('finance', 'Finance'),
        ('government', 'Government'),
        ('health', 'Health'),
        ('hospitality_retail', 'Hospitality and Retail'),
        ('human_resources', 'Human Resources'),
        ('information_technology', 'Information Technology'),
        ('labourer', 'Labourer'),
        ('law', 'Law'),
        ('management', 'Management'),
        ('manufacturing', 'Manufacturing'),
        ('marketing', 'Marketing'),
        ('professional_services', 'Professional Services'),
        ('property_maintenance', 'Property Maintenance'),
        ('public_services', 'Public Services'),
        ('science', 'Science'),
        ('transport_logistics', 'Transport and Logistics'),
        ('other', 'Other'),
    ], string="Occupation Sector")

    @api.depends('monthly_gross_salary', 'annual_bonus')
    def _compute_annual_salary(self):
        for record in self:
            monthly = record.monthly_gross_salary or 0.0
            bonus = record.annual_bonus or 0.0
            record.annual_salary = (monthly * 12) + bonus
