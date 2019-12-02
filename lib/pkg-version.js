exports.checkForPackage = function checkForDep(name, pkg) {
    const result = {
        name,
        meta: {},
    }

    const keys = Object.keys(pkg)

    for (const key of keys) {
        switch (key) {
            case 'dependencies': {
                if (pkg.dependencies[name]) {
                    result.pass = true
                    result.meta.dependency = true
                    result.meta.depVersion = pkg.dependencies[name]
                }
                break
            }

            case 'devDependencies': {
                if (pkg.devDependencies[name]) {
                    result.pass = true
                    result.meta.devDependency = true
                    result.meta.devVersion = pkg.devDependencies[name]
                }
                break
            }

            case 'default': {
                break
            }
        }
    }

    return result
}
