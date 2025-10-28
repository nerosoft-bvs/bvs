from odoo import api, models, fields, _


class FactFindInitialDocuments(models.Model):
    _inherit = 'fact.find'

    alteration_passport = fields.Many2many(
        'ir.attachment', 'bvs_lead_alteration_passport_rel', 'lead_id', 'attachment_id',
        string='Alteration page in the passport if available / Change of name deed'
    )

    passport_pages = fields.Many2many(
        'ir.attachment', 'bvs_lead_passport_pages_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of the first 2 pages of the duly signed passport in white background without cropping the edges'
    )

    expired_passport_driving_license = fields.Many2many(
        'ir.attachment', 'bvs_lead_expired_passport_driving_license_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of the two sides of Driving License if passport is expired'
    )

    brp_visa_stamp = fields.Many2many(
        'ir.attachment', 'bvs_lead_brp_visa_stamp_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of both sides of your BRP / Visa Stamp if applicable only with the first two pages of the old passport'
    )

    immigration_status_sharecode = fields.Char(string='Sharecode')

    utility_bill_past_3_months = fields.Many2many(
        'ir.attachment', 'bvs_lead_utility_bill_past_3_months_rel', 'lead_id', 'attachment_id',
        string='One of the following documents issued within last 3 months (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement) / Latest Council tax bill'
    )

    postal_document_past_3_months = fields.Many2many(
        'ir.attachment', 'bvs_lead_postal_document_past_3_months_rel', 'lead_id', 'attachment_id',
        string='One of the following documents issued within last 3 months received via post since the online documents are not acceptable (Electricity Bill / Gas bill / Land phone bill / Credit card bill / Bank statement)'
    )

    proof_of_address_driving_license = fields.Many2many(
        'ir.attachment', 'bvs_lead_proof_address_driving_license_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of both sides of the driving license as proof of address'
    )

    employment_appointment_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_employment_appointment_letter_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of the duly signed, all pages of employment appointment letter evidencing the working hours and remuneration'
    )

    employment_contract = fields.Many2many(
        'ir.attachment', 'bvs_lead_employment_contract_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of the duly signed letter of current contract'
    )

    last_2_years_bonus_payslips = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_2_years_bonus_payslips_rel', 'lead_id', 'attachment_id',
        string='Last 2 years bonus payslips of each employment'
    )

    last_3_months_payslips = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_3_months_payslips_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months payslips of each employment'
    )

    last_2_years_p60 = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_2_years_p60_rel', 'lead_id', 'attachment_id',
        string='Last 2 years P60'
    )

    last_3_months_bank_statements_salary = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_3_months_bank_statements_salary_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements by showing salary credit which clearly show the account number, sort code, account holder\'s name and address'
    )

    salary_increment_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_salary_increment_letter_rel', 'lead_id', 'attachment_id',
        string='Salary increment letter if any pay rise available in last 3 months'
    )

    name_confirmation_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_name_confirmation_letter_rel', 'lead_id', 'attachment_id',
        string='Name confirmation letter issued by the employer If the name in the payslip is different from the bank statement'
    )

    last_3_months_bank_statements_pension = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_3_months_bank_statements_pension_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements by showing the pension credit which clearly show the account number, sort code, account holder\'s name and address'
    )

    pension_forecast_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_pension_forecast_statement_rel', 'lead_id', 'attachment_id',
        string='Private or Company Pension Forecast / State Pension Statement or Annuity Statement dated within the last 3 months'
    )

    last_2_years_tax_calculations = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_2_years_tax_calculations_rel', 'lead_id', 'attachment_id',
        string='Last two years tax calculations (SA302)'
    )

    last_2_years_tax_year_overview = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_2_years_tax_year_overview_rel', 'lead_id', 'attachment_id',
        string='Last two years tax year Overview'
    )

    last_2_years_tax_returns = fields.Many2many(
        'ir.attachment', 'bvs_lead_last_2_years_tax_returns_rel', 'lead_id', 'attachment_id',
        string='Last 2 years Tax Returns (SA100)'
    )

    latest_3_months_company_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_latest_3_months_company_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months company bank statements'
    )

    signed_finalized_latest_2_years_company_accounts = fields.Many2many(
        'ir.attachment', 'bvs_lead_signed_finalized_latest_2_years_company_accounts_rel', 'lead_id', 'attachment_id',
        string='Signed and finalized Latest 2 years company accounts'
    )

    bank_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_bank_statement_rel', 'lead_id', 'attachment_id',
        string='Bank Statement'
    )

    tax_credit_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_tax_credit_statement_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of all pages of the statement issued from the HMRC for tax credits (including the blank pages)'
    )

    universal_tax_credit_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_universal_tax_credit_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months statements of universal tax credit'
    )

    child_tax_credit_award_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_child_tax_credit_award_letter_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of all pages of the Child Tax credit award letter issued by DWP (including blank pages)'
    )

    pip_dla_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_pip_dla_letter_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of all pages of the PIP / DLA letter issued by DWP (including bland pages)'
    )

    latest_multi_agency_credit_report = fields.Many2many(
        'ir.attachment', 'bvs_lead_latest_multi_agency_credit_report_rel', 'lead_id', 'attachment_id',
        string='Latest multi agency credit report generated within 2 weeks'
    )

    latest_clearance_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_latest_clearance_statement_rel', 'lead_id', 'attachment_id',
        string='Latest clearance statement if any commitment has been paid off in last month'
    )

    other_expenses_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_other_expenses_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements showing monthly expenses if the statement is different from salary credit which clearly show the account number, sort code, account holders name and addresses'
    )

    bank_statement_name_confirmation = fields.Many2many(
        'ir.attachment', 'bvs_lead_bank_statement_name_confirmation_rel', 'lead_id', 'attachment_id',
        string='If the name in the bank statement is different from the passport, name confirmation letter from the bank'
    )

    requested_direct_debit_bank_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_requested_direct_debit_bank_statement_rel', 'lead_id', 'attachment_id',
        string='Latest bank statement of requested Direct debit account which clearly shows the account number, sort code, account holder\'s name and address'
    )

    direct_debit_account_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_direct_debit_account_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest bank statement of requested Direct debit account which clearly show the account number, sort code, account holder\'s name and address'
    )

    spv_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_spv_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements of the SPV'
    )
    reservation_form = fields.Many2many(
        'ir.attachment', 'bvs_lead_reservation_form_rel', 'lead_id', 'attachment_id',
        string='Reservation Form'
    )

    cml_form = fields.Many2many(
        'ir.attachment', 'bvs_lead_cml_form_rel', 'lead_id', 'attachment_id',
        string='CML form'
    )

    memorandum_of_sale = fields.Many2many(
        'ir.attachment', 'bvs_lead_memorandum_of_sale_rel', 'lead_id', 'attachment_id',
        string='Memorandum of Sale'
    )

    epc = fields.Many2many(
        'ir.attachment', 'bvs_lead_epc_rel', 'lead_id', 'attachment_id',
        string='EPC'
    )

    peal = fields.Many2many(
        'ir.attachment', 'bvs_lead_peal_rel', 'lead_id', 'attachment_id',
        string='PEA'
    )
    mortgage_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_mortgage_statement_rel', 'lead_id', 'attachment_id',
        string='Mortgage statement showing the monthly payments'
    )

    arla_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_arla_letter_rel', 'lead_id', 'attachment_id',
        string='ARLA letter issued by a ARLA registered estate agent by confirming the expected monthly rental income'
    )

    sales_particulars = fields.Many2many(
        'ir.attachment', 'bvs_lead_sales_particulars_rel', 'lead_id', 'attachment_id',
        string='Sales Particular'
    )
    tenancy_agreement = fields.Many2many(
        'ir.attachment', 'bvs_lead_tenancy_agreement_rel', 'lead_id', 'attachment_id',
        string='Tenancy Agreement if BTL remortgage'
    )

    tenancy_agreements_multiple_occupants = fields.Many2many(
        'ir.attachment', 'bvs_lead_tenancy_agreements_multiple_occupants_rel', 'lead_id', 'attachment_id',
        string='Tenancy Agreements issued for multiple occupants'
    )

    annual_payment_information_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_annual_payment_information_letter_rel', 'lead_id', 'attachment_id',
        string='Latest annual payment information letter for HTB loan'
    )

    gifted_deposit_format = fields.Many2many(
        'ir.attachment', 'bvs_lead_gifted_deposit_format_rel', 'lead_id', 'attachment_id',
        string='Format of gifted deposit (editable pdf)'
    )

    gifted_deposit_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_gifted_deposit_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements of the donor'
    )

    latest_3_months_bank_statements_rental = fields.Many2many(
        'ir.attachment', 'bvs_lead_latest_3_months_bank_statements_rental_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements by evidencing the credit of monthly rental'
    )

    latest_3_months_bank_statements_mortgage = fields.Many2many(
        'ir.attachment', 'bvs_lead_latest_3_months_bank_statements_mortgage_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements by evidencing the mortgage payment of BTL property'
    )
    driving_license = fields.Many2many(
        'ir.attachment', 'bvs_lead_driving_license_rel', 'lead_id', 'attachment_id',
        string='If the passport is expired, scanned copy of the two sides of Driving License'
    )
    sharecode_immigration_status = fields.Many2many(
        'ir.attachment', 'bvs_lead_sharecode_immigration_status_rel', 'lead_id', 'attachment_id',
        string='Sharecode for Immigration Status downloaded by HMRC'
    )
    electricity_bill = fields.Many2many(
        'ir.attachment', 'bvs_lead_electricity_bill_rel', 'lead_id', 'attachment_id',
        string='Electricity Bill'
    )
    gas_bill = fields.Many2many(
        'ir.attachment', 'bvs_lead_gas_bill_rel', 'lead_id', 'attachment_id',
        string='Gas Bill'
    )
    land_phone_bill = fields.Many2many(
        'ir.attachment', 'bvs_lead_land_phone_bill_rel', 'lead_id', 'attachment_id',
        string='Land Phone Bill'
    )
    credit_card_bill = fields.Many2many(
        'ir.attachment', 'bvs_lead_credit_card_bill_rel', 'lead_id', 'attachment_id',
        string='Credit Card Bill'
    )
    # contract_letter = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_contract_letter_rel', 'lead_id', 'attachment_id',
    #     string='Scanned copy of the duly signed letter of current contract'
    # )

    # bonus_payslips = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_bonus_payslips_rel', 'lead_id', 'attachment_id',
    #     string='Last 2 years bonus payslips of each employment'
    # )

    latest_payslips = fields.Many2many(
        'ir.attachment', 'bvs_lead_latest_payslips_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months payslips of each employment'
    )

    p60 = fields.Many2many(
        'ir.attachment', 'bvs_lead_p60_rel', 'lead_id', 'attachment_id',
        string='Last 2 years P60'
    )

    # salary_bank_statements = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_salary_bank_statements_rel', 'lead_id', 'attachment_id',
    #     string='Latest 3 months bank statements showing salary credit which clearly show the account number, sort code, account holder\'s name and address'
    # )

    pension_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_pension_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements showing the pension credit which clearly show the account number, sort code, account holder\'s name and address'
    )

    # pension_forecast = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_pension_forecast_rel', 'lead_id', 'attachment_id',
    #     string='Private or Company Pension Forecast / State Pension Statement or Annuity Statement dated within the last 3 months'
    # )

    tax_calculations = fields.Many2many(
        'ir.attachment', 'bvs_lead_tax_calculations_rel', 'lead_id', 'attachment_id',
        string='Last two years tax calculations (SA302)'
    )

    tax_year_overview = fields.Many2many(
        'ir.attachment', 'bvs_lead_tax_year_overview_rel', 'lead_id', 'attachment_id',
        string='Last two years tax year Overview'
    )

    tax_returns = fields.Many2many(
        'ir.attachment', 'bvs_lead_tax_returns_rel', 'lead_id', 'attachment_id',
        string='Last 2 years Tax Returns (SA100)'
    )

    # company_bank_statements = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_company_bank_statements_rel', 'lead_id', 'attachment_id',
    #     string='Latest 3 months company bank statements'
    # )

    # company_accounts = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_company_accounts_rel', 'lead_id', 'attachment_id',
    #     string='Signed and finalized latest 2 years company accounts'
    # )

    other_income_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_other_income_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements showing the credit of the other income which clearly show the account number, sort code, account holder\'s name and address'
    )

    tax_credits_statement = fields.Many2many(
        'ir.attachment', 'bvs_lead_tax_credits_statement_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of all pages of the statement issued from the HMRC for tax credits (including the blank pages)'
    )

    # universal_tax_credit = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_universal_tax_credit_rel', 'lead_id', 'attachment_id',
    #     string='Latest 3 months statements of universal tax credit'
    # )

    # child_tax_credit = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_child_tax_credit_rel', 'lead_id', 'attachment_id',
    #     string='Scanned copy of all pages of the Child Tax credit award letter issued by DWP (including blank pages)'
    # )

    pip_dla_letter = fields.Many2many(
        'ir.attachment', 'bvs_lead_pip_dla_letter_rel', 'lead_id', 'attachment_id',
        string='Scanned copy of all pages of the PIP / DLA letter issued by DWP (including blank pages)'
    )

    # credit_report = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_credit_report_rel', 'lead_id', 'attachment_id',
    #     string='Latest multi agency credit report generated within 2 weeks'
    # )

    # clearance_statement = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_clearance_statement_rel', 'lead_id', 'attachment_id',
    #     string='Latest clearance statement if any commitment has been paid off in last month'
    # )

    monthly_expenses_bank_statements = fields.Many2many(
        'ir.attachment', 'bvs_lead_monthly_expenses_bank_statements_rel', 'lead_id', 'attachment_id',
        string='Latest 3 months bank statements showing monthly expenses if the statement is different from salary credit which clearly show the account number, sort code, account holders name and address'
    )

    # bank_name_confirmation = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_bank_name_confirmation_rel', 'lead_id', 'attachment_id',
    #     string='If the name in the bank statement is different from the passport, name confirmation letter from the bank'
    # )

    # direct_debit_account_bank_statements = fields.Many2many(
    #     'ir.attachment', 'bvs_lead_direct_debit_account_bank_statements_rel', 'lead_id', 'attachment_id',
    #     string='Latest bank statement of requested Direct debit account which clearly shows the account number, sort code, account holder\'s name and address'
    # )

    pea = fields.Many2many(
        'ir.attachment', 'bvs_lead_pea_rel', 'lead_id', 'attachment_id',
        string='PEA'
    )

    sales_particular = fields.Many2many(
        'ir.attachment', 'bvs_lead_sales_particular_rel', 'lead_id', 'attachment_id',
        string='Sales Particular'
    )
    driving_license_proof_address = fields.Many2many(
        'ir.attachment', 'bvs_lead_driving_license_proof_address_rel', 'lead_id', 'attachment_id',
        string='Driving License Proof of Address'
    )