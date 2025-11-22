# Particle Field

![Particle field screenshot](./_pics/particle-field.png)

Ember-like particle field rendered on an HTML5 canvas. Particles drift with fluid behavior, glow with animated gradients, and react to pointer input (repel vs attract while pressed) to simulate a rock disturbing a stream.

## Features

- Full-screen canvas filled with thousands of glowing particles
- Subtle fluid motion with friction, Brownian drift, and spring return to home positions
- Mouse/touch interaction: particles repel by default and attract while the button/press is held
- Adjustable particle density based on viewport size
- Lightweight Python HTTP server for quick local git previews

## Project Structure

```
├─ index.html      # Canvas container and script entry point
├─ particles.js    # Particle + ParticleField classes and animation loop
└─ server.py       # Simple Python http.server launcher (port 8000)
```

## Getting Started

1. Install Python 3 if you do not already have it.
2. Start the local server from the project root:
   ```bash
   python3 server.py
   ```
3. The script automatically opens `http://localhost:8000`. If it doesn’t, visit the URL manually.

## Customization

- Tweak particle behavior (size, density, friction, interaction radius) inside `particles.js`.
- Adjust the canvas trail opacity or add new visual effects within `ParticleField.animate()`.
- Update `index.html` with UI elements or controls as needed.

## License

MIT License (feel free to adapt/extend the effect for your own projects).
