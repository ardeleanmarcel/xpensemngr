## Deployment to prod

1. To be able to build the webapp without issue, first build the API to get all the latest type definitions in its dist folder.
1. `npm run build`
1. copy the dist folder contents inside the S3 bucket
1. invalidate sources in cloudfront

<!-- testing CI/CD v3 -->
