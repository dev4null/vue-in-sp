# Vue in SP Demonstration

## Project setup

### Set up your SharePoint environment

1. [Set up an O365 Developer account and environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
2. Create a publishing portal site
3. Create a library app in that site to host your web app files built in vue-cli

### Install the dependencies for this code

```
npm install
```

### Update main.js for your SharePoint environment:

```
PRODUCTION_DOMAIN = "<the domain of your SharePoint server>"
BASE_PATH = "<the path to your SharePoint site>"
```

### You may need to modify what user profile information is available in your organization

See:

- src/models/user
- src/store/modules/users
- src/view/UserExample

### Compile and hot-reload for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

Then, upload these files to the SharePoint library you set up.
