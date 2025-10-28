from odoo import api, models, SUPERUSER_ID, fields, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime
from . import bvs_stage
import re


class BVSLead(models.Model):
    _name = 'bvs.lead'
    _inherit = ['mail.thread', 'mail.activity.mixin', 'portal.mixin']
    _description = "BVS Leads"

    registration_no = fields.Char(string='Case Number', copy=False, tracking=True)
    state_agent_id = fields.Many2one('estate.agent', string="Estate Agent")
    partner_id = fields.Many2one("res.partner", string="Customer", tracking=True)
    first_name = fields.Char('First Name', related='partner_id.first_name', tracking=True, readonly=False)
    last_name = fields.Char('Last Name', related='partner_id.last_name', tracking=True, readonly=False)
    email = fields.Char(string="Email", related='partner_id.email', readonly=False, tracking=True)
    contact_number = fields.Char(string="Contact Number", related='partner_id.mobile', readonly=False, tracking=True)
    product_type = fields.Selection([
        ('mortgage', 'Mortgage'),
        ('protection', 'Protection')],
        default='mortgage', string='Service Type', tracking=True)
    advisor_fee = fields.Boolean(string='Advisor Fee')
    customer_type = fields.Selection([
        ('ftb', 'FTB (First Time Buyer)'),
        ('hm', 'HM (Home Mover)'),
        ('rrm', 'RRM (Residential Remortgage)'),
        ('btl_purchase', 'BTL Purchase'),
        ('btl_remortgage', 'BTL Remortgage'),
        ('com_btl_purchase', 'Com BTL Purchase'),
        ('com_btl_remortgage', 'Com BTL Remortgage')],
        string='Client Type', tracking=True)
    mortgage_advisor = fields.Many2one('res.users', string="Mortgage Advisor", domain=[('is_mortgage_advisor', '=', True)])
    advisor_note = fields.Char(string="Advisor Note", tracking=True)
    property_found = fields.Boolean(string="If Property Found ?", tracking=True)
    risk_assessment_checklist = fields.Boolean(string="Risk Assessment Checklist", tracking=True)
    lead_source = fields.Selection([
        ('reffal_customer', 'Refferal By Customer'),
        ('reffal_advisor', 'Refferal By BVS Advisor'),
        ('event', 'An Event'),
        ('social_medea', 'Social Media')],
        string='Lead Source ', tracking=True)
    event_id = fields.Many2one('event.list', string="Event")
    property_address = fields.Text(string="Property Address")
    property_price = fields.Integer(string="Property Price")
    loan_amount = fields.Integer(string="Loan Amount")
    deposit = fields.Integer(string="Deposit")
    lender_reference = fields.Char(string="Lender Reference Number")
    priority = fields.Selection(
        bvs_stage.AVAILABLE_PRIORITIES, string='Priority', index=True,
        default=bvs_stage.AVAILABLE_PRIORITIES[0][0])
    stage_id = fields.Many2one('bvs.stage', 'Stage', domain="[('stage_visibility', '=', product_type)]", group_expand='_read_group_stage_ids', tracking=True, ondelete="restrict")
    is_new = fields.Boolean(related='stage_id.is_new')
    is_illustration = fields.Boolean(related='stage_id.is_illustration')
    is_affordability_assessment = fields.Boolean(related='stage_id.is_affordability_assessment')
    is_dip = fields.Boolean(related='stage_id.is_dip')
    is_client_onboarding = fields.Boolean(related='stage_id.is_client_onboarding')
    is_pre_offer = fields.Boolean(related='stage_id.is_pre_offer')
    is_post_offer = fields.Boolean(related='stage_id.is_post_offer')
    is_completion = fields.Boolean(related='stage_id.is_completion')
    read_only_kyc = fields.Boolean(related='stage_id.read_only_kyc')
    is_protection_new = fields.Boolean(related='stage_id.is_protection_new')
    is_protection_application = fields.Boolean(related='stage_id.is_protection_application')
    is_protection = fields.Boolean(related='stage_id.is_protection')
    is_protection_completion = fields.Boolean(related='stage_id.is_protection_completion')
    add_esis_record = fields.Boolean(related='stage_id.add_esis_record')
    add_prot_quote_record = fields.Boolean(related='stage_id.add_prot_quote_record')

    is_new_leader = fields.Boolean(compute='_check_is_new_leader')
    is_new_member = fields.Boolean(compute='_check_is_new_member')
    is_financial_advisor = fields.Boolean(compute='_check_is_financial_advisor')
    is_admin_manager = fields.Boolean(compute='_check_is_admin_manager')
    is_fma_team_leader = fields.Boolean(compute='_check_is_fma_team_leader')
    is_fma_team_member = fields.Boolean(compute='_check_is_fma_team_member')
    is_post_offer_leader = fields.Boolean(compute='_check_is_post_offer_leader')
    is_post_offer_member = fields.Boolean(compute='_check_is_post_offer_member')
    is_completion_member = fields.Boolean(compute='_check_is_completion_member')
    is_completion_leader = fields.Boolean(compute='_check_is_completion_leader')
    is_protection_leader = fields.Boolean(compute='_check_is_protection_leader')
    is_protection_member = fields.Boolean(compute='_check_is_protection_member')
    is_advisor_support = fields.Boolean(compute='_check_is_advisor_support')
    active = fields.Boolean(string='Active', default=True)
    is_private = fields.Boolean(string="Private Lead?")
    company_id = fields.Many2one('res.company', string='Company', change_default=True,
                                 default=lambda self: self.env.company)
    button_label = fields.Char(
        string=" ",
        compute="_compute_button_label"
    )

    notify_sent = fields.Boolean(string="Notification Sent", default=False)
    # portal_user_document = fields.Boolean(related='user_id.check_portal_user_documents', default=True)

    def action_notify_mortgage_advisor(self):
        for rec in self:
            if not rec.mortgage_advisor:
                raise UserError("Please assign a Mortgage Advisor before notifying.")

            # Send email (basic send_mail example)
            template = self.env.ref("bvs_crm.email_template_notify_mortgage_advisor", False)
            if template:
                template.send_mail(rec.id, force_send=True)

            # Toggle state
            rec.notify_sent = True

    @api.depends("notify_sent")
    def _compute_button_label(self):
        for rec in self:
            rec.button_label = "Re-notify Advisor" if rec.notify_sent else "Notify Advisor"

    def name_get(self):
        res = []
        for record in self:
            name = record.partner_id.name
            if record.registration_no:
                name = _("%s (%s)", record.partner_id.name, record.registration_no)
            res.append((record.id, name))

        return res

    def action_create_fact_find(self):
        for lead in self:
            rel_fact_find_ids = self.env['fact.find'].search([('lead_id', '=', lead.id)])
            existing_partner_ids = rel_fact_find_ids.mapped('partner_id').ids

            user_id = self.env['res.users'].search([('partner_id', '=', lead.partner_id.id)], limit=1)
            if user_id:
                if lead not in user_id.lead_ids:
                    user_id.write({'lead_ids': [(4, lead.id)]})

            for applicant in lead.applicant_ids:
                user = self.env['res.users'].search([('partner_id', '=', applicant.id)], limit=1)
                if user:
                    # Add this lead to the user's lead_ids
                    if lead not in user.lead_ids:
                        user.write({'lead_ids': [(4, lead.id)]})
                if applicant.id in existing_partner_ids:
                    continue

                self.env['fact.find'].create({
                    'first_name': applicant.first_name,
                    'surname': applicant.last_name,
                    'partner_id': applicant.id,
                    'mobile_number': applicant.mobile,
                    'email_address': applicant.email,
                    'lead_id': lead.id,
                })

    def action_assign_case_no(self):
        for lead in self:
            # Create link to user
            for applicant in lead.applicant_ids:
                user = self.env['res.users'].search([('partner_id', '=', applicant.id)], limit=1)
                if user:
                    # Add this lead to the user's lead_ids
                    if lead not in user.lead_ids:
                        user.write({'lead_ids': [(4, lead.id)]})
            # Assign case number
            if lead.product_type:
                current_year = fields.Datetime.now().year
                # user_id = lead.env.user
                if not lead.mortgage_advisor:
                    raise ValidationError("You must assign a Mortgage Advisor.")
                if not lead.mortgage_advisor.short_code:
                    raise ValidationError(
                        "The selected Mortgage Advisor does not have a short code. "
                        "Please go to Settings → Users, choose the Mortgage Advisor, and enter the short code."
                    )
                short_code = self.mortgage_advisor.short_code if self.mortgage_advisor.short_code else self.mortgage_advisor.name
                sequence = False
                if lead.product_type == 'mortgage':
                    sequence = lead.env['ir.sequence'].next_by_code('sequence.lead.mortgage')
                elif lead.product_type == 'protection':
                    sequence = lead.env['ir.sequence'].next_by_code('sequence.lead.protection')

                lead.write({'registration_no': f"{current_year}/{short_code}/{sequence}"})



            # Create a fact.find record for the lead itself
            self.env['fact.find'].create({
                'first_name': lead.first_name,
                'surname': lead.last_name,
                'partner_id': lead.partner_id.id,
                'mobile_number': lead.contact_number,
                'email_address': lead.email,
                'lead_id': lead.id,
            })

            # Create fact.find records for each applicant
            for applicant in lead.applicant_ids:
                self.env['fact.find'].create({
                    'first_name': applicant.first_name,
                    'surname': applicant.last_name,
                    'partner_id': applicant.id,
                    'mobile_number': applicant.mobile,
                    'email_address': applicant.email,
                    'lead_id': lead.id,
                })

            self.action_send_portal_invitation()
            self.action_create_fact_find()



    @api.model
    def _read_group_stage_ids(self, stages, domain, order):
        product_type = self.env.context.get('default_product_type')
        if product_type:
            search_domain = [('stage_visibility', '=', product_type)]
        else:
            search_domain = [('stage_visibility', '=', product_type)]

        return self.env['bvs.stage'].search(search_domain, order='sequence')

    def create_protection_lead(self):
        new_lead_stage = self.env['bvs.stage'].search([('is_new', '=', True), ('stage_visibility', '=', 'protection')], limit=1)

        new_lead_data = {
            'product_type': 'protection',
            'partner_id': self.partner_id.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'contact_number': self.contact_number,
            'customer_type': self.customer_type,
            'advisor_note': self.advisor_note,
            'property_found': self.property_found,
            'risk_assessment_checklist': self.risk_assessment_checklist,
            'lead_source': self.lead_source,
            'event_id': self.event_id.id,
            'property_address': self.property_address,
            'property_price': self.property_price,
            'loan_amount': self.loan_amount,
            'deposit': self.deposit,
            'lender_reference': self.lender_reference,
            'stage_id': new_lead_stage.id if new_lead_stage else False,
        }
        new_lead = self.env['bvs.lead'].create(new_lead_data)
        return {
            'name': 'New Lead Created',
            'view_type': 'form',
            'view_mode': 'form',
            'res_model': 'bvs.lead',
            'res_id': new_lead.id,
            'type': 'ir.actions.act_window',
            'target': 'current',
        }

    def _check_is_new_leader(self):
        self.is_new_leader = self.env.user.has_group('bvs_crm.group_new_lead_team_leader')

    def _check_is_new_member(self):
        self.is_new_member = self.env.user.has_group('bvs_crm.group_new_lead_team_member')

    def _check_is_financial_advisor(self):
        self.is_financial_advisor = self.env.user.has_group('bvs_crm.group_financial_advisor_internal')

    def _check_is_admin_manager(self):
        self.is_admin_manager = self.env.user.has_group('bvs_crm.group_admin_manager')

    def _check_is_fma_team_leader(self):
        self.is_fma_team_leader = self.env.user.has_group('bvs_crm.group_fma_team_leader')

    def _check_is_fma_team_member(self):
        self.is_fma_team_member = self.env.user.has_group('bvs_crm.group_fma_team_member')

    def _check_is_post_offer_leader(self):
        self.is_post_offer_leader = self.env.user.has_group('bvs_crm.group_post_offer_team_leader')

    def _check_is_post_offer_member(self):
        self.is_post_offer_member = self.env.user.has_group('bvs_crm.group_post_offer_team_member')

    def _check_is_completion_leader(self):
        self.is_completion_leader = self.env.user.has_group('bvs_crm.group_completion_team_leader')

    def _check_is_completion_member(self):
        self.is_completion_member = self.env.user.has_group('bvs_crm.group_completion_team_member')

    def _check_is_protection_leader(self):
        self.is_protection_leader = self.env.user.has_group('bvs_crm.group_protection_team_leader')

    def _check_is_protection_member(self):
        self.is_protection_member = self.env.user.has_group('bvs_crm.group_protection_team_member')

    def _check_is_advisor_support(self):
        self.is_advisor_support = self.env.user.has_group('bvs_crm.group_advisor_support')

    @api.constrains('contact_number')
    def _check_contact_number(self):
        for rec in self:
            if rec.contact_number:
                # Example: only digits, 10 characters long
                if not re.match(r'^\d{11}$', rec.contact_number):
                    raise ValidationError("Contact Number must be exactly 11 digits and cannot contain letters or special characters.")

    @api.onchange('contact_number')
    def _onchange_contact_number(self):
        """Show a warning while editing if invalid."""
        if self.contact_number and not re.match(r'^\d{11}$', self.contact_number):
            return {
                'warning': {
                    'title': "Invalid Contact Number",
                    'message': "Contact Number must contain exactly 11 digits and cannot contain letters or special characters."
                }
            }

    @api.onchange('email')
    def _onchange_email(self):
        if self.email and not re.match(r'^[^@]+@[^@]+\.[^@]+$', self.email):
            return {
                'warning': {
                    'title': "Invalid Email",
                    'message': "Please enter a valid email address (e.g. user@example.com)."
                }
            }

    @api.constrains('email')
    def _check_email(self):
        for rec in self:
            if rec.email and not re.match(r'^[^@]+@[^@]+\.[^@]+$', rec.email):
                raise ValidationError("Invalid email address format.")






