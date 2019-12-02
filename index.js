const fg = require('fast-glob')
const fs = require('fs-extra')

function checks (pkg) {
    const checklist = fs.readdirSync('./checks', {
        encoding: 'utf8',
    })

    const result = {
        pkgName: pkg.name,
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
        .reduce((a, b) => result.checks = a.concat(b), [])

    return result
}

function investigate(filepath) {
    const pkg = require(filepath)

    return checks(pkg)
}

function format(reports) {
    let headers = new Set(['package'])
    let rows = []

    for (const report of reports) {
        let row = []
        row.push(report.pkgName)
        for (const check of report.checks) {
            headers.add(check.name)
            if (check.pass) {
                if (check.meta.depVersion) {
                    row.push(check.meta.depVersion)
                } else if (check.meta.devVersion) {
                    row.push(check.meta.devVersion)
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

module.exports = ({ command, glob }) => {
    const matches = fg.sync(glob, {
        ignore: [
            '**/node_modules/**',
        ]
    })

    const reports = matches.map(investigate)
    console.log(format(reports))
}
