module.exports = {
    apps: [
        {
            name: 'account-h5',
            script: 'account-h5-back'
        }
    ],
    deploy: {
        production: {
            user: 'root',
            host: '47.108.229.144',
            ref: 'origin/master',
            repo: 'https://github.com/time0verflow/account-h5.git',
            path: '/workspace/account-h5',
            'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && npm run build && pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
            env: {
                NODE_ENV: 'production'
            }
        }
    }
}