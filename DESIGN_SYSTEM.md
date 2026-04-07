# CampusLeave Design System

> **CANONICAL REFERENCE** — Every component and page in this project MUST follow these exact specifications. No deviations allowed.

---

## 🎨 Colors

### Core Surfaces

| Token              | Value                  | Usage                        |
|---------------------|------------------------|------------------------------|
| Sidebar background  | `#1e1b4b`              | **Always** use inline style  |
| Page background     | `#f5f7fb`              | Use `bg-[#f5f7fb]` or style  |
| Primary gradient    | `from-indigo-600 to-blue-500` | `bg-gradient-to-r`    |
| Card background     | `bg-white`             | All cards                    |
| Border color        | `border-gray-100`      | Card borders                 |
| Divider color       | `border-gray-200`      | Horizontal rules, separators |

### Text Colors

| Token               | Class                  | Usage                        |
|----------------------|------------------------|------------------------------|
| Headings / primary   | `text-gray-900` / `text-gray-800` | Page headings      |
| Body / secondary     | `text-gray-500`        | Descriptive body text        |
| Muted / hint         | `text-gray-400`        | Timestamps, placeholder text |
| On dark bg           | `text-white`           | Sidebar, gradient cards      |
| Sidebar default nav  | `text-gray-300`        | Inactive sidebar links       |
| Sidebar active nav   | `text-white`           | Active sidebar link          |

### Accent Colors

| Token          | Class              | Usage                          |
|----------------|---------------------|-------------------------------|
| Primary        | `indigo-600`        | Buttons, active states        |
| Primary hover  | `indigo-700`        | Button hover                  |
| Logo accent    | `text-indigo-300`   | Logo text on dark sidebar     |
| Role badge     | `text-indigo-200`   | Role badge on dark sidebar    |
| Link color     | `text-indigo-600`   | Inline text links             |

### Status Colors

| Status    | Background         | Text               |
|-----------|--------------------|---------------------|
| Approved  | `bg-green-100`     | `text-green-700`    |
| Pending   | `bg-yellow-100`    | `text-yellow-700`   |
| Rejected  | `bg-red-100`       | `text-red-700`      |
| OD        | `bg-blue-100`      | `text-blue-700`     |
| Medical   | `bg-purple-100`    | `text-purple-700`   |
| Personal  | `bg-orange-100`    | `text-orange-700`   |

---

## 🔤 Typography

**Font Family:** Inter (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
```

| Element              | Classes                        |
|----------------------|--------------------------------|
| Page title (navbar)  | `text-xl font-bold`            |
| Section heading      | `text-base font-semibold`      |
| Card value (big #)   | `text-3xl font-extrabold`      |
| Body text            | `text-sm font-normal`          |
| Small / hint text    | `text-xs font-normal`          |
| Labels (form)        | `text-sm font-medium`          |
| Badge text           | `text-xs font-medium`          |
| Nav item text        | `text-sm font-medium`          |

---

## 🧱 Component Styles

### Cards

```
Standard card:
"bg-white rounded-2xl shadow-sm border border-gray-100 p-6"

Hover card:
"bg-white rounded-2xl shadow-sm border border-gray-100 p-6
 hover:shadow-md transition-shadow"

Gradient card (welcome banner):
"bg-gradient-to-r from-indigo-600 to-blue-500
 rounded-2xl p-6 text-white relative overflow-hidden"
```

### Inputs

```
Standard input:
"w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400
 focus:border-transparent transition-all placeholder:text-gray-300"

Select dropdown:
"w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400
 focus:border-transparent transition-all bg-white"
```

### Buttons

```
Primary (gradient):
"bg-gradient-to-r from-indigo-600 to-blue-500 text-white
 font-semibold px-6 py-3 rounded-xl hover:opacity-90
 transition-opacity text-sm"

Secondary (outline):
"border border-gray-200 text-gray-600 px-6 py-2.5
 rounded-xl hover:bg-gray-50 transition-colors text-sm"

Success (small):
"bg-green-100 text-green-700 px-3 py-1.5 rounded-lg
 text-xs font-semibold hover:bg-green-200 transition-colors"

Danger (small):
"bg-red-100 text-red-700 px-3 py-1.5 rounded-lg
 text-xs font-semibold hover:bg-red-200 transition-colors"
```

### Badges (Status Pills)

```
Approved:  "bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium"
Pending:   "bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium"
Rejected:  "bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium"
OD:        "bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
Medical:   "bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium"
Personal:  "bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium"
```

### Tables

```
Table wrapper:     "w-full"
Table header row:  "bg-gray-50 border-b border-gray-100"
Header cell:       "text-left text-xs font-semibold text-gray-500
                    uppercase tracking-wide px-4 py-3"
Body row:          "border-b border-gray-50 hover:bg-gray-50 transition-colors"
Body cell:         "px-4 py-3.5 text-sm text-gray-600"
```

### Sidebar Items

```
Active:   "flex items-center gap-3 px-4 py-3 rounded-xl
           bg-indigo-600 text-white text-sm font-medium"

Default:  "flex items-center gap-3 px-4 py-3 rounded-xl
           text-gray-300 hover:bg-white/10 hover:text-white
           text-sm font-medium transition-all"
```

### Form Labels

```
"block text-sm font-medium text-gray-700 mb-1.5"
```

### Error Text

```
"text-red-500 text-xs mt-1"
```

---

## 📐 Spacing & Layout

| Token                | Value               |
|----------------------|----------------------|
| Sidebar width        | `w-64` (256px) fixed |
| Main content offset  | `ml-64`              |
| Page padding         | `p-6`                |
| Gap between sections | `gap-6`              |
| Gap between cards    | `gap-4` or `gap-6`   |
| Gap between fields   | `gap-4`              |
| Card inner padding   | `p-5` or `p-6`       |
| Icon size (nav)      | `w-5 h-5`            |
| Icon size (stat)     | `w-6 h-6`            |
| Avatar size (sidebar)| `w-9 h-9`            |
| Avatar size (navbar) | `w-8 h-8`            |
| Border radius cards  | `rounded-2xl`        |
| Border radius inputs | `rounded-xl`         |
| Border radius badges | `rounded-full`       |
| Border radius buttons| `rounded-xl`         |

---

## 🧭 Sidebar Structure

```
Outer:
  fixed left-0 top-0 h-screen w-64 flex flex-col z-50
  style={{ backgroundColor: '#1e1b4b' }}

Logo Section:
  px-5 pt-6 pb-4
  borderBottom: '1px solid rgba(255,255,255,0.1)'

  Icon box: w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center
  Icon:     GraduationCap w-5 h-5 text-white
  Text:     "Campus" = text-white text-lg font-light
            "Leave"  = text-white text-lg font-bold

  Role badge (below logo):
    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
    text-xs font-medium tracking-widest text-indigo-200
    px-3 py-1 rounded-full uppercase

Nav Section:
  flex-1 overflow-y-auto py-4 px-3
  flex flex-col gap-1

Bottom Section:
  px-4 py-4
  borderTop: '1px solid rgba(255,255,255,0.1)'
  flex items-center gap-3

  Avatar: w-9 h-9 rounded-full bg-indigo-500
          flex items-center justify-center
          text-white font-bold text-sm
  Name:   text-white text-sm font-medium truncate
  Email:  text-xs truncate (color: #9ca3af)
  Logout: LogOut icon w-4 h-4 color: #9ca3af hover:text-red-400
```

---

## 🔝 Navbar Structure

```
Outer:
  bg-white shadow-sm px-6 py-4
  flex justify-between items-center
  sticky top-0 z-40

Left:
  text-xl font-bold text-gray-800 (page title)

Right:
  flex items-center gap-4

  Bell:     relative, Bell icon w-5 h-5 text-gray-600
            Red dot: absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full
  Divider:  w-px h-6 bg-gray-200
  Avatar:   flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100
            Circle: w-8 h-8 bg-indigo-600 rounded-full
            Name text (hidden on mobile)
            ChevronDown icon

  Dropdown:
    absolute right-0 top-12 w-56
    bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50

    Header:     px-4 py-3 border-b border-gray-100
      name:     text-sm font-semibold text-gray-800
      email:    text-xs text-gray-500
    Menu items: w-full flex items-center gap-3 px-4 py-2.5
                text-sm text-gray-700 hover:bg-gray-50
    Logout:     text-red-600 hover:bg-red-50
```

---

## ⚠️ Strict Rules — NEVER BREAK THESE

1. **NEVER** use `bg-indigo-900` or `bg-indigo-800` for sidebar → ALWAYS use `style={{ backgroundColor: '#1e1b4b' }}`
2. **NEVER** use `bg-gray-100` or `bg-gray-50` for page background → ALWAYS use `bg-[#f5f7fb]` or `style={{ backgroundColor: '#f5f7fb' }}`
3. **NEVER** hardcode `rgba()` in className → Use inline `style={{ borderColor: 'rgba(255,255,255,0.1)' }}` or `borderBottom: '1px solid rgba(255,255,255,0.1)'`
4. **NEVER** use `text-indigo-900` on the dark sidebar → ALWAYS use `text-white`, `text-gray-300`, `text-indigo-200`, `text-indigo-300`
5. **ALL** cards must have `rounded-2xl` (not `rounded-xl` or `rounded-lg`)
6. **ALL** form inputs must have `focus:ring-2 focus:ring-indigo-400` and `outline-none`
7. **NO** overlapping elements anywhere
8. Main content area **MUST** have `ml-64` to clear the fixed sidebar
9. Sidebar **MUST** be `position: fixed` with `z-50`
10. Use **lucide-react** for ALL icons. No emoji as icons (emoji only allowed in text content like welcome messages)
