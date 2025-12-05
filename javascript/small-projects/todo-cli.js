// Simple CLI todo list (run with: node todo-cli.js)
const readline = require("readine");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const todos =[];

function showMenu() {
    console.log("\n=== TODO CLI ===");
    console.log("1. Add Item")
    console.log("2. List Item")
    console.log("3. Exit")
    rl.question("Choose an option: ", handleChoice);
}

function handleChoice(choice) {
    if (choice === "1") {
        rl.question("New todo: ", (item) => {
          todos.push(item);
          console.log("Added:", item);
          showMenu();
      });
    } else if (choice === "2") {
        console.log("\nCurrent todos:");
        if (todos.length === 0) console.log("  (none yet)");
        todos.forEach((t, i) => console.log('${i +1}. ${t}'));
        showMenu();
    } else if (choice === "3") {
        console.log("Goodbye!");
        rl.close();
    } else {
        console.log("Invaild choice.");
        showMenu();
    }
}


showMenu();