# Memory lane

### Problem definition

After a series of discovery calls we found out a problem that our users are facing. They are having a hard time sharing their memories with friends and family. They are using a combination of social media, messaging apps, and email to share their memories. They are looking for a solution that allows them to store and share their memories in a single place.

As a first iteration for this solution, we want to build a web application that allows users to create a memory lane and share it with friends and family. A memory lane is a collection of events that happened in a chronological order. Each event consists of a title, a description, a timestamp, and at least one image.

## Demo

[Loom Demo Video](https://www.loom.com/share/82a113352bf34c02a208ee834a5e8055?sid=84872db2-fa4f-411e-ad38-0131b7575f9c)

## High level architecture

#### Frontend

- I utilized a Next.js app along with tailwindcss. This was done do to the familarity with the framework as well as extensive support from the community. I also incorporated different libraries like uploadthing to support uploading images and embla-carousel-react to quickly put together a carousel of images.

- I decided to go with a carousel as opposed to just displaying a row of images as it would better support handling multiple images. Otherwise, I would need to make a decision on how I would want to handle what happens when the images grow bigger than the card they're positioned in.

- Added search functionality based off name, description, and tags. Helps filter what you're searching for.

#### Backend

- I kept majority of the backend the same. I just modified it to support the new fields I stored. I decided to store pictures and tags as a string that i could just parse as a json object when I need to access it on the frontend.
- I also decided to play around with the GPT api and incorporate it in the backend by automatically tagging a memory. I thought this was a good use case as it would help support useful features in the future, like filtering your hundred's of memories by a certain tag. Also would be interesting to show data around what type of memories you experience the most.
