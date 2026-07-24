# Japanese Translation Mapping & Audit Report

> [!NOTE]
> This report summarizes the mapping of human Japanese translations from `translations.xlsx` to the active English website codebase (`messages/en/*.json`). The English text on your website was **100% untouched and preserved**.

## Summary Statistics

- **Total English Keys in Codebase**: `1258`
- **Mapped from Human Excel**: `823` keys (**65.4%**)
- **Retained from Existing Japanese Files**: `435` keys
- **Newly Added / Missing in Excel**: `4` keys

| Match Strategy | Count | Description |
| :--- | :--- | :--- |
| **Exact Sheet + Key Match** | `289` | Direct key & page match from Excel |
| **Exact English Text Match** | `511` | Exact English sentence match across sheets |
| **Tagless English Match** | `4` | Sentence match ignoring JSX tags like `<link>` |
| **Fuzzy Text Match (>= 88%)** | `19` | Matches slight wordings/edits |
| **Retained Existing JA** | `435` | Kept existing Japanese string from `messages/ja/` |
| **Missing (Untranslated)** | `4` | Text present on website but not in Excel |

---

## File-by-File Breakdown

### `messages/ja/about.json`
- **Total Keys**: `218`
- **Human Excel Matches**: `186`
- **Retained Existing JA**: `32`
- **Missing / Needs Translation**: `4` (<details><summary>Click to view 4 missing keys</summary>

| Key | Current English Text |
| :--- | :--- |
| `leadershipPage.members.gyanendra.linkedin` |  |
| `leadershipPage.members.akash.linkedin` |  |
| `leadershipPage.members.nobuchika.linkedin` |  |
| `leadershipPage.members.aya.linkedin` |  |
</details>)

### `messages/ja/auth.json`
- **Total Keys**: `30`
- **Human Excel Matches**: `3`
- **Retained Existing JA**: `27`
- **Missing / Needs Translation**: `0`

### `messages/ja/contact.json`
- **Total Keys**: `22`
- **Human Excel Matches**: `22`
- **Retained Existing JA**: `0`
- **Missing / Needs Translation**: `0`

### `messages/ja/home.json`
- **Total Keys**: `485`
- **Human Excel Matches**: `407`
- **Retained Existing JA**: `78`
- **Missing / Needs Translation**: `0`

### `messages/ja/hub.json`
- **Total Keys**: `64`
- **Human Excel Matches**: `2`
- **Retained Existing JA**: `62`
- **Missing / Needs Translation**: `0`

### `messages/ja/layout.json`
- **Total Keys**: `112`
- **Human Excel Matches**: `27`
- **Retained Existing JA**: `85`
- **Missing / Needs Translation**: `0`

### `messages/ja/membership.json`
- **Total Keys**: `81`
- **Human Excel Matches**: `53`
- **Retained Existing JA**: `28`
- **Missing / Needs Translation**: `0`

### `messages/ja/newsletter.json`
- **Total Keys**: `53`
- **Human Excel Matches**: `4`
- **Retained Existing JA**: `49`
- **Missing / Needs Translation**: `0`

### `messages/ja/notFound.json`
- **Total Keys**: `10`
- **Human Excel Matches**: `9`
- **Retained Existing JA**: `1`
- **Missing / Needs Translation**: `0`

### `messages/ja/services.json`
- **Total Keys**: `183`
- **Human Excel Matches**: `110`
- **Retained Existing JA**: `73`
- **Missing / Needs Translation**: `0`

