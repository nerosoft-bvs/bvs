from odoo import api, models, fields, _
from odoo.exceptions import UserError, ValidationError
from odoo.tools import email_normalize


class FactFind(models.Model):
    _inherit = 'fact.find'

    residential_status = fields.Selection([
        ('renting_private', 'Renting Private'),
        ('living_with_family', 'Living with Family'),
        ('living_with_friends', 'Living with Friends'),
        ('owner_with_mortgage', 'Owner with Mortgage'),
        ('owner_without_mortgage', 'Owner without Mortgage'),
        ('renting_local_authority', 'Renting from Local Authority'),
    ], string='Residential Status')
    current_landlord_name = fields.Char(string='Current Landlord Name')
    current_landlord_address = fields.Text(string='Current Landlord Address')
    current_landlord_postcode = fields.Char(string='Current Landlord Postcode')
    current_landlord_contact_no = fields.Char(string='Current Landlord Contact No')
    local_authority_name = fields.Char(string='Local Authority Name')
    local_authority_postcode = fields.Char(string='Local Authority Postcode')
    local_authority_address = fields.Text(string='Local Authority Address')


    # current_landlord_name = fields.Char(string='Current Landlord Name')
    # current_landlord_address = fields.Text(string='Current Landlord Address')
    # current_landlord_postcode = fields.Char(string='Current Landlord Postcode')
    # current_landlord_contact_no = fields.Char(string='Current Landlord Contact No')
    # copy_from_partner = fields.Boolean(string='Copy from Partner when Joint Application')
    #
    # local_authority_name = fields.Char(string='Local Authority Name')
    # local_authority_postcode = fields.Char(string='Local Authority Postcode')
    # local_authority_address = fields.Text(string='Local Authority Address')
    #
    # local_authority_type = fields.Selection([
    #     ('renting_private', 'Renting Private'),
    #     ('living_with_family', 'Living with Family'),
    #     ('living_with_friends', 'Living with Friends'),
    #     ('owner_with_mortgage', 'Owner with Mortgage'),
    #     ('owner_without_mortgage', 'Owner without Mortgage'),
    #     ('renting_local_authority', 'Renting from Local Authority'),
    # ], string='Local Authority Type')

    address_history_ids = fields.One2many('address.history', 'fact_find_id', 'Address History')


class AddressHistory(models.Model):
    _name = 'address.history'

    fact_find_id = fields.Many2one('fact.find', string='Personal Information')
    residential_status = fields.Selection([
        ('renting_private', 'Renting Private'),
        ('living_with_family', 'Living with Family'),
        ('living_with_friends', 'Living with Friends'),
        ('owner_with_mortgage', 'Owner with Mortgage'),
        ('owner_without_mortgage', 'Owner without Mortgage'),
        ('renting_local_authority', 'Renting from Local Authority'),
    ], string='Residential Status')
    house_number = fields.Char(string='House Number')
    flat_number = fields.Char(string='Flat Number')
    building_number = fields.Char(string='Building  Name')
    county = fields.Char(string='County')
    town = fields.Char(string='Town ')
    post_code = fields.Char(string='Post Code')
    address = fields.Text(string='Street Address')
    country = fields.Many2one('res.country', string='Country')
    date_moved_in = fields.Date(string='Date Moved In')
    date_moved_out = fields.Date(string='Date Moved Out')
    is_current_address = fields.Boolean('Is Current Address')
    current_landlord_name = fields.Char(string='Current Landlord Name')
    current_landlord_address = fields.Text(string='Current Landlord Address')
    current_landlord_postcode = fields.Char(string='Current Landlord Postcode')
    current_landlord_contact_no = fields.Char(string='Current Landlord Contact No')
    copy_from_partner = fields.Boolean(string='Copy from Partner when Joint Application')

    local_authority_name = fields.Char(string='Local Authority Name')
    local_authority_postcode = fields.Char(string='Local Authority Postcode')
    local_authority_address = fields.Text(string='Local Authority Address')

    local_authority_type = fields.Selection([
        ('renting_private', 'Renting Private'),
        ('living_with_family', 'Living with Family'),
        ('living_with_friends', 'Living with Friends'),
        ('owner_with_mortgage', 'Owner with Mortgage'),
        ('owner_without_mortgage', 'Owner without Mortgage'),
        ('renting_local_authority', 'Renting from Local Authority'),
    ], string='Local Authority Type')

