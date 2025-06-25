# Flag Library Sources

This repository serves as the source for the Instafel Flag Library. If you want to add a new flag, create a new file inside the **content** folder and make sure the following fields are present at the top of the markdown file. **All fields are required.**

```yaml
id: null # Leave as null. Do not enter a custom value; it will be automatically set by the generator.
category: meta-ai # Specify a category for the flag (e.g., meta-ai, feed, etc.)
title: Example Flag # The title of the flag
desc: An example flag description # A short description of the flag
author: mamiiblt # Your name or nickname
added_in: 318.0.0.0.31 # If unknown, leave as null
removed_in: 319.0.0.0.32 # If unknown, leave as null
uncompitable_flags: # List any flags that are known to conflict with this one (optional)
  - panavision_nav3
  - igds_prism_launcher_config_android
```

> You can edit the flag content in the `/content` folder at any time if needed.

## Rules

1. Always use this repository with git clone environment. The `last_edit` field is automatically updated with your current commit infos.
2. Review other markdown files in the **content** folder before writing your own.
3. Do not manually edit anything inside the **list** folder — it's need to auto-generated.
4. Always run `npm run generate` before creating a pull request or submitting a commit.
5. All pull requests will be reviewed — no need to worry.

## Categories

| Category     | Category    | Category |
| ------------ | ----------- | -------- |
| direct       | reels       | stories  |
| feed         | interface   | notes    |
| quality      | camera      | call     |
| fixes        | comments    | profile  |
| professional | livestreams | meta-ai  |
| other        |             |          |

> More categories may be added in the future.

## Before Creating a Pull Request

You must generate the flag content. Run `npm install` and then `npm run generate` every time you make changes in the **content** folder, and review the generation logs.

> After that, do not edit anything in the **list** folder. Just create your pull request 🙂
