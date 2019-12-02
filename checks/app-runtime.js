const { checkForPackage } = require('../lib/pkg-version.js')

exports.run = function hasAppRuntime(pkg) {
    return checkForPackage('@dhis2/app-runtime', pkg)
}
