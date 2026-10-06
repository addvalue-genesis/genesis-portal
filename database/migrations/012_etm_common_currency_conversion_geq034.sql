SET NAMES utf8mb4;

-- PJ2608-0550 controlled equation extension.
-- GEQ-034 is a COMMON / GENERIC currency-conversion identity.
-- Project/system-specific FX facts are bound separately; source currency amount remains unchanged.

INSERT INTO etm_equation_registry
(equation_code,equation_layer,equation_domain,equation_name,expression_text,model_class,evidence_basis,grounding_class,calibration_state,control_status,method_source,method_revision,control_note)
VALUES
(
  'GEQ-034',
  'COMMON',
  'CURRENCY_CONVERSION',
  'Controlled Currency Conversion',
  'P_to = P_from × R_from,THB / R_to,THB',
  'MATHEMATICAL_IDENTITY / COMMON_GENERIC',
  'CONTROLLED_FX_AUTHORITY_DATE_RATE_TYPE',
  'IDENTITY_WITH_EXTERNAL_RATE_INPUT',
  'N/A',
  'CONTROLLED_WORKING_BASELINE',
  'PJ2608-0550-FX-CONTROL',
  'Rev00',
  'Source amount and source currency remain authoritative. Cross-currency display is a derived value using one controlled FX authority/date/rate type. Current project policy uses BOT FM_FX_001_S3 MID RATE as working/reference FX.'
)
ON DUPLICATE KEY UPDATE
 equation_layer=VALUES(equation_layer),
 equation_domain=VALUES(equation_domain),
 equation_name=VALUES(equation_name),
 expression_text=VALUES(expression_text),
 model_class=VALUES(model_class),
 evidence_basis=VALUES(evidence_basis),
 grounding_class=VALUES(grounding_class),
 calibration_state=VALUES(calibration_state),
 control_status=VALUES(control_status),
 method_source=VALUES(method_source),
 method_revision=VALUES(method_revision),
 control_note=VALUES(control_note);

INSERT INTO etm_equation_method_sources
(source_code,source_project,source_title,source_revision,source_type,reuse_policy,source_uri,status)
VALUES
(
  'PJ2608-0550-FX-CONTROL',
  'PJ2608-0550',
  'Bank of Thailand FM_FX_001_S3 FX control binding',
  '2026-10-06 MID',
  'PROJECT_STANDARD',
  'Use the common conversion identity with the controlled BOT rate date/type. Do not mutate source/vendor currency values.',
  'https://app.bot.or.th/BTWS_STAT/statistics/ReportPage.aspx?language=eng&reportID=123',
  'ACTIVE'
)
ON DUPLICATE KEY UPDATE
 source_title=VALUES(source_title),
 source_revision=VALUES(source_revision),
 source_type=VALUES(source_type),
 reuse_policy=VALUES(reuse_policy),
 source_uri=VALUES(source_uri),
 status=VALUES(status);
