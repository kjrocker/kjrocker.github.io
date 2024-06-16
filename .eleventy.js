
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { DateTime } = require('luxon');
const { marked } = require('marked');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("postDate", (date) => {
    return DateTime.fromJSDate(date, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("markdownify", (data) => {
    return marked.parse(data)
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