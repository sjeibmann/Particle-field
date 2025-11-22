class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.friction = 0.95;
        this.hue = Math.random() * 40 + 5; // Orange-red ember colors
        this.alpha = Math.random() * 0.5 + 0.1;
        this.brightness = Math.random() * 20 + 50; // For ember-like flickering
    }

    update(mouse) {
        // Calculate distance to mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // Fluid-like movement (attract/repel based on mouse button)
        if (distance < 150) {  // Slightly larger interaction radius
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 150;
            let force = Math.pow((maxDistance - distance) / maxDistance, 3);
            
            if (force < 0) force = 0;
            
            // Reverse force direction if mouse button is pressed
            let directionMultiplier = mouse.isPressed ? 1 : -1;
            let directionX = forceDirectionX * force * this.density * 0.3 * directionMultiplier;
            let directionY = forceDirectionY * force * this.density * 0.3 * directionMultiplier;
            
            this.velocityX += directionX;
            this.velocityY += directionY;
        }

        // Apply velocity with higher friction for smoother motion
        this.velocityX *= 0.9;  // Increased friction
        this.velocityY *= 0.9;  // Increased friction
        
        // Reduced random movement for more controlled motion
        this.velocityX += (Math.random() - 0.5) * 0.08;
        this.velocityY += (Math.random() - 0.5) * 0.08;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Return to original position with gentler spring effect
        let dx2 = this.baseX - this.x;
        let dy2 = this.baseY - this.y;
        this.velocityX += dx2 * 0.01;  // Softer spring
        this.velocityY += dy2 * 0.01;  // Softer spring
        
        // More subtle flicker effect
        this.brightness = 50 + Math.sin(Date.now() * 0.0015 + this.x * 0.08) * 15;
    }

    draw(ctx) {
        // Create gradient for glowing effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, ${this.brightness * 0.7}%, ${this.alpha * 0.6})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 10%, 0)`);
        
        // Draw glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleField {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        // For trail effect
        this.lastTime = 0;
        this.trailOpacity = 0.05;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    setupEventListeners() {
        // Initialize mouse state
        this.mouse.isPressed = false;
        
        // Mouse movement
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Mouse down
        window.addEventListener('mousedown', () => {
            this.mouse.isPressed = true;
        });
        
        // Mouse up
        window.addEventListener('mouseup', () => {
            this.mouse.isPressed = false;
        });
        
        // Touch support
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }, { passive: false });
        
        // Touch start/end
        window.addEventListener('touchstart', () => {
            this.mouse.isPressed = true;
        });
        
        window.addEventListener('touchend', () => {
            this.mouse.isPressed = false;
        });
        
        // Handle window resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 100);
        });
    }
    
    resizeCanvas() {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Only recreate particles if size changed significantly
        if (Math.abs(oldWidth - this.canvas.width) > 50 || 
            Math.abs(oldHeight - this.canvas.height) > 50) {
            this.createParticles();
        }
    }
    
    handleResize() {
        this.resizeCanvas();
    }
    
    createParticles() {
        // Keep existing particles if possible to avoid flickering
        const oldParticles = this.particles.slice();
        // Doubled the particle count by changing the divisor from 2500 to 1250
        const newParticleCount = Math.floor((window.innerWidth * window.innerHeight) / 625);
        this.particles = [];
        
        for (let i = 0; i < newParticleCount; i++) {
            let x, y;
            
            // Try to reuse existing particle positions
            if (i < oldParticles.length) {
                // Scale position to new canvas size
                x = (oldParticles[i].x / this.canvas.width) * window.innerWidth;
                y = (oldParticles[i].y / this.canvas.height) * window.innerHeight;
            } else {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            }
            
            this.particles.push(new Particle(x, y));
        }
    }
    
    animate(timestamp) {
        // Clear with trail effect
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate delta time for smooth animations
        const deltaTime = timestamp - (this.lastTime || timestamp);
        this.lastTime = timestamp;
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse);
            this.particles[i].draw(this.ctx);
        }
        
        requestAnimationFrame((ts) => this.animate(ts));
    }
}

// Start the particle field when the page loads
window.onload = () => {
    new ParticleField();
};
