# owl

## Running locally

To run this project, assuming you have [docker](https://www.docker.com/) installed, simply run `docker-compose up --build` from the root directory and the project should build and run.

In order to see the loading states, you'll probably need to tune the network throttling in chrome dev tools down to slow 3G. The whole app is quite small so it should still load fairly quickly.

The project should work in all modern browsers. I developed and tested with Chrome 84.

## Notes

The reordering logic isn't 100% optimal, it will fail in some scenarios especially with really long lists. However, I took the approach that I wouldn't over complicate things and from googling around this seemed to be a reasonable solution. Apparently JIRA uses something similar with string based ordering keys which can be appended to to support long lists. I decided given time constraints and scope, implementing anything more complex was overkill. An alternative approach would've been to just update every item in the list when one order changed, but this felt sub-optimal.

### Server side

On the server side, I tried to keep things quite simple with a basic REST API using an express.js server backed by a mongodb server. I ended up implementing an extra endpoint to do the re-ordering as this enabled me to keep things cleaner rather than having to check which fields changed in a PUT request.

By using MongoDB, I could make the logic to create a new list quite simple by just creating a new collection for each new list and reporting back to the client that this had occurred. I also added an index to the order property as this helps with performance.

### Client side

On the client side, I didn't want to spend too long setting up build tools and over-complicating things. I also wanted to demonstrate a knowledge of vanilla JS. Using a worker for the API is a little overcomplicated for such a simple app, but here I wanted to demonstrate an understanding of moving logic off the main UI thread and utilizing workers for background tasks.

I decided to use WebComponents again to cut down on build tools and overall bundle size. It felt over the top to have babel, webpack, react... for this project which drastically increase the bundle size. I was still able to build components, similar to react components so code structure is fairly similar to a react project.

I didn't implement anything like redux for managing state here as there's hardly any state and what little state there is can be cleanly managed in the HTML.

I didn't think it was in scope to implement minification or code splitting, especially on such a small app. This also ties back to minimal build tools setup. I also choose rollup for the build tool for this reason too, the config is much smaller than webpack for such a simple app.

## Next Steps

Taking the project further, it would've been nice to have more time to fix the known issues below along with implementing a service worker so the app works offline and then could sync to the server on re-connection.

## Known Issues

- Limited testing
- Delete doesn't confirm deletion
- Docker config isn't ideal, ideally interfaces should be deployed and pulled down from somewhere
