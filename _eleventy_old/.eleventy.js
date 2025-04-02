
// const { EleventyRenderPlugin } = require("@11ty/eleventy");
// const { DateTime } = require('luxon');
// const { marked } = require('marked');
// const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
// const htmlmin = require("html-minifier-terser");
// const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
// const rss = require("@11ty/eleventy-plugin-rss");

import { EleventyRenderPlugin } from "@11ty/eleventy";
import { DateTime } from 'luxon';
import { marked } from 'marked';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import htmlmin from "html-minifier-terser";
import pluginSitemap from "@quasibit/eleventy-plugin-sitemap";
import rss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginSitemap, {
    hostname: 'https://kevinrocker.com',
});

  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/_redirects");

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

  // eleventyConfig.addPlugin(rss);
  // eleventyConfig.addFilter("absoluteUrl", rss.absoluteUrl);
  // eleventyConfig.addFilter("htmlToAbsoluteUrls", rss.htmlToAbsoluteUrls);
  eleventyConfig.addPlugin(rss.feedPlugin, {
		type: "rss", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "blog", // iterate over `collections.posts`
			limit: 0,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "Kevin Rocker's Blog",
			subtitle: "Musings about technology, software development, and miscellenia.",
			base: "https://kevinrocker.com/",
			author: {
				name: "Kevin Rocker",
				email: "", // Optional
			}
		}
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