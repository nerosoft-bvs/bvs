from odoo import api, fields, models
from odoo.exceptions import UserError

class FactFindPartnerWizard(models.TransientModel):
    _name = 'fact.find.partner.wizard'
    _description = 'Fact Find Partner Wizard'

    lead_id = fields.Many2one('bvs.lead', string='Lead', required=True)
    partner_id = fields.Many2one('res.partner', string='Partner', required=True)
    # ff_id = fields.Many2one('fact.find', string='Fact Find')

    @api.model
    def default_get(self, fields_list):
        res = super().default_get(fields_list)
        # Fetch from context instead of res
        lead_id = self.env.context.get('default_lead_id') or self.env.context.get('active_id')
        if lead_id:
            lead = self.env['bvs.lead'].browse(lead_id)
            res['lead_id'] = lead.id
            # Pre-fill partner choices (main partner + applicants)
            partners = [lead.partner_id.id] + lead.applicant_ids.ids
            if partners:
                res['partner_id'] = partners[0]
        return res

    @api.onchange('lead_id')
    def _onchange_lead_id(self):
        """Update partner_id domain when lead changes."""
        if self.lead_id:
            partner_ids = [self.lead_id.partner_id.id] + self.lead_id.applicant_ids.ids
            return {'domain': {'partner_id': [('id', 'in', partner_ids)]}}
        return {'domain': {'partner_id': []}}


    #
    # @api.onchange('partner_id')
    # def _onchange_partner_id(self):
    #     """Update fact_find domain when partner changes."""
    #     if self.partner_id:
    #         fact_find_ids = self.env['fact.find'].search([('partner_id', '=', self.partner_id.id)]).ids
    #         return {'domain': {'fact_find_id': [('id', 'in', fact_find_ids)]}}
    #     return {'domain': {'fact_find_id': []}}

    def action_load_fact_find(self):
        """Load fact find data from the selected partner."""
        self.ensure_one()

        if not self.partner_id:
            raise UserError("Please select a partner.")

        # Find the target fact find to update (for this partner on this lead)
        target_ff = self.lead_id.fact_find_ids.filtered(lambda ff: ff.partner_id == self.partner_id)[:1]

        if target_ff:
            # Delete the existing fact find and create a new one with copied data
           target_ff.unlink()

        # Get the source fact find to copy from (use ff_id if available, otherwise search)
        source_fact_find = self.env['fact.find'].search(
            [('partner_id', '=', self.partner_id.id)],
            order='create_date desc',
            limit=1
        )


        # source_fact_find = self.ff_id if self.ff_id else self.env['fact.find'].search(
        #     [('partner_id', '=', self.partner_id.id)],
        #     order='create_date desc',
        #     limit=1
        # )

        if not source_fact_find:
            raise UserError("No fact find found for this partner.")

        # Exclude property-related fields by setting them to False
        source_fact_find.copy(default={
            'lead_id': self.lead_id.id,
            'partner_id': self.partner_id.id,
            # Property-related fields to exclude from copy
            'wall_construction_type': False,
            'warranty_providers_name': False,
            'tenure': False,
            'street_address': False,
            'shared_ownership': False,
            'shared_ownership_available': False,
            'shared_ownership_existing': False,
            'roof_construction_type': False,
            'property_type': False,
            'property_usage': False,
            'post_code': False,
            'parking': False,
            'ownership_percentage': False,
            'no_bathrooms': False,
            'no_bedrooms': False,
            'no_stories_in_building': False,
            'occupants_count': False,
            'market_price': False,
            'living_rooms': False,
            'kitchen': False,
            'house_flat_no': False,
            'help_to_buy_loan': False,
            'help_to_buy_loan_type': False,
            'hmo': False,
            'ground_rent': False,
            'garage_space': False,
            'flats_in_floor': False,
            'ex_council': False,
            'epc_predicted_epc_rate': False,
            'county': False,
            'company_director': False,
            'building_name': False,
            'above_commercial_property': False,
            'additional_borrowing': False,
            'additional_borrowing_amount': False,
            'additional_borrowing_reason': False,
            'address': False,
        })



        return {'type': 'ir.actions.act_window_close'}

