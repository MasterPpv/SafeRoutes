var status_menu = 0;
var alt_menu = 0;
function show_menu(sidebar, sidebar1){

    if(status_menu == 0) {
        sidebar1.style.left = "-300px";
        sidebar.style.left = "0px";
        sidebar.style.transition = "left 0.4s linear";
        status_menu = 1;
    }
    else 
    {
        sidebar.style.left = "-300px";
        sidebar.style.transition = "left 0.4s linear";
        status_menu = 0;
    }
} 
