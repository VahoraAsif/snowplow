function getData() {
    fetch('http://localhost:9090/micro/good').then(res => res.json()).then(data => {
        var eventData = [];
       
        for(let i=0; i<data.length; i++) {
            eventData.push({
                eventtype: data[i].eventType,
                time: data[i].event.etl_tstamp,
                timeZone: data[i].rawEvent.parameters.tz,
                pageUrl:data[i].rawEvent.parameters.url,
                

            }) 
        }
        console.log(eventData);
    });
}

getData();