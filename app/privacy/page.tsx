import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Africa Health",
  description: "How Africa Health handles your health information",
};

const LAST_UPDATED = "March 2026";
const CONTACT_EMAIL = "privacy@africahealth.app"; // replace with your email
const APP_NAME = "Africa Health";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050A14", fontFamily: "'Sora', sans-serif", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        h2 { font-size: 1.1rem; font-weight: 700; margin: 2rem 0 0.75rem; color: white; }
        p, li { font-size: 0.92rem; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 0.75rem; }
        ul { padding-left: 1.25rem; margin-bottom: 0.75rem; }
        li { margin-bottom: 0.4rem; }
        a { color: #63B3ED; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .highlight { background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.2); border-radius: 10px; padding: 1rem 1.25rem; margin: 1.5rem 0; }
        .highlight p { color: rgba(255,255,255,0.8); margin: 0; }
        hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 2rem 0; }
      `}</style>

      {/* Nav */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#4299E1,#63B3ED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>+</div>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#63B3ED" }}>{APP_NAME}</span>
        </a>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Legal</p>
        <h1>Privacy Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "2rem" }}>Last updated: {LAST_UPDATED}</p>

        <div className="highlight">
          <p>
            <strong style={{ color: "white" }}>The short version:</strong> {APP_NAME} does not store your symptoms, age, gender, or any health information on our servers. Your symptom data is sent to Anthropic&apos;s AI to generate a response, then discarded. We do not sell data. We do not show ads.
          </p>
        </div>

        <h2>1. Who we are</h2>
        <p>
          {APP_NAME} is a health education service that provides AI-powered symptom assessment for users in Sub-Saharan Africa. We are not a medical provider. Our service is for informational and educational purposes only.
        </p>
        <p>
          For privacy-related enquiries, contact us at: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>

        <h2>2. What data we collect</h2>
        <p>We collect the minimum data necessary to provide the service:</p>
        <ul>
          <li><strong style={{ color: "white" }}>Symptom assessment inputs</strong> — symptoms, age, gender, duration, severity, and country. This is sent to Anthropic&apos;s API to generate your assessment and is not stored on our servers after the response is returned.</li>
          <li><strong style={{ color: "white" }}>Assessment history</strong> — stored locally on your device only (in your browser&apos;s localStorage). We never transmit or store this on our servers. You can clear it at any time by clearing your browser data.</li>
          <li><strong style={{ color: "white" }}>Language preference</strong> — stored locally on your device only.</li>
          <li><strong style={{ color: "white" }}>Anonymous usage analytics</strong> — if enabled, we collect aggregated, anonymised data such as page views and feature usage to improve the service. No personal or health information is included.</li>
          <li><strong style={{ color: "white" }}>IP address</strong> — used for rate limiting (preventing abuse) and is not linked to any health data. Not stored beyond the rate-limiting window.</li>
        </ul>

        <h2>3. What we do NOT collect</h2>
        <ul>
          <li>We do not collect your name, email address, or phone number unless you contact us directly.</li>
          <li>We do not create user accounts or profiles.</li>
          <li>We do not track you across other websites.</li>
          <li>We do not sell, rent, or share your data with third parties for marketing.</li>
        </ul>

        <h2>4. How your data is used</h2>
        <p>Your symptom inputs are sent to <a href="https://www.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic, PBC</a> via their API to generate a health education response. Anthropic processes this data subject to their <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://www.anthropic.com/legal/data-processing-addendum" target="_blank" rel="noopener noreferrer">Data Processing Addendum</a>. Anthropic does not use API inputs to train their models by default.</p>
        <p>We do not use your health data for any purpose other than generating the assessment you requested.</p>

        <h2>5. Data storage and security</h2>
        <p>Assessment inputs are not persisted on our servers. The only data stored server-side is anonymised rate-limiting counters (IP-based, no health data) which expire within 24 hours.</p>
        <p>Your assessment history exists only in your browser&apos;s localStorage on your device. Treat your device as you would any personal health record.</p>

        <hr />

        <h2>6. Nigeria — NDPR compliance</h2>
        <p>
          We comply with Nigeria&apos;s National Data Protection Regulation (NDPR) 2019. Health data is classified as sensitive personal data under the NDPR. We collect the minimum necessary, do not store it beyond the session, and do not transfer it to third parties except as described in Section 4. You have the right to request deletion of any data we hold about you by contacting <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>7. South Africa — POPIA compliance</h2>
        <p>
          We comply with the Protection of Personal Information Act (POPIA) 2013. As a responsible party, we process personal information only for the lawful purpose of providing health education. Health information is a special category under POPIA and is processed with your explicit consent (given by using the service). You have the right to access, correct, or delete information we hold. Contact our Information Officer at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>8. GDPR (users in the EU/UK)</h2>
        <p>
          If you access this service from the European Economic Area or United Kingdom, you have rights under GDPR including access, rectification, erasure, and data portability. Our lawful basis for processing is your explicit consent. Given we do not store health data server-side, most GDPR rights are satisfied by design. For any requests, contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <hr />

        <h2>9. Children</h2>
        <p>
          Our service may be used to assess symptoms on behalf of children, but it is intended to be operated by an adult caregiver. We do not knowingly collect personal data from children under 13 directly. If you believe a child has submitted data directly, contact us and we will delete it.
        </p>

        <h2>10. Cookies</h2>
        <p>
          We do not use tracking cookies. We use browser localStorage (not cookies) to store your language preference and local assessment history. No third-party advertising or analytics cookies are set.
        </p>

        <h2>11. Third-party services</h2>
        <ul>
          <li><strong style={{ color: "white" }}>Anthropic API</strong> — processes symptom inputs to generate assessments. <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Anthropic Privacy Policy →</a></li>
          <li><strong style={{ color: "white" }}>Vercel</strong> — hosts this application. Vercel may log request metadata (IP, timestamp) per their infrastructure policies. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy →</a></li>
          <li><strong style={{ color: "white" }}>Upstash Redis</strong> — stores anonymised rate-limiting counters (no health data). <a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener noreferrer">Upstash Privacy Policy →</a></li>
        </ul>

        <h2>12. Changes to this policy</h2>
        <p>
          We may update this policy as the service evolves. Material changes will be noted at the top of this page with an updated date. Continued use of the service after changes constitutes acceptance of the updated policy.
        </p>

        <h2>13. Contact</h2>
        <p>
          For any privacy questions, data requests, or concerns: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>

        <hr />
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.2)" }}>
          {APP_NAME} is a health education service. Nothing on this platform constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
}