import logging
import datetime
import base64
from odoo import http, SUPERUSER_ID, _, Command
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)

class PersonalDetails(http.Controller):


    @http.route('/ff/update/applicant/addresses', methods=['POST'], type='json', auth='public')
    def ff_update_fact_find_address(self, fact_find_id, **kwargs):
        """
        @public - Copy address data from the partner
        """
        # Fetch the fact find record and related lead
        fact_find = request.env['fact.find'].sudo().browse(fact_find_id)
        lead_id = fact_find.lead_id

        # Fetch all related fact_find records and their address histories
        fact_find_ids = lead_id.mapped('fact_find_ids')
        all_address_history_ids = fact_find_ids.mapped('address_history_ids')

        for fact_find in fact_find_ids:
            # Filter address histories not present in the current fact_find's address_history_ids
            new_address_histories = all_address_history_ids.filtered(
                lambda address: address.id not in fact_find.address_history_ids.ids
            )

            # Prepare data for the new address entries
            address_history_data = [{
                'residential_status': address.residential_status,
                'building_number': address.building_number,
                'house_number': address.house_number,
                'address': address.address,
                'post_code': address.post_code,
                'town': address.town,
                'county': address.county,
                'date_moved_in': address.date_moved_in or False,
                'date_moved_out': address.date_moved_out or False,
                'is_current_address': address.is_current_address,
            } for address in new_address_histories]

            # Write the address history to fact_find's One2many field using Command.create
            fact_find.sudo().write({
                'address_history_ids': [Command.create(address_data) for address_data in address_history_data]
            })

        return {'status': 'success'}

    @http.route('/applicant/address', methods=['POST'], type='json', auth='public')
    def applicant_address(self, fact_find_id, **kwargs):
        factFind = request.env['fact.find'].sudo()
        fact_find = factFind.browse(fact_find_id)

        if not fact_find:
            return []

        lead = fact_find.lead_id
        fact_find_ids = lead.mapped('fact_find_ids')

        # If private lead → return empty
        if fact_find.is_private_lead:
            return []

        available_address_facts = []
        for ff in fact_find_ids:
            if ff == fact_find:
                continue
            if ff.address_history_ids:
                available_address_facts.append({
                    "id": ff.id,
                    "name": ff.first_name or "Unknown"
                })

        return available_address_facts

    # @http.route('/applicant/address', methods=['POST'], type='json', auth='public')
    # def applicant_address(self, fact_find_id, **kwargs):
    #     factFind = request.env['fact.find'].sudo()
    #     fact_find = factFind.browse(int(fact_find_id))
    #
    #     if not fact_find:
    #         return []
    #
    #     lead = fact_find.lead_id
    #     fact_find_ids = lead.mapped('fact_find_ids')
    #
    #     # If private lead → return empty
    #     if fact_find.is_private_lead:
    #         return []
    #
    #     # Build set of existing addresses for current fact_find
    #     existing = set()
    #     for addr in fact_find.address_history_ids:
    #         existing.add((
    #             addr.house_number or '',
    #             addr.flat_number or '',
    #             addr.building_number or '',
    #             addr.town or '',
    #             addr.post_code or '',
    #             addr.address or '',
    #             addr.country.id if addr.country else None
    #         ))
    #
    #     available_address_facts = []
    #     for ff in fact_find_ids:
    #         if ff == fact_find:
    #             continue
    #
    #         if ff.address_history_ids:
    #             # Build set of this FF's addresses
    #             other_addrs = set()
    #             for addr in ff.address_history_ids:
    #                 other_addrs.add((
    #                     addr.house_number or '',
    #                     addr.flat_number or '',
    #                     addr.building_number or '',
    #                     addr.town or '',
    #                     addr.post_code or '',
    #                     addr.address or '',
    #                     addr.country.id if addr.country else None
    #                 ))
    #
    #             # Keep only if at least one address is different
    #             if not other_addrs.issubset(existing):
    #                 available_address_facts.append({
    #                     "id": ff.id,
    #                     "name": ff.first_name or "Unknown"
    #                 })
    #
    #     return available_address_facts

    @http.route('/copy/address', methods=['POST'], type='json', auth='public')
    def ff_copy_address(self, user_ff_id, from_copy_ff_id, **kwargs):
        fact_find = request.env['fact.find'].sudo()
        ff_user = fact_find.browse(int(user_ff_id))
        ff_from_copy = fact_find.browse(int(from_copy_ff_id))

        if not ff_user or not ff_from_copy:
            return {'error': 'Invalid Fact Find IDs'}

        copied_count = 0

        # Build set of existing addresses in target fact find
        existing = set()
        for addr in ff_user.address_history_ids:
            existing.add((
                addr.house_number or '',
                addr.flat_number or '',
                addr.building_number or '',
                addr.town or '',
                addr.post_code or '',
                addr.address or '',
                addr.country.id if addr.country else None
            ))

        # Copy only if not already exists
        for addr in ff_from_copy.address_history_ids:
            key = (
                addr.house_number or '',
                addr.flat_number or '',
                addr.building_number or '',
                addr.town or '',
                addr.post_code or '',
                addr.address or '',
                addr.country.id if addr.country else None
            )
            if key not in existing:
                addr.copy(default={'fact_find_id': ff_user.id})
                copied_count += 1
                existing.add(key)  # add to set to avoid duplicates in same batch

        return {
            'status': 'success',
            'copied_count': copied_count,
        }

    @http.route('/update/fact-find/address', methods=['POST'], type='json', auth='public')
    def ff_update_address(self, fact_find_id, **kwargs):
        """
        @public - update addresses
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        address_history_data = kwargs.get('data')
        address_id = address_history_data.get('address_id')  # Get the address_id from the data

        # Check if the address_id is provided and exists
        if address_id and address_id != 'new-address':
            # Attempt to update an existing address record
            address_record = request.env['address.history'].sudo().browse(int(address_id))
            if address_record.exists():
                # Update the existing address record
                address_record.write({
                    'residential_status': address_history_data.get('residential_status'),
                    'flat_number': address_history_data.get('flat_number'),
                    'building_number': address_history_data.get('building_name'),
                    'house_number': address_history_data.get('house_number'),
                    'address': address_history_data.get('street_address'),
                    'post_code': address_history_data.get('post_code'),
                    'town': address_history_data.get('town'),
                    'county': address_history_data.get('county'),
                    'date_moved_in': address_history_data.get('date_moved_in') or False,
                    'date_moved_out': address_history_data.get('date_moved_out') or False,
                    'is_current_address': address_history_data.get('current_address_name_checkbox') or False,
                    'country': int(address_history_data.get('country')) if address_history_data.get(
                        'country') else False,
                    'current_landlord_name': address_history_data.get('current_landlord_name'),
                    'current_landlord_address': address_history_data.get('current_landlord_address'),
                    'current_landlord_postcode': address_history_data.get('current_landlord_postcode'),
                    'current_landlord_contact_no': address_history_data.get('current_landlord_contact_no'),
                    'local_authority_name': address_history_data.get('local_authority_name'),
                    'local_authority_postcode': address_history_data.get('local_authority_postcode'),
                    'local_authority_address': address_history_data.get('local_authority_address'),
                })
                return {'success': True, 'address_id': address_id}  # Return success response with updated ID
            else:
                return {'error': 'Address not found'}
        else:
            # If no address_id is provided or it's a new address, create a new record
            address_record = request.env['address.history'].with_user(SUPERUSER_ID).create({
                'fact_find_id': fact_find_id.id,
                'residential_status': address_history_data.get('residential_status'),
                'flat_number': address_history_data.get('flat_number'),
                'building_number': address_history_data.get('building_name'),
                'house_number': address_history_data.get('house_number'),
                'address': address_history_data.get('street_address'),
                'post_code': address_history_data.get('post_code'),
                'town': address_history_data.get('town'),
                'county': address_history_data.get('county'),
                'date_moved_in': address_history_data.get('date_moved_in') or False,
                'date_moved_out': address_history_data.get('date_moved_out') or False,
                'is_current_address': address_history_data.get('current_address_name_checkbox') or False,
                'country': int(address_history_data.get('country')) if address_history_data.get('country') else False,
                'current_landlord_name': address_history_data.get('current_landlord_name'),
                'current_landlord_address': address_history_data.get('current_landlord_address'),
                'current_landlord_postcode': address_history_data.get('current_landlord_postcode'),
                'current_landlord_contact_no': address_history_data.get('current_landlord_contact_no'),
                'local_authority_name': address_history_data.get('local_authority_name'),
                'local_authority_postcode': address_history_data.get('local_authority_postcode'),
                'local_authority_address': address_history_data.get('local_authority_address'),

            })

            return {'success': True, 'address_id': address_record.id}

    @http.route('/ff/delete/address', methods=['POST'], type='json', auth='public')
    def ff_delete_address(self, address_id, **kwargs):
        """
        @public - delete addresses
        """
        request.env['address.history'].sudo().browse(int(address_id)).unlink()

    @http.route('/ff/get/address-details', methods=['POST'], type='json', auth='public')
    def ff_get_address_details(self, address_id, **kwargs):
        if address_id:
            address_record = request.env['address.history'].sudo().browse(int(address_id))
            if not address_record.exists():
                return {'error': 'Address not found'}

            return {
                '#residential_status_ah': address_record.residential_status,
                '#date-moved-to-this-address': address_record.date_moved_in,
                '#date-moved-out-this-address': address_record.date_moved_out,
                '#current_address_name_checkbox': bool(
                    address_record.is_current_address) if address_record.is_current_address else False,
                '#flat-number': address_record.flat_number,
                '#building-name': address_record.building_number,
                '#house-number': address_record.house_number,
                '#street-address': address_record.address,
                '#postcode': address_record.post_code,
                '#country_ah': address_record.country.id if address_record.country else '',
                '#town': address_record.town,
                '#county_ah': address_record.county,
                '#current_landlord_name': address_record.current_landlord_name,
                '#current_landlord_address': address_record.current_landlord_address,
                '#current_landlord_postcode': address_record.current_landlord_postcode,
                '#current_landlord_contact_no': address_record.current_landlord_contact_no,
                '#local_authority_name': address_record.local_authority_name,
                '#local_authority_postcode': address_record.local_authority_postcode,
                '#local_authority_address': address_record.local_authority_address,
                '#local_authority_type': address_record.local_authority_type,
            }

        return {'error': 'Missing address ID'}

    @http.route('/get/fact-find/address-history', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_address_history(self, fact_find_id, **kwargs):
        address_history_ids = request.env['fact.find'].with_user(SUPERUSER_ID).browse(
            int(fact_find_id)).address_history_ids
        return [{
            'address_id': address.id,
            'date_moved_in': address.date_moved_in,  # Changed from date_moved_to_address
            'residential_status': address.residential_status,
            'street_address': address.address,  # Changed from address
            'date_moved_out': address.date_moved_out,  # Changed from date_moved_out_of_address
            'flat_number': address.flat_number,
            'building_name': address.building_number,  # Note: this should probably be building_name
            'house_number': address.house_number,
            'post_code': address.post_code,
            'town': address.town,
            'county': address.county,
            'country': address.country.id if address.country else '',
            'current_address_name_checkbox': address.is_current_address,  # Changed field name
            'current_landlord_name': address.current_landlord_name,
            'current_landlord_address': address.current_landlord_address,
            'current_landlord_postcode': address.current_landlord_postcode,
            'current_landlord_contact_no': address.current_landlord_contact_no,
            'local_authority_name': address.local_authority_name,
            'local_authority_postcode': address.local_authority_postcode,
            'local_authority_address': address.local_authority_address,
        } for address in address_history_ids]

    @http.route('/update/fact-find/dependant', type='json', auth='public', methods=['POST'])
    def ff_update_dependant(self, fact_find_id, **kwargs):
        """
        @public - update dependant
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        data = kwargs.get('data')
        dependant_id = data.get('dependant_id')  # Get the dependant_id from the data

        # Check if the dependant_id is provided and exists
        if dependant_id and dependant_id != 'new-dependant':
            # Attempt to update an existing dependent
            financial_dependent = request.env['financial.dependent'].sudo().browse(int(dependant_id))
            if financial_dependent.exists():
                # Update the existing financial dependent record
                financial_dependent.write({
                    'has_dependents': data.get('has_dependents'),
                    'number_of_dependents': data.get('number_of_dependents'),
                    'full_name': data.get('full_name'),
                    'relationship': data.get('relationship'),
                    'date_of_birth': data.get('date_of_birth') or False,
                    'dependency_type': data.get('dependency_type'),
                    'dependency_period': data.get('dependency_period'),  # Fixed: Added missing field
                    'monthly_childcare_cost': data.get('monthly_childcare_cost'),
                    'childcare_cost_reason': data.get('childcare_cost_reason'),
                    'additional_cost': data.get('additional_cost'),
                })
                return {'success': True}  # Return success response
            else:
                return {'error': 'Dependent not found'}
        else:
            # If no dependant_id is provided or it's a new dependant, create new record(s)

            # If the "Belongs To" checkbox is true, create records for all fact finds
            if data.get('belongs_to', False):
                lead = fact_find_id.lead_id
                fact_finds = request.env['fact.find'].with_user(SUPERUSER_ID).search([('lead_id', '=', lead.id)])
                created_dependants = []

                for fact_find in fact_finds:
                    financial_dependent = request.env['financial.dependent'].with_user(SUPERUSER_ID).create({
                        'fact_find_id': fact_find.id,
                        'has_dependents': data.get('has_dependents'),
                        'number_of_dependents': data.get('number_of_dependents'),
                        'full_name': data.get('full_name'),
                        'relationship': data.get('relationship'),
                        'date_of_birth': data.get('date_of_birth') or False,
                        'dependency_type': data.get('dependency_type'),
                        'dependency_period': data.get('dependency_period'),  # Fixed: Added missing field
                        'monthly_childcare_cost': data.get('monthly_childcare_cost'),
                        'childcare_cost_reason': data.get('childcare_cost_reason'),
                        'additional_cost': data.get('additional_cost'),
                    })
                    created_dependants.append(financial_dependent)

                    # Link the dependant to the fact find
                    fact_find.sudo().write({
                        'financial_depend_ids': [Command.link(financial_dependent.id)]
                    })

                # Return the dependant_id for the current fact find
                current_dependant = next((dep for dep in created_dependants if dep.fact_find_id.id == fact_find_id.id),
                                         None)
                return {'success': True,
                        'dependant_id': current_dependant.id if current_dependant else created_dependants[0].id}

            else:
                # Create a single record for the current fact find only
                financial_dependent = request.env['financial.dependent'].with_user(SUPERUSER_ID).create({
                    'fact_find_id': fact_find_id.id,
                    'has_dependents': data.get('has_dependents'),
                    'number_of_dependents': data.get('number_of_dependents'),
                    'full_name': data.get('full_name'),
                    'relationship': data.get('relationship'),
                    'date_of_birth': data.get('date_of_birth') or False,
                    'dependency_type': data.get('dependency_type'),
                    'dependency_period': data.get('dependency_period'),  # Fixed: Added missing field
                    'monthly_childcare_cost': data.get('monthly_childcare_cost'),
                    'childcare_cost_reason': data.get('childcare_cost_reason'),
                    'additional_cost': data.get('additional_cost'),
                })

                return {'success': True, 'dependant_id': financial_dependent.id}

    @http.route('/ff/delete/financial-dependants', methods=['POST'], type='json', auth='public')
    def ff_delete_dependants(self, financial_dependants_id, **kwargs):
        """
        @public - delete addresses
        """
        request.env['financial.dependent'].sudo().browse(int(financial_dependants_id)).unlink()
        return {'success': True}  # Fixed: Added return response

    @http.route('/ff/get/financial-dependants', methods=['POST'], type='json', auth='public')
    def ff_get_dependants_details(self, financial_dependants_id, **kwargs):
        """
        @public - Get financial dependent details for given financial_dependants_id
        """
        if financial_dependants_id:
            dependant_record = request.env['financial.dependent'].sudo().browse(int(financial_dependants_id))
            if not dependant_record.exists():
                return {'error': 'Dependent not found'}

            return {
                '#dependant-name': dependant_record.full_name,
                '#dependant-relation': dependant_record.relationship,
                '#dependant-date-of-birth': dependant_record.date_of_birth,
                '#dependency_type': dependant_record.dependency_type,
                '#dependency_period': dependant_record.dependency_period,  # Fixed: Added missing field
                '#monthly_childcare_cost': dependant_record.monthly_childcare_cost,
                '#childcare_cost_reason': dependant_record.childcare_cost_reason,  # Fixed: Added missing field
                '#additional_cost': dependant_record.additional_cost,  # Fixed: Added missing field
                '#has-additional-cost': bool(dependant_record.has_additional_cost),
            }

        return {'error': 'Missing dependent ID'}

    @http.route('/get/fact-find/financial-dependants', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_financial_dependants(self, fact_find_id, **kwargs):
        """
        @public - update single data for fact_find
        """
        financial_depend_ids = request.env['fact.find'].sudo().browse(int(fact_find_id)).financial_depend_ids
        return [{
            'financial_dependants_id': dependants.id,
            'full_name': dependants.full_name,
            'relationship': dependants.relationship,
            'dob': dependants.date_of_birth,
            'dependency_type': dependants.dependency_type,  # Added for display
            'dependency_period': dependants.dependency_period,  # Added for display
        } for dependants in financial_depend_ids]

    @http.route('/update/fact-find/adverse-credit', type='json', auth='public', methods=['POST'])
    def ff_update_adverse_credit(self, fact_find_id, **kwargs):
        """
        @public - Update or create adverse credit entry
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        data = kwargs.get('data')
        adverse_credit_id = data.get('adverse_credit_id')

        # Validate adverse_credit_id for updates
        if adverse_credit_id and adverse_credit_id != 'new-credit' and str(adverse_credit_id).isdigit():
            adverse_credit = request.env['adverse.credit.details'].sudo().browse(int(adverse_credit_id))
            if adverse_credit.exists():
                adverse_credit.write({
                    'adverse_credit_type': data.get('adverse_credit_type'),
                    'total_count': data.get('total_count'),
                    'loan_type': data.get('loan_type'),
                    'lender': data.get('lender'),
                    'amount': data.get('amount'),
                    'reported_on': data.get('reported_on') or False,
                    'settled_on': data.get('settled_on') or False,
                })
                return {'success': True, 'adverse_credit_id': adverse_credit.id}
            else:
                return {'error': 'Adverse credit record not found'}
        else:
            # Create new record(s)
            if data.get('belongs_to_ac', False):
                lead = fact_find_id.lead_id
                fact_finds = request.env['fact.find'].with_user(SUPERUSER_ID).search([('lead_id', '=', lead.id)])
                created_adverse_credits = []

                for fact_find in fact_finds:
                    adverse_credit = request.env['adverse.credit.details'].with_user(SUPERUSER_ID).create({
                        'fact_find_id': fact_find.id,
                        'adverse_credit_type': data.get('adverse_credit_type'),
                        'total_count': data.get('total_count'),
                        'loan_type': data.get('loan_type'),
                        'lender': data.get('lender'),
                        'amount': data.get('amount'),
                        'reported_on': data.get('reported_on') or False,
                        'settled_on': data.get('settled_on') or False,
                    })
                    created_adverse_credits.append(adverse_credit)

                    # Link record
                    fact_find.sudo().write({
                        'adverse_credit_details': [Command.link(adverse_credit.id)]
                    })

                current_adverse_credit = next(
                    (ac for ac in created_adverse_credits if ac.fact_find_id.id == fact_find_id.id), None)
                return {
                    'success': True,
                    'adverse_credit_id': current_adverse_credit.id if current_adverse_credit else
                    created_adverse_credits[0].id
                }
            else:
                # Create for current fact find only
                adverse_credit = request.env['adverse.credit.details'].with_user(SUPERUSER_ID).create({
                    'fact_find_id': fact_find_id.id,
                    'adverse_credit_type': data.get('adverse_credit_type'),
                    'total_count': data.get('total_count'),
                    'loan_type': data.get('loan_type'),
                    'lender': data.get('lender'),
                    'amount': data.get('amount'),
                    'reported_on': data.get('reported_on') or False,
                    'settled_on': data.get('settled_on') or False,
                })

                fact_find_id.sudo().write({
                    'adverse_credit_details': [Command.link(adverse_credit.id)]
                })

                return {'success': True, 'adverse_credit_id': adverse_credit.id}

    @http.route('/ff/delete/adverse-credit', methods=['POST'], type='json', auth='public')
    def ff_delete_adverse_credit(self, **kwargs):
        """
        @public - Delete an adverse credit record
        """
        adverse_credit_id = kwargs.get('adverse_credit_id')
        if not adverse_credit_id or not str(adverse_credit_id).isdigit():
            return {'error': 'Missing or invalid adverse_credit_id'}

        request.env['adverse.credit.details'].sudo().browse(int(adverse_credit_id)).unlink()
        return {'success': True}

    @http.route('/ff/get/adverse-credit-details', methods=['POST'], type='json', auth='public')
    def ff_get_adverse_credit_details(self, **kwargs):
        """
        @public - Get details for one adverse credit record
        """
        adverse_credit_id = kwargs.get('adverse_credit_id')
        if not adverse_credit_id or not str(adverse_credit_id).isdigit():
            return {'error': 'Missing or invalid adverse_credit_id'}

        adverse_credit_record = request.env['adverse.credit.details'].sudo().browse(int(adverse_credit_id))
        if not adverse_credit_record.exists():
            return {'error': 'Adverse credit record not found'}

        return {
            'adverse_credit_type': adverse_credit_record.adverse_credit_type,
            'total_count': adverse_credit_record.total_count,
            'loan_type': adverse_credit_record.loan_type,
            'lender': adverse_credit_record.lender,
            'amount': adverse_credit_record.amount,
            'reported_on': adverse_credit_record.reported_on,
            'settled_on': adverse_credit_record.settled_on,
        }

    @http.route('/get/fact-find/adverse-credit', methods=['POST'], type='json', auth='public')
    def fact_find_get_adverse_credit(self, **kwargs):
        """
        @public - Get all adverse credit records for a fact find
        """
        fact_find_id = kwargs.get('fact_find_id')  # Fixed parameter name
        if not fact_find_id or not str(fact_find_id).isdigit():
            return {'error': 'Missing or invalid fact_find_id'}

        adverse_credit_details = request.env['fact.find'].sudo().browse(int(fact_find_id)).adverse_credit_details

        return [{
            'adverse_credit_id': ac.id,
            'adverse_credit_type': ac.adverse_credit_type,
            'total_count': ac.total_count,
            'loan_type': ac.loan_type,
            'lender': ac.lender,
            'amount': ac.amount,
            'reported_on': ac.reported_on,
            'settled_on': ac.settled_on,
        } for ac in adverse_credit_details]

    @http.route('/delete/fact-find/banking-details', type='json', auth='public', methods=['POST'])
    def ff_delete_banking_details(self, banking_details_id, **kwargs):
        """
        @public - delete banking details
        """
        banking_detail = request.env['bank.account'].with_user(SUPERUSER_ID).browse(int(banking_details_id))
        if banking_detail.exists():
            banking_detail.unlink()
            return {'status': 'success'}
        return {'status': 'error', 'message': 'Banking details not found'}

    @http.route('/update/fact-find/banking-details', type='json', auth='public', methods=['POST'])
    def ff_update_banking_details(self, fact_find_id, **kwargs):
        """
        @public - update banking details
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        data = kwargs.get('data')
        banking_details_id = data.get('banking_details_id')  # Get the banking_details_id from the data

        # Check if the banking_details_id is provided and exists
        if banking_details_id and banking_details_id != 'new-banking-details':
            # Attempt to update an existing banking details record
            banking_detail = request.env['bank.account'].sudo().browse(int(banking_details_id))
            if banking_detail.exists():
                # Update the existing banking details record
                banking_detail.write({
                    'account_type': data.get('account_type'),
                    'sort_code': data.get('sort_code'),
                    'bank_name': data.get('bank_name'),
                    'account_no': data.get('account_number'),
                    'account_holder_name': data.get('account_holder_name'),
                    'account_open_date': data.get('years_held'),  # Corrected mapping
                    'direct_debit_for_mortgage': data.get('direct_debit_for_mortgage', False),
                    'preferred_dd_date': data.get('preferred_dd_date'),
                })
                return {'status': 'success', 'banking_details_id': banking_detail.id}
            else:
                return {'status': 'error', 'message': 'Banking details not found'}
        else:
            # If no banking_details_id is provided or it's a new banking details, create new record(s)

            # Get the lead and its applicants
            lead = fact_find_id.lead_id
            applicants = lead.applicant_ids

            # If the "Belongs To" radio button is true, create banking details for all fact finds
            if data.get('belongs_to', False):
                fact_finds = request.env['fact.find'].with_user(SUPERUSER_ID).search([('lead_id', '=', lead.id)])
                created_banking_details = []

                for fact_find in fact_finds:
                    banking_details = request.env['bank.account'].with_user(SUPERUSER_ID).create({
                        'fact_find_id': fact_find.id,
                        'account_type': data.get('account_type'),
                        'sort_code': data.get('sort_code'),
                        'bank_name': data.get('bank_name'),
                        'account_no': data.get('account_number'),
                        'account_holder_name': data.get('account_holder_name'),
                        'account_open_date': data.get('years_held'),  # Corrected mapping
                        'direct_debit_for_mortgage': data.get('direct_debit_for_mortgage', False),
                        'preferred_dd_date': data.get('preferred_dd_date'),
                    })
                    created_banking_details.append(banking_details)

                    fact_find.sudo().write({
                        'bank_account_ids': [Command.link(banking_details.id)]
                    })

                # Return the banking_details_id for the current fact find
                current_banking_detail = next(
                    (bd for bd in created_banking_details if bd.fact_find_id.id == fact_find_id.id), None)
                return {'status': 'success',
                        'banking_details_id': current_banking_detail.id if current_banking_detail else
                        created_banking_details[0].id}
            else:
                # Create a new banking details record only for the current fact find
                banking_details = request.env['bank.account'].with_user(SUPERUSER_ID).create({
                    'fact_find_id': fact_find_id.id,
                    'account_type': data.get('account_type'),
                    'sort_code': data.get('sort_code'),
                    'bank_name': data.get('bank_name'),
                    'account_no': data.get('account_number'),
                    'account_holder_name': data.get('account_holder_name'),
                    'account_open_date': data.get('years_held'),  # Corrected mapping
                    'direct_debit_for_mortgage': data.get('direct_debit_for_mortgage', False),
                    'preferred_dd_date': data.get('preferred_dd_date'),
                })
                fact_find_id.sudo().write({
                    'bank_account_ids': [Command.link(banking_details.id)]
                })

                return {'status': 'success', 'banking_details_id': banking_details.id}

    @http.route('/get/fact-find/banking-details', methods=['POST'], type='json', auth='public')
    def ff_get_bank_details(self, banking_details_id, **kwargs):
        """
        @public - get banking details for given banking_details_id
        """
        banking_detail = request.env['bank.account'].sudo().browse(int(banking_details_id))
        if banking_detail.exists():
            return {
                'select[name="ynm-banking-bank-name"]': banking_detail.bank_name,
                'input[name="ynm-account-holder-name"]': banking_detail.account_holder_name,
                'input[name="ynm-account-number"]': banking_detail.account_no,
                'input[name="ynm-sort-code"]': banking_detail.sort_code,
                'input[name="ynm-years-held"]': banking_detail.account_open_date.strftime(
                    '%Y-%m-%d') if banking_detail.account_open_date else '',
                'select[name="account_type"]': banking_detail.account_type,
                'input[name="direct_debit_for_mortgage"]': banking_detail.direct_debit_for_mortgage,
                'select[name="preferred_dd_date"]': banking_detail.preferred_dd_date,
                'textarea[name="ynm-bnk-additional-information"]': banking_detail.additional_information or '',
            }
        return {}

    @http.route('/get/ff/banking-details', methods=['POST'], type='json', auth='public')
    def fact_find_get_banking_details(self, banking_details_id, **kwargs):
        """
        @public - get banking details for given fact_find_id
        """
        bank_account_ids = request.env['fact.find'].sudo().browse(
            int(banking_details_id)).bank_account_ids
        return [{
            'banking_details_id': banking_detail.id,
            'bank_name': banking_detail.bank_name,
            'account_holder_name': banking_detail.account_holder_name,
            'account_no': banking_detail.account_no,
            'sort_code': banking_detail.sort_code,
            'account_open_date': banking_detail.account_open_date.strftime(
                '%Y-%m-%d') if banking_detail.account_open_date else False,
            'account_type': banking_detail.account_type,
            'direct_debit_for_mortgage': banking_detail.direct_debit_for_mortgage,
            'preferred_dd_date': banking_detail.preferred_dd_date,
        } for banking_detail in bank_account_ids]

    @http.route('/delete/fact-find/credit-commitments', methods=['POST'], type='json', auth='public')
    def ff_delete_credit_commitment(self, credit_comment_id, **kwargs):
        """
        @public - delete credit commitment
        """
        credit_comment = request.env['credit.comment'].sudo().browse(int(credit_comment_id))
        if credit_comment.exists():
            credit_comment.unlink()
            return {'status': 'success'}
        return {'status': 'error', 'message': 'Credit commitment not found'}

    @http.route('/update/fact-find/credit-commitment', type='json', auth='public', methods=['POST'])
    def ff_update_credit_commitment(self, fact_find_id, **kwargs):
        """
        @public - update or create credit commitment
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        data = kwargs.get('data')
        credit_comment_id = data.get('credit_comment_id')  # Get the credit_comment_id from the data

        # Check if the credit_comment_id is provided and exists (for edit)
        if credit_comment_id and credit_comment_id != 'new-credit-commitment':
            # Attempt to update an existing credit commitment record
            credit_comment = request.env['credit.comment'].sudo().browse(int(credit_comment_id))
            if credit_comment.exists():
                # Update the existing credit commitment record
                credit_comment.write({
                    'commitment_type': data.get('commitment_type'),
                    'lender': data.get('creditor_company'),  # Map frontend creditor-company to backend lender
                    'outstanding_amount': data.get('outstanding_amount'),
                    'monthly_payment': data.get('monthly_payment'),
                    'credit_limit': data.get('credit_limit'),
                    'remaining_months': data.get('remaining_months'),
                    'intend_to_repay': data.get('intend_to_repay', False),
                })
                return {'status': 'success', 'credit_commitment_id': credit_comment.id}
            else:
                return {'status': 'error', 'message': 'Credit commitment not found'}
        else:
            # If no credit_comment_id is provided or it's a new credit commitment, create new record(s)
            lead = fact_find_id.lead_id
            applicants = lead.applicant_ids

            # If the "Belongs To" radio button is true, create credit commitments for all fact finds
            if data.get('belongs_to', False):
                fact_finds = request.env['fact.find'].with_user(SUPERUSER_ID).search([('lead_id', '=', lead.id)])
                created_credit_commitments = []

                for fact_find in fact_finds:
                    credit_commitment = request.env['credit.comment'].with_user(SUPERUSER_ID).create({
                        'fact_find_id': fact_find.id,
                        'has_credit_commitments': True,
                        'commitment_type': data.get('commitment_type'),
                        'lender': data.get('creditor_company'),  # Map frontend creditor-company to backend lender
                        'outstanding_amount': data.get('outstanding_amount'),
                        'monthly_payment': data.get('monthly_payment'),
                        'credit_limit': data.get('credit_limit'),
                        'remaining_months': data.get('remaining_months'),
                        'intend_to_repay': data.get('intend_to_repay', False),
                    })
                    created_credit_commitments.append(credit_commitment)

                    fact_find.sudo().write({
                        'credit_comment_ids': [Command.link(credit_commitment.id)]
                    })

                # Return the credit_commitment_id for the current fact find
                current_credit_commitment = next(
                    (cc for cc in created_credit_commitments if cc.fact_find_id.id == fact_find_id.id), None)
                return {'status': 'success',
                        'credit_commitment_id': current_credit_commitment.id if current_credit_commitment else
                        created_credit_commitments[0].id}
            else:
                # Create a new credit commitment record only for the current fact find
                credit_commitment = request.env['credit.comment'].with_user(SUPERUSER_ID).create({
                    'fact_find_id': fact_find_id.id,
                    'has_credit_commitments': True,
                    'commitment_type': data.get('commitment_type'),
                    'lender': data.get('creditor-company'),  # Map frontend creditor-company to backend lender
                    'outstanding_amount': data.get('outstanding_amount'),
                    'monthly_payment': data.get('monthly_payment'),
                    'credit_limit': data.get('credit_limit'),
                    'remaining_months': data.get('remaining_months'),
                    'intend_to_repay': data.get('intend_to_repay', False),
                })
                fact_find_id.sudo().write({
                    'credit_comment_ids': [Command.link(credit_commitment.id)]
                })

                return {'status': 'success', 'credit_commitment_id': credit_commitment.id}

    @http.route('/get/fact-find/credit-commitments', methods=['POST'], type='json', auth='public')
    def ff_get_credit_commitment(self, credit_comment_id, **kwargs):
        """
        @public - get credit commitment details for given credit commitment id
        """
        credit_comment = request.env['credit.comment'].sudo().browse(int(credit_comment_id))

        if not credit_comment.exists():
            return {}

        return {
            'commitment_type': credit_comment.commitment_type,
            'creditor-company': credit_comment.lender,  # Map backend lender to frontend creditor-company
            'outstanding-amount': credit_comment.outstanding_amount,
            'monthly-payment': credit_comment.monthly_payment,
            'credit_limit': credit_comment.credit_limit,
            'remaining_months': credit_comment.remaining_months,
            'intend_to_repay': credit_comment.intend_to_repay,
        }

    @http.route('/get/ff/credit-commitments', methods=['POST'], type='json', auth='public')
    def fact_find_get_credit_commitments(self, credit_comment_id, **kwargs):
        """
        @public - get all credit commitments for given fact_find_id
        """
        credit_comment_ids = request.env['fact.find'].sudo().browse(
            int(credit_comment_id)).credit_comment_ids

        result = []
        for credit_commitment in credit_comment_ids:
            result.append({
                'id': credit_commitment.id,
                'credit_comment_id': credit_commitment.id,
                'commitment_type': credit_commitment.commitment_type,
                'creditor-company': credit_commitment.lender,
                'credit_limit': credit_commitment.credit_limit,
                'outstanding_amount': credit_commitment.outstanding_amount,
                'monthly_payment': credit_commitment.monthly_payment,
                'remaining_months': credit_commitment.remaining_months,
                'intend_to_repay': credit_commitment.intend_to_repay,
            })

        return result

    @http.route('/get/fact-find/your-properties', methods=['POST'], type='json', auth='public')
    def ff_get_your_properties(self, your_properties_id, **kwargs):
        """
        @public - get your properties details for given your properties id
        """
        property_detail = request.env['property.details'].sudo().browse(int(your_properties_id))
        if property_detail.exists():
            return {
                'property_usage_yep': property_detail.property_usage or '',
                'house_number_yep': property_detail.house_number or '',
                'post_code_yep': property_detail.postcode or '',
                'street_address_existing_properties': property_detail.street_address or '',
                'county_yep': property_detail.county or '',
                'property_type': property_detail.property_type or '',
                'bedrooms': property_detail.bedrooms or 0,
                'current_property_valuation_yep': property_detail.current_property_valuation or 0,
                'tenure_yep': property_detail.tenure or '',
                'has_mortgage': property_detail.has_mortgage or False,
                'ground_rent': property_detail.ground_rent or 0,
                'service_charge': property_detail.service_charge or 0,
                'first_let_date': property_detail.first_let_date.strftime(
                    '%Y-%m-%d') if property_detail.first_let_date else '',
                'monthly_rental_income': property_detail.monthly_rental_income or 0,
                'is_hmo': property_detail.is_hmo or False,
                'ownership_percentage_yep': property_detail.ownership_percentage or '',
                'ownership_percentage': property_detail.ownership_percentage or '',
                'second_charge_property': property_detail.second_charge_property or '',
                'second_charge_details': property_detail.second_charge_details or '',
                'htb_scheme_available': property_detail.htb_scheme_available or '',
                'htb_scheme_location': property_detail.htb_scheme_location or '',
                'redeem_htb_loan': property_detail.redeem_htb_loan or '',
                'shared_ownership_available': property_detail.shared_ownership_available or '',
            }
        return {}

    @http.route('/get/ff/your-properties', methods=['POST'], type='json', auth='public')
    def fact_find_get_your_properties(self, your_properties_id, **kwargs):
        """
        @public - get your properties details for given fact find id
        """
        property_details_ids = request.env['fact.find'].sudo().browse(int(your_properties_id)).property_details_ids
        return [{
            'your_properties_id': your_properties.id,
            'property_usage': your_properties.property_usage or '',
            'house_number': your_properties.house_number or '',
            'postcode': your_properties.postcode or '',
            'street_address': your_properties.street_address or '',
            'county': your_properties.county or '',
            'property_type': your_properties.property_type or '',
            'bedrooms': your_properties.bedrooms or 0,
            'current_property_valuation': your_properties.current_property_valuation or 0,
            'tenure': your_properties.tenure or '',
            'has_mortgage': your_properties.has_mortgage or False,
            'ground_rent': your_properties.ground_rent or 0,
            'service_charge': your_properties.service_charge or 0,
            'first_let_date': your_properties.first_let_date.strftime(
                '%Y-%m-%d') if your_properties.first_let_date else '',
            'monthly_rental_income': your_properties.monthly_rental_income or 0,
            'is_hmo': your_properties.is_hmo or False,
            'ownership_percentage': your_properties.ownership_percentage or '',
            # Added missing fields
            'second_charge_property': your_properties.second_charge_property or '',
            'second_charge_details': your_properties.second_charge_details or '',
            'htb_scheme_available': your_properties.htb_scheme_available or '',
            'htb_scheme_location': your_properties.htb_scheme_location or '',
            'redeem_htb_loan': your_properties.redeem_htb_loan or '',
            'shared_ownership_available': your_properties.shared_ownership_available or '',
        } for your_properties in property_details_ids]

    @http.route('/update/fact-find/your-properties', methods=['POST'], type='json', auth='public')
    def ff_update_your_properties(self, fact_find_id, **kwargs):
        fact_find = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        data = kwargs.get('data')
        your_properties_id = data.get('your_properties_id')

        if not fact_find.exists():
            return {'status': 'error', 'message': 'Fact Find record not found'}

        try:
            # Check if we're updating an existing record or creating new one
            if your_properties_id and your_properties_id != 'new-your-properties':
                # Update existing property
                property_record = request.env['property.details'].sudo().browse(int(your_properties_id))
                if property_record.exists():
                    # Parse first_let_date properly
                    first_let_date = None
                    if data.get('first_let_date'):
                        try:
                            first_let_date = datetime.strptime(data.get('first_let_date'), '%Y-%m-%d').date()
                        except:
                            first_let_date = None

                    property_record.write({
                        'property_usage': data.get('property_usage'),
                        'property_type': data.get('property_type'),
                        'house_number': data.get('house_number'),
                        'postcode': data.get('postcode'),
                        'street_address': data.get('street_address'),
                        'county': data.get('county'),
                        'current_property_valuation': float(data.get('current_property_valuation', 0)) if data.get(
                            'current_property_valuation') else 0,
                        'tenure': data.get('tenure'),
                        'ground_rent': float(data.get('ground_rent', 0)) if data.get('ground_rent') else 0,
                        'bedrooms': int(data.get('bedroom', 0)) if data.get('bedroom') else 0,
                        'service_charge': float(data.get('service_charge', 0)) if data.get('service_charge') else 0,
                        'monthly_rental_income': float(data.get('monthly_rental_income', 0)) if data.get(
                            'monthly_rental_income') else 0,
                        'ownership_percentage': data.get('ownership_percentage'),
                        'has_mortgage': True if data.get('has_mortgage') in [True, 'true', 'on', '1'] else False,
                        'is_hmo': True if data.get('is_hmo') in [True, 'true', 'on', '1'] else False,
                        'first_let_date': first_let_date,
                        'second_charge_property': data.get('second_charge_property'),
                        'second_charge_details': data.get('second_charge_details'),
                        'htb_scheme_available': data.get('htb_scheme_available'),
                        'htb_scheme_location': data.get('htb_scheme_location'),
                        'redeem_htb_loan': data.get('redeem_htb_loan'),
                        'shared_ownership_available': data.get('shared_ownership_available'),
                    })

                    # Handle mortgage creation/deletion for existing property
                    has_mortgage = True if data.get('has_mortgage') in [True, 'true', 'on', '1'] else False
                    response_data = {
                        'status': 'success',
                        'message': 'Property details updated successfully',
                        'property_id': property_record.id,
                    }

                    if has_mortgage:
                        # Check if mortgage already exists for this property
                        existing_mortgage = request.env['existing.mortgages'].sudo().search([
                            ('property_details_id', '=', property_record.id)
                        ], limit=1)

                        if not existing_mortgage:
                            # Create new mortgage record linked to this property
                            mortgage_record = self._create_mortgage_from_property(property_record, fact_find)

                            # Create Property Case History with both property and mortgage linked
                            case_history_record = self._create_case_history_from_property_and_mortgage(property_record,
                                                                                                       mortgage_record,
                                                                                                       fact_find)

                            response_data.update({
                                'message': 'Property updated, mortgage record and case history created successfully',
                                'mortgage_id': mortgage_record.id,
                                'case_history_id': case_history_record.id,
                            })
                        else:
                            # Update existing mortgage with ALL latest property data
                            # Build property address string
                            address_parts = []
                            if property_record.house_number:
                                address_parts.append(property_record.house_number)
                            if property_record.street_address:
                                address_parts.append(property_record.street_address)
                            if property_record.county:
                                address_parts.append(property_record.county)
                            if property_record.postcode:
                                address_parts.append(property_record.postcode)

                            property_address = ', '.join(filter(None, address_parts))

                            existing_mortgage.write({
                                'property_address': property_address,
                                'usage': property_record.property_usage,
                                'current_property_valuation': property_record.current_property_valuation,
                                'monthly_payment': property_record.monthly_rental_income,
                            })

                            # Update or create case history
                            case_history = self._update_or_create_case_history_from_property_and_mortgage(
                                property_record, existing_mortgage, fact_find)

                            response_data.update({
                                'message': 'Property and linked mortgage updated successfully',
                                'mortgage_id': existing_mortgage.id,
                                'case_history_id': case_history.id,
                            })
                    else:
                        # If has_mortgage is False, delete any existing mortgage records for this property
                        existing_mortgages = request.env['existing.mortgages'].sudo().search([
                            ('property_details_id', '=', property_record.id)
                        ])
                        if existing_mortgages:
                            # Also delete related case history records
                            case_histories = request.env['property.case.history'].sudo().search([
                                ('property_details_id', '=', property_record.id),
                                ('existing_mortgage_id', 'in', existing_mortgages.ids)
                            ])
                            case_histories.unlink()
                            existing_mortgages.unlink()

                    return response_data
                else:
                    return {'status': 'error', 'message': 'Property not found'}
            else:
                # Create new Property Details Record
                first_let_date = None
                if data.get('first_let_date'):
                    try:
                        first_let_date = datetime.strptime(data.get('first_let_date'), '%Y-%m-%d').date()
                    except:
                        first_let_date = None

                property_record = request.env['property.details'].with_user(SUPERUSER_ID).create({
                    'fact_find_id': fact_find.id,
                    'property_usage': data.get('property_usage'),
                    'property_type': data.get('property_type'),
                    'house_number': data.get('house_number'),
                    'postcode': data.get('postcode'),
                    'street_address': data.get('street_address'),
                    'county': data.get('county'),
                    'current_property_valuation': float(data.get('current_property_valuation', 0)) if data.get(
                        'current_property_valuation') else 0,
                    'tenure': data.get('tenure'),
                    'has_mortgage': bool(data.get('has_mortgage')),
                    'is_hmo': bool(data.get('is_hmo')),
                    'ground_rent': float(data.get('ground_rent', 0)) if data.get('ground_rent') else 0,
                    'bedrooms': int(data.get('bedroom', 0)) if data.get('bedroom') else 0,
                    'service_charge': float(data.get('service_charge', 0)) if data.get('service_charge') else 0,
                    'monthly_rental_income': float(data.get('monthly_rental_income', 0)) if data.get(
                        'monthly_rental_income') else 0,
                    'ownership_percentage': data.get('ownership_percentage'),
                    'first_let_date': first_let_date,
                    'second_charge_property': data.get('second_charge_property'),
                    'second_charge_details': data.get('second_charge_details'),
                    'htb_scheme_available': data.get('htb_scheme_available'),
                    'htb_scheme_location': data.get('htb_scheme_location'),
                    'redeem_htb_loan': data.get('redeem_htb_loan'),
                    'shared_ownership_available': data.get('shared_ownership_available'),
                })

                response_data = {
                    'status': 'success',
                    'message': 'Property details created successfully',
                    'property_id': property_record.id,
                }

                # Create mortgage record if has_mortgage is true
                if data.get('has_mortgage'):
                    mortgage_record = self._create_mortgage_from_property(property_record, fact_find)

                    # Create Property Case History with both property and mortgage linked
                    case_history_record = self._create_case_history_from_property_and_mortgage(property_record,
                                                                                               mortgage_record,
                                                                                               fact_find)

                    response_data.update({
                        'message': 'Property details, mortgage record and case history created successfully',
                        'mortgage_id': mortgage_record.id,
                        'case_history_id': case_history_record.id,
                    })

                return response_data

        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    @http.route('/delete/fact-find/your-properties', methods=['POST'], type='json', auth='public')
    def ff_delete_your_properties(self, your_properties_id, **kwargs):
        """
        @public - delete your properties
        """
        try:
            property_record = request.env['property.details'].sudo().browse(int(your_properties_id))
            if property_record.exists():
                property_record.unlink()
                return {'status': 'success', 'message': 'Property deleted successfully'}
            else:
                return {'status': 'error', 'message': 'Property not found'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    @http.route('/get/fact-find/existing-mortgages', methods=['POST'], type='json', auth='public')
    def ff_get_existing_mortgages(self, existing_mortgages_id, **kwargs):
        """
        @public - get existing mortgages details for given existing mortgages id
        """
        existing_mortgages_ids = request.env['fact.find'].sudo().browse(
            int(existing_mortgages_id)).existing_mortgages_ids

        for eid in existing_mortgages_ids:
            print(eid.property_address)

        return [{
            'existing_mortgages_id': existing_mortgage.id,  # Added missing ID field
            'address': existing_mortgage.property_address,
            'property_usage': existing_mortgage.usage,
            'ownership_of_deed': existing_mortgage.ownership_of_deed,
            'current_property_valuation': existing_mortgage.current_property_valuation,
            'outstanding_mortgage_amount': existing_mortgage.outstanding_mortgage_amount,
            'monthly_payment': existing_mortgage.monthly_payment,
            'lender_name': existing_mortgage.lender,
            'account_no': existing_mortgage.account_no,
            'rate_type': existing_mortgage.rate_type,
            'current_rate': existing_mortgage.current_rate,
            'remaining_term': existing_mortgage.remaining_term,
            'repayment_method': existing_mortgage.repayment_method,
            'remortgage_date': existing_mortgage.remortgage_date.strftime(
                '%Y-%m-%d') if existing_mortgage.remortgage_date else '',
            'mortgage_case_number': existing_mortgage.mortgage_case_number,
            'property_purchased_date': existing_mortgage.property_purchased_date.strftime(
                '%Y-%m-%d') if existing_mortgage.property_purchased_date else '',
            'property_purchased_price': existing_mortgage.property_purchased_price,
        } for existing_mortgage in existing_mortgages_ids]

    @http.route('/update/fact-find/existing-mortgages', type='json', auth='public', methods=['POST'])
    def ff_update_existing_mortgages(self, fact_find_id, **kwargs):
        """
        @public - update existing mortgages
        """
        fact_find = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        data = kwargs.get('data')
        existing_mortgages_id = data.get('existing_mortgages_id')

        if not fact_find.exists():
            return {'status': 'error', 'message': 'Fact Find record not found'}

        try:
            # Parse dates properly
            remortgage_date = None
            property_purchased_date = None

            if data.get('remortgage_date'):
                try:
                    remortgage_date = datetime.strptime(data.get('remortgage_date'), '%Y-%m-%d').date()
                except:
                    remortgage_date = None

            if data.get('property_purchased_date'):
                try:
                    property_purchased_date = datetime.strptime(data.get('property_purchased_date'), '%Y-%m-%d').date()
                except:
                    property_purchased_date = None

            # Helper function to safely convert to float
            def safe_float(value):
                if value is None or value == '' or value == 0:
                    return 0
                try:
                    return float(value)
                except (ValueError, TypeError):
                    return 0

            # Prepare mortgage data
            mortgage_data = {
                'property_address': data.get('property_address'),
                'usage': data.get('usage'),
                'ownership_of_deed': data.get('ownership_of_deed'),
                'current_property_valuation': safe_float(data.get('current_property_valuation')),
                'outstanding_mortgage_amount': safe_float(data.get('outstanding_mortgage_amount')),
                'monthly_payment': safe_float(data.get('monthly_payment')),
                'lender': data.get('lender'),
                'account_no': data.get('account_no'),
                'rate_type': data.get('rate_type'),
                'current_rate': safe_float(data.get('current_rate')),
                'remaining_term': data.get('remaining_term'),
                'repayment_method': data.get('repayment_method'),
                'remortgage_date': data.get('remortgage_date'),
                'mortgage_case_number': data.get('mortgage_case_number'),
                'property_purchased_date': data.get('property_purchased_date'),
                'property_purchased_price': safe_float(data.get('property_purchased_price')),

            }

            # Check if we're updating an existing record or creating new one
            if existing_mortgages_id and existing_mortgages_id != 'new-existing-mortgages':
                # Update existing mortgage
                mortgage_record = request.env['existing.mortgages'].sudo().browse(int(existing_mortgages_id))
                if mortgage_record.exists():
                    mortgage_record.write(mortgage_data)

                    # Update or create Property Case History - FIX: Added missing fact_find parameter
                    case_history = self._update_or_create_case_history_from_property_and_mortgage(
                        mortgage_record.property_details_id, mortgage_record, fact_find)

                    return {
                        'status': 'success',
                        'message': 'Existing mortgage updated and case history synced successfully',
                        'mortgage_id': mortgage_record.id,
                        'case_history_id': case_history.id,
                    }
                else:
                    return {'status': 'error', 'message': 'Existing mortgage not found'}
            else:
                # Create new mortgage records
                created_mortgages = []
                created_case_histories = []
                lead = fact_find.lead_id

                # If "Belongs To" is true, create records for all fact finds
                if data.get('belongs_to', False):
                    fact_finds = request.env['fact.find'].with_user(SUPERUSER_ID).search([('lead_id', '=', lead.id)])
                    for ff in fact_finds:
                        mortgage_record = request.env['existing.mortgages'].with_user(SUPERUSER_ID).create({
                            'fact_find_id': ff.id,
                            **mortgage_data
                        })
                        created_mortgages.append(mortgage_record)

                        # Link the mortgage record to the fact find
                        ff.sudo().write({
                            'existing_mortgages_ids': [(4, mortgage_record.id)]
                        })

                        if mortgage_record.property_details_id:
                            case_history = self._create_case_history_from_property_and_mortgage(
                                mortgage_record.property_details_id, mortgage_record, ff)
                            created_case_histories.append(case_history)
                else:
                    # Create record only for the current fact find
                    mortgage_record = request.env['existing.mortgages'].with_user(SUPERUSER_ID).create({
                        'fact_find_id': fact_find.id,
                        **mortgage_data
                    })
                    created_mortgages.append(mortgage_record)

                    # Link the mortgage record to the current fact find
                    fact_find.sudo().write({
                        'existing_mortgages_ids': [(4, mortgage_record.id)]
                    })

                    # Create Property Case History for this mortgage - FIX: Added missing fact_find parameter
                    # Note: This assumes property_details_id exists on mortgage_record
                    if mortgage_record.property_details_id:
                        case_history = self._update_or_create_case_history_from_property_and_mortgage(
                            mortgage_record.property_details_id, mortgage_record, fact_find)
                        created_case_histories.append(case_history)

                return {
                    'status': 'success',
                    'message': 'Existing mortgage(s) and case history created successfully',
                    'created_records': len(created_mortgages),
                    'mortgage_id': created_mortgages[0].id if created_mortgages else None,
                    'case_history_id': created_case_histories[0].id if created_case_histories else None,
                }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    # Add this method to your model class (property.case.history)
    def _populate_from_linked_records(self):
        """
        Populate Property Case History fields from linked Property Details and Existing Mortgage records
        """
        if self.property_details_id:
            # Build property address from property details
            address_parts = []
            if self.property_details_id.house_number:
                address_parts.append(self.property_details_id.house_number)
            if self.property_details_id.street_address:
                address_parts.append(self.property_details_id.street_address)
            if self.property_details_id.county:
                address_parts.append(self.property_details_id.county)
            if self.property_details_id.postcode:
                address_parts.append(self.property_details_id.postcode)

            property_address = ', '.join(filter(None, address_parts))

            # Map mortgage type from property usage
            mortgage_type_mapping = {
                'residential': 'residential',
                'second_residential': 'residential',
                'btl': 'buy_to_let',
                'company_btl': 'buy_to_let',
            }

            mortgage_type = mortgage_type_mapping.get(
                self.property_details_id.property_usage,
                'residential'
            )

            # Update fields from property details
            self.write({
                'property_address': property_address,
                'post_code': self.property_details_id.postcode,
                'mortsgage_type': mortgage_type,
                'property_value': self.property_details_id.current_property_valuation,
                'monthly_rental_btl': self.property_details_id.monthly_rental_income,
            })

        if self.existing_mortgage_id:
            # Update fields from existing mortgage - THIS IS THE KEY FIX
            mortgage_updates = {
                'lender_name': self.existing_mortgage_id.lender,  # Map lender to lender_name
                'rate': str(self.existing_mortgage_id.current_rate) if self.existing_mortgage_id.current_rate else '',
                # Map current_rate to rate
                'outstanding_amount': self.existing_mortgage_id.outstanding_mortgage_amount,
                'monthly_mortgage_payment': self.existing_mortgage_id.monthly_payment,
                'latest_case_number': self.existing_mortgage_id.mortgage_case_number,
            }

            # Parse remaining term to extract mortgage term (assuming format like "25 years" or "300 months")
            if self.existing_mortgage_id.remaining_term:
                remaining_term = str(self.existing_mortgage_id.remaining_term).lower()
                if 'year' in remaining_term:
                    try:
                        years = int(''.join(filter(str.isdigit, remaining_term.split('year')[0])))
                        mortgage_updates['mortgage_term'] = years * 12  # Convert to months
                    except:
                        pass
                elif 'month' in remaining_term:
                    try:
                        months = int(''.join(filter(str.isdigit, remaining_term.split('month')[0])))
                        mortgage_updates['mortgage_term'] = months
                    except:
                        pass

            # Update the record with mortgage data
            self.write(mortgage_updates)

    # Updated helper method in your controller
    def _create_case_history_from_property_and_mortgage(self, property_record, mortgage_record, fact_find):
        """
        Helper method to create Property Case History record from both property details and mortgage record
        """
        # Create Property Case History Record with links to both property and mortgage
        case_history_record = request.env['property.case.history'].with_user(SUPERUSER_ID).create({
            'property_id': fact_find.id,
            'property_details_id': property_record.id,
            'existing_mortgage_id': mortgage_record.id,
        })

        # Populate all fields from the linked records (including lender_name and rate)
        case_history_record._populate_from_linked_records()

        return case_history_record

    # Updated helper method for updating existing case history
    def _update_or_create_case_history_from_property_and_mortgage(self, property_record, mortgage_record, fact_find):
        """
        Helper method to update existing or create new Property Case History from property and mortgage
        """
        # Try to find existing case history
        case_history = request.env['property.case.history'].sudo().search([
            ('property_details_id', '=', property_record.id),
            ('existing_mortgage_id', '=', mortgage_record.id)
        ], limit=1)

        if case_history:
            # Update existing case history - it will auto-populate from linked records
            case_history._populate_from_linked_records()
        else:
            # Create new case history
            case_history = self._create_case_history_from_property_and_mortgage(
                property_record, mortgage_record, fact_find
            )

        return case_history

    # Also update the mortgage creation method to ensure proper linking
    def _create_mortgage_from_property(self, property_record, fact_find):
        """
        Helper method to create mortgage record from property details
        """
        # Build property address string
        address_parts = []
        if property_record.house_number:
            address_parts.append(property_record.house_number)
        if property_record.street_address:
            address_parts.append(property_record.street_address)
        if property_record.county:
            address_parts.append(property_record.county)
        if property_record.postcode:
            address_parts.append(property_record.postcode)

        property_address = ', '.join(filter(None, address_parts))

        # Create mortgage record
        mortgage_record = request.env['existing.mortgages'].with_user(SUPERUSER_ID).create({
            'fact_find_id': fact_find.id,
            'property_details_id': property_record.id,
            'property_address': property_address,
            'usage': property_record.property_usage,
            'current_property_valuation': property_record.current_property_valuation,
            'monthly_payment': property_record.monthly_rental_income,
            'ownership_of_deed': '',
            'outstanding_mortgage_amount': 0,
            'lender': '',
            'account_no': '',
            'rate_type': '',
            'current_rate': 0,
            'remaining_term': '',
            'repayment_method': '',
            'mortgage_case_number': '',
            'property_purchased_price': 0,
        })

        # Link the mortgage record to the fact find
        fact_find.sudo().write({
            'existing_mortgages_ids': [(4, mortgage_record.id)]
        })

        return mortgage_record

    @http.route('/get/ff/existing-mortgages', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_existing_mortgages(self, existing_mortgages_id, **kwargs):
        """
        @public - get existing mortgages details for given existing_mortgages_id
        """
        if not existing_mortgages_id:
            return {'error': 'Existing Mortgage ID is required'}

        mortgage_record = request.env['existing.mortgages'].sudo().browse(int(existing_mortgages_id))
        if not mortgage_record.exists():
            return {'error': 'Existing Mortgage record not found'}

        return {
            'existing_mortgages_id': mortgage_record.id,
            'property_address': mortgage_record.property_address or '',
            'property_usage': mortgage_record.usage or '',
            'ownership_of_deed': mortgage_record.ownership_of_deed or '',
            'current_property_valuation': mortgage_record.current_property_valuation or 0,
            'outstanding_mortgage_amount': mortgage_record.outstanding_mortgage_amount or 0,
            'monthly_payment': mortgage_record.monthly_payment or 0,
            'lender_name': mortgage_record.lender or '',
            'account_no': mortgage_record.account_no or '',
            'rate_type': mortgage_record.rate_type or '',
            'current_rate': mortgage_record.current_rate or 0,
            'remaining_term': mortgage_record.remaining_term or '',
            'repayment_method': mortgage_record.repayment_method or '',
            'remortgage_date': mortgage_record.remortgage_date.strftime(
                '%Y-%m-%d') if mortgage_record.remortgage_date else '',
            'mortgage_case_number': mortgage_record.mortgage_case_number or '',
            'property_purchased_date': mortgage_record.property_purchased_date.strftime(
                '%Y-%m-%d') if mortgage_record.property_purchased_date else '',
            'property_purchased_price': mortgage_record.property_purchased_price or 0,
        }

    @http.route('/delete/ff/existing-mortgages', methods=['POST'], type='json', auth='public')
    def ff_delete_existing_mortgages(self, existing_mortgages_id, **kwargs):
        """
        @public - delete existing mortgages
        """
        try:
            mortgage_record = request.env['existing.mortgages'].sudo().browse(int(existing_mortgages_id))
            if mortgage_record.exists():
                mortgage_record.unlink()
                return {'status': 'success', 'message': 'Existing mortgage deleted successfully'}
            else:
                return {'status': 'error', 'message': 'Existing mortgage not found'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    @http.route('/get/ff/employment-details', methods=['POST'], type='json', auth='public')
    def ff_get_employment_details(self, employment_details_id, **kwargs):
        """
        @public - get employment details for given employment details id
        """
        employment_ids = request.env['fact.find'].sudo().browse(
            int(employment_details_id)).employment_ids
        return [{
            'employment_details_id': employmentDetails.id,
            'ni_number': employmentDetails.ni_number,
            'anticipated_retirement_age': employmentDetails.anticipated_retirement_age,
            'employment_basis': employmentDetails.employment_basis,
            'employment_status': employmentDetails.employment_status,
            'occupation': employmentDetails.occupation,
            'occupation_sector': employmentDetails.occupation_sector,
            'occupation_type': employmentDetails.occupation_type,
            'employment_type': employmentDetails.employment_type,
            'employer_name': employmentDetails.employer_name,
            'address_of_working_place': employmentDetails.address_of_working_place,
            'work_telephone': employmentDetails.work_telephone,
            'start_date': employmentDetails.start_date,
            'end_date': employmentDetails.end_date,
            'current_contract_start_date': employmentDetails.current_contract_start_date,
            'current_contract_end_date': employmentDetails.current_contract_end_date,
            'years_of_experience_contract_basis': employmentDetails.years_of_experience_contract_basis,
            'monthly_gross_salary': employmentDetails.monthly_gross_salary,
            'annual_bonus': employmentDetails.annual_bonus,
            'annual_salary': employmentDetails.annual_salary,
            'is_current_employment': employmentDetails.is_current_employment,
            'has_deductions': employmentDetails.has_deductions,
            'student_loans': employmentDetails.student_loans,
            'post_graduate_loan': employmentDetails.post_graduate_loan,
            'gym_membership': employmentDetails.gym_membership,
            'childcare': employmentDetails.childcare,
            'other': employmentDetails.other,
        } for employmentDetails in employment_ids]

    @http.route('/update/fact-find/employment-details', methods=['POST'], type='json', auth='public')
    def ff_update_employment(self, fact_find_id, employment_details_id=None, **kwargs):
        """
        @public - create or update employment details
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        employment_details = kwargs.get('data')

        # Prepare the data dictionary
        data = {
            'fact_find_id': fact_find_id.id,
            'ni_number': employment_details.get('ni_number'),
            'employment_status': employment_details.get('employment_status'),
            'anticipated_retirement_age': employment_details.get('anticipated_retirement_age'),
            'employment_basis': employment_details.get('employment_basis'),
            'occupation': employment_details.get('occupation'),
            'occupation_sector': employment_details.get('occupation_type'),
            'occupation_type': employment_details.get('occupation_sector'),
            'employment_type': employment_details.get('employment_type'),
            'employer_name': employment_details.get('employer_name'),
            'address_of_working_place': employment_details.get('address_of_working_place'),
            'work_telephone': employment_details.get('work_telephone'),
            'start_date': employment_details.get('start_date') or False,
            'end_date': employment_details.get('end_date') or False,
            'current_contract_start_date': employment_details.get('current_contract_start_date') or False,
            'current_contract_end_date': employment_details.get('current_contract_end_date') or False,
            'years_of_experience_contract_basis': employment_details.get('years_of_experience_contract_basis'),
            'monthly_gross_salary': employment_details.get('monthly_gross_salary'),
            'annual_bonus': employment_details.get('annual_bonus'),
            'annual_salary': employment_details.get('annual_salary'),
            'is_current_employment': employment_details.get('is_current_employment'),
            'has_deductions': employment_details.get('has_deductions'),
            'student_loans': employment_details.get('student_loans'),
            'post_graduate_loan': employment_details.get('post_graduate_loan'),
            'gym_membership': employment_details.get('gym_membership'),
            'childcare': employment_details.get('childcare'),
            'other': employment_details.get('other'),
        }

        # Check if this is an update or create operation
        if employment_details_id and employment_details_id != 'new-employment-details':
            # Update existing record
            employment_record = request.env['fact.find.employment'].with_user(SUPERUSER_ID).browse(
                int(employment_details_id))
            if employment_record.exists():
                employment_record.write(data)
                return {'success': True, 'employment_details_id': employment_record.id}
            else:
                return {'error': 'Employment record not found'}
        else:
            # Create new record
            employment_record = request.env['fact.find.employment'].with_user(SUPERUSER_ID).create(data)
            return {'success': True, 'employment_details_id': employment_record.id}

    @http.route('/get/fact-find/employment-details', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_employment_details(self, employment_details_id, **kwargs):
        """
        @public - get employment details for given employment details id
        """
        if employment_details_id is None:
            return {'error': 'Employment details ID is required'}

        employment_details_id = request.env['fact.find.employment'].sudo().browse(int(employment_details_id))
        if not employment_details_id.exists():
            return {'error': 'Employment details not found'}

        return [{
            'employment_details_id': employment_detail.id,  # ADD THIS - Missing ID field
            'employment_type': employment_detail.employment_type,
            'employment_status': employment_detail.employment_status,  # ADD THIS - Missing field
            'occupation': employment_detail.occupation,
            'occupation_sector': employment_detail.occupation_sector,
            'occupation_type': employment_detail.occupation_type,
            'ni_number': employment_detail.ni_number,
            'anticipated_retirement_age': employment_detail.anticipated_retirement_age,  # ADD THIS
            'employment_basis': employment_detail.employment_basis,  # ADD THIS
            'employer_name': employment_detail.employer_name,
            'address_of_working_place': employment_detail.address_of_working_place,
            'work_telephone': employment_detail.work_telephone,
            'start_date': employment_detail.start_date,
            'end_date': employment_detail.end_date,
            'current_contract_start_date': employment_detail.current_contract_start_date,
            'current_contract_end_date': employment_detail.current_contract_end_date,
            'years_of_experience_contract_basis': employment_detail.years_of_experience_contract_basis,
            'monthly_gross_salary': employment_detail.monthly_gross_salary,
            'annual_bonus': employment_detail.annual_bonus,
            'annual_salary': employment_detail.annual_salary,
            'is_current_employment': employment_detail.is_current_employment,
            'has_deductions': employment_detail.has_deductions,
            'student_loans': employment_detail.student_loans,
            'post_graduate_loan': employment_detail.post_graduate_loan,
            'gym_membership': employment_detail.gym_membership,
            'childcare': employment_detail.childcare,
            'other': employment_detail.other,
        } for employment_detail in employment_details_id]

    @http.route('/delete/fact-find/employment-details', methods=['POST'], type='json', auth='public')
    def ff_delete_employment_details(self, employment_details_id, **kwargs):
        """
        @public - delete employment details
        """
        request.env['fact.find.employment'].sudo().browse(int(employment_details_id)).unlink()

    @http.route('/get/ff/self-employment-details', methods=['POST'], type='json', auth='public')
    def ff_get_self_employment_details(self, self_employment_details_id, **kwargs):
        """
        @public - get self employment details for given self employment details id
        """
        self_employment_ids = request.env['fact.find'].sudo().browse(
            int(self_employment_details_id)).self_employment_ids
        return [{
            'self_employment_details_id': self_employment_detail.id,  # ADD THIS - Missing ID field
            'business_name': self_employment_detail.business_name,
            'self_employed_occupation': self_employment_detail.self_employed_occupation,
            'self_employment_start_date': self_employment_detail.self_employment_start_date,
            'tax_year_1': self_employment_detail.tax_year_1,
            'year_1_tax_income': self_employment_detail.year_1_tax_income,
            'tax_year_2': self_employment_detail.tax_year_2,
            'year_2_tax_income': self_employment_detail.year_2_tax_income,
            'business_address': self_employment_detail.business_address,
            'business_contact_no': self_employment_detail.business_contact_no,
            'has_business_bank_account': self_employment_detail.has_business_bank_account,
            'has_accountant': self_employment_detail.has_accountant,
            'accountant_firm_name': self_employment_detail.accountant_firm_name,
            'accountant_address': self_employment_detail.accountant_address,
            'accountant_contact_no': self_employment_detail.accountant_contact_no,
            'accountant_qualification': self_employment_detail.accountant_qualification,
            'let_properties_count_new': self_employment_detail.let_properties_count_new,
            'self_employment_type': self_employment_detail.self_employment_type,
            # Add other fields as needed
        } for self_employment_detail in self_employment_ids]

    @http.route('/update/fact-find/self-employment-details', methods=['POST'], type='json', auth='public')
    def ff_update_self_employment(self, fact_find_id, self_employment_details_id=None, **kwargs):
        """
        @public - create or update self employment details
        """
        fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
        self_employment_details = kwargs.get('data')

        # Prepare the data dictionary
        data = {
            'fact_find_id': fact_find_id.id,
            'business_name': self_employment_details.get('business_name'),
            'self_employed_occupation': self_employment_details.get('self_employed_occupation'),
            'self_employment_start_date': self_employment_details.get('self_employment_start_date') or False,
            'tax_year_1': self_employment_details.get('tax_year_1'),
            'year_1_tax_income': self_employment_details.get('year_1_tax_income'),
            'tax_year_2': self_employment_details.get('tax_year_2'),
            'year_2_tax_income': self_employment_details.get('year_2_tax_income'),
            'business_address': self_employment_details.get('business_address'),
            'business_contact_no': self_employment_details.get('business_contact'),
            'has_business_bank_account': self_employment_details.get('business_bank_account'),
            'has_accountant': self_employment_details.get('has_accountant'),
            'accountant_firm_name': self_employment_details.get('firm_name'),
            'accountant_address': self_employment_details.get('accountant_address'),
            'accountant_contact_no': self_employment_details.get('contact_number'),
            'accountant_qualification': self_employment_details.get('qualification'),
            'let_properties_count_new': self_employment_details.get('let_properties_count_new'),
            'self_employment_type': self_employment_details.get('self_employment_type'),
        }

        # Check if this is an update or create operation
        if self_employment_details_id and self_employment_details_id != 'new-self-employment-details':
            # Update existing record
            self_employment_record = request.env['self.employed'].with_user(SUPERUSER_ID).browse(
                int(self_employment_details_id))
            if self_employment_record.exists():
                self_employment_record.write(data)
                return {'success': True, 'id': self_employment_record.id,
                        'message': 'Self employment details updated successfully'}
            else:
                return {'error': 'Self employment record not found'}
        else:
            # Create new record
            new_record = request.env['self.employed'].with_user(SUPERUSER_ID).create(data)
            return {'success': True, 'id': new_record.id, 'message': 'Self employment details created successfully'}

    @http.route('/get/fact-find/self-employment-details', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_self_employment_details(self, self_employment_details_id, **kwargs):
        """
        @public - get self employment details for given self employment details id
        """
        if not self_employment_details_id:
            return {'error': 'Self employment details ID is required'}

        # This should browse the self.employed model directly, not fact.find
        self_employment_record = request.env['self.employed'].sudo().browse(int(self_employment_details_id))
        if not self_employment_record.exists():
            return {'error': 'Self employment details not found'}

        return [{
            'self_employment_details_id': self_employment_record.id,
            'fact_find_id': self_employment_record.fact_find_id.id,
            'is_self_employed': self_employment_record.is_self_employed,
            'business_name': self_employment_record.business_name,
            'self_employed_occupation': self_employment_record.self_employed_occupation,
            'self_employment_start_date': self_employment_record.self_employment_start_date,
            'tax_year_1': self_employment_record.tax_year_1,
            'year_1_tax_income': self_employment_record.year_1_tax_income,
            'tax_year_2': self_employment_record.tax_year_2,
            'year_2_tax_income': self_employment_record.year_2_tax_income,
            'business_address': self_employment_record.business_address,
            'business_contact_no': self_employment_record.business_contact_no,
            'has_business_bank_account': self_employment_record.has_business_bank_account,
            'has_accountant': self_employment_record.has_accountant,
            'accountant_firm_name': self_employment_record.accountant_firm_name,
            'accountant_address': self_employment_record.accountant_address,
            'accountant_contact_no': self_employment_record.accountant_contact_no,
            'accountant_qualification': self_employment_record.accountant_qualification,
            'let_properties_count_new': self_employment_record.let_properties_count_new,
            'self_employment_type': self_employment_record.self_employment_type,
            'property_type': self_employment_record.property_type,
            'firm_name': self_employment_record.firm_name,
            'address': self_employment_record.address,
            'contact_number': self_employment_record.contact_number,
            'qualification': self_employment_record.qualification,
        }]  # Return single record, not list comprehension

    @http.route('/delete/fact-find/self-employment-details', methods=['POST'], type='json', auth='public')
    def ff_delete_self_employment_details(self, self_employment_details_id, **kwargs):
        """
        @public - delete self employment details
        """
        request.env['self.employed'].sudo().browse(int(self_employment_details_id)).unlink()
        return {'success': True, 'message': 'Self employment details deleted successfully'}

    @http.route('/get/ff/protection-details', methods=['POST'], type='json', auth='public')
    def ff_get_protection_details(self, protection_details_id, **kwargs):
        """
        @public - get protection details for given protection details id
        """
        protection_ids = request.env['fact.find'].sudo().browse(
            int(protection_details_id)).protection_ids
        return [{
            'protection_details_id': protectionDetails.id,
            'insurance_provider': protectionDetails.insurance_provider,
            'monthly_premium': protectionDetails.monthly_premium,
            'protection_type': protectionDetails.protection_type,
            # Add other fields as needed
        } for protectionDetails in protection_ids]

    @http.route('/update/fact-find/protection-details', methods=['POST'], type='json', auth='public')
    def ff_update_protection_details(self, fact_find_id=None, protection_details_id=None, **kwargs):
        """
        @public - create or update protection details
        """
        # Add validation for fact_find_id
        if not fact_find_id:
            return {'error': 'Fact find ID is required'}

        try:
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_record.exists():
                return {'error': 'Fact find record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid fact find ID'}

        protection_details = kwargs.get('data')
        if not protection_details:
            return {'error': 'Protection details data is required'}

        # Prepare the data dictionary
        data = {
            'fact_find_id': fact_find_record.id,
            'insurance_provider': protection_details.get('insurance_provider'),
            'monthly_premium': protection_details.get('monthly_premium'),
            'protection_type': protection_details.get('protection_type'),
        }

        # Check if this is an update or create operation
        if protection_details_id and protection_details_id != 'new-protection-details':
            try:
                # Update existing record
                protection_record = request.env['protection.details'].with_user(SUPERUSER_ID).browse(
                    int(protection_details_id))
                if protection_record.exists():
                    protection_record.write(data)
                    return {'success': True, 'protection_details_id': protection_record.id}
                else:
                    return {'error': 'Protection record not found'}
            except (ValueError, TypeError):
                return {'error': 'Invalid protection details ID'}
        else:
            # Create new record
            protection_record = request.env['protection.details'].with_user(SUPERUSER_ID).create(data)
            return {'success': True, 'protection_details_id': protection_record.id}

    @http.route('/get/fact-find/protection-details', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_protection_details(self, protection_details_id, **kwargs):
        """
        @public - get protection details for given protection details id
        """
        if protection_details_id is None:
            return {'error': 'Protection details ID is required'}

        try:
            protection_record = request.env['protection.details'].sudo().browse(int(protection_details_id))
            if not protection_record.exists():
                return {'error': 'Protection details not found'}

            return [{
                'protection_details_id': protection_record.id,
                'insurance_provider': protection_record.insurance_provider,
                'monthly_premium': protection_record.monthly_premium,
                'protection_type': protection_record.protection_type,
                # Add other fields as needed
            }]
        except (ValueError, TypeError):
            return {'error': 'Invalid protection details ID'}

    @http.route('/delete/fact-find/protection-details', methods=['POST'], type='json', auth='public')
    def ff_delete_protection_details(self, protection_details_id, **kwargs):
        """
        @public - delete protection details
        """
        try:
            protection_record = request.env['protection.details'].sudo().browse(int(protection_details_id))
            if protection_record.exists():
                protection_record.unlink()
                return {'success': True}
            else:
                return {'error': 'Protection record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid protection details ID'}

    @http.route('/get/ff/past-travels', methods=['POST'], type='json', auth='public')
    def ff_get_past_travels(self, fact_find_id, **kwargs):  # Changed parameter name
        """
        @public - get past travel details for given fact find id
        """
        try:
            fact_find_record = request.env['fact.find'].sudo().browse(int(fact_find_id))
            if not fact_find_record.exists():
                return {'error': 'Fact find record not found'}

            past_travel_records = fact_find_record.past_travel_ids
            return [{
                'past_travel_id': travel.id,  # Added missing ID
                'country': travel.country.id if travel.country else False,  # Added country ID
                'country_name': travel.country.name if travel.country else '',
                'travel_from_date': travel.travel_from_date,
                'travel_to_date': travel.travel_to_date,
            } for travel in past_travel_records]
        except (ValueError, TypeError):
            return {'error': 'Invalid fact find ID'}

    @http.route('/update/fact-find/past-travel', type='json', auth='public', methods=['POST'])
    def ff_update_past_travel(self, fact_find_id, **kwargs):
        """
        @public - create or update past travel record
        """
        # Add validation for fact_find_id
        if not fact_find_id:
            return {'error': 'Fact find ID is required'}

        try:
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_record.exists():
                return {'error': 'Fact find record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid fact find ID'}

        data = kwargs.get('data')
        if not data:
            return {'error': 'Past travel data is required'}

        # Prepare the data dictionary
        past_travel_data = {
            'fact_find_id': fact_find_record.id,
            'country': int(data.get('country')) if data.get('country') else False,
            'travel_from_date': data.get('travel_from_date') or False,
            'travel_to_date': data.get('travel_to_date') or False,
        }

        past_travel_id = data.get('past_travel_id')

        # Check if this is an update or create operation
        if past_travel_id and past_travel_id != 'new-past-travel':
            try:
                # Update existing record
                past_travel_record = request.env['past.travel'].with_user(SUPERUSER_ID).browse(
                    int(past_travel_id))
                if past_travel_record.exists():
                    past_travel_record.write(past_travel_data)

                    # Return updated record data
                    return {
                        'success': True,
                        'past_travel_id': past_travel_record.id,
                        'country': past_travel_record.country.id if past_travel_record.country else False,
                        'country_name': past_travel_record.country.name if past_travel_record.country else '',
                        'travel_from_date': past_travel_record.travel_from_date,
                        'travel_to_date': past_travel_record.travel_to_date,
                    }
                else:
                    return {'error': 'Past travel record not found'}
            except (ValueError, TypeError):
                return {'error': 'Invalid past travel ID'}
        else:
            # Create new record
            past_travel_record = request.env['past.travel'].with_user(SUPERUSER_ID).create(past_travel_data)

            # Return created record data
            return {
                'success': True,
                'past_travel_id': past_travel_record.id,
                'country': past_travel_record.country.id if past_travel_record.country else False,
                'country_name': past_travel_record.country.name if past_travel_record.country else '',
                'travel_from_date': past_travel_record.travel_from_date,
                'travel_to_date': past_travel_record.travel_to_date,
            }

    @http.route('/get/fact-find/past-travel', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_past_travel(self, past_travel_id, **kwargs):
        """
        @public - get past travel details for given past travel id
        """
        if past_travel_id is None:
            return {'error': 'Past travel ID is required'}

        try:
            past_travel_record = request.env['past.travel'].sudo().browse(int(past_travel_id))
            if not past_travel_record.exists():
                return {'error': 'Past travel not found'}

            return {
                'past_travel_id': past_travel_record.id,
                'country': past_travel_record.country.id if past_travel_record.country else False,
                'country_name': past_travel_record.country.name if past_travel_record.country else '',
                'travel_from_date': past_travel_record.travel_from_date,
                'travel_to_date': past_travel_record.travel_to_date,
            }
        except (ValueError, TypeError):
            return {'error': 'Invalid past travel ID'}

    @http.route('/delete/fact-find/past-travel', methods=['POST'], type='json', auth='public')
    def ff_delete_past_travel(self, past_travel_id, **kwargs):
        """
        @public - delete past travel record
        """
        try:
            past_travel_record = request.env['past.travel'].sudo().browse(int(past_travel_id))
            if past_travel_record.exists():
                past_travel_record.unlink()
                return {'success': True}
            else:
                return {'error': 'Past travel record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid past travel ID'}

    @http.route('/get/ff/health-conditions', methods=['POST'], type='json', auth='public')
    def ff_get_health_condition(self, health_condition_id, **kwargs):
        """
        @public - get health conditions for given fact find id
        """
        health_ids = request.env['fact.find'].sudo().browse(
            int(health_condition_id)).health_condition_ids
        return [{
            'health_condition_id': health_condition.id,  # ADD THIS - Missing ID field
            'reported': health_condition.reported,
            'details': health_condition.details,
            'diagnosed_date': health_condition.diagnosed_date,
            'last_review_date': health_condition.last_review_date,
            'last_episode_date': health_condition.last_episode_date,
            'next_review_date': health_condition.next_review_date,
            'waiting_referral': health_condition.waiting_referral,
            'medicine_count': health_condition.medicine_count,
            'currently_taking_medicine': health_condition.currently_taking_medicine,
        } for health_condition in health_ids]

    @http.route('/update/fact-find/health-conditions', methods=['POST'], type='json', auth='public')
    def ff_update_health_conditions(self, fact_find_id=None, health_condition_id=None, **kwargs):
        """
        @public - create or update health conditions
        """
        # Add validation for fact_find_id
        if not fact_find_id:
            return {'error': 'Fact find ID is required'}

        try:
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_record.exists():
                return {'error': 'Fact find record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid fact find ID'}

        health_condition_details = kwargs.get('data')
        if not health_condition_details:
            return {'error': 'Health condition data is required'}

        # Prepare the data dictionary
        data = {
            'fact_find_id': fact_find_record.id,
            'reported': health_condition_details.get('reported'),
            'details': health_condition_details.get('details'),
            'diagnosed_date': health_condition_details.get('diagnosed_date') or False,
            'last_review_date': health_condition_details.get('last_review_date') or False,
            'last_episode_date': health_condition_details.get('last_episode_date') or False,
            'next_review_date': health_condition_details.get('next_review_date') or False,
            'waiting_referral': health_condition_details.get('waiting_referral'),
            'medicine_count': health_condition_details.get('medicine_count'),
            'currently_taking_medicine': health_condition_details.get('currently_taking_medicine'),
        }

        # Check if this is an update or create operation
        if health_condition_id and health_condition_id != 'new-health-condition':
            try:
                # Update existing record
                health_condition_record = request.env['health.condition'].with_user(SUPERUSER_ID).browse(
                    int(health_condition_id))
                if health_condition_record.exists():
                    health_condition_record.write(data)
                    return {'success': True, 'health_condition_id': health_condition_record.id}
                else:
                    return {'error': 'Health condition record not found'}
            except (ValueError, TypeError):
                return {'error': 'Invalid health condition ID'}
        else:
            # Create new record
            health_condition_record = request.env['health.condition'].with_user(SUPERUSER_ID).create(data)
            return {'success': True, 'health_condition_id': health_condition_record.id}

    @http.route('/get/fact-find/health-condition', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_health_condition(self, health_condition_id, **kwargs):
        """
        @public - get health condition details for given health condition id
        """
        if health_condition_id is None:
            return {'error': 'Health condition ID is required'}

        try:
            health_condition_record = request.env['health.condition'].sudo().browse(int(health_condition_id))
            if not health_condition_record.exists():
                return {'error': 'Health condition not found'}

            return [{
                'health_condition_id': health_condition_record.id,
                'reported': health_condition_record.reported,
                'details': health_condition_record.details,
                'diagnosed_date': health_condition_record.diagnosed_date,
                'last_review_date': health_condition_record.last_review_date,
                'last_episode_date': health_condition_record.last_episode_date,
                'next_review_date': health_condition_record.next_review_date,
                'waiting_referral': health_condition_record.waiting_referral,
                'medicine_count': health_condition_record.medicine_count,
                'currently_taking_medicine': health_condition_record.currently_taking_medicine,
            }]
        except (ValueError, TypeError):
            return {'error': 'Invalid health condition ID'}

    @http.route('/delete/fact-find/health-condition', methods=['POST'], type='json', auth='public')
    def ff_delete_health_condition(self, health_condition_id, **kwargs):
        """
        @public - delete health condition
        """
        try:
            health_condition_record = request.env['health.condition'].sudo().browse(int(health_condition_id))
            if health_condition_record.exists():
                health_condition_record.unlink()
                return {'success': True}
            else:
                return {'error': 'Health condition record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid health condition ID'}

    @http.route('/get/ff/future-travels', methods=['POST'], type='json', auth='public')
    def ff_get_future_travels(self, future_travel_id, **kwargs):
        """
        @public - get future travel details for given fact find id
        """
        future_travel_ids = request.env['fact.find'].sudo().browse(int(future_travel_id)).future_travel_ids
        return [{
            'future_travel_id': travel.id,  # Added missing ID field
            'country_name': travel.country.name if travel.country else 'N/A',  # Get country name, not ID
            'travel_from_date': travel.travel_from_date.strftime('%Y-%m-%d') if travel.travel_from_date else '',
            'travel_to_date': travel.travel_to_date.strftime('%Y-%m-%d') if travel.travel_to_date else '',
        } for travel in future_travel_ids]

    @http.route('/update/fact-find/future-travel', type='json', auth='public', methods=['POST'])
    def ff_update_future_travel(self, fact_find_id, future_travel_id=None, **kwargs):
        """
        @public - create or update future travel record
        """
        # Add validation for fact_find_id
        if not fact_find_id:
            return {'error': 'Fact find ID is required'}

        try:
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_record.exists():
                return {'error': 'Fact find record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid fact find ID'}

        data = kwargs.get('data')
        if not data:
            return {'error': 'Future travel data is required'}

        # Prepare the data dictionary
        travel_data = {
            'fact_find_id': fact_find_record.id,
            'country': int(data.get('country')) if data.get('country') else False,
            'travel_from_date': data.get('travel_from_date') or False,
            'travel_to_date': data.get('travel_to_date') or False,
        }

        # Check if this is an update or create operation
        if future_travel_id and future_travel_id != 'new-future-travel' and future_travel_id is not None:
            try:
                # Update existing record
                travel_record = request.env['future.travel'].with_user(SUPERUSER_ID).browse(int(future_travel_id))
                if travel_record.exists():
                    travel_record.write(travel_data)
                    return {'success': True, 'future_travel_id': travel_record.id}
                else:
                    return {'error': 'Future travel record not found'}
            except (ValueError, TypeError):
                return {'error': 'Invalid future travel ID'}
        else:
            # Create new record
            travel_record = request.env['future.travel'].with_user(SUPERUSER_ID).create(travel_data)
            return {'success': True, 'future_travel_id': travel_record.id}

    @http.route('/get/fact-find/future-travel', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_future_travel(self, future_travel_id, **kwargs):
        """
        @public - get future travel details for given future travel id
        """
        if future_travel_id is None:
            return {'error': 'Future travel ID is required'}

        try:
            travel_record = request.env['future.travel'].sudo().browse(int(future_travel_id))
            if not travel_record.exists():
                return {'error': 'Future travel not found'}

            return {
                'select[name="country_future"]': travel_record.country.id if travel_record.country else '',
                'input[name="travel_from_date_future"]': travel_record.travel_from_date.strftime(
                    '%Y-%m-%d') if travel_record.travel_from_date else '',
                'input[name="travel_to_date_future"]': travel_record.travel_to_date.strftime(
                    '%Y-%m-%d') if travel_record.travel_to_date else '',
            }
        except (ValueError, TypeError):
            return {'error': 'Invalid future travel ID'}

    @http.route('/delete/fact-find/future-travel', methods=['POST'], type='json', auth='public')
    def ff_delete_future_travel(self, future_travel_id, **kwargs):
        """
        @public - delete future travel record
        """
        try:
            travel_record = request.env['future.travel'].sudo().browse(int(future_travel_id))
            if travel_record.exists():
                travel_record.unlink()
                return {'success': True}
            else:
                return {'error': 'Future travel record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid future travel ID'}

    @http.route('/get/ff/critical-illnesses', methods=['POST'], type='json', auth='public')
    def ff_get_critical_illnesses(self, critical_illness_id, **kwargs):
        """
        @public - get critical illness details for given fact find id
        """
        critical_illness_records = request.env['fact.find'].sudo().browse(int(critical_illness_id)).critical_illness_ids
        return [{
            'critical_illness_id': illness.id,  # This ID is crucial for edit/delete functionality
            'relationship': illness.relationship,
            'critical_illness': illness.critical_illness,
            'age_of_diagnosed': illness.age_of_diagnosed,
        } for illness in critical_illness_records]

    @http.route('/update/fact-find/critical-illness', type='json', auth='public', methods=['POST'])
    def ff_update_critical_illness(self, fact_find_id, critical_illness_id=None, **kwargs):
        """
        @public - create or update critical illness record
        """
        # Add validation for fact_find_id
        if not fact_find_id:
            return {'error': 'Fact find ID is required'}

        try:
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_record.exists():
                return {'error': 'Fact find record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid fact find ID'}

        data = kwargs.get('data')
        if not data:
            return {'error': 'Critical illness data is required'}

        # Prepare the data dictionary
        illness_data = {
            'fact_find_id': fact_find_record.id,
            'relationship': data.get('relationship'),
            'critical_illness': data.get('critical_illness'),
            'age_of_diagnosed': data.get('age_of_diagnosed'),
        }

        # Check if this is an update or create operation
        if critical_illness_id and critical_illness_id != 'new-critical-illness' and critical_illness_id is not None:
            try:
                # Update existing record
                illness_record = request.env['critical.illness'].with_user(SUPERUSER_ID).browse(
                    int(critical_illness_id))
                if illness_record.exists():
                    illness_record.write(illness_data)
                    return {'success': True, 'critical_illness_id': illness_record.id}
                else:
                    return {'error': 'Critical illness record not found'}
            except (ValueError, TypeError):
                return {'error': 'Invalid critical illness ID'}
        else:
            # Create new record
            illness_record = request.env['critical.illness'].with_user(SUPERUSER_ID).create(illness_data)
            return {'success': True, 'critical_illness_id': illness_record.id}

    @http.route('/get/fact-find/critical-illness', methods=['POST'], type='json', auth='public')
    def ff_get_fact_find_critical_illness(self, critical_illness_id, **kwargs):
        """
        @public - get critical illness details for given critical illness id
        """
        if critical_illness_id is None:
            return {'error': 'Critical illness ID is required'}

        try:
            illness_record = request.env['critical.illness'].sudo().browse(int(critical_illness_id))
            if not illness_record.exists():
                return {'error': 'Critical illness not found'}

            return {
                'input[name="relationship"]': illness_record.relationship or '',
                'input[name="critical_illness"]': illness_record.critical_illness or '',
                'input[name="age_of_diagnosed"]': illness_record.age_of_diagnosed or '',
            }
        except (ValueError, TypeError):
            return {'error': 'Invalid critical illness ID'}

    @http.route('/delete/fact-find/critical-illness', methods=['POST'], type='json', auth='public')
    def ff_delete_critical_illness(self, critical_illness_id, **kwargs):
        """
        @public - delete critical illness record
        """
        try:
            illness_record = request.env['critical.illness'].sudo().browse(int(critical_illness_id))
            if illness_record.exists():
                illness_record.unlink()
                return {'success': True}
            else:
                return {'error': 'Critical illness record not found'}
        except (ValueError, TypeError):
            return {'error': 'Invalid critical illness ID'}

    @http.route('/upload/further/documents', methods=['POST'], type='json', auth='public')
    def upload_further_document(self, data, doc_request_id, doc_name, **kwargs):
        """
        @public - upload further document to the system
        """
        attachment_id = request.env['ir.attachment'].with_user(SUPERUSER_ID).create([{
            'datas': data.split(',')[1].encode('utf-8'),
            'name': doc_name
        }])
        doc_request_id = request.env['bvs.document'].with_user(SUPERUSER_ID).browse(int(doc_request_id))
        doc_request_id.update({
            'attachment_ids': [(4, attachment.id) for attachment in attachment_id],
        })

        doc_request_id.send_further_document_email()
        return {
            'doc_id': attachment_id.id,
            'name': attachment_id.display_name,
        }

    @http.route('/ff/upload/documents', methods=['POST'], type='json', auth='public')
    def upload_fact_find_document(self, data, section, with_label, doc_name, fact_find_id, **kwargs):
        """
        @public - Upload, create and attach the document to the appropriate field in fact.find
        """
        try:
            # Create the attachment
            attachment_id = request.env['ir.attachment'].sudo().create([{
                'datas': data.split(',')[1].encode('utf-8'),
                'name': doc_name
            }])

            field_name = 'alteration_passport'  # Default fallback

            if with_label and section:
                # Try to find the field in fact.find using the label (field_description)
                field = request.env['ir.model.fields'].sudo().search([
                    ('model', '=', 'fact.find'),
                    ('field_description', '=', section)
                ], limit=1)
                if field:
                    field_name = field.name
                else:
                    return {'error': f"No field found for label '{section}'."}

            # Attach the file to the dynamic field
            fact_find = request.env['fact.find'].sudo().browse(int(fact_find_id))
            fact_find.write({
                field_name: [(4, x.id) for x in attachment_id]
            })

            return {
                'id': attachment_id.id,
                'name': attachment_id.name,
            }

        except Exception as e:
            return {'error': str(e)}

    @http.route('/delete/document', methods=['POST'], type='json', auth='public')
    def delete_fact_find_document(self, attachment_id, **kwargs):
        """
        @public - delete fact-find attachment
        """
        request.env['ir.attachment'].with_user(SUPERUSER_ID).browse(int(attachment_id)).unlink()
        return []

    @http.route('/get/fact-finds', methods=['POST'], type='json', auth='public')
    def get_fact_finds(self, **kwargs):
        """
        @public - get all fact-finds for current user, including associated lead name and fact find name
        """
        partner = request.env.user.partner_id
        leads = partner.lead_ids
        fact_finds = leads.mapped('fact_find_ids')

        # Filter fact finds based on the 'is_private' field of the lead
        filtered_fact_finds = []
        for lead in leads:
            if lead.is_private:
                # If the lead is private, only load fact finds for the current partner
                filtered_fact_finds.extend([ff for ff in fact_finds if ff.partner_id == partner])
            else:
                # If the lead is not private, load all fact finds for the lead
                filtered_fact_finds.extend(lead.fact_find_ids)

        # Return fact find details with partner name, lead registration number, and fact find name
        result = []
        for fact_find in filtered_fact_finds:
            # Get partner name safely
            partner_name = fact_find.partner_id.name if fact_find.partner_id else 'Unknown Partner'

            # Get lead registration number safely
            lead_registration_no = ''
            if fact_find.lead_id and fact_find.lead_id.registration_no:
                lead_registration_no = fact_find.lead_id.registration_no
            elif fact_find.lead_id and hasattr(fact_find.lead_id, 'name') and fact_find.lead_id.name:
                lead_registration_no = fact_find.lead_id.name
            else:
                lead_registration_no = 'No Lead'

            # Get fact find name safely - check multiple possible field names
            fact_find_name = ''
            if hasattr(fact_find, 'name') and fact_find.name:
                fact_find_name = fact_find.name
            elif hasattr(fact_find, 'display_name') and fact_find.display_name:
                fact_find_name = fact_find.display_name
            else:
                fact_find_name = f"Fact Find #{fact_find.id}"

            result.append({
                'id': fact_find.id,
                'name': partner_name,  # Keep original 'name' field for compatibility
                'partner_name': partner_name,
                'lead_registration_no': lead_registration_no,
                'fact_find_name': fact_find_name,
                'lead_name': lead_registration_no,  # Keep original 'lead_name' field for compatibility
            })

        return result

    @http.route('/get/fact-find-documents', methods=['POST'], type='json', auth='public')
    def get_fact_find_documents(self, fact_find_id, **kwargs):
        """
        @public - get all fact-find related documents
        """

        def _get_fact_find_documents(field_names):
            return {
                field_name[1]: {
                    'field_key': field_name[0],
                    'documents': [{
                        'id': document.id,
                        'name': document.display_name,
                        'access_token': document.access_token
                    } for document in
                        request.env['fact.find'].with_user(SUPERUSER_ID).browse(fact_find_id).mapped(field_name[0])]
                } for
                field_name in field_names
            }

        return {
            doc[0]: _get_fact_find_documents(doc[1])
            for doc in [
                ('identity', [
                    ('alteration_passport', 'Alteration page in the passport if available / Change of name deed'),
                    ('passport_pages',
                     'Scanned copy of the first 2 pages of the duly signed passport in white background without cropping the edges'),
                    ('expired_passport_driving_license',
                     'Scanned copy of the two sides of Driving License if passport is expired'),
                    # FIXED: was 'driving_license'
                    ('brp_visa_stamp',
                     'Scanned copy of both sides of your BRP / Visa Stamp if applicable only with the first two pages of the old passport'),
                    ('sharecode_immigration_status', 'Sharecode for Immigration Status downloaded by HMRC')
                ]),
                ('address', [
                    ('electricity_bill',
                     'One of the following documents issued within last 3 months (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement) / Latest Council tax bill'),
                    ('gas_bill',
                     'One of the following documents issued within last 3 months received via post since the online documents are not acceptable (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement)'),
                    ('land_phone_bill',
                     'One of the following documents issued within last 3 months received via post since the online documents are not acceptable (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement)'),
                    ('credit_card_bill',
                     'One of the following documents issued within last 3 months received via post since the online documents are not acceptable (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement)'),
                    ('bank_statement',
                     'One of the following documents issued within last 3 months received via post since the online documents are not acceptable (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement)'),
                    ('driving_license_proof_address',
                     'Scanned copy of both sides of the driving license as proof of address')
                ]),
                ('financial', [
                    ('employment_appointment_letter',
                     'Scanned copy of the duly signed, all pages of employment appointment letter evidencing the working hours and remuneration'),
                    ('employment_contract', 'Scanned copy of the duly signed letter of current contract'),
                    ('last_2_years_bonus_payslips', 'Last 2 years bonus payslips of each employment'),
                    ('last_3_months_payslips', 'Latest 3 months payslips of each employment'),
                    ('last_2_years_p60', 'Last 2 years P60'),
                    ('last_3_months_bank_statements_salary',
                     'Latest 3 months bank statements by showing salary credit which clearly show the account number, sort code, account holder\'s name and address'),
                    ('salary_increment_letter', 'Salary increment letter if any pay rise available in last 3 months'),
                    ('name_confirmation_letter',
                     'Name confirmation letter issued by the employer If the name in the payslip is different from the bank statement'),
                    ('last_3_months_bank_statements_pension',
                     'Latest 3 months bank statements by showing the pension credit which clearly show the account number, sort code, account holder\'s name and address'),
                    ('pension_forecast_statement',
                     'Private or Company Pension Forecast / State Pension Statement or Annuity Statement dated within the last 3 months'),
                    ('last_2_years_tax_calculations', 'Last two years tax calculations (SA302)'),
                    ('last_2_years_tax_year_overview', 'Last two years tax year Overview'),
                    ('last_2_years_tax_returns', 'Last 2 years Tax Returns (SA100)'),
                    ('latest_3_months_company_bank_statements', 'Latest 3 months company bank statements'),
                    ('signed_finalized_latest_2_years_company_accounts',
                     'Signed and finalized Latest 2 years company accounts'),
                    ('other_income_bank_statements',
                     'Latest 3 months bank statements showing the credit of the other income which clearly show the account number, sort code, account holder\'s name and address'),
                    ('tax_credit_statement',
                     'Scanned copy of all pages of the statement issued from the HMRC for tax credits (including the blank pages)'),
                    ('universal_tax_credit_statements', 'Latest 3 months statements of universal tax credit'),
                    ('child_tax_credit_award_letter',
                     'Scanned copy of all pages of the Child Tax credit award letter issued by DWP (including blank pages)'),
                    ('pip_dla_letter',
                     'Scanned copy of all pages of the PIP / DLA letter issued by DWP (including blank pages)'),
                    ('latest_multi_agency_credit_report', 'Latest multi agency credit report generated within 2 weeks'),
                    ('latest_clearance_statement',
                     'Latest clearance statement if any commitment has been paid off in last month'),
                    ('monthly_expenses_bank_statements',
                     'Latest 3 months bank statements showing monthly expenses if the statement is different from salary credit which clearly show the account number, sort code, account holders name and address'),
                    ('bank_statement_name_confirmation',
                     'If the name in the bank statement is different from the passport, name confirmation letter from the bank'),
                    ('requested_direct_debit_bank_statement',  # FIXED: was 'direct_debit_account_bank_statements'
                     'Latest bank statement of requested Direct debit account which clearly shows the account number, sort code, account holder\'s name and address'),
                    ('spv_bank_statements', 'Latest 3 months bank statements of the SPV'),  # ADDED
                    ('gifted_deposit_format', 'Format of gifted deposit (editable pdf)'),  # ADDED
                    ('gifted_deposit_bank_statements', 'Latest 3 months bank statemnets of each account which shows source of deposit with the front page of account holder\'s name, address, sort code '),  # ADDED
                    ('latest_3_months_bank_statements_rental',
                     'Latest 3 months bank statements by evidencing the credit of monthly rental'),  # ADDED
                    ('latest_3_months_bank_statements_mortgage',
                     'Latest 3 months bank statements by evidencing the mortgage payment of BTL property')  # ADDED
                ]),
                ('property', [
                    ('reservation_form', 'Reservation Form'),
                    ('cml_form', 'CML form'),
                    ('memorandum_of_sale', 'Memorandum of Sale'),
                    ('epc', 'EPC'),
                    ('pea', 'PEA'),
                    ('tenancy_agreement', 'Tenancy Agreement if BTL remortgage'),
                    ('arla_letter',
                     'ARLA letter issued by an ARLA registered estate agent confirming the expected monthly rental income'),
                    ('sales_particular', 'Sales Particular'),
                    ('tenancy_agreements_multiple_occupants', 'Tenancy Agreements issued for multiple occupants')
                ]),
                ('mortgage', [
                    ('mortgage_statement', 'Mortgage statement showing the monthly payments'),
                    ('annual_payment_information_letter', 'Latest annual payment information letter for HTB loan')
                ])
            ]
        }

    # @http.route(['/fact_find/form/<int:fact_find_id>'], type='http', auth='user', website=True)
    # def fact_find_form(self, fact_find_id, **kw):
    #     partner = request.env.user.partner_id
    #     form_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(fact_find_id)
    #     if form_id.exists():
    #         if partner == form_id.lead_id.partner_id or partner == form_id.partner_id:
    #             values = {
    #                 'page_name': 'fact_find_form',
    #                 'fact_find_id': form_id,
    #                 'customer_type': form_id.lead_id.customer_type,
    #                 'lead_state': form_id.lead_id.stage_id,
    #                 'affordability': form_id.stage_id.affordability_kyc,
    #                 'dip': form_id.stage_id.dip_kyc,
    #                 'illustration': form_id.stage_id.illustration_kyc,
    #                 'read_only_kyc': form_id.stage_id.read_only_kyc,
    #                 'countries': request.env['res.country'].with_user(SUPERUSER_ID).search([]) or False,
    #                 'protection_countries': request.env['res.country'].with_user(SUPERUSER_ID).search([]) or False,
    #             }
    #             return request.render("bvs_homebuyer_portal.bvs_portal_ff_ay_personal_details", values)

    # @http.route(['/fact_find/form/<int:fact_find_id>'], type='json', auth='user', website=True)
    # def fact_find_form(self, fact_find_id, **kw):
    #     fact_find = request.env['fact.find'].sudo().browse(fact_find_id)
    #     if not fact_find.exists():
    #         return {}
    #
    #     values = {'fact_find_id': fact_find}
    #
    #     return {
    #         "personal": request.env["ir.ui.view"]._render_template(
    #             "bvs_homebuyer_portal.bvs_portal_ff_ay_personal_details", values
    #         ),
    #         "address": request.env["ir.ui.view"]._render_template(
    #             "bvs_homebuyer_portal.bvs_portal_ff_address_history", values
    #         ),
    #     }

    @http.route(['/fact_find/personal-details/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_personal_details_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)
            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                # Process form submission
                form_id.write({
                    'title_customer': values.get('title', False),
                    'first_name': values.get('first-name'),
                    'middle_names': values.get('middle-name'),
                    'surname': values.get('surname'),
                    # 'known_by_another_name': values.get('another_name_checkbox',False),
                    'date_of_name_change': values.get('date_of_name_change'),
                    'previous_surname': values.get('previous_surname'),
                    'date_of_birth': values.get('personal-details-dob'),
                    'country_of_birth': int(values.get('cob')) if values.get('cob') else False,
                    'gender': values.get('gender'),
                    'nationality': values.get('nationality'),
                    'dual_nationality_id': int(values.get('second-nationality')) if values.get(
                        'second-nationality') else False,
                    'passport_expiry_date': values.get('passport_expiry_date'),
                    'mobile_number': values.get('telephone'),
                    'home_telephone_number': values.get('home-telephone'),
                    'email_address': values.get('email'),
                    'known_by_another_name': values.get('another_name_checkbox', False),
                    'eu_country_list': values.get('eu_country_list'),
                    'other_nationality_id': int(values.get('other_nationality')) if values.get(
                        'other_nationality') else False,
                    'indefinite_leave_to_remain': values.get('indefinite_leave_to_remain'),
                    'settled_status': values.get('settled_status'),
                    'visa_category': values.get('visa_category'),
                    'marital_status': values.get('marital_status'),
                    'start_continue_living_in_uk_month': values.get('start_continue_living_in_uk_month'),
                    'start_continue_living_in_uk_year': values.get('start_continue_living_in_uk_year'),

                })
            #
            return request.redirect(f'/my/bvs/home?nextEl=address&ffId={fact_find_id}&parentEl=about')

    @http.route(['/fact_find/expenditure/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_expenditure_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                # Process form submission
                form_id.write({
                    'rent': values.get('rent'),
                    'food': values.get('food'),
                    'utilities': values.get('utilities'),
                    'phone_internet': values.get('phone_internet'),
                    'transport': values.get('transport'),
                    'clothing': values.get('clothing'),
                    'medicine': values.get('medicine'),
                    'personal_goods': values.get('personal_goods'),
                    'household_goods': values.get('household_goods'),
                    'entertainment': values.get('entertainment'),
                    # 'childcare': values.get('childcare_cost'),
                    'annual_council_tax': values.get('annual_council_tax'),
                    'home_insurance': values.get('home_insurance'),
                    'life_insurance': values.get('life_insurance'),
                    'car_insurance': values.get('car_insurance'),
                    'education_fees': values.get('education_fees'),
                    'ground_rent': values.get('ground_rent_1'),
                    'service_charge': values.get('service_charge'),
                    'services_charge': values.get('services_charge'),
                    'total_monthly_expenses': values.get('total_expenses')
                })

            # Redirect after successful submission
            return request.redirect(f'/my/bvs/home?nextEl=credit_out&ffId={fact_find_id}&parentEl=outgoings')

    @http.route(['/fact_find/income/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_income_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                # Process form submission for income data
                form_id.write({
                    'income_type': values.get('income_type'),
                    'monthly_income': values.get('monthly_income'),
                    'annual_income': values.get('annual_income')
                })

            # Redirect after successful submission
            return request.redirect(f'/my/bvs/home?nextEl=credit_f&ffId={fact_find_id}&parentEl=finances')

    @http.route(['/fact_find/new-property/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_property_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                # Process form submission for property data
                form_id.write({
                    'property_usage': values.get('property_usage'),
                    'is_new_build': values.get('is_new_build') == 'on',  # Checkbox to boolean
                    'house_flat_no': values.get('house_flat_no'),
                    'post_code': values.get('post_code3'),  # Assuming the name is 'post_code3'
                    'address': values.get('insurance-address-search'),  # Assuming the name is 'address3'
                    'building_name': values.get('building_name3'),  # Assuming the name is 'building_name3'
                    'street_address': values.get('street_address3'),  # Assuming the name is 'street_address3'
                    'county': values.get('county3'),  # Assuming the name is 'county3'
                    'market_price': values.get('market_price'),
                    'commute_over_one_hour': values.get('commute_over_one_hour') == 'on',  # Checkbox to boolean
                    'monthly_commute_cost': values.get('monthly_commute_cost'),
                    'property_type': values.get('property_type'),
                    'tenure': values.get('tenure'),
                    'no_bedrooms': values.get('no_bedrooms'),
                    'no_bathrooms': values.get('no_bathrooms'),
                    'kitchen': values.get('kitchen'),
                    'living_rooms': values.get('living_rooms'),
                    'garage_space': values.get('garage_space'),
                    'parking': values.get('parking'),
                    'no_stories_in_building': values.get('no_stories_in_building'),
                    'estimated_built_year': values.get('estimated_built_year'),
                    'warranty_providers_name': values.get('warranty_providers_name'),
                    'epc_predicted_epc_rate': values.get('epc_predicted_epc_rate'),
                    'pea_rate': values.get('pea_rate'),
                    'ex_council': values.get('ex_council') == 'on',  # Checkbox to boolean
                    'annual_service_charge': values.get('annual_service_charge'),
                    'wall_construction_type': values.get('wall_construction_type'),
                    'roof_construction_type': values.get('roof_construction_type'),
                    'remaining_lease_term_in_years': values.get('remaining_lease_term_in_years'),
                    'flats_in_floor': values.get('flat_in_floor'),  # Checkbox to boolean
                    'flats_same_floor_count': values.get('flats_same_floor_count'),
                    'above_commercial_property': values.get('above_commercial_property'),
                    'ground_rent': values.get('ground_rent'),
                    'shared_ownership': values.get('shared_ownership_existing') == 'on',  # Checkbox to boolean
                    'ownership_percentage': values.get('ownership_percentage_existing'),
                    'help_to_buy_loan': values.get('help_to_buy_loan_type') is not None,
                    'help_to_buy_loan_type': values.get('help_to_buy_loan_type'),
                    'estimated_monthly_rental_income': values.get('estimated_monthly_rental_income'),
                    'current_monthly_rental_income': values.get('current_monthly_rental_income'),
                    'hmo': values.get('hmo') == 'on',
                    'occupants_count': values.get('occupants_count'),
                    'company_name': values.get('company_name'),
                    'company_director': values.get('company_director'),
                    'additional_borrowing': values.get('additional_borrowing') == 'on',
                    'additional_borrowing_reason': values.get('additional_borrowing_reason'),
                    'additional_borrowing_amount': values.get('additional_borrowing_amount'),
                })

            #
            return request.redirect(f'/my/bvs/home?nextEl=deposit&ffId={fact_find_id}&parentEl=new_mortgage')

    @http.route(['/fact_find/deposit/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_deposit_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                # Process form submission for property data
                form_id.write({
                    'deposit_from_savings': values.get('deposit_from_savings'),
                    'gifted_deposit_from_friend': values.get('gifted_deposit_from_friend'),
                    'gifted_deposit_from_family': values.get('gifted_deposit_from_family'),
                    'deposit_from_another_loan': values.get('deposit_from_another_loan'),
                    'deposit_from_equity_of_property': values.get('deposit_from_equity_of_property'),
                    'loan_amount_from_director': values.get('loan_amount_from_director'),
                    'gifted_deposit_amount_from_director': values.get('gifted_deposit_amount_from_director'),
                    'total_deposit_amount': values.get('total_deposit_amount'),
                })

            # Redirect after successful submission
            return request.redirect(f'/my/bvs/home?nextEl=estate_agent&ffId={fact_find_id}&parentEl=new_mortgage')

    @http.route(['/fact_find/estate-agent/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_estate_agent_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                form_id.write({
                    'firm_name': values.get('firm_name'),
                    'contactable_person_mobile': values.get('es_mobile'),
                    'contactable_person': values.get('contactable_person'),
                    'firm_email': values.get('es_email'),
                })

            # Redirect after successful submission
            return request.redirect(f'/my/bvs/home?nextEl=solicitor&ffId={fact_find_id}&parentEl=new_mortgage')

        # Solicitor Controller - Fixed (Following Personal Details Pattern)

    @http.route(['/fact_find/solicitor_firm/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_solicitor_firm_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                # Process form submission for solicitor firm details data
                form_id.write({
                    'solicitor_firm_name': values.get('solicitor_firm_name'),
                    'solicitor_house_number': values.get('solicitor_house_number'),
                    'solicitor_post_code': values.get('solicitor_post_code'),
                    'solicitor_email': values.get('solicitor_email'),
                    'solicitor_contact_person': values.get('solicitor_contact_person'),
                    'solicitor_contact_number': values.get('solicitor_contact_number'),
                    'solicitor_address': values.get('solicitor-address-search')

                })

            # Redirect after successful submission
            return request.redirect(f'/my/bvs/home?nextEl=cover&ffId={fact_find_id}&parentEl=safeguards')

    @http.route(['/fact_find/protection/submit/<int:fact_find_id>'], type='http', auth='user', methods=['POST'],
                website=True)
    def fact_find_protection_submit(self, fact_find_id=None, **post):
        if request.httprequest.method == 'POST':
            values = request.params.copy()
            partner = request.env.user.partner_id
            form_id = request.env['fact.find'].sudo().browse(fact_find_id)

            if form_id.exists() and (partner == form_id.lead_id.partner_id or partner == form_id.partner_id):
                form_id.write({
                    'existing_protection_cover': values.get('existing_protection_cover') == 'on',
                    'employer_sick_pay_benefit': values.get('employer_sick_pay_benefit') == 'on',
                    'claim_months': values.get('claim_months'),
                    'height': values.get('height'),
                    'weight': values.get('weight'),
                    'waist': values.get('waist'),
                    'uk_dress_size': values.get('uk_dress_size'),
                    'registered_with_uk_gp_years': values.get('registered_with_uk_gp_years'),
                    'gp_name': values.get('gp_name'),
                    'gp_surgery': values.get('gp_surgery'),
                    'gp_postcode': values.get('gp_postcode'),
                    'gp_address': values.get('gp_address'),
                    'street_address': values.get('street_address'),
                    'country_id': int(values.get('country_id')) if values.get('country_id') else None,

                    'smoking': values.get('smoking'),
                    'stop_smoking_date': values.get('stop_smoking_date'),
                    'cigarettes_per_day': values.get('cigarettes_per_day'),
                    'alcohol_consumption_comment': values.get('alcohol_consumption_comment'),
                    'stop_drinking_date': values.get('stop_drinking_date'),
                    'alcohol_consumption_amount': values.get('alcohol_consumption_amount'),
                    'estimated_monthly_protection_budget': values.get('estimated_monthly_protection_budget'),
                    'medical_conditions': values.get('medical_conditions') == 'on',
                    'medical_conditions_details': values.get('medical_conditions_details'),
                    'currently_taking_medicines': values.get('currently_taking_medicines') == 'on',
                    'medicines_details': values.get('medicines_details'),
                    'waiting_for_gp_hospital_referral_report': values.get(
                        'waiting_for_gp_hospital_referral_report') == 'on',
                    'waiting_details': values.get('waiting_details'),
                    'frequency_of_drinking': values.get('frequency_of_drinking'),
                    'type_of_drink': values.get('type_of_drink'),
                    'valid_will': values.get('valid_will') == 'on',

                })

            # Redirect after successful submission
            return request.redirect(f'/my/bvs/home?nextEl=protection&ffId={fact_find_id}&parentEl=safeguards')

    @http.route(['/my/bvs/portfolio'], type='http', auth='user', website=True)
    def bvs_portfolio(self, **kwargs):
        partner = request.env.user.partner_id
        fact_find = request.env['fact.find'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        # Fetch portfolio data from the backend
        portfolio_data = request.env['property.case.history'].sudo().search([('property_id', '=', fact_find.id)])

        return request.render("bvs_homebuyer_portal.bvs_portal_portfolio", {
            'fact_find': fact_find,
            'portfolio_data': portfolio_data,
        })

    @http.route('/update/fact-find/adverse-credit-questions', type='json', auth='public', methods=['POST'])
    def ff_update_adverse_credit_questions(self, fact_find_id, **kwargs):
        """
        @public - Update adverse credit questions (radio button responses)
        """
        try:
            fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_id.exists():
                return {'error': 'Fact find record not found'}

            data = kwargs.get('data', {})

            # Convert 'yes'/'no' string values to boolean
            def convert_to_boolean(value):
                if isinstance(value, str):
                    return value.lower() == 'yes'
                return bool(value)

            # Prepare the update data
            update_data = {}

            # Map form field names to model field names and convert values
            field_mappings = {
                'missed_payment_last_3_years': 'missed_payment_last_3_years',
                'arrears_with_mortgage_or_loans': 'arrears_with_mortgage_or_loans',
                'arrears_with_credit_card_or_store_cards': 'missed_payment_last_3_years',
                # This seems to map to the same field
                'ccj_against_you': 'ccj_against_you',
                'debt_management_plan': 'debt_management_plan',
                'default_registered': 'default_registered',
                'failed_to_keep_up_repayments': 'failed_to_keep_up_repayments',
                'bankruptcy': 'bankruptcy'
            }

            # Process each field from the form data
            for form_field, model_field in field_mappings.items():
                if form_field in data:
                    update_data[model_field] = convert_to_boolean(data[form_field])

            # Handle the IVA question (arrangements with creditors)
            if 'ccj_against_you' in data:  # Based on your HTML, this field name is used for IVA
                update_data['arrangements_with_creditors'] = convert_to_boolean(data['ccj_against_you'])

            # Update the fact find record
            fact_find_id.sudo().write(update_data)

            return {'success': True, 'message': 'Adverse credit questions updated successfully'}

        except ValueError as e:
            return {'error': 'Invalid fact_find_id provided'}
        except Exception as e:
            return {'error': f'An error occurred: {str(e)}'}

    @http.route('/get/fact-find/adverse-credit-questions', type='json', auth='public', methods=['POST'])
    def ff_get_adverse_credit_questions(self, fact_find_id, **kwargs):
        """
        @public - Get adverse credit questions responses for a fact find
        """
        try:
            fact_find_id = request.env['fact.find'].sudo().browse(int(fact_find_id))
            if not fact_find_id.exists():
                return {'error': 'Fact find record not found'}

            # Convert boolean values to 'yes'/'no' strings for frontend
            def convert_to_string(value):
                return 'yes' if value else 'no'

            return {
                'missed_payment_last_3_years': convert_to_string(fact_find_id.missed_payment_last_3_years),
                'arrears_with_mortgage_or_loans': convert_to_string(fact_find_id.arrears_with_mortgage_or_loans),
                'ccj_against_you': convert_to_string(fact_find_id.ccj_against_you),
                'arrangements_with_creditors': convert_to_string(fact_find_id.arrangements_with_creditors),
                'debt_management_plan': convert_to_string(fact_find_id.debt_management_plan),
                'default_registered': convert_to_string(fact_find_id.default_registered),
                'failed_to_keep_up_repayments': convert_to_string(fact_find_id.failed_to_keep_up_repayments),
                'bankruptcy': convert_to_string(fact_find_id.bankruptcy),
            }

        except ValueError as e:
            return {'error': 'Invalid fact_find_id provided'}
        except Exception as e:
            return {'error': f'An error occurred: {str(e)}'}

    @http.route('/submit/fact-find/adverse-credit-all', type='json', auth='public', methods=['POST'])
    def ff_submit_adverse_credit_all(self, fact_find_id, **kwargs):
        """
        @public - Submit all adverse credit data (questions + details) in one call
        """
        try:
            fact_find_id = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))
            if not fact_find_id.exists():
                return {'error': 'Fact find record not found'}

            data = kwargs.get('data', {})

            # Update the questions first
            questions_data = data.get('questions', {})
            if questions_data:
                # Use the existing update questions logic
                update_result = self.ff_update_adverse_credit_questions(fact_find_id.id, data={'data': questions_data})
                if 'error' in update_result:
                    return update_result

            # Handle adverse credit details if provided
            adverse_credits = data.get('adverse_credit_details', [])
            for credit_data in adverse_credits:
                # Use existing adverse credit detail creation logic
                detail_result = self.ff_update_adverse_credit(fact_find_id.id, data={'data': credit_data})
                if 'error' in detail_result:
                    return detail_result

            return {'success': True, 'message': 'All adverse credit data submitted successfully'}

        except Exception as e:
            return {'error': f'An error occurred: {str(e)}'}

    @http.route('/update/fact-find/retirement-income', methods=['POST'], type='json', auth='public')
    def ff_update_retirement_income(self, fact_find_id, **kwargs):
        """
        @public - update retirement income details
        """
        try:
            _logger.info(f"Retirement income update request - fact_find_id: {fact_find_id}, kwargs: {kwargs}")

            # Get the fact find record
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))

            if not fact_find_record.exists():
                _logger.error(f"Fact find record not found for ID: {fact_find_id}")
                return {'error': 'Fact find record not found'}

            # Get retirement data from request
            retirement_data = kwargs.get('data', {})
            _logger.info(f"Retirement data received: {retirement_data}")

            # Validate input
            gross_monthly_income = float(retirement_data.get('gross_monthly_retirement_income', 0.0))

            if gross_monthly_income < 0:
                return {'error': 'Gross monthly retirement income cannot be negative'}

            # Prepare the data dictionary
            data = {
                'gross_monthly_retirement_income': gross_monthly_income,
                # annual_retirement_income will be computed automatically by the model
            }

            _logger.info(f"Updating fact find record with data: {data}")

            # Update the record
            fact_find_record.write(data)

            # Refresh the record to get computed values
            fact_find_record.refresh()

            _logger.info(
                f"Record updated successfully. New values - monthly: {fact_find_record.gross_monthly_retirement_income}, annual: {fact_find_record.annual_retirement_income}")

            # Return success response with computed annual income
            return {
                'success': True,
                'fact_find_id': fact_find_record.id,
                'gross_monthly_retirement_income': fact_find_record.gross_monthly_retirement_income,
                'annual_retirement_income': fact_find_record.annual_retirement_income,
                'message': 'Retirement income updated successfully'
            }

        except ValueError as e:
            _logger.error(f"ValueError in retirement income update: {e}")
            return {'error': 'Invalid fact_find_id or retirement income value provided'}
        except Exception as e:
            _logger.error(f"Exception in retirement income update: {e}")
            return {'error': f'An error occurred: {str(e)}'}

    @http.route('/get/fact-find/retirement-income', methods=['POST'], type='json', auth='public')
    def ff_get_retirement_income(self, fact_find_id, **kwargs):
        """
        @public - get retirement income details for given fact find id
        """
        try:
            _logger.info(f"Get retirement income request - fact_find_id: {fact_find_id}")

            if not fact_find_id:
                return {'error': 'Fact find ID is required'}

            fact_find_record = request.env['fact.find'].sudo().browse(int(fact_find_id))

            if not fact_find_record.exists():
                _logger.error(f"Fact find record not found for ID: {fact_find_id}")
                return {'error': 'Fact find record not found'}

            result = {
                'success': True,
                'fact_find_id': fact_find_record.id,
                'gross_monthly_retirement_income': fact_find_record.gross_monthly_retirement_income or 0.0,
                'annual_retirement_income': fact_find_record.annual_retirement_income or 0.0,
            }

            _logger.info(f"Returning retirement income data: {result}")
            return result

        except ValueError as e:
            _logger.error(f"ValueError in get retirement income: {e}")
            return {'error': 'Invalid fact_find_id provided'}
        except Exception as e:
            _logger.error(f"Exception in get retirement income: {e}")
            return {'error': f'An error occurred: {str(e)}'}

    @http.route('/update/fact-find/employment-status', methods=['POST'], type='json', auth='public')
    def ff_update_employment_status(self, fact_find_id, **kwargs):
        """
        @public - update employment status only
        """
        try:
            _logger.info(f"Employment status update request - fact_find_id: {fact_find_id}, kwargs: {kwargs}")

            # Get the fact find record
            fact_find_record = request.env['fact.find'].with_user(SUPERUSER_ID).browse(int(fact_find_id))

            if not fact_find_record.exists():
                _logger.error(f"Fact find record not found for ID: {fact_find_id}")
                return {'error': 'Fact find record not found'}

            # Get employment status from request
            employment_data = kwargs.get('data', {})
            employment_status = employment_data.get('employment_status')

            if not employment_status:
                return {'error': 'Employment status is required'}

            # Prepare the data dictionary
            data = {
                'employment_status': employment_status,
            }

            _logger.info(f"Updating fact find record with employment status: {data}")

            # Update the record
            fact_find_record.write(data)

            _logger.info(f"Employment status updated successfully to: {employment_status}")

            # Return success response
            return {
                'success': True,
                'fact_find_id': fact_find_record.id,
                'employment_status': fact_find_record.employment_status,
                'message': 'Employment status updated successfully'
            }

        except ValueError as e:
            _logger.error(f"ValueError in employment status update: {e}")
            return {'error': 'Invalid fact_find_id provided'}
        except Exception as e:
            _logger.error(f"Exception in employment status update: {e}")
            return {'error': f'An error occurred: {str(e)}'}

    @http.route('/bvs/is_admin', type='json', auth='user')
    def is_admin(self):
        """Return True if current user is in System Administrator group"""
        return request.env.user.has_group('base.group_system')

    @http.route('/bvs/test_notify', type='http', auth='public')
    def test_notify(self):
        """Test route to manually trigger notification"""
        result = self.notify_admin("Test notification from /bvs/test_notify")
        return f"<h1>Test Result: {result}</h1>"

    @http.route('/bvs/notify_admin', type='json', auth='public')
    def notify_admin(self, message):

        # Fetch all system admin users
        admins = request.env['res.users'].sudo().search([
            ('groups_id', 'in', request.env.ref('base.group_system').id)
        ])


        if not admins:
            return {'status': 'error', 'message': 'No admin users found'}

        # Send notifications using separate commits to avoid transaction rollback
        success_count = 0
        for admin in admins:
            partner = admin.partner_id

            request.env['bus.bus']._sendone(partner, 'warning', {
                'title': _("Warning"),
                'message': _('There is a problem in Royal Mail. Please take an action'),
                'sticky': True
            })

        return True

    @http.route('/fact_find/get_details', type='json', auth='user')
    def fact_find_get_details(self, fact_find_id):
        fact_find = request.env['fact.find'].sudo().browse(int(fact_find_id))
        if fact_find.exists():
            return {
                'id': fact_find.id,
                'first_name': fact_find.first_name,
                'surname': fact_find.surname,
                'email_address': fact_find.email_address,
                'mobile_number': fact_find.mobile_number,
                'above_commercial_property': fact_find.above_commercial_property,
                'additional_borrowing': fact_find.additional_borrowing,
                'additional_borrowing_amount': fact_find.additional_borrowing_amount,
                'additional_borrowing_reason': fact_find.additional_borrowing_reason,
                'address': fact_find.address,
                'address_history_ids': fact_find.address_history_ids,
                'adverse_credit_details': fact_find.adverse_credit_details,
                'alcohol_consumption_amount': fact_find.alcohol_consumption_amount,
                'alcohol_consumption_comment': fact_find.alcohol_consumption_comment,
                'alteration_passport': fact_find.alteration_passport,
                'annual_council_tax': fact_find.annual_council_tax,
                'annual_income': fact_find.annual_income,
                'annual_payment_information_letter': fact_find.annual_payment_information_letter,
                'annual_retirement_income': fact_find.annual_retirement_income,
                'annual_service_charge': fact_find.annual_service_charge,
                'arla_letter': fact_find.arla_letter,
                'arrangements_with_creditors': fact_find.arrangements_with_creditors,
                'arrears_with_mortgage_or_loans': fact_find.arrears_with_mortgage_or_loans,
                'bank_account_ids': fact_find.bank_account_ids,
                'bank_statement': fact_find.bank_statement,
                'bank_statement_name_confirmation': fact_find.bank_statement_name_confirmation,
                'bankruptcy': fact_find.bankruptcy,
                'borrower_type': fact_find.borrower_type,
                'brp_visa_stamp': fact_find.brp_visa_stamp,
                'building_name': fact_find.building_name,
                'car_insurance': fact_find.car_insurance,
                'case_history_ids': fact_find.case_history_ids,
                'ccj_against_you': fact_find.ccj_against_you,
                'child_tax_credit_award_letter': fact_find.child_tax_credit_award_letter,
                'childcare': fact_find.childcare,
                'cigarettes_per_day': fact_find.cigarettes_per_day,
                'claim_months': fact_find.claim_months,
                'clothing': fact_find.clothing,
                'cml_form': fact_find.cml_form,
                'commute_over_one_hour': fact_find.commute_over_one_hour,
                'company_director': fact_find.company_director,
                'company_name': fact_find.company_name,
                'contactable_person': fact_find.contactable_person,
                'contactable_person_mobile': fact_find.contactable_person_mobile,
                'country_id': fact_find.country_id,
                'country_of_birth': fact_find.country_of_birth.id if fact_find.country_of_birth else False,
                'county': fact_find.county,
                'create_date': fact_find.create_date,
                'create_uid': fact_find.create_uid,
                'credit_card_bill': fact_find.credit_card_bill,
                'credit_comment': fact_find.credit_comment,
                'credit_comment_ids': fact_find.credit_comment_ids,
                'critical_illness_ids': fact_find.critical_illness_ids,
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
                'employment_ids': fact_find.employment_ids,
                'employment_status': fact_find.employment_status,
                'entertainment': fact_find.entertainment,
                'epc': fact_find.epc,
                'epc_predicted_epc_rate': fact_find.epc_predicted_epc_rate,
                'estimated_built_year': fact_find.estimated_built_year,
                'estimated_monthly_protection_budget': fact_find.estimated_monthly_protection_budget,
                'estimated_monthly_rental_income': fact_find.estimated_monthly_rental_income,
                'eu_country_list': fact_find.eu_country_list,
                'ex_council': fact_find.ex_council,
                'existing_mortgages_ids': fact_find.existing_mortgages_ids,
                'existing_protection_cover': fact_find.existing_protection_cover,
                'expired_passport_driving_license': fact_find.expired_passport_driving_license,
                'failed_to_keep_up_repayments': fact_find.failed_to_keep_up_repayments,
                'financial_depend_ids': fact_find.financial_depend_ids,
                'financial_dependants': fact_find.financial_dependants,
                'firm_email': fact_find.firm_email,
                'firm_name': fact_find.firm_name,
                'flat_in_floor': fact_find.flat_in_floor,
                'flats_in_floor': fact_find.flats_in_floor,
                'flats_same_floor_count': fact_find.flats_same_floor_count,
                'food': fact_find.food,
                'frequency_of_drinking': fact_find.frequency_of_drinking,
                'future_travel_ids': fact_find.future_travel_ids,
                'garage_space': fact_find.garage_space,
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
                'ground_rent': fact_find.ground_rent,
                'health_condition_ids': fact_find.health_condition_ids,
                'height': fact_find.height,
                'help_to_buy_loan': fact_find.help_to_buy_loan,
                'help_to_buy_loan_type': fact_find.help_to_buy_loan_type,
                'hmo': fact_find.hmo,
                'home_insurance': fact_find.home_insurance,
                'home_telephone_number': fact_find.home_telephone_number,
                'house_flat_no': fact_find.house_flat_no,
                'house_number_solicitor': fact_find.house_number_solicitor,
                'household_goods': fact_find.household_goods,
                'htb_location': fact_find.htb_location,
                'htb_scheme_available': fact_find.htb_scheme_available,
                'immigration_status_sharecode': fact_find.immigration_status_sharecode,
                'income_type': fact_find.income_type,
                'indefinite_leave_to_remain': fact_find.indefinite_leave_to_remain,
                'is_new_build': fact_find.is_new_build,
                'is_private_lead': fact_find.is_private_lead,
                'kitchen': fact_find.kitchen,
                'known_by_another_name': fact_find.known_by_another_name,
                'land_phone_bill': fact_find.land_phone_bill,
                'last_2_years_bonus_payslips': fact_find.last_2_years_bonus_payslips,
                'last_2_years_p60': fact_find.last_2_years_p60,
                'last_2_years_tax_calculations': fact_find.last_2_years_tax_calculations,
                'last_2_years_tax_returns': fact_find.last_2_years_tax_returns,
                'last_2_years_tax_year_overview': fact_find.last_2_years_tax_year_overview,
                'last_3_months_bank_statements_pension': fact_find.last_3_months_bank_statements_pension,
                'last_3_months_bank_statements_salary': fact_find.last_3_months_bank_statements_salary,
                'last_3_months_payslips': fact_find.last_3_months_payslips,
                'latest_3_months_bank_statements_mortgage': fact_find.latest_3_months_bank_statements_mortgage,
                'latest_3_months_bank_statements_rental': fact_find.latest_3_months_bank_statements_rental,
                'latest_3_months_company_bank_statements': fact_find.latest_3_months_company_bank_statements,
                'latest_case_number': fact_find.latest_case_number,
                'latest_clearance_statement': fact_find.latest_clearance_statement,
                'latest_multi_agency_credit_report': fact_find.latest_multi_agency_credit_report,
                'latest_payslips': fact_find.latest_payslips,
                'lead_id': fact_find.lead_id,
                'lender_name': fact_find.lender_name,
                'life_insurance': fact_find.life_insurance,
                'living_rooms': fact_find.living_rooms,
                'loan_amount_from_director': fact_find.loan_amount_from_director,
                'marital_status': fact_find.marital_status,
                'market_price': fact_find.market_price,
                'medical_conditions': fact_find.medical_conditions,
                'medical_conditions_details': fact_find.medical_conditions_details,
                'medicine': fact_find.medicine,
                'medicines_details': fact_find.medicines_details,
                'memorandum_of_sale': fact_find.memorandum_of_sale,
                'middle_names': fact_find.middle_names,
                'missed_payment_last_3_years': fact_find.missed_payment_last_3_years,
                'mobile': fact_find.mobile,
                'monthly_commute_cost': fact_find.monthly_commute_cost,
                'monthly_expenses_bank_statements': fact_find.monthly_expenses_bank_statements,
                'monthly_income': fact_find.monthly_income,
                'monthly_mortgage_payment': fact_find.monthly_mortgage_payment,
                'monthly_rental_btl': fact_find.monthly_rental_btl,
                'mortgage_statement': fact_find.mortgage_statement,
                'mortgage_term': fact_find.mortgage_term,
                'mortgage_type': fact_find.mortgage_type,
                'name': fact_find.name,
                'name_confirmation_letter': fact_find.name_confirmation_letter,
                'nationality': fact_find.nationality,
                'no_bathrooms': fact_find.no_bathrooms,
                'no_bedrooms': fact_find.no_bedrooms,
                'no_stories_in_building': fact_find.no_stories_in_building,
                'number_of_dependents': fact_find.number_of_dependents,
                'occupants_count': fact_find.occupants_count,
                'other_email_address': fact_find.other_email_address,
                'other_expenses_bank_statements': fact_find.other_expenses_bank_statements,
                'other_income_bank_statements': fact_find.other_income_bank_statements,
                'other_nationality': fact_find.other_nationality,
                'other_nationality_id': fact_find.other_nationality_id.id if fact_find.other_nationality_id else False,
                'outstanding_amount': fact_find.outstanding_amount,
                'ownership_percentage': fact_find.ownership_percentage,
                'p60': fact_find.p60,
                'parking': fact_find.parking,
                'partner_id': fact_find.partner_id,
                'passport_expiry_date': fact_find.passport_expiry_date,
                'passport_pages': fact_find.passport_pages,
                'past_travel_ids': fact_find.past_travel_ids,
                'pdf_report': fact_find.pdf_report,
                'pea': fact_find.pea,
                'pea_rate': fact_find.pea_rate,
                'peal': fact_find.peal,
                'pension_bank_statements': fact_find.pension_bank_statements,
                'pension_forecast_statement': fact_find.pension_forecast_statement,
                'personal_goods': fact_find.personal_goods,
                'phone_internet': fact_find.phone_internet,
                'pip_dla_letter': fact_find.pip_dla_letter,
                'post_code': fact_find.post_code,
                'post_code_solicitor': fact_find.post_code_solicitor,
                'postal_document_past_3_months': fact_find.postal_document_past_3_months,
                'previous_name': fact_find.previous_name,
                'previous_surname': fact_find.previous_surname,
                'product_end_date': fact_find.product_end_date,
                'proof_of_address_driving_license': fact_find.proof_of_address_driving_license,
                'property_address': fact_find.property_address,
                'property_details_ids': fact_find.property_details_ids,
                'property_type': fact_find.property_type,
                'property_usage': fact_find.property_usage,
                'property_value': fact_find.property_value,
                'protection_ids': fact_find.protection_ids,
                'rate': fact_find.rate,
                'redeem_htb_loan': fact_find.redeem_htb_loan,
                'registered_with_uk_gp_years': fact_find.registered_with_uk_gp_years,
                'remaining_lease_term_in_years': fact_find.remaining_lease_term_in_years,
                'rent': fact_find.rent,
                'report_name': fact_find.report_name,
                'requested_direct_debit_bank_statement': fact_find.requested_direct_debit_bank_statement,
                'reservation_form': fact_find.reservation_form,
                'residential_status': fact_find.residential_status,
                'roof_construction_type': fact_find.roof_construction_type,
                'salary_increment_letter': fact_find.salary_increment_letter,
                'sales_particular': fact_find.sales_particular,
                'sales_particulars': fact_find.sales_particulars,
                'second_charge_details': fact_find.second_charge_details,
                'self_employment_ids': fact_find.self_employment_ids,
                'service_charge': fact_find.service_charge,
                'services_charge': fact_find.services_charge,
                'settled_status': fact_find.settled_status,
                'sharecode_immigration_status': fact_find.sharecode_immigration_status,
                'shared_ownership': fact_find.shared_ownership,
                'shared_ownership_available': fact_find.shared_ownership_available,
                'shared_ownership_existing': fact_find.shared_ownership_existing,
                'signed_finalized_latest_2_years_company_accounts': fact_find.signed_finalized_latest_2_years_company_accounts,
                'smoking': fact_find.smoking,
                'solicitor_contact_number': fact_find.solicitor_contact_number,
                'solicitor_contact_person': fact_find.solicitor_contact_person,
                'solicitor_email': fact_find.solicitor_email,
                'solicitor_firm_name': fact_find.solicitor_firm_name,
                'solicitor_house_number': fact_find.solicitor_house_number,
                'solicitor_id': fact_find.solicitor_id,
                'solicitor_post_code': fact_find.solicitor_post_code,
                'solicitor_address': fact_find.solicitor_address,
                'spv_bank_statements': fact_find.spv_bank_statements,
                'stage_id': fact_find.stage_id,
                'start_continue_living_in_uk': fact_find.start_continue_living_in_uk,
                'start_continue_living_in_uk_month': fact_find.start_continue_living_in_uk_month,
                'start_continue_living_in_uk_year': fact_find.start_continue_living_in_uk_year,
                'start_continue_living_in_ukn': fact_find.start_continue_living_in_ukn,
                'stop_drinking_date': fact_find.stop_drinking_date,
                'stop_smoking_date': fact_find.stop_smoking_date,
                'street_address': fact_find.street_address,
                'tax_calculations': fact_find.tax_calculations,
                'tax_credit_statement': fact_find.tax_credit_statement,
                'tax_credits_statement': fact_find.tax_credits_statement,
                'tax_returns': fact_find.tax_returns,
                'tax_year_overview': fact_find.tax_year_overview,
                'tenancy_agreement': fact_find.tenancy_agreement,
                'tenancy_agreements_multiple_occupants': fact_find.tenancy_agreements_multiple_occupants,
                'tenure': fact_find.tenure,
                'title_customer': fact_find.title_customer,
                'total_deposit_amount': fact_find.total_deposit_amount,
                'total_monthly_expenses': fact_find.total_monthly_expenses,
                'total_monthly_mortgage_payment': fact_find.total_monthly_mortgage_payment,
                'total_monthly_rental_btl': fact_find.total_monthly_rental_btl,
                'total_outstanding_amount': fact_find.total_outstanding_amount,
                'total_property_value': fact_find.total_property_value,
                'transport': fact_find.transport,
                'type_of_drink': fact_find.type_of_drink,
                'uk_dress_size': fact_find.uk_dress_size,
                'universal_tax_credit_statements': fact_find.universal_tax_credit_statements,
                'utilities': fact_find.utilities,
                'utility_bill_past_3_months': fact_find.utility_bill_past_3_months,
                'valid_will': fact_find.valid_will,
                'visa_category': fact_find.visa_category,
                'waist': fact_find.waist,
                'waiting_details': fact_find.waiting_details,
                'waiting_for_gp_hospital_referral_report': fact_find.waiting_for_gp_hospital_referral_report,
                'wall_construction_type': fact_find.wall_construction_type,
                'warranty_providers_name': fact_find.warranty_providers_name
            }

        return {}

    @http.route('/bvs/is_protection', type='json', auth='user')
    def is_protection(self):
        """Return True if current user is in System Administrator group"""
        return request.env.user.has_group('base.group_system')

    @http.route('/bvs/has_applicants', type='json', auth='user')
    def has_applicants(self, fact_find_id):
        fact_find = request.env['fact.find'].sudo().browse(int(fact_find_id))
        if fact_find.lead_id.applicant_ids:
            return True
        else:
            return False


