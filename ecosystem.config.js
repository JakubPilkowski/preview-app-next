module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'server.js',
      instances: 1, // Single instance per container (ECS handles scaling)
      exec_mode: 'fork', // Fork mode instead of cluster
      env: {
        NODE_ENV: 'production',
        PORT: 80,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 80,
      },
      // PM2 settings
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Restart settings
      autorestart: true,
      watch: false,
      max_restarts: 2,
      min_uptime: '10s',
    },
  ],
};
