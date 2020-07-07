/**
 * Changefreq
 * Valid Values: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
 *
 * Priority
 * Valid Values: 0.0 to 1.0
 *
 * For more information check the 'gulp-sitemap' plugin documentation (https://www.npmjs.com/package/gulp-sitemap)
 */

module.exports = {
  siteUrl: "https://fyyb.com.br/preview/awax/",
  pages: {
    "index.html": {
      changefreq: "day",
      priority: 1,
    },
  },
};
