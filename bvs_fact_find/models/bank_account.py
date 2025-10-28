from odoo import models, fields


class FactFindBankAccount(models.Model):
    _inherit = 'fact.find'

    bank_account_ids = fields.One2many('bank.account', 'fact_find_id', string='Bank  Accounts')

class BankAccounts(models.Model):
    _name = 'bank.account'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    account_type = fields.Selection([
        ('current', 'Current'),
        ('savings', 'Savings'),
    ], 'Account Type')
    sort_code = fields.Char('Sort Code')
    bank_name_address = fields.Text('Bank Name & Address')
    account_no = fields.Char('Account No')
    account_holder_name = fields.Char("Account Holder's Name")
    account_open_date_new = fields.Char("Account Open Date")
    account_open_date = fields.Date('Account Open Date')
    direct_debit_for_mortgage = fields.Boolean('Direct Debit for Mortgage Payment')
    preferred_dd_date = fields.Selection([
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('4', '4'),
        ('5', '5'),
        ('6', '6'),
        ('7', '7'),
        ('8', '8'),
        ('9', '9'),
        ('10', '10'),
        ('11', '11'),
        ('12', '12'),
        ('13', '13'),
        ('14', '14'),
        ('15', '15'),
        ('16', '16'),
        ('17', '17'),
        ('18', '18'),
        ('19', '19'),
        ('20', '20'),
        ('21', '21'),
        ('22', '22'),
        ('23', '23'),
        ('24', '24'),
        ('25', '25'),
        ('26', '26'),
        ('27', '27'),
        ('28', '28'),

    ], 'Preferred Date for Direct Debit')
    additional_information = fields.Char('Additional Information')
    bank_name = fields.Selection([
        ('barclays', 'Barclays'),
        ('santander', 'Santander'),
        ('halifax', 'Halifax'),
        ('lloyds', 'Lloyds'),
        ('natwest', 'NatWest'),
        ('nationwide', 'Nationwide'),
        ('hsbc', 'HSBC'),
        ('tsb', 'TSB'),
        ('royal-bank-of-scotland', 'Royal Bank Of Scotland'),
        ('the-co-operative', 'The Co-operative'),
        ('monzo', 'Monzo'),
        ('other', 'Other'),
    ], string='Bank Name', required=True)


