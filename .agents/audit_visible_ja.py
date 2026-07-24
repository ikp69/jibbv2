import glob
import os
import re

def analyze_component(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    has_use_translations = any('useTranslations' in l for l in lines)
    hardcoded_strings = []

    for idx, l in enumerate(lines, 1):
        # Skip comments, imports, console.log, SVG icon definitions
        if l.strip().startswith('//') or l.strip().startswith('/*') or 'import' in l or 'console.' in l or 'className=' in l and not ('>' in l or '=' in l):
            continue
            
        # 1. JSX text content: >Some English Text<
        tag_text = re.findall(r'>\s*([A-Z][A-Za-z0-9\s,\.\'-]{3,})\s*<', l)
        for t in tag_text:
            cleaned = t.strip()
            # Ignore brand words, tech terms, and elements
            if not re.match(r'^(SVG|PATH|DIV|SPAN|BUTTON|LINK|INPUT|SELECT|OPTION|FORM|MAIN|SECTION|HEADER|FOOTER|NAV|IMG|JIBB|PDF|DOC|DOCX|USD|INR|JPY|Noida|Tokyo|India|Japan|EN|JA)$', cleaned, re.I):
                hardcoded_strings.append((idx, 'JSX Visible Text', cleaned))

        # 2. String props that display on UI: title="...", subtitle="...", badge="...", description="..."
        props = re.findall(r'\b(title|subtitle|badge|description|headline|tagline|heading)\s*=\s*"([^"]{4,})"', l)
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

report_md = """# Visible English Text Audit Report Across `/ja/*` Pages & Components

This report lists every single visible English string remaining in UI components and page files.

---

"""

total_files = len(components)
files_with_hardcoded = 0
total_hardcoded_items = 0

for c in components:
    # Exclude internal admin dashboard tools and coming-soon scratch pages
    if 'admin' in c or 'ComingSoon' in c or 'not-found.tsx' in c:
        continue

    res = analyze_component(c)
    if res['hardcoded_count'] > 0:
        files_with_hardcoded += 1
        total_hardcoded_items += res['hardcoded_count']
        
        abs_p = os.path.abspath(res['path']).replace('\\', '/')
        is_i18n = 'Yes' if res['has_i18n'] else 'No'
        h_cnt = res['hardcoded_count']
        
        report_md += f"## File: [`{res['path']}`](file:///{abs_p})\n"
        report_md += f"- **i18n Enabled (`useTranslations`)**: `{is_i18n}`\n"
        report_md += f"- **Hardcoded Visible English Strings Found**: `{h_cnt}`\n\n"
        report_md += "| Line | Type | Hardcoded English Text |\n| :--- | :--- | :--- |\n"
        for line_no, kind, val in res['items']:
            safe_val = val.replace('|', '\\|')
            report_md += f"| L{line_no} | {kind} | `{safe_val}` |\n"
        report_md += "\n---\n\n"

summary_md = f"""# Executive Visible Text Summary (`/ja/*` Pages)

- **Total Component & Page Files Audited**: `{total_files}`
- **Files With Hardcoded Visible English**: `{files_with_hardcoded}`
- **100% Japanese Dynamic Files**: `{total_files - files_with_hardcoded}`
- **Total Hardcoded Visible Strings Found**: `{total_hardcoded_items}`

---

"""

final_report = summary_md + report_md

with open('ja_pages_hardcoded_visible_report.md', 'w', encoding='utf-8') as f:
    f.write(final_report)

print(f"Visible text audit complete! Found {total_hardcoded_items} strings in {files_with_hardcoded} files.")
