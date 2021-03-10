const fg = require('fast-glob')
const fs = require('fs-extra')

function checks (pkg) {
    const checklist = fs.readdirSync('./checks', {
        encoding: 'utf8',
    })

    const result = {
        pkgName: pkg.name,
        pkgVersion: pkg.version,
    }

    /*
     * Run all the checks `run` commands and gather up the results in an
     * object with the shape:
     *
     * {
     *   pkgName: 'name from package.json',
     *   checks: [
     *      { checkName: 'first check', pass: <true|false|undefined> },
     *      { checkName: 'second check', pass: <true|false|undefined> },
     *   ]
     * }
     */
    checklist
        .map(check => require(`./checks/${check}`))
        .map(({ run }) => run(pkg))
        .reduce((a, b) => result.checks = a.concat(...b), [])

    return result
}

function investigate(filepath) {
    const pkg = require(filepath)

    return checks(pkg)
}

function format(header, reports) {
    let headers = new Set([header])
    let rows = []

    for (const report of reports) {
        let row = []
        row.push(report.pkgName)
        for (const check of report.checks) {
            headers.add(check.name)
            if (check.pass) {
                if (check.meta.version) {
                    row.push(`${check.meta.version} ${check.meta.development ? '(D)' : ''}`)
                } else {
                    row.push(check.pass)
                }
            } else {
                row.push('n/a')
            }
        }
        rows.push(row.join('|'))
    }

    return `${[...headers].join('|')}
${[...headers].map(h => '---').join('|')}
${rows.join('\n')}
`
}

function format_dep_report(report) {
    const result = [`
# ${report.pkgName} (${report.pkgVersion})

`
    ]

    const deps = []
    const devdeps = []

    for (const check of report.checks) {
        const str = `${check.name}|${check.version}|${check.action ? `${check.action}` : ''}`
        if (check.development) {
            devdeps.push(str)
        } else {
            deps.push(str)
        }
    }

    if (deps.length > 0) {
        result.push(`
## Dependencies

Package|Version|Action
---|---|---
${deps.join('\n')}

`
        )
    }

    if (devdeps.length > 0) {
        result.push(`
## Development dependencies

Package|Version|Action
---|---|---
${devdeps.join('\n')}
`
        )
    }

    return result.join('\n')
}

module.exports = ({ command, glob }) => {
    const matches = fg.sync(glob, {
        ignore: [
            '**/node_modules/**',
        ]
    })

    const reports = matches.map(investigate)

    for (const report of reports) {
        console.log(format_dep_report(report))
    }

    console.log(`_Generated ${new Date().toUTCString()}_`)
}
