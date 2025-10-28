import logging
import datetime
import base64
from werkzeug.exceptions import Forbidden, NotFound
from odoo import fields, http, SUPERUSER_ID, _
from odoo.http import request
import json
from datetime import datetime

_logger = logging.getLogger(__name__)


class FactFindForm(http.Controller):

    @http.route(['/fact_find/form/<int:fact_find_id>'], type='http', auth='user', website=True)
    def fact_find_form(self, fact_find_id, **kw):
        partner = request.env.user.partner_id
        form_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(fact_find_id)
        if form_id.exists():
            if partner == form_id.lead_id.partner_id or partner == form_id.partner_id:
                values = {
                    'page_name': 'fact_find_form',
                    'fact_find_id': form_id,
                    'customer_type': form_id.lead_id.customer_type,
                    'lead_state': form_id.lead_id.stage_id,
                    'affordability': form_id.stage_id.affordability_kyc,
                    'dip': form_id.stage_id.dip_kyc,
                    'illustration': form_id.stage_id.illustration_kyc,
                    'read_only_kyc': form_id.stage_id.read_only_kyc,
                    'countries': request.env['res.country'].with_user(SUPERUSER_ID).search([]) or False,
                    'protection_countries': request.env['res.country'].with_user(SUPERUSER_ID).search([]) or False,
                }
                return request.render("bvs_fact_find.fact_find_form", values)

        return request.redirect('/my')

    @http.route(['/fact_find/form/submit/<int:fact_find_id>'], type='http', methods=['POST'], auth="user", website=True)
    def fact_find_form_submit(self, fact_find_id, **kw):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            fact_find_form = request.env['fact.find'].with_user(SUPERUSER_ID).browse(fact_find_id)
            if fact_find_form.exists():
                if request.env.user.partner_id == fact_find_form.lead_id.partner_id or request.env.user.partner_id == fact_find_form.partner_id:

                    financial_dependants = False
                    if kw['financial_depend_ids']:
                        data = json.loads(kw['financial_depend_ids'])
                        financial_dependants = [(0, 0, line) for line in data]

                    employment_details = False
                    if kw['employment_details_ids']:
                        data = json.loads(kw['employment_details_ids'])
                        employment_details = [(0, 0, line) for line in data]

                    adverse_credit = False
                    if kw['adverse_credit_ids']:
                        data = json.loads(kw['adverse_credit_ids'])
                        adverse_credit = [(0, 0, line) for line in data]

                    credit_comment = False
                    if kw['credit_comment_ids']:
                        data = json.loads(kw['credit_comment_ids'])
                        credit_comment = [(0, 0, line) for line in data]

                    existing_mortgages = False
                    if kw['existing_mortgages_ids']:
                        data = json.loads(kw['existing_mortgages_ids'])
                        existing_mortgages = [(0, 0, line) for line in data]

                    existing_properties = False
                    if kw['existing_properties_ids']:
                        data = json.loads(kw['existing_properties_ids'])
                        existing_properties = [(0, 0, line) for line in data]

                    properties = False
                    if kw['protection_ids']:
                        data = json.loads(kw['protection_ids'])
                        properties = [(0, 0, line) for line in data]

                    self_employment = False
                    if kw['self_employment_ids']:
                        data = json.loads(kw['self_employment_ids'])
                        self_employment = [(0, 0, line) for line in data]

                    deposit = False
                    if kw['gifted_family_details']:
                        data = json.loads(kw['gifted_family_details'])
                        deposit = [(0, 0, line) for line in data]

                    address = False
                    if kw['address_history_ids']:
                        data = json.loads(kw['address_history_ids'])
                        address = [(0, 0, line) for line in data]

                    ff_forms = request.env['fact.find'].with_user(SUPERUSER_ID).search(
                        [('id', '!=', fact_find_form.id), ('lead_id', '=', fact_find_form.lead_id.id)])
                    for ff_form in ff_forms:
                        ff_form.sudo().write({
                            'address_history_ids': address,
                            'financial_depend_ids': financial_dependants,
                        })

                    fact_find_form.sudo().write({
                        'financial_depend_ids': financial_dependants,
                        'employment_ids': employment_details,
                        'adverse_credit_details': adverse_credit,
                        'credit_comment_ids': credit_comment,
                        'existing_mortgages_ids': existing_mortgages,
                        'property_details_ids': existing_properties,
                        'protection_ids': properties,
                        'self_employment_ids': self_employment,
                        'gifted_family_details': deposit,
                        'address_history_ids': address,

                        'title_customer': values.get('title_customer', False),
                        'first_name': values.get('first_name', False),
                        'middle_names': values.get('middle_names', False),
                        'surname': values.get('surname', False),

                        'partner_id': request.env.user.partner_id.id,
                        'known_by_another_name': values.get('known_by_another_name', False),
                        'previous_name': values.get('previous_name', False),
                        'previous_surname': values.get('previous_surname', False),
                        # 'date_of_name_change': values.get('date_of_name_change', False),
                        # 'date_of_birth': values.get('date_of_birth', False),
                        'country_of_birth': int(values.get('country_of_birth')) if values.get('country_of_birth') else False,
                        'gender': values.get('gender', False),
                        'nationality': values.get('nationality', False),
                        'other_nationality': values.get('other_nationality', False),
                        # 'passport_expiry_date': values.get('passport_expiry_date', False),
                        'dual_nationality': values.get('dual_nationality', False),
                        # 'start_continue_living_in_uk': values.get('start_continue_living_in_uk', False),
                        'indefinite_leave_to_remain': values.get('indefinite_leave_to_remain', False),
                        'settled_status': values.get('settled_status', False),
                        'visa_category': values.get('visa_category', False),
                        'marital_status': values.get('marital_status', False),
                        'email_address': values.get('email_address', False),
                        'mobile_number': values.get('mobile_number', False),
                        'home_telephone_number': values.get('home_telephone_number', False),
                        'credit_comment': values.get('credit_comment', False),
                        'financial_dependants': values.get('financial_dependants', False),
                        'employment_status': values.get('employment_status', False),
                        'number_of_dependents': values.get('number_of_dependents', False),

                        'residential_status': values.get('residential_status', False),
                        'current_landlord_name': values.get('current_landlord_name', False),
                        'current_landlord_address': values.get('current_landlord_address', False),
                        'current_landlord_postcode': values.get('current_landlord_postcode', False),
                        'current_landlord_contact_no': values.get('current_landlord_contact_no', False),
                        'copy_from_partner': values.get('copy_from_partner', False),
                        'local_authority_name': values.get('local_authority_name', False),
                        'local_authority_postcode': values.get('local_authority_postcode', False),
                        'local_authority_address': values.get('local_authority_address', False),
                        'local_authority_type': values.get('local_authority_type', False),
                        'property_usage': values.get('property_usage', False),
                        'is_new_build': values.get('is_new_build', False),
                        'house_flat_no': values.get('house_flat_no', False),
                        'post_code': values.get('post_code', False),
                        'address': values.get('address', False),
                        'building_name': values.get('building_name', False),
                        'street_address': values.get('street_address', False),
                        'county': values.get('county', False),
                        'market_price': values.get('market_price', False),
                        'commute_over_one_hour': values.get('commute_over_one_hour', False),
                        'monthly_commute_cost': values.get('monthly_commute_cost', False),
                        'property_type': values.get('property_type', False),
                        'tenure': values.get('tenure', False),
                        'no_bedrooms': values.get('no_bedrooms', False),
                        'no_bathrooms': values.get('no_bathrooms', False),
                        'kitchen': values.get('kitchen', False),
                        'living_rooms': values.get('living_rooms', False),
                        'garage_space': values.get('garage_space', False),
                        'parking': values.get('parking', False),
                        'no_stories_in_building': values.get('no_stories_in_building', False),
                        'warranty_providers_name': values.get('warranty_providers_name', False),
                        'epc_predicted_epc_rate': values.get('epc_predicted_epc_rate', False),
                        'pea_rate': values.get('pea_rate', False),
                        'ex_council': values.get('ex_council', False),
                        'annual_service_charge': values.get('annual_service_charge', False),
                        'wall_construction_type': values.get('wall_construction_type', False),
                        'roof_construction_type': values.get('roof_construction_type', False),
                        'remaining_lease_term_in_years': values.get('remaining_lease_term_in_years', False),
                        # 'flat_in_floor': values.get('flat_in_floor', False),
                        'flats_same_floor_count': values.get('flats_same_floor_count', False),
                        'above_commercial_property': values.get('above_commercial_property', False),
                        'ground_rent': values.get('ground_rent', False),
                        'shared_ownership': values.get('shared_ownership', False),
                        'ownership_percentage': values.get('ownership_percentage', False),
                        'help_to_buy_loan': values.get('help_to_buy_loan', False),
                        'help_to_buy_loan_type': values.get('help_to_buy_loan_type', False),
                        'estimated_monthly_rental_income': values.get('estimated_monthly_rental_income', False),
                        'current_monthly_rental_income': values.get('current_monthly_rental_income', False),
                        'hmo': values.get('hmo', False),
                        'occupants_count': values.get('occupants_count', False),
                        'company_name': values.get('company_name', False),
                        'company_director': values.get('company_director', False),
                        'additional_borrowing': values.get('additional_borrowing', False),
                        'additional_borrowing_reason': values.get('additional_borrowing_reason', False),
                        'additional_borrowing_amount': values.get('additional_borrowing_amount', False),

                        'property_address': values.get('property_address', False),

                        # expenses
                        'rent': values.get('rent', False),
                        'food': values.get('food', False),
                        'utilities': values.get('utilities', False),
                        'phone_internet': values.get('phone_internet', False),
                        'transport': values.get('transport', False),
                        'clothing': values.get('clothing', False),
                        'medicine': values.get('medicine', False),
                        'personal_goods': values.get('personal_goods', False),
                        'household_goods': values.get('household_goods', False),
                        'entertainment': values.get('entertainment', False),
                        'childcare': values.get('childcare', False),
                        'annual_council_tax': values.get('annual_council_tax', False),
                        'home_insurance': values.get('home_insurance', False),
                        'life_insurance': values.get('life_insurance', False),
                        'car_insurance': values.get('car_insurance', False),
                        'education_fees': values.get('education_fees', False),

                        'borrower_type': values.get('borrower_type', False),
                        'mortgage_type': values.get('mortgage_type', False),
                        'rate': values.get('rate', False),
                        'lender_name': values.get('lender_name', False),
                        'property_value': values.get('property_value', False),
                        'monthly_mortgage_payment': values.get('monthly_mortgage_payment', False),
                        'monthly_rental_btl': values.get('monthly_rental_btl', False),
                        # 'product_end_date': values.get('product_end_date', False),
                        'mortgage_term': values.get('mortgage_term', False),
                        'latest_case_number': values.get('latest_case_number', False),

                        'existing_protection_cover': values.get('existing_protection_cover', False),
                        # 'insurance_provider': values.get('insurance_provider', False),
                        # 'monthly_premium': values.get('monthly_premium', False),
                        # 'protection_type': values.get('protection_type', False),
                        'employer_sick_pay_benefit': values.get('employer_sick_pay_benefit', False),
                        'claim_months': values.get('claim_months', False),
                        'height': values.get('height', False),
                        'weight': values.get('weight', False),
                        'waist': values.get('waist', False),
                        'uk_dress_size': values.get('uk_dress_size', False),
                        'registered_with_uk_gp_years': values.get('registered_with_uk_gp_years', False),
                        'gp_name': values.get('gp_name', False),
                        'gp_surgery': values.get('gp_surgery', False),
                        'gp_postcode': values.get('gp_postcode', False),
                        'gp_address': values.get('gp_address', False),
                        'valid_will': values.get('valid_will', False),
                        'smoking': values.get('smoking', False),
                        # 'stop_smoking_date': values.get('stop_smoking_date', False),
                        # 'cigarettes_per_day': values.get('cigarettes_per_day', False),
                        'alcohol_consumption_comment': values.get('alcohol_consumption_comment', False),
                        # 'stop_drinking_date': values.get('stop_drinking_date', False),
                        'alcohol_consumption_amount': values.get('alcohol_consumption_amount', False),
                        'estimated_monthly_protection_budget': values.get('estimated_monthly_protection_budget', False),
                        'medical_conditions': values.get('medical_conditions', False),
                        'medical_conditions_details': values.get('medical_conditions_details', False),
                        'currently_taking_medicines': values.get('currently_taking_medicines', False),
                        'medicines_details': values.get('medicines_details', False),
                        'waiting_for_gp_hospital_referral_report': values.get('waiting_for_gp_hospital_referral_report', False),
                        'waiting_details': values.get('waiting_details', False),

                        'ccj_against_you': values.get('ccj_against_you', False),
                        'arrangements_with_creditors': values.get('arrangements_with_creditors', False),
                        'debt_management_plan': values.get('debt_management_plan', False),
                        'default_registered': values.get('default_registered', False),
                        'failed_to_keep_up_repayments': values.get('failed_to_keep_up_repayments', False),
                        'bankruptcy': values.get('bankruptcy', False),
                        'deposit_from_savings': values.get('deposit_from_savings', False),
                        'gifted_deposit_from_friend': values.get('gifted_deposit_from_friend', False),
                        'gifted_deposit_from_family': values.get('gifted_deposit_from_family', False),
                        'deposit_from_another_loan': values.get('deposit_from_another_loan', False),
                        'deposit_from_equity_of_property': values.get('deposit_from_equity_of_property', False),
                        'loan_amount_from_director': values.get('loan_amount_from_director', False),
                        'gifted_deposit_amount_from_director': values.get('gifted_deposit_amount_from_director', False),
                        'total_deposit_amount': values.get('total_deposit_amount', False),
                        'solicitor_id': values.get('solicitor_id', False),
                    })

                    fact_find_form.lead_id.send_kyc_notification()

                    return request.redirect('/fact_find/form/done')
                else:
                    return request.redirect('/fact_find/form')
            else:
                return request.redirect('/fact_find/form')

    @http.route('/fact_find/form/done', type='http', auth='user', website=True)
    def application_form_submit(self, **kwargs):
        return request.render("bvs_portal.application_form_submit_success")

    @http.route('/fact_find/document/submit/<int:fact_find_id>', type='http', auth="user", website=True)
    def fact_find_form_document_submit(self, fact_find_id, **kw):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            fact_find_form = request.env['fact.find'].with_user(SUPERUSER_ID).browse(fact_find_id)
            if fact_find_form.exists() and (
                 request.env.user.partner_id in [fact_find_form.lead_id.partner_id, fact_find_form.partner_id]):
                alteration_passport_documents = request.httprequest.files.getlist('alteration_passport')
                for alteration_passport in alteration_passport_documents:
                    attachment_values = {
                        'name': alteration_passport.filename,
                        'datas': base64.b64encode(alteration_passport.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'alteration_passport': [(4, attachment.id)]})

                passport_pages = request.httprequest.files.getlist('passport_pages')
                for passport_page in passport_pages:
                    attachment_values = {
                        'name': passport_page.filename,
                        'datas': base64.b64encode(passport_page.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'passport_pages': [(4, attachment.id)]})

                expired_passport_driving_license = request.httprequest.files.getlist('expired_passport_driving_license')
                for expired_passport_document in expired_passport_driving_license:
                    attachment_values = {
                        'name': expired_passport_document.filename,
                        'datas': base64.b64encode(expired_passport_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'expired_passport_driving_license': [(4, attachment.id)]})

                brp_visa_stamp = request.httprequest.files.getlist('brp_visa_stamp')
                for brp_visa_stamp_document in brp_visa_stamp:
                    attachment_values = {
                        'name': brp_visa_stamp_document.filename,
                        'datas': base64.b64encode(brp_visa_stamp_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'brp_visa_stamp': [(4, attachment.id)]})

                utility_bill_past_3_months = request.httprequest.files.getlist('utility_bill_past_3_months')
                for utility_bill_past_3_months_document in utility_bill_past_3_months:
                    attachment_values = {
                        'name': utility_bill_past_3_months_document.filename,
                        'datas': base64.b64encode(utility_bill_past_3_months_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'utility_bill_past_3_months': [(4, attachment.id)]})

                postal_document_past_3_months = request.httprequest.files.getlist('postal_document_past_3_months')
                for document in postal_document_past_3_months:
                    attachment_values = {
                        'name': document.filename,
                        'datas': base64.b64encode(document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'postal_document_past_3_months': [(4, attachment.id)]})

                proof_of_address_driving_license = request.httprequest.files.getlist('proof_of_address_driving_license')
                for proof_of_address_driving_license_document in proof_of_address_driving_license:
                    attachment_values = {
                        'name': proof_of_address_driving_license_document.filename,
                        'datas': base64.b64encode(proof_of_address_driving_license_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'proof_of_address_driving_license': [(4, attachment.id)]})

                employment_appointment_letter = request.httprequest.files.getlist('employment_appointment_letter')
                for employment_appointment_letter_document in employment_appointment_letter:
                    attachment_values = {
                        'name': employment_appointment_letter_document.filename,
                        'datas': base64.b64encode(employment_appointment_letter_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'employment_appointment_letter': [(4, attachment.id)]})

                last_2_years_tax_returns = request.httprequest.files.getlist('last_2_years_tax_returns')
                for last_2_years_tax_returns_document in last_2_years_tax_returns:
                    attachment_values = {
                        'name': last_2_years_tax_returns_document.filename,
                        'datas': base64.b64encode(last_2_years_tax_returns_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'last_2_years_tax_returns': [(4, attachment.id)]})

                latest_3_months_company_bank_statements = request.httprequest.files.getlist(
                    'latest_3_months_company_bank_statements')
                for latest_3_months_company_bank_statements_document in latest_3_months_company_bank_statements:
                    attachment_values = {
                        'name': latest_3_months_company_bank_statements_document.filename,
                        'datas': base64.b64encode(latest_3_months_company_bank_statements_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write({'latest_3_months_company_bank_statements': [(4, attachment.id)]})

                signed_finalized_latest_2_years_company_accounts = request.httprequest.files.getlist(
                    'signed_finalized_latest_2_years_company_accounts')
                for signed_finalized_latest_2_years_company_accounts_document in signed_finalized_latest_2_years_company_accounts:
                    attachment_values = {
                        'name': signed_finalized_latest_2_years_company_accounts_document.filename,
                        'datas': base64.b64encode(signed_finalized_latest_2_years_company_accounts_document.read()),
                        'res_model': 'fact.find',
                        'res_id': fact_find_form.id,
                        'public': False,
                    }
                    attachment = request.env['ir.attachment'].sudo().create(attachment_values)
                    fact_find_form.sudo().write(
                        {'signed_finalized_latest_2_years_company_accounts': [(4, attachment.id)]})

                if fact_find_form.lead_id.team_leader:
                    fact_find_form.lead_id.send_kyc_document_notification()

                return request.redirect('/fact_find/form/done')


