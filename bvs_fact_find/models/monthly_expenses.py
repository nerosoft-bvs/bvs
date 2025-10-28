from odoo import models, fields, api


class MonthlyExpenses(models.Model):
    _inherit = 'fact.find'

    rent = fields.Float('Rent (Main Residence or Second Property)')
    food = fields.Float('Food')
    utilities = fields.Float('Utilities (Gas, Electricity, Water)')
    phone_internet = fields.Float('Phone & Internet')
    transport = fields.Float('Transport')
    clothing = fields.Float('Clothing')
    medicine = fields.Float('Medicine')
    personal_goods = fields.Float('Personal Goods')
    household_goods = fields.Float('Household Goods')
    entertainment = fields.Float('Entertainment')
    childcare = fields.Float('Childcare')
    annual_council_tax = fields.Float('Annual Council Tax')
    home_insurance = fields.Float('Home Insurance')
    life_insurance = fields.Float('Life Insurance')
    car_insurance = fields.Float('Car Insurance')
    ground_rent = fields.Float('Ground Rent')
    service_charge = fields.Float('Child Care')
    education_fees = fields.Float('Education Fees')
    services_charge = fields.Float('Service Charges')
    total_monthly_expenses = fields.Float(
        'Total Monthly Expenses',
        compute='_compute_total_monthly_expenses',
        store=True,
        readonly=True
    )

    @api.depends(
        'rent', 'food', 'utilities', 'phone_internet', 'transport', 'clothing',
        'medicine', 'personal_goods', 'household_goods', 'entertainment',
        'childcare', 'annual_council_tax', 'home_insurance', 'life_insurance',
        'car_insurance', 'ground_rent', 'service_charge', 'education_fees'
    )
    def _compute_total_monthly_expenses(self):
        """
        Compute the total monthly expenses by summing all expense fields.
        Annual council tax is divided by 12 to get monthly amount.
        """
        for record in self:
            # Convert annual council tax to monthly
            monthly_council_tax = (record.annual_council_tax or 0) / 12

            # Sum all monthly expenses
            record.total_monthly_expenses = (
                    (record.rent or 0) +
                    (record.food or 0) +
                    (record.utilities or 0) +
                    (record.phone_internet or 0) +
                    (record.transport or 0) +
                    (record.clothing or 0) +
                    (record.medicine or 0) +
                    (record.personal_goods or 0) +
                    (record.household_goods or 0) +
                    (record.entertainment or 0) +
                    (record.childcare or 0) +
                    monthly_council_tax +
                    (record.home_insurance or 0) +
                    (record.life_insurance or 0) +
                    (record.car_insurance or 0) +
                    (record.ground_rent or 0) +
                    (record.service_charge or 0) +
                    (record.education_fees or 0)
            )