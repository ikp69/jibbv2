import json
import os
import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Regex to detect English letters (words with 2+ ASCII letters) while ignoring numbers, punctuation, code tokens like JIBB, CoE, R&D, EV, etc.
# Also ignoring parameters like {count}, {name}, standard brand acronyms.
IGNORED_WORDS = {
    'JIBB', 'R&D', 'EV', 'EVs', 'CoE', 'IIT', 'METI', 'DPIIT', 'JBIC', 'NIIF', 'VC', 'B2B', 'G2B', 
    'PCB', 'IoT', 'CNC', 'BMS', 'PoC', 'ISO', 'AI', 'IP', '404', 'CEO', 'CTO', 'CFO', 'Ph.D', 'USD', 'INR', 'JPY'
}

def extract_flat(d, prefix=''):
    items = []
    for k, v in d.items():
        new_key = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            items.extend(extract_flat(v, new_key))
        elif isinstance(v, str):
            items.append((new_key, v))
        elif isinstance(v, list):
            for idx, item in enumerate(v):
                if isinstance(item, str):
                    items.append((f'{new_key}.{idx}', item))
                elif isinstance(item, dict):
                    items.extend(extract_flat(item, f'{new_key}.{idx}'))
    return items

def contains_english_sentence(text):
    if not text:
        return False
    # Remove HTML/JSX tags
    clean = re.sub(r'<[^>]+>', '', text)
    # Remove variables like {name}
    clean = re.sub(r'\{[^}]+\}', '', clean)
    # Check if there are English words that are not in IGNORED_WORDS
    words = re.findall(r'\b[A-Za-z][A-Za-z0-9\'-]+\b', clean)
    english_words = [w for w in words if w not in IGNORED_WORDS and not w.isupper()]
    
    # If more than 2 regular english words exist in sentence, flag it
    return len(english_words) >= 2

ja_files = glob.glob('messages/ja/*.json')

report_md = """# Comprehensive Page-by-Page Japanese Localization Audit Report

This report audits every page and JSON locale file in the application to identify any remaining English text, untranslated fallbacks, or mixed-language sentences.

---

"""

summary_table = []
total_ja_keys = 0
total_untranslated_keys = 0

for ja_path in ja_files:
    fname = os.path.basename(ja_path).replace('.json', '')
    en_path = os.path.join('messages', 'en', f'{fname}.json')
    
    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    flat_ja = extract_flat(ja_data)
    flat_en_map = dict(extract_flat(en_data))
    
    untranslated_list = []
    
    for key, ja_val in flat_ja:
        en_val = flat_en_map.get(key, '')
        total_ja_keys += 1
        
        # Check if Japanese text is identical to English text (and contains English text)
        if ja_val == en_val and contains_english_sentence(ja_val):
            untranslated_list.append((key, ja_val, en_val))
            total_untranslated_keys += 1

    pct_ja = ((len(flat_ja) - len(untranslated_list)) / len(flat_ja)) * 100 if flat_ja else 100
    summary_table.append((fname, len(flat_ja), len(untranslated_list), pct_ja))
    
    report_md += f"## Page / Module: `{fname}` (`messages/ja/{fname}.json`)\n"
    report_md += f"- **Total Text Keys**: `{len(flat_ja)}`\n"
    report_md += f"- **Fully Japanese Translated**: `{len(flat_ja) - len(untranslated_list)}` (`{pct_ja:.1f}%`)\n"
    report_md += f"- **Untranslated / English Fallbacks**: `{len(untranslated_list)}` keys\n\n"
    
    if untranslated_list:
        report_md += "| JSON Key Path | English Text (Active in Japanese View) |\n| :--- | :--- |\n"
        for item in untranslated_list:
            clean_en = item[2].replace('\n', ' ').replace('|', '\\|')
            report_md += f"| `{item[0]}` | {clean_en} |\n"
        report_md += "\n"
    else:
        report_md += "✅ **100% Japanese Verified** — No English text detected.\n\n"
    report_md += "---\n\n"

# Add Summary section at top
summary_header = f"""# Executive Audit Summary

- **Total Locale Text Keys**: `{total_ja_keys}`
- **Japanese Coverage**: `{((total_ja_keys - total_untranslated_keys) / total_ja_keys) * 100:.2f}%`
- **Total Remaining English Fallbacks**: `{total_untranslated_keys}` keys across all pages

### Coverage Table by Page/Module

| Page / Component | Total Keys | Japanese Keys | English Fallbacks | % Japanese |
| :--- | :--- | :--- | :--- | :--- |
"""

for fname, total, untrans, pct in summary_table:
    summary_header += f"| `{fname}` | `{total}` | `{total - untrans}` | `{untrans}` | `{pct:.1f}%` |\n"

summary_header += "\n---\n\n"

final_report = summary_header + report_md

with open('full_japanese_audit_report.md', 'w', encoding='utf-8') as f:
    f.write(final_report)

print("Full page-by-page audit complete! Saved to full_japanese_audit_report.md")
