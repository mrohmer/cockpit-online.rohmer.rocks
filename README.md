# [carrera-live.rohmer.rocks](https://carrera-live.rohmer.rocks/)

This is an alternative UI for [online.cockpit-xp.de](https://online.cockpit-xp.de/) approaching to be more modern & data saving than the original.

## Motivation

The original UI has many problems like an outdated tech stack, an old school styling but most importantly an absurdly high data consumption.
In my case with images of driver and car I measured up to 100mb per minute.
This is due to the fact that nearly everthing in it is based on images which are loaded in the original resolution & are loaded again every time the data is updated due to an actively set cache breaker on every image (!!!).

So as I was not willing to increase my already lush mobile data quota, I decided to quickly built this project.

## Improvements

- Modern & responsive UI approach
- Reduced data footprint
    - Images are compromised & loaded only once while on site
    - Visualization not based on images but simply HTML & CSS
    - Respects data saving mode
- Only Rerender changed UI elements
- Fast access to previously visited sessions
- Navigation between session and slot possible
- Dark Mode
- Keep screen on
- Optional vibration on gas below or above threshold

### Still to come


## Usage Disclaimer

This UI & the API is built for personal usage & heavily based on the data exposed by [online.cockpit-xp.de](https://online.cockpit-xp.de/).

I will try to keep everything up & running but in case of breaking changes to the original API this Project may be down for a while.

## Contribution

Feel free to use & fork this project as you like. In case your changes may be relevant or helpful for other users i'd like to encourage you to open a pr or simply get in touch with me.

In case of any problems feel free to open an issue & I will try to answer as quick as possible 😉

## Other Clients

There are 2 native clients available for watches using the api of this ui:

- Tizen / Samsung Watches: [repo](https://github.com/mrohmer/TizenCarreraLive)
- Garmin Watches: [repo](https://github.com/mrohmer/GarminCarreraLive)
