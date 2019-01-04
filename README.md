# rollbar-discord
Simple webhook translator for Rollbar to Discord

# How to:
1. Rename config-example.json to config.json
2. Start node application. (must run on port 80 and have a domain or subdomain pointing to the application to work with Rollbar Webhook system)
3. Navigate to yourdomain.com/setup
4. A token is generated to be used with the Rollbar webhook URL. You can point Rollbar to yourdomain.com/token.
5. Add your Discord webhook to config.json
