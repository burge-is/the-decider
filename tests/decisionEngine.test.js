const { decider } = require('../decider');
const externalRules = require('./testRules');  // External rules

// SECTION 1: Basic Access Tests
describe("Basic Access Tests with External Rules", () => {
    test("Returns 'Access Denied' when hasAccess is false", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: false };
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'Access Denied' when hasAccess is undefined", () => {
        const engine = decider(externalRules);
        const subject = {};
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'Access Denied' when hasAccess is null", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: null };
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'User Access Granted' when hasAccess is true", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: true };
        expect(engine(subject)).toBe("User Access Granted");
    });
});

// SECTION 2: Role-Based Access with External Rules
describe("Role-Based Access Tests with External Rules", () => {
    test("Returns 'Admin Access Granted' when hasAccess is true and isAdmin is true", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: true, isAdmin: true };
        expect(engine(subject)).toBe("Admin Access Granted");
    });

    test("Returns 'Manager Access Granted' when hasAccess is true and isManager is true", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: true, isManager: true };
        expect(engine(subject)).toBe("Manager Access Granted");
    });

    test("Returns 'Admin and Manager Access Granted' when both isAdmin and isManager are true", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: true, isAdmin: true, isManager: true };
        expect(engine(subject)).toBe("Admin and Manager Access Granted");
    });

    test("Returns 'User Access Granted' when neither isAdmin nor isManager is true", () => {
        const engine = decider(externalRules);
        const subject = { hasAccess: true, isAdmin: false, isManager: false };
        expect(engine(subject)).toBe("User Access Granted");
    });
});

// SECTION 3: Custom In-Unit Test Rules
describe("Custom Rule Tests Defined Directly in Unit Test", () => {
    const customRules = [
        { rule: { hasAccess: [false, undefined, null] }, result: "Access Denied" },
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" }
    ];

    test("Returns 'Access Denied' when hasAccess is null using custom rules", () => {
        const engine = decider(customRules);
        const subject = { hasAccess: null };
        expect(engine(subject)).toBe("Access Denied");
    });

    test("Returns 'Admin Access Granted' when hasAccess is true and isAdmin is true with custom rules", () => {
        const engine = decider(customRules);
        const subject = { hasAccess: true, isAdmin: true };
        expect(engine(subject)).toBe("Admin Access Granted");
    });

    test("Returns 'User Access Granted' when hasAccess is true with no admin privileges using custom rules", () => {
        const engine = decider(customRules);
        const subject = { hasAccess: true };
        expect(engine(subject)).toBe("User Access Granted");
    });
});

// SECTION 4: Multiple Matches and Prioritization
describe("Multiple Matches and Prioritization", () => {
    const prioritizationRules = [
        { rule: { hasAccess: true, isAdmin: true, isManager: true }, result: "Admin and Manager Access Granted" },
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
        { rule: { hasAccess: true, isManager: true }, result: "Manager Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" }
    ];

    test("Returns all matching results when returnAllMatches is enabled", () => {
        const engine = decider(prioritizationRules, { returnAllMatches: true });
        const subject = { hasAccess: true, isAdmin: true, isManager: true };
        const expectedResults = [
            "Admin and Manager Access Granted",
            "Admin Access Granted",
            "Manager Access Granted",
            "User Access Granted"
        ];
        expect(engine(subject)).toEqual(expectedResults);
    });

    test("Returns the most specific match when returnMostSpecific is enabled", () => {
        const engine = decider(prioritizationRules, { returnMostSpecific: true });
        const subject = { hasAccess: true, isAdmin: true, isManager: true };
        const expectedResult = "Admin and Manager Access Granted";
        expect(engine(subject)).toBe(expectedResult);
    });

    test("Returns the first match by default (returnAllMatches and returnMostSpecific disabled)", () => {
        const engine = decider(prioritizationRules);
        const subject = { hasAccess: true, isAdmin: true, isManager: true };
        expect(engine(subject)).toBe("Admin and Manager Access Granted");
    });
});


// SECTION 5: Strict and Non-Strict Matching
describe("Strict vs Non-Strict Matching Tests", () => {
    test("Throws an error if strict matching is enabled and extra properties exist", () => {
        const strictRules = [
            { rule: { hasAccess: true }, result: "Strict User", strict: true }
        ];
        const engine = decider(strictRules);

        const subject = { hasAccess: true, extraProperty: "extra" };
        expect(() => engine(subject)).toThrow("No matching rule found for the provided subject.");
    });

    test("Returns 'Strict User' when strict matching is disabled and extra properties exist", () => {
        const nonStrictRules = [
            { rule: { hasAccess: true }, result: "Strict User", strict: false }
        ];
        const engine = decider(nonStrictRules);

        const subject = { hasAccess: true, extraProperty: "extra" };
        expect(engine(subject)).toBe("Strict User");
    });
});

// SECTION 6: Default Results and Error Handling
describe("Default Results and Error Handling", () => {
    const inlineRules = [
        { rule: { hasAccess: true, isManager: true }, result: "Manager Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" },
    ];

    test("Returns default result when no matching rule is found", () => {
        const engine = decider(inlineRules, { defaultResult: "Default Access" });
        const subject = { isAdmin: true };
        expect(engine(subject)).toBe("Default Access");
    });

    test("Throws an error when no match is found and no default is provided", () => {
        const engine = decider(inlineRules);
        const subject = { isAdmin: true };
        expect(() => engine(subject)).toThrow("No matching rule found for the provided subject.");
    });
});
