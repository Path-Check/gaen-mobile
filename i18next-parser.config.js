module.exports = {
  contextSeparator: "_",
  // Key separator used in your translation keys

  createOldCatalogs: false,
  // Save the \_old files

  defaultNamespace: "default",
  // Default namespace used in your i18next config

  defaultValue: "",
  // Default value to give to empty keys

  indentation: 2,
  // Indentation of the catalog files

  keepRemoved: false,
  // Keep keys from the catalog that are no longer in code

  keySeparator: ".",
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  // see below for more details
  lexers: {
    htm: ["HTMLLexer"],
    html: ["HTMLLexer"],

    mjs: ["JavascriptLexer"],
    js: ["JsxLexer"], // if you're writing jsx inside .js files, change this to JsxLexer
    jsx: ["JsxLexer"],
    ts: ["JavascriptLexer"],
    tsx: ["JsxLexer"],

    default: ["JavascriptLexer"],
  },

  lineEnding: "auto",
  // Control the line ending. See options at https://github.com/ryanve/eol

  // Only en needs to be extracted and uploaded to lokalise. Lokalise will add/trim keys in other languages
  locales: ["en"],

  namespaceSeparator: ":",
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  output: "src/locales/$LOCALE.json",
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()

  input: ["src/**/*.js"],
  // An array of globs that describe where to look for source files
  // relative to the location of the configuration file

  reactNamespace: false,
  // For react file, extract the defaultNamespace - https://react.i18next.com/components/translate-hoc.html
  // Ignored when parsing a `.jsx` file and namespace is extracted from that file.

  sort: true,
  // Whether or not to sort the catalog

  useKeysAsDefaultValue: false,
  // Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
  // The option `defaultValue` will not work if this is set to true

  verbose: false,
  // Display info about the parsing including some stats
}
