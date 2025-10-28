from odoo import api, fields, models
from odoo.exceptions import UserError


class FactFindPartnerWizard(models.TransientModel):
    _name = 'fact.find.partner.wizard'
    _description = 'Fact Find Partner Wizard'

    lead_id = fields.Many2one('bvs.lead', string='Lead', required=True)
    partner_id = fields.Many2one('res.partner', string='Partner', required=True)
    fact_find_id = fields.Many2one('fact.find', string='Fact Find', required=True)

    @api.model
    def default_get(self, fields_list):
        res = super().default_get(fields_list)
        # Auto-fill partner_id options if needed
        lead = res.get('lead_id')
        if lead:
            lead_rec = self.env['bvs.lead'].browse(lead)
            # Collect main partner and all applicants
            partners = [lead_rec.partner_id.id] + lead_rec.applicant_ids.ids
            res['partner_id'] = partners[0] if partners else False
        return res

    @api.onchange('lead_id')
    def _onchange_lead_id(self):
        """Update partner_id domain when lead changes."""
        if self.lead_id:
            # Domain to show only main partner and applicants
            partner_ids = [self.lead_id.partner_id.id] + self.lead_id.applicant_ids.ids
            return {'domain': {'partner_id': [('id', 'in', partner_ids)]}}
        return {'domain': {'partner_id': []}}

    @api.onchange('partner_id')
    def _onchange_partner_id(self):
        """Update fact_find domain when partner changes."""
        if self.lead_id and self.partner_id:
            fact_find_ids = self.env['fact.find'].search([('partner_id','=', self.partner_id.id)])
            return {'domain': {'fact_find_id': [('id', 'in', fact_find_ids)]}}
        return {'domain': {'fact_find_id': []}}

    def action_load_fact_find(self):
        """Load fact find data from the selected partner's most recent fact find."""
        self.ensure_one()

        if not self.partner_id:
            raise UserError("Please select a partner.")

        # Find the most recent fact find linked to this partner
        fact_find = self.env['fact.find'].search(
            [('partner_id', '=', self.partner_id.id)],
            order='create_date desc', limit=1
        )

        if not fact_find:
            raise UserError("No fact find found for this partner.")

        # Copy only the required fields to a new fact find linked to this wizard's lead
        values = {
            'lead_id': self.lead_id.id,  # Link to the current lead
            'partner_id': self.partner_id.id,  # Link to the selected partner
            'first_name': fact_find.first_name,
            'surname': fact_find.surname,
            'email_address': fact_find.email_address,
            'mobile_number': fact_find.mobile_number,
            'address_history_ids': [(6, 0, fact_find.address_history_ids.ids)],
            'adverse_credit_details': fact_find.adverse_credit_details,
            'alcohol_consumption_amount': fact_find.alcohol_consumption_amount,
            'alcohol_consumption_comment': fact_find.alcohol_consumption_comment,
            'alteration_passport': fact_find.alteration_passport,
            'annual_council_tax': fact_find.annual_council_tax,
            'annual_income': fact_find.annual_income,
            'annual_payment_information_letter': fact_find.annual_payment_information_letter,
            'annual_retirement_income': fact_find.annual_retirement_income,
            'arla_letter': fact_find.arla_letter,
            'arrangements_with_creditors': fact_find.arrangements_with_creditors,
            'arrears_with_mortgage_or_loans': fact_find.arrears_with_mortgage_or_loans,
            'bank_account_ids': [(6, 0, fact_find.bank_account_ids.ids)],
            'bank_statement': fact_find.bank_statement,
            'bank_statement_name_confirmation': fact_find.bank_statement_name_confirmation,
            'bankruptcy': fact_find.bankruptcy,
            'borrower_type': fact_find.borrower_type,
            'brp_visa_stamp': fact_find.brp_visa_stamp,
            'car_insurance': fact_find.car_insurance,
            'case_history_ids': [(6, 0, fact_find.case_history_ids.ids)],
            'ccj_against_you': fact_find.ccj_against_you,
            'child_tax_credit_award_letter': fact_find.child_tax_credit_award_letter,
            'childcare': fact_find.childcare,
            'cigarettes_per_day': fact_find.cigarettes_per_day,
            'claim_months': fact_find.claim_months,
            'clothing': fact_find.clothing,
            'cml_form': fact_find.cml_form,
            'commute_over_one_hour': fact_find.commute_over_one_hour,
            'company_name': fact_find.company_name,
            'contactable_person': fact_find.contactable_person,
            'contactable_person_mobile': fact_find.contactable_person_mobile,
            'country_id': fact_find.country_id.id if fact_find.country_id else False,
            'country_of_birth': fact_find.country_of_birth.id if fact_find.country_of_birth else False,
            'credit_card_bill': fact_find.credit_card_bill,
            'credit_comment': fact_find.credit_comment,
            'credit_comment_ids': [(6, 0, fact_find.credit_comment_ids.ids)],
            'critical_illness_ids': [(6, 0, fact_find.critical_illness_ids.ids)],
            'current_monthly_rental_income': fact_find.current_monthly_rental_income,
            'currently_taking_medicines': fact_find.currently_taking_medicines,
            'customer_type': fact_find.customer_type,
            'date_of_birth': fact_find.date_of_birth,
            'date_of_name_change': fact_find.date_of_name_change,
            'debt_management_plan': fact_find.debt_management_plan,
            'default_registered': fact_find.default_registered,
            'dependant_status': fact_find.dependant_status,
            'deposit_from_another_loan': fact_find.deposit_from_another_loan,
            'deposit_from_equity_of_property': fact_find.deposit_from_equity_of_property,
            'deposit_from_savings': fact_find.deposit_from_savings,
            'direct_debit_account_bank_statements': fact_find.direct_debit_account_bank_statements,
            'display_name': fact_find.display_name,
            'driving_license': fact_find.driving_license,
            'driving_license_proof_address': fact_find.driving_license_proof_address,
            'dual_nationality': fact_find.dual_nationality,
            'dual_nationality_id': fact_find.dual_nationality_id.id if fact_find.dual_nationality_id else False,
            'education_fees': fact_find.education_fees,
            'electricity_bill': fact_find.electricity_bill,
            'email': fact_find.email,
            'employer_sick_pay_benefit': fact_find.employer_sick_pay_benefit,
            'employment_appointment_letter': fact_find.employment_appointment_letter,
            'employment_contract': fact_find.employment_contract,
            'employment_ids': [(6, 0, fact_find.employment_ids.ids)],
            'employment_status': fact_find.employment_status,
            'entertainment': fact_find.entertainment,
            'epc': fact_find.epc,
            'estimated_built_year': fact_find.estimated_built_year,
            'estimated_monthly_protection_budget': fact_find.estimated_monthly_protection_budget,
            'estimated_monthly_rental_income': fact_find.estimated_monthly_rental_income,
            'eu_country_list': fact_find.eu_country_list,
            'existing_mortgages_ids': [(6, 0, fact_find.existing_mortgages_ids.ids)],
            'existing_protection_cover': fact_find.existing_protection_cover,
            'expired_passport_driving_license': fact_find.expired_passport_driving_license,
            'failed_to_keep_up_repayments': fact_find.failed_to_keep_up_repayments,
            'financial_depend_ids': [(6, 0, fact_find.financial_depend_ids.ids)],
            'financial_dependants': fact_find.financial_dependants,
            'firm_email': fact_find.firm_email,
            'firm_name': fact_find.firm_name,
            'flat_in_floor': fact_find.flat_in_floor,
            'flats_same_floor_count': fact_find.flats_same_floor_count,
            'food': fact_find.food,
            'frequency_of_drinking': fact_find.frequency_of_drinking,
            'future_travel_ids': [(6, 0, fact_find.future_travel_ids.ids)],
            'gas_bill': fact_find.gas_bill,
            'gender': fact_find.gender,
            'gifted_deposit_amount_from_director': fact_find.gifted_deposit_amount_from_director,
            'gifted_deposit_bank_statements': fact_find.gifted_deposit_bank_statements,
            'gifted_deposit_format': fact_find.gifted_deposit_format,
            'gifted_deposit_from_family': fact_find.gifted_deposit_from_family,
            'gifted_deposit_from_friend': fact_find.gifted_deposit_from_friend,
            'gifted_family_details': fact_find.gifted_family_details,
            'gp_address': fact_find.gp_address,
            'gp_name': fact_find.gp_name,
            'gp_postcode': fact_find.gp_postcode,
            'gp_surgery': fact_find.gp_surgery,
            'gross_monthly_retirement_income': fact_find.gross_monthly_retirement_income,
            'health_condition_ids': [(6, 0, fact_find.health_condition_ids.ids)],
            'height': fact_find.height,
            'home_insurance': fact_find.home_insurance,
            'home_telephone_number': fact_find.home_telephone_number,
            'house_number_solicitor': fact_find.house_number_solicitor,
            'household_goods': fact_find.household_goods,
            'htb_location': fact_find.htb_location,
            'htb_scheme_available': fact_find.htb_scheme_available,
            'immigration_status_sharecode': fact_find.immigration_status_sharecode,
            'income_type': fact_find.income_type,
            'indefinite_leave_to_remain': fact_find.indefinite_leave_to_remain,
            'is_new_build': fact_find.is_new_build,
            'is_private_lead': fact_find.is_private_lead,
            'known_by_another_name': fact_find.known_by_another_name,
            'land_phone_bill': fact_find.land_phone_bill,
            # (… continue your list safely with relational field handling)
        }
        self.env['fact.find'].create(values)

        return {'type': 'ir.actions.act_window_close'}
