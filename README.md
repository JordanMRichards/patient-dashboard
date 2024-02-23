# Patient Dashboard
## Introduction
This is my task submission for a job application. The goal was to create a simple clinic-browsing dashboard interface  powered by an API that processes the already-provided CSV files and exposes them.

## Clinic API Service (Directory: `/clinics-api`)
  A simple back-end built with Express.js with a single API route. It processes the CSV files and joins them together into a useful response for our app. Requests are rate-limited and data sources are  tested.


  ### Routes
  | Method | Route                | Description  |
  | ------ | ------------------- | ------------ |
  `GET` | `/clinicsWithPatients` | Returns a data structure convenient for front-ends that need both clinics and their associated patients

  Note: I've purpose-built the  `clinicsWithPatients` route for convienence to align with the simple front-end requirements. I did consider creating a GraphQL server but given the simplicity of the data I thought that would be unnecessary. However, if we had multiple front-ends that wished to consume this data in different ways, I think it would be worth the complexity of implementing GraphQL.

  Note: I considered normalizing the response and doing joining on the client side. (having dedicated `/clinics` and `/patients` routes.) However, given the simplicity of the existing requirements I did not think it was necessary.

  ### Running locally:
  1. Execute `npm install`
  2. Execute `npm run build`
  3. Execute `npm start`

  Alternatively you can run a dev build via: `npm run dev`   

  Note: By default the API will be hosted on localhost at port `3001`. If you change this, remember also to change the `clinicApiUrl` in `/patient-dashboard/src/config/config.ts`.

  ## Web App (Directory: `/patient-dashboard`)
  Web app with hybrid static generation approach.
  
  Functionality:
  - You can select a clinic via the dropdown (the first clinic is pre-selected for you.)
  - You can order the table by pressing on the headers. You can use your keyboard to navigate through the sorting as well.
  - If the request fails, it will present a friendly message to the user and retry button (it will already retry up to 3 times automatically)
  - If you refocus the window, it will automatically fetch from the API
  - Client-side hydration status is indicated by a floating popup

  By default this service will be hosted on port `3000`

  ### Why Next.js?
  I chose Next.js primarly for its static-generation functionality. It also sets the app up well for future iterarions, such as statically processed URL params. I like that Next.js doesn't box you into a corner, where you can write as much or as server-side code as necessary. For this project I've avoided implementing an api backend within the Next.js codebase.

  ## API requests are sent both from the front-end and back-end:
  Every minute, the statically generated props are regenerated - triggering a server-side fetch to the API. For instance, if 1,000 customers land on home within the same minute, only the first page load within a 60 second window will trigger the static generation.
  
  This ensures:
   - Majority of users have their page load request load immediately
   - On page load, users can instantly can view the static data
   - the data is reasonably up-to-date to be useful enough for an initial page load
   - If the API goes down, you will see the previous results (note: you need to `build` and run the project to see this functionality in action)

  Note: I decided not to cache the data in client local storage due to the sensitivity of the data.

  ### Why does this Next.js app not handle the API itself?
  I decided to keep this separate from this Next.js web app for the following reasons:
  - code-ownership: supports dedicated API-focused team
  - dependency management - separate dependency structure makes it easier to reason about the dependencies which are related to the web app itself, vs only utilised for the back-end (such as`@fast-csv/parse`)
  - security: less security risk of things leaking into the client that aren't supposed to
  - stood the test of time

  However, I am open to changing my mind about this. There's a lot of investment and thought going into iterations of Next.js, and I am looking forward to seeing how it evolves. I am still learning about it.

### Running locally:
(prior to building, start the API)

1. Execute `npm install`
2. Execute `npm run build`
3. Execute `npm start`

Alternatively you can run a dev build via: `npm run dev`

# Next steps:
 - Implement robust validation for the CSV data
 - Make API error response more accessible to other consumers (send the error message back to requestor)
 - Research optimal localization library. Move all strings into localization
 - Add support for specifying clinic id via URL
 - Improve styling (for example, using icons for the table header sorting toggle)
 - Add favicon
 - GDPR consideration: Patient information is sensitive and so the API should be protected behind authentication and permissions per-clinic may be necessary to prevent access to unnecessary data. For example, the `/clinicsWithPatients` endpoint should only return to the user clinics that they have permission to view.

