# ranks-to-scores

This project is a set of scripts that convert a ranked list of shows to a 1-10 scale. Requires an AniList account if you want to dump all the anime you have completed instead of starting the ranking from scratch. Also requires NodeJS and yarn.

Note that this works best for lists with over a 100 shows.

- Run `yarn`
- Edit `config.json` with your AniList username ID. Feel free to edit the percentage thresholds to finetune your scoring
- You can just create a file called `rankings.txt` and enter your shows line-by-line from favourite to least favourite BUT there's a better way to get started if you have an AniList account
- DO NOT DO THIS IF YOU MANUALLY CREATED A `rankings.txt` FILE. THIS WILL OVERWRITE ANY EXISTING FILE. `node dump_shows` will dump your shows (from highest to lowest scores) into a txt file. Then you just have to reorder them. Unscored shows are skipped
- Edit `rankings.txt` to rank your shows from favourite to least favourite
- Run `node .` to create `scores-output.txt` which scores your shows on a 1-10 scale from the ranking you chose and the set percentage thresholds. You get a mean score for your new list as the output of this script. Could be handy
- TODO: Update these scores directly on the platforms (most likely AL since MAL is shit)
- TODO: A dynamic UI for editing rankings because the text system fucking sucks
- TODO: Gitignore my output files. Committing them for now so I can work on this at work
- TODO: Actually just make the whole thing a website. Leech my school for hosting
