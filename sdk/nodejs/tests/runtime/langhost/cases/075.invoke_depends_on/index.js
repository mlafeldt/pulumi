// Test the dependsOn invoke option.

const assert = require("assert");
const pulumi = require("../../../../../");

const dependency = { resolved: false };

const dependsOn = pulumi.output(
    new Promise((resolve) =>
        setTimeout(() => {
            dependency.resolved = true;
            resolve();
        }),
    ),
);

// By the time we serialise the arguments of the invoke, dependency.resolved
// should be true due to dependsOn awaiting the setTimeout promise resolution
// above. Without dependsOn, the invoke will be serialised before promise
// resolution (since promises [microtasks] happen before timeout events
// [macrotasks]).
pulumi.runtime.invoke("test:index:echo", { dependency }, { dependsOn }).then((result) => {
    assert.strictEqual(result.dependency.resolved, true);
});
