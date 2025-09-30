# Emoji Sets for SurveyGuy

This folder contains various emoji sets for use in survey questions. Each emoji is provided as an SVG file for crisp rendering at any size.

## Available Emoji Sets

### 1. Basic Emotions (`basic-emotions`)
- **Use case**: General emotional responses
- **Emojis**: Angry, Sad, Neutral, Happy, Very Happy
- **Files**: `angry.svg`, `red-sad.svg`, `yellow-neutral.svg`, `green-happy.svg`, `green-very-happy.svg`

### 2. Extended Emotions (`extended-emotions`)
- **Use case**: Detailed emotional feedback
- **Emojis**: Angry, Crying, Disappointed, Neutral, Thinking, Happy, Laughing, Excited
- **Files**: `angry.svg`, `crying.svg`, `red-sad.svg`, `yellow-neutral.svg`, `thinking.svg`, `green-happy.svg`, `laughing.svg`, `excited.svg`

### 3. Satisfaction Scale (`satisfaction/`)
- **Use case**: Customer satisfaction surveys
- **Emojis**: Very Dissatisfied, Dissatisfied, Neutral, Satisfied, Very Satisfied
- **Files**: `very-dissatisfied.svg`, `dissatisfied.svg`, `neutral.svg`, `satisfied.svg`, `very-satisfied.svg`

### 4. Quality Rating (`quality/`)
- **Use case**: Product or service quality assessment
- **Emojis**: Poor, Fair, Good, Very Good, Excellent
- **Files**: `poor.svg`, `fair.svg`, `good.svg`, `very-good.svg`, `excellent.svg`

### 5. Agreement Scale (`agreement/`)
- **Use case**: Likert scale questions
- **Emojis**: Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree
- **Files**: `strongly-disagree.svg`, `disagree.svg`, `neutral.svg`, `agree.svg`, `strongly-agree.svg`

### 6. Frequency Scale (`frequency/`)
- **Use case**: How often questions
- **Emojis**: Never, Rarely, Sometimes, Often, Always
- **Files**: `never.svg`, `rarely.svg`, `sometimes.svg`, `often.svg`, `always.svg`

### 7. Mood Check (`mood`)
- **Use case**: General mood assessment
- **Emojis**: Very Sad, Sad, Neutral, Slightly Happy, Happy, Very Happy
- **Files**: `red-very-sad.svg`, `red-sad.svg`, `yellow-neutral.svg`, `yellow-slightly-happy.svg`, `green-happy.svg`, `green-very-happy.svg`

### 8. Experience Rating (`experience`)
- **Use case**: Overall experience assessment
- **Emojis**: Terrible, Poor, Average, Good, Excellent
- **Files**: `angry.svg`, `red-sad.svg`, `yellow-neutral.svg`, `green-happy.svg`, `excited.svg`

### 9. Likelihood Scale (`likelihood`)
- **Use case**: Probability questions
- **Emojis**: Very Unlikely, Unlikely, Neutral, Likely, Very Likely
- **Files**: `angry.svg`, `red-sad.svg`, `yellow-neutral.svg`, `green-happy.svg`, `excited.svg`

### 10. Customer Satisfaction Scale (`customer-satisfaction`)
- **Use case**: Customer satisfaction surveys (exact design from images)
- **Emojis**: Very Satisfied, Satisfied, Neutral, Unsatisfied, Very Unsatisfied
- **Files**: `survey-scales/very-satisfied.svg`, `survey-scales/satisfied.svg`, `survey-scales/neutral.svg`, `survey-scales/unsatisfied.svg`, `survey-scales/very-unsatisfied.svg`

### 11. Likelihood to Recommend Scale (`likelihood-recommendation`)
- **Use case**: Net Promoter Score and recommendation questions (10-point scale)
- **Emojis**: 1-10 scale with red sad (1-6), yellow neutral (7-8), green happy (9-10)
- **Files**: `survey-scales/likelihood-1-6.svg`, `survey-scales/likelihood-7-8.svg`, `survey-scales/likelihood-9-10.svg`

### 12. Ease of Interaction Scale (`ease-of-interaction`)
- **Use case**: Usability and ease of use questions
- **Emojis**: Very Easy, Easy, Moderate, Difficult, Very Difficult
- **Files**: `survey-scales/very-easy.svg`, `survey-scales/easy.svg`, `survey-scales/moderate.svg`, `survey-scales/difficult.svg`, `survey-scales/very-difficult.svg`

## File Structure

```
emojis/
├── README.md
├── emoji-sets.json
├── survey-scales.json
├── customer-feedback-questions.json
├── angry.svg
├── confused.svg
├── crying.svg
├── excited.svg
├── laughing.svg
├── love.svg
├── sleepy.svg
├── surprised.svg
├── thinking.svg
├── worried.svg
├── satisfaction/
│   ├── very-dissatisfied.svg
│   ├── dissatisfied.svg
│   ├── neutral.svg
│   ├── satisfied.svg
│   └── very-satisfied.svg
├── quality/
│   ├── poor.svg
│   ├── fair.svg
│   ├── good.svg
│   ├── very-good.svg
│   └── excellent.svg
├── agreement/
│   ├── strongly-disagree.svg
│   ├── disagree.svg
│   ├── neutral.svg
│   ├── agree.svg
│   └── strongly-agree.svg
├── frequency/
│   ├── never.svg
│   ├── rarely.svg
│   ├── sometimes.svg
│   ├── often.svg
│   └── always.svg
└── survey-scales/
    ├── very-satisfied.svg
    ├── satisfied.svg
    ├── neutral.svg
    ├── unsatisfied.svg
    ├── very-unsatisfied.svg
    ├── very-easy.svg
    ├── easy.svg
    ├── moderate.svg
    ├── difficult.svg
    ├── very-difficult.svg
    ├── likelihood-1-6.svg
    ├── likelihood-7-8.svg
    └── likelihood-9-10.svg
```

## Usage

### In Survey Builder
1. Select "Emoji Scale" as question type
2. Choose from predefined emoji sets in the dropdown
3. Customize colors and labels as needed

### Programmatic Usage
```javascript
// Load emoji sets
const emojiSets = await fetch('/emojis/emoji-sets.json').then(r => r.json());

// Use in emoji scale questions
const satisfactionScale = emojiSets.emojiSets.satisfaction.emojis;
```

### Custom Integration
```javascript
// Create custom emoji scale
const customScale = [
  { emoji: "😠", label: "Terrible", value: 1, file: "angry.svg" },
  { emoji: "😞", label: "Poor", value: 2, file: "red-sad.svg" },
  { emoji: "😐", label: "OK", value: 3, file: "yellow-neutral.svg" },
  { emoji: "🙂", label: "Good", value: 4, file: "green-happy.svg" },
  { emoji: "🤩", label: "Amazing", value: 5, file: "excited.svg" }
];
```

## Design Guidelines

- **Colors**: Each emoji uses consistent color schemes (red for negative, yellow for neutral, green for positive)
- **Size**: All SVGs are 100x100px and scale perfectly
- **Accessibility**: Each emoji includes descriptive labels
- **Consistency**: Similar expressions use consistent visual design patterns

## Adding New Emoji Sets

1. Create new SVG files following the existing design patterns
2. Add the set definition to `emoji-sets.json`
3. Update this README with the new set information
4. Test the new set in the survey builder

## Technical Notes

- All SVGs use the same 100x100 viewBox for consistency
- Stroke width is typically 2px for borders
- Text labels are positioned at y="95" for consistent placement
- Colors follow a semantic system (red=negative, yellow=neutral, green=positive)
