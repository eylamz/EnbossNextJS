export const colors = {
  
    brand: {
      main: 'hsl(166, 100%, 40%)',
      dark: 'hsl(166, 100%, 40%)',
      50: 'hsl(171, 100%, 95%)',
      100: 'hsl(171, 100%, 85%)', 
      200: 'hsl(171, 100%, 75%)d',
      300: 'hsl(171, 100%, 65%)',
      400: 'hsl(171, 100%, 55%)',
      500: 'hsl(171, 100%, 50%)',
      600: 'hsl(171, 100%, 45%)',
      700: 'hsl(171, 100%, 25%)',
      800: 'hsl(171, 100%, 15%)',
      900: 'hsl(171, 100%, 5%)',
    },
    'bg-primary': 'var(--bg-primary)',
    'bg-gradient': 'var(--bg-gradient)',
    'bg-dark': 'hsl(228, 16%, 17%)',
    backgroundImage: {
      'gradient-custom': 'var(--bg-gradient)',
    },
    backdropBlur: {
      'custom': '5px',
    },
    header: {
      light: 'hsl(166, 100%, 40%)',
      dark: 'hsl(161, 91%, 59%)',
      border: {
        light: 'hsla(166, 94.70%, 29.60%, 1)',
        dark: 'hsl(166 98% 28% / 1)',  
      },
      text: {
        light: 'hsl(164, 97%, 12%)',
        dark: 'hsl(164, 97%, 12%)',
      }
    },
    card: {
      light: 'hsl(0, 0%, 100%)',
      dark: 'hsl(240, 8%, 20%)',
      border: {
        light: 'hsl(0, 0%, 85%)',
        dark: 'hsl(203, 38%, 12%)',
      },
      icon: {
        light: 'hsl(0, 0%, 85%)',
        dark: 'hsl(203 17% 29% / 1)',
      }
    },
    background: {
      light: 'hsl(220, 18%, 97%)',
      dark: 'hsl(207, 16%, 11%)',
    },
    backgroundSecondary: {
      light: 'hsl(0, 0%, 95%)',
      dark: 'hsl(201, 30%, 11%)',
    },
    backgroundAccent: {
      light: 'hsl(0, 0%, 94%)',
      dark: 'hsl(0, 0%, 9%)',
    },
    text: {
      light: 'hsl(206, 14%, 10%)',
      dark: 'hsl(210, 100%, 100%)',
      hover: {
        light: '#1e293b',
        dark: '#e5e7eb',
      },
      heading: {
        light: 'hsl(0, 0%, 10%)',
        dark: 'hsl(220, 2%, 100%)',
      },
      secondary: {
        light: 'hsl(220, 1%, 54%)',
        dark: 'hsl(240, 6%, 75%)',
      },
    },
    
    border: {
      light: 'hsl(0, 0%, 85%)',
      dark: 'hsl(240, 6%, 27%)',
      primary: 'hsl(166, 98%, 33%)',
      inner: {
        light: '',
        dark: 'hsl(201, 18%, 19%)',
      },
    },
    input: {
      light: 'hsl(220, 6%, 90%)',
      dark: 'hsl(222, 10%, 20%)',
      hover: {
        light: 'hsl(220, 5%, 87%)',
        dark: 'hsl(222, 8%, 25%)',
      },
      text: {
        light: 'hsl(220, 1%, 52%)',
        dark: 'hsl(222, 5%, 64%)',
      },
    },
    btn: {
      light: 'hsl(171, 100%, 38%)',
      dark: 'hsl(171, 100%, 45%)',
      hover: {
        light: '#e2e8f0',
        dark: '#3e516c',
      },
      secondary: {
        light: 'hsl(0, 0%, 100%)',
        dark: 'hsl(240, 8%, 20%)',
        text: {
          light: 'hsl(206, 15%, 9%)',
          dark: 'hsl(180, 100%, 100%)',
        },
        hover: {
          light: 'red',
          dark: 'hsl(222, 13%, 15%)',
        },
        disabled: {
          light: 'hsl(0, 0%, 98%)',
          dark: 'hsl(222, 13%, 15%)',
        },
        disabledText: {
          light: 'hsl(220, 2%, 66%)',
          dark: 'hsl(214, 3%, 50%)',
        }
      },
    },
    switch: {
      background: {
        light: '#f1f5f9',
        dark: 'hsl(242, 2.33%, 27%)',
        checked: {
          light: 'hsla(162, 95%, 35%, 0.8)',
          dark: 'hsla(162, 100%, 45%, 0.5)',
        },
      },
      btn: {
        light: 'white',
        dark: '#e5e7eb',
      },
    },
    toast: {
      light: 'hsl(220, 35%, 25%)',    // Rich slate blue
      dark: 'hsl(220, 25%, 65%)',     // Soft gray blue
      bg: {
        light: 'hsl(220, 25%, 95%)',  // Ethereal light gray
        dark: 'hsl(220, 35%, 10%)',   // Deep slate shade
      },
      border: {
        light: 'hsl(220, 35%, 25%)',  // Matching light text
        dark: 'hsl(220, 25%, 65%)',   // Matching dark text
      }
    },
  
   
    success: {
      light: 'hsl(95, 98%, 43%)',    // Emerald teal
      dark: 'hsl(95, 98%, 43%)',     // Bright aqua
      bg: {
        light: 'hsl(162, 75%, 96%)',  // Crisp mint white
        dark: 'hsl(162, 95%, 8%)',    // Deep teal shade
      },
      border: {
        light: 'hsl(93, 95%, 32%)',  // Matching light text
        dark: 'hsl(93, 95%, 32%)',   // Matching dark text
      }
    },
  
    error: {
      light: 'hsl(360, 100%, 65%)',    // Deep ruby
      dark: '#f41f57',     // Soft coral rose
      bg: {
        light: 'hsl(354, 85%, 92%)',  // Delicate pink white
        dark: 'hsl(0, 100%, 8%)',   // Rich ruby shade
      },
      border: {
        light: 'hsl(0, 59%, 52%)',  // Matching light text
        dark: 'hsl(1, 69%, 14%)',   // Matching dark text
      }
    },
  
    warning: {
      light: 'hsl(35, 100%, 50%)',     // Warm amber
      dark: 'hsl(56, 90%, 72%)',      // Bright peach
      bg: {
        light: 'hsl(38, 93%, 65%)',   // Soft cream white
        dark: 'hsl(38, 98%, 48%)',      // Bright peach
      },
      border: {
        light: 'hsl(35, 99%, 40%)',   // Matching light text
        dark: 'hsl(38, 98%, 48%)',      // Bright peach
      }
    },
  
    info: {
      light: 'hsl(205, 90%, 40%)',    // Ocean blue
      dark: 'hsl(180, 100%, 48%)',     // Clear sky blue
      bg: {
        light: 'hsl(185, 93%, 21%)',  // Fresh azure white
        dark: 'hsl(185, 93%, 21%)',   // Deep ocean shade
      },
      border: {
        light: 'hsl(205, 90%, 40%)',  // Matching light text
        dark: 'hsl(205, 85%, 70%)',   // Matching dark text
      }
  
    
    }
  } as const;
  