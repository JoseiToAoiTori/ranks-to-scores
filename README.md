# ranks-to-scores

This project is a set of scripts that convert a ranked list of shows to a 1-10 scale. Also calculates percentiles. Requires an AniList account if you want to dump all the anime you have completed instead of starting the ranking from scratch. Also requires NodeJS and yarn.

Note that this works best for lists with over a 100 shows.

- Run `yarn`
- Edit `config.json` with your AniList username ID. Feel free to edit the percentage thresholds to finetune your scoring
- You can just create a file called `rankings.txt` in this folder and enter your shows line-by-line from favourite to least favourite BUT there's a better way to get started if you have an AniList account
- DO NOT DO THIS IF YOU MANUALLY CREATED A `rankings.txt` FILE. THIS WILL OVERWRITE ANY EXISTING FILE. `node dump_shows` will dump your shows (from highest to lowest scores) into a txt file. Then you just have to reorder them. Unscored shows are skipped
- Edit `rankings.txt` to rank your shows from favourite to least favourite
- Generate an access token from AniList.
- Run `ACCESS_TOKEN={YOUR_TOKEN_HERE} node update_list` to update your AniList with new scores and percentiles. This will take a while. I use a pipeline to do this automatically.
