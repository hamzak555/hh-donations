module.exports = {
  apps: [{
    name: 'hh-donations',
    script: 'npm',
    args: 'start',
    cwd: '/Users/hamzakhalid/Desktop/HH_Donations/hh-donations-app',
    watch: false,
    max_memory_restart: '1G',
    env: {
      PORT: 3000,
      BROWSER: 'none',
      REACT_APP_GOOGLE_MAPS_API_KEY: 'AIzaSyAOX2t7VI8Y0dQAWvgpHq9dzKjD01ZFK6w'
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    instances: 1,
    exec_mode: 'fork',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};