
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { DateTime } = require('luxon');
const { marked } = require('marked');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier-terser");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/assets/css");

  eleventyConfig.addFilter("postDate", (date) => {
    return DateTime.fromJSDate(date, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("markdownify", (data) => {
    return marked.parse(data)
  });

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true
      });
    }

    return content;
  });

  return {
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
    dir: {
      input: 'src',
      output: '_site'  // This is the default value anyhow
    }
  };
};