export default defineAppConfig({
  global: {
    picture: {
      alt: 'My profile picture'
    },
    email: 'brucewonghh@outlook.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral',
      navy: 'navy'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Bruce Huang • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://linkedin.com/in/brucewonghh',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/BruceHuangQQ',
      'target': '_blank',
      'aria-label': 'GitHub'
    }, {
      'icon': 'i-simple-icons-devpost',
      'to': 'https://devpost.com/BruceHuangQQ',
      'target': '_blank',
      'aria-label': 'Devpost'
    }]
  }
})
