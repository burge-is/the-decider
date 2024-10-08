# Simple Decider

The **Simple Decider** is a lightweight JavaScript tool for evaluating conditions against a set of rules and determining outcomes. It focuses on straightforward decision-making scenarios, without the complexity of multiple matches or strict matching options.

## Features

- **Simple Rule Evaluation**: Provides core functionality for evaluating a set of conditions against predefined rules.
- **Default Result Handling**: Returns a default result when no rule matches or throws an error if no default is provided.

## Installation

To install the **Simple Decider**, add it to your project using npm:

```bash
npm install decider
```

## Usage

Import the **Simple Decider** and create an engine instance with your set of rules.

### Example

```javascript
const { simpleDecider } = require('./simpleDecider');

// Define the rules
const rules = [
    { rule: { hasAccess: false }, result: "Access Denied" },
    { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
    { rule: { hasAccess: true }, result: "User Access Granted" }
];

// Create an engine instance
const engine = simpleDecider(rules, { defaultResult: "Default Access" });

// Evaluate a subject
const subject1 = { hasAccess: true, isAdmin: true };
console.log(engine(subject1));  // Output: "Admin Access Granted"

const subject2 = { hasAccess: false };
console.log(engine(subject2));  // Output: "Access Denied"

const subject3 = { isAdmin: true };  // Missing hasAccess flag
console.log(engine(subject3));  // Output: "Default Access"
```

### Differences from Decider

- **No Multiple Matches**: The **Simple Decider** does not support returning multiple matches. It returns the first match found.
- **No Strict Matching**: The **strict** option is not available, meaning extra properties in the subject will not prevent a match.
- **Simplified Logic**: The core logic is simplified to ensure quick evaluations for basic rule sets.

## Error Handling

If no rules match and no **default result** is specified, the engine throws an error.

```javascript
const rules = [
    { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" }
];

const engine = simpleDecider(rules);
const subject = { hasAccess: false };

// Throws: "No matching rule found for the provided subject."
console.log(engine(subject));
```

# Decider

[The **Decider**](https://youtu.be/6Z7sg_VwkXw?si=Tm6Yo7vzvzUSRdZY&t=7) builds on the functionality of the **Simple Decider** to handle more complex scenarios. It provides additional features such as matching specific rules, collecting all matches, and strict matching.



[![I am the decider](https://i1.ytimg.com/vi/6Z7sg_VwkXw/hqdefault.jpg)](https://youtu.be/6Z7sg_VwkXw?si=Tm6Yo7vzvzUSRdZY&t=7)

## Features

- **Simple Rule Evaluation**: Provides core functionality for evaluating a set of conditions against predefined rules.
- **Strict Matching**: Allows for strict matching where no extra properties beyond those in the rule are allowed in the subject.
- **Multiple Matches**: Supports returning all possible matches instead of just the first match.
- **Default Result Handling**: Returns a default result when no rule matches or throws an error if no default is provided.
- **Array-Based Conditions**: Supports array-based conditions for scenarios where a value must match one of several possibilities.

## Usage

Import the **Decider** and create a decider instance with your set of rules.

### Example

```javascript
const { decider } = require('./decider');

// Define the rules
const rules = [
    { rule: { hasAccess: false }, result: "Access Denied" },
    { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
    { rule: { hasAccess: true }, result: "User Access Granted" }
];

// Create an engine instance
const engine = decider(rules, { returnAllMatches: false, defaultResult: "Default Access" });

// Evaluate a subject
const subject1 = { hasAccess: true, isAdmin: true };
console.log(engine(subject1));  // Output: "Admin Access Granted"

const subject2 = { hasAccess: false };
console.log(engine(subject2));  // Output: "Access Denied"

const subject3 = { isAdmin: true };  // Missing hasAccess flag
console.log(engine(subject3));  // Output: "Default Access"
```

### Parameters

- **rules**: An array of rule objects where each rule has:
  - **rule**: An object defining the conditions for matching (e.g., `{ hasAccess: true }`).
  - **result**: The result to return if the rule matches (e.g., `"Access Granted"`).
  - **strict** (optional): A boolean indicating if strict matching should be applied (default is `false`).

- **options**: An optional object with the following properties:
  - **defaultResult**: A value to return if no rules match.
  - **returnAllMatches**: If `true`, returns an array of all matching results. Defaults to `false`.

## Advanced Features

### Strict Matching

The **strict** option enforces that no extra properties are allowed beyond those specified in the rule. If the subject contains extra properties, the rule will not match.

```javascript
const rules = [
    { rule: { hasAccess: true, isAdmin: true }, result: "Strict Admin Access", strict: true }
];

const engine = decider(rules);
const subject = { hasAccess: true, isAdmin: true, extraProperty: true };

// Throws an error or returns default if set, since strict mode disallows extra properties
console.log(engine(subject));
```

### Returning All Matches

You can configure the **Decider** to return **all matching rules** instead of just the first match.

```javascript
const rules = [
    { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
    { rule: { hasAccess: true }, result: "User Access Granted" }
];

const engine = decider(rules, { returnAllMatches: true });
const subject = { hasAccess: true, isAdmin: true };

// Output: ["Admin Access Granted", "User Access Granted"]
console.log(engine(subject));
```

## Testing

To run tests for the **Decider** and **Simple Decider**, you can use Jest or any other JavaScript testing framework. Here's a sample unit test using Jest:

```javascript
const { decider } = require('./decider');
const { simpleDecider } = require('./simpleDecider');

test("Returns 'Admin Access Granted' when both hasAccess and isAdmin are true", () => {
    const rules = [
        { rule: { hasAccess: true, isAdmin: true }, result: "Admin Access Granted" },
        { rule: { hasAccess: true }, result: "User Access Granted" }
    ];
    const engine = decider(rules);
    const subject = { hasAccess: true, isAdmin: true };
    expect(engine(subject)).toBe("Admin Access Granted");

    const simpleEngine = simpleDecider(rules);
    expect(simpleEngine(subject)).toBe("Admin Access Granted");
});
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
