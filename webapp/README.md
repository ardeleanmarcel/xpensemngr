## Deployment to prod

1. To be able to build the webapp without issue, first build the API to get all the latest type definitions in its dist folder.
1. `npm run build`
1. copy the dist folder contents inside the S3 bucket
1. invalidate sources in cloudfront

<!-- testing CI/CD v3 -->

### TODO

- [ ] Add architecture test to make sure pages do not import from each other
- [ ] Update husky hook to only run checks in a project folder IF there are changes in that folder
- [ ] Split pages into public and private
- [ ] !! BUG !! Navigating causes the entire webapp to reload. react router misconfiguration? migrate to v7?
- [ ] Add dependency cruiser rule to prevent modules in "components" from importing from "pages"
- [ ] Add lint rule to require return types (some function components are not typed at all)
- [ ] Update vite (possible major version bump)
