# Vue in SharePoint Demonstration

This is a demonstration of using Vue to build client-side webapps, hosted in SharePoint, that access content in SharePoint using [Microsoft's REST API](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/determine-sharepoint-rest-service-endpoint-uris).
The API calls use a custom [Vue plug-in](https://github.com/BenRunInBay/sharepoint-vue-plugin) for reading and writing to the API, but you could use the [SharePoint client library](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/complete-basic-operations-using-javascript-library-code-in-sharepoint) or the [PnPjs library](https://pnp.github.io/pnpjs/).
Read the slides for an overview of how I use Vue in SharePoint and the examples covered in this repo.

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

### Compile and minify for production

```
npm run build
```

### Then, upload these files to the SharePoint library you set up

The URL will look something like this:
//YourDomain.onmicrosoft.com/sites/YourNewPublishingSite/YourNewLibrary/default.aspx
