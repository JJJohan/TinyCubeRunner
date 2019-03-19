# Cube Runner

![Screenshot](https://renscreations.com/files/cuberunner/screenshot.png)

This project is a simple Cube Runner clone created using the Unity Tiny framework.

At the time of submission, Unity Tiny is currently developed using TypeScript (prior to its switch to using C#).
I used this as an opportunity to:
* Become more familiar with TypeScript (I've only dabbled in it a little bit.)
* Have a go at faking a 3D game environment in a strictly 2D game framework.
* Have a little bit of fun :).

There isn't anything revolutionary in here, but I have not seen any examples of Unity Tiny being used for anything 3D yet.

## Demo

**Feel free to try the game here:**
https://renscreations.com/files/cuberunner/

## Patterns

The cube patterns are data-driven, read via a patterns.json file using a very simple format.

An example of the pattern file with a single pattern available:
```json{
	"patterns": 
	[{
		"lines":
		[
		"xxxxxx---x",
		"-----x---x",
		"----x---x-",
		"---x---x--",
		"--x---x---",
		"-x---x----",
		"x---x-----",
		"x---x-----",
		"x---x-----",
		"-x---x----",
		"--x---x---",
		"---x---x--",
		"----x---x-",
		"-----x---x",
		"xxxxxx---x",
		"x--------x",
		"x--------x"
		]
	}]
}```