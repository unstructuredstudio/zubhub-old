# ZubHub

## Development Setup
1. Install `npm` modules for both server and client via `npm install` Refer https://dev.to/pacheco/my-fullstack-setup-node-js-react-js-and-mongodb-2a4k
2. Install and setup `mongodb` (for Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x-tarball/)
3. Run the project from the `zubhub` directory via `npm run dev`
4. This will run the backend application on port 5000, and the frontend on port 3000. The Zubhub fronend will be availabe on on http://localhost:3000

## Deploy in Production
Before deploying in production, make sure you ahve all the necessary environment variables ready in `.env` files  
You may also need to make. The following installation steps assume you are on a Nginx machine and 

1. Pull latest ZubHub from repo
2. Copy the correct `.env` files in `~/zubhub` and `~/zubhub/client`
3. Copy the directories to the place where Nginx can serve them (eg. `/srv/www/zubhub`)
4. Install `react-scripts` (if needed) to build the production release `npm install react-scripts`
5. Build the frontend: `cd ~/zubhub/client && npm run build`
6. Install `pm2` to manage ZubHub in production: `npm install pm2 -g`
7. From main Zubhub directory, `pm2 start deploy.config.js` This starts both the backend and frontend and served them at `http://<server IP>:5000` Use
`pm2 status` and `pm2 log`to make sure that ZubHub is running and healthy.
8. Configure your main server (Nginx or Apache) to serve ZubHub. An example Nginx configuration is below.

### Sample Nginx Config
Add the following configuration to Nginx in `sites-enabled`. If SSL is configured, follow instructions to add SSL certificates as directed.
With Lets Encrypt, this is as easy as updating current certificates. Certbot will add the necessary changes in Nginx config automatically. 
Refer https://certbot.eff.org/docs/using.html?highlight=expand#re-creating-and-updating-existing-certificates for more info.

```
server {
   server_name zubhub.domain.com;

   root /path/to/zubhub/client/build;

   location / {
        try_files $uri /index.html;
   }

   location /api {
      proxy_pass http://localhost:5000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
   }

}
```

Restart nginx via `service nginx restart` The site should now be available on `http://zubhub.domain.com`


