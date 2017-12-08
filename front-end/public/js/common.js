// The Common module is designed as an auxiliary module
// to hold functions that are used in multiple other modules
/* eslint no-unused-vars: "off" */

var Common = (function() {
  // Publicly accessible methods defined
  return {
    buildDomElement: buildDomElementFromJson,
    fireEvent: fireEvent,
    listForEach: listForEach
  };

  // <start> modified existing code to no longer allow code injection.
  // code snippet from: https://stackoverflow.com/a/20855640/3118621
  function textFromHtmlString( arbitraryHtmlString ) {
    const temp = document.createElement('div');
    temp.innerHTML = arbitraryHtmlString;
    return temp.innerText;
  }
  // <end> modified existing code to no longer allow code injection.

  // Take in JSON object and build a DOM element out of it
  // (Limited in scope, cannot necessarily create arbitrary DOM elements)
  // JSON Example:
  //  {
  //    "tagName": "div",
  //    "text": "Hello World!",
  //    "className": ["aClass", "bClass"],
  //    "attributes": [{
  //      "name": "onclick",
  //      "value": "alert("Hi there!")"
  //    }],
  //    "children: [{other similarly structured JSON objects...}, {...}]
  //  }
  function buildDomElementFromJson(domJson) {
    // Create a DOM element with the given tag name
    var element = document.createElement(domJson.tagName);

    // Fill the "content" of the element
    if (domJson.text) {
      // <start> modified existing code to no longer allow code injection.
      element.innerHTML = textFromHtmlString(domJson.text);
      // <original> element.innerHTML = domJson.text;
      // <end> modified existing code to no longer allow code injection.
    } else if (domJson.html) {
      element.insertAdjacentHTML('beforeend', domJson.html);
    }

    // Add classes to the element
    if (domJson.classNames) {
      for (var i = 0; i < domJson.classNames.length; i++) {
        element.classList.add(domJson.classNames[i]);
      }
    }
    // Add attributes to the element
    if (domJson.attributes) {
      for (var j = 0; j < domJson.attributes.length; j++) {
        var currentAttribute = domJson.attributes[j];
        element.setAttribute(currentAttribute.name, currentAttribute.value);
      }
    }
    // Add children elements to the element
    if (domJson.children) {
      for (var k = 0; k < domJson.children.length; k++) {
        var currentChild = domJson.children[k];
        element.appendChild(buildDomElementFromJson(currentChild));
      }
    }
    return element;
  }

  // Trigger an event to fire
  function fireEvent(element, event) {
    var evt;
    if (document.createEventObject) {
      // dispatch for IE
      evt = document.createEventObject();
      return element.fireEvent('on' + event, evt);
    }
    // otherwise, dispatch for Firefox, Chrome + others
    evt = document.createEvent('HTMLEvents');
    evt.initEvent(event, true, true); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
  }

  // A function that runs a for each loop on a List, running the callback function for each one
  function listForEach(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback.call(null, list[i]);
    }
  }
}());
