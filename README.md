This is the frontend of my flood monitoring/notification system project.
Currently, there are two aspects to this frontend: the live flood visualisation map,
and the notification subscription system where you can enter your email + postcode(s)
you wish to be notified for.

## Prerequisites

Node.js must be installed on your computer in order to run this application.
### Node.js quick start script for Linux/macOS

```bash 
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.18.0".
nvm current # Should print "v22.18.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

### Node.js quick start script for Windows

```powershell
# Download and install Chocolatey:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Node.js:
choco install nodejs --version="22.18.0"

# Verify the Node.js version:
node -v # Should print "v22.18.0".

# Verify npm version:
npm -v # Should print "10.9.3".

```

## Introduction

This is a next.js SPA which fetches flood data from the [UK Environmental Agency API](https://environment.data.gov.uk/flood-monitoring/doc/reference)
and visualises said data in a comprehensive flood map. It is important to note that this application only
covers `England` (unfortunately...). It does *not* cover `Scotland`, `Northern Ireland` or `Wales`.

This is something which is currently out of my control. I may look into means of extending this
service to these countries in the future, but as far as I know, currently there is no way
of reasonably doing this...my deepest apologies.

### Mapbox

While mapbox is a dependency listed in `package.json` and does not need to be installed independently of
this application, you do still need a mapbox account and a valid API key to view the rendered map.
There is a free tier which you can sign up for [here](https://account.mapbox.com/auth/signup/?page=/).


### Environment variables
The frontend will not work properly without the proper credentials/endpoints for
all the other parts of the stack, but you're welcome to fork and modify the map
itself to your heart's content.

To do so, create an `.env` file and fill out the required variables according to the
`.env_template`

Once you have your mapbox key, paste this as the value for the `MAPBOX_TOKEN` variable.
Remove the `_template` extension so you now have a `.env` file, and the application
should work upon installation.


### Installation and running


Once you have cloned/forked everything and installed all
dependencies with ```npm install```, just run:

```bash
npm run dev
```

and then open your browser to [http://localhost:3000](http://localhost:3000) to see the rendered frontend
on your local machine.

## API fetches

API fetches are taken care of in the following directory:

```bash
./app
├── services
│   ├── [flood-api-calls.tsx]
│   ├── flood-api-interfaces.tsx
│   ├── geo-json-bootstrap.ts
│   └── subscriber-api-calls.tsx

```

Current flood information, including the description, severity and the 
area the flood is encapsulated are all fetched here.

Monitoring station readings are also fetched from here.

Since this is a blocking process, the map is dynamically loaded using the map renderer,
located in the following directory:

```bash
./app
└── ui
    ├── map
    │   ├── map-interfaces.tsx
    │   ├── map-legend.tsx
    │   ├── [map-renderer.tsx]
    │   ├── map-skeleton.tsx
    │   └── map.tsx
```

## The Live Flood Map

The flood map is loaded from the main page of this frontend, but it can also be
accessed by clicking the `Live Map` link in the navigation bar at the top of the screen.

The map is made using the [react-map-gl](https://visgl.github.io/react-map-gl/), which
is an extension library which "reactifies" [Mapbox GL](https://www.mapbox.com/mapbox-gljs).
This library was chosen for its incredible versatility, customisation and extensibility.

Map markers represent the general location of the flood and, 
when clicked, show the user all relevant details for that selected flood.
Flood warnings/alerts range from:

- Severe warning
- Warning
- Alert
- No longer in force

and are represented with a deep red, a lighter red, yellow, and blue respectively.

The flood area is illustrated to the user once any given flood is zoomed in on.
These flood areas are represented as layers on the map. The colour of the layer reflects
the severity of the flood.

Monitoring stations are selectable symbols; symbols are similar to markers, 
but they are baked into the map's style properties.

Monitoring stations show the water level, or the flow rate for:

- Rivers
- Coastal Tides
- Rainwater
- Groundwater

and like markers, they yield more information when clicked.
Monitoring stations are hidden by default, and can be toggled using the map legend in
the top right. Flood warnings can also be toggled in this way.

## The Notifications System

In the background, there is a notification system which fetches current warnings
every 30 minutes and sends updates by email to anybody who lives within any
given flood area (so long as they are subscribed to the mailing list, naturally!)

This system is outside the scope of this repository, so the details won't be described here.
There is, however a `Notifications` link on the navigation bar which presents
the user with a form. 

This form takes the user's email address, and postcode(s)
to "listen" to. If any flood intersects with these postcodes, a notification
with the flood details and a link to the flood on the live map will be sent to the
user.

If you want to enter more than one postcode at a time, just separate the postcodes
with a comma, like this:
`A11 111, B22 222, C33 333`

You can enter postcodes with or without spaces, it doesn't matter.