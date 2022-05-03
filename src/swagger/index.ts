const swaggerOptions = {
    info: {
      version: "0.0.1",
      title: "Payment API",
      description:
        "Service payment API",
      contact: {
        name: "Brian Monroy",
        url: "https://github.com/brianUtn98",
        email: "brian.gmonroy98@gmail.com",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "{protocol}://localhost:{port}/{basePath}",
        description: "Development server",
        variables: {
          protocol: {
            enum: ["http", "https"],
            default: "http",
          },
          port: {
            enum: ["4000", "5000"],
            default: "4000",
          },
          basePath: {
            enum: ["","v1","v2"],
            default: "",
          },
        },
      }
    ],
    security: {
      BasicAuth: {
        type: "http",
        scheme: "basic",
      },
    },
    baseDir: __dirname,
    // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
    filesPattern: "../**/*.ts",
    // URL where SwaggerUI will be rendered
    swaggerUIPath: "/swagger",
    // Expose OpenAPI UI
    exposeSwaggerUI: true,
    // Expose Open API JSON Docs documentation in `apiDocsPath` path.
    exposeApiDocs: true,
    // Open API JSON Docs endpoint.
    apiDocsPath: "/api-json",
    // Set non-required fields as nullable by default
    notRequiredAsNullable: true,
    // You can customize your UI options.
    // you can extend swagger-ui-express config. You can checkout an example of this
    // in the `example/configuration/swaggerOptions.js`
    swaggerUiOptions: {},
    // multiple option in case you want more that one instance
    multiple: true,
  };
  
  export default swaggerOptions;
  