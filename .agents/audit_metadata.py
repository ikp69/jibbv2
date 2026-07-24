import glob
import os
import re

def audit_metadata(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'generateMetadata' not in content and 'metadata' not in content:
        return None

    # Check for hardcoded metadata title and description
    title_matches = re.findall(r'title:\s*["`\']([^"`\']+)["`\']|title\s*=\s*["`\']([^"`\']+)["`\']', content)
    desc_matches = re.findall(r'description:\s*["`\']([^"`\']+)["`\']|description\s*=\s*["`\']([^"`\']+)["`\']', content)

    # Check if locale condition (locale === "ja") exists in generateMetadata
    has_locale_check = 'locale === "ja"' in content or 'locale === \'ja\'' in content or 'getTranslations' in content or 't(' in content

    return {
        'path': file_path,
        'has_locale_check': has_locale_check,
        'title_matches': [t[0] or t[1] for t in title_matches],
        'desc_matches': [d[0] or d[1] for d in desc_matches]
    }

page_files = sorted(glob.glob('app/**/page.tsx', recursive=True) + glob.glob('app/**/layout.tsx', recursive=True))

report_md = """# Metadata (Title & Description) i18n Audit Report for `/ja/*` Pages

This report audits every `page.tsx` and `layout.tsx` file for SEO metadata title and description localization.

---

"""

total_pages = len(page_files)
missing_ja_meta = 0

for p in page_files:
    res = audit_metadata(p)
    if res:
        abs_p = os.path.abspath(res['path']).replace('\\', '/')
        is_localized = "Yes" if res['has_locale_check'] else "NO (Hardcoded English Meta)"
        if not res['has_locale_check']:
            missing_ja_meta += 1
            
        report_md += f"## Page: [`{res['path']}`](file:///{abs_p})\n"
        report_md += f"- **Localized for `/ja`**: `{is_localized}`\n"
        if res['title_matches']:
            report_md += f"- **Found Title(s)**: `{res['title_matches']}`\n"
        if res['desc_matches']:
            report_md += f"- **Found Description(s)**: `{res['desc_matches']}`\n"
        report_md += "\n---\n\n"

with open('metadata_ja_audit_report.md', 'w', encoding='utf-8') as f:
    f.write(report_md)

print(f"Metadata audit complete! Audited {total_pages} files. Found {missing_ja_meta} pages needing metadata localization.")
