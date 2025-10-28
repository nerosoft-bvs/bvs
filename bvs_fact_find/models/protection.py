from odoo import models, fields


class FactFindDetails(models.Model):
    _inherit = 'fact.find'

    protection_ids = fields.One2many('protection.details', 'fact_find_id', string='Protection Details')
    existing_protection_cover = fields.Boolean('Do you have any existing protection cover?')
    employer_sick_pay_benefit = fields.Boolean('Do you have any existing employer sick pay benefit?')
    claim_months = fields.Selection([
        ('3', '3 Months'),
        ('6', '6 Months'),
        ('12', '12 Months'),
        ('24', '24 Months'),
        ('60', 'Until Retirement Age'),
    ], 'How many months can you claim?')
    height = fields.Float('Height')
    weight = fields.Float('Weight')
    waist = fields.Float('Waist')
    uk_dress_size = fields.Char('UK Dress Size')
    registered_with_uk_gp_years = fields.Selection([
        ('less_than_two_years', 'Less than two years'),
        ('more_than_two_years', 'More than 2 years'),
    ], 'How long have you been registered with a UK GP?')
    gp_name = fields.Char('GP Name')
    gp_surgery = fields.Char('GP Surgery')
    gp_postcode = fields.Char('GP Postcode')
    gp_address = fields.Text('GP Address')
    street_address = fields.Text('Street Address')
    country_id = fields.Many2one('res.country', 'Country')
    valid_will = fields.Boolean('Valid Will')
    smoking = fields.Selection([
        ('never_smoked', 'No, I have never smoked or used e-cigarettes'),
        ('stopped_smoking', 'I have stopped smoking'),
        ('currently_smoking', 'Yes, I do smoking (on special occasions/ regularly)'),
    ], 'Are you smoking?')
    stop_smoking_date = fields.Selection([
        ('within_one_year', 'Within a year'),
        ('within_12_36_months', 'Within 12 - 36 months'),
        ('before_36_months', 'Before 36 months'),
    ], 'When did you stop smoking?')
    cigarettes_per_day = fields.Char('How many cigarettes are you using?')
    alcohol_consumption_comment = fields.Text('Please comment on your alcohol consumption')
    stop_drinking_date = fields.Selection([
        ('within_one_year', 'Within a year'),
        ('within_12_36_months', 'Within 12 - 36 months'),
        ('before_36_months', 'Before 36 months'),
    ], 'When did you stop drinking?')
    alcohol_consumption_amount = fields.Text('How much are you drinking alcohol?')
    estimated_monthly_protection_budget = fields.Float('Estimated Monthly Protection Budget')
    medical_conditions = fields.Boolean('Do you have any medical conditions?')
    medical_conditions_details = fields.Text('Details please')
    currently_taking_medicines = fields.Boolean('Currently are you taking any medicines?')
    medicines_details = fields.Text('Details please')
    waiting_for_gp_hospital_referral_report = fields.Boolean('Are you waiting for a GP / hospital referral / report?')
    waiting_details = fields.Text('Details please')
    frequency_of_drinking = fields.Selection([
        ('monthly', 'Monthly'),
        ('weekly', 'Weekly'),
        ('daily', 'Daily'),
        ('special_occasion', 'Special Occasion'),
    ], 'Frequency of Drinking')

    type_of_drink = fields.Selection([
        ('beer', 'Beer'),
        ('whisky', 'Whisky'),
        ('wine', 'Wine'),
    ], 'Type of Drink')
    health_condition_ids = fields.One2many(
        'health.condition', 'fact_find_id', string='Health Conditions'
    )
    past_travel_ids = fields.One2many(
        'past.travel', 'fact_find_id', string='Past Foreign Travels'
    )
    future_travel_ids = fields.One2many(
        'future.travel', 'fact_find_id', string='Future Foreign Travels'
    )
    critical_illness_ids = fields.One2many(
        'critical.illness', 'fact_find_id', string='Critical Illness of Relations'
    )


class ProtectionDetails(models.Model):
    _name = 'protection.details'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    existing_protection_cover = fields.Boolean('Do you have any existing protection cover?')
    insurance_provider = fields.Selection([
        ('zurich', 'Zurich'),
        ('aviva', 'Aviva'),
        ('lv', 'LV'),
        ('legal_general', 'Legal & General'),
        ('guardian', 'Guardian'),
        ('vitality', 'Vitality'),
        ('the_exeter', 'The Exeter'),
        ('royal_london', 'Royal London'),
        ('other', 'Other')
    ], string='Insurance Provider')
    monthly_premium = fields.Float('Monthly Premium')
    protection_type = fields.Selection([
        ('life_cover', 'Life Cover Only'),
        ('critical_illness', 'Critical Illness Cover Only'),
        ('life_and_cic', 'Both Life & Critical Illness Cover'),
        ('income_protection', 'Income Protection'),
        ('family_income_benefit', 'Family Income Benefit'),
        ('accident_cover', 'Accident Cover'),
        ('other', 'Other')
    ], 'Protection Type')


class HealthCondition(models.Model):
    _name = 'health.condition'
    _description = 'Health Condition'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    reported = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Any health conditions reported?')
    details = fields.Char(string='Details of the health condition')
    diagnosed_date = fields.Date(string='Diagnosed Date')
    last_review_date = fields.Date(string='Last Review Date')
    last_episode_date = fields.Date(string='Last Episode Date')
    next_review_date = fields.Date(string='Next Review Date')
    waiting_referral = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Waiting for GP/Hospital Referral?')
    medicine_count = fields.Integer(string='Number of Medicines')
    currently_taking_medicine = fields.Selection([
        ('yes', 'Yes'),
        ('no', 'No'),
    ], string='Currently Taking Medicines?')


class PastTravel(models.Model):
    _name = 'past.travel'
    _description = 'Past Foreign Travel'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    country = fields.Many2one('res.country', string='Country')
    travel_from_date = fields.Date(string='Travel From')
    travel_to_date = fields.Date(string='Travel To')


class FutureTravel(models.Model):
    _name = 'future.travel'
    _description = 'Future Foreign Travel'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    country = fields.Many2one('res.country', string='Country')
    travel_from_date = fields.Date(string='Travel From')
    travel_to_date = fields.Date(string='Travel To')


class CriticalIllness(models.Model):
    _name = 'critical.illness'
    _description = 'Critical Illness of Relation'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    relationship = fields.Char(string='Relationship')
    critical_illness = fields.Char(string='Critical Illness')
    age_of_diagnosed = fields.Integer(string='Age of Diagnosed')
