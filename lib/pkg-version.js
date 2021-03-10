exports.check_for_package = (patterns, pkg) =>
    patterns.map(pattern => {
        const result = []
        for (const prop in pkg) {
            if (prop === 'dependencies' || prop === 'devDependencies') {
                const isDev = prop === 'devDependencies'

                for (const dep in pkg[prop]) {
                    if (pattern.test(dep)) {
                        result.push({
                            name: dep,
                            dependency: true,
                            development: isDev,
                            version: pkg[prop][dep],
                        })
                    }
                }
            } else {
                continue
            }
        }
        return result
    }).flat()

exports.mark_as_deprecated = (patterns, pkg) => 
    patterns.map(pattern => {
        const result = []
        for (const prop in pkg) {
            if (prop === 'dependencies' || prop === 'devDependencies') {
                for (const dep in pkg[prop]) {
                    if (pattern[0].test(dep)) {
                        result.push({
                            name: dep,
                            action: pattern[1],
                            deprecated: true,
                        })
                    }
                }
            } else {
                continue
            }
        }
        return result
    }).flat()

