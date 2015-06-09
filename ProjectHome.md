This is a simple node.js based image server.

It just makes it possible to browse images semi easily on a home server from Android.

requires [[node.js](http://nodejs.org/)]

To run:

cd to some folder, then type

```
  node <path_to_download>/server.js --port 8000
```

Now point a browser to http://ipaddress-of-your-server:8000/

You should get a folder listing. Click on folders until you come to a folder with images. Click on any image and you should get image, scaled to match the width of the display with floating buttons to go forward and back. Good for browsing with Android. Only tested on Android and Chrome so far.