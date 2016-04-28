var status_dir = 0;
function show_dir(sidebar){

    if(status_dir == 0) {
        sidebar.style.left = "0px";
        sidebar.style.transition = "left 0.6s linear";
        status_dir = 1;
    }
    else
    {
        sidebar.style.left = "-300px";
        sidebar.style.transition = "left 0.6s linear";
        status_dir = 0;
    }
}

var status_menu = 0;
function show_menu(sidebar){

    if(status_menu == 0) {
        sidebar.style.left = "0px";
        sidebar.style.transition = "left 0.6s linear";
        status_menu = 1;
    }
    else
    {
        sidebar.style.left = "-300px";
        sidebar.style.transition = "left 0.6s linear";
        status_menu = 0;
    }
}