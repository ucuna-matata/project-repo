# CV Builder with Live Preview

## Features

### ✨ Live Preview
The CV Builder includes a real-time live preview that updates as you type, allowing you to see exactly how your CV will look.

### 🎯 Key Improvements

#### 1. **Optimized Performance**
- **Debounced Updates**: Form changes are debounced with a 150ms delay to prevent excessive re-renders during fast typing
- **Memoized Components**: Both `CVBuilder` and `CVPreview` use React memoization to prevent unnecessary re-renders
- **Smart Dependencies**: Only updates when actual form data changes, not on every render

#### 2. **Visual Feedback**
- **Live Indicator**: Shows a pulsing green dot with "Live" status when preview is up-to-date
- **Updating Indicator**: Shows a yellow pulsing dot with "Updating..." when changes are being processed
- **Smooth Transitions**: Preview updates with subtle opacity transitions for a polished feel

#### 3. **Responsive Design**
- **Desktop**: Side-by-side view with form on the left and live preview on the right
- **Mobile**: 
  - Floating toggle button (Eye icon) in bottom-right corner
  - Switch between form and preview views
  - Optimized for touch interactions

#### 4. **Template Support**
Real-time preview works with all CV templates:
- Clean
- Two Column
- Modern
- Professional

## Technical Implementation

### Components

#### `CVBuilder.tsx`
- Main component that manages form state and preview
- Uses `react-hook-form` for form management
- Implements `useDebounce` hook for performance optimization
- Tracks preview update status for visual feedback

#### `CVPreview.tsx`
- Memoized component that renders the selected CV template
- Efficiently converts form data to CV format
- Shows helpful placeholder when no data is entered

#### `useDebounce.ts`
- Custom hook that debounces value changes
- Default delay: 150ms (optimized for smooth but responsive updates)
- Cancels pending updates when value changes rapidly

### Performance Optimizations

```typescript
// Debounce form data
const debouncedFormData = useDebounce(formData, 150);

// Memoize preview data
const previewData = useMemo(() => ({
  ...debouncedFormData,
  // Ensure arrays are properly formatted
  skills: Array.isArray(debouncedFormData.skills) ? debouncedFormData.skills : [],
  // ...
}), [debouncedFormData.title, debouncedFormData.template_key, ...]);
```

## Usage

### Basic Usage
```typescript
<CVBuilder
  initialData={existingCV}
  cvId={cvId}
  onSave={handleSave}
  onGenerate={handleGenerate}
/>
```

### Props
- `initialData`: Partial CV data to pre-fill the form
- `cvId`: ID of existing CV (for updates)
- `onSave`: Callback when user saves the CV
- `onGenerate`: Callback for AI generation

## User Experience

### Desktop Experience
1. Form on the left, preview on the right
2. Changes appear in preview within 150ms
3. Visual indicator shows when preview is updating
4. Export buttons available when CV is saved

### Mobile Experience
1. Toggle between form and preview with floating button
2. Smooth transitions between views
3. Full-screen experience for both form and preview
4. Touch-optimized controls

## Future Enhancements

Potential improvements:
- [ ] Auto-save draft as user types
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts
- [ ] Zoom controls for preview
- [ ] Print preview mode
- [ ] Dark mode support
- [ ] Collaborative editing

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

