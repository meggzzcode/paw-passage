# Image credits

Photographs used in the keepsake examples on the home page, the purchase (unlock) page and the free-visitor keepsake preview.
Each was found on Wikimedia Commons, where the file page states the license shown below. Checked on 2026-11-27.
All seven are CC0 1.0 (public domain dedication), so no attribution is legally required; the gallery still carries a small
"Photo credits" disclosure ("Photo by <author>, CC0, via Wikimedia Commons"). The three Unsplash-origin files were published
on Unsplash before 5 June 2017 (CC0 era) and are marked CC0 on Commons. No identifiable person or brand appears in any of
them. Photos are used as examples of what the keepsake maker does, never as customer stories. The dog names printed on the
keepsakes (Biscuit, Juno) are sample names, not the dogs' real names.

License for all rows: CC0 1.0 Universal, https://creativecommons.org/publicdomain/zero/1.0/

| Example file (public/examples/) | Original photo (before) file | Source (Wikimedia Commons file page)                                                                               | Author (as listed)         | Photo date | Notes                                                                                  |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| birthday.webp                   | birthday-photo.webp          | https://commons.wikimedia.org/wiki/File:Happy_dog_at_Anjuna_Beach_(Unsplash).jpg                                   | Samantha Scholl (Unsplash) | 2016       | Smiling cream dog, warm backlight; birthday-cover theme                                |
| magazine.webp                   | magazine-photo.webp          | https://commons.wikimedia.org/wiki/File:Black_dog_head_tilt.jpg                                                    | Reid Campbell              | 2021-11-21 | Black curly-coated dog, head tilt; editorial-cover theme                               |
| detective.webp                  | detective-photo.webp         | https://commons.wikimedia.org/wiki/File:Earnest_dog_in_the_grass_(Unsplash).jpg                                    | Rodion Kutsaev (Unsplash)  | 2015       | Curious tan and white dog in grass; secret-agent theme                                 |
| postcard.webp                   | postcard-photo.webp          | https://commons.wikimedia.org/wiki/File:Dog_smiling_at_the_camera_-_Reta,_Buenos_Aires,_Argentina_(04-01-2024).jpg | Maxd2                      | 2024-01-04 | Dog on a dune under blue sky; day-trip theme                                           |
| certificate.webp                | certificate-photo.webp       | https://commons.wikimedia.org/wiki/File:Beautiful_Labrador_Retriever.jpg                                           | Trashmut                   | 2023-03-03 | Happy golden Labrador looking up; toy-champion-certificate theme                       |
| seasonal.webp                   | seasonal-photo.webp          | https://commons.wikimedia.org/wiki/File:Dog_in_a_snowy_forest_(Unsplash).jpg                                       | Cam Adams (Unsplash)       | 2016       | Profile in a snowy forest; winter theme                                                |
| trading-card.webp               | trading-card-photo.webp      | https://commons.wikimedia.org/wiki/File:Karjalankarhukoira,_Karelian_Bear_Dog_looking_at_camera.jpg                | Uusijani                   | 2010-09-17 | Sitting Karelian Bear Dog; explorer-card theme (used only by the free-visitor preview) |

Attribution wording (optional, CC0): "Photo by <author>, CC0, via Wikimedia Commons."

Modifications: the keepsakes are drawn at 1080x1920 (Story) by the real keepsake renderer
(`scripts/demo/render-examples.mjs`: Playwright + the production `artwork.ts`, fonts and photo loader), a crop chosen so the
dog's eyes and nose stay inside the frame, a sample name, date, title and the Paws & Passage mark added, then resized to
540x960 and saved as webp (<= 90 KB each, no EXIF). The "Your photo" pictures are the source photographs resized only (long
edge 560, orientation applied, metadata stripped). Full-size originals are downloaded locally for rendering and are not
stored in the repository.

Then and Now: no second photo of the same dog could be verified, so there is no photo example for it. The public gallery
omits it; `then-and-now.webp` stays only as a labelled illustration used by the free-visitor preview.

Photos considered and not used: the earlier Rat Terrier with a ball (Henryemix, 2025, CC0) was rejected for the Toy
Champion example because the face is turned down and small in a low-resolution source; the happy Labrador above reads
better. The earlier sample photos (golden dog on tiles, chocolate puppy, snowy ridge dog, chocolate Labrador close-up,
golden retriever in a forest) were removed from the repository.

## Illustrations (not photographs)

| File               | What it is                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| then-and-now.webp  | Original illustration drawn for this site (sample illustrated dog, not a real dog), labelled "illustration" |
| camping-patch.webp | Original illustration drawn for this site, shown only as the matching style for the campout adventure       |

## Other photos on the site

Guide photos are licensed from Unsplash (Unsplash License); see /editorial-standards. They are not part of this file's scope.
Stamp and badge artwork: original SVG in this repo. `public/demo/*.webp` (5) are screenshots of the app, not photographs
of dogs. `public/journal/*.webp` and `public/share/*.jpg` are guide photos (Unsplash License) and are not keepsake sources.
