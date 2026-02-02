/**
 * Seed script to create initial design patterns.
 * Run with: npx tsx scripts/seed-patterns.ts
 */

import { savePattern, type Pattern } from '../.knowledge/lib/index';

const patterns: Pattern[] = [
  // ========== LAYOUT (3 patterns) ==========
  {
    name: 'CSS Grid System',
    category: 'layout',
    tags: ['grid', 'responsive', 'layout', 'columns', '12-column'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Ensure proper landmark regions, maintain logical reading order. Use semantic HTML within grid cells.',
      wcag_level: 'AA',
    },
    principles: [
      'Use CSS Grid for two-dimensional layouts requiring both row and column control',
      'Define explicit grid areas for complex layouts using grid-template-areas',
      'Use minmax() for flexible column sizing that respects content',
      'Apply gap for consistent spacing instead of margins on children',
      'Use fr units for proportional sizing that adapts to container',
    ],
    code_examples: {
      react: `const Grid = ({ children, cols = 12 }: { children: React.ReactNode; cols?: number }) => (
  <div className={\`grid grid-cols-\${cols} gap-4 md:gap-6\`}>
    {children}
  </div>
);

const GridItem = ({ span = 1, children }: { span?: number; children: React.ReactNode }) => (
  <div className={\`col-span-\${span}\`}>{children}</div>
);`,
      vanilla: `.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid { gap: 1.5rem; }
}

.col-span-6 { grid-column: span 6; }
.col-span-4 { grid-column: span 4; }
.col-span-3 { grid-column: span 3; }`,
    },
  },
  {
    name: 'Flexbox Centering',
    category: 'layout',
    tags: ['flexbox', 'centering', 'alignment', 'utility'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    principles: [
      'Use flex with items-center and justify-center for perfect centering',
      'Prefer gap over margins for spacing between flex children',
      'Use flex-1 to allow items to grow and fill available space',
      'min-height: 100vh for full viewport centering',
      'Consider flex-wrap for responsive layouts without media queries',
    ],
    code_examples: {
      react: `// Perfect center (both axes)
const Center = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center min-h-screen">
    {children}
  </div>
);

// Horizontal center with gap
const HStack = ({ children, gap = 4 }: { children: React.ReactNode; gap?: number }) => (
  <div className={\`flex items-center gap-\${gap}\`}>{children}</div>
);

// Vertical center with gap
const VStack = ({ children, gap = 4 }: { children: React.ReactNode; gap?: number }) => (
  <div className={\`flex flex-col items-center gap-\${gap}\`}>{children}</div>
);`,
      vanilla: `.center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.hstack {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vstack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}`,
    },
  },
  {
    name: 'Responsive Card Grid',
    category: 'layout',
    tags: ['cards', 'grid', 'responsive', 'e-commerce', 'auto-fit'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Include alt text for all card images. Ensure interactive cards have proper focus states and keyboard navigation.',
      wcag_level: 'AA',
    },
    principles: [
      'Use auto-fit or auto-fill with minmax for fluid responsive grids',
      'Apply aspect-ratio for consistent image dimensions',
      'Subtle hover states with transform and shadow for interactivity',
      'Group related content visually with consistent card structure',
      'Maintain readable line lengths within cards (45-75 characters)',
    ],
    code_examples: {
      react: `interface CardProps {
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const Card = ({ image, title, description, onClick }: CardProps) => (
  <article
    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
    </div>
  </article>
);

const CardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
    {children}
  </div>
);`,
      vanilla: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s, transform 0.3s;
}

.card:hover {
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.card-image {
  aspect-ratio: 4/3;
  object-fit: cover;
  width: 100%;
}`,
    },
  },

  // ========== NAVIGATION (2 patterns) ==========
  {
    name: 'Sticky Navbar',
    category: 'navigation',
    tags: ['navbar', 'sticky', 'header', 'scroll', 'shadow'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Include skip link as first focusable element. Use nav landmark with aria-label. Ensure sufficient color contrast.',
      wcag_level: 'AA',
    },
    principles: [
      'Use position: sticky for native scroll-aware positioning',
      'Add shadow on scroll to indicate elevation and separation',
      'Maintain consistent height to prevent layout shift',
      'Use z-index layering system (e.g., z-50 for nav)',
      'Backdrop blur effect for glassmorphism style',
    ],
    code_examples: {
      react: `import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white">
        Skip to content
      </a>
      <nav
        className={\`sticky top-0 z-50 transition-all duration-300 \${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }\`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <NavLinks />
        </div>
      </nav>
    </>
  );
};`,
      vanilla: `.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 4rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.skip-link {
  position: absolute;
  transform: translateY(-100%);
}

.skip-link:focus {
  transform: translateY(0);
}`,
    },
  },
  {
    name: 'Mobile Drawer Menu',
    category: 'navigation',
    tags: ['drawer', 'mobile', 'menu', 'sidebar', 'off-canvas'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Implement focus trap when open. Support Escape key to close. Use aria-expanded on trigger. Return focus to trigger on close.',
      wcag_level: 'AA',
    },
    principles: [
      'Off-canvas pattern with slide-in animation',
      'Semi-transparent backdrop to indicate modality',
      'Focus trap to keep keyboard navigation within drawer',
      'Escape key closes drawer for keyboard users',
      'Transform-based animation for GPU acceleration',
    ],
    code_examples: {
      react: `import { useEffect, useRef } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer = ({ isOpen, onClose, children }: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={\`fixed inset-0 bg-black/50 z-40 transition-opacity \${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }\`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <nav
        ref={drawerRef}
        className={\`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 \${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }\`}
        aria-label="Mobile menu"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2"
          aria-label="Close menu"
        >
          <XIcon />
        </button>
        <div className="pt-16 px-4">{children}</div>
      </nav>
    </>
  );
};`,
      vanilla: `.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 40;
}

.drawer-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 18rem;
  background: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  z-index: 50;
}

.drawer.open {
  transform: translateX(0);
}`,
    },
  },

  // ========== FORMS (2 patterns) ==========
  {
    name: 'Floating Label Input',
    category: 'forms',
    tags: ['input', 'label', 'animation', 'focus', 'material'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Label must always be visible (not reliant on placeholder). Use proper label-input association. Ensure 4.5:1 contrast ratio.',
      wcag_level: 'AA',
    },
    principles: [
      'Label starts as placeholder, floats up on focus/content',
      'Smooth transition with transform and scale for polish',
      'Clear visual hierarchy with color change on focus',
      'Always visible label state for accessibility',
      'Input border color indicates focus state clearly',
    ],
    code_examples: {
      react: `interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

const FloatingInput = ({ id, label, type = 'text', value, onChange }: FloatingInputProps) => {
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={\`absolute left-4 transition-all duration-200 pointer-events-none
          \${hasValue || 'peer-focus'}
            ? 'top-1 text-xs text-blue-500'
            : 'top-1/2 -translate-y-1/2 text-gray-400'
          }
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500
        \`}
      >
        {label}
      </label>
    </div>
  );
};`,
      vanilla: `.floating-input-wrapper {
  position: relative;
}

.floating-input {
  width: 100%;
  padding: 1.25rem 1rem 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s;
}

.floating-input:focus {
  border-color: #3b82f6;
}

.floating-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  transition: all 0.2s;
}

.floating-input:focus + .floating-label,
.floating-input:not(:placeholder-shown) + .floating-label {
  top: 0.25rem;
  transform: translateY(0);
  font-size: 0.75rem;
  color: #3b82f6;
}`,
    },
  },
  {
    name: 'Form Validation States',
    category: 'forms',
    tags: ['validation', 'error', 'form', 'states', 'feedback'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Use aria-invalid for error state. Associate error message with aria-describedby. Use aria-live region for dynamic errors.',
      wcag_level: 'AA',
    },
    principles: [
      'Clear visual distinction between error, success, and neutral states',
      'Error messages appear below input with icon for quick scanning',
      'Color is not the only indicator (use icons and text)',
      'Inline validation provides immediate feedback',
      'Group related error messages for screen readers with live regions',
    ],
    code_examples: {
      react: `type ValidationState = 'idle' | 'error' | 'success';

interface ValidatedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  state: ValidationState;
  errorMessage?: string;
  successMessage?: string;
}

const ValidatedInput = ({
  id,
  label,
  value,
  onChange,
  state,
  errorMessage,
  successMessage,
}: ValidatedInputProps) => {
  const errorId = \`\${id}-error\`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? errorId : undefined}
          className={\`w-full px-4 py-2 border-2 rounded-lg outline-none transition-colors \${
            state === 'error'
              ? 'border-red-500 bg-red-50'
              : state === 'success'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 focus:border-blue-500'
          }\`}
        />
        {state !== 'idle' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {state === 'error' ? <ErrorIcon /> : <CheckIcon />}
          </span>
        )}
      </div>
      {state === 'error' && errorMessage && (
        <p id={errorId} className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertIcon className="w-4 h-4" />
          {errorMessage}
        </p>
      )}
      {state === 'success' && successMessage && (
        <p className="mt-1 text-sm text-green-600">{successMessage}</p>
      )}
    </div>
  );
};`,
      vanilla: `.input-wrapper { margin-bottom: 1rem; }

.input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: border-color 0.2s, background-color 0.2s;
}

.input:focus { border-color: #3b82f6; outline: none; }
.input.error { border-color: #ef4444; background-color: #fef2f2; }
.input.success { border-color: #22c55e; background-color: #f0fdf4; }

.error-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}`,
    },
  },

  // ========== FEEDBACK (2 patterns) ==========
  {
    name: 'Toast Notification',
    category: 'feedback',
    tags: ['toast', 'notification', 'alert', 'feedback', 'snackbar'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Use role="status" for non-critical and role="alert" for errors. Apply aria-live="polite" for status updates.',
      wcag_level: 'AA',
    },
    principles: [
      'Non-blocking feedback that auto-dismisses',
      'Positioned in corner (typically bottom-right) for visibility',
      'Variants for success, error, warning, and info states',
      'Manual dismiss option for user control',
      'Animation for smooth appearance and exit',
    ],
    code_examples: {
      react: `type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const Toast = ({ message, type, onDismiss }: ToastProps) => {
  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  const icons = {
    success: <CheckCircleIcon />,
    error: <XCircleIcon />,
    warning: <ExclamationIcon />,
    info: <InfoIcon />,
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={\`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-up \${styles[type]}\`}
    >
      {icons[type]}
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};`,
      vanilla: `.toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.toast-success { background: #22c55e; color: white; }
.toast-error { background: #ef4444; color: white; }
.toast-warning { background: #eab308; color: black; }
.toast-info { background: #3b82f6; color: white; }

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
    },
  },
  {
    name: 'Loading Skeleton',
    category: 'feedback',
    tags: ['skeleton', 'loading', 'placeholder', 'animation', 'shimmer'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Use aria-busy="true" on loading container. Add aria-label describing loading state. Hide skeletons from screen readers.',
      wcag_level: 'AA',
    },
    principles: [
      'Skeleton shape matches content layout to prevent shift',
      'Subtle shimmer animation indicates loading without distraction',
      'Preserve layout dimensions for seamless transition',
      'Use neutral gray tones that work in light/dark modes',
      'Pulse or wave animation for visual feedback',
    ],
    code_examples: {
      react: `const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={\`animate-pulse bg-gray-200 rounded \${className}\`}
    aria-hidden="true"
  />
);

const CardSkeleton = () => (
  <div aria-busy="true" aria-label="Loading content" className="space-y-4">
    <Skeleton className="h-48 w-full" /> {/* Image */}
    <Skeleton className="h-6 w-3/4" /> {/* Title */}
    <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
    <Skeleton className="h-4 w-5/6" /> {/* Description line 2 */}
  </div>
);

const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div aria-busy="true" aria-label="Loading text" className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={\`h-4 \${i === lines - 1 ? 'w-4/5' : 'w-full'}\`}
      />
    ))}
  </div>
);`,
      vanilla: `.skeleton {
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 50%,
    #e5e7eb 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text { height: 1rem; margin-bottom: 0.5rem; }
.skeleton-title { height: 1.5rem; width: 75%; }
.skeleton-image { height: 12rem; width: 100%; }`,
    },
  },

  // ========== MICRO-INTERACTIONS (2 patterns) ==========
  {
    name: 'Button Hover Effect',
    category: 'micro-interactions',
    tags: ['button', 'hover', 'animation', 'interaction', 'transform'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Hover effects are visual enhancement only. Ensure button functionality works without hover. Respect prefers-reduced-motion.',
      wcag_level: 'AA',
    },
    principles: [
      'Subtle scale transform (1.02-1.05) for lift effect',
      'Shadow elevation increases on hover for depth',
      'Color shift provides additional feedback',
      'Cubic-bezier easing for natural feel',
      'Active state slightly reduces scale for press feedback',
    ],
    code_examples: {
      react: `const Button = ({
  children,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
}) => {
  const baseStyles = \`
    px-6 py-3 rounded-lg font-medium
    transform transition-all duration-200 ease-out
    hover:scale-105 hover:shadow-lg
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    motion-reduce:transform-none motion-reduce:transition-none
  \`;

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  };

  return (
    <button className={\`\${baseStyles} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  );
};`,
      vanilla: `.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transform: translateY(0);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, background-color 0.2s;
}

.btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; transform: none; }
  .btn:hover, .btn:active { transform: none; }
}`,
    },
  },
  {
    name: 'Ripple Effect',
    category: 'micro-interactions',
    tags: ['ripple', 'click', 'material', 'feedback', 'touch'],
    frameworks: ['react', 'vanilla'],
    accessibility: {
      notes: 'Ripple is purely visual feedback. Core button functionality must work without the effect. Respect prefers-reduced-motion.',
      wcag_level: 'A',
    },
    principles: [
      'Ripple originates from click/touch point for direct feedback',
      'Circular expansion with opacity fade creates wave effect',
      'Short duration (300-500ms) for snappy response',
      'Contained within button bounds using overflow hidden',
      'Remove ripple element after animation completes',
    ],
    code_examples: {
      react: `import { useState, useRef, MouseEvent } from 'react';

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const RippleButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 500);
  };

  return (
    <button
      ref={buttonRef}
      onClick={addRipple}
      className="relative overflow-hidden px-6 py-3 bg-blue-600 text-white rounded-lg"
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Add to tailwind.config.js:
// animation: { ripple: 'ripple 0.5s ease-out' }
// keyframes: { ripple: { '0%': { width: '0', height: '0', opacity: '0.5' }, '100%': { width: '200px', height: '200px', opacity: '0' } } }`,
      vanilla: `.ripple-btn {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ripple 0.5s ease-out forwards;
}

@keyframes ripple {
  from {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  to {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

// JavaScript:
// button.addEventListener('click', (e) => {
//   const ripple = document.createElement('span');
//   ripple.className = 'ripple';
//   ripple.style.left = e.offsetX + 'px';
//   ripple.style.top = e.offsetY + 'px';
//   button.appendChild(ripple);
//   setTimeout(() => ripple.remove(), 500);
// });`,
    },
  },

  // ========== DATA-DISPLAY (2 patterns) ==========
  {
    name: 'Data Table',
    category: 'data-display',
    tags: ['table', 'data', 'grid', 'sorting', 'responsive'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Use proper th/td with scope attributes. Add caption for table purpose. Support keyboard navigation for interactive tables.',
      wcag_level: 'AA',
    },
    principles: [
      'Sticky header for long tables to maintain context',
      'Zebra striping or row hover for scanability',
      'Sort indicators with aria-sort for accessibility',
      'Responsive: horizontal scroll or card view on mobile',
      'Align numbers right, text left for readability',
    ],
    code_examples: {
      react: `interface Column<T> {
  key: keyof T;
  header: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={\`px-4 py-3 font-semibold text-gray-900 text-\${col.align || 'left'}\`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={\`px-4 py-3 text-\${col.align || 'left'}\`}
                >
                  {String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      vanilla: `.data-table-wrapper {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
}

.data-table thead {
  background: #f9fafb;
  position: sticky;
  top: 0;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
}

.data-table tbody tr {
  border-top: 1px solid #e5e7eb;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.text-right { text-align: right; }`,
    },
  },
  {
    name: 'Stat Card',
    category: 'data-display',
    tags: ['stats', 'dashboard', 'card', 'metrics', 'kpi'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Use proper heading hierarchy. Add sr-only labels for trend indicators. Ensure color is not the only indicator of positive/negative trends.',
      wcag_level: 'AA',
    },
    principles: [
      'Large prominent number for quick scanning',
      'Clear label above or below the value',
      'Trend indicator with color and icon for context',
      'Compact layout that works in grid dashboards',
      'Optional icon to reinforce metric category',
    ],
    code_examples: {
      react: `interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const StatCard = ({ label, value, change, icon }: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <article className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2 gap-1">
              <span className={isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}>
                {isPositive ? <TrendUpIcon /> : isNegative ? <TrendDownIcon /> : null}
              </span>
              <span
                className={\`text-sm font-medium \${
                  isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
                }\`}
              >
                {isPositive && '+'}{change}%
              </span>
              <span className="sr-only">
                {isPositive ? 'increase' : isNegative ? 'decrease' : 'no change'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </article>
  );
};`,
      vanilla: `.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-top: 0.25rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive { color: #16a34a; }
.stat-change.negative { color: #dc2626; }`,
    },
  },

  // ========== AUTHENTICATION (1 pattern) ==========
  {
    name: 'Login Form',
    category: 'authentication',
    tags: ['login', 'auth', 'form', 'password', 'security'],
    frameworks: ['react', 'vue', 'svelte', 'vanilla'],
    accessibility: {
      notes: 'Use autocomplete attributes for browser autofill. Associate labels with inputs. Announce errors to screen readers.',
      wcag_level: 'AA',
    },
    principles: [
      'Clear, minimal layout focusing on the action',
      'Show/hide password toggle for usability',
      'Error handling with inline validation',
      'Remember me option for convenience',
      'Forgot password link prominently placed',
      'Loading state on submit to prevent double-clicks',
    ],
    code_examples: {
      react: `import { useState, FormEvent } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string, remember: boolean) => Promise<void>;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(email, password, remember);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>

      {error && (
        <div role="alert" className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded"
          />
          Remember me
        </label>
        <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};`,
      vanilla: `<form class="login-form" id="loginForm">
  <h1 class="login-title">Sign In</h1>

  <div id="errorAlert" class="error-alert hidden" role="alert"></div>

  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" autocomplete="email" required>
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <div class="password-wrapper">
      <input type="password" id="password" autocomplete="current-password" required>
      <button type="button" id="togglePassword" aria-label="Show password">
        <svg><!-- eye icon --></svg>
      </button>
    </div>
  </div>

  <div class="form-options">
    <label class="checkbox-label">
      <input type="checkbox" id="remember">
      Remember me
    </label>
    <a href="/forgot-password" class="forgot-link">Forgot password?</a>
  </div>

  <button type="submit" class="submit-btn">Sign In</button>
</form>

<style>
.login-form { max-width: 24rem; margin: 0 auto; }
.login-title { font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; }
.form-group input { width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
.password-wrapper { position: relative; }
.password-wrapper button { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); }
.form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.submit-btn { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border-radius: 0.5rem; font-weight: 500; }
.submit-btn:hover { background: #1d4ed8; }
.error-alert { padding: 0.75rem; background: #fef2f2; color: #b91c1c; border-radius: 0.5rem; margin-bottom: 1rem; }
.hidden { display: none; }
</style>`,
    },
  },
];

async function seedPatterns() {
  console.log('Seeding patterns...\n');

  for (const pattern of patterns) {
    try {
      const path = await savePattern(pattern);
      console.log(`✓ ${pattern.category}/${pattern.name}`);
    } catch (error) {
      console.error(`✗ ${pattern.category}/${pattern.name}:`, error);
    }
  }

  console.log(`\nSeeded ${patterns.length} patterns.`);
}

seedPatterns().catch(console.error);
