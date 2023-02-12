# ranks-to-scores

Requires an AniList account. Also requires NodeJS and yarn.

- Run `yarn`
- Edit `config.json` with your AniList username ID. Feel free to edit the percentage thresholds to suit yourself
- `node dump_shows` will dump your shows into a txt file with the highest scores first. Unscored shows are skipped
- Edit `scores.txt` to rank your shows from favourite to least favourite
- Run `node .` to create `scores-output.txt` which scores your shows on a 1-10 scale from the ranking you chose and the set percentage thresholds. You get a mean score for your new list as the output of this script. Could be handy.
- TODO: Update these scores directly on the platforms (most likely AL since MAL is shit)
- TODO: A dynamic UI for editing rankings because the text system fucking sucks.
- TODO: Actually just make the whole thing a website. Leech my school for hosting.
- TODO: Gitignore my output files. Committing them for now so I can work on this at work.
