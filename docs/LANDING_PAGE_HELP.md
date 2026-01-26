# Landing Page User Guide

## Overview
The OnlyHockey landing page is your gateway to exploring hockey content, trivia games, motivational quotes, and more. This guide explains all the actions you can take on the landing page.

---

## Navigation Buttons (Top of Page)

At the top of the page, you'll find three circular navigation buttons:

### 🏠 Home Button
- **Action**: Click to return to the landing page
- **Behavior**: If you're already on the landing page, clicking this button will reload the page and reset the carousel to the first card
- **Use Case**: Quick way to return to the homepage from any page

### ℹ️ Info Button
- **Action**: Click to open an information modal
- **Content**: Displays information about OnlyHockey, including:
  - What OnlyHockey is and its purpose
  - Available features (trivia games, motivational content, hockey facts)
  - Community information
- **Closing**: Click the X button in the top-right corner or click outside the modal to close

### ⚙️ Extras Button
- **Action**: Click to open an extras modal
- **Content**: Displays information about additional settings and options
- **Note**: Currently shows "Settings and other options coming soon..."
- **Closing**: Click the X button in the top-right corner or click outside the modal to close

---

## Content Carousel (Main Section)

The main content area features a swipeable carousel with multiple cards, each containing a grid of interactive tiles.

### Navigating the Carousel

#### Swiping
- **Desktop**: Click and drag left or right to navigate between cards
- **Mobile/Touch**: Swipe left or right with your finger to move between cards
- **Behavior**: The carousel loops continuously, so you can swipe in either direction indefinitely

#### Dot Indicators
- **Location**: Below the carousel grid
- **Appearance**: Small circular dots representing each card
- **Active Indicator**: The current card is shown with a longer, highlighted dot
- **Action**: Click any dot to jump directly to that card
- **Use Case**: Quick navigation when you know which card you want to view

### Carousel Cards

Each card in the carousel contains a 5-column × 3-row grid (15 tiles total). Cards include:

#### Card 1: "Explore"
- **Purpose**: Main navigation hub
- **Tiles Available**:
  - **Trivia Arena** 🎯 - Navigate to trivia games
  - **Did You Know?** 💡 - Access hockey factoids
  - **Motivators** 🔥 - View motivational quotes
  - **Rink Philosopher** 🎓 - Explore philosophical hockey wisdom
  - **Bench Boss** 💪 - Get coaching motivation
  - **Captain Heart** 💙 - Find pre-game messages
  - **Pro Shop** 🛒 - Open the store modal

#### Other Cards
- Additional cards may contain different collections or themed content
- Each card has a title displayed above the grid
- Some cards may have descriptive text explaining their purpose

### Interacting with Tiles

#### Active Tiles
- **Appearance**: Colored tiles with emoji icons and text labels
- **Hover Effect**: Tiles slightly fade and glow when you hover over them
- **Animation**: Tiles have a subtle shake animation
- **Badges**: Some tiles display badges (e.g., "PLAY", "NEW") in the top-right corner

#### Clicking Tiles
- **Action**: Click any active tile to navigate to that section
- **Navigation**: Most tiles will take you to a dedicated page (e.g., clicking "Trivia Arena" goes to `/trivia-arena`)
- **Shop Tile**: Clicking the "Pro Shop" tile opens a store modal instead of navigating
- **No Sign-Up Required**: You can click and explore tiles without creating an account

#### Inactive Tiles
- **Appearance**: Gray tiles with low-opacity background images
- **Behavior**: These tiles are not clickable and serve as visual placeholders
- **Purpose**: Used to create interesting layouts (like diamond patterns) while maintaining visual balance

---

## Newsletter Signup (Bottom Section)

Below the carousel, you'll find a newsletter signup card.

### Signup Form

#### Email Input Field
- **Action**: Type your email address
- **Placeholder**: "Enter your email"
- **Validation**: The form checks that you've entered a valid email before submitting
- **Behavior**: The field is disabled while submitting to prevent duplicate submissions

#### Subscribe Button
- **Action**: Click to submit your email
- **States**:
  - **Default**: Shows "Subscribe"
  - **Submitting**: Shows "Subscribing..." and the button is disabled
- **After Submission**: The form clears and shows a success or error message

### Success/Error Messages

#### Success Message
- **Appearance**: Green background with green text
- **Message**: "Thanks for subscribing!" or similar confirmation
- **Behavior**: Appears after successful submission, then the form clears

#### Error Message
- **Appearance**: Red background with red text
- **Possible Messages**:
  - "Please enter your email address" (if field is empty)
  - "Something went wrong. Please try again." (if server error occurs)
  - "Network error. Please check your connection and try again." (if connection fails)

### Privacy Information
- **Text**: "No spam, just hockey. Unsubscribe anytime."
- **Purpose**: Reassures users about email frequency and unsubscribe options

### Live Indicator
- **Appearance**: Green badge with pulsing animation showing "LIVE"
- **Purpose**: Indicates that the newsletter service is active and operational

---

## Store Modal

The store modal opens when you click the "Pro Shop" tile in the carousel.

### Opening the Modal
- **Trigger**: Click the "Pro Shop" 🛒 tile in the carousel
- **Behavior**: A modal overlay appears over the page content

### Closing the Modal
- **Methods**:
  1. Click the X button in the top-right corner of the modal
  2. Click outside the modal (on the dark overlay background)
- **Behavior**: The modal closes and returns you to the landing page

### Modal Content
- **Purpose**: Browse hockey-themed merchandise and digital products
- **Note**: Store content is coming soon (as indicated in the modal)

---

## Theme Support

The landing page supports both light and dark themes.

### Theme Switcher
- **Location**: In the top navigation bar (not part of the circular buttons)
- **Action**: Click to toggle between light and dark themes
- **Icon**: 
  - Sun icon ☀️ = Switch to light mode
  - Moon icon 🌙 = Switch to dark mode
- **Persistence**: Your theme preference is saved and remembered for future visits

---

## Keyboard Navigation

### Tab Navigation
- **Action**: Press `Tab` to move through interactive elements
- **Order**: 
  1. Navigation buttons (Home, Info, Extras)
  2. Carousel tiles
  3. Dot indicators
  4. Email input field
  5. Subscribe button
- **Activation**: Press `Enter` or `Space` to activate focused elements

### Arrow Keys (Carousel)
- **Left Arrow**: Navigate to previous card
- **Right Arrow**: Navigate to next card
- **Note**: Arrow key navigation may vary depending on browser support

---

## Mobile-Specific Features

### Touch Gestures
- **Swipe Left**: Navigate to next carousel card
- **Swipe Right**: Navigate to previous carousel card
- **Tap**: Click tiles and buttons
- **Long Press**: May trigger context menus (browser-dependent)

### Responsive Layout
- **Grid Size**: Tiles automatically resize based on screen size
- **Text Size**: Text scales appropriately for mobile screens
- **Touch Targets**: All interactive elements are sized for easy tapping

---

## Tips for Best Experience

1. **Explore All Cards**: Swipe through all carousel cards to discover all available content
2. **Use Dot Indicators**: Click dots for quick navigation when you know what you're looking for
3. **Try Different Tiles**: Each tile leads to unique content - explore them all!
4. **Subscribe for Updates**: Sign up for the newsletter to stay informed about new content
5. **Check Info Modal**: Click the Info button to learn more about OnlyHockey's mission and features
6. **No Account Needed**: You can explore most content without signing up - just click and play!

---

## Troubleshooting

### Carousel Not Responding
- **Solution**: Try refreshing the page or clicking the Home button to reset

### Tiles Not Clickable
- **Check**: Make sure you're clicking active tiles (colored) not inactive ones (gray)
- **Solution**: Try clicking directly on the emoji or text label

### Newsletter Form Not Working
- **Check**: Ensure you have an internet connection
- **Check**: Verify you've entered a valid email address format
- **Solution**: Check the error message for specific guidance

### Modal Won't Close
- **Solution**: Try clicking directly on the X button or clicking outside the modal on the dark overlay

---

## Accessibility Features

- **ARIA Labels**: All interactive elements have descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard support for all actions
- **High Contrast**: Themes support high contrast for better visibility
- **Focus Indicators**: Clear visual indicators show which element is currently focused
- **Semantic HTML**: Proper HTML structure for assistive technologies

---

## Need More Help?

If you have questions or need assistance:
- Check the **Info** button for general information about OnlyHockey
- Visit the **Support** page for help with technical issues
- Contact us at **team@onlyhockey.com** for additional support
