const { check_for_package, mark_as_deprecated } = require('../lib/pkg-version.js')

const deps = [
    /^@dhis2\/.*$/,
]

const deprecated = [
    [/code-style/, 'deprecation: replace with @dhis2/cli-style'],
    [/d2$/, 'deprecation: migrate to @dhis2/app-runtime'],
    [/packages/, 'deprecation: use @dhis2/cli-utils-release'],
    [/d2-ui/, 'deprecation: migrate to @dhis2/ui'],
    [/d2-manifest/, 'deprecation: use @dhis2/cli-app-scripts'],
    [/d2-i18n-generate/, 'deprecation: use @dhis2/cli-app-scripts'],
    [/d2-i18n-extract/, 'deprecation: use @dhis2/cli-app-scripts'],
    [/d2-charts-api/, 'deprecation: use @dhis2/analytics'],
    [/d2-analysis/, 'deprecation: use @dhis2/analytics'],
    [/\/ui-.*$/, 'deprecation: consider importing from @dhis2/ui'],
]

exports.run = function dhis2_dependencies(pkg) {
    const our_packages = check_for_package(deps, pkg)
    const deprecated_packages = mark_as_deprecated(deprecated, pkg)

    const results = our_packages.reduce((acc, cur) => {
        for (const old of deprecated_packages) {
            if (old.name === cur.name) {
                cur = {
                    ...cur,
                    ...old,
                }
            }
        }
        acc.push(cur)
        return acc
    }, [])

    return results
}
