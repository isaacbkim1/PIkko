module.exports = {
  apps: [
    {
      name:        'pikko-api',
      script:      './server/index.js',
      interpreter: 'node',
      // Pass --experimental-vm-modules is not needed for ESM with type:module
      node_args:   '',
      cwd:         '/home/work/pikko',
      env: {
        NODE_ENV: 'production',
        PORT:     '3001',
      },
      watch:       false,
      autorestart: true,
      max_memory_restart: '200M',
    },
  ],
}
