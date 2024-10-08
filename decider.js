function decider(rules, { defaultResult = null, returnAllMatches = false } = {}) {
    return subject => {
        const matches = rules.filter(({ rule, strict }) => {
            const subjectKeys = Object.keys(subject);
            const ruleKeys = Object.keys(rule);
            if (strict && subjectKeys.length > ruleKeys.length) return false;
            return ruleKeys.every(key =>
                Array.isArray(rule[key]) ? rule[key].includes(subject[key]) : rule[key] === subject[key]
            );
        });

        if (matches.length > 0) return returnAllMatches ? matches.map(({ result }) => result) : matches[0].result;
        if (defaultResult !== null) return returnAllMatches ? [defaultResult] : defaultResult;
        throw new Error("No matching rule found for the provided subject.");
    };
}

module.exports = { decider };
