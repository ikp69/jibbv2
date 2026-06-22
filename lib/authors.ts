/**
 * Author LinkedIn mapping for EEAT (Expertise, Authoritativeness, Trustworthiness)
 * Maps author names to their LinkedIn profiles from the leadership team
 */

export const authorLinkedInMap: Record<string, string> = {
  "Varun Tyagi": "https://www.linkedin.com/in/varuntyagi/",
  "Ujjawal Dahiya": "https://www.linkedin.com/in/ujjawal-dahiya-b8aa98178/",
  "Pratiksha Pandey": "https://www.linkedin.com/in/dr-pratiksha-pandey-217549318/",
  "Vardaan Chaudhary": "https://www.linkedin.com/in/vardaan-chaudhary-a968431ba/",
  "Shigemaro Yasui": "https://www.linkedin.com/in/shigemaro-yasui/",
  "Mai Hashikura": "https://www.linkedin.com/in/mai-hashikura-5b505b265/",
  "Hitesh Gupta": "https://www.linkedin.com/in/hiteshgupttaa/",
  "Gyanendra Yadav": "",
  "Akash Pandey": "",
  "Nobuchika Akiya": "",
  "Aya Saito": "",
};

/**
 * Get LinkedIn profile URL for an author
 */
export function getAuthorLinkedIn(author: string): string | null {
  return authorLinkedInMap[author] || null;
}

/**
 * Check if author has a LinkedIn profile
 */
export function hasAuthorLinkedIn(author: string): boolean {
  const linkedIn = getAuthorLinkedIn(author);
  return !!linkedIn && linkedIn.length > 0;
}
