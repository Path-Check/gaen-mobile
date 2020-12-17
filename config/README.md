## Custom Configuration

The PathCheck GAEN mobile project expects a provided configuration at build time
for custom branding, copy, links, and assets. To update the configuration, edit
the files present in this folder.

Before making updates to any JSON file, please validate the contents [here].
The application will not load invalid JSON, and the copy will not render.
[here]: https://jsonlint.com/

### Environment Flags

The app uses build flags to determine many of the optional features in the app.

The application will read environment variables from the `.env.bt`,
`.env.bt.staging`, and `.env.bt.release` files at build time to determine which
features are enabled.

See [example.env.bt](../example.env.bt) for a reference of available features.

### Custom Copy:

`config/copy.json`

The supported values are:

- `healthAuthorityName`: This is the display name for the registered GAEN health authority associated with the app. This data is required as the app provides no default.
- `welcomeMessage`: This is the line that shows up on the welcome screen, right above the name of the application `DISPLAY_NAME` on the configuration file. If the config provides no value, the default is `Welcome to`
- `about`: The app displays this copy on the main body of text on the about screen.
  If the config provides no value, the default message will be:
  `The app_name app is developed by the health_authority_name.`
- `legal`: The app will display this copy on the main body of text for the legal screen,
  by default, the app will display the store name of the application.
- `verificationCodeInfo`: The app will display this copy in the first section of
  the verification code info screen. It should contain general information about
  the verification code. The app provides a default value.
- `verificationCodeHowDoIGet`: The app will display this copy in the second section of
  the verification code info screen. It should contain information about how the
  user can get a verification code. The app provides a default value.

The `json` structure is:

```typescript
type Resource = Partial<Record<Locale.Locale, CustomCopy>> & { en: CustomCopy }

interface CustomCopy {
  welcomeMessage?: string
  about?: string
  legal?: string
  healthAuthorityName: string
  verificationCodeInfo?: string
  verificationCodeHowDoIGet?: string
  appTransition: {
    header: string
    body1: string
    body2: string
  }
}
```

```json
{
  "en": {
    "healthAuthorityName": "Health Authority",
    "welcome_message": "",
    "about": "",
    "legal": "",
    "verificationCodeInfo": "",
    "verificationCodeHowDoIGet": "",
    "appTransition": {
      "header": "",
      "body1": "",
      "body2": ""
    }
  },
  "es_PR": {
    "healthAuthorityName": "Autoridad sanitaria",
    "welcome_message": "",
    "about": "",
    "legal": ""
  }
}
```

The application will follow the following steps to determine the correct copy:

1. If the locale and the key for the custom copy exist, use that value.

2. If the locale exists, but the key for that locale does not default to
   the 'en' custom copy key value.

3. If the en custom copy exits, but the key does not exist, return
   undefined. (The custom copy translation function expects callers to provide either a default value or to provide null handling in this case)

4. If the en custom copy does not exist at all, return undefined. (The custom copy translation function expects callers to provide either a default value or to provide null handling in this case)

### Custom Links

The `links.json` files should have the custom links to display at the bottom
of either the `about` or `legal` contents and the label value for each one of
the languages supported, defined by the `SUPPORTED_LOCALES` environment
variable.

The app will display each link in the same order that the links are in the config file. If config provides no value for the user's current locale, the app will not display the link.

The supported screens for links are:

- `about`: The app will display these links under the main body of text on the about screen.

The `JSON` structure should be:

```json
{
  "about": [
    {
      "url": "http://www.about.com",
      "label": {
        "en": "About",
        "es_PR": "Acerca"
      }
    },
    {
      "url": "http://www.mission.com",
      "label": {
        "en": "Mission",
        "es_PR": "Mision"
      }
    }
  ],
  "legal": [
    {
      "url": "http://www.about.com",
      "label": {
        "en": "About",
        "es_PR": "Acerca"
      }
    },
    {
      "url": "http://www.eula.com",
      "label": {
        "en": "Terms of service",
        "es_PR": "Terminos de servicio"
      }
    }
  ]
}
```

An empty `""` value on a particular locale will result in the link not being
displayed when that language is the active one.

### Brand Colors

`configbrandColors.ts` must define all of the following colors with the exact
format of `export const primary100 = "#123456"`

```
// Primary
export const primary100 = "#4051db"
export const primary110 = "#4754c5"
export const primary125 = "#2434b6"
export const primary150 = "#192591"

// Secondary
export const secondary10 = "#f8f8ff"
export const secondary50 = "#e5e7fa"
export const secondary75 = "#d3d7f8"
export const secondary100 = "#a5affb"
```

The app will ignore any extra colors defined.
