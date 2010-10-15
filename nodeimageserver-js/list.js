/*
Copyright (c) 2010, Gregg Tavares
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

    * Neither the name of Gregg Tavares, nor the names of its
      contributors may be used to endorse or promote products derived from this
      software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

$(function(){
  var images = [];
  var pageURL = location.href;
  var slideShow;
  var currentIndex;
  var currentImgWidth;
  var currentImgHeight;
  var img;

  function extension(path) {
    var m = path.match(/\.[^\.]+$/);
    return m ? m[0] : "";
  }

  var isImage = function() {
    var imageTypes = {
      '.jpg': true,
      '.png': true,
      '.gif': true,
    };

    return function(path) {
      var ext = extension(path);
      return imageTypes[ext];
    }
  }();

  function hideSlideshow() {
    $("ul").show();
    $("#slideshow").hide();
    $("#ui").hide();
  }

  function showSlideshow() {
    $("ul").hide();
    $("#slideshow").show();
    $("#ui").show();
  }

  function gotoSlide(index) {
    showSlideshow();
    console.log("show image:" + images[index]);
    currentImageWidth = 0;
    $("img").attr({
      src: images[index],
      width: undefined,
      height: undefined,
    });
    currentIndex = index;
    $("#page").html("" + (index + 1) + " of " + images.length);
  }

  window.onpopstate = function(event) {
    if (event.state) {
      gotoSlide(event.state.index);
    } else {
      hideSlideshow();
    }
  }

  function resizeImage() {
    if (currentImageWidth) {
      img.width = Math.min(currentImageWidth, $(window).width());
    }
  }

  function onImgLoad() {
    console.log("img loaded");
    currentImageWidth = parseInt(img.width);
    currentImageHeight = parseInt(img.height);
    resizeImage();
  }

  $("body").append(
    '<style>' +
    '#body { width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px; }' +
    '#ui { z-index: 3; position: fixed; right: 20px; top: 20px; width: 80px;  }' +
    '#ui div { background-color: rgba(0,0,0,0.1); width: 80px; height: 80px; border: 1px solid rgba(0,0,0,1)k; text-align: center; margin-bottom: 30px; }' +
    '#ui span { background-color: rgba(0,0,0,0.1); width: 80px; }' + //rgba(0,0,0,0.1); width: 80px; height: 80px; border: 1px solid rgba(0,0,0,1)k; text-align: center; margin-bottom: 30px; }' +
    'ul { padding-left: 0; width:100%; font-family:sans-serif; font-size:15pt; list-style: none; }' +
    'ul li { }' +
    'ul li a { ' +
    '  display:block; ' +
    '  text-decoration:none; ' +
    '  color:#000000; ' +
    '  background-color:#FFFFFF; ' +
    '  line-height:3em; ' +
    '  border-bottom-style:solid; ' +
    '  border-bottom-width:1px; ' +
    '  border-bottom-color:#CCCCCC; ' +
    '  padding-left:10px; ' +
    '  cursor:pointer; ' +
    '}' +
    ' ul li a:hover { color:#FFFFFF; background-color: #666; background-image:url(../images/hover.png); background-repeat:repeat-x; }' +
    ' ul li a strong { margin-right:10px; }' +
    '</style>' +
    '<div id="slideshow"><div id="ui"><span id="page"></span><div id="forward">-&gt;</div><div id="backward">&lt;-</div></div><img /></div>');
  $("a").each(function(index) {
    if (isImage(this.href)) {
      var index = images.length;
      console.log("" + index + ": " + this.href);
      images.push(this.href.toString());
      $(this).click(function(index) {
        return function(event) {
          event.preventDefault();
          console.log("clicked: " + index);
          gotoSlide(index);
          if (history.pushState) {
            history.pushState({index: index}, "image: " + index, pageURL + "?index=" + index);
          }
          return false;
        };
      }(index));
    }
  });
  $("#backward").mouseup(function() {
    console.log("forward");
    --currentIndex;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    }
    gotoSlide(currentIndex);
  });
  $("#forward").mouseup(function() {
    console.log("backward");
    ++currentIndex;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    gotoSlide(currentIndex);
  });
  $(window).resize(function() {
    resizeImage();
  });


  hideSlideshow();

  img = document.getElementsByTagName("img")[0];
  img.onload = onImgLoad;
});

