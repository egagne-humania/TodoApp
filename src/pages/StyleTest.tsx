/**
 * StyleTest - Diagnostic page to verify styling is working
 */
export function StyleTest() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Test 1: Basic Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Color Test</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-background p-4 border rounded h-24 flex items-center justify-center">
            <span className="text-foreground font-medium">Background</span>
          </div>
          <div className="bg-primary text-primary-foreground p-4 rounded h-24 flex items-center justify-center font-medium">
            Primary
          </div>
          <div className="bg-secondary text-secondary-foreground p-4 rounded h-24 flex items-center justify-center font-medium">
            Secondary
          </div>
          <div className="bg-destructive text-destructive-foreground p-4 rounded h-24 flex items-center justify-center font-medium">
            Destructive
          </div>
        </div>
      </section>

      {/* Test 2: Custom Classes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Custom Classes Test</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="priority-low p-4 rounded">Low Priority</div>
          <div className="priority-medium p-4 rounded">Medium Priority</div>
          <div className="priority-high p-4 rounded">High Priority</div>
        </div>
      </section>

      {/* Test 3: Spacing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Spacing Test</h2>
        <div className="flex gap-4">
          <div className="p-4 bg-muted">Padding 4</div>
          <div className="p-6 bg-muted">Padding 6</div>
          <div className="p-8 bg-muted">Padding 8</div>
        </div>
      </section>

      {/* Test 4: Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. Typography Test</h2>
        <p className="text-foreground">Foreground text</p>
        <p className="text-muted-foreground">Muted foreground</p>
        <p className="text-sm">Small text</p>
        <p className="text-base">Base text</p>
        <p className="text-lg">Large text</p>
      </section>

      {/* Test 5: Borders & Shadows */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Borders & Shadows Test</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border p-4">Border</div>
          <div className="border-2 p-4">Border 2</div>
          <div className="shadow p-4 bg-card">Shadow</div>
        </div>
      </section>

      {/* Test 6: Responsive */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">6. Responsive Test</h2>
        <div className="bg-red-500 sm:bg-blue-500 md:bg-green-500 lg:bg-yellow-500 p-4 text-white">
          Red (mobile) → Blue (sm) → Green (md) → Yellow (lg)
        </div>
      </section>

      {/* Test 7: Transitions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">7. Transition Test</h2>
        <div className="transition-smooth hover:bg-primary hover:text-primary-foreground p-4 border cursor-pointer">
          Hover me (transition-smooth)
        </div>
      </section>

      {/* Test 8: Glass Effect */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">8. Glass Effect Test</h2>
        <div className="relative h-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="relative glass-effect p-4 m-4">
            Glass effect overlay
          </div>
        </div>
      </section>
    </div>
  );
}
