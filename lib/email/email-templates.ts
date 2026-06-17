/**
 * Beautiful HTML email templates for NPO JIBB form notifications
 */

// SECURITY: Escape all user-supplied values before HTML interpolation
function escapeHtml(unsafe: string | undefined | null): string {
  return (unsafe ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fa; color: #1e293b; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .header { background: linear-gradient(135deg, #FF6000 0%, #E65100 100%); padding: 32px 24px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
  .content { padding: 32px 24px; }
  .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #FF6000; margin-bottom: 16px; }
  .field-group { margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
  .field-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
  .field-value { font-size: 15px; color: #0f172a; line-height: 1.5; font-weight: 500; }
  .footer { background-color: #f8fafc; padding: 24px; text-align: center; border-t: 1px solid #e2e8f0; }
  .footer p { font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5; }
  .btn { display: inline-block; background-color: #FF6000; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; margin-top: 16px; font-size: 14px; text-align: center; }
`;

export function getContactNotificationEmail(data: { inquiryType: string; name: string; email: string; phone?: string; message: string; }) {
  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="header"><h1>New Contact Inquiry</h1></div>
      <div class="content">
        <div class="section-title">Submission Details</div>
        <div class="field-group"><div class="field-label">Inquiry Type</div><div class="field-value" style="text-transform: capitalize;">${escapeHtml(data.inquiryType)}</div></div>
        <div class="field-group"><div class="field-label">Full Name</div><div class="field-value">${escapeHtml(data.name)}</div></div>
        <div class="field-group"><div class="field-label">Email Address</div><div class="field-value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div></div>
        <div class="field-group"><div class="field-label">Phone Number</div><div class="field-value">${escapeHtml(data.phone) || "N/A"}</div></div>
        <div class="field-group" style="border-bottom: none;"><div class="field-label">Message Details</div><div class="field-value" style="white-space: pre-wrap; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9;">${escapeHtml(data.message)}</div></div>
      </div>
      <div class="footer"><p>This is an automated system notification from Japan-India Business Bureau (JIBB) portal.</p></div>
    </div></body></html>`;
}

export function getMembershipNotificationEmail(data: { membershipTier: string; companyName: string; contactPerson: string; email: string; phone: string; industry?: string; companySize?: string; message?: string; }) {
  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="header"><h1>New Membership Application</h1></div>
      <div class="content">
        <div class="section-title">Application Info</div>
        <div class="field-group"><div class="field-label">Requested Membership Tier</div><div class="field-value" style="text-transform: uppercase; color: #FF6000; font-weight: 800;">${escapeHtml(data.membershipTier)}</div></div>
        <div class="field-group"><div class="field-label">Company Name</div><div class="field-value">${escapeHtml(data.companyName)}</div></div>
        <div class="field-group"><div class="field-label">Contact Person</div><div class="field-value">${escapeHtml(data.contactPerson)}</div></div>
        <div class="field-group"><div class="field-label">Email</div><div class="field-value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div></div>
        <div class="field-group"><div class="field-label">Phone</div><div class="field-value">${escapeHtml(data.phone)}</div></div>
        <div class="field-group"><div class="field-label">Industry</div><div class="field-value">${escapeHtml(data.industry) || "N/A"}</div></div>
        <div class="field-group"><div class="field-label">Company Size</div><div class="field-value">${escapeHtml(data.companySize) || "N/A"}</div></div>
        <div class="field-group" style="border-bottom: none;"><div class="field-label">Message Details / Objectives</div><div class="field-value" style="white-space: pre-wrap; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9;">${escapeHtml(data.message) || "No message provided."}</div></div>
      </div>
      <div class="footer"><p>JIBB Portal Membership Administration Service</p></div>
    </div></body></html>`;
}

export function getMembershipConfirmationEmail(data: { contactPerson: string; membershipTier: string; }) {
  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="header"><h1>Welcome to NPO JIBB</h1></div>
      <div class="content" style="text-align: left;">
        <h2 style="margin-top: 0; color: #0f172a;">Dear ${escapeHtml(data.contactPerson)},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for applying for a <strong>${escapeHtml(data.membershipTier.toUpperCase())}</strong> membership with the Japan-India Business Bureau (JIBB) Association.</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Our team is currently reviewing your registration information. Once approved, we will send you an invitation to activate your access key to the member-only portal, unlocking research databases and bilateral networking opportunities.</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:membership@npo-jibb.org">membership@npo-jibb.org</a>.</p>
        <p style="margin-top: 32px; font-weight: 700; font-size: 15px;">Warm regards,<br><span style="color: #FF6000;">The JIBB Onboarding Team</span></p>
      </div>
      <div class="footer"><p>&copy; 2026 Japan-India Business Bureau. All rights reserved.</p></div>
    </div></body></html>`;
}

export function getMatchRequestNotificationEmail(data: { memberName: string; memberEmail: string; title: string; targetSector: string; details: string; }) {
  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="header"><h1>New Matchmaking Request</h1></div>
      <div class="content">
        <div class="section-title">B2B Match Details</div>
        <div class="field-group"><div class="field-label">Submitted By Member</div><div class="field-value">${escapeHtml(data.memberName)} (${escapeHtml(data.memberEmail)})</div></div>
        <div class="field-group"><div class="field-label">Target Sector</div><div class="field-value" style="text-transform: capitalize;">${escapeHtml(data.targetSector)}</div></div>
        <div class="field-group"><div class="field-label">Inquiry Title</div><div class="field-value">${escapeHtml(data.title)}</div></div>
        <div class="field-group" style="border-bottom: none;"><div class="field-label">Collaboration Requirements</div><div class="field-value" style="white-space: pre-wrap; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9;">${escapeHtml(data.details)}</div></div>
      </div>
      <div class="footer"><p>JIBB B2B Collaboration Desk Support</p></div>
    </div></body></html>`;
}

export function getEventRegistrationNotificationEmail(data: { eventId: string; name: string; company: string; designation: string; email: string; phone: string; attendeeType: string; }) {
  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="header"><h1>Event Registration Received</h1></div>
      <div class="content">
        <div class="section-title">Registration Details</div>
        <div class="field-group"><div class="field-label">Event ID / Code</div><div class="field-value">${escapeHtml(data.eventId)}</div></div>
        <div class="field-group"><div class="field-label">Attendee Name</div><div class="field-value">${escapeHtml(data.name)} (${escapeHtml(data.attendeeType.toUpperCase())})</div></div>
        <div class="field-group"><div class="field-label">Company &amp; Designation</div><div class="field-value">${escapeHtml(data.company)} - ${escapeHtml(data.designation)}</div></div>
        <div class="field-group"><div class="field-label">Contact Email</div><div class="field-value">${escapeHtml(data.email)}</div></div>
        <div class="field-group" style="border-bottom: none;"><div class="field-label">Contact Phone</div><div class="field-value">${escapeHtml(data.phone)}</div></div>
      </div>
      <div class="footer"><p>JIBB Events Operations Center</p></div>
    </div></body></html>`;
}

export function getCareerApplicationNotificationEmail(data: { name: string; email: string; phone: string; position: string; resumeUrl: string; coverLetter?: string; }) {
  return `<!DOCTYPE html><html><head><style>${emailStyles}</style></head><body>
    <div class="container">
      <div class="header"><h1>New Career Application</h1></div>
      <div class="content">
        <div class="section-title">Applicant Details</div>
        <div class="field-group"><div class="field-label">Position Applied For</div><div class="field-value" style="font-weight: 700;">${escapeHtml(data.position)}</div></div>
        <div class="field-group"><div class="field-label">Applicant Name</div><div class="field-value">${escapeHtml(data.name)}</div></div>
        <div class="field-group"><div class="field-label">Contact</div><div class="field-value">${escapeHtml(data.email)} | ${escapeHtml(data.phone)}</div></div>
        <div class="field-group"><div class="field-label">Resume / Curriculum Vitae</div><div class="field-value"><a href="${escapeHtml(data.resumeUrl)}" target="_blank" class="btn" style="margin-top: 4px; display: inline-block;">Download CV / Resume</a></div></div>
        <div class="field-group" style="border-bottom: none; margin-top: 24px;"><div class="field-label">Cover Letter / Intro Note</div><div class="field-value" style="white-space: pre-wrap; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9;">${escapeHtml(data.coverLetter) || "No cover letter submitted."}</div></div>
      </div>
      <div class="footer"><p>JIBB HR Talent Management Portal</p></div>
    </div></body></html>`;
}
