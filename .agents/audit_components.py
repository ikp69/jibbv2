import glob
import os
import re

def analyze_component(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    has_use_translations = any('useTranslations' in l for l in lines)
    
    hardcoded_strings = []

    for idx, l in enumerate(lines, 1):
        if l.strip().startswith('//') or l.strip().startswith('/*') or 'import' in l or 'console.' in l:
            continue
            
        tag_text = re.findall(r'>\s*([A-Z][A-Za-z0-9\s,\.\'-]{3,})\s*<', l)
        for t in tag_text:
            cleaned = t.strip()
            if not re.match(r'^(SVG|PATH|DIV|SPAN|BUTTON|LINK|INPUT|SELECT|OPTION|FORM|MAIN|SECTION|HEADER|FOOTER|NAV|IMG|JIBB|PDF|DOC|DOCX|USD|INR|JPY|Noida|Tokyo|India|Japan|EN|JA)$', cleaned, re.I):
                hardcoded_strings.append((idx, 'JSX Text', cleaned))

        props = re.findall(r'\b(title|subtitle|badge|description|headline|label|tagline|heading)\s*=\s*"([^"]{4,})"', l)
        for p_name, p_val in props:
            if not p_val.startswith('{') and not p_val.startswith('/') and not p_val.startswith('http'):
                hardcoded_strings.append((idx, f'Prop ({p_name})', p_val))

    return {
        'path': file_path,
        'has_i18n': has_use_translations,
        'hardcoded_count': len(hardcoded_strings),
        'items': hardcoded_strings
    }

components = sorted(glob.glob('components/**/*.tsx', recursive=True) + glob.glob('app/**/*.tsx', recursive=True))

report_md = """# Comprehensive Component-by-Component Hardcoded Text Audit Report

This report audits every UI component and page file across the repository to verify if hardcoded English text exists instead of using `useTranslations()`.

---

"""

total_files = len(components)
files_with_hardcoded = 0
total_hardcoded_items = 0

for c in components:
    res = analyze_component(c)
    if res['hardcoded_count'] > 0:
        files_with_hardcoded += 1
        total_hardcoded_items += res['hardcoded_count']
        
        abs_p = os.path.abspath(res['path']).replace('\\', '/')
        report_md += f"## File: [`{res['path']}`](file:///{abs_p})\n"
        report_md += f"- **i18n Enabled (`useTranslations`)**: `{'Yes' if res['has_i18n'] else 'No'}`\n"
        report_md += f"- **Hardcoded English Instances Found**: `{res['hardcoded_count']}`\n\n"
        report_md += "| Line | Type | Hardcoded English Text |\n| :--- | :--- | :--- |\n"
        for line_no, kind, val in res['items']:
            safe_val = val.replace('|', '\\|')
            report_md += f"| L{line_no} | {kind} | `{safe_val}` |\n"
        report_md += "\n---\n\n"

summary_md = f"""# Executive Component Audit Summary

- **Total Component & Page Files Audited**: `{total_files}`
- **Files Requiring i18n Fixes**: `{files_with_hardcoded}`
- **Files 100% i18n Compliant**: `{total_files - files_with_hardcoded}`
- **Total Hardcoded Text Instances**: `{total_hardcoded_items}`

---

"""

final_report = summary_md + report_md

with open('component_hardcoded_audit_report.md', 'w', encoding='utf-8') as f:
    f.write(final_report)

print(f"Component audit complete! Audited {total_files} files. Saved to component_hardcoded_audit_report.md")
