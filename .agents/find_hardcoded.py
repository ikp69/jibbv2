import glob
import os
import re

def find_hardcoded_jsx(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find string literals inside JSX like >Some Text< or title="Some Text" or description="Some Text"
    # Filter out imports, className, svg, icons, console.log, etc.
    results = []
    
    # 1. Matches text between tags: > English text <
    tag_matches = re.findall(r'>\s*([A-Z][A-Za-z0-9\s,\.\'-]{3,})\s*<', content)
    for match in tag_matches:
        if not re.match(r'^(SVG|PATH|DIV|SPAN|BUTTON|LINK|INPUT|SELECT|OPTION|FORM|MAIN|SECTION|HEADER|FOOTER|NAV|IMG)$', match.strip(), re.I):
            results.append(('tag_text', match.strip()))

    # 2. Matches prop attributes: title="English text" or description="English text"
    prop_matches = re.findall(r'(title|description|desc|subtitle|badge|headline|label|placeholder)\s*=\s*"([^"]{4,})"', content)
    for prop, val in prop_matches:
        if not val.startswith('{') and re.search(r'[A-Za-z]{3,}', val):
            results.append((prop, val))

    return results

components = glob.glob('components/**/*.tsx', recursive=True) + glob.glob('app/**/*.tsx', recursive=True)

findings = {}
for c in components:
    hardcoded = find_hardcoded_jsx(c)
    if hardcoded:
        findings[c] = hardcoded

print(f"Found {len(findings)} component/app files with hardcoded English strings in JSX:\n")
for file, items in findings.items():
    print(f"=== {file} ===")
    for kind, val in items[:5]:
        print(f"  [{kind}] {val}")
    if len(items) > 5:
        print(f"  ... and {len(items)-5} more")
    print()
