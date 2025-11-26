# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**贈る言葉BOT (Gift Words BOT)** - A browser-based web application that allows users to create and share custom inspirational messages with Takeda Tetsuya standing in front of a blackboard. Users input a word and its meaning, which are then displayed in a dictionary-style format with vertical Japanese text and a typewriter animation effect.

## Core Features

1. **Input Form (F-001)**: Users enter a word and its meaning
2. **Share Link Generation (F-002)**: Creates unique URLs with data encoded in URL parameters
3. **Display Page (F-003)**: Shows the message overlaid on Takeda Tetsuya's image with typewriter animation
4. **Image Download (F-004)**: Allows saving the complete display as an image file

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (or lightweight framework)
- **Styling**: CSS3 with vertical text support (`writing-mode: vertical-rl`)
- **Animation**: CSS/JavaScript for character-by-character typewriter effect
- **Image Export**: html2canvas or similar library
- **Data Passing**: URL parameters (Base64 encoding) or hash fragments
- **No Backend**: Client-side only, no database required

## File Structure (Expected Deliverables)

```
/
├── index.html          # Input form page
├── view.html           # Display page (or combined with index.html)
├── styles.css          # All styling including animations and vertical text
├── script.js           # Link generation, URL parameter handling, animations
├── 武田鉄矢.png         # Background image (already present)
└── README.md           # Usage instructions
```

## Development Commands

Since this is a static web application with no build process:

**Local Development:**
```bash
# Simple HTTP server using Python
python -m http.server 8000

# Or using Node.js http-server (if installed)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

**Testing:**
- Open index.html directly in browser (for basic testing)
- Use a local server (recommended) to avoid CORS issues with image export

## Key Implementation Details

### Display Page Layout (F-003)

**Background Setup:**
- Takeda Tetsuya's image (`武田鉄矢.png`) positioned right-center as background
- Text overlays on the left side of the blackboard area using absolute/grid positioning

**Text Styling:**
- **Vertical writing**: Use `writing-mode: vertical-rl` and `text-orientation: upright`
- **Dictionary-style design**: Clean, traditional dictionary appearance
- **Color scheme**: White or chalk-like color (e.g., `#f0f0f0`, `#fffacd`) to match blackboard aesthetic
- **Optional**: Semi-transparent background behind text for readability

### Typewriter Animation (F-003)

Implement character-by-character reveal animation:
- Display one character at a time with CSS animations or JavaScript interval
- Smooth animation that feels natural (not too fast, not too slow)
- Consider animating both the word and its meaning sequentially

### URL Parameter Handling (F-002)

Data encoding approach:
```javascript
// Example encoding
const params = new URLSearchParams({
  word: encodeURIComponent(word),
  meaning: encodeURIComponent(meaning)
});
const shareUrl = `${baseUrl}/view.html?${params}`;

// Or using Base64 for cleaner URLs
const data = btoa(encodeURIComponent(JSON.stringify({word, meaning})));
const shareUrl = `${baseUrl}/view.html#${data}`;
```

### Image Export (F-004)

Use html2canvas or similar library:
```javascript
// Example implementation
html2canvas(document.querySelector('.display-container')).then(canvas => {
  const link = document.createElement('a');
  link.download = 'gift-words.png';
  link.href = canvas.toDataURL();
  link.click();
});
```

Include the library via CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

## Design Requirements

### Non-Functional Requirements

**Usability:**
- Simple, intuitive UI with 3 steps or fewer from input to sharing
- Responsive design for mobile and desktop viewing

**Performance:**
- Page load time under 3 seconds
- Smooth animations without lag

**Browser Support:**
- Chrome, Firefox, Edge, Safari (latest versions)

### Validation

- Both input fields (word and meaning) must not be empty before submission
- Display appropriate error messages for invalid input

## Important Notes

1. **Image Asset**: The Takeda Tetsuya image (`武田鉄矢.png`) is already present in the repository. Ensure proper copyright/likeness rights compliance.

2. **Japanese Text Handling**: This application displays Japanese text vertically. Test thoroughly with various Japanese characters including kanji, hiragana, and katakana.

3. **Responsive Considerations**: The blackboard left-side space must adapt to different screen sizes while maintaining readability.

4. **No Database**: All data is transient and passed via URL. No server-side storage is required.

## Development Flow

1. Create project folder structure
2. Implement HTML structure for input page
3. Implement CSS (basic styles, dictionary design, vertical text)
4. Implement JavaScript (link generation, URL parameter handling)
5. Implement typewriter animation
6. Implement image save functionality
7. Test and adjust across browsers and devices
