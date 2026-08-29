# MindCare NER — Security & Privacy Architecture

## 1. Compliance Framework
MindCare NER is architected in adherence to the **Digital Personal Data Protection (DPDP) Act 2023 (India)**.

### Core Security Controls
* **On-Device Storage Encryption:** Sensitive patient logs, medication confirmations, and voice recordings encrypted with AES-256 at rest.
* **Role-Based Access Control (RBAC):** Strict boundary isolation between Senior, Caregiver, Clinician, and Admin profiles.
* **Zero Commercial Tracking:** No third-party marketing SDKs, trackers, or commercial telemetry.
* **Explicit Family Consent:** Right-to-forget and export mechanisms for all collected activity logs.
