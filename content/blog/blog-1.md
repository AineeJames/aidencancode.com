---
title: Building a Simple CLI Tool in Go
description: A walkthrough on creating a simple command-line tool in Go with examples, explanations, and images.
pubDate: 2025-08-25
---

# Building a Simple CLI Tool in Go

Go is a fantastic language for building **command-line tools**. It's fast, simple, and compiles into a single binary that you can share easily.  
In this post, we'll walk through building a small CLI program step by step. By the end, you’ll have a working application you can expand on.

---

## Why Build CLI Tools in Go?

Before jumping into code, here’s why Go is great for CLI development:

- **Single binary**: Compile once and distribute.  
- **Cross-platform**: Works on Windows, macOS, and Linux.  
- **Speed**: Fast compile times and execution.  
- **Standard library**: Many tools you need are already included.  

![Go Gopher with terminal](https://blog.golang.org/gopher/gopher.png)

---

## Step 1: Basic Project Setup

Let's start with a simple `main.go` file.

```go title="main.go"
package main

import (
	"fmt"
	"os"
)

func main() {
	// Print the arguments passed to the program
	args := os.Args
	fmt.Println("Arguments passed:", args)
}
````

If we compile and run:

```sh
go run main.go hello world
```

Output:

```
Arguments passed: [./main hello world]
```

---

## Step 2: Adding Commands

Most CLI tools have **commands** (like `git commit`, `git push`, etc.).
We can add simple command handling:

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: mycli <command>")
		return
	}

	command := os.Args[1]

	switch command {
	case "greet":
		fmt.Println("Hello, developer!")
	case "bye":
		fmt.Println("Goodbye!")
	default:
		fmt.Println("Unknown command:", command)
	}
}
```

Example run:

```sh
go run main.go greet
```

Output:

```
Hello, developer!
```

---

## Step 3: Adding Flags

Go has a built-in `flag` package that makes parsing arguments easier.

```go
package main

import (
	"flag"
	"fmt"
)

func main() {
	name := flag.String("name", "world", "a name to say hello to")
	times := flag.Int("times", 1, "number of times to greet")

	flag.Parse()

	for i := 0; i < *times; i++ {
		fmt.Printf("Hello, %s!\n", *name)
	}
}
```

Run:

```sh
go run main.go -name=Aiden -times=3
```

Output:

```
Hello, Aiden!
Hello, Aiden!
Hello, Aiden!
```

---

## Step 4: Improving with Colors

CLI tools often look nicer with some **color output**.
We can use a third-party library like [`github.com/fatih/color`](https://github.com/fatih/color).

Install:

```sh
go get github.com/fatih/color
```

Code:

```go
package main

import (
	"flag"
	"fmt"

	"github.com/fatih/color"
)

func main() {
	name := flag.String("name", "world", "a name to say hello to")
	flag.Parse()

	cyan := color.New(color.FgCyan).SprintFunc()
	bold := color.New(color.Bold).SprintFunc()

	fmt.Printf("Hello, %s! Welcome to %s\n", cyan(*name), bold("Go CLI Tools"))
}
```

---

## Step 5: Organizing Code

As your project grows, you don’t want everything in `main.go`.
Let’s split commands into a `cmd/` folder.

```
mycli/
├── cmd/
│   └── greet.go
└── main.go
```

`greet.go`:

```go
package cmd

import "fmt"

func Greet(name string) {
	fmt.Printf("Hello, %s!\n", name)
}
```

`main.go`:

```go
package main

import (
	"flag"
	"mycli/cmd"
)

func main() {
	name := flag.String("name", "world", "a name to say hello to")
	flag.Parse()

	cmd.Greet(*name)
}
```

---

## Step 6: Final Thoughts

What we built here is just the beginning.
From here, you could add:

* Multiple commands (`greet`, `bye`, `version`).
* Better error handling.
* Subcommand libraries like [Cobra](https://github.com/spf13/cobra).
* Unit tests for each command.

---

![Terminal with Go CLI](https://miro.medium.com/max/1400/1*FDGHnp5A4AzfUG5P_HiZlg.png)

---

## Full Example Repository

I’ve included all the code snippets in a single repo layout for reference:

```
mycli/
├── cmd/
│   ├── greet.go
│   └── bye.go
├── go.mod
└── main.go
```

---

✅ And that’s it! You’ve just created your **first CLI tool in Go**.
With just a few lines of code, you can already start distributing useful tools across your systems.

Would you like me to **make this post even longer** by adding an example where the tool fetches data from an API (e.g., GitHub API) and prints it in the terminal?

