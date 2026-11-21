# PJ2608-0553 document numbers

The ADDVALUE company code in client document numbers is **ADDV**, never **ADV**.

PTTEP-style numbers follow `MM-ZTK-1F-GEN-ADDV-TEL-...`. The shared constant is `ADDVALUE_DOCUMENT_COMPANY_CODE_0553` in `frontend/src/project0553/data/addvalueDocumentCode0553.js`. Every filename builder for these documents must use that constant.

Supplier quote identities that already contain ADV, such as `NG/260916-ADV-DAP1`, are the supplier's own reference and are not this company code.
