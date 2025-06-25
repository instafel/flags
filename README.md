# Flag Library Sources

This repository serves as the source for the Instafel Flag Library. If you are going to add a new flag, create a new file inside the **content** folder and make sure the following fields are present at the top of the markdown file (all fields are required).

```yaml
fid: ig_example_flag # flag name without space (you need to use _, not -)
category: meta-ai # category name, you need to select a category for flag
title: Example Flag # flag title
desc: A example flag description # flag description
author: mamiiblt # your name or nickname
added_in: 318.0.0.0.31 # if you don't know, just pass null
removed_in: 319.0.0.0.32 # if you don't know, just pass null
uncompitable_flags: # if you know that flag can be crash with these flags, just pass it
    - panavision_nav3
    - igds_prism_launcher_config_android
```

## Rules

1. Always use git because last_edit fields automatically updated with your current commit.
2. Inspect other content markdowns, then write your own flag markdown.
3. Don't edit anything generated in **list** folder.
4. Always exec `npm run generate` before creating pull request.
5. All pull requests will be inspected, don't worry.

## Categories

| Category       | Category       | Category       |
|----------------|----------------|----------------|
| direct         | reels          | stories        |
| feed           | interface      | notes          |
| quality        | camera         | call           |
| fixes          | comments       | profile        |
| professional   | livestreams    | meta-ai        |

## Before Creating Pull Request

You need to generate flag-contents. Run `npm install` & `npm run generate` everytime when you changed anything in **content** folder and check logs.

> Then don't edit anything in **list** folder and create a pull request :) 