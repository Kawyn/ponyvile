var time = {
    hours: 8,
    minutes: 12,
}



// CLOCKWORK...
function Clock() {

    // Minutes..
    time.minutes++;
    

    // Hours...
    if(time.minutes >= 60)
    {

        time.minutes = 0;
        time.hours++;
    }
   
    setTimeout(function() {Clock(); console.log(time);}, 2000);
}