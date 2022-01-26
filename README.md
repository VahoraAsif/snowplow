# snowplow
I have worked on project which allows to track events from website. 
First of all, I had a project on which I worked on during my traineeship. 
I setup snowplowmicro on my local system and I run server on http://port:9090 and track events with http://port:9090/micro.
I run this project on XAMPP server localhost and set collector point as post:9090
To track events, I copied the code which was on JS tracker documentation and add two events which was 'pageview' and 'click link'. Code for that can be found in "snowplow/libs/js/sp-custom.js".
When I load website, it return an object for a page view from which I extract 4 events which was eventType, time, pageurl and timezone". Code for those ebvents can be found in "snowplow/libs/js/fetchData.js".
Similarly, I have added "click link" event which can be seen when you click "countryInfo" button and after clicking that button; you will find "wikipedia link". So, click link event can be fired after click on wikipedia link. 
You can view all the details of events in console that is "inspect--> console"
