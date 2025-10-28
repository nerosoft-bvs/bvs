from odoo import models, fields, api


class PropertyDetails(models.Model):
    _inherit = 'fact.find'

    property_address = fields.Text('Property Address')
    post_code = fields.Char('Post Code')
    borrower_type = fields.Selection([
        ('individual', 'Individual'),
        ('joint', 'Joint'),
    ], 'Borrower Type')
    mortgage_type = fields.Selection([
        ('residential', 'Residential'),
        ('buy_to_let', 'Buy to Let'),
        ('commercial', 'Commercial'),
        ('other', 'Other'),
    ], 'Mortgage Type')
    rate = fields.Char('Rate')
    lender_name = fields.Char('Lender Name')
    property_value = fields.Float('Property Value')
    outstanding_amount = fields.Float('Outstanding Amount')
    monthly_mortgage_payment = fields.Float('Monthly Mortgage Payment')
    monthly_rental_btl = fields.Float('Monthly Rental if BTL')
    product_end_date = fields.Date('Product End Date')
    mortgage_term = fields.Integer('Mortgage Term')
    latest_case_number = fields.Char('Latest Case No of the Property')
    case_history_ids = fields.One2many('property.case.history',
        'property_id',
        string='Case History'
    )

    total_property_value = fields.Float(
        string="Total Property Value", compute="_compute_case_history_totals", store=True
    )
    total_outstanding_amount = fields.Float(
        string="Total Outstanding Amount", compute="_compute_case_history_totals", store=True
    )
    total_monthly_mortgage_payment = fields.Float(
        string="Total Monthly Mortgage Payment", compute="_compute_case_history_totals", store=True
    )
    total_monthly_rental_btl = fields.Float(
        string="Total Monthly Rental (BTL)", compute="_compute_case_history_totals", store=True
    )

    @api.depends('case_history_ids.property_value', 'case_history_ids.outstanding_amount',
                 'case_history_ids.monthly_mortgage_payment', 'case_history_ids.monthly_rental_btl')
    def _compute_case_history_totals(self):
        for record in self:
            record.total_property_value = sum(record.case_history_ids.mapped('property_value') or [0])
            record.total_outstanding_amount = sum(record.case_history_ids.mapped('outstanding_amount') or [0])
            record.total_monthly_mortgage_payment = sum(
                record.case_history_ids.mapped('monthly_mortgage_payment') or [0])
            record.total_monthly_rental_btl = sum(record.case_history_ids.mapped('monthly_rental_btl') or [0])


# Updated Property Case History Model
class PropertyCaseHistory(models.Model):
    _name = 'property.case.history'
    _description = 'Property Case History'

    property_id = fields.Many2one('fact.find', string='Property')
    property_details_id = fields.Many2one('property.details',
                                          string='Property Details')
    existing_mortgage_id = fields.Many2one('existing.mortgages',
                                           string='Existing Mortgage')
    property_address = fields.Text('Property Address')
    post_code = fields.Char('Post Code')

    borrower_type = fields.Selection([
        ('individual', 'Individual'),
        ('joint', 'Joint'),
    ], 'Borrower Type')

    mortsgage_type = fields.Selection([
        ('residential', 'Residential'),
        ('buy_to_let', 'Buy to Let'),
        ('commercial', 'Commercial'),
        ('other', 'Other'),
    ], 'Mortgage Type')
    rate = fields.Char('Rate')
    lender_name = fields.Char('Lender Name')
    property_value = fields.Float('Property Value')
    outstanding_amount = fields.Float('Outstanding Amount')
    monthly_mortgage_payment = fields.Float('Monthly Mortgage Payment')
    monthly_rental_btl = fields.Float('Monthly Rental if BTL')
    product_end_date = fields.Date('Product End Date')
    mortgage_term = fields.Integer('Mortgage Term')
    latest_case_number = fields.Char('Latest Case No of the Property')

    @api.model
    def create(self, vals):
        """Override create to automatically populate fields from linked records"""
        record = super(PropertyCaseHistory, self).create(vals)
        record._populate_from_linked_records()
        return record

    def write(self, vals):
        """Override write to automatically populate fields from linked records"""
        result = super(PropertyCaseHistory, self).write(vals)
        if 'property_details_id' in vals or 'existing_mortgage_id' in vals:
            for record in self:
                record._populate_from_linked_records()
        return result

    def _populate_from_linked_records(self):
        """Populate fields from linked property details and mortgage records"""
        updates = {}

        # Populate from property details if linked
        if self.property_details_id:
            prop = self.property_details_id

            # Build address
            address_parts = []
            if prop.house_number:
                address_parts.append(prop.house_number)
            if prop.street_address:
                address_parts.append(prop.street_address)
            if prop.county:
                address_parts.append(prop.county)

            updates.update({
                'property_address': ', '.join(filter(None, address_parts)),
                'post_code': prop.postcode or '',
                'property_value': prop.current_property_valuation or 0,
                'monthly_rental_btl': prop.monthly_rental_income or 0,
            })

            # Determine mortgage type from property usage
            mortgage_type_mapping = {
                'residential': 'residential',
                'second_residential': 'residential',
                'btl': 'buy_to_let',
                'company_btl': 'buy_to_let',
                'commercial': 'commercial'
            }
            if prop.property_usage:
                updates['mortsgage_type'] = mortgage_type_mapping.get(prop.property_usage, 'residential')

        # Populate from mortgage if linked
        if self.existing_mortgage_id:
            mortgage = self.existing_mortgage_id

            # Determine borrower type
            borrower_type = 'individual'
            if mortgage.ownership_of_deed and 'joint' in mortgage.ownership_of_deed.lower():
                borrower_type = 'joint'

            updates.update({
                'borrower_type': borrower_type,
                'rate': str(mortgage.current_rate) if mortgage.current_rate else '',
                'lender_name': mortgage.lender or '',
                'outstanding_amount': mortgage.outstanding_mortgage_amount or 0,
                'monthly_mortgage_payment': mortgage.monthly_payment or 0,
                'product_end_date': mortgage.remortgage_date if mortgage.remortgage_date else False,
                'mortgage_term': int(
                    mortgage.remaining_term) if mortgage.remaining_term and mortgage.remaining_term.isdigit() else 0,
                'latest_case_number': mortgage.mortgage_case_number or '',
            })

            # If no property address from property details, use mortgage address
            if not updates.get('property_address') and mortgage.property_address:
                updates['property_address'] = mortgage.property_address

        # Apply updates if any
        if updates:
            super(PropertyCaseHistory, self).write(updates)