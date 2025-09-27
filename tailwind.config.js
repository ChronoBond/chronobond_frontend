/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	fontFamily: {
  		sans: [
  			'Inter',
  			'ui-sans-serif',
  			'system-ui'
  		],
  		display: [
  			'Inter',
  			'ui-sans-serif',
  			'system-ui'
  		]
  	},
        fontSize: {
          // Hero Headlines - 64px–80px desktop, 32px mobile
          'hero-2xl': ['5rem', { lineHeight: '0.85', letterSpacing: '-0.03em' }], // 80px
          'hero-xl': ['4rem', { lineHeight: '0.9', letterSpacing: '-0.025em' }], // 64px
          'hero-lg': ['3rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }], // 48px
          'hero-md': ['2rem', { lineHeight: '1', letterSpacing: '-0.015em' }], // 32px
          
          // Section Titles - 40px–48px desktop, 24px mobile
          'section-2xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }], // 48px
          'section-xl': ['2.5rem', { lineHeight: '1.05', letterSpacing: '-0.015em' }], // 40px
          'section-lg': ['1.75rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }], // 28px
          'section-md': ['1.5rem', { lineHeight: '1.15' }], // 24px
          
          // Subheadings - 28px–32px
          'subheading-xl': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }], // 32px
          'subheading-lg': ['1.75rem', { lineHeight: '1.15' }], // 28px
          
          // Body Text - 18px–24px
          'body-xl': ['1.5rem', { lineHeight: '1.6' }], // 24px
          'body-lg': ['1.125rem', { lineHeight: '1.6' }], // 18px
          'body-md': ['1rem', { lineHeight: '1.5' }], // 16px
          
          // Captions - 14px–16px
          'caption-lg': ['1rem', { lineHeight: '1.4' }], // 16px
          'caption-md': ['0.875rem', { lineHeight: '1.4' }], // 14px
          
          // Legacy display sizes for compatibility
          'display-2xl': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
          'display-xl': ['6rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
          'display-lg': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
          'display-md': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
          'display-sm': ['2.5rem', { lineHeight: '1.1' }],
          'display-xs': ['2rem', { lineHeight: '1.15' }],
        },
  	extend: {
		colors: {
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			success: {
				DEFAULT: 'hsl(142 76% 36%)',
				foreground: 'hsl(355 7% 97%)'
			},
			warning: {
				DEFAULT: 'hsl(38 92% 50%)',
				foreground: 'hsl(0 0% 9%)'
			},
			error: {
				DEFAULT: 'hsl(0 84% 60%)',
				foreground: 'hsl(0 0% 98%)'
			},
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			},
			// Glassmorphism colors
			glass: {
				50: 'rgba(255, 255, 255, 0.05)',
				100: 'rgba(255, 255, 255, 0.1)',
				200: 'rgba(255, 255, 255, 0.15)',
				300: 'rgba(255, 255, 255, 0.2)',
				400: 'rgba(255, 255, 255, 0.25)',
				500: 'rgba(255, 255, 255, 0.3)',
			},
			glassBorder: {
				50: 'rgba(255, 255, 255, 0.05)',
				100: 'rgba(255, 255, 255, 0.1)',
				200: 'rgba(255, 255, 255, 0.15)',
				300: 'rgba(255, 255, 255, 0.2)',
			},
			// Gradient colors for DeFi theme
			gradient: {
				primary: 'from-cyan-400 via-blue-500 to-violet-500',
				secondary: 'from-blue-400 via-purple-500 to-pink-500',
				success: 'from-green-400 via-emerald-500 to-teal-500',
				warning: 'from-yellow-400 via-orange-500 to-red-500',
			}
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'spotlight': {
  				'0%': {
  					opacity: 0,
  					transform: 'translate(-72%, -62%) scale(0.5)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translate(-50%,-40%) scale(1)'
  				}
  			},
  			shimmer: {
  				from: {
  					'backgroundPosition': '0 0'
  				},
  				to: {
  					'backgroundPosition': '-200% 0'
  				}
  			},
  			'fade-in': {
  				from: {
  					opacity: 0,
  					transform: 'translateY(10px)'
  				},
  				to: {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in': {
  				from: {
  					transform: 'translateX(-100%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			pulse: {
  				'0%, 100%': {
  					opacity: 1
  				},
  				'50%': {
  					opacity: 0.5
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'spotlight': 'spotlight 2s ease .75s 1 forwards',
  			'shimmer': 'shimmer 2s linear infinite',
  			'fade-in': 'fade-in 0.5s ease-out',
  			'slide-in': 'slide-in 0.3s ease-out',
  			'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
		boxShadow: {
			glow: '0 0 20px rgba(59, 130, 246, 0.5)',
			'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
			card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			// Glassmorphism shadows
			'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
			'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
			'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
		},
		backdropBlur: {
			'xs': '2px',
			'sm': '4px',
			'md': '8px',
			'lg': '12px',
			'xl': '16px',
			'2xl': '24px',
			'3xl': '40px',
		}
  	}
  },
  plugins: [require("tailwindcss/nesting"), require("@tailwindcss/typography"), require("tailwindcss-animate")],
} 