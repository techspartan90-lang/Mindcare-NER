# MindCare NER — Security, Privacy & Compliance Architecture

**Compliance Standards:** Digital Personal Data Protection Act (DPDPA 2023 - India), Non-Diagnostic Clinical Safety Standards, Role-Based Access Control (RBAC).

---

## 1. Role-Based Access Control (RBAC) Matrix

| Resource / Action | Patient | Caregiver | Healthcare Worker / Doctor | Administrator |
|---|---|---|---|---|
| View Patient Dashboard | ✅ Own | ✅ Linked | ✅ Assigned Cohort | ✅ All |
| Play Cognitive Games | ✅ | ❌ | ❌ | ❌ |
| Check-off Daily Medicine | ✅ | ✅ Assisted | ❌ | ❌ |
| View Non-Diagnostic Reports | ❌ | ✅ Summary | ✅ Full Clinical Trends | ✅ |
| Manage Family Memory Album | ❌ Play Only | ✅ Full Upload & Edit | ❌ View Only | ✅ |
| Resolve Caregiver Alerts | ❌ | ✅ | ✅ | ✅ |
| Modify Regional Content Pool | ❌ | ❌ | ❌ | ✅ |
| Inspect Audit Logs | ❌ | ❌ | ❌ | ✅ |

---

## 2. Data Sovereignty & Privacy Controls

1. **Local-First Audio Storage:** Spoken voice notes and reminiscence responses are processed on-device whenever possible. Audio recordings are stored in secure local sandboxes.
2. **Non-Diagnostic Ethics:** The application displays clear disclaimers that MindCare NER provides cognitive stimulation and routine adherence tracking, not formal neurological diagnostic scoring.
3. **Audit Logging:** Every administrative action, caregiver override, and clinical export is immutably recorded in `audit_logs`.
