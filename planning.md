Questions to consider:
Do we want a DB and user accounts or just local in-browser storage?
Blue book is incredibly commplex and has a lot of different categories of things to sort. How about we start with citing other cases first?
Do we want a separate Express API + Vite/React SPA
     Keeps the citation-engine as a standalone reusable package, clean API boundary for future clients (CLI, browser extension, Word plugin).
 	- More setup, two deploy targets 
Orrrrr Next.js full-stack: 
	- one framework, one deploy target, faster to stand up initially.
	- Citation engine still lives as a package but is consumed via server actions/API routes instead of a separate service


Asked claude to generate a scaffold...kinda overwhelmning, may delete
